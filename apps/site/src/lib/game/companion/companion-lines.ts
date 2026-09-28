/**
 * apps/site/src/lib/game/companion/companion-lines.ts
 *
 * Lời nói & biểu cảm của nhân vật đồng hành (mèo của bé) theo màn bé đang xem.
 * Hàm thuần, không đụng DOM, để kiểm thử được. `{ten}` được thay bằng tên nhân vật bé đặt.
 */
import type { CatPose } from '../../../components/game/characters/cat-character';

export interface CompanionLine {
  pose: CatPose;
  text: string;
}

export type CompanionContext =
  | 'trang-chu'
  | 'danh-sach-bai'
  | 'bai-toan'
  | 'bai-tieng-viet'
  | 'bai-khac'
  | 'xem-truoc'
  | 'cong-the-gioi'
  | 'ban-do'
  | 'vung-toan'
  | 'vung-tieng-viet'
  | 'vung-tieng-anh'
  | 'vung-khac'
  | 'nhiem-vu'
  | 'su-kien'
  | 'tao-nhan-vat'
  | 'luyen-timo'
  | 'ghi-nguon'
  | 'ngoai-tuyen'
  | 'khong-tim-thay'
  | 'chung';

export type CompanionReaction = 'correct' | 'wrong' | 'reward' | 'levelUp' | 'openSettings' | 'tap';

const L = (pose: CatPose, text: string): CompanionLine => ({ pose, text });

