const CACHE_NAME = 'mandarinita-editor-v53';
const APP_SHELL = [
  '/editor.css',
  '/editor.js',
  '/editor-art-catalog.json',
  '/editor.webmanifest',
  '/assets/mandarinita-logo.svg',
  '/assets/mandarinita-logo-white.svg',
  '/assets/mandarinita-smile.png',
  '/assets/sr-mandarino-neutral.png',
  '/assets/mandarinita-pwa-192.png',
  '/assets/mandarinita-pwa-512.png',
  '/assets/mandarinita-pwa-180.png',
  '/assets/fonts/baloo-2-latin.woff2',
  '/assets/fonts/bangers-latin.woff2',
  '/assets/fonts/comic-neue-regular.ttf',
  '/assets/fonts/comic-neue-bold.ttf',
  '/assets/fonts/lilita-one-latin.woff2',
  '/assets/fonts/fredoka-latin.woff2',
  '/assets/fonts/work-sans-latin.woff2',
  '/assets/characters/mando-transparent.webp',
  '/assets/characters/mando-episodio-82-3.png',
  '/assets/characters/mandy-transparent.webp',
  '/assets/characters/greg-transparent.webp',
  '/assets/characters/greg-episodio-14-1.png',
  '/assets/characters/greg-episodio-82-1.png',
  '/assets/characters/limon-agrio-transparent.webp',
  '/assets/characters/aguacatelo-transparent.png',
  '/assets/characters/morita.png',
  '/assets/characters/morita-carrera-episodio-59-3.png',
  '/assets/characters/morita-carrera-episodio-59-4.png',
  '/assets/characters/sra-pera-transparent.webp',
  '/assets/characters/champi-transparent.webp',
  '/assets/characters/cherrys-transparent.webp',
  '/assets/characters/don-guineo-transparent.webp',
  '/assets/characters/don-pepino-transparent.webp',
  '/assets/characters/manzanillo-transparent.webp',
  '/assets/characters/sandy-transparent.webp',
  '/assets/characters/superfreso-transparent.webp',
  '/assets/objects/review/paperclip-episode-85-3-review.png',
  '/assets/objects/review/envelope-episode-85-1-review.png',
  '/assets/objects/review/toilet-episode-77-3-review.png',
  '/assets/backgrounds/review/sky-clouds-episode-85-1.png',
  '/assets/stickers/sticker-pack-01.webp',
  '/assets/stickers/sticker-pack-02.webp',
  '/assets/stickers/sticker-pack-03.webp',
  '/assets/stickers/sticker-pack-04.webp',
  '/assets/stickers/sticker-pack-05.webp',
  '/assets/stickers/sticker-pack-06.webp',
  '/assets/stickers/sticker-pack-07.webp'
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
