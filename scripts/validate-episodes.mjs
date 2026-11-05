import { readFileSync, existsSync } from 'node:fs';
import { resolve, dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const path = join(root, 'episodes.json');
const characterPath = join(root, 'characters.json');
const errors = [];
const allowedStatuses = new Set(['draft', 'review', 'published', 'hidden']);
const allowedTypes = new Set(['comic', 'illustration', 'reel', 'merchandise', 'other']);
const text = v => typeof v === 'string' && v.trim().length > 0;
const content = JSON.parse(readFileSync(path, 'utf8'));
const characterCatalog = JSON.parse(readFileSync(characterPath, 'utf8'));
const characterIds = new Set();
if (characterCatalog.schemaVersion !== 1 || !Array.isArray(characterCatalog.characters)) errors.push('Invalid characters.json registry');
for (const [index, character] of (characterCatalog.characters || []).entries()) {
  if (!text(character.id) || !/^[a-z0-9][a-z0-9-]*$/.test(character.id)) errors.push(`characters[${index}]: invalid ID`);
  if (characterIds.has(character.id)) errors.push(`characters[${index}]: duplicate ID`);
  if (!text(character.name)) errors.push(`characters[${index}]: name required`);
  characterIds.add(character.id);
}
if (content.schemaVersion !== 1) errors.push('Unsupported schemaVersion');
if (!Array.isArray(content.episodes)) errors.push('episodes must be an array');
if (content.editorialPolicy !== 'manual-approval') errors.push('editorialPolicy must be manual-approval');
const ids = new Set();
const mediaIds = new Set();
for (const [index, ep] of (content.episodes || []).entries()) {
  const tag = `episodes[${index}]`;
  if (!text(ep.id) || !/^[a-z0-9][a-z0-9-]*$/.test(ep.id)) errors.push(`${tag}: invalid ID`);
  if (ids.has(ep.id)) errors.push(`${tag}: duplicate ID`);
  ids.add(ep.id);
  if (!allowedStatuses.has(ep.status)) errors.push(`${tag}: invalid status`);
  if (!allowedTypes.has(ep.type)) errors.push(`${tag}: invalid type`);
  if (ep.status === 'published' && ep.type === 'comic' && ep.complete !== true) errors.push(`${tag}: published comic must be explicitly complete`);
  if (ep.complete !== undefined && typeof ep.complete !== 'boolean') errors.push(`${tag}: complete must be a boolean`);
  if (ep.characters !== undefined) {
    if (!Array.isArray(ep.characters)) errors.push(`${tag}: characters must be an array of character IDs`);
    else {
      const episodeCharacterIds = new Set();
      for (const characterId of ep.characters) {
        if (!characterIds.has(characterId)) errors.push(`${tag}: unknown character ID ${characterId}`);
        if (episodeCharacterIds.has(characterId)) errors.push(`${tag}: duplicate character ID ${characterId}`);
        episodeCharacterIds.add(characterId);
      }
    }
  }
  if (ep.publishedAt !== undefined && !/^\d{4}-\d{2}-\d{2}$/.test(ep.publishedAt)) errors.push(`${tag}: publishedAt must use YYYY-MM-DD`);
  if (ep.source?.kind === 'notion-archive' && !/^https:\/\/app\.notion\.com\/p\/[a-f0-9]{32}$/.test(ep.source.notionUrl || '')) errors.push(`${tag}: invalid Notion archive link`);
  if (!text(ep.title?.es)) errors.push(`${tag}: Spanish title required`);
  if (ep.episodeNumber !== null && (!Number.isInteger(ep.episodeNumber) || ep.episodeNumber < 1)) errors.push(`${tag}: episodeNumber must be null or positive integer`);
  if (!Array.isArray(ep.panels) || !ep.panels.length) errors.push(`${tag}: at least one panel required`);
  const mediaId = ep.source?.instagramMediaId;
  if (mediaId != null) {
    if (!text(mediaId)) errors.push(`${tag}: invalid Instagram media ID`);
    if (mediaIds.has(mediaId)) errors.push(`${tag}: duplicate Instagram media ID`);
    mediaIds.add(mediaId);
  }
  const originalPositions = new Set();
  for (const [j, panel] of (ep.panels || []).entries()) {
    if (panel.originalPosition !== undefined) {
      if (!Number.isInteger(panel.originalPosition) || panel.originalPosition < 1 || originalPositions.has(panel.originalPosition)) errors.push(`${tag}: invalid or duplicate originalPosition`);
      originalPositions.add(panel.originalPosition);
    }
    if (panel.order !== j + 1) errors.push(`${tag}: panels must have sequential order starting at 1`);
    if (!text(panel.alt?.es)) errors.push(`${tag}: missing Spanish alt text`);
    if (!text(panel.src) || panel.src.startsWith('/') || panel.src.includes('..') || /^[a-z]+:/i.test(panel.src)) {
      errors.push(`${tag}: panel src must be a safe local relative path`);
    } else if (!/^assets\/[a-zA-Z0-9/_.-]+\.(png|jpg|jpeg|webp)$/i.test(panel.src)) {
      errors.push(`${tag}: panel must use a local image under assets/`);
    } else if (!existsSync(join(root, panel.src))) errors.push(`${tag}: missing asset ${panel.src}`);
    if (panel.sourceSrc !== undefined) {
      if (!text(panel.sourceSrc) || panel.sourceSrc.startsWith('/') || panel.sourceSrc.includes('..') || /^[a-z]+:/i.test(panel.sourceSrc) || !/^assets\/[a-zA-Z0-9/_.-]+\.(png|jpg|jpeg|webp)$/i.test(panel.sourceSrc)) errors.push(`${tag}: sourceSrc must be a safe local relative path under assets/`);
      else if (!existsSync(join(root, panel.sourceSrc))) errors.push(`${tag}: missing original asset ${panel.sourceSrc}`);
    }
    for (const key of ['watermarkedSrc', 'watermarkedThumbnailSrc']) {
      const derivative = panel[key];
      if (ep.status === 'published' && ep.type === 'comic' && !derivative) errors.push(`${tag}: published comic panel needs ${key}`);
      if (derivative !== undefined) {
        if (!text(derivative) || derivative.startsWith('/') || derivative.includes('..') || /^[a-z]+:/i.test(derivative) || !/^assets\/watermarked\/[a-zA-Z0-9/_.-]+\.webp$/i.test(derivative)) errors.push(`${tag}: ${key} must be a safe watermarked WebP path`);
        else if (!existsSync(join(root, derivative))) errors.push(`${tag}: missing watermarked asset ${derivative}`);
      }
    }
  }
}
if (errors.length) { console.error(errors.join('\n')); process.exitCode = 1; }
else console.log(`OK: ${content.episodes.length} entries valid; ${content.episodes.filter(e => e.status === 'published').length} published.`);
