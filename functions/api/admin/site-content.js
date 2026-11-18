import { isConfigured, json, readSession } from '../../_lib/session.js';

const MAX_LENGTHS = {
  'hero.eyebrow': 100,
  'hero.title.first': 80,
  'hero.title.second': 80,
  'hero.description': 420,
  'hero.cta': 70,
  'hero.image': 300,
  'hero.effect': 20,
  'hero.image.alt': 300
};
const IMAGE_PATH = /^(?:assets\/[A-Za-z0-9._/-]+\.(?:png|webp|jpe?g)|\/api\/site-content\/image\/site-content\/hero\/[0-9a-f-]{36}\.(?:png|webp|jpg))$/i;
const CONTROL_CHARACTERS = /[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/;

async function authorize({ request, env }, write = false) {
  if (!isConfigured(env)) return { response: json({ error: 'La administración privada no está configurada.' }, 503) };
  const session = await readSession(request, env.SESSION_SECRET);
  if (!session || session.email !== env.MANDARINITA_SYNC_EMAIL.trim().toLowerCase()) {
    return { response: json({ error: 'Inicia sesión con tu cuenta autorizada de GitHub.' }, 401) };
  }
  if (write && request.headers.get('Origin') !== new URL(request.url).origin) {
    return { response: json({ error: 'Origen no permitido.' }, 403) };
  }
  if (!env.MANDARINITA_INBOX) return { response: json({ error: 'La base de contenido no está conectada en este entorno.' }, 503) };
  return { db: env.MANDARINITA_INBOX, session };
}

export async function onRequestGet(context) {
  const auth = await authorize(context);
  if (auth.response) return auth.response;
  const result = await auth.db.prepare(
    'SELECT content_key, es, en, updated_at FROM site_content ORDER BY content_key'
  ).all();
  const content = {};
  let updatedAt = '';
  for (const row of result.results || []) {
    if (Object.hasOwn(MAX_LENGTHS, row.content_key)) {
      content[row.content_key] = { es: row.es, en: row.en, updatedAt: row.updated_at };
      if (row.updated_at > updatedAt) updatedAt = row.updated_at;
    }
  }
  return json({ content, updatedAt: updatedAt || null });
}

export async function onRequestPut(context) {
  const auth = await authorize(context, true);
  if (auth.response) return auth.response;
  let body;
  try { body = await context.request.json(); } catch { return json({ error: 'No pudimos leer los cambios.' }, 400); }
  if (!body || typeof body.content !== 'object' || Array.isArray(body.content)) {
    return json({ error: 'Los textos no tienen el formato esperado.' }, 400);
  }

  const keys = Object.keys(MAX_LENGTHS);
  const received = Object.keys(body.content);
  if (received.length !== keys.length || received.some(key => !Object.hasOwn(MAX_LENGTHS, key))) {
    return json({ error: 'Faltan textos o recibimos campos no permitidos. Recarga la página e inténtalo otra vez.' }, 400);
  }
  const normalized = {};
  for (const key of keys) {
    const value = body.content[key];
    if (!value || typeof value.es !== 'string' || typeof value.en !== 'string') {
      return json({ error: 'Completa las versiones en español e inglés de cada texto.' }, 400);
    }
    const es = value.es.trim();
    const en = value.en.trim();
    if (!es || !en || es.length > MAX_LENGTHS[key] || en.length > MAX_LENGTHS[key] || CONTROL_CHARACTERS.test(es) || CONTROL_CHARACTERS.test(en)) {
      return json({ error: `Revisa los textos de “${key}”: no pueden estar vacíos ni superar ${MAX_LENGTHS[key]} caracteres.` }, 400);
    }
    if (key === 'hero.image' && (es !== en || !IMAGE_PATH.test(es) || es.split('/').includes('..'))) {
      return json({ error: 'Sube una imagen válida para la portada antes de guardar.' }, 400);
    }
    if (key === 'hero.effect' && (es !== en || !['orbit', 'still'].includes(es))) {
      return json({ error: 'Elige uno de los movimientos disponibles para la portada.' }, 400);
    }
    normalized[key] = { es, en };
  }

  const now = new Date().toISOString();
  const statements = keys.map(key => auth.db.prepare(`
    INSERT INTO site_content (content_key, es, en, updated_at, updated_by)
    VALUES (?, ?, ?, ?, ?)
    ON CONFLICT(content_key) DO UPDATE SET
      es = excluded.es,
      en = excluded.en,
      updated_at = excluded.updated_at,
      updated_by = excluded.updated_by
  `).bind(key, normalized[key].es, normalized[key].en, now, auth.session.login));
  await auth.db.batch(statements);
  return json({ ok: true, updatedAt: now, content: normalized });
}
