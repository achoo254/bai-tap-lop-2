/**
 * apps/site/src/minigames/doc-hieu-minigame.ts
 *
 * Mini-game Đọc hiểu Tiếng Việt (Reading Comprehension Mini-game):
 * - Hiển thị bài đọc trực quan, có giọng đọc to truyền cảm
 * - Câu hỏi đọc hiểu và luyện tập tương tác (chạm chọn lớn >= 56px)
 * - Gợi ý 3 bậc (hướng dẫn tìm kiếm -> manh mối -> lời giải)
 * - Mẫu câu trả lời chuẩn mực để bé Miu chép vào vở hướng dẫn học
 */
import type { Challenge, MiniGame, QuestApi, HintTier } from './minigame-types';

export interface DocHieuOption {
  id: string;
  text: string;
}

export interface DocHieuChallenge extends Challenge {
  storyTitle: string;
  storyContent: string[];
  vocabulary?: { word: string; meaning: string };
  options: DocHieuOption[];
  explanation: string;
  notebookAnswer: string;
  hintText: {
    1: string;
    2: string;
    3: string;
  };
}

export class DocHieuMiniGame implements MiniGame<DocHieuChallenge> {
  id = 'doc-hieu';
  name = 'Đọc hiểu & Vốn từ Tiếng Việt';

  private container: HTMLElement | null = null;
  private api: QuestApi | null = null;
  private currentChallenge: DocHieuChallenge | null = null;
  private hintElement: HTMLElement | null = null;
  private answerBoxElement: HTMLElement | null = null;
  private storyCardElement: HTMLElement | null = null;
  private isStoryExpanded = true;
  private isAnswerRevealed = false;

