/*
 * Service worker của web cho bé.
 * - Trang: lấy bản mới từ mạng trước (bài mới luôn hiện), mất mạng thì dùng bản đã lưu hoặc trang /offline/.
 * - Tài nguyên tĩnh (CSS/JS có mã băm, font, hình minh hoạ): dùng bản lưu, rất nhanh.
 * - Ảnh trong bài: lấy bản mới từ mạng (ảnh có thể được thay cùng tên), mất mạng thì dùng bản đã lưu.
 * - Video và nội dung ngoài trang (YouTube): không lưu.
 */
const VERSION = 'v2';
const PAGE_CACHE = `trang-${VERSION}`;
const ASSET_CACHE = `tai-nguyen-${VERSION}`;
const MEDIA_CACHE = `anh-bai-${VERSION}`;
const OFFLINE_URL = '/offline/';
const PRECACHE = [OFFLINE_URL, '/', '/manifest.webmanifest', '/icons/icon-192.png', '/favicon.svg'];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches
      .open(PAGE_CACHE)
      .then((cache) => cache.addAll(PRECACHE))
      .then(() => self.skipWaiting()),
  );
});

self.addEventListener('activate', (event) => {
  const keep = new Set([PAGE_CACHE, ASSET_CACHE, MEDIA_CACHE]);
  event.waitUntil(
    caches
      .keys()
      .then((keys) => Promise.all(keys.filter((key) => !keep.has(key)).map((key) => caches.delete(key))))
      .then(() => self.clients.claim()),
  );
});

self.addEventListener('fetch', (event) => {
  const { request } = event;
  if (request.method !== 'GET') return;
  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;
  if (request.headers.has('range') || /\.(mp4|webm|mov|m4v)$/i.test(url.pathname)) return;

  if (request.mode === 'navigate') {
    event.respondWith(networkFirstPage(request));
  } else if (/^\/(_astro|fonts|illustrations|icons)\//.test(url.pathname)) {
    event.respondWith(cacheFirst(request, ASSET_CACHE));
  } else if (url.pathname.startsWith('/media/')) {
    event.respondWith(networkFirst(request, MEDIA_CACHE));
  }
});

async function networkFirstPage(request) {
  const cache = await caches.open(PAGE_CACHE);
  try {
    const response = await fetch(request);
    // Không lưu trang xem trước bài nháp.
    if (response.ok && !new URL(request.url).pathname.startsWith('/xem-truoc/')) {
      cache.put(request, response.clone());
    }
    return response;
  } catch {
    return (await cache.match(request, { ignoreSearch: true })) ?? (await cache.match(OFFLINE_URL)) ?? Response.error();
  }
}

async function cacheFirst(request, cacheName) {
  const cache = await caches.open(cacheName);
  const cached = await cache.match(request);
  if (cached) return cached;
  const response = await fetch(request);
  if (response.ok) cache.put(request, response.clone());
  return response;
}

async function networkFirst(request, cacheName) {
  const cache = await caches.open(cacheName);
  try {
    const response = await fetch(request);
    if (response.ok) cache.put(request, response.clone());
    return response;
  } catch {
    return (await cache.match(request)) ?? Response.error();
  }
}
