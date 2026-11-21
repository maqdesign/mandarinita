import { isAuthConfigured, json, readSession } from '../../_lib/session.js';

const FIELD_COLUMNS = [
  ['hero.eyebrow', 'eyebrow_es', 'eyebrow_en', 'text', 100],
  ['hero.title.first', 'title_first_es', 'title_first_en', 'text', 80],
  ['hero.title.second', 'title_second_es', 'title_second_en', 'text', 80],
  ['hero.description', 'description_es', 'description_en', 'text', 420],
  ['hero.cta', 'cta_es', 'cta_en', 'text', 70],
  ['hero.image', 'image_path', 'image_path', 'image', 300],
  ['hero.effect', 'effect', 'effect', 'effect', 20],
  ['hero.image.alt', 'alt_es', 'alt_en', 'text', 300],
  ['hero.mediaType', 'media_type', 'media_type', 'media-type', 10],
  ['hero.episode', 'episode_id', 'episode_id', 'episode', 100],
  ['hero.mediaStyle', 'media_style', 'media_style', 'media-style', 20],
  ['hero.mediaShadow', 'media_shadow', 'media_shadow', 'media-shadow', 20],
  ['hero.isNew', 'is_new', 'is_new', 'boolean', 5],
  ['hero.stickers', 'stickers_json', 'stickers_json', 'stickers', 3000],
  ['hero.startAt', 'starts_at', 'starts_at', 'schedule', 40],
  ['hero.endAt', 'ends_at', 'ends_at', 'schedule', 40]
];
const IMAGE_PATH = /^(?:assets\/[A-Za-z0-9._/-]+\.(?:png|webp|jpe?g)|\/api\/site-content\/image\/(?:site-content\/hero\/)?[0-9a-f-]{36}\.(?:png|webp|jpg)|\/api\/published-episodes\/ep-[A-Za-z0-9_-]{1,96}\/[1-9][0-9]?\.png\?v=[0-9a-f-]{36})$/i;
const CONTROL_CHARACTERS = /[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/;
const COLUMNS = [
  'id', 'position', 'enabled', 'eyebrow_es', 'eyebrow_en',
  'title_first_es', 'title_first_en', 'title_second_es', 'title_second_en',
  'description_es', 'description_en', 'cta_es', 'cta_en', 'image_path',
  'effect', 'alt_es', 'alt_en', 'media_type', 'episode_id', 'media_style', 'media_shadow', 'is_new', 'stickers_json', 'starts_at', 'ends_at', 'cta_href', 'created_at', 'updated_at'
];
const BANNER_STICKER_ASSETS = new Set([
  'assets/characters/aguacatelo-transparent.png', 'assets/characters/greg-transparent.webp',
  'assets/characters/limon-agrio-transparent.webp', 'assets/characters/mando-transparent.webp',
  'assets/characters/mandy-transparent.webp', 'assets/characters/morita.png',
  'assets/characters/sra-pera-transparent.webp', 'assets/characters/champi-transparent.webp',
  'assets/characters/cherrys-transparent.webp', 'assets/characters/don-guineo-transparent.webp',
  'assets/characters/don-pepino-transparent.webp', 'assets/characters/manzanillo-transparent.webp',
  'assets/characters/sandy-transparent.webp', 'assets/characters/superfreso-transparent.webp',
  'assets/stickers/sticker-pack-02.webp', 'assets/stickers/sticker-pack-03.webp',
  'assets/stickers/sticker-pack-04.webp', 'assets/stickers/sticker-pack-06.webp',
  'assets/stickers/sticker-pack-07.webp'
]);

async function authorize({ request, env }, write = false) {
  if (!isAuthConfigured(env)) return { response: json({ error: 'La administración privada no está configurada.' }, 503) };
  const session = await readSession(request, env.SESSION_SECRET);
  if (!session || session.email !== env.MANDARINITA_SYNC_EMAIL.trim().toLowerCase()) {
    return { response: json({ error: 'Inicia sesión con tu cuenta autorizada de GitHub.' }, 401) };
  }
  if (write && request.headers.get('Origin') !== new URL(request.url).origin) return { response: json({ error: 'Origen no permitido.' }, 403) };
  if (!env.MANDARINITA_INBOX) return { response: json({ error: 'La base de contenido no está conectada en este entorno.' }, 503) };
  return { db: env.MANDARINITA_INBOX, session };
}

function fromRow(row) {
  const fields = {};
  for (const [key, esColumn, enColumn] of FIELD_COLUMNS) {
    fields[key] = { es: row[esColumn], en: row[enColumn] };
  }
  return { id: row.id, position: row.position, enabled: Boolean(row.enabled), fields, ctaHref: row.cta_href };
}

function normalizeBanner(banner, { allowIncomplete = false } = {}) {
  if (!banner || typeof banner.id !== 'string' || !/^[a-z0-9-]{1,50}$/i.test(banner.id) || typeof banner.enabled !== 'boolean' || !banner.fields || typeof banner.fields !== 'object') {
    return { error: 'Uno de los banners no tiene el formato esperado.' };
  }
  const expectedKeys = FIELD_COLUMNS.map(([key]) => key);
  if (Object.keys(banner.fields).length !== expectedKeys.length || expectedKeys.some(key => !Object.hasOwn(banner.fields, key))) {
    return { error: 'Faltan campos en uno de los banners.' };
  }
  const row = { id: banner.id, enabled: banner.enabled ? 1 : 0, cta_href: '#historietas' };
  for (const [key, esColumn, enColumn, type, maxLength] of FIELD_COLUMNS) {
    const value = banner.fields[key];
    if (!value || typeof value.es !== 'string' || typeof value.en !== 'string') return { error: 'Completa los textos en español e inglés de cada banner.' };
    const es = value.es.trim();
    const en = value.en.trim();
    const optionalSchedule = type === 'schedule';
    const optionalEpisodeForImage = type === 'episode' && row.media_type === 'image';
    if ((!allowIncomplete && !optionalSchedule && !optionalEpisodeForImage && (!es || !en)) || es.length > maxLength || en.length > maxLength || CONTROL_CHARACTERS.test(es) || CONTROL_CHARACTERS.test(en)) {
      return { error: `Revisa el contenido de “${key}”: no puede estar vacío ni superar ${maxLength} caracteres.` };
    }
    // Localized text has separate database columns and may differ by language.
    // Only fields stored in one shared column must match between the form values.
    if (esColumn === enColumn && !optionalEpisodeForImage && es !== en) return { error: `Los valores de “${key}” deben coincidir.` };
    if (type === 'image' && (es !== en || (!allowIncomplete || es) && (!IMAGE_PATH.test(es) || es.split('/').includes('..')))) return { error: 'Sube una imagen válida para este banner antes de guardar.' };
    if (type === 'effect' && (es !== en || !['orbit', 'still'].includes(es))) return { error: 'Elige un movimiento disponible para cada banner.' };
    if (type === 'media-type' && !['image', 'episode'].includes(es)) return { error: 'Elige si el banner muestra una imagen o un episodio.' };
    if (type === 'episode' && row.media_type === 'episode' && es && !/^[a-z0-9-]{1,100}$/i.test(es)) return { error: 'El episodio seleccionado no tiene un identificador válido.' };
    if (type === 'media-style' && !['straight', 'tilt-left', 'tilt-right'].includes(es)) return { error: 'Elige una inclinación disponible.' };
    if (type === 'media-shadow' && !['none', 'soft', 'lifted'].includes(es)) return { error: 'Elige una sombra disponible.' };
    if (type === 'boolean' && !['true', 'false'].includes(es)) return { error: 'Revisa si el banner debe anunciarse como episodio nuevo.' };
    if (type === 'stickers') {
      let stickers;
      try { stickers = JSON.parse(es); } catch { return { error: 'Revisa los personajes y stickers del banner.' }; }
      if (en !== es || !Array.isArray(stickers) || stickers.length > 4) return { error: 'El banner admite hasta cuatro personajes o stickers.' };
      for (const sticker of stickers) {
        if (!sticker || typeof sticker !== 'object' || !BANNER_STICKER_ASSETS.has(sticker.asset)
          || typeof sticker.name !== 'string' || sticker.name.length > 80
          || typeof sticker.alt !== 'string' || sticker.alt.length > 200
          || !Number.isInteger(sticker.x) || sticker.x < 5 || sticker.x > 95
          || !Number.isInteger(sticker.y) || sticker.y < 5 || sticker.y > 95
          || !Number.isInteger(sticker.size) || sticker.size < 8 || sticker.size > 45
          || !Number.isInteger(sticker.rotation) || sticker.rotation < -12 || sticker.rotation > 12) {
          return { error: 'Uno de los stickers tiene una imagen o posición no válida.' };
        }
      }
      row[esColumn] = JSON.stringify(stickers);
      continue;
    }
    if (type === 'schedule' && es && (!/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/.test(es)
      || !Number.isFinite(Date.parse(es)) || new Date(es).toISOString() !== es)) return { error: 'Revisa la fecha programada del banner.' };
    row[esColumn] = optionalEpisodeForImage ? '' : es;
    row[enColumn] = optionalEpisodeForImage ? '' : en;
  }
  if (!allowIncomplete && row.media_type === 'episode' && !row.episode_id) return { error: 'Selecciona el episodio que quieres destacar.' };
  if (!allowIncomplete && row.starts_at && row.ends_at && Date.parse(row.ends_at) <= Date.parse(row.starts_at)) return { error: 'La fecha de fin debe ser posterior a la fecha de inicio.' };
  row.cta_href = row.media_type === 'episode' ? `/?episode=${encodeURIComponent(row.episode_id)}` : '#historietas';
  return { row };
}

export async function onRequestGet(context) {
  const auth = await authorize(context);
  if (auth.response) return auth.response;
  const result = await auth.db.prepare('SELECT * FROM hero_banners ORDER BY position, created_at').all();
  return json({ banners: (result.results || []).map(fromRow) });
}

export async function onRequestPost(context) {
  const auth = await authorize(context, true);
  if (auth.response) return auth.response;
  let sourceId = '';
  let body = {};
  try {
    body = await context.request.json();
    if (typeof body?.sourceId === 'string' && /^[a-z0-9-]{1,50}$/i.test(body.sourceId)) sourceId = body.sourceId;
  } catch { /* An empty body creates a copy of the first banner, preserving the add-banner behavior. */ }
  if (body?.episodeBanner) return createEpisodeBanner(context, auth.db, body.episodeBanner);
  const result = sourceId
    ? await auth.db.prepare('SELECT * FROM hero_banners WHERE id = ?').bind(sourceId).first()
    : await auth.db.prepare('SELECT * FROM hero_banners ORDER BY position, created_at LIMIT 1').first();
  if (!result) return sourceId
    ? json({ error: 'El banner que quieres copiar ya no está disponible.' }, 404)
    : json({ error: 'Primero debe existir el banner principal.' }, 409);
  const count = await auth.db.prepare('SELECT COUNT(*) AS total, COALESCE(MAX(position), -1) AS last_position FROM hero_banners').first();
  if (count.total >= 8) return json({ error: 'Por ahora puedes tener hasta 8 banners.' }, 409);
  const id = crypto.randomUUID();
  const now = new Date().toISOString();
  const clone = fromRow(result);
  const row = {
    ...Object.fromEntries(FIELD_COLUMNS.flatMap(([, es, en]) => [[es, result[es]], [en, result[en]]])),
    id, position: count.last_position + 1, enabled: 0, cta_href: result.cta_href, created_at: now, updated_at: now
  };
  await auth.db.prepare(`INSERT INTO hero_banners (${COLUMNS.join(', ')}) VALUES (${COLUMNS.map(() => '?').join(', ')})`)
    .bind(...COLUMNS.map(column => row[column])).run();
  return json({ ok: true, banner: { ...clone, id, position: row.position, enabled: false } }, 201);
}

async function createEpisodeBanner(context, db, input) {
  const episodeId = String(input?.episodeId || '');
  if (!/^ep-[A-Za-z0-9_-]{1,96}$/.test(episodeId)) return json({ error: 'El episodio para el banner no tiene un identificador válido.' }, 400);
  const bucket = context.env.MANDARINITA_PROJECTS;
  if (!bucket) return json({ error: 'El almacenamiento de episodios no está conectado en este entorno.' }, 503);
  let manifest;
  try {
    const object = await bucket.get(`published/episodes/${episodeId}/manifest.json`);
    manifest = object ? await object.json() : null;
  } catch { return json({ error: 'No se pudo comprobar el episodio publicado.' }, 503); }
  if (!manifest || manifest.id !== episodeId || manifest.complete !== true
    || !['published', 'scheduled'].includes(manifest.status) || !Array.isArray(manifest.panels) || !manifest.panels.length) {
    return json({ error: 'Publica primero el episodio antes de crear su banner.' }, 409);
  }
  const prior = await db.prepare("SELECT id FROM hero_banners WHERE media_type = 'episode' AND episode_id = ? LIMIT 1").bind(episodeId).first();
  if (prior) return json({ ok: true, created: false, message: 'Este episodio ya tiene un banner.' });
  const count = await db.prepare('SELECT COUNT(*) AS total, COALESCE(MAX(position), -1) AS last_position FROM hero_banners').first();
  if (count.total >= 8) return json({ error: 'El carrusel ya tiene ocho banners. Quita o reutiliza uno antes de publicar otro.' }, 409);

  const episodeNumber = Number(manifest.episodeNumber);
  const titleEs = typeof manifest.title === 'string' ? manifest.title : String(manifest.title?.es || '').trim();
  const titleEn = typeof manifest.title === 'string' ? manifest.title : String(manifest.title?.en || titleEs).trim();
  const firstPanel = manifest.panels[0];
  const altEs = String(firstPanel?.alt?.es || titleEs || `Episodio ${episodeNumber}`).slice(0, 300);
  const altEn = String(firstPanel?.alt?.en || titleEn || `Episode ${episodeNumber}`).slice(0, 300);
  const descriptionEs = String(input.descriptionEs || `Una nueva historieta de Mandarinita, episodio ${episodeNumber}.`).trim().slice(0, 420);
  const descriptionEn = String(input.descriptionEn || `A new Mandarinita comic, episode ${episodeNumber}.`).trim().slice(0, 420);
  const startsAt = manifest.publishedAt ? `${manifest.publishedAt}T04:00:00.000Z` : '';
  const endsAt = manifest.unpublishAt ? `${manifest.unpublishAt}T04:00:00.000Z` : '';
  const fields = {
    'hero.eyebrow': { es: input.isNew ? 'Nuevo episodio' : 'Episodio destacado', en: input.isNew ? 'New episode' : 'Featured episode' },
    'hero.title.first': { es: `Episodio ${episodeNumber}`, en: `Episode ${episodeNumber}` },
    'hero.title.second': { es: titleEs, en: titleEn },
    'hero.description': { es: descriptionEs, en: descriptionEn },
    'hero.cta': { es: `Leer episodio ${episodeNumber}`, en: `Read episode ${episodeNumber}` },
    'hero.image': { es: `/api/published-episodes/${episodeId}/1.png?v=${manifest.revision}`, en: `/api/published-episodes/${episodeId}/1.png?v=${manifest.revision}` },
    'hero.effect': { es: 'still', en: 'still' },
    'hero.image.alt': { es: altEs, en: altEn },
    'hero.mediaType': { es: 'episode', en: 'episode' },
    'hero.episode': { es: episodeId, en: episodeId },
    'hero.mediaStyle': { es: 'tilt-right', en: 'tilt-right' },
    'hero.mediaShadow': { es: 'lifted', en: 'lifted' },
    'hero.isNew': { es: String(Boolean(input.isNew)), en: String(Boolean(input.isNew)) },
    'hero.stickers': { es: '[]', en: '[]' },
    'hero.startAt': { es: startsAt, en: startsAt },
    'hero.endAt': { es: endsAt, en: endsAt }
  };
  const id = crypto.randomUUID();
  const normalized = normalizeBanner({ id, enabled: true, position: count.last_position + 1, fields });
  if (normalized.error) return json({ error: `No se creó el banner: ${normalized.error}` }, 400);
  const row = { ...normalized.row, position: count.last_position + 1, created_at: new Date().toISOString(), updated_at: new Date().toISOString() };
  try {
    await db.prepare(`INSERT INTO hero_banners (${COLUMNS.join(', ')}) VALUES (${COLUMNS.map(() => '?').join(', ')})`)
      .bind(...COLUMNS.map(column => row[column])).run();
  } catch (error) {
    console.error('Episode banner could not be created', { name: error?.name || 'Error', episodeId });
    return json({ error: 'El episodio se publicó, pero no se pudo guardar su banner en la portada.' }, 503);
  }
  return json({ ok: true, created: true, banner: fromRow(row) }, 201);
}

export async function onRequestPatch(context) {
  const auth = await authorize(context, true);
  if (auth.response) return auth.response;
  let body;
  try { body = await context.request.json(); } catch { return json({ error: 'No pudimos leer el borrador.' }, 400); }
  const normalized = normalizeBanner(body?.banner, { allowIncomplete: true });
  if (normalized.error) return json({ error: normalized.error }, 400);
  const row = normalized.row;
  if (row.enabled) return json({ error: 'Activa el banner y guárdalo para publicarlo.' }, 409);
  const current = await auth.db.prepare('SELECT * FROM hero_banners WHERE id = ?').bind(row.id).first();
  if (!current) return json({ error: 'El borrador ya no existe. Recarga los banners e inténtalo de nuevo.' }, 404);
  if (current.enabled) return json({ error: 'Este banner está publicado. Usa Guardar cambios para modificarlo.' }, 409);
  row.position = current.position;
  row.created_at = current.created_at;
  row.updated_at = new Date().toISOString();
  const columns = COLUMNS.filter(column => !['id', 'position', 'enabled', 'created_at'].includes(column));
  const updated = await auth.db.prepare(`UPDATE hero_banners SET ${columns.map(column => `${column} = ?`).join(', ')} WHERE id = ? AND enabled = 0`)
    .bind(...columns.map(column => row[column]), row.id).run();
  if (!updated.meta?.changes) return json({ error: 'Este banner cambió mientras se guardaba. Recarga e inténtalo de nuevo.' }, 409);
  return json({ ok: true, banner: fromRow(row) });
}

export async function onRequestPut(context) {
  const auth = await authorize(context, true);
  if (auth.response) return auth.response;
  let body;
  try { body = await context.request.json(); } catch { return json({ error: 'No pudimos leer los cambios.' }, 400); }
  if (!Array.isArray(body?.banners) || body.banners.length < 1 || body.banners.length > 8) return json({ error: 'Mantén entre 1 y 8 banners.' }, 400);
  // A publish operation updates the selected active banner plus the full ordered list.
  // Keep inactive drafts eligible for incomplete content so one unfinished draft cannot
  // block publishing a different, complete banner.
  const normalized = body.banners.map(banner => normalizeBanner(banner, { allowIncomplete: banner?.enabled === false }));
  const invalidIndex = normalized.findIndex(item => item.error);
  if (invalidIndex >= 0) return json({ error: `Banner ${invalidIndex + 1}: ${normalized[invalidIndex].error}` }, 400);
  const rows = normalized.map(item => item.row);
  const ids = rows.map(row => row.id);
  if (new Set(ids).size !== ids.length) return json({ error: 'Hay banners repetidos en la lista.' }, 400);
  if (!rows.some(row => row.enabled)) return json({ error: 'Deja al menos un banner publicado.' }, 400);
  const current = await auth.db.prepare('SELECT id FROM hero_banners').all();
  const currentIds = (current.results || []).map(row => row.id).sort();
  if (JSON.stringify([...ids].sort()) !== JSON.stringify(currentIds)) return json({ error: 'La lista cambió en otra pestaña. Recarga los banners e inténtalo de nuevo.' }, 409);

  const now = new Date().toISOString();
  const updates = rows.map((row, position) => {
    row.position = position;
    row.updated_at = now;
    const setColumns = [...COLUMNS].filter(column => !['id', 'created_at'].includes(column));
    return auth.db.prepare(`UPDATE hero_banners SET ${setColumns.map(column => `${column} = ?`).join(', ')} WHERE id = ?`)
      .bind(...setColumns.map(column => row[column]), row.id);
  });
  await auth.db.batch(updates);
  return json({ ok: true, updatedAt: now, banners: rows.map(row => fromRow({ ...row, cta_href: row.cta_href })) });
}

export async function onRequestDelete(context) {
  const auth = await authorize(context, true);
  if (auth.response) return auth.response;
  let body;
  try { body = await context.request.json(); } catch { return json({ error: 'No pudimos leer la solicitud.' }, 400); }
  if (typeof body?.id !== 'string') return json({ error: 'Indica cuál banner quieres quitar.' }, 400);
  const banner = await auth.db.prepare('SELECT id, enabled FROM hero_banners WHERE id = ?').bind(body.id).first();
  if (!banner) return json({ error: 'Ese banner ya no existe.' }, 404);
  const counts = await auth.db.prepare('SELECT COUNT(*) AS total, SUM(enabled) AS active FROM hero_banners').first();
  if (counts.total < 2 || (banner.enabled && counts.active < 2)) return json({ error: 'Debe quedar al menos un banner publicado.' }, 409);
  await auth.db.prepare('DELETE FROM hero_banners WHERE id = ?').bind(body.id).run();
  const remaining = await auth.db.prepare('SELECT * FROM hero_banners ORDER BY position, created_at').all();
  const rows = remaining.results || [];
  await auth.db.batch(rows.map((row, position) => auth.db.prepare('UPDATE hero_banners SET position = ? WHERE id = ?').bind(position, row.id)));
  return json({ ok: true, banners: rows.map((row, position) => fromRow({ ...row, position })) });
}
