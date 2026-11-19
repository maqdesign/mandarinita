import { authorizeProjectRequest, isValidProjectId, PROJECT_PREFIX } from '../../_lib/projects.js';
import { json } from '../../_lib/session.js';

export async function onRequestGet(context) {
  const auth = await authorizeProjectRequest(context);
  if (auth.response) return auth.response;

  const projects = [];
  let cursor;
  do {
    const page = await context.env.MANDARINITA_PROJECTS.list({ prefix: PROJECT_PREFIX, cursor, limit: 1000 });
    for (const item of page.objects) {
      const id = item.key.slice(PROJECT_PREFIX.length).replace(/\.mandarinita$/, '');
      if (!isValidProjectId(id)) continue;
      projects.push({
        id,
        title: item.customMetadata?.title || 'Episodio sin título',
        updatedAt: Number(item.customMetadata?.updatedAt) || item.uploaded.getTime(),
        bytes: item.size,
        etag: item.httpEtag
      });
    }
    cursor = page.truncated ? page.cursor : undefined;
  } while (cursor);

  projects.sort((a, b) => b.updatedAt - a.updatedAt);
  return json({ projects });
}
