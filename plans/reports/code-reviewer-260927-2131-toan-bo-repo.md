# Review toàn bộ repo bai-tap-lop-2 (7 commit, d58e07a..1424422)

Ngày: 2026-09-27 · Người review: code-reviewer · Phạm vi: packages/lesson-core, apps/site, apps/editor, apps/mcp-worker, .github/workflows

## Kiểm chứng đã chạy

- `pnpm ci:all`: XANH (lint, typecheck 0 lỗi, test lesson-core 26/26, site 5/5, mcp-worker 16/16, editor 10/10, build site OK). Test editor dùng repo tạm trong `%TEMP%`, không làm bẩn working tree (`git status` sạch sau khi chạy).
- `pnpm --filter site test:e2e`: 34/34 pass (cổng 4331 trống lúc chạy, không còn server nào lắng nghe sau khi xong).
- Chạy thử bằng `tsx` với lesson-core thật: bài có link `javascript:` qua validator `ok=true`, renderer sinh `<a href="javascript:...">` (chi tiết ở phát hiện 1).
- Không tìm thấy secret trong lịch sử git (`ghp_`, `github_pat_`, client secret, cookie key, CF token).

## Tổng quan

Nền tảng chắc: chặn HTML thô trong Markdown, kiểm tra tên file và mã bài bằng regex chặt, chống path traversal ở editor đúng cách, Host/Origin check có hiệu lực, OAuth dùng thư viện 1.1 (đã tự kiểm tra lại redirect_uri ở `completeAuthorization`, oauth-provider.js:4962), MCP chỉ đăng ký tool khi `props.login` khớp. Lỗ hổng thật nằm ở: (1) URL trong Markdown không được lọc, (2) hai nơi ghi (editor + MCP) ghi đè lẫn nhau không phát hiện xung đột, (3) `list_lessons` N+1 và nuốt lỗi.

---

## Nghiêm trọng

Không có.

## Cao

### 1. XSS qua link `javascript:` trong Markdown — chạy được trên trang Soạn bài có quyền ghi/xoá/push

- File: `packages/lesson-core/src/render/lesson-section-html-renderer.ts:17-25, 34`; validator không kiểm tra URL: `packages/lesson-core/src/lesson-validator.ts:214-219` (chỉ che link, không bắt lỗi); nơi chèn: `apps/editor/src/ui/live-preview-and-validation.ts:61-62` (`innerHTML`), `apps/site/src/components/lesson-view.astro:25,40` (`set:html`).
- Mô tả: renderer chỉ ghi đè `html()` để escape HTML thô. `marked` (v18) KHÔNG lọc scheme của link/ảnh. Đã chạy thử: `[bấm vào đây](javascript:alert(document.domain))` → `<a href="javascript:alert(document.domain)">`; `[x](data:text/html,...)` cũng đi qua. Validator trả `ok=true, errors=[]`, nên MCP `create_lesson`/`update_lesson`/`publish_lesson` và editor đều cho lưu, site build cho đăng.
- Kịch bản: phụ huynh nhờ Claude soạn bài từ một trang web có prompt injection → Claude gọi `update_lesson` với dòng `Bé [xem gợi ý](javascript:fetch('/api/bai/2026-09-28-x',{method:'DELETE'}))`. Phụ huynh mở bài trong trang Soạn bài (sau `git pull`), bấm link trong khung xem trước → script chạy trên origin `127.0.0.1:4321`, request cùng origin nên qua được kiểm tra Origin → xoá bài và `git push` lên GitHub. Trên web của bé, link dẫn trẻ tới trang tuỳ ý / chạy script (không có CSP).
- Kèm theo (cùng gốc): ảnh inline trong đoạn chữ (`Hình ![x](https://tracker.example/p.gif) nè.`) không qua `checkMediaSource`, vẫn render `<img src="https://tracker...">` → tải tài nguyên ngoài trên máy của bé (đã chạy thử, không có lỗi/cảnh báo).
- Đề xuất:
  - Trong `Marked` renderer, ghi đè `link` và `image`: chỉ cho `https:` (và `#`/đường dẫn tương đối nếu cần); scheme khác → render chữ thuần. Ví dụ:
    ```ts
    link({ href, tokens }) { const text = this.parser.parseInline(tokens);
      return /^https:\/\//i.test(href) ? `<a href="${escapeAttribute(href)}" rel="noopener noreferrer" target="_blank">${text}</a>` : text; }
    image({ text }) { return escapeHtml(text); } // ảnh phải đứng riêng dòng
    ```
  - Validator: thêm lỗi `link-khong-an-toan` cho link không phải https và lỗi cho ảnh inline trong đoạn chữ, để MCP/editor chặn từ lúc lưu.
  - Thêm test hồi quy cho cả renderer lẫn validator. Cân nhắc CSP `script-src 'self'` cho trang Soạn bài (Hono header) và `_headers` của site.

