/**
 * apps/site/src/minigames/doc-hieu-cau-thu-du-bi.ts
 *
 * Dữ liệu bài đọc và câu hỏi cho bài "Cầu thủ dự bị" (SGK Tiếng Việt 2 Kết nối tri thức, trang 34–35).
 * Dùng cho cả nhiệm vụ Đọc hiểu (Quest 1) và Luyện tập (Quest 2).
 */
import type { DocHieuChallenge } from './doc-hieu-minigame';

export const STORY_CAU_THU_DU_BI = {
  title: 'CẦU THỦ DỰ BỊ',
  paragraphs: [
    'Nhìn các bạn đá bóng, gấu con rất muốn chơi cùng. Nhưng thấy gấu con có vẻ chậm chạp và đá bóng không tốt nên chưa đội nào muốn nhận cậu.',
    '– Gấu ơi, cậu làm cầu thủ dự bị nhé! – Khỉ nói.',
    'Gấu con hơi buồn nhưng cũng đồng ý. Trong khi chờ được vào sân, gấu đi nhặt bóng cho các bạn. Gấu cố gắng chạy thật nhanh để các bạn không phải chờ lâu.',
    'Hằng ngày, gấu đến sân bóng từ sớm để luyện tập. Gấu đá bóng ra xa, chạy đi nhặt rồi đá vào gôn, đá đi đá lại,... Cứ thế, gấu đá bóng ngày càng giỏi hơn.',
    'Một hôm, đến sân bóng thấy gấu đang luyện tập, các bạn ngạc nhiên nhìn gấu rồi nói: "Cậu giỏi quá!", "Này, vào đội tớ nhé!", "Vào đội tớ đi!".',
    '– Tớ nên vào đội nào đây? – Gấu hỏi Khỉ.',
    '– Hiệp đầu cậu đá cho đội đỏ, hiệp sau cậu đá cho đội xanh. – Khỉ nói.',
    'Gấu vui vẻ gật đầu. Cậu nghĩ: "Hoá ra làm cầu thủ dự bị cũng hay nhỉ!".',
    '(Theo 100 truyện ngụ ngôn hay nhất)',
  ],
  vocabulary: {
    word: 'Dự bị',
    meaning: 'chưa phải là thành viên chính thức, nhưng có thể thay thế hoặc bổ sung khi cần.',
  },
};

