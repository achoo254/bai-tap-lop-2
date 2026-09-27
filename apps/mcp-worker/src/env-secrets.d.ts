// Secret của Worker không nằm trong wrangler.jsonc nên `wrangler types` không sinh ra; khai báo ở đây.
interface WorkerSecrets {
  GITHUB_CLIENT_ID: string;
  GITHUB_CLIENT_SECRET: string;
  COOKIE_ENCRYPTION_KEY: string;
  GITHUB_CONTENT_TOKEN: string;
}

declare namespace Cloudflare {
  // eslint-disable-next-line @typescript-eslint/no-empty-object-type
  interface Env extends WorkerSecrets {}
}

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
interface Env extends WorkerSecrets {}
