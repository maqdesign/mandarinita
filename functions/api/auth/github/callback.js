import { isConfigured, json, makeSessionCookie } from '../../../_lib/session.js';

function cookie(request, name) {
  return (request.headers.get('Cookie') || '').split(';').map(part => part.trim()).find(part => part.startsWith(`${name}=`))?.slice(name.length + 1) || '';
}

export async function onRequestGet({ request, env }) {
  if (!isConfigured(env)) return json({ error: 'Falta configurar el acceso privado del editor.' }, 503);
  const url = new URL(request.url);
  const state = url.searchParams.get('state') || '';
  if (!state || state !== cookie(request, 'mandarinita_oauth_state')) return json({ error: 'No se pudo validar el inicio de sesión. Vuelve a intentarlo.' }, 400);
  if (url.searchParams.has('error')) return new Response(null, { status: 303, headers: {
    Location: new URL('/github-auth-error.html?reason=cancelled', request.url).toString(),
    'Set-Cookie': 'mandarinita_oauth_state=; Path=/api/auth/github/callback; Max-Age=0; HttpOnly; Secure; SameSite=Lax',
    'Cache-Control': 'no-store'
  } });

  const code = url.searchParams.get('code');
  if (!code) return json({ error: 'GitHub no devolvió un código de autorización.' }, 400);
  const callback = new URL('/api/auth/github/callback', request.url).toString();
  const tokenResponse = await fetch('https://github.com/login/oauth/access_token', {
    method: 'POST',
    headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
    body: JSON.stringify({ client_id: env.GITHUB_CLIENT_ID, client_secret: env.GITHUB_CLIENT_SECRET, code, redirect_uri: callback })
  });
  if (!tokenResponse.ok) return json({ error: 'GitHub no pudo completar la autorización.' }, 502);
  const token = await tokenResponse.json();
  if (!token.access_token) return json({ error: 'GitHub rechazó la autorización.' }, 401);

  const headers = { Authorization: `Bearer ${token.access_token}`, Accept: 'application/vnd.github+json', 'X-GitHub-Api-Version': '2022-11-28', 'User-Agent': 'Mandarinita-Editor' };
  const [userResponse, emailsResponse] = await Promise.all([
    fetch('https://api.github.com/user', { headers }),
    fetch('https://api.github.com/user/emails', { headers })
  ]);
  if (!userResponse.ok || !emailsResponse.ok) return json({ error: 'No se pudo verificar la cuenta de GitHub.' }, 502);
  const [user, emails] = await Promise.all([userResponse.json(), emailsResponse.json()]);
  const allowedEmail = env.MANDARINITA_SYNC_EMAIL.trim().toLowerCase();
  const verified = emails.some(entry => entry.verified && entry.email.toLowerCase() === allowedEmail);
  if (!verified) return new Response(null, { status: 303, headers: {
    Location: new URL('/github-auth-error.html?reason=not-authorized', request.url).toString(),
    'Set-Cookie': 'mandarinita_oauth_state=; Path=/api/auth/github/callback; Max-Age=0; HttpOnly; Secure; SameSite=Lax',
    'Cache-Control': 'no-store'
  } });

  const sessionCookie = await makeSessionCookie({ login: user.login, email: allowedEmail }, env.SESSION_SECRET);
  const area = cookie(request, 'mandarinita_oauth_area') === 'admin' ? 'admin' : 'editor';
  const destination = area === 'admin' ? '/admin.html' : '/editor.html?github=connected';
  const response = new Response(null, { status: 303, headers: {
    Location: new URL(destination, request.url).toString(),
    'Cache-Control': 'no-store'
  } });
  response.headers.append('Set-Cookie', sessionCookie);
  response.headers.append('Set-Cookie', 'mandarinita_oauth_state=; Path=/api/auth/github/callback; Max-Age=0; HttpOnly; Secure; SameSite=Lax');
  response.headers.append('Set-Cookie', 'mandarinita_oauth_area=; Path=/api/auth/github/callback; Max-Age=0; HttpOnly; Secure; SameSite=Lax');
  return response;
}
