import { isConfigured, json, readSession } from '../../_lib/session.js';

const STATUSES = new Set(['new', 'reviewing', 'replied', 'archived']);

async function authorize({ request, env }, write = false) {
  if (!isConfigured(env)) return { response: json({ error: 'La administración privada no está configurada.' }, 503) };
  const session = await readSession(request, env.SESSION_SECRET);
  if (!session || session.email !== env.MANDARINITA_SYNC_EMAIL.trim().toLowerCase()) return { response: json({ error: 'Inicia sesión con tu cuenta autorizada de GitHub.' }, 401) };
  if (write && request.headers.get('Origin') !== new URL(request.url).origin) return { response: json({ error: 'Origen no permitido.' }, 403) };
  if (!env.MANDARINITA_INBOX) return { response: json({ error: 'El buzón todavía no está conectado en este entorno.' }, 503) };
  return { db: env.MANDARINITA_INBOX };
}

export async function onRequestGet(context) {
  const auth = await authorize(context);
  if (auth.response) return auth.response;
  const limit = Math.max(1, Math.min(100, Number(new URL(context.request.url).searchParams.get('limit')) || 50));
  const result = await auth.db.prepare(`SELECT id, name, email, project, message, status, created_at, updated_at FROM inquiries ORDER BY created_at DESC LIMIT ?`).bind(limit).all();
  return json({ inquiries: result.results || [] });
}

export async function onRequestPatch(context) {
  const auth = await authorize(context, true);
  if (auth.response) return auth.response;
  let body;
  try { body = await context.request.json(); } catch { return json({ error: 'Solicitud no válida.' }, 400); }
  if (typeof body.id !== 'string' || body.id.length > 80 || !STATUSES.has(body.status)) return json({ error: 'Estado o identificador no válido.' }, 400);
  const result = await auth.db.prepare('UPDATE inquiries SET status = ?, updated_at = ? WHERE id = ?').bind(body.status, new Date().toISOString(), body.id).run();
  if (!result.meta?.changes) return json({ error: 'No encontramos esa consulta.' }, 404);
  return json({ ok: true, id: body.id, status: body.status });
}
