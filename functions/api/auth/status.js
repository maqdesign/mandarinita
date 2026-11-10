import { isConfigured, json } from '../../_lib/session.js';

export function onRequestGet({ env }) {
  return json({ configured: isConfigured(env) });
}