### 2. Hai nơi ghi (MCP và trang Soạn bài) ghi đè lẫn nhau, không phát hiện xung đột — mất nội dung, có thể làm hỏng bài đã đăng

- File: `apps/mcp-worker/src/github/github-content-store.ts:352-381`; `apps/mcp-worker/src/lessons/lesson-service.ts:131-150, 152-164, 181-203`; `apps/editor/src/server/editor-http-server.ts:77-90`; `apps/editor/src/server/lesson-file-repository.ts:176-184`.
- Mô tả MCP: `update/publish/addMedia` đọc bài (`get`) rồi dựng blob từ bản đọc đó; `commit()` lấy HEAD mới nhất làm parent và khi gặp 422 thì "dựng lại tree trên commit mới" với CÙNG blob. Không có bước so sánh `bai.md` ở HEAD mới với bản đã đọc → last-writer-wins lặng lẽ. Test `github-content-store.test.ts:72` xác nhận đúng hành vi này là chủ đích.
- Mô tả editor: form giữ nội dung lúc mở bài; `PUT /api/bai` gọi `git.pull()` rồi ghi đè `bai.md` bằng nội dung form và XOÁ mọi file trong thư mục bài không được form tham chiếu (`lesson-file-repository.ts:181-183`).
- Kịch bản A (mất ảnh): phụ huynh mở bài X trong editor; cùng lúc nhờ Claude `add_media` vào X (commit ảnh + dòng `![...]`). Phụ huynh bấm Lưu → pull kéo ảnh mới về → nội dung form cũ không tham chiếu ảnh → ảnh bị `rm`, dòng Claude chèn biến mất, commit + push. Không có cảnh báo.
- Kịch bản B (build hỏng cho mọi bài): bài X đã đăng. Claude `update_lesson` X dựa trên `current.files` có `anh.png`; trong lúc đó phụ huynh lưu X từ editor bỏ dòng ảnh → `anh.png` bị xoá và push. Commit MCP (dựng lại trên HEAD mới) thêm lại dòng `![](anh.png)` nhưng file không còn → bài đã đăng lỗi `thieu-file` → `lesson-catalog.ts:60-62` ném lỗi → workflow deploy-web dừng, mọi bài mới sau đó không lên web cho tới khi có người sửa tay.
- Đề xuất:
  - MCP: `load()` trả thêm `baseCommitSha` (hoặc blob sha của `bai.md` từ tree). Trong `commit()` nhận `expected: { path, blobSha }[]`; trước khi dựng tree (kể cả lần retry) đọc tree HEAD mới, nếu blob sha của các path đụng tới khác bản đã đọc → ném `LessonServiceError('Bài vừa được sửa ở nơi khác, hãy get_lesson rồi làm lại')`.
  - Editor: gửi kèm `ma_xem_truoc`/hash nội dung lúc mở bài; sau `pull`, nếu `bai.md` trên đĩa khác hash lúc mở → trả 409 "Bài vừa được sửa (có thể bởi Claude), tải lại bài trước khi lưu". Không xoá file được thêm sau thời điểm mở bài.

### 3. `list_lessons` N+1 gọi GitHub API và nuốt lỗi — danh sách thiếu bài hoặc báo "chưa có bài" sai

