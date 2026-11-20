import { authorizeProjectRequest, isValidProjectId, projectObjectKey } from '../../../_lib/projects.js';
import { json } from '../../../_lib/session.js';

export async function onRequestGet(context) {
  const auth = await authorizeProjectRequest(context);
  if (auth.response) return auth.response;
  const { env } = context;
  const id = context.params.id;
  if (!isValidProjectId(id)) return json({ error: 'Identificador no válido.' }, 400);
  const current = await env.MANDARINITA_PROJECTS.head(projectObjectKey(id));
  if (!current) return json({ error: 'No se encontró el proyecto.' }, 404);
  const result = await env.MANDARINITA_PROJECTS.list({ prefix: `users/mauricio/project-versions/${id}/`, limit: 1000, include: ['customMetadata'] });
  const versions = (result.objects || []).map(object => ({
    id: object.customMetadata?.versionId || object.key.split('/').pop().replace(/\.mandarinita$/, ''),
    title: object.customMetadata?.title || 'Versión anterior',
    updatedAt: Number(object.customMetadata?.updatedAt) || 0,
    snapshotAt: Number(object.customMetadata?.snapshotAt) || object.uploaded?.getTime?.() || 0,
    size: object.size || 0
  })).sort((a, b) => b.snapshotAt - a.snapshotAt).slice(0, 30);
  return json({ id, etag: current.httpEtag, versions });
}
