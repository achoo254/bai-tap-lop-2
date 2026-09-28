/**
 * apps/site/src/components/game/characters/boss-timo.ts
 *
 * Boss Sự kiện TIMO Khối 2: "Thuyền Trưởng Bội Số" (Captain Octo)
 * Trùm cuối canh giữ kho báu Quần Đảo Số.
 */

export interface BossDefinition {
  id: string;
  name: string;
  title: string;
  dialogueIntro: string;
  dialogueDefeat: string;
  renderSvg: (size?: number, mood?: 'thach-thuc' | 'thua') => string;
}

export const BOSS_TIMO: BossDefinition = {
  id: 'boss-thuyen-truong-boi-so',
  name: 'Thuyền Trưởng Bội Số',
  title: 'Chúa Tể Quần Đảo Số — Boss Cuối TIMO Khối 2',
  dialogueIntro: 'Haha! Muốn lấy cúp vàng Quần Đảo Số ư? Hãy vượt qua màn đấu phép tính của ta!',
  dialogueDefeat:
    'Không thể tin được! Miu tính toán quá chuẩn xác! Chiếc cúp vàng xứng đáng thuộc về bé!',
  renderSvg: (size = 220, mood = 'thach-thuc') => {
    const isDefeated = mood === 'thua';
    return `
<svg class="boss-character boss-timo ${isDefeated ? 'boss-defeated' : ''}" viewBox="0 0 200 200" width="${size}" height="${size}" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Thuyền Trưởng Bội Số">
  <!-- 8 Xúc tua bạch tuộc uốn lượn -->
  <g stroke="#4c0519" stroke-width="4" stroke-linecap="round" stroke-linejoin="round">
    <!-- Xúc tua sau -->
    <path d="M40 140 Q10 160 30 180 Q50 180 60 160" fill="#e11d48" />
    <path d="M160 140 Q190 160 170 180 Q150 180 140 160" fill="#e11d48" />
    <!-- Xúc tua trước -->
    <path d="M60 150 Q40 185 70 190 Q90 185 85 160" fill="#f43f5e" />
    <path d="M140 150 Q160 185 130 190 Q110 185 115 160" fill="#f43f5e" />
    <!-- Xúc tua vẫy cờ toán học -->
    <path d="M30 120 Q10 100 25 80" fill="none" stroke="#be123c" stroke-width="12" />
    <path d="M170 120 Q190 100 175 80" fill="none" stroke="#be123c" stroke-width="12" />
  </g>

  <!-- Cờ toán học trên xúc tua trái -->
  <g stroke="#451a03" stroke-width="2">
    <line x1="20" y1="50" x2="20" y2="90" stroke="#78350f" stroke-width="4" stroke-linecap="round" />
    <polygon points="20,50 60,62 20,74" fill="#facc15" />
    <text x="32" y="66" font-family="Andika, sans-serif" font-size="14" font-weight="900" fill="#991b1b">±</text>
  </g>

  <!-- Thân tròn đầu to của bạch tuộc -->
  <ellipse cx="100" cy="115" rx="55" ry="46" fill="#f43f5e" stroke="#4c0519" stroke-width="4.5" />
  <ellipse cx="100" cy="125" rx="34" ry="24" fill="#fda4af" />

  <!-- Mắt / Bịt mắt hải tặc -->
  ${
    isDefeated
      ? `
    <!-- Mắt xoay xoay khi thua -->
    <g fill="none" stroke="#4c0519" stroke-width="4" stroke-linecap="round">
      <path d="M72 108 L86 122 M86 108 L72 122" />
      <path d="M114 108 L128 122 M128 108 L114 122" />
    </g>`
      : `
    <!-- Mắt thách thức & Bịt mắt hải tặc ngầu -->
    <g>
      <!-- Mắt trái tinh anh -->
      <circle cx="78" cy="112" r="14" fill="#fff" stroke="#4c0519" stroke-width="3.5" />
      <circle cx="82" cy="112" r="7" fill="#1e1b4b" />
      <circle cx="80" cy="110" r="2.5" fill="#fff" />
      <!-- Bịt mắt hải tặc bên phải -->
      <path d="M60 96 L140 126" stroke="#1e1b4b" stroke-width="3" stroke-linecap="round" />
      <ellipse cx="122" cy="114" rx="14" ry="12" fill="#0f172a" stroke="#4c0519" stroke-width="3" />
      <circle cx="122" cy="114" r="5" fill="#eab308" />
    </g>`
  }

  <!-- Miệng -->
  ${
    isDefeated
      ? `<path d="M90 144 Q100 134 110 144" fill="none" stroke="#4c0519" stroke-width="4" stroke-linecap="round" />`
      : `<path d="M88 138 Q100 152 112 138" fill="#881337" stroke="#4c0519" stroke-width="3.5" stroke-linejoin="round" />`
  }

  <!-- Mũ Thuyền Trưởng Hải Tặc màu đen viền vàng -->
  <g stroke="#0f172a" stroke-width="3.5" stroke-linejoin="round">
    <!-- Vành mũ cong hải tặc 2 sừng -->
    <path d="M36 86 C50 60 70 70 100 68 C130 70 150 60 164 86 C140 92 60 92 36 86 Z" fill="#0f172a" />
    <path d="M44 84 C70 88 130 88 156 84" fill="none" stroke="#eab308" stroke-width="4" stroke-linecap="round" />
    <!-- Biểu tượng dấu nhân và cộng vàng trên mũ -->
    <circle cx="100" cy="74" r="8" fill="#ca8a04" stroke="#713f12" stroke-width="1.5" />
    <text x="100" y="79" font-family="Andika, sans-serif" font-size="14" font-weight="900" fill="#fef08a" text-anchor="middle">×</text>
    <!-- Lông vũ đỏ trên mũ -->
    <path d="M140 68 Q158 44 170 48 Q162 62 148 72 Z" fill="#ef4444" stroke="#7f1d1d" stroke-width="2" />
  </g>
</svg>
`.trim();
  },
};
