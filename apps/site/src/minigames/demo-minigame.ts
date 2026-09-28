/**
 * apps/site/src/minigames/demo-minigame.ts
 *
 * Mini-game mẫu (Demo Mini-game) dùng để kiểm thử vòng chơi trọn vẹn:
 * Explore -> Encounter -> Solve -> Reward -> Unlock trong Phase 3.
 * Thao tác trực quan, chạm lớn (>= 56px), hoạt ảnh phản hồi nhanh mượt mà trên iPad.
 */
import type { Challenge, MiniGame, QuestApi, HintTier } from './minigame-types';

export interface DemoChallenge extends Challenge {
  type: 'dem-keo' | 'chan-le' | 'tinh-nham';
  itemsCount?: number;
  number?: number;
  options?: number[];
  hintText?: {
    1: string;
    2: string;
    3: string;
  };
}

export class DemoMiniGame implements MiniGame<DemoChallenge> {
  id = 'demo';
  name = 'Mini-game Mẫu (Thu Thập & Phân Loại)';

  private container: HTMLElement | null = null;
  private api: QuestApi | null = null;
  private currentChallenge: DemoChallenge | null = null;
  private hintElement: HTMLElement | null = null;

  mount(stage: HTMLElement, challenge: DemoChallenge, api: QuestApi): void {
    this.container = stage;
    this.api = api;
    this.currentChallenge = challenge;
    stage.innerHTML = '';

    const root = document.createElement('div');
    root.className = 'demo-minigame-root';
    root.style.cssText = `
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      width: 100%;
      height: 100%;
      min-height: 380px;
      padding: 1.5rem;
      gap: 1.5rem;
      user-select: none;
    `;

    // 1. Khung hiển thị câu hỏi / vật thể
    const displayArea = document.createElement('div');
    displayArea.className = 'demo-display-area';
    displayArea.style.cssText = `
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      justify-content: center;
      gap: 1rem;
      padding: 1.5rem;
      background: rgba(255, 255, 255, 0.9);
      border: 3px solid #bae6fd;
      border-radius: 20px;
      box-shadow: 0 8px 24px rgba(2, 132, 199, 0.1);
      max-width: 500px;
      width: 100%;
      min-height: 140px;
    `;

    if (challenge.type === 'dem-keo') {
      const count = challenge.itemsCount ?? 6;
      for (let i = 0; i < count; i++) {
        const candy = document.createElement('div');
        candy.className = 'demo-candy-item';
        candy.textContent = '🍬';
        candy.style.cssText = `
          font-size: 2.8rem;
          transform: scale(1);
          transition: transform 0.2s cubic-bezier(0.34, 1.56, 0.64, 1);
          cursor: pointer;
        `;
        candy.addEventListener('click', () => {
          candy.style.transform = 'scale(1.3) rotate(15deg)';
          this.api?.sfx('correct');
          setTimeout(() => (candy.style.transform = 'scale(1)'), 250);
        });
        displayArea.appendChild(candy);
      }
    } else if (challenge.type === 'chan-le') {
      const num = challenge.number ?? 14;
      const numCard = document.createElement('div');
      numCard.className = 'demo-number-card';
      numCard.innerHTML = `
        <span style="font-size: 1.1rem; color: #64748b; font-weight: bold;">Số cần xếp:</span>
        <div class="lesson-font" style="font-size: 3.5rem; font-weight: 900; color: #0284c7;">${num}</div>
      `;
      numCard.style.textAlign = 'center';
      displayArea.appendChild(numCard);
    } else {
      // Phép tính
      const promptText = document.createElement('div');
      promptText.className = 'lesson-font';
      promptText.style.cssText = 'font-size: 2.5rem; font-weight: 900; color: #0f172a;';
      promptText.textContent = challenge.prompt;
      displayArea.appendChild(promptText);
    }
    root.appendChild(displayArea);

    // 2. Vùng hiển thị gợi ý khi bấm đèn
    this.hintElement = document.createElement('div');
    this.hintElement.className = 'demo-hint-box lesson-font';
    this.hintElement.style.cssText = `
      display: none;
      padding: 0.75rem 1.25rem;
      background: #fef9c3;
      border: 2px dashed #eab308;
      border-radius: 12px;
      font-size: 1rem;
      color: #854d0e;
      font-weight: 600;
      text-align: center;
      max-width: 480px;
    `;
    root.appendChild(this.hintElement);

    // 3. Vùng tương tác chọn đáp án (Nút lớn >= 56px cho iPad)
    const optionsArea = document.createElement('div');
    optionsArea.className = 'demo-options-area';
    optionsArea.style.cssText = `
      display: flex;
      flex-wrap: wrap;
      justify-content: center;
      gap: 1rem;
      width: 100%;
      max-width: 500px;
    `;

    if (challenge.type === 'chan-le') {
      const choices = [
        { label: '🧺 Giỏ Số Chẵn', value: 'chan', color: '#0284c7', bg: '#e0f2fe' },
        { label: '🧺 Giỏ Số Lẻ', value: 'le', color: '#ea580c', bg: '#ffedd5' },
      ];
      choices.forEach((c) => {
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'demo-choice-btn lesson-font';
        btn.textContent = c.label;
        btn.dataset.answer = String(c.value);
        btn.style.cssText = `
          flex: 1 1 180px;
          min-height: 64px;
          padding: 1rem 1.5rem;
          font-size: 1.25rem;
          font-weight: 800;
          color: ${c.color};
          background: ${c.bg};
          border: 3px solid ${c.color};
          border-radius: 16px;
          cursor: pointer;
          transition: transform 0.15s, box-shadow 0.15s;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
          touch-action: manipulation;
        `;
        btn.addEventListener('click', () => this.handleAnswer(c.value, btn));
        optionsArea.appendChild(btn);
      });
    } else {
      const opts = challenge.options ?? [4, 5, 6, 7];
      opts.forEach((optVal) => {
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'demo-choice-btn lesson-font';
        btn.textContent = String(optVal);
        btn.dataset.answer = String(optVal);
        btn.style.cssText = `
          min-width: 68px;
          min-height: 64px;
          font-size: 1.8rem;
          font-weight: 900;
          color: #0f172a;
          background: #ffffff;
          border: 3px solid #cbd5e1;
          border-radius: 16px;
          cursor: pointer;
          transition: transform 0.15s, border-color 0.15s, background-color 0.15s;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.06);
          touch-action: manipulation;
        `;
        btn.addEventListener('click', () => this.handleAnswer(optVal, btn));
        optionsArea.appendChild(btn);
      });
    }

    root.appendChild(optionsArea);
    stage.appendChild(root);

    // Tự động đọc câu hỏi khi bắt đầu nếu có
    if (challenge.speakText) {
      setTimeout(() => {
        api.speak(challenge.speakText!);
      }, 300);
    }
  }