export const CHALLENGES_DOC_HIEU: DocHieuChallenge[] = [
  {
    id: 'ch1-c1',
    prompt: 'Câu chuyện kể về ai?',
    speakText: 'Câu hỏi một: Câu chuyện kể về ai hả bé Miu?',
    difficulty: 1,
    data: {},
    expectedAnswer: 'a',
    storyTitle: STORY_CAU_THU_DU_BI.title,
    storyContent: STORY_CAU_THU_DU_BI.paragraphs,
    vocabulary: STORY_CAU_THU_DU_BI.vocabulary,
    options: [
      { id: 'a', text: 'Gấu con và các bạn chơi đá bóng' },
      { id: 'b', text: 'Khỉ con và đàn hươu trong rừng' },
      { id: 'c', text: 'Bác Cú Thông Thái và Sóc Nâu' },
    ],
    notebookAnswer: '1. Câu chuyện kể về gấu con và các bạn của gấu con.',
    explanation:
      'Bài đọc kể về bạn gấu con kiên trì tự luyện tập đá bóng từ chỗ chỉ là cầu thủ dự bị thành cầu thủ giỏi được các bạn mến mộ.',
    hintText: {
      1: '💡 Hãy đọc câu đầu tiên của bài đọc xem bạn nhỏ nào rất muốn chơi đá bóng cùng các bạn nhé!',
      2: '💡 Đoạn 1 viết: "Nhìn các bạn đá bóng, gấu con rất muốn chơi cùng..."',
      3: '💡 Đáp án chính xác: Câu chuyện kể về gấu con và các bạn!',
    },
  },
  {
    id: 'ch1-c2',
    prompt: 'Vì sao lúc đầu chưa đội nào muốn nhận gấu con?',
    speakText: 'Câu hỏi hai: Vì sao lúc đầu chưa đội nào muốn nhận gấu con vào đội?',
    difficulty: 1,
    data: {},
    expectedAnswer: 'a',
    storyTitle: STORY_CAU_THU_DU_BI.title,
    storyContent: STORY_CAU_THU_DU_BI.paragraphs,
    vocabulary: STORY_CAU_THU_DU_BI.vocabulary,
    options: [
      { id: 'a', text: 'Vì thấy gấu con có vẻ chậm chạp và đá bóng không tốt' },
      { id: 'b', text: 'Vì gấu con đến sân bóng muộn giờ' },
      { id: 'c', text: 'Vì gấu con không muốn chơi bóng cùng các bạn' },
    ],
    notebookAnswer:
      '2. Lúc đầu chưa đội nào muốn nhận gấu con vì thấy gấu con có vẻ chậm chạp và đá bóng không tốt.',
    explanation:
      'Ban đầu thấy gấu con chậm chạp và chưa sút bóng giỏi nên chưa đội nào muốn nhận gấu vào đội hình chính thức.',
    hintText: {
      1: '💡 Bé hãy nhìn vào câu thứ hai ở đoạn đầu tiên của bài đọc nhé!',
      2: '💡 Các bạn thấy gấu con "có vẻ chậm chạp và đá bóng không tốt" đấy!',
      3: '💡 Đáp án là: Vì thấy gấu con có vẻ chậm chạp và đá bóng không tốt.',
    },
  },
  {
    id: 'ch1-c3',
    prompt: 'Là cầu thủ dự bị, gấu con đã làm gì?',
    speakText: 'Câu hỏi ba: Khi làm cầu thủ dự bị, gấu con đã làm những việc gì?',
    difficulty: 1,
    data: {},
    expectedAnswer: 'a',
    storyTitle: STORY_CAU_THU_DU_BI.title,
    storyContent: STORY_CAU_THU_DU_BI.paragraphs,
    vocabulary: STORY_CAU_THU_DU_BI.vocabulary,
    options: [
      {
        id: 'a',
        text: 'Đi nhặt bóng cho các bạn và hằng ngày đến sớm chăm chỉ tự luyện tập',
      },
      { id: 'b', text: 'Ngồi một chỗ giận dỗi và không chịu nói chuyện với ai' },
      { id: 'c', text: 'Bỏ về nhà và không bao giờ quay lại sân bóng nữa' },
    ],
    notebookAnswer:
      '3. Là cầu thủ dự bị, gấu con đi nhặt bóng cho các bạn, chạy thật nhanh để các bạn không phải chờ lâu và hằng ngày đến sân từ sớm để chăm chỉ luyện tập.',
    explanation:
      'Gấu con rất ngoan và tích cực: vừa vui vẻ nhặt bóng giúp bạn, vừa dậy sớm đến sân tự luyện tập sút bóng vào gôn.',
    hintText: {
      1: '💡 Bé đọc đoạn 2 xem gấu con làm gì trong lúc chờ vào sân và hằng ngày nhé!',
      2: '💡 Gấu nhặt bóng giúp bạn và hằng ngày đến sớm để đá bóng vào gôn, đá đi đá lại...',
      3: '💡 Gấu con đi nhặt bóng cho các bạn và chăm chỉ tự luyện tập!',
    },
  },
  {
    id: 'ch1-c4',
    prompt: 'Vì sao cuối cùng cả hai đội đều muốn gấu con về đội của mình?',
    speakText: 'Câu hỏi bốn: Vì sao cuối cùng cả hai đội bóng đều muốn gấu con về đội của mình?',
    difficulty: 1,
    data: {},
    expectedAnswer: 'a',
    storyTitle: STORY_CAU_THU_DU_BI.title,
    storyContent: STORY_CAU_THU_DU_BI.paragraphs,
    vocabulary: STORY_CAU_THU_DU_BI.vocabulary,
    options: [
      {
        id: 'a',
        text: 'Vì gấu con chăm chỉ luyện tập nên đá bóng ngày càng giỏi hơn',
      },
      { id: 'b', text: 'Vì hai đội bóng bị thiếu người chơi' },
      { id: 'c', text: 'Vì gấu con to khỏe hơn tất cả các bạn' },
    ],
    notebookAnswer:
      '4. Cuối cùng cả hai đội đều muốn gấu con về đội của mình vì gấu con chăm chỉ luyện tập nên đá bóng ngày càng giỏi hơn ("Cậu giỏi quá!").',
    explanation:
      'Nhờ sự kiên trì, nỗ lực luyện tập mỗi ngày, gấu con đá bóng ngày càng hay khiến bạn nào cũng khâm phục.',
    hintText: {
      1: '💡 Bé đọc đoạn 3 xem các bạn ngạc nhiên khen ngợi điều gì khi thấy gấu con luyện tập nhé!',
      2: '💡 Các bạn ngạc nhiên khen "Cậu giỏi quá!" và tranh nhau mời gấu vào đội!',
      3: '💡 Đáp án: Vì gấu con chăm chỉ luyện tập nên đá bóng ngày càng giỏi hơn!',
    },
  },
];

