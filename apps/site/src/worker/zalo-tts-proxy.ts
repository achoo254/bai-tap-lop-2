/**
 * apps/site/src/worker/zalo-tts-proxy.ts
 *
 * Đọc to bằng giọng Zalo AI (có giọng miền Nam mà iPad không có sẵn).
 * GET /api/doc?giong=1&toc-do=1&noi-dung=... → trả file âm thanh.
 * - API key giữ ở secret ZALO_TTS_API_KEY của Worker, không lộ ra trình duyệt.
 * - Mỗi câu chỉ gọi Zalo một lần: kết quả lưu Cache API, lần sau trả ngay (không tốn lượt).
 * - Chỉ nhận yêu cầu từ chính web của bé và câu ngắn, tránh bị lợi dụng hết lượt miễn phí.
 */

export const ZALO_TTS_ENDPOINT = 'https://api.zalo.ai/v1/tts/synthesize';
/** 1: nữ miền Nam, 2: nữ miền Bắc, 3: nam miền Nam, 4: nam miền Bắc. */
export const ZALO_SPEAKERS = [1, 2, 3, 4] as const;
export const MAX_TEXT_LENGTH = 500;
export const SPEED_RANGE = { min: 0.8, max: 1.2 } as const;

const AUDIO_READY_RETRIES = 6;
const AUDIO_READY_DELAY_MS = 500;

export interface TtsRequest {
  speaker: number;
  speed: number;
  text: string;
}

export interface TtsEnv {
  ZALO_TTS_API_KEY?: string;
}

/** Đọc & kiểm tra tham số; trả chuỗi lỗi nếu không hợp lệ. */
export function parseTtsRequest(url: URL): TtsRequest | string {
  const text = (url.searchParams.get('noi-dung') ?? '').trim();
  const speaker = Number(url.searchParams.get('giong'));
  const speedRaw = Number(url.searchParams.get('toc-do') ?? '1');

  if (!text) return 'Thiếu nội dung cần đọc';
  if (text.length > MAX_TEXT_LENGTH) return `Nội dung dài quá ${MAX_TEXT_LENGTH} ký tự`;
  if (!(ZALO_SPEAKERS as readonly number[]).includes(speaker)) return 'Giọng đọc không hợp lệ';
  if (!Number.isFinite(speedRaw)) return 'Tốc độ không hợp lệ';

  // Làm tròn tốc độ để các yêu cầu gần giống nhau dùng chung bản lưu
  const speed =
    Math.round(Math.min(SPEED_RANGE.max, Math.max(SPEED_RANGE.min, speedRaw)) * 10) / 10;
  return { speaker, speed, text };
}

/** Khoá lưu cache: cùng câu, cùng giọng, cùng tốc độ → cùng file. */
export function cacheKeyFor(origin: string, req: TtsRequest): string {
  const params = new URLSearchParams({
    giong: String(req.speaker),
    'toc-do': req.speed.toFixed(1),
    'noi-dung': req.text,
  });
  return `${origin}/api/doc?${params.toString()}`;
}

/** Trình duyệt tự gắn Sec-Fetch-Site; chỉ chấp nhận yêu cầu từ chính trang web. */
export function isSameSiteRequest(request: Request): boolean {
  const site = request.headers.get('sec-fetch-site');
  return site === null || site === 'same-origin' || site === 'same-site';
}

const plain = (status: number, message: string) =>
  new Response(message, {
    status,
    headers: { 'content-type': 'text/plain; charset=utf-8', 'cache-control': 'no-store' },
  });

async function synthesize(
  req: TtsRequest,
  apiKey: string,
  fetcher: typeof fetch,
): Promise<Response> {
  const body = new URLSearchParams({
    input: req.text,
    speaker_id: String(req.speaker),
    speed: String(req.speed),
  });
  const res = await fetcher(ZALO_TTS_ENDPOINT, {
    method: 'POST',
    headers: { apikey: apiKey, 'content-type': 'application/x-www-form-urlencoded' },
    body,
  });
  const json = (await res.json()) as {
    error_code?: number;
    error_message?: string;
    data?: { url?: string };
  };
  const audioUrl = json.data?.url;
  if (json.error_code !== 0 || !audioUrl) {
    return plain(
      502,
      `Zalo TTS lỗi ${json.error_code ?? res.status}: ${json.error_message ?? ''}`.trim(),
    );
  }

  // File âm thanh có thể cần vài trăm ms mới sẵn sàng
  for (let attempt = 0; attempt < AUDIO_READY_RETRIES; attempt++) {
    const audio = await fetcher(audioUrl);
    if (audio.ok) {
      return new Response(audio.body, {
        headers: {
          'content-type': audio.headers.get('content-type') ?? 'audio/wav',
          'cache-control': 'public, max-age=31536000, immutable',
        },
      });
    }
    await new Promise((resolve) => setTimeout(resolve, AUDIO_READY_DELAY_MS));
  }
  return plain(504, 'Zalo TTS chưa trả file âm thanh');
}

export async function handleTtsRequest(
  request: Request,
  env: TtsEnv,
  ctx: { waitUntil(promise: Promise<unknown>): void },
  deps: { fetcher?: typeof fetch; cache?: Cache } = {},
): Promise<Response> {
  if (request.method !== 'GET') return plain(405, 'Chỉ hỗ trợ GET');
  if (!isSameSiteRequest(request)) return plain(403, 'Không được phép');
  if (!env.ZALO_TTS_API_KEY) return plain(503, 'Chưa cấu hình giọng Zalo');

  const url = new URL(request.url);
  const parsed = parseTtsRequest(url);
  if (typeof parsed === 'string') return plain(400, parsed);

  const cache = deps.cache ?? (caches as unknown as { default: Cache }).default;
  const cacheKey = new Request(cacheKeyFor(url.origin, parsed));
  const cached = await cache.match(cacheKey);
  if (cached) return cached;

  const response = await synthesize(parsed, env.ZALO_TTS_API_KEY, deps.fetcher ?? fetch);
  if (response.ok) ctx.waitUntil(cache.put(cacheKey, response.clone()));
  return response;
}
