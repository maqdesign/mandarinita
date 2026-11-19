import { json } from '../../../_lib/session.js';

const FILENAME_PATTERN = /^[0-9a-f-]{36}\.(?:png|webp|jpg)$/i;
const LEGACY_KEY_PATTERN = /^site-content\/hero\/[0-9a-f-]{36}\.(?:png|webp|jpg)$/i;
const CONTENT_TYPES = new Map([['png', 'image/png'], ['webp', 'image/webp'], ['jpg', 'image/jpeg']]);

export async function onRequestGet({ params, env }) {
  const suppliedKey = params.key;
  const key = typeof suppliedKey === 'string' && FILENAME_PATTERN.test(suppliedKey)
    ? `site-content/hero/${suppliedKey}`
    : typeof suppliedKey === 'string' && LEGACY_KEY_PATTERN.test(suppliedKey)
      ? suppliedKey
      : null;
  if (!key) return json({ error: 'Imagen no encontrada.' }, 404);
  if (!env.MANDARINITA_PROJECTS) return json({ error: 'Almacenamiento no disponible.' }, 404);
  const object = await env.MANDARINITA_PROJECTS.get(key);
  if (!object) return json({ error: 'Imagen no encontrada.' }, 404);
  const extension = key.slice(key.lastIndexOf('.') + 1).toLowerCase();
  const headers = new Headers({
    'Content-Type': CONTENT_TYPES.get(extension),
    'Cache-Control': 'public, max-age=31536000, immutable',
    'X-Content-Type-Options': 'nosniff',
    'Cross-Origin-Resource-Policy': 'same-origin'
  });
  object.writeHttpMetadata(headers);
  return new Response(object.body, { headers });
}
