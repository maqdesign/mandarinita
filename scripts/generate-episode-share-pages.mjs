#!/usr/bin/env node
// Build small JPEG social previews and static Open Graph pages for published comics.
// Run from the repository root after updating episodes.json.
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { spawnSync } from 'node:child_process';

const ROOT = process.cwd();
const SITE = 'https://mandarinita.art';
const catalog = JSON.parse(await readFile(path.join(ROOT, 'episodes.json'), 'utf8'));
if (catalog.schemaVersion !== 1 || catalog.editorialPolicy !== 'manual-approval' || !Array.isArray(catalog.episodes)) {
  throw new Error('The episode catalog is invalid.');
}
const comics = catalog.episodes.filter(entry => entry.status === 'published' && entry.type === 'comic' && entry.complete === true && Array.isArray(entry.panels) && entry.panels.length > 0);
const imageDir = path.join(ROOT, 'assets', 'episode-previews');
await mkdir(imageDir, { recursive: true });
await mkdir(path.join(ROOT, 'share', 'en'), { recursive: true });
const html = value => String(value ?? '').replace(/[&<>"']/g, char => ({ '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;' }[char]));
const localizedTitle = (entry, language) => {
  const translated = entry.title?.[language];
  if (language === 'en' && /^episode\s+\d+$/i.test(translated || '')) return entry.title?.es || translated;
  return translated || entry.title?.es || `Episode ${entry.episodeNumber || ''}`.trim();
};
const MAGICK = spawnSync('magick', ['-version'], { encoding: 'utf8' }).status === 0 ? 'magick' : 'convert';
const runMagick = (source, destination) => {
  const result = spawnSync(MAGICK, [source, '-auto-orient', '-strip', '-resize', '1200x1200>', '-background', '#ffffff', '-alpha', 'remove', '-quality', '82', destination], { encoding: 'utf8' });
  if (result.error || result.status !== 0) throw new Error(`Could not create share preview for ${source}: ${result.stderr || result.error?.message || 'ImageMagick failed'}`);
};
const makePage = (entry, panelCount, language) => {
  const title = localizedTitle(entry, language);
  const episodeText = language === 'en' ? `Episode ${entry.episodeNumber}` : `Episodio ${entry.episodeNumber}`;
  const fullTitle = `${episodeText} · ${title} — Mandarinita®`;
  const description = language === 'en'
    ? `Read ${panelCount} comic panels from ${title} in the Mandarinita archive.`
    : `Lee las ${panelCount} viñetas de «${title}» en el archivo de Mandarinita.`;
  const previewAlt = language === 'en' ? `Cover panel from ${title}` : `Primera viñeta de «${title}»`;
  const sharePath = language === 'en' ? `/share/en/${entry.id}.html` : `/share/${entry.id}.html`;
  const redirectPath = `/episodios.html?episode=${encodeURIComponent(entry.id)}&lang=${language}`;
  const locale = language === 'en' ? 'en_US' : 'es_DO';
  return `<!doctype html>
<html lang="${language}"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<title>${html(fullTitle)}</title><meta name="description" content="${html(description)}"><meta name="robots" content="noindex,follow">
<link rel="canonical" href="${SITE}${sharePath}"><meta property="og:site_name" content="Mandarinita®"><meta property="og:type" content="article"><meta property="og:locale" content="${locale}"><meta property="og:url" content="${SITE}${sharePath}"><meta property="og:title" content="${html(fullTitle)}"><meta property="og:description" content="${html(description)}"><meta property="og:image" content="${SITE}/assets/episode-previews/${entry.id}.jpg"><meta property="og:image:secure_url" content="${SITE}/assets/episode-previews/${entry.id}.jpg"><meta property="og:image:type" content="image/jpeg"><meta property="og:image:alt" content="${html(previewAlt)}">
<meta name="twitter:card" content="summary_large_image"><meta name="twitter:title" content="${html(fullTitle)}"><meta name="twitter:description" content="${html(description)}"><meta name="twitter:image" content="${SITE}/assets/episode-previews/${entry.id}.jpg"><meta name="twitter:image:alt" content="${html(previewAlt)}">
<style>body{margin:0;min-height:100vh;display:grid;place-items:center;background:#fff7e9;color:#35251f;font:16px/1.5 system-ui,sans-serif}.card{width:min(420px,calc(100% - 32px));padding:24px;border:1px solid #ead9c4;border-radius:22px;background:#fff;text-align:center}.card img{width:min(220px,70%);height:auto;border-radius:12px}.card h1{font-size:1.35rem}.card a{display:inline-block;padding:12px 18px;border-radius:999px;background:#f87209;color:#fff;text-decoration:none;font-weight:700}</style>
</head><body><main class="card"><img src="/assets/episode-previews/${entry.id}.jpg" alt="${html(previewAlt)}"><h1>${html(fullTitle)}</h1><p>${html(description)}</p><a href="${redirectPath}">${language === 'en' ? 'Read episode' : 'Leer episodio'}</a></main><script>setTimeout(()=>location.replace(${JSON.stringify(redirectPath)}),180)</script></body></html>
`;
};
for (const entry of comics) {
  if (!/^[a-z0-9-]+$/.test(entry.id)) throw new Error(`Invalid episode id: ${entry.id}`);
  const panels = [...entry.panels].sort((a, b) => a.order - b.order);
  const source = path.join(ROOT, panels[0].watermarkedSrc || panels[0].src);
  const imagePath = path.join(imageDir, `${entry.id}.jpg`);
  runMagick(source, imagePath);
  await writeFile(path.join(ROOT, 'share', `${entry.id}.html`), makePage(entry, panels.length, 'es'));
  await writeFile(path.join(ROOT, 'share', 'en', `${entry.id}.html`), makePage(entry, panels.length, 'en'));
}
console.log(`Generated ${comics.length} episode previews and ${comics.length * 2} share pages.`);