  /** Tô xanh nút đáp án đúng. */
  private markCorrect(btn: HTMLElement): void {
    btn.style.background = '#dcfce7';
    btn.style.borderColor = '#16a34a';
    btn.style.color = '#15803d';
    btn.style.transform = 'scale(1.08)';
  }

  showSolved(): void {
    const expected = String(this.currentChallenge?.expectedAnswer ?? '');
    const btn = this.container?.querySelector<HTMLElement>(`[data-answer="${expected}"]`);
    if (btn) this.markCorrect(btn);
  }

  private handleAnswer(answer: unknown, btnElement: HTMLElement): void {
    if (!this.api || !this.currentChallenge) return;

    const res = this.api.submit(answer);
    if (res.correct) {
      this.markCorrect(btnElement);
      void this.playOutcome(true);
    } else {
      btnElement.style.background = '#fee2e2';
      btnElement.style.borderColor = '#dc2626';
      btnElement.style.color = '#991b1b';
      // Hiệu ứng rung lắc nhẹ khi chọn chưa đúng
      btnElement.style.animation = 'demo-shake 0.4s ease';
      setTimeout(() => {
        btnElement.style.animation = '';
        btnElement.style.background = '';
        btnElement.style.borderColor = '';
        btnElement.style.color = '';
      }, 800);
      void this.playOutcome(false);
    }
  }

  showHint(tier: HintTier): void {
    if (!this.hintElement || !this.currentChallenge) return;
    const hints = this.currentChallenge.hintText;
    let text: string;
    if (hints && hints[tier]) {
      text = hints[tier];
    } else if (tier === 1) {
      text = '💡 Gợi ý hướng đi: Đếm chậm rãi từng vật một từ trái sang phải nhé!';
    } else if (tier === 2) {
      text = '💡 Gợi ý chi tiết: Nhìn vào chữ số tận cùng xem là 0, 2, 4, 6, 8 hay 1, 3, 5, 7, 9!';
    } else {
      text = `💡 Đáp án chính xác là: ${String(this.currentChallenge.expectedAnswer)}`;
    }

    this.hintElement.textContent = text;
    this.hintElement.style.display = 'block';
    this.hintElement.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    this.api?.speak(text);
  }

  async playOutcome(correct: boolean): Promise<void> {
    if (!this.container) return;
    if (correct) {
      this.api?.sfx('cheer');
      // Tạo pháo giấy nhỏ trên DOM
      const sparkle = document.createElement('div');
      sparkle.textContent = '🌟✨🎉';
      sparkle.style.cssText = `
        position: absolute;
        top: 30%;
        left: 50%;
        transform: translate(-50%, -50%) scale(1.5);
        font-size: 3rem;
        pointer-events: none;
        animation: demo-pop 0.6s ease forwards;
      `;
      this.container.appendChild(sparkle);
      await new Promise((r) => setTimeout(r, 600));
      sparkle.remove();
    } else {
      this.api?.sfx('fail');
    }
  }

  unmount(): void {
    if (this.container) {
      this.container.innerHTML = '';
      this.container = null;
    }
    this.api = null;
    this.currentChallenge = null;
    this.hintElement = null;
  }
}
