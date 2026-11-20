import { authorizeProjectRequest, isValidProjectId, projectObjectKey, pruneProjectVersions, PROJECT_MAX_BYTES } from '../../_lib/projects.js';
import { json } from '../../_lib/session.js';

export async function onRequestGet(context) {
  const auth = await authorizeProjectRequest(context);
  if (auth.response) return auth.response;
  const id = context.params.id;
  if (!isValidProjectId(id)) return json({ error: 'Identificador no válido.', code: 'invalid_project_id' }, 400);

  const object = await context.env.MANDARINITA_PROJECTS.get(projectObjectKey(id));
  if (!object) return json({ error: 'No se encontró el proyecto.' }, 404);
  return new Response(object.body, { headers: {
    'Content-Type': 'application/vnd.mandarinita+json',
    'Cache-Control': 'no-store',
    ETag: object.httpEtag
  } });
}

export async function onRequestPut(context) {
  const auth = await authorizeProjectRequest(context, true);
  if (auth.response) return auth.response;
  const { request, env } = context;
  const id = context.params.id;
  if (!isValidProjectId(id)) return json({ error: 'Identificador no válido.', code: 'invalid_project_id' }, 400);

  const contentLength = Number(request.headers.get('Content-Length') || 0);
  if (contentLength > PROJECT_MAX_BYTES) return json({ error: 'El proyecto supera el límite de 25 MB.' }, 413);
  const bytes = await request.arrayBuffer();
  if (bytes.byteLength > PROJECT_MAX_BYTES) return json({ error: 'El proyecto supera el límite de 25 MB.' }, 413);

  let project;
  try { project = JSON.parse(new TextDecoder().decode(bytes)); }
  catch { return json({ error: 'El archivo del proyecto no contiene JSON válido.', code: 'invalid_project_json' }, 400); }
  if (!project || project.projectId !== id || !Array.isArray(project.panels)) {
    return json({ error: 'El proyecto no coincide con el identificador solicitado.', code: 'project_id_mismatch' }, 400);
  }

  const updatedAt = Number(project.updatedAt) || Date.now();
  const ifMatch = request.headers.get('If-Match');
  const ifNoneMatch = request.headers.get('If-None-Match');
  if ((ifMatch && ifNoneMatch) || (!ifMatch && ifNoneMatch !== '*')) {
    return json({ error: 'Falta la versión esperada del proyecto. Vuelve a sincronizar antes de guardar.', code: 'precondition_required' }, 428);
  }

  // Keep a sparse, recoverable history in the same private R2 bucket. Snapshot
  // only when content changed and at most once every five minutes.
  const key = projectObjectKey(id);
  const previous = await env.MANDARINITA_PROJECTS.get(key);
  let snapshotKey = null;
  if (previous) {
    if (ifMatch && previous.httpEtag !== ifMatch) {
      return json({ error: 'Este proyecto cambió en otro dispositivo. Vuelve a sincronizar antes de guardar.', code: 'version_conflict' }, 412);
    }
    const previousText = await previous.text();
    const nextText = JSON.stringify(project);
    if (previousText !== nextText) {
      const list = await env.MANDARINITA_PROJECTS.list({ prefix: `users/mauricio/project-versions/${id}/`, limit: 1000, include: ['customMetadata'] });
      const latestAt = Math.max(0, ...(list.objects || []).map(object => Number(object.customMetadata?.snapshotAt) || 0));
      if (Date.now() - latestAt >= 5 * 60 * 1000) {
        const versionId = crypto.randomUUID();
        snapshotKey = `users/mauricio/project-versions/${id}/${versionId}.mandarinita`;
        let previousProject = {};
        try { previousProject = JSON.parse(previousText); } catch { /* Keep the snapshot even if legacy metadata is incomplete. */ }
        await env.MANDARINITA_PROJECTS.put(snapshotKey, previousText, {
          httpMetadata: { contentType: 'application/vnd.mandarinita+json; charset=utf-8' },
          customMetadata: { versionId, projectId: id, title: String(previousProject.title || previous.customMetadata?.title || 'Episodio sin título').slice(0, 180), updatedAt: String(Number(previousProject.updatedAt) || Number(previous.customMetadata?.updatedAt) || 0), snapshotAt: String(Date.now()), sourceEtag: previous.httpEtag }
        });
      }
    }
  }

  const saved = await env.MANDARINITA_PROJECTS.put(key, JSON.stringify(project), {
    onlyIf: request.headers,
    httpMetadata: { contentType: 'application/vnd.mandarinita+json; charset=utf-8' },
    customMetadata: {
      title: String(project.title || 'Episodio sin título').slice(0, 180),
      contentType: String(project.contentType || 'episode').slice(0, 40),
      status: String(project.status || 'draft').slice(0, 40),
      createdAt: String(Number(project.createdAt) || updatedAt),
      panels: String(Array.isArray(project.panels) ? project.panels.length : 0),
      updatedAt: String(updatedAt)
    }
  });
  if (!saved) {
    if (snapshotKey) await env.MANDARINITA_PROJECTS.delete(snapshotKey);
    return json({ error: 'Este proyecto cambió en otro dispositivo. Tu copia local se conservó; compara las dos versiones antes de continuar.', code: 'version_conflict' }, 412);
  }
  if (snapshotKey) await pruneProjectVersions(env, id);
  return json({ ok: true, id, title: String(project.title || 'Episodio sin título'), updatedAt, etag: saved.httpEtag }, 200, { ETag: saved.httpEtag });
}

export async function onRequestDelete(context) {
  const auth = await authorizeProjectRequest(context, true);
  if (auth.response) return auth.response;
  const id = context.params.id;
  if (!isValidProjectId(id)) return json({ error: 'Identificador no válido.', code: 'invalid_project_id' }, 400);

  await context.env.MANDARINITA_PROJECTS.delete(projectObjectKey(id));
  return json({ ok: true, id });
}
