import { authorizeProjectRequest } from '../../_lib/projects.js';
import { json } from '../../_lib/session.js';

const ROOT = 'published/episodes/';
const OVERRIDES = `${ROOT}overrides/`;
const ID_PATTERN = /^ep-[a-zA-Z0-9_-]{1,96}$/;
const STATUSES = new Set(['published', 'scheduled', 'unpublished']);

function todayInSantoDomingo() {
  const values = Object.fromEntries(new Intl.DateTimeFormat('en-CA', {
    timeZone: 'America/Santo_Domingo', year: 'numeric', month: '2-digit', day: '2-digit'
  }).formatToParts(new Date()).map(part => [part.type, part.value]));
  return `${values.year}-${values.month}-${values.day}`;
}

function validDate(value) {
  if (typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const date = new Date(`${value}T00:00:00.000Z`);
  return Number.isFinite(date.getTime()) && date.toISOString().slice(0, 10) === value;
}

function normalizeMetadata(input = {}) {
  const list = value => Array.isArray(value)
    ? [...new Set(value.map(item => String(item || '').trim()).filter(Boolean))].slice(0, 24)
    : [];
  const externalLinks = Array.isArray(input.externalLinks) ? input.externalLinks.slice(0, 12).flatMap(link => {
    const label = String(link?.label || '').trim().slice(0, 60);
    const url = String(link?.url || '').trim();
    try { return label && new URL(url).protocol === 'https:' ? [{ label, url: new URL(url).href.slice(0, 500) }] : []; }
    catch { return []; }
  }) : [];
  return {
    characters: list(input.characters), objects: list(input.objects), themes: list(input.themes),
    colors: list(input.colors), searchTerms: list(input.searchTerms),
    spokenText: String(input.spokenText || '').trim().slice(0, 8000), externalLinks
  };
}

async function readJson(bucket, key) {
  const object = await bucket.get(key);
  if (!object) return null;
  try { return await object.json(); } catch { throw new Error('invalid_json'); }
}

async function listR2(bucket, prefix, suffix) {
  const records = [];
  let cursor;
  do {
    const page = await bucket.list({ prefix, cursor, limit: 1000 });
    for (const object of page.objects) {
      if (suffix && !object.key.endsWith(suffix)) continue;
      try {
        const record = await readJson(bucket, object.key);
        if (record && ID_PATTERN.test(record.id || '')) records.push(record);
      } catch { /* Bad old metadata must not take the whole manager down. */ }
    }
    cursor = page.truncated ? page.cursor : undefined;
  } while (cursor);
  return records;
}

async function staticCatalog(request) {
  const response = await fetch(new URL('/episodes.json', request.url), { headers: { Accept: 'application/json' }, cf: { cacheTtl: 30 } });
  if (!response.ok) throw new Error('catalog_unavailable');
  const catalog = await response.json();
  return Array.isArray(catalog.episodes) ? catalog.episodes : [];
}

function editableRecord(record, override = null, source = 'catalog') {
  const metadata = { ...(record.metadata || {}), ...(override?.metadata || {}) };
  const today = todayInSantoDomingo();
  const baseStatus = override?.status || record.status || 'unpublished';
  const publishedAt = override?.publishedAt || record.publishedAt || '';
  const unpublishAt = override?.unpublishAt || record.unpublishAt || '';
  const status = unpublishAt && unpublishAt <= today ? 'unpublished' : baseStatus === 'scheduled' && publishedAt <= today ? 'published' : baseStatus;
  return {
    id: record.id,
    episodeNumber: override?.episodeNumber ?? record.episodeNumber ?? null,
    title: override?.title || record.title || { es: 'Episodio sin título', en: '' },
    status,
    publishedAt,
    unpublishAt,
    type: record.type || 'comic',
    panelCount: record.panels?.length || 0,
    thumbnail: record.panels?.[0]?.src || record.panels?.[0]?.asset || '',
    characters: metadata.characters || record.characters || [],
    objects: metadata.objects || record.objects || [],
    themes: metadata.themes || [],
    colors: metadata.colors || [],
    searchTerms: metadata.searchTerms || [],
    spokenText: metadata.spokenText || '',
    externalLinks: metadata.externalLinks || record.source?.externalLinks || [],
    sourceType: source,
    projectId: record.projectId || null,
    exportTemplate: record.exportTemplate || 'classic'
  };
}

async function readAll(context) {
  const { request, env } = context;
  if (!env.MANDARINITA_PROJECTS) return { response: json({ error: 'El almacenamiento de episodios no está disponible.' }, 503) };
  try {
    const [catalog, overrides, manifests] = await Promise.all([
      staticCatalog(request), listR2(env.MANDARINITA_PROJECTS, OVERRIDES, '.json'), listR2(env.MANDARINITA_PROJECTS, ROOT, '/manifest.json')
    ]);
    const overrideById = new Map(overrides.map(entry => [entry.id, entry]));
    const entries = catalog.filter(entry => entry.type === 'comic' && entry.complete === true && entry.status === 'published')
      .map(entry => editableRecord(entry, overrideById.get(entry.id), 'catalog'));
    const known = new Set(entries.map(entry => entry.id));
    for (const override of overrides) {
      if (known.has(override.id)) continue;
      const source = catalog.find(entry => entry.id === override.id);
      if (source) { entries.push(editableRecord(source, override, 'catalog')); known.add(source.id); }
    }
    for (const manifest of manifests) {
      entries.push(editableRecord(manifest, null, 'editor'));
      known.add(manifest.id);
    }
    entries.sort((a, b) => (Number(b.episodeNumber) || 0) - (Number(a.episodeNumber) || 0) || a.id.localeCompare(b.id));
    return { entries, catalog, overrides: overrideById, manifests: new Map(manifests.map(entry => [entry.id, entry])) };
  } catch (error) {
    console.error('Episode management list could not be read', { name: error?.name || 'Error' });
    return { response: json({ error: 'No se pudo cargar el catálogo de episodios. Intenta actualizar el editor.' }, 503) };
  }
}

export async function onRequestGet(context) {
  const auth = await authorizeProjectRequest(context);
  if (auth.response) return auth.response;
  const data = await readAll(context);
  if (data.response) return data.response;
  return json({ episodes: data.entries }, 200, { 'Cache-Control': 'private, no-store' });
}

export async function onRequestPatch(context) {
  const auth = await authorizeProjectRequest(context, true);
  if (auth.response) return auth.response;
  const { request, env } = context;
  let input;
  try { input = await request.json(); } catch { return json({ error: 'Los cambios no tienen un formato válido.' }, 400); }
  const id = String(input?.id || '');
  if (!ID_PATTERN.test(id)) return json({ error: 'El identificador del episodio no es válido.' }, 400);
  const title = { es: String(input?.title?.es || '').trim(), en: String(input?.title?.en || '').trim() };
  const status = String(input?.status || '');
  const requestedPublishedAt = String(input?.publishedAt || '');
  const unpublishAt = input?.unpublishAt ? String(input.unpublishAt) : null;
  const episodeNumber = Number(input?.episodeNumber);
  if (!STATUSES.has(status)) return json({ error: 'Elige Publicado, Programado o No publicado.' }, 400);
  if (!Number.isInteger(episodeNumber) || episodeNumber < 1 || episodeNumber > 9999) return json({ error: 'El número debe estar entre 1 y 9999.' }, 400);
  if (!title.es || title.es.length > 180 || title.en.length > 180) return json({ error: 'El título en español es obligatorio; ambos títulos admiten hasta 180 caracteres.' }, 400);
  if (requestedPublishedAt && !validDate(requestedPublishedAt)) return json({ error: 'Revisa la fecha de publicación.' }, 400);

  const data = await readAll(context);
  if (data.response) return data.response;
  const target = data.entries.find(entry => entry.id === id);
  if (!target) return json({ error: 'No encontramos el episodio en el catálogo actual.' }, 404);
  const publishedAt = requestedPublishedAt || target.publishedAt || '';
  if (status === 'scheduled' && (!validDate(publishedAt) || publishedAt <= todayInSantoDomingo())) return json({ error: 'Para programarlo, elige una fecha futura.' }, 400);
  if (unpublishAt && (!validDate(unpublishAt) || (publishedAt && unpublishAt <= publishedAt))) return json({ error: 'La fecha para retirar el episodio debe ser posterior a la fecha de publicación.' }, 400);
  const duplicate = data.entries.find(entry => entry.id !== id && Number(entry.episodeNumber) === episodeNumber);
  if (duplicate) return json({ error: `El episodio ${episodeNumber} ya está asignado a «${duplicate.title.es}».` }, 409);

  const today = todayInSantoDomingo();
  const effectiveStatus = status === 'scheduled' && publishedAt <= today ? 'published' : status;
  const update = {
    id, episodeNumber, title, status: effectiveStatus, publishedAt, unpublishAt,
    metadata: normalizeMetadata(input?.metadata), updatedAt: new Date().toISOString()
  };
  const key = target.sourceType === 'editor' ? `${ROOT}${id}/manifest.json` : `${OVERRIDES}${id}.json`;
  try {
    const stored = target.sourceType === 'editor' ? data.manifests.get(id) : data.overrides.get(id);
    const next = target.sourceType === 'editor' ? { ...stored, ...update } : update;
    await env.MANDARINITA_PROJECTS.put(key, JSON.stringify(next), {
      httpMetadata: { contentType: 'application/json; charset=utf-8', cacheControl: 'no-store' },
      customMetadata: { episodeId: id, episodeNumber: String(episodeNumber), status: effectiveStatus, publishedAt, unpublishAt: unpublishAt || '' }
    });
    return json({ ok: true, episode: editableRecord(next, null, target.sourceType) });
  } catch (error) {
    console.error('Episode editorial changes could not be saved', { name: error?.name || 'Error', episodeId: id });
    return json({ error: 'No se pudieron guardar los cambios. El episodio mantiene su estado anterior.' }, 503);
  }
}