export const CONTEXT_LINES: Record<CompanionContext, CompanionLine[]> = {
  'trang-chu': [
    L('chao', 'Chào {ten}! Hôm nay mình học gì nào? 🐾'),
    L('vui', 'Mình nhớ {ten} quá trời luôn!'),
    L('suy-nghi', 'Xem lịch mặc đồng phục chưa nhỉ? Đừng quên nha!'),
    L('nhay', 'Bấm vào Thế giới học tập, mình cùng phiêu lưu đi!'),
    L('dung', 'Thời khoá biểu hôm nay có những môn gì ta?'),
    L('vui', 'Học một chút, chơi một chút, vui ơi là vui!'),
    L('chao', 'Bố mẹ và em Bo thương {ten} lắm đó!'),
    L('suy-nghi', 'Hôm qua mình học tới đâu rồi nhỉ?'),
  ],
  'danh-sach-bai': [
    L('suy-nghi', 'Nhiều bài quá, chọn bài nào trước đây?'),
    L('vui', 'Bài mới nhất nằm ở trên cùng đó {ten}!'),
    L('chao', 'Làm xong bài nào là giỏi bài đó!'),
    L('dung', 'Mình ôn lại bài cũ cũng tốt lắm nha.'),
    L('nhay', 'Chọn một bài rồi mình cùng làm nào!'),
  ],
  'bai-toan': [
    L('suy-nghi', 'Đọc kỹ đề trước, rồi mới tính nha {ten}!'),
    L('dung', 'Đặt tính thẳng cột: hàng đơn vị thẳng hàng đơn vị nhé.'),
    L('vui', 'Toán vui lắm, mình đếm cùng nhau nhé!'),
    L('suy-nghi', 'Cộng có nhớ thì nhớ 1 sang hàng chục đó!'),
    L('chao', 'Làm xong nhớ tự kiểm tra lại nha.'),
    L('dung', 'Bí quá thì bấm xem lời giải, không sao đâu!'),
    L('nhay', 'Mỗi phép tính đúng là một ngôi sao cho {ten}!'),
  ],
  'bai-tieng-viet': [
    L('suy-nghi', 'Đọc chậm và rõ từng tiếng nhé {ten}.'),
    L('dung', 'Viết hoa chữ cái đầu câu, cuối câu có dấu chấm nha.'),
    L('vui', 'Câu chuyện hay quá, mình đọc tiếp đi!'),
    L('chao', 'Gặp từ khó thì đánh vần từng tiếng nhé.'),
    L('suy-nghi', 'Câu trả lời có ngay trong bài đọc đó!'),
    L('nhay', 'Chữ {ten} viết càng ngày càng đẹp!'),
  ],
  'bai-khac': [
    L('suy-nghi', 'Bài hôm nay là gì đây ta?'),
    L('vui', 'Mình cùng làm cho xong bài này nhé!'),
    L('dung', 'Chỗ nào chưa hiểu thì hỏi bố mẹ nha.'),
    L('chao', 'Cố lên {ten}, mình ở ngay đây nè!'),
  ],
  'xem-truoc': [
    L('suy-nghi', 'Đây là bài nháp, bố mẹ đang soạn đó.'),
    L('dung', 'Bài này sắp ra mắt rồi, chờ chút nha!'),
  ],
  'cong-the-gioi': [
    L('nhay', 'Cổng thế giới mở rồi! Vào thôi {ten}!'),
    L('vui', 'Mỗi năm học là một thế giới mới đó.'),
    L('chao', 'Chọn Thế giới Lớp 2 để lên đường nhé!'),
    L('suy-nghi', 'Không biết hôm nay có nhiệm vụ gì mới nhỉ?'),
    L('dung', 'Muốn đổi áo đổi mũ thì bấm vào mình nha!'),
  ],
  'ban-do': [
    L('suy-nghi', 'Đi vùng Toán hay vùng Tiếng Việt trước đây?'),
    L('nhay', 'Bản đồ to quá, mình khám phá hết nhé!'),
    L('vui', 'Vùng nào sáng lên là đã mở rồi đó {ten}.'),
    L('dung', 'Có sự kiện đặc biệt nữa kìa, xem thử đi!'),
    L('chao', 'Làm nhiệm vụ để mở khoá vùng mới nha.'),
    L('di', 'Đi thôi đi thôi, phiêu lưu nào!'),
  ],
  'vung-toan': [
    L('suy-nghi', 'Thung lũng số nhiều kẹo quá, đếm giúp mình nhé!'),
    L('vui', 'Số chẵn, số lẻ, {ten} phân biệt giỏi lắm!'),
    L('dung', 'Làm nhiệm vụ 1 xong mới mở được nhiệm vụ 2 nha.'),
    L('nhay', 'Bác Cú đang chờ ở cuối đường đó!'),
    L('chao', 'Mỗi nhiệm vụ được tới 3 ngôi sao lận!'),
  ],
  'vung-tieng-viet': [
    L('chao', 'Sóc Nâu đang đợi mình ở khu vườn đọc hiểu!'),
    L('suy-nghi', 'Đọc hiểu nghĩa là đọc xong phải hiểu bài nói gì đó.'),
    L('vui', 'Mình thích nghe {ten} đọc truyện lắm!'),
    L('dung', 'Chọn nhiệm vụ đang sáng để bắt đầu nhé.'),
    L('nhay', 'Học thêm từ mới là thêm giỏi đó!'),
  ],
  'vung-tieng-anh': [
    L('chao', 'Hello {ten}! Mình học tiếng Anh nha!'),
    L('vui', 'Nghe nhiều là nói giỏi đó!'),
    L('suy-nghi', 'Vùng này sắp mở rồi, chờ chút nha.'),
  ],
  'vung-khac': [
    L('suy-nghi', 'Vùng này có gì hay ta?'),
    L('vui', 'Khám phá thôi {ten}!'),
  ],
  'nhiem-vu': [
    L('suy-nghi', 'Bình tĩnh suy nghĩ nha {ten}, mình tin bạn!'),
    L('dung', 'Bí quá thì bấm bóng đèn để xem gợi ý nhé.'),
    L('vui', 'Sai cũng không sao, thử lại là được!'),
    L('chao', 'Mình cổ vũ {ten} nè! Cố lên!'),
    L('nhay', 'Gần xong rồi, thêm chút nữa thôi!'),
    L('suy-nghi', 'Đọc lại câu hỏi một lần nữa xem nào.'),
  ],
  'su-kien': [
    L('nhay', 'Sự kiện đặc biệt nè! Hồi hộp quá!'),
    L('suy-nghi', 'Nghe hướng dẫn kỹ trước khi chơi nhé.'),
    L('vui', 'Làm tốt là được danh hiệu xịn đó {ten}!'),
    L('chao', 'Mình đi cùng {ten} nha!'),
  ],
  'tao-nhan-vat': [
    L('vui', 'Trang trí cho mình thật xinh nha {ten}!'),
    L('suy-nghi', 'Mũ này hay mũ kia đẹp hơn ta?'),
    L('nhay', 'Mỗi loại phụ kiện chọn được 1 món đó!'),
    L('chao', 'Đặt cho mình một cái tên thật dễ thương nhé!'),
    L('vui', 'Màu lông mới đẹp ghê!'),
  ],
  'luyen-timo': [
    L('suy-nghi', 'Toán tư duy TIMO khó mà vui lắm!'),
    L('dung', 'Vẽ hình ra giấy sẽ dễ nghĩ hơn đó.'),
    L('nhay', '{ten} thông minh lắm, thử đi nào!'),
    L('suy-nghi', 'Tìm quy luật trước nha, quy luật là chìa khoá!'),
  ],
  'ghi-nguon': [
    L('dung', 'Đây là nơi cảm ơn những người vẽ tranh và làm nhạc.'),
    L('vui', 'Cảm ơn các bạn đã chia sẻ miễn phí nha!'),
  ],
  'ngoai-tuyen': [
    L('buon', 'Mất mạng rồi {ten} ơi...'),
    L('suy-nghi', 'Bài đã xem trước đó vẫn mở được nè!'),
  ],
  'khong-tim-thay': [
    L('te', 'Ui da, mình lạc đường rồi!'),
    L('suy-nghi', 'Về trang chủ tìm lại đường nha.'),
  ],
  chung: [
    L('vui', 'Mình luôn ở đây với {ten} nè!'),
    L('chao', 'Bấm vào mình để trang trí và chỉnh âm thanh nha.'),
  ],
};

