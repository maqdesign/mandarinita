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
  const current = await env.MANDARINITA_PROJECTS.get(currentKey);
  if (!current) return json({ error: 'No se encontró el proyecto.' }, 404);
  if (current.httpEtag !== expectedEtag) return json({ error: 'El borrador cambió desde que abriste el historial. Actualiza el historial y revisa la versión actual antes de restaurar.', code: 'version_conflict' }, 412);
  const versionKey = `users/mauricio/project-versions/${id}/${versionId}.mandarinita`;
  const archived = await env.MANDARINITA_PROJECTS.get(versionKey);
  if (!archived) return json({ error: 'Esta versión ya no está disponible.' }, 404);
  let project;
  try { project = JSON.parse(await archived.text()); } catch { return json({ error: 'La versión guardada está dañada.' }, 422); }
  if (!project || project.projectId !== id || !Array.isArray(project.panels)) return json({ error: 'La versión no pertenece a este proyecto.' }, 422);

  const now = Date.now();
  const backupId = crypto.randomUUID();
  await env.MANDARINITA_PROJECTS.put(`users/mauricio/project-versions/${id}/${backupId}.mandarinita`, await current.text(), {
    httpMetadata: { contentType: 'application/vnd.mandarinita+json; charset=utf-8' },
    customMetadata: { versionId: backupId, projectId: id, title: String(current.customMetadata?.title || 'Versión anterior').slice(0, 180), updatedAt: String(Number(current.customMetadata?.updatedAt) || 0), snapshotAt: String(now), sourceEtag: current.httpEtag }
  });
  project.updatedAt = now;
  const saved = await env.MANDARINITA_PROJECTS.put(currentKey, JSON.stringify(project), {
    onlyIf: { etagMatches: expectedEtag },
    httpMetadata: { contentType: 'application/vnd.mandarinita+json; charset=utf-8' },
    customMetadata: {
      title: String(project.title || 'Episodio sin título').slice(0, 180), contentType: String(project.contentType || 'episode').slice(0, 40),
      status: String(project.status || 'draft').slice(0, 40), createdAt: String(Number(project.createdAt) || now),
      panels: String(project.panels.length), updatedAt: String(now)
    }
  });
  if (!saved) return json({ error: 'El proyecto cambió mientras se restauraba. No se reemplazó la versión actual.', code: 'version_conflict' }, 412);
  await pruneProjectVersions(env, id);
  return json({ ok: true, id, title: project.title || 'Episodio sin título', updatedAt: now, etag: saved.httpEtag }, 200, { ETag: saved.httpEtag });
}
