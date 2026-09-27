import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import type { CallToolResult } from '@modelcontextprotocol/sdk/types.js';
import { z } from 'zod';
import {
  illustrationListText,
  LESSON_FORMAT_GUIDE,
  LESSON_SUBJECTS,
  type LessonIssue,
} from 'lesson-core';
import { base64ToBytes } from '../github/github-content-store';
import { fetchMediaFromUrl, MediaFetchError } from '../github/media-fetcher';
import { LessonServiceError, subjectLabel, type LessonRecord, type LessonService } from '../lessons/lesson-service';

/** Đăng ký các tool MCP. Mô tả viết tiếng Việt, nêu rõ định dạng để Claude soạn đúng ngay lần đầu. */

const isoDate = z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Ngày dạng YYYY-MM-DD');
const lessonId = z.string().describe('Mã bài, vd. 2026-09-28-cong-co-nho (lấy từ create_lesson hoặc list_lessons).');
const subject = z.enum(LESSON_SUBJECTS).describe('Môn: toan | tieng-viet | khac');
const deBai = z.string().min(1).describe('Markdown phần Đề bài (không gồm tiêu đề "## Đề bài").');
const loiGiai = z.string().describe('Markdown phần Lời giải (không gồm tiêu đề "## Lời giải"). Bé bấm nút mới thấy.');

const FORMAT_NOTE = `Định dạng nội dung:\n${LESSON_FORMAT_GUIDE}\nHình minh hoạ có sẵn: ${illustrationListText()}.`;

