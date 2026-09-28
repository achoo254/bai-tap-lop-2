/**
 * apps/site/src/components/game/characters/npc-guide.ts
 *
 * Các nhân vật dẫn đường (NPC Guides) cho 3 Vùng học tập và Sự kiện.
 * Vẽ hoàn toàn bằng code SVG vector theo phong cách nét mực đậm + màu pastel.
 */

export interface NpcDefinition {
  id: string;
  name: string;
  title: string;
  region: 'toan' | 'tieng-viet' | 'tieng-anh' | 'timo';
  greeting: string;
  renderSvg: (size?: number) => string;
}

export const NPC_GUIDES: Record<string, NpcDefinition> = {
  'cu-thong-thai': {
    id: 'cu-thong-thai',
    name: 'Cú Thông Thái',
    title: 'Người Dẫn Đường Vùng Toán',
    region: 'toan',
    greeting: 'Chào Miu! Cùng ta khám phá bí mật của những con số kỳ diệu nhé!',
    renderSvg: (size = 180) =>
      `
<svg class="npc-character npc-cu-thong-thai" viewBox="0 0 160 160" width="${size}" height="${size}" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Cú Thông Thái">
  <!-- Thân cú -->
  <ellipse cx="80" cy="95" rx="46" ry="50" fill="#a16207" stroke="#451a03" stroke-width="4" />
  <ellipse cx="80" cy="102" rx="30" ry="34" fill="#fef08a" />
  <!-- Chân bám cành cây -->
  <circle cx="65" cy="144" r="6" fill="#f59e0b" stroke="#451a03" stroke-width="2.5" />
  <circle cx="95" cy="144" r="6" fill="#f59e0b" stroke="#451a03" stroke-width="2.5" />
  <!-- Cánh trái & phải -->
  <path d="M34 85 C26 105 36 125 44 115" fill="#78350f" stroke="#451a03" stroke-width="3" />
  <path d="M126 85 C134 105 124 125 116 115" fill="#78350f" stroke="#451a03" stroke-width="3" />
  <!-- Hai mắt to tròn viền kính -->
  <circle cx="60" cy="70" r="18" fill="#fff" stroke="#0284c7" stroke-width="4" />
  <circle cx="100" cy="70" r="18" fill="#fff" stroke="#0284c7" stroke-width="4" />
  <line x1="78" y1="70" x2="82" y2="70" stroke="#0284c7" stroke-width="4" />
  <circle cx="62" cy="70" r="8" fill="#1e1b4b" />
  <circle cx="98" cy="70" r="8" fill="#1e1b4b" />
  <circle cx="60" cy="68" r="2.5" fill="#fff" />
  <circle cx="96" cy="68" r="2.5" fill="#fff" />
  <!-- Mỏ cú -->
  <polygon points="76,82 84,82 80,92" fill="#ea580c" stroke="#451a03" stroke-width="2.5" />
  <!-- Lông mày/tai thông thái -->
  <path d="M46 54 L62 60 M114 54 L98 60" stroke="#78350f" stroke-width="5" stroke-linecap="round" />
  <!-- Mũ cử nhân -->
  <polygon points="80,18 126,30 80,42 34,30" fill="#1e1b4b" stroke="#0f172a" stroke-width="3" />
  <rect x="62" y="32" width="36" height="12" rx="2" fill="#312e81" />
  <path d="M80,30 Q106,34 112,48" fill="none" stroke="#facc15" stroke-width="2.5" stroke-linecap="round" />
  <circle cx="112" cy="50" r="3.5" fill="#facc15" />
</svg>`.trim(),
  },

  'rua-tri-thuc': {
    id: 'rua-tri-thuc',
    name: 'Bác Rùa Kể Chuyện',
    title: 'Người Dẫn Đường Vùng Tiếng Việt',
    region: 'tieng-viet',
    greeting: 'Chào bé Miu đáng yêu! Cùng bác mở trang sách khám phá những câu chuyện hay nhé!',
    renderSvg: (size = 180) =>
      `
<svg class="npc-character npc-rua-tri-thuc" viewBox="0 0 160 160" width="${size}" height="${size}" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Bác Rùa Kể Chuyện">
  <!-- Mai rùa lớn phía sau -->
  <ellipse cx="80" cy="95" rx="52" ry="42" fill="#16a34a" stroke="#14532d" stroke-width="4" />
  <!-- Hoạ tiết mai rùa hình lục giác -->
  <circle cx="80" cy="90" r="14" fill="#22c55e" stroke="#14532d" stroke-width="2.5" />
  <circle cx="56" cy="98" r="10" fill="#22c55e" stroke="#14532d" stroke-width="2" />
  <circle cx="104" cy="98" r="10" fill="#22c55e" stroke="#14532d" stroke-width="2" />
  <!-- Bốn chân rùa tròn -->
  <circle cx="42" cy="126" r="12" fill="#86efac" stroke="#14532d" stroke-width="3" />
  <circle cx="118" cy="126" r="12" fill="#86efac" stroke="#14532d" stroke-width="3" />
  <!-- Đầu bác rùa -->
  <circle cx="80" cy="54" r="26" fill="#86efac" stroke="#14532d" stroke-width="4" />
  <!-- Kính lão mắt tròn hiền từ -->
  <circle cx="72" cy="52" r="9" fill="#e0f2fe" fill-opacity="0.5" stroke="#92400e" stroke-width="2.5" />
  <circle cx="88" cy="52" r="9" fill="#e0f2fe" fill-opacity="0.5" stroke="#92400e" stroke-width="2.5" />
  <line x1="81" y1="52" x2="79" y2="52" stroke="#92400e" stroke-width="2" />
  <circle cx="72" cy="52" r="3.5" fill="#1e1b4b" />
  <circle cx="88" cy="52" r="3.5" fill="#1e1b4b" />
  <!-- Nụ cười hiền hậu -->
  <path d="M74 66 Q80 72 86 66" fill="none" stroke="#14532d" stroke-width="3" stroke-linecap="round" />
  <!-- Khăn quàng cổ hồng cam ấm áp -->
  <path d="M60 74 C60 70 100 70 100 74 L96 86 C80 90 80 90 64 86 Z" fill="#fb7185" stroke="#9f1239" stroke-width="3" />
  <!-- Đuôi khăn rủ -->
  <rect x="84" y="82" width="10" height="20" rx="3" fill="#fb923c" stroke="#9f1239" stroke-width="2" />
</svg>`.trim(),
  },

  'bo-cau-timo': {
    id: 'bo-cau-timo',
    name: 'Bồ Câu Hermes',
    title: 'Sứ Giả Đưa Thư TIMO',
    region: 'timo',
    greeting: 'Gửi Miu thư mời tham gia Đại Chiến Quần Đảo Số TIMO! Mau nhận thử thách!',
    renderSvg: (size = 180) =>
      `
<svg class="npc-character npc-bo-cau-timo" viewBox="0 0 160 160" width="${size}" height="${size}" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Bồ Câu Hermes">
  <!-- Thân bồ câu trắng xanh -->
  <ellipse cx="80" cy="90" rx="38" ry="42" fill="#e0f2fe" stroke="#0369a1" stroke-width="4" />
  <!-- Cánh trái giơ lên chào -->
  <path d="M42 85 C20 70 28 45 52 65 Z" fill="#bae6fd" stroke="#0369a1" stroke-width="3" stroke-linejoin="round" />
  <!-- Đầu bồ câu -->
  <circle cx="92" cy="56" r="22" fill="#f0f9ff" stroke="#0369a1" stroke-width="3.5" />
  <!-- Mắt lanh lợi -->
  <circle cx="98" cy="54" r="6" fill="#1e1b4b" />
  <circle cx="96" cy="52" r="2" fill="#fff" />
  <!-- Mỏ ngậm phong thư -->
  <polygon points="106,56 122,60 106,64" fill="#f59e0b" stroke="#78350f" stroke-width="2" />
  <!-- Túi đeo đưa thư màu đỏ lễ hội -->
  <path d="M60 84 L104 116" stroke="#b91c1c" stroke-width="4" stroke-linecap="round" />
  <rect x="80" y="98" width="28" height="20" rx="4" fill="#ef4444" stroke="#7f1d1d" stroke-width="2.5" />
  <!-- Phong thư có cánh dấu niêm phong vàng -->
  <circle cx="94" cy="108" r="4" fill="#facc15" />
  <!-- Mũ phi công đưa thư -->
  <ellipse cx="92" cy="40" rx="16" ry="6" fill="#b45309" stroke="#78350f" stroke-width="2" />
  <circle cx="86" cy="40" r="5" fill="#38bdf8" stroke="#0369a1" stroke-width="1.5" />
  <circle cx="98" cy="40" r="5" fill="#38bdf8" stroke="#0369a1" stroke-width="1.5" />
</svg>`.trim(),
  },
};
