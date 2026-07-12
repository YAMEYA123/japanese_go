export interface GrammarNote {
  point: string       // 语法点名称
  explanation: string // 中文解释
  level?: 'N5' | 'N4' | 'N3' | 'N2' | 'N1'
}

export interface DramaLine {
  id: string
  drama_id: string
  japanese: string
  reading: string
  translation_zh: string
  speaker: string       // 说话人（角色名）
  context: string       // 剧情背景（一句话）
  grammar_notes: GrammarNote[]
}

export const DRAMA_LINES: DramaLine[] = [
  // ── 半沢直樹 ──────────────────────────────────────
  {
    id: 'hanzawa-01',
    drama_id: 'hanzawa',
    japanese: 'やられたらやり返す。倍返しだ！',
    reading: 'やられたらやりかえす。ばいがえしだ！',
    translation_zh: '以牙还牙，加倍奉还！',
    speaker: '半沢直樹',
    context: '被上司陷害后逆袭时的经典台词，成为全剧标志性金句',
    grammar_notes: [
      {
        point: '～たら（条件）',
        explanation: '「やられたら」= 被人整了的话。たら表示假定/完成条件，语感比と/ば更口语、更有爆发力。',
        level: 'N4',
      },
      {
        point: '倍返し（造词）',
        explanation: '「倍」(ばい)=两倍 +「返し」(かえし)=还击，合成为"加倍奉还"。这种名词+返し的构词在日语中很常见，如「仕返し」(报复)。',
        level: 'N3',
      },
    ],
  },
  {
    id: 'hanzawa-02',
    drama_id: 'hanzawa',
    japanese: '銀行員の仕事は、お客様の夢を実現させることだ。',
    reading: 'ぎんこういんのしごとは、おきゃくさまのゆめをじつげんさせることだ。',
    translation_zh: '银行员的工作，是让客户的梦想成真。',
    speaker: '半沢直樹',
    context: '半泽向年轻后辈诠释银行工作意义时所说',
    grammar_notes: [
      {
        point: '使役形：～させる',
        explanation: '「実現させる」= 使之实现。させる接在五段动词的未然形后，表示"让/使某人/某事做某事"。',
        level: 'N4',
      },
      {
        point: '～ことだ（定义句）',
        explanation: '「…ことだ」作谓语时表示对某事下定义或断言，比直接说动词更有强调意味。',
        level: 'N3',
      },
    ],
  },
  {
    id: 'hanzawa-03',
    drama_id: 'hanzawa',
    japanese: '上司の命令は絶対だ。しかし、それよりも大切なものがある。',
    reading: 'じょうしのめいれいはぜったいだ。しかし、それよりもたいせつなものがある。',
    translation_zh: '上司的命令是绝对的。然而，有比这更重要的东西。',
    speaker: '半沢直樹',
    context: '半泽面对腐败命令时内心独白，体现其不妥协的价值观',
    grammar_notes: [
      {
        point: 'しかし（逆接）',
        explanation: '书面/正式逆接接续词，语气比でも更强硬、更有决断感。相当于中文"然而/但是"。',
        level: 'N4',
      },
      {
        point: '～よりも（比较强调）',
        explanation: '「それよりも」比较基准后接も，进一步强调程度。も起强调作用，比単独的より更有力。',
        level: 'N4',
      },
    ],
  },

  // ── ドクターX ──────────────────────────────────────
  {
    id: 'doctorx-01',
    drama_id: 'doctor-x',
    japanese: 'わたし、失敗しないので。',
    reading: 'わたし、しっぱいしないので。',
    translation_zh: '我，是不会失败的。',
    speaker: '大門未知子',
    context: '大门未知子接受手术邀约时的口头禅，体现其自信与实力',
    grammar_notes: [
      {
        point: 'ので（理由/断言）',
        explanation: '通常ので引出原因从句，但此处独立使用，语气变成强势断言。省略后半句"（だから心配しなくていい）"，更具张力。',
        level: 'N4',
      },
      {
        point: '主语「わたし」前置',
        explanation: '日语通常省略主语，此处特意说出「わたし」，形成强调对比：别人可能失败，但"我"不会。',
        level: 'N3',
      },
    ],
  },
  {
    id: 'doctorx-02',
    drama_id: 'doctor-x',
    japanese: 'いたしません。いたしません、いたしません！',
    reading: 'いたしません。いたしません、いたしません！',
    translation_zh: '我不做。不做，不做！',
    speaker: '大門未知子',
    context: '被要求参加医院政治活动时的拒绝，成为另一经典口头禅',
    grammar_notes: [
      {
        point: 'いたす（謙譲語）',
        explanation: '「する」的谦让语，通常表示说话者自谦，但此处用于拒绝，形成"郑重地拒绝"的反讽语感，更显强势。',
        level: 'N3',
      },
      {
        point: '三连反复',
        explanation: '同一句重复三次是日语（及演讲）常见的强调手法，节奏感强，情绪递进。',
        level: 'N2',
      },
    ],
  },

  // ── リーガル・ハイ ──────────────────────────────────
  {
    id: 'legalhigh-01',
    drama_id: 'legal-high',
    japanese: '依頼人を信じろ。それが弁護士の仕事だ。',
    reading: 'いらいにんをしんじろ。それがべんごしのしごとだ。',
    translation_zh: '相信委托人。这才是律师的工作。',
    speaker: '古美門研介',
    context: '古美门对蒿村抱香说的话，虽然表面毒舌，内心却有职业信条',
    grammar_notes: [
      {
        point: '命令形：～ろ',
        explanation: '「信じろ」是一段动词「信じる」的命令形。命令形在日常口语中显得强势，多用于上对下或亲密关系。',
        level: 'N4',
      },
      {
        point: 'それが～だ（强调定义）',
        explanation: '「それが弁護士の仕事だ」用指示词それ回指前文，再下结论，逻辑紧凑，有辩论风格。',
        level: 'N3',
      },
    ],
  },
  {
    id: 'legalhigh-02',
    drama_id: 'legal-high',
    japanese: '勝訴すれば正義、敗訴すれば不正義。それが法律だ。',
    reading: 'しょうそすればせいぎ、はいそすればふせいぎ。それがほうりつだ。',
    translation_zh: '胜诉就是正义，败诉就是非正义。这就是法律。',
    speaker: '古美門研介',
    context: '古美门以犬儒的方式道出司法现实，展现其对规则的冷静认知',
    grammar_notes: [
      {
        point: '～ば（假定条件）',
        explanation: '「勝訴すれば」= 如果胜诉的话。ば条件句语感偏书面/哲理，适合陈述规律性真理。',
        level: 'N3',
      },
      {
        point: '対比構造',
        explanation: '「勝訴すれば正義／敗訴すれば不正義」用对称结构呈现对比，是日语书面文和辩论中强有力的修辞手法。',
        level: 'N2',
      },
    ],
  },

  // ── 逃げるは恥だが役に立つ ──────────────────────────
  {
    id: 'nigehaji-01',
    drama_id: 'nigehaji',
    japanese: '好きっていう気持ちは、理屈じゃないんだよ。',
    reading: 'すきっていうきもちは、りくつじゃないんだよ。',
    translation_zh: '喜欢这种感觉，是没有道理可讲的啊。',
    speaker: '津崎平匡',
    context: '平匡向理性至上的自己承认内心感情时的独白',
    grammar_notes: [
      {
        point: '～っていう（引用/口语）',
        explanation: '「好きっていう気持ち」= "喜欢"这种感觉。っていう是というの口语缩略，更自然、更有说话感。',
        level: 'N4',
      },
      {
        point: '～んだよ（解释/感情）',
        explanation: '「じゃないんだよ」= 本来不是那样的啊。んだ表示"说明/解释"，结尾よ带有向对方传达、确认的语气。',
        level: 'N4',
      },
    ],
  },
  {
    id: 'nigehaji-02',
    drama_id: 'nigehaji',
    japanese: '逃げることは、恥ずかしいことじゃない。生き延びるための知恵だ。',
    reading: 'にげることは、はずかしいことじゃない。いきのびるためのちえだ。',
    translation_zh: '逃跑并不可耻。这是活下去的智慧。',
    speaker: '森山みくり',
    context: '水水直子面对社会压力时说出的台词，也是剧名含义的诠释',
    grammar_notes: [
      {
        point: '～ための（目的修饰）',
        explanation: '「生き延びるための知恵」= 为了活下去的智慧。ための前接动词基本形，修饰后面的名词，表目的。',
        level: 'N4',
      },
      {
        point: '動詞の名詞化：～こと',
        explanation: '「逃げること」把动词「逃げる」名词化，使其能作主语。こと和の都能名词化，こと更正式、偏客观。',
        level: 'N4',
      },
    ],
  },

  // ── カルテット ──────────────────────────────────────
  {
    id: 'quartet-01',
    drama_id: 'quartet',
    japanese: '好きって言えばよかった。言えなかったけど、好きだった。',
    reading: 'すきっていえばよかった。いえなかったけど、すきだった。',
    translation_zh: '要是说了"喜欢"就好了。没能说出口，但我是喜欢过的。',
    speaker: '巻真紀',
    context: '真纪回望与丈夫之间隐藏的情感时的独白，弥漫着无法言说的遗憾',
    grammar_notes: [
      {
        point: '～ばよかった（后悔）',
        explanation: '「言えばよかった」= 说了就好了（可惜没说）。～ばよかった固定句型，表示对过去未做事情的后悔。',
        level: 'N3',
      },
      {
        point: '～けど（逆接/余情）',
        explanation: '「言えなかったけど」= 虽然没能说出口，但……。けど在句末或句中表轻微逆接，语气柔和，留有余韵。',
        level: 'N4',
      },
    ],
  },
  {
    id: 'quartet-02',
    drama_id: 'quartet',
    japanese: '人生って、食べかけのドーナツみたいなものかもしれない。',
    reading: 'じんせいって、たべかけのドーナツみたいなものかもしれない。',
    translation_zh: '人生啊，也许就像吃了一半的甜甜圈吧。',
    speaker: '別府司',
    context: '别府对着圆形的甜甜圈有感而发，是剧中最具诗意的台词之一',
    grammar_notes: [
      {
        point: '～て（主题提示/口语）',
        explanation: '「人生って」= 说到人生啊……。って是「というのは」的口语缩略，提起话题，比は更自然随意。',
        level: 'N4',
      },
      {
        point: '～みたいなもの（比喻）',
        explanation: '「ドーナツみたいなもの」= 像甜甜圈一样的东西。みたい接名词后表比喻，口语色彩比ようなもの更浓。',
        level: 'N4',
      },
      {
        point: '～かもしれない（不确定推测）',
        explanation: '表示说话者不确定的推测，"也许/可能"。语气比だろう更柔和，用于私人感慨时显得更细腻。',
        level: 'N4',
      },
    ],
  },

  // ── 重版出来！ ──────────────────────────────────────
  {
    id: 'juhan-01',
    drama_id: 'juhan',
    japanese: '重版出来！それは、作品が読者に愛された証だ。',
    reading: 'じゅうはんしゅったい！それは、さくひんがどくしゃにあいされたあかしだ。',
    translation_zh: '重版出来！这是作品被读者所爱的证明。',
    speaker: '黒澤心',
    context: '漫画加印时编辑部欢呼，体现了整部剧的核心价值观',
    grammar_notes: [
      {
        point: '受身形：～された',
        explanation: '「愛された」= 被爱。受身形（被动形）由动词未然形+れる/られる构成，此处强调作品"被"读者爱着。',
        level: 'N4',
      },
      {
        point: '証（あかし）',
        explanation: '「証」读作あかし（非しょう），意为"证明/证据"，是和语读音，比証拠(しょうこ)更有文学感。',
        level: 'N2',
      },
    ],
  },

  // ── コウノドリ ──────────────────────────────────────
  {
    id: 'kounodori-01',
    drama_id: 'kounodori',
    japanese: '命は、誰かに守ってもらって、初めて輝くことができる。',
    reading: 'いのちは、だれかにまもってもらって、はじめてかがやくことができる。',
    translation_zh: '生命，是在被人守护的前提下，才第一次得以闪耀。',
    speaker: '鴻鳥サクラ',
    context: '产科医生鸿鸟在守护母子平安后的内心独白',
    grammar_notes: [
      {
        point: '～てもらう（恩惠被动）',
        explanation: '「守ってもらって」= 得到守护/被守护（含恩惠感）。てもらう表示"对自己有利的动作"，比被动形更强调感恩。',
        level: 'N4',
      },
      {
        point: '～て初めて（才能）',
        explanation: '「守ってもらって、初めて輝く」= 被守护，才能闪耀。～て初めて是固定句型，表示"做了前项，才首次实现后项"。',
        level: 'N3',
      },
    ],
  },
  {
    id: 'kounodori-02',
    drama_id: 'kounodori',
    japanese: 'どんな命も、等しく尊い。それだけは、絶対に変わらない。',
    reading: 'どんないのちも、ひとしくとうとい。それだけは、ぜったいにかわらない。',
    translation_zh: '任何一条生命，都同等珍贵。这一点，绝对不会改变。',
    speaker: '鴻鳥サクラ',
    context: '面对高危新生儿抢救时，坚守职业信念的台词',
    grammar_notes: [
      {
        point: 'どんな～も（全称否定/肯定）',
        explanation: '「どんな命も」= 无论什么样的生命都……。どんな～も强调无一例外，是强调全称的重要句型。',
        level: 'N3',
      },
      {
        point: '～だけは（只此一点）',
        explanation: '「それだけは変わらない」= 只有这一点不会改变。だけは把范围缩小到唯一，带有强调珍视之意。',
        level: 'N3',
      },
    ],
  },

  // ── 白い巨塔 ──────────────────────────────────────
  {
    id: 'shiroi-01',
    drama_id: 'shiroi-kyotou',
    japanese: '医者は患者のためにあるのか、それとも病院のためにあるのか。',
    reading: 'いしゃはかんじゃのためにあるのか、それとも びょういんのためにあるのか。',
    translation_zh: '医生是为患者而存在的，还是为医院而存在的？',
    speaker: '里見脩二',
    context: '里见与财前在医学伦理问题上产生根本分歧时的追问',
    grammar_notes: [
      {
        point: '～のか（疑问/追问）',
        explanation: '「あるのか」= 是（为了……）而存在的吗？のか比か更有追问、质疑的语气，常用于辩论或内心独白。',
        level: 'N3',
      },
      {
        point: 'それとも（二择一）',
        explanation: '提出两个选项让对方选择，"还是/抑或"，语气更正式，常出现在辩论、质问中。',
        level: 'N3',
      },
    ],
  },
  {
    id: 'shiroi-02',
    drama_id: 'shiroi-kyotou',
    japanese: '出世と医術、どちらが大切かなんて、聞くまでもない。',
    reading: 'しゅっせといじゅつ、どちらがたいせつかなんて、きくまでもない。',
    translation_zh: '晋升和医术哪个更重要——这种问题根本无需多问。',
    speaker: '里見脩二',
    context: '里见对财前不惜牺牲患者利益以求晋升的行为表达强烈批判',
    grammar_notes: [
      {
        point: '～なんて（轻视/感慨）',
        explanation: '「どちらが大切かなんて」= 像"哪个更重要"这种事。なんて接在名词或引用从句后，表示轻视或惊讶，此处带不屑语气。',
        level: 'N3',
      },
      {
        point: '～までもない（无需）',
        explanation: '「聞くまでもない」= 无需询问（答案显而易见）。までもない接动词基本形，表示"用不着做那种程度的事"。',
        level: 'N2',
      },
    ],
  },
]

export function getLinesByDrama(dramaId: string): DramaLine[] {
  return DRAMA_LINES.filter(l => l.drama_id === dramaId)
}
