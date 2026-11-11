import { allowedEmails, isConfigured, json, makeSessionCookie } from '../../../_lib/session.js';

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
  let token;
  try { token = await tokenResponse.json(); } catch { token = {}; }
  if (!tokenResponse.ok || !token.access_token) {
    // Never leave the temporary OAuth code visible in a raw error response.
    // The detailed GitHub response can include configuration data; keep it out of
    // the browser and logs, and send the user to an explanation instead.
    return new Response(null, { status: 303, headers: {
      Location: new URL('/github-auth-error.html?reason=oauth-exchange', request.url).toString(),
      'Set-Cookie': 'mandarinita_oauth_state=; Path=/api/auth/github/callback; Max-Age=0; HttpOnly; Secure; SameSite=Lax',
      'Cache-Control': 'no-store'
    } });
  }

  const headers = { Authorization: `Bearer ${token.access_token}`, Accept: 'application/vnd.github+json', 'X-GitHub-Api-Version': '2022-11-28', 'User-Agent': 'Mandarinita-Editor' };
  const [userResponse, emailsResponse] = await Promise.all([
    fetch('https://api.github.com/user', { headers }),
    fetch('https://api.github.com/user/emails', { headers })
  ]);
  if (!userResponse.ok || !emailsResponse.ok) return json({ error: 'No se pudo verificar la cuenta de GitHub.' }, 502);
  const [user, emails] = await Promise.all([userResponse.json(), emailsResponse.json()]);
  const permittedEmails = allowedEmails(env);
  const verified = emails.find(entry => entry.verified && permittedEmails.includes(entry.email.trim().toLowerCase()));
  if (!verified) return new Response(null, { status: 303, headers: {
    Location: new URL('/github-auth-error.html?reason=not-authorized', request.url).toString(),
    'Set-Cookie': 'mandarinita_oauth_state=; Path=/api/auth/github/callback; Max-Age=0; HttpOnly; Secure; SameSite=Lax',
    'Cache-Control': 'no-store'
  } });

  const sessionCookie = await makeSessionCookie({ login: user.login, email: verified.email.trim().toLowerCase() }, env.SESSION_SECRET);
  const response = new Response(null, { status: 303, headers: {
    Location: new URL('/editor.html?github=connected', request.url).toString(),
    'Cache-Control': 'no-store'
  } });
  response.headers.append('Set-Cookie', sessionCookie);
  response.headers.append('Set-Cookie', 'mandarinita_oauth_state=; Path=/api/auth/github/callback; Max-Age=0; HttpOnly; Secure; SameSite=Lax');
  return response;
}
