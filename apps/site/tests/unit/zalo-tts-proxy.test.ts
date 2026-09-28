import { describe, expect, it, vi } from 'vitest';
import {
  cacheKeyFor,
  handleTtsRequest,
  parseTtsRequest,
  ZALO_TTS_ENDPOINT,
} from '../../src/worker/zalo-tts-proxy';

const ctx = { waitUntil: (p: Promise<unknown>) => void p };

function fakeCache() {
  const store = new Map<string, Response>();
  return {
    store,
    cache: {
      match: async (req: Request) => store.get(req.url)?.clone(),
      put: async (req: Request, res: Response) => void store.set(req.url, res),
    } as unknown as Cache,
  };
}

function fakeZalo() {
  return vi.fn(async (input: RequestInfo | URL, _init?: RequestInit) => {
    if (String(input) === ZALO_TTS_ENDPOINT) {
      return Response.json({ error_code: 0, data: { url: 'https://chunk.zalo.ai/a.wav' } });
    }
    return new Response('AUDIO', { headers: { 'content-type': 'audio/wav' } });
  });
}

const request = (
  query: string,
  headers: Record<string, string> = { 'sec-fetch-site': 'same-origin' },
) => new Request(`https://lop2.hoandat.com/api/doc?${query}`, { headers });

describe('đọc to bằng giọng Zalo', () => {
  it('kiểm tra tham số và làm tròn tốc độ', () => {
    expect(parseTtsRequest(new URL('https://x/api/doc?giong=1&toc-do=1.17&noi-dung=Chào'))).toEqual(
      {
        speaker: 1,
        speed: 1.2,
        text: 'Chào',
      },
    );
    expect(parseTtsRequest(new URL('https://x/api/doc?giong=9&noi-dung=Chào'))).toBe(
      'Giọng đọc không hợp lệ',
    );
    expect(parseTtsRequest(new URL('https://x/api/doc?giong=1'))).toBe('Thiếu nội dung cần đọc');
    expect(
      parseTtsRequest(new URL(`https://x/api/doc?giong=1&noi-dung=${'a'.repeat(501)}`)),
    ).toMatch(/dài quá/);
  });

  it('cùng câu cùng giọng dùng chung khoá cache', () => {
    const a = cacheKeyFor('https://x', { speaker: 3, speed: 1, text: 'Bé ơi' });
    const b = cacheKeyFor('https://x', { speaker: 3, speed: 1.0, text: 'Bé ơi' });
    expect(a).toBe(b);
  });

  it('gọi Zalo một lần, lần sau lấy từ cache', async () => {
    const fetcher = fakeZalo();
    const { cache } = fakeCache();
    const env = { ZALO_TTS_API_KEY: 'k' };
    const first = await handleTtsRequest(request('giong=1&noi-dung=Xin%20chào'), env, ctx, {
      fetcher,
      cache,
    });
    expect(first.status).toBe(200);
    expect(await first.text()).toBe('AUDIO');
    expect(fetcher).toHaveBeenCalledTimes(2);
    const [, init] = fetcher.mock.calls[0] as [string, RequestInit];
    expect((init.headers as Record<string, string>).apikey).toBe('k');

    await new Promise((r) => setTimeout(r, 0));
    const second = await handleTtsRequest(request('giong=1&noi-dung=Xin%20chào'), env, ctx, {
      fetcher,
      cache,
    });
    expect(await second.text()).toBe('AUDIO');
    expect(fetcher).toHaveBeenCalledTimes(2);
  });

  it('chưa có API key thì báo để web dùng giọng của máy', async () => {
    const res = await handleTtsRequest(request('giong=1&noi-dung=a'), {}, ctx, {
      fetcher: fakeZalo(),
      cache: fakeCache().cache,
    });
    expect(res.status).toBe(503);
  });

  it('từ chối yêu cầu từ trang khác', async () => {
    const res = await handleTtsRequest(
      request('giong=1&noi-dung=a', { 'sec-fetch-site': 'cross-site' }),
      { ZALO_TTS_API_KEY: 'k' },
      ctx,
      { fetcher: fakeZalo(), cache: fakeCache().cache },
    );
    expect(res.status).toBe(403);
  });

  it('Zalo báo lỗi thì trả 502, không lưu cache', async () => {
    const fetcher = vi.fn(async () => Response.json({ error_code: 401, error_message: 'bad key' }));
    const { cache, store } = fakeCache();
    const res = await handleTtsRequest(
      request('giong=1&noi-dung=a'),
      { ZALO_TTS_API_KEY: 'k' },
      ctx,
      { fetcher, cache },
    );
    expect(res.status).toBe(502);
    expect(store.size).toBe(0);
  });
});