- File: `apps/mcp-worker/src/lessons/lesson-service.ts:109-122` (`Promise.all(ids.map(id => this.get(id).catch(() => null)))`), `:205-211` (`load` gọi lại `listLessonFiles`), `apps/mcp-worker/src/github/github-content-store.ts:326-341`.
- Mô tả: mỗi `get(id)` gọi `listLessonFiles()` (2 request: ref + cây đệ quy toàn repo) + `readText` (1 request). Với 40 bài: 2 + 3×40 = 122 subrequest cho một tool call, trong đó 40 lần tải lại cây đệ quy toàn repo (kể cả file media). Mọi lỗi (rate limit, "Too many subrequests", 5xx) bị `.catch(() => null)` nuốt.
- Kịch bản: Worker gói Free giới hạn 50 subrequest/lần gọi → từ khoảng bài thứ 16 trở đi các `get` thất bại, tool trả danh sách thiếu hoặc "Chưa có bài nào khớp điều kiện" trong khi repo có bài; Claude có thể tạo trùng bài. Trên gói trả phí vẫn tốn 40× tải cây đệ quy và chạm rate limit GitHub nhanh hơn.
- Đề xuất: gọi `listLessonFiles()` MỘT lần trong `list`, truyền map file vào `get`/`load`; đọc `bai.md` theo ref cố định (headSha) để nhất quán; lỗi của từng bài thì báo "không đọc được N bài" thay vì nuốt; giới hạn song song (vd. 6).

## Trung bình

### 4. Trang Soạn bài có thể kẹt vĩnh viễn ở trạng thái "chưa gửi lên GitHub được"

- File: `apps/editor/src/server/git-sync-service.ts:36-56, 58-83`; `apps/editor/src/server/editor-http-server.ts:79-83`.
- Mô tả: khi push lỗi, thông báo hứa "Lần lưu sau sẽ tự gửi lại". Nhưng nếu trong lúc đó Claude (MCP) sửa cùng `bai.md` trên GitHub, mọi lần `pull --rebase` sau đều xung đột → `rebase --abort` → `ok:false`; `PUT /api/bai` vẫn tiếp tục lưu, commit thêm, push lại thất bại. Vòng lặp không tự thoát; phụ huynh (không biết git) chỉ thấy thông báo lỗi lặp lại, web không bao giờ nhận các bài lưu sau đó.
- Kịch bản: mất mạng khi lưu bài X (commit local, push lỗi) → phụ huynh nhờ Claude sửa X (Claude thấy bản cũ trên GitHub, commit) → từ đó mọi lần lưu bất kỳ bài nào ở editor đều không lên được GitHub.
- Đề xuất: khi `pull` trả `ok:false` do xung đột, dừng lưu và trả 409 với hướng dẫn rõ; hoặc tự xử lý: với commit local chỉ đụng `content/<id>`, ưu tiên bản local cho đúng thư mục đó (`git rebase -X theirs` phạm vi hẹp) sau khi hỏi xác nhận. Tối thiểu phải sửa thông điệp "Lần lưu sau sẽ tự gửi lại" để không hứa sai.

### 5. Service worker hiện ảnh cũ khi tên file ảnh được dùng lại

- File: `apps/site/public/sw.js:45-46, 73-83`; tên file tái sử dụng do `packages/lesson-core/src/lesson-media-rules.ts:44-54` + `apps/editor/src/server/lesson-file-repository.ts:181-183`.
- Mô tả: `/media/*` dùng stale-while-revalidate. Editor xoá file không còn tham chiếu; lần tải lên sau cùng tên (`anh.png`) không bị đổi tên vì file cũ đã mất → cùng URL, nội dung khác.
- Kịch bản: phụ huynh thay ảnh đề bài (xoá dòng ảnh cũ, lưu; tải ảnh mới cùng tên, lưu). Máy tính bảng của bé đã từng mở bài → lần mở đầu tiên sau đó hiện ẢNH CŨ (sai đề), chỉ lần tải sau mới đúng.
- Đề xuất: cho tên file media tính cả nội dung (vd. thêm 8 ký tự hash vào tên khi lưu) để URL bất biến theo nội dung, rồi đổi `/media/` sang cache-first; hoặc đổi sang network-first cho `/media/` giống trang.

### 6. Bài nháp lỗi nhưng không có dòng `nhap: true` chính xác bị coi là bài đã đăng → build dừng toàn bộ

