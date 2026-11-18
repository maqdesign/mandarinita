import { isConfigured, json, readSession } from '../../../_lib/session.js';

const MAX_IMAGE_BYTES = 8 * 1024 * 1024;
const TYPES = new Map([
  ['image/png', 'png'],
  ['image/webp', 'webp'],
  ['image/jpeg', 'jpg']
]);

function hasMatchingSignature(buffer, contentType) {
  const bytes = new Uint8Array(buffer);
  if (contentType === 'image/png') return bytes.length >= 8 && [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a].every((byte, index) => bytes[index] === byte);
  if (contentType === 'image/jpeg') return bytes.length >= 3 && bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff;
  if (contentType === 'image/webp') return bytes.length >= 12 && String.fromCharCode(...bytes.slice(0, 4)) === 'RIFF' && String.fromCharCode(...bytes.slice(8, 12)) === 'WEBP';
  return false;
}

export async function onRequestPost({ request, env }) {
  if (!isConfigured(env)) return json({ error: 'La administración privada no está configurada.' }, 503);
  const session = await readSession(request, env.SESSION_SECRET);
  if (!session || session.email !== env.MANDARINITA_SYNC_EMAIL.trim().toLowerCase()) {
    return json({ error: 'Inicia sesión con tu cuenta autorizada de GitHub.' }, 401);
  }
  if (request.headers.get('Origin') !== new URL(request.url).origin) return json({ error: 'Origen no permitido.' }, 403);
  if (!env.MANDARINITA_PROJECTS) return json({ error: 'El almacenamiento de imágenes no está conectado en Preview.' }, 503);

  let form;
  try { form = await request.formData(); } catch { return json({ error: 'No pudimos leer la imagen enviada.' }, 400); }
  const file = form.get('image');
  if (!(file instanceof File) || !TYPES.has(file.type)) return json({ error: 'Elige una imagen PNG, WebP o JPEG.' }, 400);
  if (file.size < 1 || file.size > MAX_IMAGE_BYTES) return json({ error: 'La imagen debe pesar menos de 8 MB.' }, 413);

  const extension = TYPES.get(file.type);
  const data = await file.arrayBuffer();
  if (!hasMatchingSignature(data, file.type)) return json({ error: 'El archivo no parece ser una imagen válida del tipo indicado.' }, 400);
  const key = `site-content/hero/${crypto.randomUUID()}.${extension}`;
  try {
    await env.MANDARINITA_PROJECTS.put(key, data, {
      httpMetadata: { contentType: file.type, cacheControl: 'public, max-age=31536000, immutable' },
      customMetadata: { uploadedBy: session.login }
    });
  } catch (error) {
    console.error('Homepage image upload failed', { name: error?.name || 'Error' });
    return json({ error: 'No se pudo guardar la imagen. Inténtalo de nuevo.' }, 503);
  }
  return json({ ok: true, path: `/api/site-content/image/${key}`, contentType: file.type, size: file.size });
}
