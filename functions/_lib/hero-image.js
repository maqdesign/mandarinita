import { json } from './session.js';

const FILENAME_PATTERN = /^[0-9a-f-]{36}\.(?:png|webp|jpg)$/i;
const CONTENT_TYPES = new Map([['png', 'image/png'], ['webp', 'image/webp'], ['jpg', 'image/jpeg']]);

export async function serveHeroImage(filename, env) {
  if (typeof filename !== 'string' || !FILENAME_PATTERN.test(filename)) return json({ error: 'Imagen no encontrada.' }, 404);
  if (!env.MANDARINITA_PROJECTS) return json({ error: 'Almacenamiento no disponible.' }, 404);
  const key = `site-content/hero/${filename}`;
  const object = await env.MANDARINITA_PROJECTS.get(key);
  if (!object) return json({ error: 'Imagen no encontrada.' }, 404);
  const extension = filename.slice(filename.lastIndexOf('.') + 1).toLowerCase();
  const headers = new Headers({
    'Content-Type': CONTENT_TYPES.get(extension),
    'Cache-Control': 'public, max-age=31536000, immutable',
    'X-Content-Type-Options': 'nosniff',
    'Cross-Origin-Resource-Policy': 'same-origin'
  });
  object.writeHttpMetadata(headers);
  return new Response(object.body, { headers });
}