- File: `apps/site/src/lib/lesson-catalog.ts:67-70` (regex `/^nhap:\s*true\s*$/m`).
- Mô tả: schema coi `nhap` thiếu là `true` (nháp) và YAML chấp nhận `True`/`nhap: true # ghi chú`, nhưng regex chỉ khớp đúng `nhap: true`. Đã chạy thử: frontmatter `nhap: True` + một lỗi viết hoa → YAML đọc `true`, regex trả `false` → vào `brokenPublished` → `throw` → deploy-web thất bại cho mọi bài.
- Kịch bản: phụ huynh/AI sửa tay `bai.md` trên GitHub, viết `nhap: True` hoặc bỏ dòng `nhap`, bài còn lỗi chính tả → web ngừng cập nhật.
- Đề xuất: khi frontmatter parse được, dùng giá trị thật: `const raw = splitLessonSource(folder.source).rawFrontmatter; const nhap = (raw as any)?.nhap; isDraft = nhap === undefined || nhap === true`; chỉ dùng heuristic khi YAML hỏng.

## Thấp

### 7. Renderer không giới hạn số hình minh hoạ — treo tab khi xem trước

- File: `packages/lesson-core/src/render/lesson-section-html-renderer.ts:62-68`.
- Mô tả: validator giới hạn 20 nhưng renderer chỉ kiểm tra `count >= 1`; editor vẫn render bản xem trước khi bài có lỗi. `::hinh{loai=tao so-luong=50000000}` → `Array.from` 50 triệu phần tử + `innerHTML` mỗi lần gõ phím → treo/crash tab Soạn bài (có thể mất nội dung chưa lưu).
- Đề xuất: trong renderer thêm `|| block.count > MAX_ILLUSTRATION_COUNT` vào điều kiện return ''.

### 8. `list_lessons` lọc theo ngày dựa vào mã bài, không theo `ngay`

- File: `apps/mcp-worker/src/lessons/lesson-service.ts:111-114`.
- Mô tả: `update_lesson` cho đổi `ngay` nhưng mã bài giữ nguyên ngày cũ; lọc `tu_ngay/den_ngay` và cắt 40 bài dùng `id.slice(0,10)`. Bài đã đổi ngày bị lọc sai/thiếu, trong khi web xếp theo `frontmatter.ngay`.
- Đề xuất: lọc sau khi đọc frontmatter (đã đọc sẵn trong `get`), hoặc ghi rõ trong mô tả tool.

### 9. `resourceMetadata.resource` bị chốt theo host của request đầu tiên trong isolate

- File: `apps/mcp-worker/src/worker-entry.ts:12-28`.
- Mô tả: provider được cache ở cấp module với `resource = new URL('/mcp', request.url)` của request đầu tiên. Thư viện 1.x so audience token CHÍNH XÁC với giá trị này. Nếu Worker còn truy cập được qua `*.workers.dev` (wrangler.jsonc không đặt `workers_dev: false`) thì một request vào workers.dev (bot quét, hoặc cố ý) làm isolate đó chốt resource là workers.dev → token cấp cho `mcp-baitap.inetdev.io.vn` bị từ chối ngẫu nhiên (401) cho tới khi isolate được thay.
- Đề xuất: đọc resource từ biến cấu hình (vd. `vars.MCP_PUBLIC_URL`) và đặt `"workers_dev": false`, `"preview_urls": false` trong wrangler.jsonc.

### 10. Media của bài nháp (kể cả nháp lỗi) được đưa lên web công khai với URL đoán được

- File: `apps/site/scripts/sync-lesson-media.ts:167-177`.
- Mô tả: script chép mọi file của mọi thư mục bài, không phân biệt nháp, bài lỗi, file không còn tham chiếu. URL `/media/<ngày>-<slug>/<tên>` dễ đoán (khác với trang xem trước dùng mã ngẫu nhiên). Rủi ro thấp nếu repo GitHub đã công khai; nếu repo private thì đây là rò rỉ.
- Đề xuất: sau khi dựng catalog, chỉ chép file được bài hợp lệ tham chiếu; với nháp, đặt media dưới `/xem-truoc/<ma>/` thay vì `/media/<id>/`.

### 11. Tên file ảnh dạng percent-encoding bị mã hoá hai lần

- File: `apps/site/src/lib/lesson-catalog.ts:75` và `apps/editor/src/ui/editor-state.ts:32-34` (dùng `block.src` thô); validator giải mã ở `lesson-validator.ts:152`.
- Mô tả: `![](%E1%BA%A3nh.png)` qua validator (giải mã thành `ảnh.png`, file tồn tại) nhưng URL thành `%25E1%25BA...` → ảnh 404 trên web đã đăng. Chỉ xảy ra khi viết tay Markdown (editor/MCP đặt tên slug).
- Đề xuất: truyền tên đã giải mã (`decodeURISafely(src)`) vào `resolveMediaUrl`, hoặc validator báo lỗi khi src có `%`.

