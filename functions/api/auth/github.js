import { isAuthConfigured, json } from '../../_lib/session.js';

function randomState() {
  const bytes = crypto.getRandomValues(new Uint8Array(32));
  let binary = '';
  for (const byte of bytes) binary += String.fromCharCode(byte);
  return btoa(binary).replaceAll('+', '-').replaceAll('/', '_').replace(/=+$/, '');
}

export function onRequestGet({ request, env }) {
  if (!isAuthConfigured(env)) return json({ error: 'Falta configurar el acceso privado del editor.' }, 503);
  const state = randomState();
  const callback = new URL('/api/auth/github/callback', request.url).toString();
  const authorize = new URL('https://github.com/login/oauth/authorize');
  authorize.searchParams.set('client_id', env.GITHUB_CLIENT_ID);
  authorize.searchParams.set('redirect_uri', callback);
  authorize.searchParams.set('scope', 'read:user user:email');
  authorize.searchParams.set('state', state);
  const response = new Response(null, { status: 302, headers: { Location: authorize.toString(), 'Cache-Control': 'no-store' } });
  const area = new URL(request.url).searchParams.get('area') === 'admin' ? 'admin' : 'editor';
  response.headers.append('Set-Cookie', `mandarinita_oauth_${state}=${area}; Path=/; Max-Age=600; HttpOnly; Secure; SameSite=None`);
  return response;
}