export function registerLessonTools(server: McpServer, service: LessonService, siteUrl: string): void {
  server.registerTool(
    'create_lesson',
    {
      title: 'Tạo bài tập nháp',
      description:
        `Tạo một bài tập lớp 2 ở dạng NHÁP (bé chưa thấy). Trả về mã bài và link xem trước để phụ huynh duyệt; ` +
        `web cần 1-3 phút để cập nhật link. Muốn thêm ảnh/video từ file hoặc link thì gọi add_media sau khi tạo. ` +
        `Nếu nội dung sai quy tắc, tool trả danh sách lỗi và KHÔNG lưu — hãy sửa rồi gọi lại.\n${FORMAT_NOTE}`,
      inputSchema: {
        tieu_de: z.string().min(1).max(120).describe('Tiêu đề ngắn của bài.'),
        ngay: isoDate.describe('Ngày học, dạng YYYY-MM-DD (giờ Việt Nam).'),
        mon: subject,
        de_bai: deBai,
        loi_giai: loiGiai.optional(),
      },
      annotations: { destructiveHint: false, idempotentHint: false },
    },
    (input) => run(async () => describeLesson(await service.create(input), 'Đã tạo bài nháp.')),
  );

  server.registerTool(
    'add_media',
    {
      title: 'Thêm ảnh/video vào bài',
      description:
        'Đính kèm ảnh (jpg, png, webp, gif) hoặc video mp4/webm tối đa 10MB vào một bài, từ link (url) hoặc dữ liệu base64. ' +
        'Chọn chen_vao để tự chèn vào cuối phần Đề bài hoặc Lời giải; nếu bỏ trống thì tool trả cú pháp Markdown để bạn tự đặt vào bằng update_lesson. ' +
        'Video YouTube KHÔNG cần tool này: chỉ cần dán link YouTube thành một dòng riêng trong nội dung bài.',
      inputSchema: {
        lesson_id: lessonId,
        url: z.string().url().optional().describe('Link trực tiếp tới file ảnh/video.'),
        base64: z.string().optional().describe('Nội dung file dạng base64 (khi không có link).'),
        ten_file: z.string().optional().describe('Tên file kèm đuôi, bắt buộc khi dùng base64, vd. hinh-bai-1.png.'),
        mo_ta: z.string().max(120).optional().describe('Mô tả ngắn hiện dưới ảnh.'),
        chen_vao: z.enum(['de-bai', 'loi-giai']).optional(),
      },
      annotations: { destructiveHint: false, openWorldHint: true },
    },
    ({ lesson_id, url, base64, ten_file, mo_ta, chen_vao }) =>
      run(async () => {
        let bytes: Uint8Array;
        let fileName: string;
        if (url) {
          const fetched = await fetchMediaFromUrl(url);
          bytes = fetched.bytes;
          fileName = ten_file ?? fetched.suggestedName;
        } else if (base64 && ten_file) {
          bytes = base64ToBytes(base64);
          fileName = ten_file;
        } else {
          throw new LessonServiceError('Cần url, hoặc base64 kèm ten_file.');
        }
        const result = await service.addMedia(lesson_id, { bytes, fileName, moTa: mo_ta, chenVao: chen_vao });
        const placed = chen_vao
          ? `Đã chèn vào cuối phần ${chen_vao === 'de-bai' ? 'Đề bài' : 'Lời giải'}.`
          : `Chưa chèn vào bài. Thêm dòng sau vào nội dung bằng update_lesson: ${result.markdown}`;
        return describeLesson(result.record, `Đã thêm file ${result.fileName}. ${placed}`);
      }),
  );

  server.registerTool(
    'validate_lesson',
    {
      title: 'Kiểm tra bài',
      description:
        'Kiểm tra trình bày (viết hoa đầu câu, dấu tiếng Việt, cú pháp ảnh/hình minh hoạ) mà không lưu gì. ' +
        'Truyền lesson_id để kiểm tra bài đã lưu, hoặc truyền nội dung để kiểm tra trước khi tạo.',
      inputSchema: {
        lesson_id: lessonId.optional(),
        tieu_de: z.string().optional(),
        ngay: isoDate.optional(),
        mon: subject.optional(),
        de_bai: z.string().optional(),
        loi_giai: z.string().optional(),
      },
      annotations: { readOnlyHint: true },
    },
    (input) =>
      run(async () => {
        if (input.lesson_id) {
          const lesson = await service.get(input.lesson_id);
          return text(lesson.warnings.length ? formatIssues(lesson.warnings) : '✅ Bài trình bày đúng chuẩn.');
        }
        const result = service.validateDraft({
          tieu_de: input.tieu_de ?? 'Kiểm tra',
          ngay: input.ngay ?? '2000-01-01',
          mon: input.mon ?? 'khac',
          de_bai: input.de_bai ?? '',
          loi_giai: input.loi_giai,
        });
        const issues = [...result.errors, ...result.warnings];
        return text(issues.length ? formatIssues(issues) : '✅ Nội dung trình bày đúng chuẩn.');
      }),
  );

  server.registerTool(
    'list_lessons',
    {
      title: 'Danh sách bài',
      description: 'Liệt kê tối đa 40 bài mới nhất, lọc theo khoảng ngày, môn, trạng thái nháp/đã đăng.',
      inputSchema: {
        tu_ngay: isoDate.optional(),
        den_ngay: isoDate.optional(),
        mon: subject.optional(),
        nhap: z.boolean().optional().describe('true = chỉ bài nháp, false = chỉ bài đã đăng.'),
      },
      annotations: { readOnlyHint: true },
    },
    (filter) =>
      run(async () => {
        const lessons = await service.list(filter);
        if (lessons.length === 0) return text('Chưa có bài nào khớp điều kiện.');
        return text(
          lessons
            .map(
              (lesson) =>
                `- ${lesson.id} · ${lesson.frontmatter.tieu_de} · ${subjectLabel(lesson.frontmatter.mon)} · ` +
                `${lesson.frontmatter.nhap ? 'nháp' : 'đã đăng'}`,
            )
            .join('\n'),
        );
      }),
  );

  server.registerTool(
    'get_lesson',
    {
      title: 'Xem một bài',
      description: 'Đọc toàn bộ nội dung một bài (Markdown Đề bài, Lời giải) và danh sách file đính kèm.',
      inputSchema: { lesson_id: lessonId },
      annotations: { readOnlyHint: true },
    },
    ({ lesson_id }) =>
      run(async () => {
        const lesson = await service.get(lesson_id);
        return text(
          `${describeLesson(lesson, '').content[0]?.text ?? ''}\n\n## Đề bài\n\n${lesson.deBai}\n\n## Lời giải\n\n${lesson.loiGiai || '(trống)'}`,
        );
      }),
  );

  server.registerTool(
    'update_lesson',
    {
      title: 'Sửa bài',
      description:
        'Sửa tiêu đề, ngày, môn, Đề bài hoặc Lời giải của một bài (chỉ gửi trường cần đổi). ' +
        'Bài đã đăng sau khi sửa vẫn ở trạng thái đã đăng. Nội dung sai quy tắc thì không lưu và trả danh sách lỗi.\n' +
        FORMAT_NOTE,
      inputSchema: {
        lesson_id: lessonId,
        tieu_de: z.string().min(1).max(120).optional(),
        ngay: isoDate.optional(),
        mon: subject.optional(),
        de_bai: deBai.optional(),
        loi_giai: loiGiai.optional(),
      },
      annotations: { destructiveHint: false, idempotentHint: true },
    },
    ({ lesson_id, ...changes }) => run(async () => describeLesson(await service.update(lesson_id, changes), 'Đã lưu thay đổi.')),
  );

  server.registerTool(
    'publish_lesson',
    {
      title: 'Đăng bài cho bé',
      description:
        'Chuyển bài nháp thành ĐÃ ĐĂNG để bé nhìn thấy trên web (sau 1-3 phút). ' +
        'Chỉ gọi khi phụ huynh đã xem trước và đồng ý đăng. Bài còn lỗi sẽ bị chặn.',
      inputSchema: { lesson_id: lessonId },
      annotations: { destructiveHint: false, idempotentHint: true },
    },
    ({ lesson_id }) => run(async () => describeLesson(await service.publish(lesson_id), '🚀 Đã đăng bài. Web cập nhật sau 1-3 phút.')),
  );

  server.registerTool(
    'delete_lesson',
    {
      title: 'Xoá bài',
      description:
        'Xoá hẳn một bài và các file của nó. Gọi lần đầu KHÔNG kèm xac_nhan để xem sẽ xoá gì, ' +
        'hỏi phụ huynh, chỉ gọi lại với xac_nhan=true khi phụ huynh đồng ý.',
      inputSchema: { lesson_id: lessonId, xac_nhan: z.boolean().optional() },
      annotations: { destructiveHint: true, idempotentHint: false },
    },
    ({ lesson_id, xac_nhan }) =>
      run(async () => {
        const result = await service.remove(lesson_id, xac_nhan === true);
        return text(
          result.deleted
            ? `🗑️ Đã xoá ${result.summary}`
            : `Sẽ xoá: ${result.summary}\nHãy hỏi phụ huynh; nếu đồng ý thì gọi lại delete_lesson với xac_nhan=true.`,
        );
      }),
  );

  server.registerTool(
    'list_illustrations',
    {
      title: 'Danh sách hình minh hoạ',
      description: 'Các loại hình đếm được dùng trong cú pháp ::hinh{loai=<tên> so-luong=<số>}.',
      inputSchema: {},
      annotations: { readOnlyHint: true },
    },
    () => run(async () => text(`${illustrationListText()}\n\nVí dụ: ::hinh{loai=tao so-luong=5}\nWeb: ${siteUrl}`)),
  );
}