  mount(stage: HTMLElement, challenge: DocHieuChallenge, api: QuestApi): void {
    this.container = stage;
    this.api = api;
    this.currentChallenge = challenge;
    this.isAnswerRevealed = false;
    stage.innerHTML = '';

    const root = document.createElement('div');
    root.className = 'doc-hieu-root';
    root.style.cssText = `
      display: flex;
      flex-direction: column;
      width: 100%;
      max-width: 760px;
      margin: 0 auto;
      padding: 1rem;
      gap: 1.25rem;
      user-select: none;
      box-sizing: border-box;
    `;

    // 1. Nút mở/đóng bài đọc + Nút đọc to toàn bài
    const storyControlBar = document.createElement('div');
    storyControlBar.style.cssText = `
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 0.75rem;
      flex-wrap: wrap;
    `;

    const toggleStoryBtn = document.createElement('button');
    toggleStoryBtn.type = 'button';
    toggleStoryBtn.className = 'story-toggle-btn';
    toggleStoryBtn.innerHTML = `<span>📖</span> <span>${this.isStoryExpanded ? 'Thu gọn bài đọc' : 'Mở xem bài đọc: ' + challenge.storyTitle}</span>`;
    toggleStoryBtn.style.cssText = `
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.6rem 1.2rem;
      background: #fdf2f8;
      color: #be185d;
      border: 2px solid #fbcfe8;
      border-radius: 999px;
      font-weight: 800;
      font-size: 0.95rem;
      cursor: pointer;
      touch-action: manipulation;
      transition: all 0.2s ease;
    `;
    toggleStoryBtn.addEventListener('click', () => {
      this.isStoryExpanded = !this.isStoryExpanded;
      if (this.storyCardElement) {
        this.storyCardElement.style.display = this.isStoryExpanded ? 'block' : 'none';
      }
      toggleStoryBtn.innerHTML = `<span>📖</span> <span>${this.isStoryExpanded ? 'Thu gọn bài đọc' : 'Mở xem bài đọc: ' + challenge.storyTitle}</span>`;
    });

    const readStoryBtn = document.createElement('button');
    readStoryBtn.type = 'button';
    readStoryBtn.innerHTML = `<span>🔊</span> <span>Nghe Sóc Nâu đọc bài</span>`;
    readStoryBtn.style.cssText = `
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.6rem 1.2rem;
      background: #f0fdf4;
      color: #15803d;
      border: 2px solid #bbf7d0;
      border-radius: 999px;
      font-weight: 800;
      font-size: 0.95rem;
      cursor: pointer;
      touch-action: manipulation;
      transition: all 0.2s ease;
    `;
    readStoryBtn.addEventListener('click', () => {
      const fullText = challenge.storyContent.join(' ');
      this.api?.speak(challenge.storyTitle + '. ' + fullText);
    });

    storyControlBar.appendChild(toggleStoryBtn);
    storyControlBar.appendChild(readStoryBtn);
    root.appendChild(storyControlBar);

    // 2. Khung nội dung bài đọc
    const storyCard = document.createElement('div');
    this.storyCardElement = storyCard;
    storyCard.className = 'story-card-box lesson-font';
    storyCard.style.cssText = `
      background: #ffffff;
      border: 3px solid #fbcfe8;
      border-radius: 20px;
      padding: 1.25rem 1.5rem;
      box-shadow: 0 6px 18px rgba(236, 72, 153, 0.08);
      max-height: 280px;
      overflow-y: auto;
      scroll-behavior: smooth;
    `;

    const storyTitleEl = document.createElement('h3');
    storyTitleEl.textContent = challenge.storyTitle;
    storyTitleEl.style.cssText = `
      margin: 0 0 0.75rem 0;
      font-size: 1.35rem;
      font-weight: 900;
      color: #be185d;
      text-align: center;
      letter-spacing: 0.5px;
    `;
    storyCard.appendChild(storyTitleEl);

    challenge.storyContent.forEach((para) => {
      const p = document.createElement('p');
      p.textContent = para;
      p.style.cssText = `
        margin: 0 0 0.6rem 0;
        font-size: 1.05rem;
        line-height: 1.9;
        color: #334155;
        text-indent: 1.2rem;
      `;
      storyCard.appendChild(p);
    });

    if (challenge.vocabulary) {
      const vocabBox = document.createElement('div');
      vocabBox.style.cssText = `
        margin-top: 0.75rem;
        padding: 0.6rem 1rem;
        background: #fffbeb;
        border-left: 4px solid #f59e0b;
        border-radius: 8px;
        font-size: 0.95rem;
        color: #92400e;
      `;
      vocabBox.innerHTML = `<strong>💡 Từ ngữ:</strong> <em>${challenge.vocabulary.word}</em>: ${challenge.vocabulary.meaning}`;
      storyCard.appendChild(vocabBox);
    }
    root.appendChild(storyCard);

    // 3. Khung Câu hỏi
    const questionCard = document.createElement('div');
    questionCard.className = 'question-card-box';
    questionCard.style.cssText = `
      background: #ffffff;
      border: 3px solid #e2e8f0;
      border-radius: 20px;
      padding: 1.25rem;
      display: flex;
      flex-direction: column;
      gap: 1rem;
    `;

    const questionTitle = document.createElement('div');
    questionTitle.className = 'lesson-font';
    questionTitle.style.cssText = `
      font-size: 1.2rem;
      font-weight: 800;
      color: #0f172a;
      line-height: 1.5;
    `;
    questionTitle.innerHTML = `<span style="color: #ec4899; margin-right: 0.4rem;">❓</span> ${challenge.prompt}`;
    questionCard.appendChild(questionTitle);

    // 4. Danh sách phương án lựa chọn (chạm lớn >= 56px)
    const optionsGrid = document.createElement('div');
    optionsGrid.style.cssText = `
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
      width: 100%;
    `;

    challenge.options.forEach((opt, index) => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'doc-hieu-option-btn';
      btn.id = `opt-btn-${opt.id}`;
      btn.style.cssText = `
        display: flex;
        align-items: center;
        gap: 0.75rem;
        min-height: 56px;
        padding: 0.85rem 1.25rem;
        background: #f8fafc;
        border: 2px solid #cbd5e1;
        border-radius: 16px;
        font-size: 1.05rem;
        font-weight: 700;
        color: #1e293b;
        text-align: left;
        cursor: pointer;
        touch-action: manipulation;
        transition: all 0.2s cubic-bezier(0.34, 1.56, 0.64, 1);
        width: 100%;
        box-sizing: border-box;
      `;

      const letterBadge = document.createElement('span');
      letterBadge.textContent = String.fromCharCode(65 + index);
      letterBadge.style.cssText = `
        display: inline-flex;
        align-items: center;
        justify-content: center;
        width: 32px;
        height: 32px;
        border-radius: 50%;
        background: #e2e8f0;
        color: #334155;
        font-weight: 900;
        font-size: 0.95rem;
        flex-shrink: 0;
      `;

      const optText = document.createElement('span');
      optText.textContent = opt.text;
      optText.className = 'lesson-font';
      optText.style.flex = '1';

      btn.appendChild(letterBadge);
      btn.appendChild(optText);

      btn.addEventListener('mouseenter', () => {
        btn.style.borderColor = '#ec4899';
        btn.style.background = '#fdf2f8';
      });
      btn.addEventListener('mouseleave', () => {
        if (!btn.classList.contains('selected')) {
          btn.style.borderColor = '#cbd5e1';
          btn.style.background = '#f8fafc';
        }
      });

      btn.addEventListener('click', () => {
        this.handleSelectOption(opt.id, btn, challenge);
      });

      optionsGrid.appendChild(btn);
    });
    questionCard.appendChild(optionsGrid);

