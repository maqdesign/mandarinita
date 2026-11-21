import { authorizeProjectRequest, isValidProjectId } from '../_lib/projects.js';
import { json } from '../_lib/session.js';
import { scheduleHasStarted, scheduleIsAfter, validScheduleDate } from '../_lib/schedule.js';

const PREFIX = 'published/episodes/';
const OVERRIDES_PREFIX = `${PREFIX}overrides/`;
const MAX_PANELS = 20;
const MAX_PANEL_BYTES = 16 * 1024 * 1024;
const MAX_TOTAL_BYTES = 80 * 1024 * 1024;
const PUBLIC_ID = /^ep-[a-zA-Z0-9_-]{1,96}$/;

function visible(manifest) {
  return manifest?.complete === true && (manifest.status === 'published' || manifest.status === 'scheduled' && scheduleHasStarted(manifest.publishedAt))
    && (!manifest.unpublishAt || !scheduleHasStarted(manifest.unpublishAt));
}

async function listOverrides(bucket) {
  const overrides = [];
  let cursor;
  do {
    const page = await bucket.list({ prefix: OVERRIDES_PREFIX, cursor, limit: 1000 });
    for (const object of page.objects) {
      try {
        const data = await bucket.get(object.key);
        const value = data && await data.json();
        if (value && PUBLIC_ID.test(value.id || '')) overrides.push(value);
      } catch { /* Ignore broken editorial notes and keep the public catalog usable. */ }
    }
    cursor = page.truncated ? page.cursor : undefined;
  } while (cursor);
  return overrides;
}

async function listManifests(bucket) {
  const records = [];
  let cursor;
  do {
    const page = await bucket.list({ prefix: PREFIX, cursor, limit: 1000 });
    for (const object of page.objects) {
      if (!object.key.endsWith('/manifest.json')) continue;
      try {
        const data = await bucket.get(object.key);
        const record = data && await data.json();
        if (record && PUBLIC_ID.test(record.id)) records.push(record);
      } catch { /* An unreadable manifest stays private. */ }
    }
    cursor = page.truncated ? page.cursor : undefined;
  } while (cursor);
  return records;
}

function publicEpisode(record) {
  return {
    id: record.id,
    episodeNumber: record.episodeNumber,
    title: record.title,
    publishedAt: record.publishedAt,
    unpublishAt: record.unpublishAt || null,
    status: 'published',
    type: 'comic',
    complete: true,
    exportTemplate: record.exportTemplate,
    characters: record.metadata?.characters || [],
    objects: record.metadata?.objects || [],
    themes: record.metadata?.themes || [],
    colors: record.metadata?.colors || [],
    searchTerms: record.metadata?.searchTerms || [],
    spokenText: record.metadata?.spokenText || '',
    externalLinks: record.metadata?.externalLinks || record.source?.externalLinks || [],
    source: { ...(record.source || {}), externalLinks: record.metadata?.externalLinks || record.source?.externalLinks || [] },
    panels: record.panels.map(panel => ({
      order: panel.order,
      src: `/api/published-episodes/${record.id}/${panel.order}.png?v=${record.revision}`,
      alt: panel.alt
    }))
  };
}

export async function onRequestGet({ env }) {
  if (!env.MANDARINITA_PROJECTS) return json({ episodes: [] });
  try {
    const [records, overrides] = await Promise.all([listManifests(env.MANDARINITA_PROJECTS), listOverrides(env.MANDARINITA_PROJECTS)]);
    const episodes = records.filter(record => visible(record) && Number.isInteger(record.episodeNumber) && Array.isArray(record.panels))
      .map(publicEpisode)
      .sort((a, b) => (b.publishedAt || '').localeCompare(a.publishedAt || '') || b.episodeNumber - a.episodeNumber);
    return json({ schemaVersion: 1, episodes, overrides }, 200, { 'Cache-Control': 'public, max-age=10, s-maxage=10' });
  } catch (error) {
    console.error('Published episodes could not be read', { name: error?.name || 'Error' });
    return json({ episodes: [] }, 200, { 'Cache-Control': 'no-store' });
  }
}

