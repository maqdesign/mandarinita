import { isConfigured, readSession } from './_lib/session.js';

const PRIVATE_EDITOR_PATHS = new Set([
  '/editor', '/editor/', '/editor.html', '/editor.css', '/editor.js',
  '/editor.webmanifest', '/editor-service-worker.js', '/editor-art-catalog.json',
  '/admin', '/admin/', '/admin.html', '/admin.css', '/admin.js'
]);
const HERO_IMAGE_PATH = /^(?:assets\/[A-Za-z0-9._/-]+\.(?:png|webp|jpe?g)|\/api\/site-content\/image\/(?:site-content\/hero\/)?[0-9a-f-]{36}\.(?:png|webp|jpg))$/i;

async function updateHomeShareImage(request, env, next) {
  const response = await next();
  if (!env.MANDARINITA_INBOX) return response;
  try {
    const hero = await env.MANDARINITA_INBOX.prepare(
      'SELECT image_path, alt_es, effect FROM hero_banners WHERE enabled = 1 ORDER BY position, created_at LIMIT 1'
    ).first();
    if (!hero) return response;
    const imagePath = hero.image_path;
    const imageUrl = imagePath && HERO_IMAGE_PATH.test(imagePath) && !imagePath.split('/').includes('..')
      ? new URL(imagePath.startsWith('/') ? imagePath : `/${imagePath}`, request.url).href
      : null;
    const effect = hero.effect === 'still' ? 'still' : 'orbit';
    if (!imageUrl && !hero.alt_es && !hero.effect) return response;
    const rewriter = new HTMLRewriter();
    if (imageUrl) {
      rewriter
        .on('meta[property="og:image"]', { element: element => element.setAttribute('content', imageUrl) })
        .on('meta[property="og:image:secure_url"]', { element: element => element.setAttribute('content', imageUrl) })
        .on('meta[property="og:image:width"]', { element: element => element.remove() })
        .on('meta[property="og:image:height"]', { element: element => element.remove() })
        .on('meta[name="twitter:image"]', { element: element => element.setAttribute('content', imageUrl) });
    }
    if (hero.alt_es) {
      rewriter
        .on('meta[property="og:image:alt"]', { element: element => element.setAttribute('content', hero.alt_es) })
        .on('meta[name="twitter:image:alt"]', { element: element => element.setAttribute('content', hero.alt_es) });
    }
    if (imageUrl || hero.alt_es) {
      rewriter.on('img.hero-family-image', { element: element => {
        if (imageUrl) element.setAttribute('src', imageUrl);
        if (hero.alt_es) element.setAttribute('alt', hero.alt_es);
      } });
    }
    if (hero.effect) {
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
