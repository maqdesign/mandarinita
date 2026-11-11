const CACHE_NAME = 'mandarinita-editor-v23';
const APP_SHELL = [
  '/editor.css',
  '/editor.js',
  '/editor-art-catalog.json',
  '/editor.webmanifest',
  '/assets/mandarinita-logo.svg',
  '/assets/mandarinita-pwa-192.png',
  '/assets/mandarinita-pwa-512.png',
  '/assets/mandarinita-pwa-180.png',
  '/assets/characters/mando-transparent.webp',
  '/assets/characters/mandy-transparent.webp',
  '/assets/characters/greg-transparent.webp',
  '/assets/characters/limon-agrio-transparent.webp',
  '/assets/characters/aguacatelo-transparent.png',
  '/assets/characters/morita.png',
  '/assets/characters/sra-pera-transparent.webp',
  '/assets/characters/champi-transparent.webp',
  '/assets/characters/cherrys-transparent.webp',
  '/assets/characters/don-guineo-transparent.webp',
  '/assets/characters/don-pepino-transparent.webp',
  '/assets/characters/manzanillo-transparent.webp',
  '/assets/characters/sandy-transparent.webp',
  '/assets/characters/superfreso-transparent.webp',
  '/assets/characters/review/morita-episode-59-1-review.png',
  '/assets/characters/review/morita-episode-59-2-review.png',
  '/docs/art-review/cutouts/mando-episodio-01-1-borrador.png',
  '/docs/art-review/cutouts/mandy-episodio-01-1-borrador.png',
  '/docs/art-review/cutouts/mando-episodio-01-3-borrador.png',
  '/docs/art-review/cutouts/mando-episodio-14-1-borrador.png',
  '/docs/art-review/cutouts/greg-episodio-14-1-borrador.png'
];

self.addEventListener('install', event => {
  event.waitUntil(caches.open(CACHE_NAME).then(cache => cache.addAll(APP_SHELL)));
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  event.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(key => key.startsWith('mandarinita-editor-') && key !== CACHE_NAME).map(key => caches.delete(key)))).then(() => self.clients.claim()));
});

self.addEventListener('message', event => {
  if (event.data?.type !== 'CLEAR_EDITOR_CACHE') return;
  event.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(key => key.startsWith('mandarinita-editor-')).map(key => caches.delete(key)))).then(() => event.ports[0]?.postMessage({ ok:true })));
});

self.addEventListener('fetch', event => {
  const request = event.request;
  if (request.method !== 'GET') return;
  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;

  if (request.mode === 'navigate') return;

  const isEditorFile = /^\/(editor\.(?:css|js|webmanifest)|editor-art-catalog\.json|assets\/|docs\/art-review\/cutouts\/.*\.png$)/.test(url.pathname);
  if (!isEditorFile) return;
  // respondWith must be called synchronously during fetch dispatch. Check the
  // client inside that promise so this root-scoped worker leaves the public
  // site's requests and cache behavior untouched.
  event.respondWith((async () => {
    const client = await self.clients.get(event.clientId);
    if (!client || !/^\/editor(?:\.html|\/?$)/.test(new URL(client.url).pathname)) return fetch(request);
    const cached = await caches.match(request);
    if (cached) return cached;
    const response = await fetch(request);
    if (response.ok && response.type === 'basic') caches.open(CACHE_NAME).then(cache => cache.put(request, response.clone()));
    return response;
  })());
});
