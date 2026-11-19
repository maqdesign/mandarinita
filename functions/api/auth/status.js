import { isAuthConfigured, json, missingAuthSettings } from '../../_lib/session.js';

export function onRequestGet({ env }) {
  return json({ configured: isAuthConfigured(env), missing: missingAuthSettings(env) });
}
