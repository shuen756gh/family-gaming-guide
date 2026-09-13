const fs = require('fs');
const {
  Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell, WidthType,
  AlignmentType, HeadingLevel, BorderStyle, ShadingType, LevelFormat, PageBreak,
} = require('docx');

const FONT = { ascii: 'Microsoft JhengHei', eastAsia: 'Microsoft JhengHei', hAnsi: 'Microsoft JhengHei', cs: 'Microsoft JhengHei' };
const ACCENT = '2E5E8C';

const t = (text, opts = {}) => new TextRun({ text, font: FONT, ...opts });
const kids = (c) => (typeof c === 'string' ? [t(c)] : c);
const p = (c, opts = {}) => new Paragraph({ children: kids(c), spacing: { after: 100, line: 320 }, ...opts });
const h = (text) => new Paragraph({
  heading: HeadingLevel.HEADING_1,
  children: [t(text, { bold: true, size: 28, color: ACCENT })],
  spacing: { before: 280, after: 120 },
  border: { bottom: { style: BorderStyle.SINGLE, size: 6, color: 'C9D6E3', space: 4 } },
});
const b = (c) => new Paragraph({ numbering: { reference: 'bullets', level: 0 }, children: kids(c), spacing: { after: 80, line: 320 } });
const box = (c) => new Paragraph({ numbering: { reference: 'checks', level: 0 }, children: kids(c), spacing: { after: 80, line: 320 } });

const COLS = [2900, 1700, 2000, 3038];
const border = { style: BorderStyle.SINGLE, size: 4, color: 'B7C4D1' };
const cell = (text, i, { header = false, no = false } = {}) => new TableCell({
  width: { size: COLS[i], type: WidthType.DXA },
  borders: { top: border, bottom: border, left: border, right: border },
  shading: header ? { type: ShadingType.CLEAR, fill: ACCENT, color: 'auto' }
    : no ? { type: ShadingType.CLEAR, fill: 'F6E7E7', color: 'auto' } : undefined,
  margins: { top: 80, bottom: 80, left: 120, right: 120 },
  children: [new Paragraph({
    alignment: i === 0 ? AlignmentType.LEFT : AlignmentType.CENTER,
    children: [t(text, { bold: header || (no && i === 1), color: header ? 'FFFFFF' : no && i === 1 ? 'A33A3A' : undefined })],
  })],
});
const row = (vals, opts) => new TableRow({ children: vals.map((v, i) => cell(v, i, opts)) });

const scheduleTable = new Table({
  width: { size: COLS.reduce((a, c) => a + c, 0), type: WidthType.DXA },
  columnWidths: COLS,
  rows: [
    row(['日子', '可以玩嗎', '當天總上限', '最晚下線'], { header: true }),
    row(['星期一～五（上學日）', '不能玩', '—', '—'], { no: true }),
    row(['段考結束當天', '可以', '2 小時', '21:00'], {}),
    row(['星期六', '可以', '2 小時', '22:00'], {}),
    row(['星期日', '可以', '2 小時', '21:00'], {}),
    row(['國定假日、連假、寒暑假', '可以', '2 小時', '隔天上學 21:00／隔天放假 22:00'], {}),
  ],
});

