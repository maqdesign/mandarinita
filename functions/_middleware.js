import { isAllowedEmail, isConfigured, readSession } from './_lib/session.js';

const PRIVATE_EDITOR_PATHS = new Set([
  '/editor', '/editor/', '/editor.html', '/editor.css', '/editor.js',
  '/editor.webmanifest', '/editor-service-worker.js',
  '/editor-art-catalog.json'
]);

function unavailablePage() {
  return new Response('<!doctype html><html lang="es"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Taller privado no configurado</title><body><main><h1>Taller Mandarinita</h1><p>El editor privado todavía no está configurado. Inicia sesión cuando el acceso de GitHub esté habilitado.</p></main></body></html>', {
    status: 503,
    headers: { 'Content-Type': 'text/html; charset=utf-8', 'Cache-Control': 'no-store' }
  });
}

export async function onRequest({ request, env, next }) {
  const url = new URL(request.url);
  if (!PRIVATE_EDITOR_PATHS.has(url.pathname)) return next();
  if (!isConfigured(env)) return unavailablePage();
  const session = await readSession(request, env.SESSION_SECRET);
  if (isAllowedEmail(env,session?.email)) {
    const response = await next();
    if (url.pathname === '/editor.html' || url.pathname === '/editor') {
      const headers = new Headers(response.headers);
      headers.set('Cache-Control','private, no-store, max-age=0');
      headers.set('Pragma','no-cache');
      return new Response(response.body,{status:response.status,statusText:response.statusText,headers});
    }
    return response;
  }
  return new Response(null, { status: 302, headers: { Location: '/api/auth/github', 'Cache-Control': 'no-store' } });
}
