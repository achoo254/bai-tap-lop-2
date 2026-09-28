import {
  extensionForMimeType,
  mediaExtensionOf,
  MCP_MAX_MEDIA_BYTES,
  type AllowedMediaExtension,
} from 'lesson-core';

/**
 * Tải ảnh/video từ một URL để đính kèm vào bài.
 * Chống SSRF: chỉ http(s), cổng mặc định, không tới localhost/IP nội bộ; giới hạn thời gian và dung lượng.
 */

export class MediaFetchError extends Error {}

export interface FetchedMedia {
  bytes: Uint8Array;
  extension: AllowedMediaExtension;
  /** Tên gợi ý lấy từ đường dẫn URL. */
  suggestedName: string;
}

const TIMEOUT_MS = 20_000;

export async function fetchMediaFromUrl(
  rawUrl: string,
  fetchImpl: typeof fetch = fetch,
): Promise<FetchedMedia> {
  const url = parseSafeUrl(rawUrl);
  const response = await fetchImpl(url.href, {
    redirect: 'manual',
    signal: AbortSignal.timeout(TIMEOUT_MS),
    headers: { 'user-agent': 'bai-tap-lop-2-mcp' },
  }).catch((error: unknown) => {
    throw new MediaFetchError(
      `Không tải được file: ${error instanceof Error ? error.message : String(error)}`,
    );
  });
  if (response.status >= 300 && response.status < 400) {
    const location = response.headers.get('location');
    if (!location) throw new MediaFetchError('Link chuyển hướng không hợp lệ.');
    // Chỉ đi theo một lần chuyển hướng và kiểm tra lại đích mới.
    return fetchMediaFromUrl(new URL(location, url).href, (input, init) =>
      fetchImpl(input, { ...init, redirect: 'error' }),
    );
  }
  if (!response.ok) throw new MediaFetchError(`Máy chủ ảnh trả lỗi ${response.status}.`);

  const declaredLength = Number(response.headers.get('content-length') ?? 0);
  if (declaredLength > MCP_MAX_MEDIA_BYTES) throw tooLarge();

  const pathName = decodeURIComponent(url.pathname.split('/').pop() ?? '');
  const extension =
    extensionForMimeType(response.headers.get('content-type') ?? '') ?? mediaExtensionOf(pathName);
  if (!extension)
    throw new MediaFetchError('Link không phải ảnh (jpg, png, webp, gif) hoặc video (mp4, webm).');

  const bytes = await readWithLimit(response);
  const baseName = pathName.replace(/\.[^.]*$/, '') || 'tep';
  return { bytes, extension, suggestedName: `${baseName}.${extension}` };
}

function parseSafeUrl(rawUrl: string): URL {
  let url: URL;
  try {
    url = new URL(rawUrl);
  } catch {
    throw new MediaFetchError('Link không hợp lệ.');
  }
  if (url.protocol !== 'https:' && url.protocol !== 'http:')
    throw new MediaFetchError('Chỉ nhận link http hoặc https.');
  if (url.port && url.port !== '80' && url.port !== '443')
    throw new MediaFetchError('Không nhận link có cổng đặc biệt.');
  if (url.username || url.password) throw new MediaFetchError('Không nhận link có mật khẩu.');
  if (isPrivateHost(url.hostname)) throw new MediaFetchError('Không được tải từ địa chỉ nội bộ.');
  return url;
}

export function isPrivateHost(hostname: string): boolean {
  const host = hostname.toLowerCase().replace(/^\[|\]$/g, '');
  if (
    host === 'localhost' ||
    host.endsWith('.localhost') ||
    host.endsWith('.local') ||
    host.endsWith('.internal')
  ) {
    return true;
  }
  const ipv4 = /^(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})$/.exec(host);
  if (ipv4) {
    const [a, b] = [Number(ipv4[1]), Number(ipv4[2])];
    return (
      a === 0 ||
      a === 10 ||
      a === 127 ||
      (a === 169 && b === 254) ||
      (a === 172 && b >= 16 && b <= 31) ||
      (a === 192 && b === 168) ||
      (a === 100 && b >= 64 && b <= 127) ||
      a >= 224
    );
  }
  if (host.includes(':')) {
    // IPv6: loopback, link-local, unique-local, IPv4-mapped.
    return (
      host === '::1' || host === '::' || /^(fe80|fc|fd)/.test(host) || host.startsWith('::ffff:')
    );
  }
  return false;
}

async function readWithLimit(response: Response): Promise<Uint8Array> {
  if (!response.body) return new Uint8Array(await response.arrayBuffer());
  const reader = response.body.getReader();
  const chunks: Uint8Array[] = [];
  let total = 0;
  for (;;) {
    const { done, value } = await reader.read();
    if (done) break;
    total += value.byteLength;
    if (total > MCP_MAX_MEDIA_BYTES) {
      await reader.cancel();
      throw tooLarge();
    }
    chunks.push(value);
  }
  const bytes = new Uint8Array(total);
  let offset = 0;
  for (const chunk of chunks) {
    bytes.set(chunk, offset);
    offset += chunk.byteLength;
  }
  return bytes;
}

function tooLarge(): MediaFetchError {
  return new MediaFetchError('File lớn hơn 10MB. Video dài hãy đưa lên YouTube rồi chèn link.');
}
