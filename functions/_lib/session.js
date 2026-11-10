const encoder = new TextEncoder();
const COOKIE = 'mandarinita_session';

function base64url(bytes) {
  let binary = '';
  for (const byte of bytes) binary += String.fromCharCode(byte);
  return btoa(binary).replaceAll('+', '-').replaceAll('/', '_').replace(/=+$/, '');
}

function decodeBase64url(value) {
  const normalized = value.replaceAll('-', '+').replaceAll('_', '/');
  const binary = atob(normalized + '='.repeat((4 - normalized.length % 4) % 4));
  return Uint8Array.from(binary, character => character.charCodeAt(0));
}

function cookieValue(request, name) {
  return (request.headers.get('Cookie') || '').split(';').map(part => part.trim()).find(part => part.startsWith(`${name}=`))?.slice(name.length + 1) || '';
}

async function sign(payload, secret) {
  const key = await crypto.subtle.importKey('raw', encoder.encode(secret), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']);
  return base64url(new Uint8Array(await crypto.subtle.sign('HMAC', key, encoder.encode(payload))));
}

export async function makeSessionCookie(user, secret) {
  const payload = base64url(encoder.encode(JSON.stringify({ ...user, exp: Date.now() + 7 * 24 * 60 * 60 * 1000 })));
  const token = `${payload}.${await sign(payload, secret)}`;
  return `${COOKIE}=${token}; Path=/; Max-Age=604800; HttpOnly; Secure; SameSite=Lax`;
}

export async function readSession(request, secret) {
  if (!secret) return null;
  const token = cookieValue(request, COOKIE);
  const [payload, signature, extra] = token.split('.');
  if (!payload || !signature || extra) return null;
  const expected = await sign(payload, secret);
  const a = encoder.encode(signature);
  const b = encoder.encode(expected);
  if (a.length !== b.length || !crypto.subtle.timingSafeEqual) {
    if (a.length !== b.length) return null;
    let difference = 0;
    for (let i = 0; i < a.length; i++) difference |= a[i] ^ b[i];
    if (difference) return null;
  } else if (!crypto.subtle.timingSafeEqual(a, b)) return null;
  try {
    const session = JSON.parse(new TextDecoder().decode(decodeBase64url(payload)));
    return session.exp > Date.now() ? session : null;
  } catch {
    return null;
  }
}

export function clearSessionCookie() {
  return `${COOKIE}=; Path=/; Max-Age=0; HttpOnly; Secure; SameSite=Lax`;
}

export function json(data, status = 200, headers = {}) {
  return Response.json(data, { status, headers: { 'Cache-Control': 'no-store', ...headers } });
}

export function isConfigured(env) {
  return Boolean(env.GITHUB_CLIENT_ID && env.GITHUB_CLIENT_SECRET && env.SESSION_SECRET && env.MANDARINITA_SYNC_EMAIL && env.MANDARINITA_PROJECTS);
}
