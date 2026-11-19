import { clearSessionCookie, json } from '../../_lib/session.js';

export function onRequestPost({ request }) {
  const origin = new URL(request.url).origin;
  if (request.headers.get('Origin') !== origin) return json({ error: 'Origen no permitido.' }, 403);
  return json({ ok: true }, 200, { 'Set-Cookie': clearSessionCookie() });
}

export function onRequestGet({ request }) {
  return new Response(null,{status:303,headers:{Location:new URL('/',request.url).toString(),'Set-Cookie':clearSessionCookie(),'Cache-Control':'no-store'}});
}
