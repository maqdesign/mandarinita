import { readFileSync, existsSync } from 'node:fs';
import { resolve, dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const path = join(root, 'content/episodes.json');
const errors = [];
const allowedStatuses = new Set(['draft', 'review', 'published', 'hidden']);
const allowedTypes = new Set(['comic', 'illustration', 'reel', 'merchandise', 'other']);
const text = v => typeof v === 'string' && v.trim().length > 0;
const content = JSON.parse(readFileSync(path, 'utf8'));
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
    } else if (!/^assets\/[a-zA-Z0-9/_-]+\.(png|jpg|jpeg|webp)$/i.test(panel.src)) {
      errors.push(`${tag}: panel must use a local image under assets/`);
    } else if (!existsSync(join(root, panel.src))) errors.push(`${tag}: missing asset ${panel.src}`);
  }
}
if (errors.length) { console.error(errors.join('\n')); process.exitCode = 1; }
else console.log(`OK: ${content.episodes.length} entries valid; ${content.episodes.filter(e => e.status === 'published').length} published.`);
