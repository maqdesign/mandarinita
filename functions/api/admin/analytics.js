import { isConfigured, json, readSession } from '../../_lib/session.js';

const ZONE_TAG = 'fc0889e2ab8fcbf1aa741fd075565f9b';

export async function onRequestGet({ request, env }) {
  if (!isConfigured(env)) return json({ error: 'La administración privada no está configurada.' }, 503);
  const session = await readSession(request, env.SESSION_SECRET);
  if (!session || session.email !== env.MANDARINITA_SYNC_EMAIL.trim().toLowerCase()) {
    return json({ error: 'Inicia sesión con tu cuenta autorizada de GitHub.' }, 401);
  }
  if (!env.CLOUDFLARE_ANALYTICS_API_TOKEN) {
    return json({ error: 'Falta conectar el token de solo lectura de Cloudflare Analytics en este entorno.', code: 'analytics_not_configured' }, 503);
  }

  const end = new Date();
  const start = new Date(Date.UTC(end.getUTCFullYear(), end.getUTCMonth(), end.getUTCDate() - 6));
  const query = `query {
    viewer {
      zones(filter: { zoneTag: "${ZONE_TAG}" }) {
        httpRequestsAdaptiveGroups(
          limit: 7
          filter: { datetime_geq: "${start.toISOString()}", datetime_lt: "${end.toISOString()}" }
          orderBy: [date_ASC]
        ) {
          count
          dimensions { date }
          sum { visits }
        }
      }
    }
  }`;

  let response;
  try {
    response = await fetch('https://api.cloudflare.com/client/v4/graphql', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${env.CLOUDFLARE_ANALYTICS_API_TOKEN}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ query })
    });
  } catch {
    return json({ error: 'No pudimos conectar con las métricas de Cloudflare.' }, 502);
  }
  if (!response.ok) return json({ error: 'Cloudflare no aceptó el token de Analytics. Revisa sus permisos y su valor en Preview.' }, 502);

  const payload = await response.json().catch(() => null);
  if (!payload || payload.errors?.length) return json({ error: 'Cloudflare no pudo devolver las métricas para este dominio.' }, 502);
  const groups = payload.data?.viewer?.zones?.[0]?.httpRequestsAdaptiveGroups;
  if (!Array.isArray(groups)) return json({ error: 'Cloudflare no devolvió datos de visitas para el dominio.' }, 502);

  const byDate = new Map(groups.map(group => [group.dimensions.date, {
    date: group.dimensions.date,
    visits: Number(group.sum?.visits || 0),
    requests: Number(group.count || 0)
  }]));
  const days = Array.from({ length: 7 }, (_, index) => {
    const day = new Date(start.getTime() + index * 86400000).toISOString().slice(0, 10);
    return byDate.get(day) || { date: day, visits: 0, requests: 0 };
  });
  return json({
    period: { start: days[0].date, end: days.at(-1).date },
    visits: days.reduce((total, day) => total + day.visits, 0),
    requests: days.reduce((total, day) => total + day.requests, 0),
    days
  });
}