/** Câu nói chung, xen vào mọi màn cho đỡ lặp. */
export const GENERAL_LINES: CompanionLine[] = [
  L('vui', '{ten} ơi, mình là bạn thân của {ten} đó!'),
  L('chao', 'Bấm vào mình để đổi phụ kiện nè!'),
  L('suy-nghi', 'Uống nước chưa {ten}? Nhớ uống nước nha.'),
  L('dung', 'Ngồi thẳng lưng, mắt cách xa màn hình nha.'),
  L('nhay', 'Hôm nay {ten} giỏi quá trời!'),
  L('vui', 'Meo meo! 🐾'),
  L('suy-nghi', 'Học mỏi mắt thì nhìn ra xa một chút nha.'),
];

const TIME_LINES: { from: number; to: number; lines: CompanionLine[] }[] = [
  { from: 5, to: 11, lines: [L('chao', 'Chào buổi sáng {ten}! Ăn sáng chưa nè?'), L('vui', 'Buổi sáng học bài là mau thuộc nhất!')] },
  { from: 11, to: 14, lines: [L('suy-nghi', 'Trưa rồi, ăn cơm rồi nghỉ trưa chút nha.'), L('dung', 'Buổi trưa ngủ một chút cho khoẻ nhé!')] },
  { from: 14, to: 18, lines: [L('chao', 'Chào buổi chiều {ten}! Đi học về rồi hả?'), L('vui', 'Chiều nay mình ôn bài cùng nhau nha!')] },
  { from: 18, to: 21, lines: [L('dung', 'Buổi tối học bài xong rồi đi ngủ sớm nha.'), L('suy-nghi', 'Soạn sách vở cho ngày mai chưa {ten}?')] },
  { from: 21, to: 24, lines: [L('buon', 'Khuya rồi, {ten} đi ngủ thôi...'), L('suy-nghi', 'Mai mình học tiếp nha, ngủ ngon!')] },
  { from: 0, to: 5, lines: [L('buon', 'Khuya lắm rồi đó {ten}, đi ngủ nha!')] },
];

