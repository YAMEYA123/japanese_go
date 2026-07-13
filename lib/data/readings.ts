export interface VocabNote {
  word: string
  reading: string
  meaning: string
  level?: 'N5' | 'N4' | 'N3' | 'N2' | 'N1'
}

export interface GrammarNote {
  point: string
  explanation: string
  level?: 'N5' | 'N4' | 'N3' | 'N2' | 'N1'
}

export interface Paragraph {
  japanese: string
  reading: string
  translation_zh: string
}

export interface ReadingPassage {
  id: string
  author: string
  author_jp: string
  author_reading: string
  work: string
  work_jp: string
  work_reading: string
  year: string
  genre: string
  difficulty: 'N3' | 'N2' | 'N1'
  excerpt_label: string
  cover_color: string
  paragraphs: Paragraph[]
  vocabulary: VocabNote[]
  grammar_notes: GrammarNote[]
}

export const READINGS: ReadingPassage[] = [
  {
    id: 'yukiguni-opening',
    author: '川端康成',
    author_jp: 'かわばたやすなり',
    author_reading: 'Kawabata Yasunari',
    work: '雪国',
    work_jp: 'ゆきぐに',
    work_reading: 'Yukiguni',
    year: '1937',
    genre: '小说',
    difficulty: 'N2',
    excerpt_label: '冒頭',
    cover_color: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    paragraphs: [
      {
        japanese: '国境の長いトンネルを抜けると雪国であった。夜の底が白くなった。',
        reading: 'くにざかいのながいトンネルをぬけるとゆきぐにであった。よるのそこがしろくなった。',
        translation_zh: '穿过国境长长的隧道，便是雪国了。夜空的深处变成了白色。',
      },
      {
        japanese: '信号所に汽車が止まった。向側の座席から娘が立って来て、島村の前のガラス窓を落とした。雪の冷気が流れ込んだ。',
        reading: 'しんごうじょにきしゃがとまった。むこうがわのざせきからむすめがたってきて、しまむらのまえのガラスまどをおとした。ゆきのれいきがながれこんだ。',
        translation_zh: '火车在信号站停了下来。对面座位上的女子站起来走过来，放下了岛村面前的玻璃窗。雪的寒气涌了进来。',
      },
      {
        japanese: '娘は窓いっぱいに乗り出して、遠くへ叫ぶように、「駅長さあん、駅長さあん」と呼んだ。',
        reading: 'むすめはまどいっぱいにのりだして、とおくへさけぶように、「えきちょうさあん、えきちょうさあん」とよんだ。',
        translation_zh: '女子将身体大半探出窗外，像是朝远处呼喊一般，喊道："站长——站长——"',
      },
    ],
    vocabulary: [
      { word: '国境', reading: 'くにざかい', meaning: '国界、边境', level: 'N2' },
      { word: '抜ける', reading: 'ぬける', meaning: '穿过、通过', level: 'N3' },
      { word: '信号所', reading: 'しんごうじょ', meaning: '信号站', level: 'N1' },
      { word: '冷気', reading: 'れいき', meaning: '寒气、冷空气', level: 'N2' },
      { word: '乗り出す', reading: 'のりだす', meaning: '探出身子', level: 'N2' },
    ],
    grammar_notes: [
      { point: '〜と（瞬間）', explanation: '「トンネルを抜けると雪国であった」——动词基本形＋と，表示前一动作完成的瞬间后项随即发生，多用于客观描述。', level: 'N4' },
      { point: '〜いっぱいに', explanation: '「窓いっぱいに乗り出して」——表示充满整个空间或范围，到极限程度。', level: 'N3' },
    ],
  },
  {
    id: 'izu-no-odoriko',
    author: '川端康成',
    author_jp: 'かわばたやすなり',
    author_reading: 'Kawabata Yasunari',
    work: '伊豆の踊子',
    work_jp: 'いずのおどりこ',
    work_reading: 'Izu no Odoriko',
    year: '1926',
    genre: '中篇小说',
    difficulty: 'N2',
    excerpt_label: '冒頭',
    cover_color: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
    paragraphs: [
      {
        japanese: '道がつづら折りになって、いよいよ天城峠に近づいたと思う頃、雨脚が杉の密林を白く染めながら、すさまじい速さで麓から私に向かって来た。',
        reading: 'みちがつづらおりになって、いよいよあまぎとうげにちかづいたとおもうころ、あまあしがすぎのみつりんをしろくそめながら、すさまじいはやさでふもとからわたしにむかってきた。',
        translation_zh: '山路蜿蜒曲折，正以为已临近天城山顶时，雨脚将杉树密林染成白色，以惊人的速度从山脚向我袭来。',
      },
      {
        japanese: '私は二十歳で、高等学校の制帽をかぶり、学生服の上に袴をはいて、一人旅をしていた。',
        reading: 'わたしははたちで、こうとうがっこうのせいぼうをかぶり、がくせいふくのうえにはかまをはいて、ひとりたびをしていた。',
        translation_zh: '我二十岁，戴着高等学校的制帽，学生服上穿着袴，独自旅行着。',
      },
    ],
    vocabulary: [
      { word: 'つづら折り', reading: 'つづらおり', meaning: '（山路）蜿蜒曲折', level: 'N1' },
      { word: '天城峠', reading: 'あまぎとうげ', meaning: '天城山口（地名）', level: 'N1' },
      { word: '雨脚', reading: 'あまあし', meaning: '雨线、雨脚', level: 'N1' },
      { word: '密林', reading: 'みつりん', meaning: '密林', level: 'N2' },
      { word: 'すさまじい', reading: 'すさまじい', meaning: '惊人的、猛烈的', level: 'N2' },
      { word: '袴', reading: 'はかま', meaning: '袴（日本传统裙裤）', level: 'N1' },
    ],
    grammar_notes: [
      { point: '〜と思う頃', explanation: '「近づいたと思う頃」——表示在心里刚觉得快到的时候，时间节点的主观判断。', level: 'N3' },
      { point: '〜ながら（同时）', explanation: '「白く染めながら」——同一主体同时进行两个动作，强调伴随状态。', level: 'N4' },
    ],
  },
  {
    id: 'rashomon',
    author: '芥川龍之介',
    author_jp: 'あくたがわりゅうのすけ',
    author_reading: 'Akutagawa Ryunosuke',
    work: '羅生門',
    work_jp: 'らしょうもん',
    work_reading: 'Rashomon',
    year: '1915',
    genre: '短篇小说',
    difficulty: 'N2',
    excerpt_label: '冒頭',
    cover_color: 'linear-gradient(135deg, #4a4a4a 0%, #7b7b7b 100%)',
    paragraphs: [
      {
        japanese: 'ある日の暮方の事である。一人の下人が、羅生門の下で雨やみを待っていた。',
        reading: 'あるひのくれがたのことである。ひとりのげにんが、らしょうもんのしたであめやみをまっていた。',
        translation_zh: '某日黄昏时分，一个仆人在罗生门下等待雨停。',
      },
      {
        japanese: '広い門の下には、この男のほかに誰もいない。ただ、所々丹塗りの剥げた、大きな円柱に、蟋蟀が一匹とまっている。',
        reading: 'ひろいもんのしたには、このおとこのほかにだれもいない。ただ、ところどころにぬりのはげた、おおきなえんちゅうに、こおろぎがいっぴきとまっている。',
        translation_zh: '宽阔的城门下，除了这个男子，无人踪影。只有大圆柱上斑驳的红漆间，停着一只蟋蟀。',
      },
      {
        japanese: '羅生門が、朱雀大路にある以上は、雨やみを待つ市女笠や揉烏帽子が、もう二三人はありそうなものである。それが、この男のほかには誰もいない。',
        reading: 'らしょうもんが、すざくおおじにあるいじょうは、あめやみをまつ いちめがさやもみえぼしが、もうにさんにんはありそうなものである。それが、このおとこのほかにはだれもいない。',
        translation_zh: '既然罗生门在朱雀大路上，按说应该还有两三个戴着市女笠或揉乌帽子的人在此躲雨。然而除了这个男子，竟无一人。',
      },
    ],
    vocabulary: [
      { word: '暮方', reading: 'くれがた', meaning: '黄昏时分', level: 'N2' },
      { word: '下人', reading: 'げにん', meaning: '仆人、下人', level: 'N1' },
      { word: '雨やみ', reading: 'あめやみ', meaning: '雨停', level: 'N2' },
      { word: '円柱', reading: 'えんちゅう', meaning: '圆柱', level: 'N2' },
      { word: '蟋蟀', reading: 'こおろぎ', meaning: '蟋蟀', level: 'N1' },
      { word: '朱雀大路', reading: 'すざくおおじ', meaning: '朱雀大路（平安京中央大道）', level: 'N1' },
    ],
    grammar_notes: [
      { point: '〜の事である', explanation: '「ある日の暮方の事である」——文学叙述中用来引入时间背景，「〜の事だ」表示关于某事的陈述，语气郑重。', level: 'N3' },
      { point: '〜以上は', explanation: '「朱雀大路にある以上は」——既然…就应该…，表示基于某事实的推断，前项是已知条件。', level: 'N2' },
      { point: '〜そうなものである', explanation: '「ありそうなものである」——按理说应该有，表示说话者对理应如此却并非如此的情况感到疑惑。', level: 'N2' },
    ],
  },
  {
    id: 'kumo-no-ito',
    author: '芥川龍之介',
    author_jp: 'あくたがわりゅうのすけ',
    author_reading: 'Akutagawa Ryunosuke',
    work: '蜘蛛の糸',
    work_jp: 'くものいと',
    work_reading: "Kumo no Ito",
    year: '1918',
    genre: '短篇小说',
    difficulty: 'N3',
    excerpt_label: '冒頭',
    cover_color: 'linear-gradient(135deg, #a18cd1 0%, #fbc2eb 100%)',
    paragraphs: [
      {
        japanese: 'ある日の事でございます。御釈迦様は極楽の蓮池のふちを、独りでぶらぶら御歩きになっていらっしゃいました。',
        reading: 'あるひのことでございます。おしゃかさまはごくらくのはすいけのふちを、ひとりでぶらぶらおあるきになっていらっしゃいました。',
        translation_zh: '某一天的事。释迦摩尼正独自在极乐净土的莲花池边漫步。',
      },
      {
        japanese: '池の中に咲いている蓮の花は、みんな玉のように真白で、そのまん中にある金色の蕊からは、何とも言えない好い匂いが、絶間なく溢れて居ります。',
        reading: 'いけのなかにさいているはすのはなは、みんなたまのようにましろで、そのまんなかにあるきんいろのしべからは、なんともいえないよいにおいが、たえまなくあふれております。',
        translation_zh: '池中盛开的莲花，一朵朵洁白如玉，金色的花蕊中，散发着难以言喻的芬芳，绵绵不绝地飘溢着。',
      },
    ],
    vocabulary: [
      { word: '極楽', reading: 'ごくらく', meaning: '极乐净土', level: 'N2' },
      { word: '蓮池', reading: 'はすいけ', meaning: '莲花池', level: 'N2' },
      { word: 'ふち', reading: 'ふち', meaning: '边缘、池边', level: 'N3' },
      { word: '蕊', reading: 'しべ', meaning: '花蕊', level: 'N1' },
      { word: '絶間なく', reading: 'たえまなく', meaning: '不间断地、绵绵不绝', level: 'N2' },
    ],
    grammar_notes: [
      { point: '〜でございます', explanation: '「〜事でございます」——「です」的丁重语，书面童话或正式场合使用，表示礼貌和庄重。', level: 'N4' },
      { point: '御〜になる', explanation: '「御歩きになっていらっしゃいました」——尊敬语，「お/御〜になる」是常见尊敬表达，这里还叠加了「いらっしゃる」，表达极高的尊重。', level: 'N3' },
      { point: '何とも言えない', explanation: '「何とも言えない好い匂い」——难以言表的、无以形容的，表示程度超出语言描述的范围。', level: 'N2' },
    ],
  },
  {
    id: 'shiosai',
    author: '三島由紀夫',
    author_jp: 'みしまゆきお',
    author_reading: 'Mishima Yukio',
    work: '潮騒',
    work_jp: 'しおさい',
    work_reading: 'Shiosai',
    year: '1954',
    genre: '小说',
    difficulty: 'N2',
    excerpt_label: '冒頭',
    cover_color: 'linear-gradient(135deg, #0093E9 0%, #80D0C7 100%)',
    paragraphs: [
      {
        japanese: '歌島は人口千四百、周囲一里に足りない小島である。島の形は、南北に走る脊梁山脈を抱いた楕円形で、最高点は神山の百二十五メートルである。',
        reading: 'うたじまはじんこうせんよんひゃく、しゅういちりにたりないこじまである。しまのかたちは、なんぼくにはしるせきりょうさんみゃくをだいたえんけいで、さいこうてんはかみやまのひゃくにじゅうごメートルである。',
        translation_zh: '歌岛是一座人口一千四百、周长不足一里的小岛。岛的形状是椭圆形，怀抱着一条南北走向的脊梁山脉，最高点是神山，海拔一百二十五米。',
      },
      {
        japanese: '島の北半分は山が海に迫り、人は南の湾に面した斜面と、湾に突き出た小岬の上に村を作って住んでいる。',
        reading: 'しまのきたはんぶんはやまがうみにせまり、ひとはみなみのわんにめんしたしゃめんと、わんにつきだしたこみさきのうえにむらをつくってすんでいる。',
        translation_zh: '岛的北半部山峦逼海，居民们在朝向南湾的山坡上以及突入湾中的小岬角上建村居住。',
      },
    ],
    vocabulary: [
      { word: '脊梁山脈', reading: 'せきりょうさんみゃく', meaning: '脊梁山脉（贯穿中央的山脉）', level: 'N1' },
      { word: '楕円形', reading: 'だえんけい', meaning: '椭圆形', level: 'N2' },
      { word: '迫る', reading: 'せまる', meaning: '逼近、逼迫', level: 'N2' },
      { word: '小岬', reading: 'こみさき', meaning: '小海角、小岬角', level: 'N1' },
      { word: '突き出す', reading: 'つきだす', meaning: '突出、伸出', level: 'N2' },
    ],
    grammar_notes: [
      { point: '〜に足りない', explanation: '「一里に足りない」——不足、不够，「〜に足りない」表示达不到某个数量或标准。', level: 'N2' },
      { point: '〜に面した', explanation: '「湾に面した斜面」——面向、朝向，「〜に面する」表示正对某方向或地物。', level: 'N3' },
    ],
  },
  {
    id: 'kinkakuji',
    author: '三島由紀夫',
    author_jp: 'みしまゆきお',
    author_reading: 'Mishima Yukio',
    work: '金閣寺',
    work_jp: 'きんかくじ',
    work_reading: 'Kinkakuji',
    year: '1956',
    genre: '小说',
    difficulty: 'N1',
    excerpt_label: '第一章',
    cover_color: 'linear-gradient(135deg, #f7971e 0%, #ffd200 100%)',
    paragraphs: [
      {
        japanese: '幼時から父は、私によく、金閣のことを語った。わが生れた土地は、若狭の東舞鶴から北へ二里、日本海に近い寒村で、子供の頃から私は、村の海岸へ出て、たえず寂しい日本海の海鳴りをきいていた。',
        reading: 'ようじからちちは、わたしによく、きんかくのことをかたった。わがうまれたとちは、わかさのひがしまいづるからきたへにり、にほんかいにちかいかんそんで、こどものころからわたしは、むらのかいがんへでて、たえずさびしいにほんかいのうなりをきいていた。',
        translation_zh: '从幼年起，父亲就常常向我讲述金阁寺。我出生的地方，是若狭东舞鹤往北两里、临近日本海的穷僻村落，从小我就到村子的海岸去，不断倾听那日本海寂寥的海鸣。',
      },
      {
        japanese: '金閣ほど美しいものは地上に存在しないと、私は思うようになっていた。後に実物を見て、私の幻想は壊れるのではなかろうかと心配した。',
        reading: 'きんかくほどうつくしいものはちじょうにそんざいしないと、わたしはおもうようになっていた。のちにじつぶつをみて、わたしのげんそうはこわれるのではなかろうかとしんぱいした。',
        translation_zh: '我渐渐认为，世上不存在比金阁更美的东西。后来担心亲眼看到实物之后，自己的幻想会被打破。',
      },
    ],
    vocabulary: [
      { word: '幼時', reading: 'ようじ', meaning: '幼年时期', level: 'N2' },
      { word: '寒村', reading: 'かんそん', meaning: '穷僻的村落', level: 'N1' },
      { word: '海鳴り', reading: 'うなり', meaning: '海鸣（浪涛声）', level: 'N1' },
      { word: 'たえず', reading: 'たえず', meaning: '不断地、持续地', level: 'N2' },
      { word: '幻想', reading: 'げんそう', meaning: '幻想', level: 'N2' },
    ],
    grammar_notes: [
      { point: '〜ようになった', explanation: '「思うようになっていた」——表示状态或习惯逐渐形成，强调变化的过程。', level: 'N4' },
      { point: '〜ではなかろうか', explanation: '「壊れるのではなかろうか」——「〜ではないか」的古语/书面形式，表示推测，带有一种忧虑或期待的心情。', level: 'N1' },
    ],
  },
  {
    id: 'hashire-merosu',
    author: '太宰治',
    author_jp: 'だざいおさむ',
    author_reading: 'Dazai Osamu',
    work: '走れメロス',
    work_jp: 'はしれメロス',
    work_reading: 'Hashire Merosu',
    year: '1940',
    genre: '短篇小说',
    difficulty: 'N3',
    excerpt_label: '冒頭',
    cover_color: 'linear-gradient(135deg, #ff6b6b 0%, #ee5a24 100%)',
    paragraphs: [
      {
        japanese: 'メロスは激怒した。必ず、かの邪智暴虐の王を除かなければならぬと決意した。メロスには政治がわからぬ。メロスは、村の牧人である。',
        reading: 'メロスはげきどした。かならず、かのじゃちぼうぎゃくのおうをのぞかなければならぬとけついした。メロスにはせいじがわからぬ。メロスは、むらのぼくじんである。',
        translation_zh: '墨罗斯勃然大怒。他下定决心，无论如何必须除掉那个奸佞暴虐的国王。墨罗斯不懂政治，他不过是个村里的牧羊人。',
      },
      {
        japanese: 'しかし邪悪に対しては、人一倍に敏感であった。きょう未明メロスは村を出発し、野を越え山越え、十里はなれた此のシラクスの市にやって来た。',
        reading: 'しかしじゃあくにたいしては、ひといちばいにびんかんであった。きょうみめいメロスはむらをしゅっぱつし、のをこえやまこえ、じゅうりはなれたこのシラクスのまちにやってきた。',
        translation_zh: '然而对于邪恶，他却比任何人都更为敏感。今天拂晓，墨罗斯离开村子，越过原野，翻过山岭，来到了距此十里之遥的锡拉库扎城。',
      },
    ],
    vocabulary: [
      { word: '激怒', reading: 'げきど', meaning: '激怒、勃然大怒', level: 'N2' },
      { word: '邪智暴虐', reading: 'じゃちぼうぎゃく', meaning: '奸佞暴虐（四字成语式）', level: 'N1' },
      { word: '牧人', reading: 'ぼくじん', meaning: '牧羊人', level: 'N2' },
      { word: '敏感', reading: 'びんかん', meaning: '敏感', level: 'N3' },
      { word: '未明', reading: 'みめい', meaning: '拂晓、黎明前', level: 'N2' },
    ],
    grammar_notes: [
      { point: '〜なければならぬ', explanation: '「除かなければならぬ」——「ならない」的文语/古语形式，语气更强烈、更有决断性，常见于文学作品。', level: 'N2' },
      { point: '人一倍に', explanation: '「人一倍に敏感」——比别人多一倍，表示程度比一般人更强，是惯用搭配。', level: 'N2' },
    ],
  },
  {
    id: 'ningen-shikkaku',
    author: '太宰治',
    author_jp: 'だざいおさむ',
    author_reading: 'Dazai Osamu',
    work: '人間失格',
    work_jp: 'にんげんしっかく',
    work_reading: 'Ningen Shikkaku',
    year: '1948',
    genre: '小说',
    difficulty: 'N2',
    excerpt_label: '第一の手記',
    cover_color: 'linear-gradient(135deg, #2c3e50 0%, #4a6fa5 100%)',
    paragraphs: [
      {
        japanese: 'ずっと自分は、その人の笑顔を、美しいと思い続けてきた。',
        reading: 'ずっとじぶんは、そのひとのえがおを、うつくしいとおもいつづけてきた。',
        translation_zh: '一直以来，自己都认为那个人的笑容是美丽的。',
      },
      {
        japanese: '恥の多い生涯を送って来ました。自分には、人間の生活というものが、見当つかないのです。',
        reading: 'はじのおおいしょうがいをおくってきました。じぶんには、にんげんのせいかつというものが、けんとうつかないのです。',
        translation_zh: '我这一生，充满了羞耻。对我而言，人类的生活，是完全无从把握的。',
      },
      {
        japanese: '自分は東北の田舎に生れましたが、汽車をはじめて見たのは、よほど大きくなってからでした。',
        reading: 'じぶんはとうほくのいなかにうまれましたが、きしゃをはじめてみたのは、よほどおおきくなってからでした。',
        translation_zh: '自己生于东北的乡下，第一次看到火车，已经是长大不少之后的事了。',
      },
    ],
    vocabulary: [
      { word: '生涯', reading: 'しょうがい', meaning: '一生、生涯', level: 'N2' },
      { word: '見当がつかない', reading: 'けんとうがつかない', meaning: '无从把握、完全不明白', level: 'N2' },
      { word: 'よほど', reading: 'よほど', meaning: '相当地、大大地', level: 'N3' },
    ],
    grammar_notes: [
      { point: '〜て来ました', explanation: '「送って来ました」——「〜てきた」的礼貌形，表示从过去到现在持续的动作或状态。', level: 'N4' },
      { point: '〜というものが', explanation: '「人間の生活というものが」——强调所提到的事物概念本身，带有思考或审视的语气。', level: 'N3' },
      { point: '〜てからでした', explanation: '「大きくなってからでした」——表示某事发生在另一事之后，「〜てから」强调时序关系。', level: 'N4' },
    ],
  },
]

export function getReadingById(id: string): ReadingPassage | undefined {
  return READINGS.find(r => r.id === id)
}

export function getReadingsByDifficulty(difficulty: 'N3' | 'N2' | 'N1'): ReadingPassage[] {
  return READINGS.filter(r => r.difficulty === difficulty)
}
