import { access, mkdir } from 'node:fs/promises';
import path from 'node:path';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import catalog from '../episodes.json' with { type: 'json' };

const run = promisify(execFile);
const sources = new Set(catalog.episodes
  .filter(episode => episode.status === 'published' && episode.type === 'comic')
  .flatMap(episode => episode.panels.map(panel => panel.src)));
let created = 0;
let reused = 0;

for (const source of sources) {
  const absoluteSource = path.resolve(source);
  const extension = path.extname(absoluteSource);
  const thumbnail = path.join(path.dirname(absoluteSource), `thumb-${path.basename(absoluteSource, extension)}.webp`);
  try {
    await access(thumbnail);
    reused++;
    continue;
  } catch {}
  await mkdir(path.dirname(thumbnail), { recursive: true });
  try {
    await run('magick', [absoluteSource, '-auto-orient', '-strip', '-resize', '480x480>', '-quality', '74', thumbnail]);
  } catch (error) {
    throw new Error(`Could not create thumbnail for ${source}: ${error.stderr?.toString() || error.message}`);
  }
  created++;
}

console.log(`Created ${created} low-resolution panel previews; reused ${reused} existing previews.`);