async function run(task: () => Promise<CallToolResult>): Promise<CallToolResult> {
  try {
    return await task();
  } catch (error) {
    if (error instanceof LessonServiceError) {
      return { isError: true, content: [{ type: 'text', text: `${error.message}\n${formatIssues(error.issues)}`.trim() }] };
    }
    if (error instanceof MediaFetchError) return { isError: true, content: [{ type: 'text', text: error.message }] };
    console.error('[mcp] lỗi', error);
    return { isError: true, content: [{ type: 'text', text: 'Có lỗi khi làm việc với kho bài. Thử lại sau ít phút.' }] };
  }
}

function text(value: string): CallToolResult {
  return { content: [{ type: 'text', text: value }] };
}

function describeLesson(lesson: LessonRecord, headline: string): CallToolResult & { content: { type: 'text'; text: string }[] } {
  const lines = [
    headline,
    `Mã bài: ${lesson.id}`,
    `Tiêu đề: ${lesson.frontmatter.tieu_de} · ${subjectLabel(lesson.frontmatter.mon)} · ngày ${lesson.frontmatter.ngay}`,
    `Trạng thái: ${lesson.frontmatter.nhap ? 'NHÁP (bé chưa thấy)' : 'ĐÃ ĐĂNG'}`,
    `Xem trước: ${lesson.links.xemTruoc}`,
    lesson.links.bai ? `Trang của bé: ${lesson.links.bai}` : '',
    lesson.files.length ? `File đính kèm: ${lesson.files.join(', ')}` : '',
    lesson.warnings.length ? `Lưu ý:\n${formatIssues(lesson.warnings)}` : '',
  ].filter(Boolean);
  return { content: [{ type: 'text', text: lines.join('\n') }] };
}

function formatIssues(issues: LessonIssue[]): string {
  return issues.map((issue) => `${issue.severity === 'loi' ? '❌' : '⚠️'} ${issue.message}`).join('\n');
}
