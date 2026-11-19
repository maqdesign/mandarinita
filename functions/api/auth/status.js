import { isAuthConfigured, json } from '../../_lib/session.js';

export function onRequestGet({ env }) {
  return json({ configured: isAuthConfigured(env) });
}
