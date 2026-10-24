/* Increment VERSION whenever an offline asset changes. */
const VERSION = 'v3school-2026-10-23-3';
const PREFIX = 'v3school-';
const ASSETS = ['/', '/index.html', '/style.css', '/app.js', '/pwa.js', '/lessons.json', '/manifest.webmanifest', '/icons/icon-192.png', '/icons/icon-512.png', '/icons/maskable-512.png', '/icons/apple-touch-icon.png'];
self.addEventListener('install', event => {
  event.waitUntil((async () => {
    const responses = await Promise.all(ASSETS.map(async path => {
      const response = await fetch(new Request(path, {cache:'reload'}));
      if (!response.ok) throw new Error('Offline download failed: ' + path);
      if (path === '/lessons.json') {
        const lessons = await response.clone().json();
        if (!Array.isArray(lessons) || lessons.length < 186) throw new Error('Incomplete lesson library');
      }
      if (path === '/' || path === '/index.html') {
        const html = await response.clone().text();
        if (!html.includes('data-v3school-app')) throw new Error('Unexpected app document');
      }
      return [path, response];
    }));
    const cache = await caches.open(VERSION);
    try { await Promise.all(responses.map(([path,response])=>cache.put(path,response))); }
    catch (error) { await caches.delete(VERSION); throw error; }
    // A later update waits for the learner to choose "Apply update".
  })());
});
self.addEventListener('activate', event => {
  event.waitUntil((async () => {
    await self.clients.claim();
    const keys = await caches.keys();
    await Promise.all(keys.filter(key=>key.startsWith(PREFIX)&&key!==VERSION).map(key=>caches.delete(key)));
  })());
});
self.addEventListener('message', event => {
  if (event.data?.type === 'APPLY_UPDATE') self.skipWaiting();
  if (event.data?.type === 'OFFLINE_STATUS') {
    event.waitUntil((async()=>{
      const cache=await caches.open(VERSION);
      const available=await Promise.all(ASSETS.map(path=>cache.match(path)));
      event.ports[0]?.postMessage({ready:available.every(Boolean),version:VERSION});
    })());
  }
});
self.addEventListener('fetch', event => {
  const request=event.request;
  const url=new URL(request.url);
  // Never cache compiler requests, other origins, sign-in pages or user data.
  if(request.method!=='GET'||url.origin!==self.location.origin)return;
  if(request.mode==='navigate' && (url.pathname==='/'||url.pathname==='/index.html')) {
    event.respondWith((async()=> (await (await caches.open(VERSION)).match('/index.html')) || fetch(request))());
    return;
  }
  if(ASSETS.includes(url.pathname))event.respondWith((async()=>{
    const cached=await (await caches.open(VERSION)).match(url.pathname);
    return cached || fetch(request);
  })());
});
