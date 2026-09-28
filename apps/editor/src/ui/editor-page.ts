import '@fontsource-variable/nunito';
import '../../../site/src/styles/design-tokens.css';
import '../../../site/src/styles/lesson-content.css';
import './editor.css';
import {
  autoFixVietnameseText,
  buildLessonAuthoringPrompt,
  ILLUSTRATION_CATALOG,
  ILLUSTRATION_NAMES,
  markdownForMedia,
  parseAiLessonReply,
} from 'lesson-core';
import { EditorApiError, editorApi, type LessonSummary } from './editor-api-client';
import { createEditorState, insertBlockAtCursor, tomorrowIsoDate } from './editor-state';
import { renderPreview, validateForm, type LessonFormValues } from './live-preview-and-validation';

const $ = <T extends Element>(selector: string) => document.querySelector<T>(selector)!;

const state = createEditorState();
const form = $<HTMLFormElement>('[data-lesson-form]');
const field = <T extends HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>(
  name: string,
) => form.elements.namedItem(name) as T;
const titleInput = field<HTMLInputElement>('tieu_de');
const dateInput = field<HTMLInputElement>('ngay');
const subjectSelect = field<HTMLSelectElement>('mon');
const deBaiInput = field<HTMLTextAreaElement>('deBai');
const loiGiaiInput = field<HTMLTextAreaElement>('loiGiai');
const fileInput = $<HTMLInputElement>('[data-file-input]');
const saveResult = $<HTMLElement>('[data-save-result]');
const syncState = $<HTMLElement>('[data-sync-state]');
const previewElements = {
  title: $<HTMLElement>('[data-preview-title]'),
  deBai: $<HTMLElement>('[data-preview-de-bai]'),
  loiGiai: $<HTMLElement>('[data-preview-loi-giai]'),
  validation: $<HTMLElement>('[data-validation]'),
};

state.activeTextarea = deBaiInput;

// ---------- Đọc form và xem trước ----------

function formValues(): LessonFormValues {
  return {
    tieu_de: titleInput.value.trim(),
    ngay: dateInput.value,
    mon: subjectSelect.value,
    deBai: deBaiInput.value,
    loiGiai: loiGiaiInput.value,
  };
}

function refresh() {
  const values = formValues();
  renderPreview(values, state, validateForm(values, state), previewElements);
  renderFileChips();
}

let refreshTimer: number | undefined;
form.addEventListener('input', () => {
  state.dirty = true;
  window.clearTimeout(refreshTimer);
  refreshTimer = window.setTimeout(refresh, 150);
});
for (const textarea of [deBaiInput, loiGiaiInput]) {
  textarea.addEventListener('focus', () => (state.activeTextarea = textarea));
}

function renderFileChips() {
  const list = $<HTMLUListElement>('[data-file-chips]');
  list.replaceChildren();
  const text = `${deBaiInput.value}\n${loiGiaiInput.value}`;
  for (const name of [...state.lessonFiles, ...state.stagedFiles]) {
    const chip = document.createElement('li');
    const used = text.includes(`](${name})`);
    chip.className = `file-chip${used ? '' : ' file-chip--unused'}`;
    chip.textContent = `${used ? '📎' : '⚪'} ${name}${used ? '' : ' (chưa dùng trong bài)'}`;
    list.append(chip);
  }
}

// ---------- Bài mới / mở bài ----------

function resetForm() {
  Object.assign(state, createEditorState(), { activeTextarea: deBaiInput });
  form.reset();
  dateInput.value = tomorrowIsoDate();
  saveResult.textContent = '';
  refresh();
}

