import { isConfigured, json } from '../_lib/session.js';

const MAX_BODY_BYTES = 12000;
const MAX_PER_HOUR = 5;
const WINDOW_MS = 60 * 60 * 1000;
const text = value => typeof value === 'string' ? value.trim() : '';

async function rateLimitKey(ip, secret) {
  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey('raw', encoder.encode(secret), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']);
  const signature = new Uint8Array(await crypto.subtle.sign('HMAC', key, encoder.encode(ip)));
  return [...signature].map(byte => byte.toString(16).padStart(2, '0')).join('');
}

export async function onRequestPost({ request, env }) {
  if (request.headers.get('Origin') !== new URL(request.url).origin) return json({ error: 'Origen no permitido.' }, 403);
  if (!isConfigured(env)) return json({ error: 'El formulario no está configurado en este entorno.' }, 503);
  if (!env.MANDARINITA_INBOX) return json({ error: 'El buzón de prueba todavía no está conectado.' }, 503);
  const contentLength = Number(request.headers.get('Content-Length') || 0);
  if (contentLength > MAX_BODY_BYTES) return json({ error: 'El mensaje es demasiado largo.' }, 413);
  let body;
  let rawBody;
  try { rawBody = await request.text(); if (new TextEncoder().encode(rawBody).byteLength > MAX_BODY_BYTES) return json({ error: 'El mensaje es demasiado largo.' }, 413); body = JSON.parse(rawBody); } catch { return json({ error: 'No pudimos leer el formulario.' }, 400); }
  if (!body || typeof body !== 'object' || Array.isArray(body)) return json({ error: 'El formulario no tiene el formato esperado.' }, 400);
  if (text(body.website)) return json({ ok: true }, 202);
  const elapsed = Number(body.startedAt) ? Date.now() - Number(body.startedAt) : 0;
  if (elapsed < 1800) return json({ error: 'Espera un momento y vuelve a enviar el formulario.' }, 400);
  const name = text(body.name);
  const email = text(body.email).toLowerCase();
  const project = text(body.project);
  const message = text(body.message);
  if (name.length < 2 || name.length > 100) return json({ error: 'Escribe tu nombre (2 a 100 caracteres).' }, 400);
  if (email.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return json({ error: 'Revisa el correo para poder responderte.' }, 400);
  if (project.length > 160) return json({ error: 'El nombre del proyecto supera el límite.' }, 400);
  if (message.length < 20 || message.length > 3000) return json({ error: 'Cuéntanos un poco más (20 a 3000 caracteres).' }, 400);
  if (!body.consent) return json({ error: 'Necesitamos tu autorización para usar estos datos y responder la consulta.' }, 400);

  const ip = request.headers.get('CF-Connecting-IP') || 'unknown';
  const ipHash = await rateLimitKey(ip, env.SESSION_SECRET || 'preview-inbox');
  const windowStart = Math.floor(Date.now() / WINDOW_MS) * WINDOW_MS;
  const rate = await env.MANDARINITA_INBOX.prepare(`
    INSERT INTO inquiry_rate_limits (ip_hash, window_start, count) VALUES (?, ?, 1)
    ON CONFLICT(ip_hash, window_start) DO UPDATE SET count = count + 1
    RETURNING count
  `).bind(ipHash, windowStart).first();
  if (Number(rate?.count) > MAX_PER_HOUR) return json({ error: 'Ya recibimos varias consultas desde esta conexión. Inténtalo más tarde.' }, 429);

  const now = new Date().toISOString();
  const id = crypto.randomUUID();
  await env.MANDARINITA_INBOX.prepare(`
    INSERT INTO inquiries (id, name, email, project, message, status, created_at, updated_at, source)
    VALUES (?, ?, ?, ?, ?, 'new', ?, ?, 'preview')
  `).bind(id, name, email, project, message, now, now).run();
  return json({ ok: true, id }, 201);
}
