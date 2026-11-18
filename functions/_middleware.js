import { isConfigured, readSession } from './_lib/session.js';

const PRIVATE_EDITOR_PATHS = new Set([
  '/editor', '/editor/', '/editor.html', '/editor.css', '/editor.js',
  '/editor.webmanifest', '/editor-service-worker.js', '/editor-art-catalog.json',
  '/admin', '/admin/', '/admin.html', '/admin.css', '/admin.js'
]);
const HERO_IMAGE_PATH = /^(?:assets\/[A-Za-z0-9._/-]+\.(?:png|webp|jpe?g)|\/api\/site-content\/image\/site-content\/hero\/[0-9a-f-]{36}\.(?:png|webp|jpg))$/i;

async function updateHomeShareImage(request, env, next) {
  const response = await next();
  if (!env.MANDARINITA_INBOX) return response;
  try {
    const result = await env.MANDARINITA_INBOX.prepare(
      "SELECT content_key, es FROM site_content WHERE content_key IN ('hero.image', 'hero.image.alt', 'hero.effect')"
    ).all();
    const content = Object.fromEntries((result.results || []).map(row => [row.content_key, row.es]));
    const imagePath = content['hero.image'];
    const imageUrl = imagePath && HERO_IMAGE_PATH.test(imagePath) && !imagePath.split('/').includes('..')
      ? new URL(imagePath.startsWith('/') ? imagePath : `/${imagePath}`, request.url).href
      : null;
    const effect = content['hero.effect'] === 'still' ? 'still' : 'orbit';
    if (!imageUrl && !content['hero.image.alt'] && !content['hero.effect']) return response;
    const rewriter = new HTMLRewriter();
    if (imageUrl) {
      rewriter
        .on('meta[property="og:image"]', { element: element => element.setAttribute('content', imageUrl) })
        .on('meta[property="og:image:secure_url"]', { element: element => element.setAttribute('content', imageUrl) })
        .on('meta[name="twitter:image"]', { element: element => element.setAttribute('content', imageUrl) });
    }
    if (imageUrl || content['hero.image.alt']) {
      rewriter.on('img.hero-family-image', { element: element => {
        if (imageUrl) element.setAttribute('src', imageUrl);
        if (content['hero.image.alt']) element.setAttribute('alt', content['hero.image.alt']);
      } });
    }
    if (content['hero.effect']) {
      rewriter.on('div.hero-episode-orbit', { element: element => {
        element.setAttribute('data-effect', effect);
        if (effect === 'still') element.setAttribute('hidden', '');
        else element.removeAttribute('hidden');
      } });
    }
    return rewriter.transform(response);
  } catch (error) {
    console.error('Homepage social image could not be updated', { name: error?.name || 'Error' });
    return response;
  }
}

function unavailablePage() {
  return new Response('<!doctype html><html lang="es"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Taller privado no configurado</title><body><main><h1>Taller Mandarinita</h1><p>El editor privado todavía no está configurado. Inicia sesión cuando el acceso de GitHub esté habilitado.</p></main></body></html>', {
    status: 503,
    headers: { 'Content-Type': 'text/html; charset=utf-8', 'Cache-Control': 'no-store' }
  });
}

export async function onRequest({ request, env, next }) {
  const url = new URL(request.url);
  if (!PRIVATE_EDITOR_PATHS.has(url.pathname)) {
    if ((url.pathname === '/' || url.pathname === '/index.html') && request.method === 'GET') {
      return updateHomeShareImage(request, env, next);
    }
    return next();
  }
  if (!isConfigured(env)) return unavailablePage();
  const session = await readSession(request, env.SESSION_SECRET);
  const allowedEmail = env.MANDARINITA_SYNC_EMAIL.trim().toLowerCase();
  if (session?.email === allowedEmail) return next();
  const target = url.pathname.startsWith('/admin') ? '?area=admin' : '';
  return new Response(null, { status: 302, headers: { Location: `/api/auth/github${target}`, 'Cache-Control': 'no-store' } });
}