async function openLesson(id: string) {
  if (state.dirty && !confirmDiscard()) return;
  const lesson = await editorApi.get(id);
  Object.assign(state, createEditorState(), {
    activeTextarea: deBaiInput,
    originalId: lesson.id,
    baseVersion: lesson.version,
    lessonFiles: new Set(lesson.files.map((file) => file.name)),
  });
  titleInput.value = lesson.frontmatter.tieu_de ?? '';
  dateInput.value = lesson.frontmatter.ngay ?? '';
  subjectSelect.value = lesson.frontmatter.mon ?? 'khac';
  deBaiInput.value = lesson.deBai;
  loiGiaiInput.value = lesson.loiGiai;
  saveResult.textContent = `Đang sửa bài ${lesson.frontmatter.nhap === false ? 'đã đăng' : 'nháp'}: ${lesson.id}`;
  refresh();
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

/** Bài đang soạn chưa lưu: lần bấm đầu chỉ cảnh báo, bấm lần nữa mới bỏ. */
function confirmDiscard(): boolean {
  saveResult.textContent = '⚠️ Bài đang soạn chưa lưu. Bấm lại lần nữa nếu muốn bỏ.';
  state.dirty = false;
  return false;
}

async function loadLessonList() {
  const list = $<HTMLUListElement>('[data-lesson-list]');
  let lessons: LessonSummary[];
  try {
    lessons = await editorApi.list();
  } catch {
    list.replaceChildren(
      Object.assign(document.createElement('li'), { textContent: 'Không đọc được danh sách bài.' }),
    );
    return;
  }
  list.replaceChildren();
  if (lessons.length === 0) {
    list.append(Object.assign(document.createElement('li'), { textContent: 'Chưa có bài nào.' }));
  }
  for (const lesson of lessons) {
    const item = document.createElement('li');
    item.className = 'lesson-list__item';
    const label = document.createElement('span');
    const status = lesson.soLoi > 0 ? '❗ có lỗi' : lesson.nhap ? '📝 nháp' : '✅ đã đăng';
    label.textContent = `${lesson.ngay} · ${lesson.tieu_de} · ${status}`;
    const openButton = Object.assign(document.createElement('button'), {
      type: 'button',
      className: 'btn btn--small',
      textContent: 'Mở',
    });
    openButton.addEventListener('click', () => void openLesson(lesson.id).catch(showError));
    const deleteButton = Object.assign(document.createElement('button'), {
      type: 'button',
      className: 'btn btn--small btn--danger',
      textContent: 'Xoá',
    });
    // Xoá cần bấm hai lần để tránh bấm nhầm.
    deleteButton.addEventListener('click', async () => {
      if (deleteButton.dataset.confirm !== '1') {
        deleteButton.dataset.confirm = '1';
        deleteButton.textContent = 'Bấm lần nữa để xoá';
        return;
      }
      deleteButton.disabled = true;
      try {
        const result = await editorApi.remove(lesson.id);
        saveResult.textContent = `🗑️ Đã xoá bài. ${result.git.message}`;
        if (state.originalId === lesson.id) resetForm();
        await loadLessonList();
      } catch (error) {
        showError(error);
        deleteButton.disabled = false;
      }
    });
    item.append(label, openButton, deleteButton);
    list.append(item);
  }
}

// ---------- Tải file lên ----------

async function uploadFiles(files: Iterable<File>) {
  const target = state.activeTextarea ?? deBaiInput;
  for (const file of files) {
    saveResult.textContent = `⏳ Đang tải ${file.name}…`;
    try {
      const { fileName } = await editorApi.upload(file, state.draftKey, state.originalId);
      state.stagedFiles.add(fileName);
      const description = file.type.startsWith('video/') ? '' : file.name.replace(/\.[^.]+$/, '');
      insertBlockAtCursor(target, markdownForMedia(fileName, description));
      const sizeMb = file.size / 1024 / 1024;
      saveResult.textContent =
        file.type.startsWith('video/') && sizeMb > 20
          ? `⚠️ Video nặng ${sizeMb.toFixed(0)}MB, web sẽ tải chậm. Nên đưa lên YouTube rồi dán link.`
          : `✅ Đã thêm ${fileName}`;
    } catch (error) {
      showError(error);
    }
  }
  refresh();
}

fileInput.addEventListener('change', () => {
  if (fileInput.files) void uploadFiles([...fileInput.files]);
  fileInput.value = '';
});

const overlay = $<HTMLElement>('[data-drop-overlay]');
let dragDepth = 0;
window.addEventListener('dragenter', (event) => {
  if (!event.dataTransfer?.types.includes('Files')) return;
  dragDepth++;
  overlay.hidden = false;
});
window.addEventListener('dragleave', () => {
  dragDepth = Math.max(0, dragDepth - 1);
  if (dragDepth === 0) overlay.hidden = true;
});
window.addEventListener('dragover', (event) => event.preventDefault());
window.addEventListener('drop', (event) => {
  event.preventDefault();
  dragDepth = 0;
  overlay.hidden = true;
  const dropTarget = (event.target as HTMLElement).closest('textarea');
  if (dropTarget === deBaiInput || dropTarget === loiGiaiInput) state.activeTextarea = dropTarget;
  if (event.dataTransfer?.files.length) void uploadFiles([...event.dataTransfer.files]);
});

// ---------- Nút chèn YouTube / hình đếm ----------

const illustrationSelect = $<HTMLSelectElement>('[data-illustration-name]');
for (const name of ILLUSTRATION_NAMES) {
  illustrationSelect.append(new Option(ILLUSTRATION_CATALOG[name].label, name));
}

function togglePopover(name: string) {
  for (const popover of document.querySelectorAll<HTMLElement>('[data-popover]')) {
    popover.hidden = popover.dataset.popover !== name || !popover.hidden;
  }
}

// ---------- Lưu ----------

async function save(publish: boolean) {
  const values = formValues();
  const validation = validateForm(values, state);
  if (!validation.ok) {
    saveResult.textContent = '❌ Bài còn lỗi (xem danh sách bên trái). Sửa xong mới lưu được.';
    return;
  }
  setBusy(true);
  saveResult.textContent = publish ? '⏳ Đang lưu và đăng…' : '⏳ Đang lưu nháp…';
  try {
    const result = await editorApi.save({
      ...values,
      originalId: state.originalId,
      baseVersion: state.baseVersion,
      draftKey: state.draftKey,
      nhap: !publish,
    });
    const link = result.linkXemTruoc ? ` Xem trước: ${result.linkXemTruoc}` : '';
    await openLessonAfterSave(result.id);
    const headline = !publish
      ? '💾 Đã lưu nháp.'
      : result.git.pushed
        ? '🚀 Đã đăng!'
        : '✅ Đã lưu bài ở chế độ đăng.';
    saveResult.textContent = `${headline} ${result.git.message}${link}`;
    await loadLessonList();
  } catch (error) {
    showError(error);
  } finally {
    setBusy(false);
  }
}

async function openLessonAfterSave(id: string) {
  state.dirty = false;
  await openLesson(id);
}

function setBusy(busy: boolean) {
  for (const button of document.querySelectorAll<HTMLButtonElement>('.action-bar button'))
    button.disabled = busy;
}

function showError(error: unknown) {
  if (error instanceof EditorApiError) {
    const details = error.issues.map((issue) => issue.message).join(' · ');
    saveResult.textContent = `❌ ${error.message}${details ? ` ${details}` : ''}`;
  } else {
    saveResult.textContent = `❌ ${error instanceof Error ? error.message : String(error)}`;
  }
}

// ---------- Điều phối nút ----------

const actions: Record<string, () => void | Promise<void>> = {
  'bai-moi': () => {
    if (state.dirty && !confirmDiscard()) return;
    resetForm();
  },
  'chon-file': () => fileInput.click(),
  'mo-youtube': () => togglePopover('youtube'),
  'mo-minh-hoa': () => togglePopover('minh-hoa'),
  'chen-youtube': () => {
    const input = $<HTMLInputElement>('[data-youtube-url]');
    if (!input.value.trim()) return;
    insertBlockAtCursor(state.activeTextarea ?? deBaiInput, input.value.trim());
    input.value = '';
    togglePopover('');
  },
  'chen-minh-hoa': () => {
    const count = Math.min(
      20,
      Math.max(1, Number($<HTMLInputElement>('[data-illustration-count]').value) || 1),
    );
    insertBlockAtCursor(
      state.activeTextarea ?? deBaiInput,
      `::hinh{loai=${illustrationSelect.value} so-luong=${count}}`,
    );
    togglePopover('');
  },
  'sua-tu-dong': () => {
    titleInput.value = autoFixVietnameseText(titleInput.value);
    deBaiInput.value = autoFixVietnameseText(deBaiInput.value);
    loiGiaiInput.value = autoFixVietnameseText(loiGiaiInput.value);
    state.dirty = true;
    refresh();
    saveResult.textContent = '🪄 Đã chuẩn hoá dấu tiếng Việt. Lỗi viết hoa đầu câu cần sửa tay.';
  },
  'sao-chep-prompt': async () => {
    const topic = $<HTMLInputElement>('[data-prompt-topic]').value.trim() || undefined;
    await navigator.clipboard.writeText(buildLessonAuthoringPrompt(topic));
    saveResult.textContent = '📋 Đã sao chép prompt mẫu. Dán vào ChatGPT hoặc Claude nhé.';
  },
  'dien-tu-ai': () => {
    const reply = parseAiLessonReply($<HTMLTextAreaElement>('[data-ai-reply]').value);
    if (reply.tieuDe) titleInput.value = reply.tieuDe;
    if (reply.mon) subjectSelect.value = reply.mon;
    deBaiInput.value = autoFixVietnameseText(reply.deBai);
    loiGiaiInput.value = autoFixVietnameseText(reply.loiGiai);
    state.dirty = true;
    refresh();
    saveResult.textContent = '✅ Đã điền nội dung từ AI. Kiểm tra lại rồi bấm Lưu.';
  },
  'luu-nhap': () => save(false),
  'luu-dang': () => save(true),
};

document.addEventListener('click', (event) => {
  const button = (event.target as HTMLElement).closest<HTMLElement>('[data-action]');
  const action = button?.dataset.action;
  if (action && actions[action]) {
    Promise.resolve(actions[action]()).catch(showError);
  }
});

window.addEventListener('beforeunload', (event) => {
  if (state.dirty) event.preventDefault();
});

// ---------- Khởi động ----------

async function start() {
  resetForm();
  try {
    const status = await editorApi.status();
    syncState.textContent = status.coGithub
      ? '🔗 Đã kết nối GitHub'
      : '💻 Chưa kết nối GitHub (chỉ lưu trên máy)';
  } catch {
    syncState.textContent = '⚠️ Không kết nối được server soạn bài';
  }
  await loadLessonList();
}

void start();
