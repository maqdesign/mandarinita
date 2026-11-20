import { isAllowedEmail, isAuthConfigured, missingAuthSettings, readSession } from './_lib/session.js';

const PRIVATE_EDITOR_PATHS = new Set([
  '/editor', '/editor/', '/editor.html', '/editor.css', '/editor.js',
  '/editor.webmanifest', '/editor-service-worker.js', '/editor-art-catalog.json',
  '/admin', '/admin/', '/admin.html', '/admin.css', '/admin.js',
  '/admin-buzon.html', '/admin-rendimiento.html', '/admin-data.js'
]);
const NON_PUBLIC_PAGE_PATHS = new Set([...PRIVATE_EDITOR_PATHS, '/acceso.html', '/login.html', '/github-auth-error.html']);
const HERO_IMAGE_PATH = /^(?:assets\/[A-Za-z0-9._/-]+\.(?:png|webp|jpe?g)|\/api\/site-content\/image\/(?:site-content\/hero\/)?[0-9a-f-]{36}\.(?:png|webp|jpg))$/i;

async function updateHomeShareImage(request, env, next) {
  const response = await next();
  if (!env.MANDARINITA_INBOX) return response;
  try {
    const now = new Date().toISOString();
    const hero = await env.MANDARINITA_INBOX.prepare(
      "SELECT image_path, alt_es, effect FROM hero_banners WHERE enabled = 1 AND (starts_at = '' OR starts_at <= ?) AND (ends_at = '' OR ends_at > ?) ORDER BY position, created_at LIMIT 1"
    ).bind(now, now).first();
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

function recordPublicPageView(context, response) {
  const { request, env } = context;
  if (!env.MANDARINITA_INBOX || request.method !== 'GET' || !response.ok) return;
  if (!(response.headers.get('content-type') || '').toLowerCase().includes('text/html')) return;

  const url = new URL(request.url);
  if (NON_PUBLIC_PAGE_PATHS.has(url.pathname) || url.pathname.startsWith('/api/')) return;
  const day = new Date().toISOString().slice(0, 10);
  const path = url.pathname === '/index.html' ? '/' : url.pathname;
  const write = env.MANDARINITA_INBOX.prepare(`
    INSERT INTO public_page_views_daily (day, path, views) VALUES (?, ?, 1)
    ON CONFLICT(day, path) DO UPDATE SET views = views + 1
  `).bind(day, path).run().catch(error => {
    console.error('Could not record public page view', { name: error?.name || 'Error' });
  });

  if (typeof context.waitUntil === 'function') context.waitUntil(write);
  else return write;
}

function unavailablePage(env) {
  const missing = missingAuthSettings(env);
  const details = missing.length
    ? `<p>En este entorno faltan estas variables: <code>${missing.join(', ')}</code>.</p><p>Configúralas en Cloudflare Pages → Configuración → Variables y secretos → el entorno correspondiente y vuelve a desplegar.</p>`
    : '<p>Las variables de acceso están presentes, pero el entorno aún no puede validar la sesión. Abre la URL de este despliegue y vuelve a intentarlo.</p>';
  return new Response(`<!doctype html><html lang="es"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex,nofollow"><title>Taller privado no configurado</title><style>body{margin:0;padding:32px;background:#f7f2e9;color:#30221b;font:16px/1.6 system-ui,sans-serif}main{max-width:680px;margin:10vh auto;padding:28px;border:1px solid #eadcc9;border-radius:20px;background:#fffefa}h1{font-size:1.7rem}code{padding:2px 6px;border-radius:5px;background:#f2e9dc;color:#823b08}</style><main><h1>Taller Mandarinita</h1><p>El acceso privado de esta administración no está listo.</p>${details}</main></html>`, {
    status: 503,
    headers: { 'Content-Type': 'text/html; charset=utf-8', 'Cache-Control': 'no-store' }
  });
}

export async function onRequest(context) {
  const { request, env, next } = context;
  const url = new URL(request.url);
  if (!PRIVATE_EDITOR_PATHS.has(url.pathname)) {
    let response;
    if ((url.pathname === '/' || url.pathname === '/index.html') && request.method === 'GET') {
      response = await updateHomeShareImage(request, env, next);
    } else response = await next();
    await recordPublicPageView(context, response);
    return response;
  }
  if (!isAuthConfigured(env)) return unavailablePage(env);
  const session = await readSession(request, env.SESSION_SECRET);
  if (isAllowedEmail(env, session?.email)) {
    const response = await next();
    if (url.pathname === '/editor.html' || url.pathname === '/editor' || url.pathname.startsWith('/admin')) {
      const headers = new Headers(response.headers);
      headers.set('Cache-Control', 'private, no-store, max-age=0');
      headers.set('Pragma', 'no-cache');
      return new Response(response.body, { status: response.status, statusText: response.statusText, headers });
    }
    return response;
  }
  const target = url.pathname.startsWith('/admin') ? 'admin' : 'editor';
  return new Response(null, { status: 302, headers: { Location: `/login.html?area=${target}`, 'Cache-Control': 'no-store' } });
}
