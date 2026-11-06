import { access, mkdir } from 'node:fs/promises';
import path from 'node:path';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import catalog from '../episodes.json' with { type: 'json' };

const run = promisify(execFile);
const covers = new Set(catalog.episodes
  .filter(episode => episode.status === 'published' && episode.type === 'comic' && episode.complete === true)
  .map(episode => episode.panels.find(panel => panel.order === 1))
  .filter(Boolean)
  .map(panel => panel.sourceSrc || panel.src));
let created = 0;
let reused = 0;

for (const source of covers) {
  const absoluteSource = path.resolve(source);
  const compact = path.join(path.dirname(absoluteSource), `thumb-320-${path.basename(absoluteSource, path.extname(absoluteSource))}.webp`);
  try {
    await access(compact);
    reused++;
    continue;
  } catch {}
  await mkdir(path.dirname(compact), { recursive: true });
  try {
    await run('magick', [absoluteSource, '-auto-orient', '-strip', '-resize', '320x320^', '-gravity', 'center', '-extent', '320x320', '-quality', '74', compact]);
  } catch (error) {
    throw new Error(`Could not create the compact cover for ${source}: ${error.stderr?.toString() || error.message}`);
  }
  created++;
}

console.log(`Created ${created} compact episode covers; reused ${reused} existing covers.`);