export const REACTION_LINES: Record<CompanionReaction, CompanionLine[]> = {
  correct: [
    L('vui', 'Đúng rồi! {ten} giỏi quá!'),
    L('nhay', 'Hoan hô! Chính xác!'),
    L('vui', 'Tuyệt vời ông mặt trời!'),
    L('nhay', 'Yeah! Thêm một câu đúng nữa!'),
  ],
  wrong: [
    L('buon', 'Chưa đúng rồi, thử lại nha {ten}!'),
    L('suy-nghi', 'Không sao, mình nghĩ lại chút nào.'),
    L('te', 'Ui, trượt rồi! Đứng dậy làm tiếp nha!'),
    L('suy-nghi', 'Xem gợi ý thử xem {ten}!'),
  ],
  reward: [
    L('nhay', 'Được thưởng rồi! Vui quá đi!'),
    L('vui', '{ten} xứng đáng lắm luôn!'),
  ],
  levelUp: [
    L('nhay', 'Lên cấp rồi! {ten} siêu quá!'),
    L('vui', 'Ting ting! Cấp mới, sức mạnh mới!'),
  ],
  openSettings: [
    L('vui', 'Trang trí cho mình đi {ten}!'),
    L('chao', 'Chọn mũ, chọn nơ, chỉnh nhạc ở đây nha!'),
  ],
  tap: [L('vui', 'Hí hí, nhột quá!'), L('chao', 'Mình đây nè {ten}!')],
};

/** Suy ra màn đang xem từ đường dẫn (và môn của bài học nếu có). */
export function detectCompanionContext(pathname: string, lessonSubject?: string | null): CompanionContext {
  const path = pathname.endsWith('/') ? pathname : `${pathname}/`;
  if (path === '/') return 'trang-chu';
  if (path.startsWith('/cac-bai/')) return 'danh-sach-bai';
  if (path.startsWith('/bai/')) {
    if (lessonSubject === 'toan') return 'bai-toan';
    if (lessonSubject === 'tieng-viet') return 'bai-tieng-viet';
    return 'bai-khac';
  }
  if (path.startsWith('/xem-truoc/')) return 'xem-truoc';
  if (path.startsWith('/luyen-timo/')) return 'luyen-timo';
  if (path.startsWith('/ghi-nguon/')) return 'ghi-nguon';
  if (path.startsWith('/offline/')) return 'ngoai-tuyen';

  const parts = path.split('/').filter(Boolean);
  if (parts[0] !== 'the-gioi') return 'chung';
  if (parts.length === 1) return 'cong-the-gioi';
  if (parts[1] === 'tao-nhan-vat') return 'tao-nhan-vat';
  if (parts[1] === 'choi' || parts[1] === 'mau-cong-toan') return 'nhiem-vu';
  if (parts.length === 2) return 'ban-do';
  if (parts[2] === 'su-kien') return 'su-kien';
  if (parts[2] === 'toan') return 'vung-toan';
  if (parts[2] === 'tieng-viet') return 'vung-tieng-viet';
  if (parts[2] === 'tieng-anh') return 'vung-tieng-anh';
  return 'vung-khac';
}

export function timeOfDayLines(hour: number): CompanionLine[] {
  return TIME_LINES.find((slot) => hour >= slot.from && hour < slot.to)?.lines ?? [];
}

/** Toàn bộ câu có thể nói ở màn này: câu riêng của màn nhiều nhất, xen câu theo giờ và câu chung. */
export function linesForContext(context: CompanionContext, hour: number): CompanionLine[] {
  return [...CONTEXT_LINES[context], ...CONTEXT_LINES[context], ...timeOfDayLines(hour), ...GENERAL_LINES];
}

export function personalize(line: CompanionLine, name: string): CompanionLine {
  return { ...line, text: line.text.replaceAll('{ten}', name) };
}

/** Chọn ngẫu nhiên một câu, tránh lặp lại câu vừa nói. */
export function pickLine(lines: CompanionLine[], previousText?: string, random = Math.random): CompanionLine {
  const candidates = lines.length > 1 ? lines.filter((l) => l.text !== previousText) : lines;
  return candidates[Math.floor(random() * candidates.length)] ?? lines[0];
}
