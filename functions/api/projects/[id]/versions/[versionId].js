import { authorizeProjectRequest, isValidProjectId, projectObjectKey, pruneProjectVersions } from '../../../../_lib/projects.js';
import { json } from '../../../../_lib/session.js';

export async function onRequestPost(context) {
  const auth = await authorizeProjectRequest(context, true);
  if (auth.response) return auth.response;
  const { request, env } = context;
  const { id, versionId } = context.params;
  if (!isValidProjectId(id) || !/^[0-9a-f-]{36}$/i.test(versionId || '')) return json({ error: 'Identificador de versión no válido.' }, 400);
  const expectedEtag = request.headers.get('If-Match');
  if (!expectedEtag) return json({ error: 'Actualiza la lista antes de restaurar la versión.' }, 428);
  const currentKey = projectObjectKey(id);
  let current;
  try { current = await env.MANDARINITA_PROJECTS.get(currentKey); }
  catch (error) {
    console.error('Project version restore could not read current project', { name: error?.name || 'Error', projectId: id });
    return json({ error: 'No se pudo leer la versión actual del borrador. No se hizo ningún cambio.' }, 503);
  }
  if (!current) return json({ error: 'No se encontró el proyecto.' }, 404);
  if (current.httpEtag !== expectedEtag) return json({ error: 'El borrador cambió desde que abriste el historial. Actualiza el historial y revisa la versión actual antes de restaurar.', code: 'version_conflict' }, 412);
  const versionKey = `users/mauricio/project-versions/${id}/${versionId}.mandarinita`;
  let archived;
  try { archived = await env.MANDARINITA_PROJECTS.get(versionKey); }
  catch (error) {
    console.error('Project version restore could not read snapshot', { name: error?.name || 'Error', projectId: id, versionId });
    return json({ error: 'No se pudo leer la copia histórica. La versión actual sigue intacta.' }, 503);
  }
  if (!archived) return json({ error: 'Esta versión ya no está disponible.' }, 404);
  let project;
  let archivedText;
  try { archivedText = await archived.text(); }
  catch (error) {
    console.error('Project version restore could not read snapshot body', { name: error?.name || 'Error', projectId: id, versionId });
    return json({ error: 'No se pudo leer el contenido de la copia histórica. La versión actual sigue intacta.' }, 503);
  }
  try { project = JSON.parse(archivedText); }
  catch { return json({ error: 'La copia histórica está dañada. La versión actual sigue intacta.' }, 422); }
  if (!project || project.projectId !== id || !Array.isArray(project.panels)) return json({ error: 'La versión no pertenece a este proyecto.' }, 422);

  const now = Date.now();
  const backupId = crypto.randomUUID();
  try {
    await env.MANDARINITA_PROJECTS.put(`users/mauricio/project-versions/${id}/${backupId}.mandarinita`, await current.text(), {
      httpMetadata: { contentType: 'application/vnd.mandarinita+json; charset=utf-8' },
      customMetadata: { versionId: backupId, projectId: id, title: String(current.customMetadata?.title || 'Versión anterior').slice(0, 180), updatedAt: String(Number(current.customMetadata?.updatedAt) || 0), snapshotAt: String(now), sourceEtag: current.httpEtag }
    });
  } catch (error) {
    console.error('Project version restore could not preserve current project', { name: error?.name || 'Error', projectId: id, versionId });
    return json({ error: 'No se pudo crear una copia de seguridad previa. La versión actual sigue intacta; vuelve a intentarlo.' }, 503);
  }
  project.updatedAt = now;
  let saved;
  try {
    saved = await env.MANDARINITA_PROJECTS.put(currentKey, JSON.stringify(project), {
      // Use the incoming conditional headers exactly as the regular project
      // save endpoint does; R2 evaluates If-Match atomically on the write.
      onlyIf: request.headers,
      httpMetadata: { contentType: 'application/vnd.mandarinita+json; charset=utf-8' },
      customMetadata: {
        title: String(project.title || 'Episodio sin título').slice(0, 180), contentType: String(project.contentType || 'episode').slice(0, 40),
        status: String(project.status || 'draft').slice(0, 40), createdAt: String(Number(project.createdAt) || now),
        panels: String(project.panels.length), updatedAt: String(now)
      }
    });
  } catch (error) {
    console.error('Project version restore could not write restored project', { name: error?.name || 'Error', message: error?.message || '', projectId: id, versionId });
    return json({ error: 'No se pudo aplicar la copia histórica. La versión actual no se reemplazó; vuelve a intentarlo.' }, 503);
  }
  if (!saved) return json({ error: 'El proyecto cambió mientras se restauraba. No se reemplazó la versión actual.', code: 'version_conflict' }, 412);
  try { await pruneProjectVersions(env, id); }
  catch (error) { console.error('Project restored but old snapshots could not be pruned', { name: error?.name || 'Error', projectId: id }); }
  return json({ ok: true, id, title: project.title || 'Episodio sin título', updatedAt: now, etag: saved.httpEtag }, 200, { ETag: saved.httpEtag });
}