export const CHALLENGES_LUYEN_TAP: DocHieuChallenge[] = [
  {
    id: 'lt-c1',
    prompt: 'Câu nào trong bài là lời khen?',
    speakText: 'Phần luyện tập: Câu nào trong bài đọc là lời khen ngợi?',
    difficulty: 1,
    data: {},
    expectedAnswer: 'a',
    storyTitle: STORY_CAU_THU_DU_BI.title,
    storyContent: STORY_CAU_THU_DU_BI.paragraphs,
    vocabulary: STORY_CAU_THU_DU_BI.vocabulary,
    options: [
      { id: 'a', text: '"Cậu giỏi quá!"' },
      { id: 'b', text: '"Gấu ơi, cậu làm cầu thủ dự bị nhé!"' },
      { id: 'c', text: '"Tớ nên vào đội nào đây?"' },
    ],
    notebookAnswer: '1. Câu trong bài là lời khen: "Cậu giỏi quá!".',
    explanation:
      'Câu "Cậu giỏi quá!" thể hiện sự khen ngợi, tán thưởng tài năng đá bóng tiến bộ vượt bậc của gấu con.',
    hintText: {
      1: '💡 Lời khen là câu nói để tán thưởng, khen bạn làm tốt một việc gì đó!',
      2: '💡 Nhìn vào đoạn 3, câu các bạn ngạc nhiên thốt lên khi thấy gấu sút bóng vào gôn!',
      3: '💡 Đáp án chính xác là câu: "Cậu giỏi quá!"',
    },
  },
  {
    id: 'lt-c2',
    prompt:
      'Nếu là bạn của gấu con trong câu chuyện trên, em sẽ nói lời chúc mừng gấu con như thế nào?',
    speakText: 'Nếu là bạn của gấu con, em sẽ nói lời chúc mừng bạn ấy như thế nào?',
    difficulty: 1,
    data: {},
    expectedAnswer: 'a',
    storyTitle: STORY_CAU_THU_DU_BI.title,
    storyContent: STORY_CAU_THU_DU_BI.paragraphs,
    vocabulary: STORY_CAU_THU_DU_BI.vocabulary,
    options: [
      {
        id: 'a',
        text: '"Chúc mừng gấu con nhé, cậu chăm chỉ nên đá bóng giỏi lắm!"',
      },
      { id: 'b', text: '"Cậu chẳng giỏi chút nào đâu gấu con ơi!"' },
      { id: 'c', text: '"Sao cậu không về nhà ngủ đi cho khỏe?"' },
    ],
    notebookAnswer:
      '2. Lời chúc mừng: "Chúc mừng gấu con nhé, cậu chăm chỉ luyện tập nên đá bóng giỏi lắm!". Gấu con sẽ vui vẻ trả lời: "Cảm ơn bạn nhiều nhé! Tớ sẽ tiếp tục cố gắng hơn nữa!".',
    explanation:
      'Lời chúc mừng chân thành sẽ động viên bạn gấu con và giúp tình bạn thêm gắn kết, thân thiết.',
    hintText: {
      1: '💡 Khi chúc mừng bạn, mình cần dùng lời nói vui vẻ, khen ngợi sự nỗ lực chăm chỉ của bạn.',
      2: '💡 Câu nói bắt đầu bằng lời chúc mừng và ghi nhận bạn đá bóng rất giỏi!',
      3: '💡 Chọn câu: "Chúc mừng gấu con nhé, cậu chăm chỉ nên đá bóng giỏi lắm!"',
    },
  },
];
