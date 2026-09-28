/**
 * apps/site/src/worker/web-worker.ts
 *
 * Worker của web bé: /api/doc đọc to bằng giọng Zalo, mọi đường dẫn khác trả file tĩnh do Astro build.
 */
import { handleTtsRequest, type TtsEnv } from './zalo-tts-proxy';

interface Env extends TtsEnv {
  ASSETS: { fetch(request: Request): Promise<Response> };
}

export default {
  async fetch(request: Request, env: Env, ctx: { waitUntil(promise: Promise<unknown>): void }): Promise<Response> {
    const { pathname } = new URL(request.url);
    if (pathname === '/api/doc') return handleTtsRequest(request, env, ctx);
    return env.ASSETS.fetch(request);
  },
};
