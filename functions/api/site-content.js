import { json } from '../_lib/session.js';

const PUBLIC_KEYS = new Set([
  'hero.eyebrow',
  'hero.title.first',
  'hero.title.second',
  'hero.description',
  'hero.cta',
  'hero.image',
  'hero.effect',
  'hero.image.alt'
]);

export async function onRequestGet({ env }) {
  if (!env.MANDARINITA_INBOX) return json({ content: {} });
  try {
    const result = await env.MANDARINITA_INBOX.prepare(
      'SELECT content_key, es, en FROM site_content'
    ).all();
    const content = {};
    for (const row of result.results || []) {
      if (PUBLIC_KEYS.has(row.content_key)) content[row.content_key] = { es: row.es, en: row.en };
    }
    return json({ content });
  } catch (error) {
    console.error('Public site content could not be read', { name: error?.name || 'Error' });
    return json({ content: {} });
  }
}
