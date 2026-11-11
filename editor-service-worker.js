const CACHE_NAME = 'mandarinita-editor-v18';
const APP_SHELL = [
  '/editor.html',
  '/editor.css',
  '/editor.js',
  '/editor-art-catalog.json',
  '/editor.webmanifest',
  '/assets/mandarinita-logo.svg',
  '/assets/mandarinita-pwa-192.png',
  '/assets/mandarinita-pwa-512.png',
  '/assets/mandarinita-pwa-180.png'
];

self.addEventListener('install', event => {
  event.waitUntil(caches.open(CACHE_NAME).then(cache => cache.addAll(APP_SHELL)));
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  event.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(key => key.startsWith('mandarinita-editor-') && key !== CACHE_NAME).map(key => caches.delete(key)))).then(() => self.clients.claim()));
});

self.addEventListener('fetch', event => {
  const request = event.request;
  if (request.method !== 'GET') return;
  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;

  if (request.mode === 'navigate') {
    if (url.pathname === '/editor' || url.pathname === '/editor/') {
      event.respondWith(fetch(request).then(response => {
        if (!response.ok || response.redirected || new URL(response.url).origin !== self.location.origin) return response;
        const copy = response.clone(); caches.open(CACHE_NAME).then(cache => cache.put('/editor', copy)); return response;
      }).catch(async () => await caches.match('/editor') || await caches.match('/editor.html')));
    }
    return;
  }

  const isEditorFile = /^\/(editor\.(?:css|js|webmanifest)|editor-art-catalog\.json|assets\/)/.test(url.pathname);
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
