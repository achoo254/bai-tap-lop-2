import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { McpAgent } from 'agents/mcp';
import { GitHubContentStore } from '../github/github-content-store';
import { LessonService } from '../lessons/lesson-service';
import { registerLessonTools } from './lesson-mcp-tools';

/** Thông tin người dùng lấy từ OAuth, đi kèm token MCP. */
export type McpUserProps = {
  login: string;
};

/** Mỗi phiên MCP của Claude chạy trong một Durable Object của lớp này. */
export class LessonMcpAgent extends McpAgent<Env, Record<string, never>, McpUserProps> {
  server = new McpServer({ name: 'Góc học tập của bé', version: '1.0.0' });

  async init(): Promise<void> {
    // Chặn thêm một lớp: token phải thuộc đúng tài khoản phụ huynh.
    if (this.props?.login !== this.env.ALLOWED_GITHUB_LOGIN) return;
    const siteUrl = this.env.SITE_URL.replace(/\/+$/, '');
    const store = new GitHubContentStore({
      token: this.env.GITHUB_CONTENT_TOKEN,
      owner: this.env.GITHUB_OWNER,
      repo: this.env.GITHUB_REPO,
      branch: this.env.GITHUB_BRANCH,
    });
    registerLessonTools(this.server, new LessonService(store, siteUrl), siteUrl);
  }
}
