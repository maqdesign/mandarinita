import { isAuthConfigured, json, readSession } from '../../_lib/session.js';

export async function onRequestGet({ request, env }) {
  if (!isAuthConfigured(env)) return json({ configured: false, user: null });
  const user = await readSession(request, env.SESSION_SECRET);
  return json({ configured: true, user: user ? { login: user.login, email: user.email } : null });
}
