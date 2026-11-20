import { isAllowedEmail, isConfigured, json, readSession } from './session.js';

export const PROJECT_PREFIX = 'users/mauricio/projects/';
export const PROJECT_MAX_BYTES = 25 * 1024 * 1024;
const PROJECT_ID_PATTERN = /^[a-zA-Z0-9_-]{1,100}$/;

export function isValidProjectId(id) {
  return typeof id === 'string' && PROJECT_ID_PATTERN.test(id);
}

export function projectObjectKey(id) {
  return `${PROJECT_PREFIX}${id}.mandarinita`;
}

export async function pruneProjectVersions(env, id, keep = 30) {
  const prefix = `users/mauricio/project-versions/${id}/`;
  const listed = await env.MANDARINITA_PROJECTS.list({ prefix, limit: 1000, include: ['customMetadata'] });
  const sorted = (listed.objects || []).sort((a, b) =>
    (Number(b.customMetadata?.snapshotAt) || b.uploaded?.getTime?.() || 0) -
    (Number(a.customMetadata?.snapshotAt) || a.uploaded?.getTime?.() || 0)
  );
  for (const object of sorted.slice(Math.max(0, keep))) await env.MANDARINITA_PROJECTS.delete(object.key);
}

export async function authorizeProjectRequest(context, write = false) {
  const { request, env } = context;
  if (!isConfigured(env)) return { response: json({ error: 'La sincronización no está configurada.' }, 503) };
  const session = await readSession(request, env.SESSION_SECRET);
  if (!isAllowedEmail(env, session?.email)) return { response: json({ error: 'Inicia sesión con una cuenta autorizada de GitHub.' }, 401) };
  if (write && request.headers.get('Origin') !== new URL(request.url).origin) return { response: json({ error: 'Origen no permitido.' }, 403) };
  return { session };
}