### 12. `add_media` báo lỗi chung khi URL/base64 hỏng

- File: `apps/mcp-worker/src/github/media-fetcher.ts:335` (`decodeURIComponent` có thể ném URIError), `apps/mcp-worker/src/github/github-content-store.ts:451-455` (`atob` ném DOMException).
- Mô tả: lỗi không phải `MediaFetchError/LessonServiceError` → `run()` trả "Có lỗi khi làm việc với kho bài. Thử lại sau ít phút." — Claude sẽ thử lại vô ích. Không có rủi ro bảo mật.
- Đề xuất: bọc hai chỗ trên và ném `MediaFetchError`/`LessonServiceError` với thông điệp đúng.

### 13. Đăng ký client động mở cho mọi redirect_uri (consent phishing)

- File: `apps/mcp-worker/src/worker-entry.ts:22` (`clientRegistrationEndpoint: '/register'`).
- Mô tả: ai cũng đăng ký được client với redirect bất kỳ và tên tuỳ ý; nếu phụ huynh bị lừa bấm "Đồng ý" trên hộp thoại (tên client giả "Claude"), GitHub đã cấp quyền trước đó sẽ tự chuyển tiếp → kẻ tấn công nhận token MCP có quyền ghi bài. Allowlist GitHub login không chặn được vì chính phụ huynh đăng nhập. Đây là rủi ro vốn có của DCR, không phải lỗi code.
- Đề xuất: chỉ chấp nhận redirect_uri thuộc `https://claude.ai/api/mcp/auth_callback` (và `https://claude.com/...` nếu cần) trong handler đăng ký, hoặc hiện rõ redirect host trên hộp thoại đồng ý.

---

## Các điểm đã kiểm tra và KHÔNG thấy lỗi

- Path traversal editor: `/media/:id/:file`, `/media-tam`, `/illustrations/*`, `/fonts/*` đều bị giam trong thư mục gốc bởi `static-file-response.ts:33-35`; mã bài/draftKey kiểm tra bằng regex trước khi dựng đường dẫn; `save()` validate `ngay` trước khi `mkdir`.
- CSRF/DNS rebinding editor: Host bị chặn ngoài `127.0.0.1:4321|localhost:4321`; POST/PUT/DELETE từ trang lạ luôn có Origin nên bị chặn (kể cả `Origin: null`).
- `set:html` JSON ở `index.astro:33`: chỉ chứa mã bài và ngày đã qua regex, không chèn được `</script>`.
- SSRF media-fetcher: chặn scheme, cổng, userinfo, IP nội bộ, chỉ theo 1 redirect và kiểm tra lại đích; Worker vốn không ra được mạng nội bộ. Giới hạn 10MB đọc theo luồng.
- OAuth: state gắn cookie phiên, CSRF token cho form đồng ý, thư viện kiểm tra lại redirect_uri khi `completeAuthorization`, token GitHub của người dùng không được lưu, allowlist so sánh không phân biệt hoa thường, `init()` không đăng ký tool khi `props.login` sai.
- Service worker: trang dùng network-first (bài mới hiện khi có mạng), không cache `/xem-truoc/`, bỏ qua video/Range; `sw.js` và manifest `no-cache`.

## Hạng mục đề xuất theo thứ tự

1. Lọc scheme link/ảnh trong renderer + validator (phát hiện 1) — kèm test.
2. Phát hiện xung đột khi ghi ở MCP và editor (phát hiện 2), sửa luồng kẹt git (phát hiện 4).
3. Bỏ N+1 và không nuốt lỗi trong `list_lessons` (phát hiện 3).
4. Sửa `isDraftSource` (6), giới hạn renderer (7), URL media bất biến theo nội dung (5).
5. Các mục thấp còn lại.

## Câu hỏi chưa giải quyết

- Repo GitHub `achoo254/bai-tap-lop-2` public hay private? Quyết định mức độ của phát hiện 10.
- Worker MCP chạy gói Free hay Paid? Quyết định phát hiện 3 là lỗi chức năng ngay (Free, >~16 bài) hay chỉ là hiệu năng.
- `workers_dev` có đang bật trên Cloudflare cho `bai-tap-lop-2-mcp` không (phát hiện 9)?