    // 5. Khung Gợi ý 3 bậc
    const hintBox = document.createElement('div');
    this.hintElement = hintBox;
    hintBox.className = 'lesson-font';
    hintBox.style.cssText = `
      display: none;
      padding: 0.85rem 1.25rem;
      background: #eff6ff;
      border: 2px dashed #93c5fd;
      border-radius: 14px;
      font-size: 1rem;
      font-weight: 700;
      color: #1e40af;
      line-height: 1.5;
    `;
    questionCard.appendChild(hintBox);

    // 6. Khung "Mẫu viết vở hướng dẫn học" & Đáp án chi tiết
    const answerBox = document.createElement('div');
    this.answerBoxElement = answerBox;
    answerBox.style.cssText = `
      display: none;
      padding: 1rem 1.25rem;
      background: #fdf4ff;
      border: 2px solid #f0abfc;
      border-radius: 16px;
      color: #701a75;
      font-size: 1rem;
      line-height: 1.6;
    `;
    answerBox.innerHTML = `
      <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 0.5rem;">
        <strong style="color: #a21caf; font-size: 1.05rem;">✍️ Mẫu viết vào vở hướng dẫn học:</strong>
        <span style="font-size: 0.85rem; background: #fae8ff; padding: 0.2rem 0.6rem; border-radius: 999px; font-weight: 800;">Chuẩn ô li</span>
      </div>
      <div class="lesson-font" style="background: #ffffff; border: 1px dashed #d946ef; border-radius: 10px; padding: 0.85rem 1rem; font-weight: 700; color: #4a044e; margin-bottom: 0.5rem;">
        ${challenge.notebookAnswer}
      </div>
      <small class="lesson-font lesson-font--thuong" style="color: #86198f;"><strong>Giải thích:</strong> ${challenge.explanation}</small>
    `;
    questionCard.appendChild(answerBox);

    // Nút chủ động xem đáp án viết vở
    const showAnswerBtn = document.createElement('button');
    showAnswerBtn.type = 'button';
    showAnswerBtn.innerHTML = `<span>✍️</span> <span>Xem đáp án viết vào vở</span>`;
    showAnswerBtn.style.cssText = `
      align-self: flex-start;
      display: inline-flex;
      align-items: center;
      gap: 0.4rem;
      padding: 0.45rem 0.9rem;
      background: transparent;
      color: #9333ea;
      border: 1px solid #d8b4fe;
      border-radius: 8px;
      font-size: 0.9rem;
      font-weight: 700;
      cursor: pointer;
    `;
    showAnswerBtn.addEventListener('click', () => {
      this.isAnswerRevealed = !this.isAnswerRevealed;
      answerBox.style.display = this.isAnswerRevealed ? 'block' : 'none';
      showAnswerBtn.innerHTML = this.isAnswerRevealed
        ? `<span>🙈</span> <span>Ẩn đáp án viết vở</span>`
        : `<span>✍️</span> <span>Xem đáp án viết vào vở</span>`;
    });
    questionCard.appendChild(showAnswerBtn);

    root.appendChild(questionCard);
    stage.appendChild(root);
  }

  private handleSelectOption(
    selectedId: string,
    btn: HTMLButtonElement,
    _challenge: DocHieuChallenge,
  ): void {
    if (!this.api) return;

    const res = this.api.submit(selectedId);
    if (res.correct) {
      btn.style.borderColor = '#10b981';
      btn.style.background = '#ecfdf5';
      btn.style.color = '#065f46';
      btn.style.transform = 'scale(1.02)';
      this.api.sfx('correct');
      this.api.speak('Chính xác rồi! Bé giỏi quá!', 'vi');

      // Tự động mở hộp đáp án viết vở
      if (this.answerBoxElement) {
        this.answerBoxElement.style.display = 'block';
      }
    } else {
      btn.style.borderColor = '#ef4444';
      btn.style.background = '#fef2f2';
      btn.style.color = '#991b1b';
      btn.style.transform = 'translateX(-6px)';
      setTimeout(() => (btn.style.transform = 'translateX(6px)'), 100);
      setTimeout(() => (btn.style.transform = 'translateX(0)'), 200);
      this.api.sfx('wrong');
      this.api.speak('Chưa đúng rồi, bé hãy đọc lại gợi ý nhé!', 'vi');
    }
  }

  showHint(tier: HintTier): void {
    if (!this.hintElement || !this.currentChallenge) return;
    const text = this.currentChallenge.hintText[tier];
    if (text) {
      this.hintElement.textContent = text;
      this.hintElement.style.display = 'block';
      this.api?.speak(text.replace(/^(?:💡|\s)+/u, ''), 'vi');
      this.api?.sfx('click');
    }
  }

  async playOutcome(correct: boolean): Promise<void> {
    if (correct) {
      await new Promise((r) => setTimeout(r, 600));
    }
  }

  unmount(): void {
    if (this.container) {
      this.container.innerHTML = '';
    }
    this.container = null;
    this.api = null;
    this.currentChallenge = null;
  }
}