const children = [
  new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 80 }, children: [t('家庭遊戲約定', { bold: true, size: 44, color: ACCENT })] }),
  new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 240 }, children: [t('這是我們一起討論、一起遵守的約定（第 2 版）',{ size: 22, color: '666666' })] }),
  p('孩子：＿＿＿＿＿＿＿＿　　家長：＿＿＿＿＿＿＿＿　　生效日期：＿＿＿年＿＿月＿＿日'),

  h('一、什麼時候可以玩'),
  p('上學日（星期一到星期五）不玩遊戲，但以下情況除外：'),
  b('國定假日、連假、寒暑假'),
  b('段考結束當天（考完回家、當天功課完成後）'),
  p('星期六、星期日可以玩。'),
  scheduleTable,
  p([t('最晚下線原則：隔天要上學 21:00 前；隔天放假 22:00 前。', { size: 20, color: '555555' })], { spacing: { before: 100, after: 100 } }),

  h('二、每次怎麼玩'),
  b([t('每次最多玩 '), t('40 分鐘', { bold: true }), t('，接著休息 '), t('10 分鐘', { bold: true }), t('（離開螢幕、看遠方、喝水、起來動一動）。')]),
  b([t('一天最多玩 3 次，總共'), t('不超過 2 小時', { bold: true }), t('（所有遊戲合計，包含手機、平板、電腦、主機）。')]),
  b('時間到時，可以把正在進行的這一場打完，但不開新的一場。'),
  b('睡覺前 1 小時不玩遊戲；手機、平板晚上放在客廳充電，不帶進房間。'),
  b('跟同學組隊前，先告訴同學「我玩到幾點」。'),
  b([t('用 Discord 跟同學語音聊天的時間，'), t('也算在遊戲時間內', { bold: true }), t('；上學日不上線。')]),

  h('三、看影片'),
  b([t('上學日每天最多 '), t('30 分鐘', { bold: true }), t('；假日每天最多 '), t('1 小時', { bold: true }), t('（遊戲時間另外算）。')]),
  b('開始前先說好「今天看幾支」，看完就關。'),
  b('關閉自動播放，少看 Shorts 短影片。'),
  b('在客廳看，睡覺前 1 小時不看。'),
  b('看到誇張標題、「送 R 幣」、課金抽獎的影片，先想想是不是騙點擊或詐騙。'),
  b('不模仿影片裡危險的挑戰或整人。'),
  b('看到不錯的教學影片（例如 Roblox Studio 做遊戲），可以分享給家長，一起試著做做看。'),

  h('四、玩之前要先完成'),
  box('當天的功課和訂正'),
  box('隔天上學要帶的東西準備好'),
  box('答應要做的家事'),
  box('＿＿＿＿＿＿＿＿＿＿＿＿＿＿＿＿'),

  h('五、上網安全'),
  b('帳號密碼不告訴任何人，包括同學和好朋友。'),
  b('遊戲和 Discord 帳號都開啟兩步驟驗證，由家長一起設定。'),
  b('不相信「免費 Robux」「幫你刷等」「先給我東西再還你」，不點遊戲裡別人貼的連結。'),
  b('交易道具（例如 Blox Fruits 的果實）前先想一想，覺得怪怪的就先問家長。'),
  b('不和不認識的人到 LINE、IG 或其他 App 私聊；不傳照片，不說學校、住址、電話。'),
  b([t('遇到讓我不舒服、害怕或奇怪的事，馬上告訴家長。'), t('主動說出來不會被處罰，也不會因此被禁玩。', { bold: true })]),

  h('六、Discord 語音和聊天'),
  b('只跟家長知道的同學語音和私訊。'),
  b('加入新的伺服器（群組）、加新好友之前，先跟家長說。'),
  b('不加入大型公開伺服器（例如交易群、YouTuber 粉絲群），除非家長同意。'),
  b('帳號和家長的「家庭中心」連結；私訊設定為只有好友可以私訊，敏感內容過濾保持開啟。'),
  b([t('不點陌生人給的連結，'), t('尤其是「免費 Nitro」「Steam 禮物」，這些幾乎都是盜帳號詐騙。', { bold: true })]),
  b('暱稱不用本名，頭貼不用真實照片；不開視訊鏡頭給不認識的人。'),
  b('群組邀請連結不貼到公開的地方。'),
  b('Discord 要求年齡驗證或需要證件時，先問家長，不自己處理。'),
  b('戴耳機音量不超過 60%，連續戴 60 分鐘就讓耳朵休息一下。'),

  h('七、花錢'),
  b('每月遊戲預算：＿＿＿＿ 元（用點數卡，不綁家長的信用卡）。'),
  b('每次購買前（包含 Robux、Discord Nitro），先跟家長說要買什麼。'),
  b('超過預算的東西，可以存下個月的預算，或當作生日、獎勵禮物來討論。'),

  h('八、遊戲禮貌'),
  b('不罵人、不嗆人、不故意鬧別人。'),
  b('語音聊天時不嘲笑同學，不故意把人踢出群組或排擠別人。'),
  b('輸了可以生氣，但不摔東西、不對家人發脾氣。'),

  h('九、做到與沒做到'),
  p([t('做到的話：', { bold: true }), t('＿＿＿＿＿＿＿＿＿＿＿＿＿＿＿＿＿＿＿＿')]),
  p([t('（例如：連續一個月都做到，寒暑假可以選一天多玩 1 小時）', { size: 20, color: '777777' })]),
  p([t('沒做到的話：', { bold: true })]),
  b('第一次：家長提醒，一起想怎麼改進。'),
  b('第二次：下一個可以玩的日子，當天上限減少 40 分鐘。'),
  b('第三次以上：暫停一個週末不玩，之後重新討論約定。'),
  p([t('註：主動告訴家長安全問題（被騙、被騷擾），不算違反約定。', { size: 20, color: '555555' })]),

  h('十、家長的承諾'),
  b('時間快到時提前 10 分鐘提醒，不在打到一半時突然關機。'),
  b('願意聽孩子分享遊戲和影片，不隨便批評他喜歡的遊戲、YouTuber 和朋友。'),
  b('不偷看聊天內容；有擔心的事，會直接跟孩子好好談。'),
  b('自己也盡量做到吃飯時間、睡前不滑手機。'),
  b('約定有不合理的地方，願意一起討論修改。'),

  h('十一、定期檢討'),
  p('每次段考後一起檢討一次，需要的話就修改約定。'),

  new Paragraph({ spacing: { before: 480, after: 240 }, children: [t('孩子簽名：＿＿＿＿＿＿＿＿＿＿　　　　家長簽名：＿＿＿＿＿＿＿＿＿＿')] }),
  p('日期：＿＿＿年＿＿月＿＿日'),

  new Paragraph({ children: [new PageBreak()] }),
  new Paragraph({ spacing: { after: 80 }, children: [t('給家長的參考：時間建議怎麼來的', { bold: true, size: 32, color: ACCENT })] }),
  p([t('這一頁是給家長看的，不需要給孩子簽。', { size: 20, color: '777777' })]),
  b([t('單次 40 分鐘＋休息 10 分鐘：', { bold: true }), t('參考國健署「3010」護眼原則（近距離用眼 30 分鐘、休息 10 分鐘）。遊戲一場很難剛好停在 30 分鐘，所以放寬到 40 分鐘，並允許打完當前這一場，減少親子衝突。')]),
  b([t('每天上限 2 小時：', { bold: true }), t('國際常見建議（例如加拿大兒少 24 小時活動指引）是 5–17 歲的休閒螢幕時間每天不超過 2 小時。40 分鐘 × 3 次剛好是 2 小時。這個上限只計算遊戲和 Discord 語音，看影片的時間另外規定在第三條。')]),
  b([t('最晚下線時間：', { bold: true }), t('13 歲建議每天睡 8–10 小時（美國睡眠醫學會建議），睡前 1 小時停止螢幕有助入睡。')]),
  b([t('段考結束當天：', { bold: true }), t('通常隔天還要上學，所以同樣是 2 小時、21:00 前下線，當作考試辛苦的獎勵，而不是「大解放」。')]),
  b([t('影片時間：', { bold: true }), t('理想是遊戲加影片每天合計 2 小時內。上學日影片 30 分鐘、假日 1 小時是比較實際的折衷。用「看幾支」取代「看多久」，並關閉自動播放，最容易執行。')]),
  b([t('比時數更重要的：', { bold: true }), t('每次都照約定執行、事先講好規則、讓孩子參與訂定。孩子覺得規則是自己同意的，遵守的意願會高很多。')]),

  new Paragraph({ spacing: { before: 360, after: 80 }, children: [t('Discord 家長設定步驟', { bold: true, size: 28, color: ACCENT })] }),
  new Paragraph({ numbering: { reference: 'steps', level: 0 }, spacing: { after: 80, line: 320 }, children: [t('家長自己註冊一個 Discord 帳號。')] }),
  new Paragraph({ numbering: { reference: 'steps', level: 0 }, spacing: { after: 80, line: 320 }, children: [t('孩子在自己的 Discord 打開「使用者設定 → 家庭中心」，產生 QR code。')] }),
  new Paragraph({ numbering: { reference: 'steps', level: 0 }, spacing: { after: 80, line: 320 }, children: [t('家長用自己的 Discord 掃描 QR code 完成連結。')] }),
  new Paragraph({ numbering: { reference: 'steps', level: 0 }, spacing: { after: 80, line: 320 }, children: [t('在家庭中心設定：只有好友可以私訊、開啟敏感內容過濾。')] }),
  new Paragraph({ numbering: { reference: 'steps', level: 0 }, spacing: { after: 80, line: 320 }, children: [t('在孩子的「使用者設定」檢查：好友請求不要設為「所有人」，並開啟兩步驟驗證。')] }),
  p([t('家庭中心可以看到：最近加的好友、加入的伺服器，並收到每週 Email 摘要。看不到聊天和語音的內容。設定名稱可能隨 Discord 版本略有不同。', { size: 20, color: '555555' })], { spacing: { before: 100, after: 100 } }),
  p([t('提醒：Discord 自 2026 年起預設以青少年模式保護帳號。如果孩子要求借用證件做「年齡驗證」，通常是想解鎖成人內容或放寬限制，請特別留意。', { size: 20, color: '555555' })]),
];

const doc = new Document({
  styles: { default: { document: { run: { font: FONT, size: 23 } } } },
  numbering: {
    config: [
      { reference: 'bullets', levels: [{ level: 0, format: LevelFormat.BULLET, text: '•', alignment: AlignmentType.LEFT, style: { paragraph: { indent: { left: 480, hanging: 280 } } } }] },
      { reference: 'steps', levels: [{ level: 0, format: LevelFormat.DECIMAL, text: '%1.', alignment: AlignmentType.LEFT, style: { paragraph: { indent: { left: 480, hanging: 320 } } } }] },
      { reference: 'checks', levels: [{ level: 0, format: LevelFormat.BULLET, text: '☐', alignment: AlignmentType.LEFT, style: { paragraph: { indent: { left: 480, hanging: 320 } } } }] },
    ],
  },
  sections: [{
    properties: { page: { size: { width: 11906, height: 16838 }, margin: { top: 1134, bottom: 1134, left: 1134, right: 1134 } } },
    children,
  }],
});

Packer.toBuffer(doc).then((buf) => {
  fs.writeFileSync(process.argv[2], buf);
  console.log('wrote', process.argv[2]);
});
