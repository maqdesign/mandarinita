import { isConfigured, json, makeSessionCookie } from '../../../_lib/session.js';

function cookie(request, name) {
  return (request.headers.get('Cookie') || '').split(';').map(part => part.trim()).find(part => part.startsWith(`${name}=`))?.slice(name.length + 1) || '';
}

export async function onRequestGet({ request, env }) {
  if (!isConfigured(env)) return json({ error: 'Falta configurar el acceso privado del editor.' }, 503);
  const url = new URL(request.url);
  const state = url.searchParams.get('state') || '';
  const validStateShape = /^[A-Za-z0-9_-]{43}$/.test(state);
  const stateCookieName = validStateShape ? `mandarinita_oauth_${state}` : '';
  const area = stateCookieName ? cookie(request, stateCookieName) : '';
  const clearStateCookie = stateCookieName
    ? `${stateCookieName}=; Path=/; Max-Age=0; HttpOnly; Secure; SameSite=None`
    : '';
  if (!stateCookieName || !['admin', 'editor'].includes(area)) {
    console.warn('GitHub OAuth state validation failed', {
      hasState: Boolean(state),
      validStateShape,
      matchingCookiePresent: Boolean(area),
      host: url.hostname
    });
    const errorMessage = validStateShape
      ? 'El navegador no devolvió la cookie de este inicio de sesión. Permite cookies para la vista previa e inténtalo de nuevo desde este mismo enlace.'
      : 'El enlace de inicio de sesión venció o cambió. Vuelve a iniciar sesión desde el panel.';
    const response = json({ error: errorMessage }, 400);
    if (clearStateCookie) response.headers.append('Set-Cookie', clearStateCookie);
    return response;
  }
  if (url.searchParams.has('error')) return new Response(null, { status: 303, headers: {
    Location: new URL('/github-auth-error.html?reason=cancelled', request.url).toString(),
    'Set-Cookie': clearStateCookie,
    'Cache-Control': 'no-store'
  } });

  const code = url.searchParams.get('code');
  if (!code) return json({ error: 'GitHub no devolvió un código de autorización.' }, 400);
  const callback = new URL('/api/auth/github/callback', request.url).toString();
  let tokenResponse;
  try {
    tokenResponse = await fetch('https://github.com/login/oauth/access_token', {
      method: 'POST',
      headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
      body: JSON.stringify({ client_id: env.GITHUB_CLIENT_ID, client_secret: env.GITHUB_CLIENT_SECRET, code, redirect_uri: callback })
    });
  } catch (error) {
    console.error('GitHub OAuth token exchange request failed', { name: error?.name || 'Error' });
    return json({ error: 'No pudimos conectar con GitHub para completar el acceso. Vuelve a intentarlo.' }, 502);
  }

  const token = await tokenResponse.json().catch(() => ({}));
  if (!tokenResponse.ok) {
    console.error('GitHub OAuth token exchange returned an HTTP error', {
      status: tokenResponse.status,
      error: typeof token.error === 'string' ? token.error : 'unknown',
      requestId: tokenResponse.headers.get('x-github-request-id') || undefined
    });
    if (token.error === 'incorrect_client_credentials') {
      return json({ error: 'GitHub no aceptó las credenciales de Preview. Confirma que el Client ID y el secreto pertenezcan a la misma OAuth App.' }, 502);
    }
    if (token.error === 'bad_verification_code') {
      return json({ error: 'El código de autorización venció o ya se usó. Inicia sesión de nuevo desde el panel.' }, 400);
    }
    return json({ error: `GitHub respondió con un error HTTP ${tokenResponse.status} al completar el acceso. Inicia sesión otra vez; si se repite, revisaremos la configuración de Preview.` }, 502);
  }
  if (!token.access_token) {
    console.error('GitHub OAuth token exchange did not return an access token', {
      error: typeof token.error === 'string' ? token.error : 'unknown',
      requestId: tokenResponse.headers.get('x-github-request-id') || undefined
    });
    if (token.error === 'incorrect_client_credentials') {
      return json({ error: 'GitHub no aceptó las credenciales de Preview. Confirma que el Client ID y el secreto pertenezcan a la misma OAuth App.' }, 502);
    }
    if (token.error === 'bad_verification_code') {
      return json({ error: 'El código de autorización venció o ya se usó. Inicia sesión de nuevo desde el panel.' }, 400);
    }
    return json({ error: 'GitHub no devolvió un token de acceso. Inicia sesión de nuevo desde el panel.' }, 502);
  }

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
    'Set-Cookie': clearStateCookie,
    'Cache-Control': 'no-store'
  } });

  const sessionCookie = await makeSessionCookie({ login: user.login, email: allowedEmail }, env.SESSION_SECRET);
  const destination = area === 'admin' ? '/admin.html' : '/editor.html?github=connected';
  const response = new Response(null, { status: 303, headers: {
    Location: new URL(destination, request.url).toString(),
    'Cache-Control': 'no-store'
  } });
  response.headers.append('Set-Cookie', sessionCookie);
  response.headers.append('Set-Cookie', clearStateCookie);
  return response;
}
