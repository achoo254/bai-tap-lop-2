# Tiêu chuẩn kỹ thuật & Quy tắc lập trình: bai-tap-lop-2

Tài liệu quy định các tiêu chuẩn kỹ thuật, chính sách kiểm thử và các quy tắc bảo mật bắt buộc đối với mọi đóng góp mã nguồn trong dự án.

---

## 1. Môi trường & Ngôn ngữ

- **Công cụ quản lý gói**: Bắt buộc dùng `pnpm` (phiên bản v10+). Không dùng `npm` hoặc `yarn` để tránh xung đột lockfile.
- **Node.js**: Phiên bản `>= 22` (quy định tại `.nvmrc` và `package.json`).
- **TypeScript**: Chế độ nghiêm ngặt (`strict: true`), 100% mã nguồn dùng TypeScript hoặc Astro component gõ kiểu chặt chẽ.
- **Mô-đun**: ES Modules (`"type": "module"`).

---

## 2. Tiêu chuẩn kiểm thử (Testing Policy)

Chất lượng giáo dục và độ mượt mà khi bé thao tác đòi hỏi kiểm thử nghiêm ngặt:

### 2.1. Kiểm thử bộ sinh câu hỏi (Question Generator Testing)

Mọi kỹ năng học tập tự sinh bằng thuật toán (`SkillDefinition.generate`) **bắt buộc phải có unit test kiểm chứng đáp án đúng trên tối thiểu 200 hạt giống (seeds) ngẫu nhiên cho toàn bộ 5 bậc độ khó**:

```ts
// Ví dụ mẫu kiểm thử bộ sinh câu hỏi
describe('Bộ sinh câu hỏi kỹ năng lop-2/phep-cong-co-nho', () => {
  it('đáp án và dữ liệu câu hỏi hợp lệ trên 200 hạt giống × 5 bậc', () => {
    for (let tier = 1; tier <= 5; tier++) {
      for (let seed = 1; seed <= 200; seed++) {
        const challenge = skill.generate(tier, seed);
        // Kiểm tra tính đúng đắn toán học của kết quả
        expect(challenge.correctAnswer).toBeDefined();
        // Kiểm tra dữ liệu không chứa số âm hoặc ngoài phạm vi chương trình lớp 2
        expect(challenge.operandA + challenge.operandB).toBe(challenge.correctAnswer);
      }
    }
  });
});
```

### 2.2. Kiểm thử 3 bậc gợi ý (Hint Progression Testing)

- Bậc 1: Gợi ý phương pháp (đặt câu hỏi định hướng, không tiết lộ đáp án).
- Bậc 2: Hướng dẫn bước giải cụ thể hoặc khoanh vùng đáp án.
- Bậc 3: Lời giải chi tiết mẫu và kích hoạt câu hỏi song sinh (twin question) để bé thực hành lại.

### 2.3. Kiểm thử giao diện & Cảm ứng (E2E Testing)

- Sử dụng Playwright để kiểm thử luồng người dùng trên web của bé.
- Khung nhìn kiểm thử (viewport): Giả lập kích thước iPad (1024x768 hoặc 1180x820) với tính năng cảm ứng bật sẵn (`hasTouch: true`).
- Kiểm thử kéo-thả phải bao gồm cả thao tác chạm-chọn rồi chạm-đặt (phòng trường hợp trình duyệt không kích hoạt kéo liên tục).

---

## 3. Tiêu chuẩn an toàn & Bảo mật (Security Invariants)

1. **Chống XSS trong Markdown**:
   - Bộ render Markdown ([`packages/lesson-core/src/render/`](file:///Users/hoandat/inet-gitlab/bai-tap-lop-2/packages/lesson-core/src/render/)) và bộ kiểm định ([`packages/lesson-core/src/lesson-validator.ts`](file:///Users/hoandat/inet-gitlab/bai-tap-lop-2/packages/lesson-core/src/lesson-validator.ts)) bắt buộc phải lọc sạch scheme của liên kết: **chỉ chấp nhận `https://`**.
   - Tuyệt đối cấm các liên kết dạng `javascript:` hoặc dữ liệu nhúng thô `data:text/html`.
   - Không cho phép chèn thẻ HTML tuỳ ý vào nội dung Markdown của bài học.
2. **Xác thực dữ liệu trạng thái (State Validation)**:
   - Dữ liệu đọc từ `localStorage` luôn phải qua hàm parse của Zod schema (`GameStateSchema.safeParse`).
   - Mọi trường dữ liệu mới bổ sung vào state phải có giá trị mặc định (`.default(...)`) để không làm hỏng dữ liệu người chơi cũ.
3. **Bảo mật danh tính trẻ em**:
   - Không đưa họ tên đầy đủ, năm sinh hay thông tin trường lớp vào mã nguồn hay dữ liệu bài học. Chỉ sử dụng thông tin định danh ở nhà trong [`CHILD_PROFILE`](file:///Users/hoandat/inet-gitlab/bai-tap-lop-2/packages/lesson-core/src/child-profile.ts).
4. **Không lưu giữ bí mật (Secrets)**:
   - Tuyệt đối không commit token Cloudflare, GitHub token hay khoá bí mật vào kho git. Các biến bí mật chỉ được cấu hình qua Cloudflare Secrets hoặc GitHub Actions Secrets.

---

## 4. Định nghĩa hoàn thành (Definition of Done - DoD)

Một công việc (tính năng mới hoặc sửa lỗi) chỉ được coi là hoàn thành khi:

1. Lệnh kiểm tra toàn bộ hệ thống `pnpm ci:all` chạy thành công (exit code 0), bao gồm:
   - `pnpm lint`: không có lỗi ESLint.
   - `pnpm typecheck`: TypeScript không có lỗi kiểu.
   - `pnpm test`: 100% unit test của toàn bộ các package/app đều xanh.
   - `pnpm build`: build tĩnh web của bé và các app thành công.
2. Bộ sinh câu hỏi mới (nếu có) đạt chuẩn kiểm thử 200 hạt giống × 5 bậc.
3. Tài nguyên hình ảnh mới (nếu có) được cập nhật thông tin nguồn và giấy phép vào `public/game/licenses.json`.
4. Không làm thay đổi trái phép ranh giới giữa Base và Event.
