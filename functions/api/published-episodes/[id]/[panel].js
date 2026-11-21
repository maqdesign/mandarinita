import { scheduleHasStarted } from '../../../_lib/schedule.js';

const PREFIX = 'published/episodes/';
const PUBLIC_ID = /^ep-[a-zA-Z0-9_-]{1,96}$/;

export async function onRequestGet({ params, env, request }) {
  const { id, panel } = params;
  if (!env.MANDARINITA_PROJECTS || !PUBLIC_ID.test(id || '') || !/^\d{1,2}\.png$/.test(panel || '')) {
    return new Response('No encontrado.', { status: 404 });
  }

  const order = Number(panel.slice(0, -4));
  const revision = new URL(request.url).searchParams.get('v') || '';
  if (!/^[a-f0-9-]{36}$/i.test(revision)) return new Response('No encontrado.', { status: 404 });
  const manifestObject = await env.MANDARINITA_PROJECTS.get(`${PREFIX}${id}/manifest.json`);
  if (!manifestObject) return new Response('No encontrado.', { status: 404 });
  let manifest;
  try { manifest = await manifestObject.json(); } catch { return new Response('No encontrado.', { status: 404 }); }
  const isAvailable = manifest.complete === true && (manifest.status === 'published' || manifest.status === 'scheduled' && scheduleHasStarted(manifest.publishedAt))
    && (!manifest.unpublishAt || !scheduleHasStarted(manifest.unpublishAt));
  if (!isAvailable || manifest.revision !== revision || !manifest.panels?.some(entry => entry.order === order)) return new Response('No encontrado.', { status: 404 });

  const key = `${PREFIX}${id}/releases/${revision}/panels/${String(order).padStart(2, '0')}.png`;
  const image = await env.MANDARINITA_PROJECTS.get(key);
  if (!image) return new Response('No encontrado.', { status: 404 });
  const headers = new Headers({
    'Content-Type': 'image/png',
    'Content-Disposition': 'inline',
    'Cache-Control': 'public, max-age=31536000, immutable',
    'X-Content-Type-Options': 'nosniff',
    ETag: image.httpEtag
  });
  return new Response(image.body, { headers });
}
