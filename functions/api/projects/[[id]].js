import { isConfigured, json, readSession } from '../../_lib/session.js';

const PREFIX = 'users/mauricio/projects/';
const MAX_BYTES = 25 * 1024 * 1024;
const ID_PATTERN = /^[a-zA-Z0-9_-]{1,100}$/;

function projectKey(id) {
  return `${PREFIX}${id}.mandarinita`;
}

function validId(id) {
  return typeof id === 'string' && ID_PATTERN.test(id);
}

async function authorize(context, write = false) {
  const { request, env } = context;
  if (!isConfigured(env)) return { response: json({ error: 'La sincronización no está configurada.' }, 503) };
  const session = await readSession(request, env.SESSION_SECRET);
  if (!session || session.email !== env.MANDARINITA_SYNC_EMAIL.trim().toLowerCase()) return { response: json({ error: 'Inicia sesión con tu cuenta de GitHub.' }, 401) };
  if (write && request.headers.get('Origin') !== new URL(request.url).origin) return { response: json({ error: 'Origen no permitido.' }, 403) };
  return { session };
}

export async function onRequestGet(context) {
  const auth = await authorize(context);
  if (auth.response) return auth.response;
  const id = context.params.id;
  if (id) {
    if (!validId(id)) return json({ error: 'Identificador no válido.', code: 'invalid_project_id' }, 400);
    const object = await context.env.MANDARINITA_PROJECTS.get(projectKey(id));
    if (!object) return json({ error: 'No se encontró el proyecto.' }, 404);
    return new Response(object.body, { headers: { 'Content-Type': 'application/vnd.mandarinita+json', 'Cache-Control': 'no-store', ETag: object.httpEtag } });
  }

  const projects = [];
  let cursor;
  do {
    const page = await context.env.MANDARINITA_PROJECTS.list({ prefix: PREFIX, cursor, limit: 1000 });
    for (const item of page.objects) {
      const idFromKey = item.key.slice(PREFIX.length).replace(/\.mandarinita$/, '');
      if (!validId(idFromKey)) continue;
      projects.push({
        id: idFromKey,
        title: item.customMetadata?.title || 'Episodio sin título',
        updatedAt: Number(item.customMetadata?.updatedAt) || item.uploaded.getTime(),
        bytes: item.size,
        etag: item.httpEtag
      });
    }
    cursor = page.truncated ? page.cursor : undefined;
  } while (cursor);
  projects.sort((a, b) => b.updatedAt - a.updatedAt);
  return json({ projects });
}

export async function onRequestPut(context) {
  const auth = await authorize(context, true);
  if (auth.response) return auth.response;
  const { request, env } = context;
  const id = context.params.id;
  if (!validId(id)) return json({ error: 'Identificador no válido.', code: 'invalid_project_id' }, 400);
  const contentLength = Number(request.headers.get('Content-Length') || 0);
  if (contentLength > MAX_BYTES) return json({ error: 'El proyecto supera el límite de 25 MB.' }, 413);
  const bytes = await request.arrayBuffer();
  if (bytes.byteLength > MAX_BYTES) return json({ error: 'El proyecto supera el límite de 25 MB.' }, 413);
  let project;
  try { project = JSON.parse(new TextDecoder().decode(bytes)); }
  catch { return json({ error: 'El archivo del proyecto no contiene JSON válido.', code: 'invalid_project_json' }, 400); }
  if (!project || project.projectId !== id || !Array.isArray(project.panels)) return json({ error: 'El proyecto no coincide con el identificador solicitado.', code: 'project_id_mismatch' }, 400);
  const updatedAt = Number(project.updatedAt) || Date.now();
  const ifMatch = request.headers.get('If-Match');
  const ifNoneMatch = request.headers.get('If-None-Match');
  if ((ifMatch && ifNoneMatch) || (!ifMatch && ifNoneMatch !== '*')) {
    return json({ error: 'Falta la versión esperada del proyecto. Vuelve a sincronizar antes de guardar.', code: 'precondition_required' }, 428);
  }
  const saved = await env.MANDARINITA_PROJECTS.put(projectKey(id), JSON.stringify(project), {
    onlyIf: request.headers,
    httpMetadata: { contentType: 'application/vnd.mandarinita+json; charset=utf-8' },
    customMetadata: { title: String(project.title || 'Episodio sin título').slice(0, 180), updatedAt: String(updatedAt) }
  });
  if (!saved) return json({ error: 'Este proyecto cambió en otro dispositivo. Tu copia local se conservó; compara las dos versiones antes de continuar.', code: 'version_conflict' }, 412);
  return json({ ok: true, id, title: String(project.title || 'Episodio sin título'), updatedAt, etag: saved.httpEtag }, 200, { ETag: saved.httpEtag });
}

export async function onRequestDelete(context) {
  const auth = await authorize(context, true);
  if (auth.response) return auth.response;
  const id = context.params.id;
  if (!validId(id)) return json({ error: 'Identificador no válido.', code: 'invalid_project_id' }, 400);
  await context.env.MANDARINITA_PROJECTS.delete(projectKey(id));
  return json({ ok: true, id });
}
