import { json } from '../_lib/session.js';

const FIELD_COLUMNS = [
  ['hero.eyebrow', 'eyebrow_es', 'eyebrow_en'],
  ['hero.title.first', 'title_first_es', 'title_first_en'],
  ['hero.title.second', 'title_second_es', 'title_second_en'],
  ['hero.description', 'description_es', 'description_en'],
  ['hero.cta', 'cta_es', 'cta_en'],
  ['hero.image', 'image_path', 'image_path'],
  ['hero.effect', 'effect', 'effect'],
  ['hero.image.alt', 'alt_es', 'alt_en'],
  ['hero.mediaType', 'media_type', 'media_type'],
  ['hero.episode', 'episode_id', 'episode_id'],
  ['hero.mediaStyle', 'media_style', 'media_style'],
  ['hero.mediaShadow', 'media_shadow', 'media_shadow'],
  ['hero.isNew', 'is_new', 'is_new'],
  ['hero.stickers', 'stickers_json', 'stickers_json'],
  ['hero.startAt', 'starts_at', 'starts_at'],
  ['hero.endAt', 'ends_at', 'ends_at']
];

function toBanner(row) {
  const fields = {};
  for (const [key, esColumn, enColumn] of FIELD_COLUMNS) {
    fields[key] = { es: row[esColumn], en: row[enColumn] };
  }
  return { id: row.id, position: row.position, fields, ctaHref: row.cta_href };
}

export async function onRequestGet({ env }) {
  if (!env.MANDARINITA_INBOX) return json({ content: {} });
  try {
    const result = await env.MANDARINITA_INBOX.prepare(
      'SELECT * FROM hero_banners WHERE enabled = 1 ORDER BY position, created_at'
    ).all();
    const banners = (result.results || []).map(toBanner);
    return json({ banners, content: banners[0]?.fields || {} });
  } catch (error) {
    console.error('Public hero banners could not be read', { name: error?.name || 'Error' });
    return json({ banners: [], content: {} });
  }
}
