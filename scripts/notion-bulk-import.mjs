#!/usr/bin/env node

import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { existsSync, mkdirSync, readFileSync, renameSync, rmSync, writeFileSync } from 'node:fs';
import { basename, dirname, extname, join, resolve } from 'node:path';
import { tmpdir } from 'node:os';
import { fileURLToPath, pathToFileURL } from 'node:url';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const API_VERSION = process.env.NOTION_API_VERSION || '2025-09-03';
const DEFAULT_DATA_SOURCE = 'aba9af28-3cfd-4c24-b16b-ab7864056c86';
const DATA_SOURCE_ID = (process.env.NOTION_DATA_SOURCE_ID || DEFAULT_DATA_SOURCE).replace(/^collection:\/\//, '');
const API = 'https://api.notion.com/v1';
const GENERIC_ART = /(?:^|[/_. -])(instagram|telegram|buymeacoffee|buy-me-a-coffee|tienda|wikipedia|facebook|youtube|tiktok|patreon)(?:[/_. -]|$)/i;
const IGNORED_FILES = new Set(['.ds_store', 'thumbs.db']);
const sleep = ms => new Promise(resolveSleep => setTimeout(resolveSleep, ms));

let lastNotionRequest = 0;

function plainText(items = []) {
  return items.map(item => item.plain_text || item.text?.content || '').join('').trim();
}

function pageTitle(page) {
  const properties = page.properties || {};
  for (const value of Object.values(properties)) {
    if (value?.type === 'title') return plainText(value.title);
  }
  return page.title || '';
}

function readProperty(page, name) {
  const property = page.properties?.[name];
  if (!property) return null;
  if (property.type === 'select' || property.type === 'status') return property[property.type]?.name || null;
  if (property.type === 'multi_select') return (property.multi_select || []).map(item => item.name);
  if (property.type === 'rich_text') return plainText(property.rich_text);
  return null;
}

function episodeNumber(title) {
  const match = title.match(/(?:^|\b)(?:ep(?:isodio)?\.?\s*)(💯|\d{1,3})(?!\d)/i);
  if (!match) return null;
  return match[1] === '💯' ? 100 : Number(match[1]);
}

function cleanTitle(title, number) {
  const escaped = number === 100 ? '(?:100|💯)' : String(number);
  return title
    .replace(new RegExp(`^(?:episodio|ep)\\.?\\s*${escaped}\\s*[-–—:.]?\\s*`, 'i'), '')
    .replace(/\s+#\S+/g, '')
    .trim() || `Episodio ${number}`;
}

function slugify(value) {
  return value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase()
    .replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 56) || 'sin-titulo';
}

function imageSource(block) {
  const value = block[block.type];
  if (!value) return null;
  const file = value.file || value.external;
  if (!file?.url) return null;
  const caption = plainText(value.caption || []);
  const name = file.name || value.name || basename(new URL(file.url).pathname) || '';
  return { url: file.url, name, caption, blockId: block.id };
}

function isSketchHeading(block) {
  if (!block.type?.startsWith('heading_')) return false;
  const heading = plainText(block[block.type]?.rich_text || []).toLowerCase();
  return /bocetos?\s*\/\s*ideas alternas/.test(heading) || /bocetos alternos/.test(heading);
}

function isGenericArt(image) {
  const file = `${image.name || ''} ${image.caption || ''}`;
  return IGNORED_FILES.has(basename(image.name || '').toLowerCase()) || GENERIC_ART.test(file);
}

function orderedPanelImages(blocks) {
  const panels = [];
  const seen = new Set();

  function visit(items) {
    for (const block of items) {
      if (isSketchHeading(block)) return false;
      if (block.type === 'image' || block.type === 'file') {
        const image = imageSource(block);
        if (image && !isGenericArt(image) && !seen.has(image.blockId)) {
          seen.add(image.blockId);
          panels.push(image);
        }
      }
      if (block.has_children && Array.isArray(block.children)) {
        if (visit(block.children) === false) return false;
      }
    }
    return true;
  }

  visit(blocks);
  return panels;
}

function notionPageUrl(id) {
  return `https://app.notion.com/p/${id.replaceAll('-', '')}`;
}

function sourceTitleToSpanish(title, number) {
  return cleanTitle(title, number);
}

function contentTypeExtension(contentType, url) {
  const mime = (contentType || '').split(';')[0].trim().toLowerCase();
  const extByMime = new Map([
    ['image/png', '.png'], ['image/jpeg', '.jpg'], ['image/webp', '.webp'],
  ]);
  if (extByMime.has(mime)) return extByMime.get(mime);
  const ext = extname(new URL(url).pathname).toLowerCase();
  return new Set(['.png', '.jpg', '.jpeg', '.webp']).has(ext) ? ext : null;
}

function makeEpisode(page, number, title, panels, directory, extension) {
  const spanishTitle = sourceTitleToSpanish(title, number);
  const slug = `ep-${String(number).padStart(3, '0')}-${slugify(spanishTitle)}`;
  return {
    id: slug,
    title: { es: spanishTitle, en: `Episode ${number}` },
    episodeNumber: number,
    status: 'review',
    type: 'comic',
    complete: true,
    source: {
      kind: 'notion-archive',
      notionUrl: notionPageUrl(page.id),
      importedBy: 'notion-bulk-import',
      instagramMediaId: null,
      instagramPermalink: null,
    },
    panels: panels.map((panel, index) => {
      const ext = panel.extension || extension;
      const src = `assets/episodes/${slug}/${String(number).padStart(2, '0')}.${index + 1}${ext}`;
      return {
        order: index + 1,
        originalPosition: index + 1,
        src,
        alt: {
          es: `Lámina ${index + 1} del episodio ${number}: ${spanishTitle}.`,
          en: `Page ${index + 1} from episode ${number}.`,
        },
      };
    }),
    editorialNote: `Importado automáticamente desde Notion el ${new Date().toISOString().slice(0, 10)}. Revisar orden, bocetos y texto alternativo antes de publicar.`,
  };
}

function promotableEpisodes(catalog) {
  return catalog.episodes.filter(episode => episode.status === 'review'
    && episode.type === 'comic'
    && episode.source?.importedBy === 'notion-bulk-import'
    && episode.complete === true);
}

function writeCatalog(catalog, catalogPath) {
  const temporaryCatalog = `${catalogPath}.${process.pid}.tmp`;
  writeFileSync(temporaryCatalog, `${JSON.stringify(catalog, null, 2)}\n`);
  renameSync(temporaryCatalog, catalogPath);
}

function validateNotionConfiguration(token) {
  if (!token) {
    throw new Error('Falta NOTION_TOKEN (o el alias NOTIO_TOKEN). Configura el secreto de la integración de Notion en el entorno.');
  }
  if (!/^[a-f0-9-]{32,36}$/i.test(DATA_SOURCE_ID)) {
    throw new Error('NOTION_DATA_SOURCE_ID no parece ser un ID válido de data source.');
  }
}

function notionTokenFrom(environment) {
  return environment.NOTION_TOKEN || environment.NOTIO_TOKEN;
}

async function notionRequest(path, token, options = {}) {
  const wait = Math.max(0, 350 - (Date.now() - lastNotionRequest));
  if (wait) await sleep(wait);
  lastNotionRequest = Date.now();
  const response = await fetch(`${API}${path}`, {
    ...options,
    headers: {
      Authorization: `Bearer ${token}`,
      'Notion-Version': API_VERSION,
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });
  if (!response.ok) {
    const detail = await response.text().catch(() => '');
    const retryable = response.status === 429 || response.status >= 500;
    if (retryable && (options.retry || 0) < 4) {
      const retryAfter = Number(response.headers.get('retry-after') || 1);
      await sleep(Math.max(retryAfter * 1000, 1000) * (options.retry + 1));
      return notionRequest(path, token, { ...options, retry: (options.retry || 0) + 1 });
    }
    throw new Error(`Notion API devolvió HTTP ${response.status} para ${path}: ${detail.slice(0, 500)}`);
  }
  return response.json();
}

async function queryEpisodePages(token) {
  const pages = [];
  let startCursor;
  do {
    const result = await notionRequest(`/data_sources/${DATA_SOURCE_ID}/query`, token, {
      method: 'POST',
      body: JSON.stringify({ page_size: 100, ...(startCursor ? { start_cursor: startCursor } : {}) }),
    });
    pages.push(...(result.results || []));
    startCursor = result.has_more ? result.next_cursor : undefined;
  } while (startCursor);
  return pages;
}

async function getBlockChildren(blockId, token) {
  const children = [];
  let startCursor;
  do {
    const result = await notionRequest(`/blocks/${blockId}/children?page_size=100${startCursor ? `&start_cursor=${encodeURIComponent(startCursor)}` : ''}`, token);
    const current = result.results || [];
    children.push(...current);
    startCursor = result.has_more ? result.next_cursor : undefined;
  } while (startCursor);
  return children;
}

async function readPageBlocks(pageId, token, depth = 0) {
  if (depth > 12) throw new Error(`La página ${pageId} supera la profundidad máxima de bloques anidados.`);
  const blocks = await getBlockChildren(pageId, token);
  for (const block of blocks) {
    if (block.has_children) block.children = await readPageBlocks(block.id, token, depth + 1);
  }
  return blocks;
}

async function mapLimit(items, limit, callback) {
  const results = new Array(items.length);
  let next = 0;
  const workers = Array.from({ length: Math.min(limit, items.length) }, async () => {
    while (true) {
      const index = next++;
      if (index >= items.length) return;
      results[index] = await callback(items[index], index);
    }
  });
  const settled = await Promise.allSettled(workers);
  const failure = settled.find(result => result.status === 'rejected');
  if (failure) throw failure.reason;
  return results;
}

async function downloadPanel(panel, outputPath) {
  const response = await fetch(panel.url, { redirect: 'follow' });
  if (!response.ok) throw new Error(`No se pudo descargar una viñeta (${response.status}); vuelve a ejecutar para renovar los enlaces de Notion.`);
  const extension = contentTypeExtension(response.headers.get('content-type'), panel.url);
  if (!extension) throw new Error(`El archivo ${panel.name || 'sin nombre'} no parece una imagen admitida.`);
  const contentLength = Number(response.headers.get('content-length') || 0);
  if (contentLength > 25 * 1024 * 1024) throw new Error(`La imagen ${panel.name || 'sin nombre'} supera el límite de 25 MB.`);
  const bytes = Buffer.from(await response.arrayBuffer());
  if (!bytes.length || bytes.length > 25 * 1024 * 1024) throw new Error(`Tamaño no válido para ${panel.name || 'una imagen'}.`);
  mkdirSync(dirname(outputPath), { recursive: true });
  writeFileSync(outputPath, bytes, { flag: 'wx' });
  return { path: outputPath, extension, sha256: createHash('sha256').update(bytes).digest('hex'), size: bytes.length };
}

async function main() {
  if (process.argv.includes('--self-test')) return runSelfTest();
  const catalogPath = join(ROOT, 'episodes.json');
  const catalog = JSON.parse(readFileSync(catalogPath, 'utf8'));
  if (process.argv.includes('--publish-reviewed')) {
    const approved = promotableEpisodes(catalog);
    for (const episode of approved) {
      for (const panel of episode.panels) {
        if (!existsSync(join(ROOT, panel.src))) throw new Error(`No se publica ${episode.id}: falta la imagen ${panel.src}.`);
      }
    }
    if (!approved.length) {
      console.log('No hay episodios importados en revisión listos para publicar.');
      return;
    }
    for (const episode of approved) episode.status = 'published';
    writeCatalog(catalog, catalogPath);
    console.log(`Publicados ${approved.length} episodios importados que ya estaban en revisión.`);
    return;
  }
  const dryRun = process.argv.includes('--dry-run');
  const token = notionTokenFrom(process.env);
  validateNotionConfiguration(token);

  const knownNumbers = new Set(catalog.episodes.filter(episode => Number.isInteger(episode.episodeNumber)).map(episode => episode.episodeNumber));
  const pages = await queryEpisodePages(token);
  const numbered = [];
  const skipped = { existing: 0, nonEpisode: 0, notPublished: 0, nonComic: 0, duplicateNumber: [] };
  const seenNumbers = new Set();

  for (const page of pages) {
    const title = pageTitle(page);
    const number = episodeNumber(title);
    if (number === null) { skipped.nonEpisode++; continue; }
    const status = String(readProperty(page, 'Estatus') || '').toLocaleLowerCase();
    const tags = readProperty(page, 'Etiquetas') || [];
    const comic = Array.isArray(tags) && tags.some(tag => /tira c[oó]mica/i.test(tag));
    if (!/publicado|published/.test(status)) { skipped.notPublished++; continue; }
    if (!comic) { skipped.nonComic++; continue; }
    if (knownNumbers.has(number)) { skipped.existing++; continue; }
    if (seenNumbers.has(number)) { skipped.duplicateNumber.push(number); continue; }
    seenNumbers.add(number);
    numbered.push({ page, number, title });
  }

  if (skipped.duplicateNumber.length) {
    throw new Error(`La base tiene más de una página publicada para estos episodios: ${[...new Set(skipped.duplicateNumber)].join(', ')}. No se importó nada.`);
  }

  const plans = [];
  for (const item of numbered) {
    const blocks = await readPageBlocks(item.page.id, token);
    const panels = orderedPanelImages(blocks);
    if (!panels.length) {
      console.warn(`Se deja sin asignar el episodio ${item.number}: no encontré viñetas finales en el cuerpo de Notion.`);
      continue;
    }
    plans.push({ ...item, panels });
  }

  console.log(`Base revisada: ${pages.length} páginas; ${skipped.existing} episodios existentes omitidos; ${plans.length} episodios nuevos con viñetas finales.`);
  console.log(`Material aparte: ${skipped.nonEpisode} entradas sin número; ${skipped.notPublished} no publicados; ${skipped.nonComic} no son tiras cómicas.`);
  for (const plan of plans) console.log(`  Ep. ${plan.number}: ${plan.panels.length} viñetas — ${cleanTitle(plan.title, plan.number)}`);
  if (dryRun || !plans.length) {
    if (dryRun) console.log('Simulación terminada; no se descargaron imágenes ni se modificó el catálogo.');
    return;
  }

  const staging = join(tmpdir(), `mandarinita-notion-import-${process.pid}-${Date.now()}`);
  mkdirSync(staging, { recursive: true });
  const newEntries = [];
  const stagedWrites = [];
  try {
    for (const plan of plans) {
      const spanishTitle = cleanTitle(plan.title, plan.number);
      const slug = `ep-${String(plan.number).padStart(3, '0')}-${slugify(spanishTitle)}`;
      const downloaded = await mapLimit(plan.panels, 4, async (panel, index) => {
        const stagedPath = join(staging, slug, `${String(plan.number).padStart(2, '0')}.${index + 1}.download`);
        const file = await downloadPanel(panel, stagedPath);
        const dest = `assets/episodes/${slug}/${String(plan.number).padStart(2, '0')}.${index + 1}${file.extension}`;
        stagedWrites.push({ stagedPath, dest, sha256: file.sha256, size: file.size });
        return { ...panel, extension: file.extension, stagedPath };
      });
      const entry = makeEpisode(plan.page, plan.number, plan.title, downloaded, null, '.png');
      newEntries.push(entry);
    }

    for (const write of stagedWrites) {
      const destination = join(ROOT, write.dest);
      mkdirSync(dirname(destination), { recursive: true });
      if (existsSync(destination)) {
        const currentHash = createHash('sha256').update(readFileSync(destination)).digest('hex');
        if (currentHash !== write.sha256) throw new Error(`Ya existe un archivo distinto en ${write.dest}; no se sobrescribió.`);
        rmSync(write.stagedPath, { force: true });
      } else {
        renameSync(write.stagedPath, destination);
      }
    }

    catalog.episodes.push(...newEntries);
    writeCatalog(catalog, catalogPath);
    console.log(`Importación lista: ${newEntries.length} episodios, ${stagedWrites.length} imágenes. Estado: review.`);
    console.log('Las entradas quedan en revisión y no aparecen públicamente hasta que las apruebes.');
  } finally {
    rmSync(staging, { recursive: true, force: true });
  }
}

function runSelfTest() {
  assert.equal(episodeNumber('Ep. 💯 - Cada vez que lavo el auto'), 100);
  assert.equal(episodeNumber('Episodio 85 - Lo que siempre te pasa'), 85);
  assert.equal(episodeNumber('Día del emoji'), null);
  assert.equal(notionTokenFrom({ NOTIO_TOKEN: 'configured-secret' }), 'configured-secret');
  assert.equal(notionTokenFrom({ NOTION_TOKEN: 'preferred-secret', NOTIO_TOKEN: 'legacy-secret' }), 'preferred-secret');
  assert.equal(cleanTitle('Ep. 85 - Lo que siempre te pasa #comic', 85), 'Lo que siempre te pasa');
  const image = (name, id) => ({ type: 'image', id, image: { file: { url: `https://example.invalid/${name}`, name } } });
  const fixture = [
    image('panel-1.png', 'one'),
    { type: 'heading_2', heading_2: { rich_text: [{ plain_text: 'Bocetos / ideas alternas' }] } },
    image('boceto.png', 'draft'),
  ];
  assert.deepEqual(orderedPanelImages(fixture).map(panel => panel.blockId), ['one']);
  assert.equal(orderedPanelImages([image('Instagram.png', 'footer')]).length, 0);
  const episode = makeEpisode({ id: '1234-5678' }, 5, 'Ep. 5 - Prueba', [{ extension: '.png' }], null, '.png');
  assert.equal(episode.status, 'review');
  assert.equal(episode.panels[0].src, 'assets/episodes/ep-005-prueba/05.1.png');
  assert.equal(promotableEpisodes({ episodes: [episode] }).length, 1);
  console.log('OK: parser, deduplicación, bocetos y nombres de archivo.');
}

if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
  main().catch(error => {
    console.error(`Error: ${error.message}`);
    process.exitCode = 1;
  });
}

export { cleanTitle, episodeNumber, isGenericArt, notionTokenFrom, orderedPanelImages, pageTitle, slugify };