export async function onRequestPost(context) {
  const auth = await authorizeProjectRequest(context, true);
  if (auth.response) return auth.response;
  const { request, env } = context;
  let form;
  try { form = await request.formData(); }
  catch { return json({ error: 'No pude leer el paquete del episodio.' }, 400); }

  let input;
  try { input = JSON.parse(String(form.get('metadata') || '')); }
  catch { return json({ error: 'Los datos editoriales no son válidos.' }, 400); }

  const id = input?.id;
  const projectId = input?.projectId;
  const episodeNumber = Number(input?.episodeNumber);
  const title = { es: String(input?.title?.es || '').trim(), en: String(input?.title?.en || '').trim() };
  const publishedAt = input?.publishedAt;
  const panels = input?.panels;
  const metadata = normalizeMetadata(input?.metadata);
  const unpublishAt = input?.unpublishAt || null;
  if (!PUBLIC_ID.test(id || '') || !isValidProjectId(projectId) || id !== `ep-${projectId}`) return json({ error: 'El identificador del episodio no es válido.' }, 400);
  if (!Number.isInteger(episodeNumber) || episodeNumber < 1 || episodeNumber > 9999) return json({ error: 'El número de episodio no es válido.' }, 400);
  if (!title.es || title.es.length > 180 || !title.en || title.en.length > 180) return json({ error: 'Escribe el título del episodio en español e inglés (máximo 180 caracteres).' }, 400);
  if (!validScheduleDate(publishedAt)) return json({ error: 'Elige una fecha y hora de publicación válidas.' }, 400);
  if (unpublishAt && (!validScheduleDate(unpublishAt) || !scheduleIsAfter(unpublishAt, publishedAt))) return json({ error: 'La fecha y hora para retirar el episodio deben ser posteriores a las de publicación.' }, 400);
  if (!Array.isArray(panels) || panels.length < 1 || panels.length > MAX_PANELS) return json({ error: `El episodio debe tener entre 1 y ${MAX_PANELS} viñetas.` }, 400);

  const checkedPanels = [];
  let totalBytes = 0;
  for (let index = 0; index < panels.length; index++) {
    const panel = panels[index];
    const order = index + 1;
    const alt = { es: String(panel?.alt?.es || '').trim(), en: String(panel?.alt?.en || '').trim() };
    const file = form.get(`panel-${order}`);
    if (panel?.order !== order || alt.es.length < 8 || alt.en.length < 8 || alt.es.length > 300 || alt.en.length > 300) {
      return json({ error: `Completa el texto alternativo de la viñeta ${order} en español e inglés.` }, 400);
    }
    if (!(file instanceof File) || file.type !== 'image/png' || file.size < 1 || file.size > MAX_PANEL_BYTES) {
      return json({ error: `La imagen de la viñeta ${order} no es un PNG válido o supera 16 MB.` }, 400);
    }
    totalBytes += file.size;
    if (totalBytes > MAX_TOTAL_BYTES) return json({ error: 'El conjunto de imágenes supera 80 MB.' }, 413);
    checkedPanels.push({ order, alt, file });
  }

  const bucket = env.MANDARINITA_PROJECTS;
  const manifestKey = `${PREFIX}${id}/manifest.json`;
  let previousObject;
  try { previousObject = await bucket.get(manifestKey); }
  catch { return json({ error: 'El almacenamiento público no está disponible ahora. El borrador sigue guardado.' }, 503); }
  let previous = null;
  if (previousObject) {
    try { previous = await previousObject.json(); } catch { return json({ error: 'El registro anterior del episodio está dañado y no se reemplazó.' }, 409); }
    if (previous.projectId !== projectId) return json({ error: 'Ese identificador ya pertenece a otro proyecto.' }, 409);
  }

  let existingRecords;
  try { existingRecords = await listManifests(bucket); }
  catch { return json({ error: 'No se pudo comprobar el archivo público. Intenta publicar de nuevo.' }, 503); }
  try {
    const catalogResponse = await fetch(new URL('/episodes.json', request.url), { headers: { Accept: 'application/json' }, cf: { cacheTtl: 60 } });
    if (!catalogResponse.ok) throw new Error('Static episode catalog unavailable');
    const catalog = await catalogResponse.json();
    if (catalog.episodes?.some(record => record.id !== id && Number(record.episodeNumber) === episodeNumber)) {
      return json({ error: `El episodio ${episodeNumber} ya existe en el archivo. Elige otro número.` }, 409);
    }
  } catch {
    return json({ error: 'No se pudo comprobar el número de episodio contra el archivo actual. Intenta publicar de nuevo.' }, 503);
  }
  const duplicate = existingRecords.find(record => record.id !== id && Number(record.episodeNumber) === episodeNumber);
  if (duplicate) return json({ error: `El episodio ${episodeNumber} ya está publicado o programado. Elige otro número.` }, 409);

  const status = scheduleHasStarted(publishedAt) ? 'published' : 'scheduled';
  const revision = crypto.randomUUID();
  const exportTemplate = ['classic', 'cream', 'footer', 'bleed'].includes(input.exportTemplate) ? input.exportTemplate : 'classic';
  const next = {
    schemaVersion: 1,
    editorialPolicy: 'manual-approval',
    id,
    projectId,
    revision,
    episodeNumber,
    title,
    publishedAt,
    status,
    unpublishAt,
    type: 'comic',
    complete: true,
    exportTemplate,
    metadata,
    source: { kind: 'editor-publish', instagramMediaId: null, instagramPermalink: null },
    panels: checkedPanels.map(({ order, alt }) => ({ order, alt }))
  };

  try {
    for (const { order, file } of checkedPanels) {
      const panelKey = `${PREFIX}${id}/releases/${revision}/panels/${String(order).padStart(2, '0')}.png`;
      await bucket.put(panelKey, file.stream(), {
        httpMetadata: { contentType: 'image/png', cacheControl: 'public, max-age=31536000, immutable' },
        customMetadata: { episodeId: id, order: String(order) }
      });
    }
    await bucket.put(manifestKey, JSON.stringify(next), {
      httpMetadata: { contentType: 'application/json; charset=utf-8', cacheControl: 'no-store' },
      customMetadata: { episodeId: id, episodeNumber: String(episodeNumber), status, publishedAt }
    });
  } catch (error) {
    console.error('Episode could not be published', { name: error?.name || 'Error', episodeId: id });
    return json({ error: 'No se pudo guardar el episodio en el sitio. El borrador del editor sigue intacto.' }, 503);
  }

  return json({ ok: true, episode: { ...publicEpisode(next), status }, scheduled: status === 'scheduled' }, 200);
}

function normalizeMetadata(input = {}) {
  const list = (value, max = 24) => Array.isArray(value)
    ? [...new Set(value.map(item => String(item || '').trim()).filter(Boolean))].slice(0, max)
    : [];
  const externalLinks = Array.isArray(input.externalLinks) ? input.externalLinks.slice(0, 12).flatMap(link => {
    const label = String(link?.label || '').trim().slice(0, 60);
    const url = String(link?.url || '').trim();
    try {
      const parsed = new URL(url);
      return label && parsed.protocol === 'https:' ? [{ label, url: parsed.href.slice(0, 500) }] : [];
    } catch { return []; }
  }) : [];
  return {
    characters: list(input.characters), objects: list(input.objects), themes: list(input.themes),
    colors: list(input.colors), searchTerms: list(input.searchTerms),
    spokenText: String(input.spokenText || '').trim().slice(0, 8000), externalLinks
  };
}
