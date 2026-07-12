'use client'
import { useState, useCallback } from 'react'
import { Word } from '@/lib/types'
import { DRAMAS } from '@/lib/data/dramas'

function speakJa(text: string) {
  if (typeof window === 'undefined' || !window.speechSynthesis) return
  window.speechSynthesis.cancel()
  const u = new SpeechSynthesisUtterance(text)
  u.lang = 'ja-JP'
  u.rate = 0.85
  window.speechSynthesis.speak(u)
}

// Per-word scene data: iconic quote + visual mood
const SCENE_DATA: Record<string, {
  quote: string
  quote_reading?: string
  speaker?: string
  mood: 'tense' | 'warm' | 'dramatic' | 'comic' | 'lyrical' | 'melancholy'
}> = {
  baigaeshi: {
    quote: 'やられたらやり返す、倍返しだ！',
    quote_reading: 'やられたらやりかえす、ばいがえしだ！',
    speaker: '半沢直樹',
    mood: 'dramatic',
  },
  dogeza: {
    quote: '土下座して謝れ！',
    quote_reading: 'どげざしてあやまれ！',
    speaker: '半沢直樹',
    mood: 'tense',
  },
  yuushi: {
    quote: '銀行は晴れの日に傘を貸して、雨の日に取り上げる',
    quote_reading: 'ぎんこうははれのひにかさをかして、あめのひにとりあげる',
    mood: 'tense',
  },
  fuse: {
    quote: '不正は許さない。それが銀行員の矜持だ',
    quote_reading: 'ふせいはゆるさない。それがぎんこういんのきょうじだ',
    speaker: '里見脩二',
    mood: 'dramatic',
  },
  tobaku: {
    quote: '頭取の椅子は、そう簡単には渡さん',
    quote_reading: 'とうどりのいすは、そうかんたんにはわたさん',
    mood: 'tense',
  },
  shujutsu: {
    quote: 'わたし、失敗しないので',
    quote_reading: 'わたし、しっぱいしないので',
    speaker: '大門未知子',
    mood: 'dramatic',
  },
  shikkou: {
    quote: '誰が執刀するかで、患者の命が変わる',
    quote_reading: 'だれがしっとうするかで、かんじゃのいのちがかわる',
    mood: 'tense',
  },
  kanja: {
    quote: '患者さんのために、全力を尽くす',
    quote_reading: 'かんじゃさんのために、ぜんりょくをつくす',
    mood: 'warm',
  },
  bengoshi: {
    quote: '私は正義の味方ではない。ただ、依頼人の味方だ',
    quote_reading: 'わたしはせいぎのみかたではない。ただ、いらいにんのみかただ',
    speaker: '古美門研介',
    mood: 'dramatic',
  },
  hanketsu: {
    quote: '被告人は、無罪！',
    quote_reading: 'ひこくにんは、むざい！',
    mood: 'dramatic',
  },
  keiyaku: {
    quote: '契約です。これは、対等な契約なんです',
    quote_reading: 'けいやくです。これは、たいとうなけいやくなんです',
    speaker: '森山みくり',
    mood: 'comic',
  },
  kaji: {
    quote: '家事は、立派な仕事です',
    quote_reading: 'かじは、りっぱなしごとです',
    mood: 'warm',
  },
  ensou: {
    quote: '音楽は、言葉にならない気持ちを伝える',
    quote_reading: 'おんがくは、ことばにならないきもちをつたえる',
    mood: 'lyrical',
  },
  himitsu: {
    quote: '秘密を抱えたまま、一緒に生きていこう',
    quote_reading: 'ひみつをかかえたまま、いっしょにいきていこう',
    mood: 'melancholy',
  },
  henshu: {
    quote: '重版出来！この言葉のために、編集者は生きている',
    quote_reading: 'じゅうはんでき！このことばのために、へんしゅうしゃはいきている',
    mood: 'warm',
  },
  seimei: {
    quote: '小さな命を守るために、私たちはここにいる',
    quote_reading: 'ちいさないのちをまもるために、わたしたちはここにいる',
    mood: 'warm',
  },
  tanjou: {
    quote: '生まれてきてくれて、ありがとう',
    quote_reading: 'うまれてきてくれて、ありがとう',
    mood: 'warm',
  },
  ganbaru: {
    quote: 'やれるだけやってみよう。後悔しないために',
    quote_reading: 'やれるだけやってみよう。こうかいしないために',
    mood: 'warm',
  },
  osekkai: {
    quote: 'おせっかいで悪かったね。でも心配なんだもの',
    quote_reading: 'おせっかいでわるかったね。でもしんぱいなんだもの',
    mood: 'comic',
  },
  kimochi: {
    quote: 'あなたの気持ちが、わからない',
    quote_reading: 'あなたのきもちが、わからない',
    mood: 'melancholy',
  },
  nakama: {
    quote: '仲間がいるから、前に進める',
    quote_reading: 'なかまがいるから、まえにすすめる',
    mood: 'warm',
  },
  shouganai: {
    quote: '仕方がない。でも、諦めない',
    quote_reading: 'しかたがない。でも、あきらめない',
    mood: 'melancholy',
  },
  otsukare: {
    quote: 'お疲れ様でした。今日も、よく頑張りました',
    quote_reading: 'おつかれさまでした。きょうも、よくがんばりました',
    mood: 'warm',
  },
  // 白色巨塔
  kenryoku: {
    quote: '権力は人を変える。だが、志までは変えられない',
    quote_reading: 'けんりょくはひとをかえる。だが、こころざしまではかえられない',
    speaker: '里見脩二',
    mood: 'tense',
  },
  shusse: {
    quote: '出世のためなら、何でもできる。そう思っていた',
    quote_reading: 'しゅっせのためなら、なんでもできる。そうおもっていた',
    speaker: '財前五郎',
    mood: 'dramatic',
  },
  shinjitsu: {
    quote: '真実から目を背けたとき、医者は終わる',
    quote_reading: 'しんじつからめをそむけたとき、いしゃはおわる',
    speaker: '里見脩二',
    mood: 'dramatic',
  },
  ikyoku: {
    quote: '医局とは、白い巨塔の縮図だ',
    quote_reading: 'いきょくとは、しろいきょとうのしゅくずだ',
    mood: 'tense',
  },
  // 交响情人梦
  tensai: {
    quote: 'なんでこんなに弾けるんだ！',
    quote_reading: 'なんでこんなにひけるんだ！',
    speaker: '千秋真一',
    mood: 'comic',
  },
  shiki: {
    quote: '指揮者は、オーケストラの命だ',
    quote_reading: 'しきしゃは、おーけすとらのいのちだ',
    speaker: '千秋真一',
    mood: 'lyrical',
  },
  jounetsu: {
    quote: '音楽への情熱だけは、誰にも負けない！',
    quote_reading: 'おんがくへのじょうねつだけは、だれにもまけない！',
    speaker: '野田惠',
    mood: 'lyrical',
  },
  renshuu: {
    quote: '練習しないと上手くならない。天才でも同じだ',
    quote_reading: 'れんしゅうしないとうまくならない。てんさいでもおなじだ',
    speaker: '千秋真一',
    mood: 'dramatic',
  },
  // 求婚大作战
  koukai: {
    quote: 'なんで言えなかったんだ…もっと早く…',
    quote_reading: 'なんでいえなかったんだ…もっとはやく…',
    speaker: '岩本健',
    mood: 'melancholy',
  },
  unmei: {
    quote: 'これが運命なら、俺は運命を変えてみせる',
    quote_reading: 'これがうんめいなら、おれはうんめいをかえてみせる',
    speaker: '岩本健',
    mood: 'dramatic',
  },
  kokuhaku: {
    quote: '好きです。ずっと、好きでした',
    quote_reading: 'すきです。ずっと、すきでした',
    mood: 'lyrical',
  },
  chansu: {
    quote: 'このチャンスを無駄にするな！',
    quote_reading: 'このちゃんすをむだにするな！',
    mood: 'dramatic',
  },
  // 过保护的加穗子
  kahogo: {
    quote: 'お母さん、私、自分でやってみたい',
    quote_reading: 'おかあさん、わたし、じぶんでやってみたい',
    speaker: '麦野カホコ',
    mood: 'warm',
  },
  jiritsu: {
    quote: '一人でできる。やってみないと、わからない',
    quote_reading: 'ひとりでできる。やってみないと、わからない',
    speaker: '麦野カホコ',
    mood: 'warm',
  },
  seichou: {
    quote: '転んでもいい。立ち上がれれば、それが成長だ',
    quote_reading: 'ころんでもいい。たちあがれれば、それがせいちょうだ',
    mood: 'warm',
  },
  amayakasu: {
    quote: '甘やかすのが愛じゃない。信じることが愛なんだ',
    quote_reading: 'あまやかすのがあいじゃない。しんじることがあいなんだ',
    mood: 'warm',
  },
  // ラスト・フレンズ
  ibasho: {
    quote: 'ここにいていい。あなたの居場所は、ここにある',
    quote_reading: 'ここにいていい。あなたのいばしょは、ここにある',
    mood: 'melancholy',
  },
  yuujou: {
    quote: '友情って、家族より強いかもしれない',
    quote_reading: 'ゆうじょうって、かぞくよりつよいかもしれない',
    mood: 'warm',
  },
  kodoku: {
    quote: '一人じゃない。それだけで、生きていける',
    quote_reading: 'ひとりじゃない。それだけで、いきていける',
    speaker: '橘木美知留',
    mood: 'melancholy',
  },
  sokubaku: {
    quote: '好きだから束縛するんだ。それは愛じゃない',
    quote_reading: 'すきだからそくばくするんだ。それはあいじゃない',
    mood: 'tense',
  },
  sasaeru: {
    quote: '私があなたを支えるから、倒れないでいい',
    quote_reading: 'わたしがあなたをささえるから、たおれないでいい',
    speaker: '岸本瑠可',
    mood: 'lyrical',
  },
  jibunrashiku: {
    quote: '自分らしく生きることは、罪じゃない',
    quote_reading: 'じぶんらしくいきることは、つみじゃない',
    speaker: '岸本瑠可',
    mood: 'lyrical',
  },
  // カルテット（追加）
  uso: {
    quote: '嘘をついたことない人なんて、信用できない',
    quote_reading: 'うそをついたことないひとなんて、しんようできない',
    speaker: '世吹すずめ',
    mood: 'melancholy',
  },
  honne: {
    quote: '本音で話してよ。建前はもういらない',
    quote_reading: 'ほんねではなしてよ。たてまえはもういらない',
    mood: 'melancholy',
  },
  kioku: {
    quote: '記憶って、信じていいのかな。自分の記憶でさえ',
    quote_reading: 'きおくって、しんじていいのかな。じぶんのきおくでさえ',
    mood: 'melancholy',
  },
  surechigai: {
    quote: 'ずっとすれ違ってたんだ。ずっと隣にいたのに',
    quote_reading: 'ずっとすれちがってたんだ。ずっととなりにいたのに',
    mood: 'melancholy',
  },
  // 最高の離婚
  rikon: {
    quote: '離婚って、結婚より難しいんだよ',
    quote_reading: 'りこんって、けっこんよりむずかしいんだよ',
    speaker: '光生',
    mood: 'comic',
  },
  kekkon: {
    quote: '結婚って何のためにするんだ？幸せになるため？',
    quote_reading: 'けっこんってなんのためにするんだ？しあわせになるため？',
    speaker: '光生',
    mood: 'comic',
  },
  kachikan: {
    quote: '価値観が違うって、それだけで別れる理由になる？',
    quote_reading: 'かちかんがちがうって、それだけでわかれるりゆうになる？',
    speaker: '結夏',
    mood: 'comic',
  },
  gaman: {
    quote: '我慢にも限界がある。それが今日だった',
    quote_reading: 'がまんにもげんかいがある。それがきょうだった',
    speaker: '結夏',
    mood: 'melancholy',
  },
  aishou: {
    quote: '相性がいい。でも好きじゃない。それって最悪だよ',
    quote_reading: 'あいしょうがいい。でもすきじゃない。それってさいあくだよ',
    speaker: '光生',
    mood: 'comic',
  },
  // 東京女子図鑑
  jyokyo: {
    quote: '上京したら、何でもできると思ってた',
    quote_reading: 'じょうきょうしたら、なんでもできるとおもってた',
    speaker: '綾',
    mood: 'melancholy',
  },
  yokubo: {
    quote: 'もっと上へ。それが私を動かす唯一のエネルギー',
    quote_reading: 'もっとうえへ。それがわたしをうごかすゆいいつのえねるぎー',
    speaker: '綾',
    mood: 'dramatic',
  },
  riso: {
    quote: '全部手に入れたのに、なんで空っぽなんだろう',
    quote_reading: 'ぜんぶてにいれたのに、なんでからっぽなんだろう',
    speaker: '綾',
    mood: 'melancholy',
  },
  dokushin: {
    quote: 'なぜ独身なの？その答え、私にもわからない',
    quote_reading: 'なぜどくしんなの？そのこたえ、わたしにもわからない',
    speaker: '綾',
    mood: 'melancholy',
  },
  jibunrashisa: {
    quote: '東京に来て、自分らしさを失ったのかな',
    quote_reading: 'とうきょうにきて、じぶんらしさをうしなったのかな',
    speaker: '綾',
    mood: 'melancholy',
  },
  // ロングバケーション
  dekiai: {
    quote: 'こんな出会いもあるんだね。おかしいよね',
    quote_reading: 'こんなであいもあるんだね。おかしいよね',
    mood: 'warm',
  },
  kyuuka: {
    quote: '失敗した時は、神様がくれた長い休暇だと思えばいい',
    quote_reading: 'しっぱいしたときは、かみさまがくれたながいきゅうかだとおもえばいい',
    speaker: '瀬名葉山',
    mood: 'warm',
  },
  en: {
    quote: 'こんな縁もあるんだね。大切にしなきゃ',
    quote_reading: 'こんなえんもあるんだね。たいせつにしなきゃ',
    mood: 'warm',
  },
  natsukashii: {
    quote: 'あの頃に戻りたいんじゃない。懐かしいんだ',
    quote_reading: 'あのころにもどりたいんじゃない。なつかしいんだ',
    mood: 'warm',
  },
  piano: {
    quote: 'ピアノだけは、嘘をつかない',
    quote_reading: 'ぴあのだけは、うそをつかない',
    speaker: '瀬名葉山',
    mood: 'lyrical',
  },
  // 1リットルの涙
  namida: {
    quote: '涙が出てもいい。生きている証拠だから',
    quote_reading: 'なみだがでてもいい。いきているしょうこだから',
    speaker: '木藤麻也',
    mood: 'melancholy',
  },
  ikiru: {
    quote: '生きていたい。ただ、それだけ',
    quote_reading: 'いきていたい。ただ、それだけ',
    speaker: '木藤麻也',
    mood: 'melancholy',
  },
  kiseki: {
    quote: '生きていることが奇跡だって、病気になって初めてわかった',
    quote_reading: 'いきていることがきせきだって、びょうきになってはじめてわかった',
    speaker: '木藤麻也',
    mood: 'warm',
  },
  chousen: {
    quote: 'できないことが増えていく。でも、諦めない',
    quote_reading: 'できないことがふえていく。でも、あきらめない',
    speaker: '木藤麻也',
    mood: 'dramatic',
  },
  // 古畑任三郎
  suiri: {
    quote: 'そうですねえ…それはおかしいですねえ',
    speaker: '古畑任三郎',
    mood: 'tense',
  },
  hannin: {
    quote: '犯人はあなただ。もう逃げられませんよ',
    speaker: '古畑任三郎',
    mood: 'dramatic',
  },
  shoko: {
    quote: '証拠はありますよ。あなたが言ったことが証拠です',
    speaker: '古畑任三郎',
    mood: 'tense',
  },
  keiji: {
    quote: '刑事というのは、諦めないことが仕事なんですよ',
    speaker: '古畑任三郎',
    mood: 'tense',
  },
  // 砂の器
  kako: {
    quote: '過去は消せない。でも、前へ進むことはできる',
    speaker: '今西栄太郎',
    mood: 'melancholy',
  },
  suna_unmei: {
    quote: 'これが宿命なら、私は最後まで音楽と共に行く',
    speaker: '和賀英良',
    mood: 'dramatic',
  },
  tabiji: {
    quote: '父と子、二人だけの長い旅路だった',
    speaker: '今西栄太郎',
    mood: 'melancholy',
  },
  aishuu: {
    quote: 'その哀愁が、彼を追い続けさせた',
    speaker: '今西栄太郎',
    mood: 'melancholy',
  },
  suna_shinjitsu: {
    quote: '真実を知ることが、本当に幸せなのか',
    speaker: '今西栄太郎',
    mood: 'tense',
  },
  // とと姉ちゃん
  toto_chichi: {
    quote: '私のととは、死んでもずっとここにいる',
    speaker: '常子',
    mood: 'melancholy',
  },
  toto_jiritsu: {
    quote: '自分の足で立ちたい。誰かに頼らなくても',
    speaker: '常子',
    mood: 'dramatic',
  },
  toto_gaman: {
    quote: '我慢するのに慣れすぎてしまったのかもしれない',
    speaker: '常子',
    mood: 'melancholy',
  },
  toto_kurashi: {
    quote: 'よりよい暮らしを、みんなに届けたい',
    speaker: '常子',
    mood: 'warm',
  },
  toto_choujo: {
    quote: '長女だから、しっかりしなければ',
    speaker: '常子',
    mood: 'dramatic',
  },
  // 黒革の手帖
  yabou: {
    quote: '野望を持つことの何が悪い。私はただ生き残りたかっただけ',
    speaker: '元子',
    mood: 'dramatic',
  },
  kyohaku: {
    quote: 'この手帖の中身、あなたなら意味がわかるでしょう',
    speaker: '元子',
    mood: 'tense',
  },
  sakuryaku: {
    quote: '感情で動いたら負け。全ては策略通りに',
    speaker: '元子',
    mood: 'tense',
  },
  kuro_shusse: {
    quote: '出世のためなら、何でも使う。それが私の生き方',
    speaker: '元子',
    mood: 'dramatic',
  },
  shitto: {
    quote: '嫉妬するなら、もっと強くなりなさい',
    speaker: '元子',
    mood: 'tense',
  },
  // 雪国
  yuki_mujokan: {
    quote: '国境の長いトンネルを抜けると雪国であった',
    speaker: '語り手',
    mood: 'melancholy',
  },
  yuki_kanashimi: {
    quote: '徒労と知りながら、それでも彼女は愛した',
    speaker: '駒子',
    mood: 'melancholy',
  },
  yuki_mujaki: {
    quote: '葉子の声には、この世のものでない透明さがあった',
    speaker: '語り手',
    mood: 'lyrical',
  },
  yuki_yukikeshiki: {
    quote: '雪の白さが、すべての罪を隠してくれるようだった',
    speaker: '島村',
    mood: 'melancholy',
  },
  yuki_munashii: {
    quote: 'こんなにも美しいのに、こんなにも虚しい',
    speaker: '島村',
    mood: 'melancholy',
  },
  // 羅生門
  rash_akuinin: {
    quote: '悪人になるか、餓死するか。それだけのことだ',
    speaker: '下人',
    mood: 'tense',
  },
  rash_seizon: {
    quote: '生きるためならば、何でもするほかあるまい',
    speaker: '老婆',
    mood: 'dramatic',
  },
  rash_kyoufu: {
    quote: '羅生門の上には、ただ夜があるばかりだ',
    speaker: '語り手',
    mood: 'tense',
  },
  rash_roujo: {
    quote: 'この女の髪を抜いても、地獄へは落ちまい',
    speaker: '老婆',
    mood: 'tense',
  },
  rash_gizen: {
    quote: '善悪などというものは、風のふき次第でどうにでもなる',
    speaker: '語り手',
    mood: 'melancholy',
  },
  // 人間失格
  ningen_haji: {
    quote: '恥の多い生涯を送ってきました',
    speaker: '葉藏',
    mood: 'melancholy',
  },
  ningen_douke: {
    quote: '道化を演じることが、僕の唯一の生き方だった',
    speaker: '葉藏',
    mood: 'melancholy',
  },
  ningen_zetsumou: {
    quote: '人間というものが、わからない',
    speaker: '葉藏',
    mood: 'melancholy',
  },
  ningen_ningen: {
    quote: '僕はとうとう人間を失格してしまったのだろうか',
    speaker: '葉藏',
    mood: 'dramatic',
  },
  ningen_shikkaku: {
    quote: 'もはや、自分は完全に、人間失格でした',
    speaker: '葉藏',
    mood: 'melancholy',
  },
  // こころ
  kokoro_sensei: {
    quote: '私はあの時、先生の顔に暗い影が射すのを見た',
    speaker: '私',
    mood: 'melancholy',
  },
  kokoro_kodoku: {
    quote: '孤独な人間は、孤独の中にしか安住できない',
    speaker: '先生',
    mood: 'melancholy',
  },
  kokoro_uragiri: {
    quote: 'あの時、私はKを裏切った。それが私の罪だ',
    speaker: '先生',
    mood: 'dramatic',
  },
  kokoro_zankoku: {
    quote: '愛は罪悪の中から生まれたのかもしれない',
    speaker: '先生',
    mood: 'tense',
  },
  kokoro_kioku: {
    quote: 'この記憶を、あなたに残して逝きます',
    speaker: '先生',
    mood: 'melancholy',
  },
  // 点と線
  ten_alibi: {
    quote: 'このアリバイは、完璧なはずだった',
    speaker: '三原警部',
    mood: 'tense',
  },
  ten_jikanhyo: {
    quote: '時刻表に、たった四分の穴があった',
    speaker: '三原警部',
    mood: 'tense',
  },
  ten_hanzai: {
    quote: '犯罪の陰には、必ず権力の臭いがする',
    speaker: '三原警部',
    mood: 'dramatic',
  },
  ten_kanryou: {
    quote: '官僚というものは、自分の保身のためなら何でもする',
    speaker: '語り手',
    mood: 'tense',
  },
  ten_shoko: {
    quote: '証拠は、時刻表の中に隠れていた',
    speaker: '三原警部',
    mood: 'dramatic',
  },
  // 容疑者Xの献身
  yogi_kensin: {
    quote: '俺にできることは、すべてやった。それだけだ',
    speaker: '石神',
    mood: 'dramatic',
  },
  yogi_tensai2: {
    quote: '天才が孤独なのは、当然のことだ',
    speaker: '湯川',
    mood: 'melancholy',
  },
  yogi_yogisha: {
    quote: '容疑者Xとは、いったい誰なのか',
    speaker: '湯川',
    mood: 'tense',
  },
  yogi_kanzen: {
    quote: 'これは完全犯罪だ。論理的に、完璧な',
    speaker: '石神',
    mood: 'dramatic',
  },
  yogi_ai: {
    quote: 'あなたのためなら、すべてを失ってもいい',
    speaker: '石神',
    mood: 'melancholy',
  },
  // 旅游场景：酒店
  hotel_checkin: { quote: 'チェックインをお願いします', speaker: 'フロントにて', mood: 'lyrical' },
  hotel_yoyaku: { quote: '山田という名前で予約しています', speaker: '旅行者', mood: 'lyrical' },
  hotel_heya: { quote: '眺めの良い部屋はありますか？', speaker: '旅行者', mood: 'warm' },
  hotel_front: { quote: 'フロントに電話してみましょう', speaker: 'ガイドブック', mood: 'lyrical' },
  hotel_choshoku: { quote: '朝食付きのプランをお願いします', speaker: '旅行者', mood: 'warm' },
  hotel_ryoshusho: { quote: '領収書をいただけますか？', speaker: 'ビジネス旅行者', mood: 'lyrical' },
  hotel_checkout: { quote: 'チェックアウトは何時ですか？', speaker: 'フロント', mood: 'lyrical' },
  hotel_encho: { quote: 'もう一泊延長できますか？', speaker: '旅行者', mood: 'warm' },
  // 旅游场景：餐厅
  rest_chumon: { quote: 'ご注文はお決まりですか？', speaker: '店員', mood: 'warm' },
  rest_osusume: { quote: 'おすすめは何ですか？', speaker: '旅行者', mood: 'warm' },
  rest_okaikei: { quote: 'お会計をお願いします', speaker: '旅行者', mood: 'lyrical' },
  rest_kinenseki: { quote: '禁煙席をお願いします', speaker: '旅行者', mood: 'lyrical' },
  rest_arerugii: { quote: '卵のアレルギーがあります', speaker: '旅行者', mood: 'tense' },
  rest_okawari: { quote: 'ご飯おかわりできますか？', speaker: '旅行者', mood: 'warm' },
  rest_teishoku: { quote: '日替わり定食をください', speaker: '旅行者', mood: 'warm' },
  rest_gochisou: { quote: 'ごちそうさまでした！', speaker: '旅行者', mood: 'warm' },
  // 旅游场景：交通
  trans_norikae: { quote: '渋谷で山手線に乗り換えます', speaker: 'アナウンス', mood: 'lyrical' },
  trans_shiteiseki: { quote: '窓側の指定席をお願いします', speaker: '旅行者', mood: 'lyrical' },
  trans_ofuku: { quote: '東京から大阪まで往復一枚ください', speaker: '旅行者', mood: 'lyrical' },
  trans_kaisatsu: { quote: '改札を出たところで待ち合わせしましょう', speaker: '旅行者', mood: 'lyrical' },
  trans_chien: { quote: '電車が遅延しています、申し訳ございません', speaker: 'アナウンス', mood: 'tense' },
  trans_jiyuseki: { quote: '自由席は先着順です', speaker: 'アナウンス', mood: 'lyrical' },
  trans_home: { quote: '何番ホームから出ますか？', speaker: '旅行者', mood: 'lyrical' },
  trans_shuden: { quote: '終電に乗り遅れた！', speaker: '旅行者', mood: 'dramatic' },
  // 旅游场景：购物
  shop_shichaku: { quote: '試着してもいいですか？', speaker: '旅行者', mood: 'warm' },
  shop_saizu: { quote: 'Mサイズはありますか？', speaker: '旅行者', mood: 'lyrical' },
  shop_waribiki: { quote: 'セール中！30%割引！', speaker: '店員', mood: 'warm' },
  shop_resito: { quote: 'レシートはご入り用ですか？', speaker: '店員', mood: 'lyrical' },
  shop_menzei: { quote: 'パスポートを見せてください', speaker: '店員', mood: 'lyrical' },
  shop_fukuro: { quote: '袋はご入り用ですか？', speaker: 'レジ担当', mood: 'lyrical' },
  shop_zaiko: { quote: '在庫切れですが、取り寄せできます', speaker: '店員', mood: 'melancholy' },
  shop_ninki: { quote: 'これが今一番人気の商品です！', speaker: '店員', mood: 'warm' },
  // 旅游场景：就医
  med_shoujou: { quote: 'どんな症状ですか？', speaker: '医師', mood: 'tense' },
  med_shohosen: { quote: '処方箋を薬局に持って行ってください', speaker: '医師', mood: 'lyrical' },
  med_hokensho: { quote: '保険証はお持ちですか？', speaker: '受付', mood: 'lyrical' },
  med_yakkyoku: { quote: '近くに薬局はありますか？', speaker: '旅行者', mood: 'lyrical' },
  med_netsu: { quote: '熱があります、38度です', speaker: '旅行者', mood: 'tense' },
  med_zutsuu: { quote: '頭痛がします', speaker: '旅行者', mood: 'tense' },
  med_itsuu: { quote: '胃が痛いです', speaker: '旅行者', mood: 'tense' },
  med_kyukyusha: { quote: '119番に電話して救急車を呼びましょう', speaker: 'ガイド', mood: 'dramatic' },
  // 旅游场景：问路
  dir_chikaku: { quote: '近くにコンビニはありますか？', speaker: '旅行者', mood: 'lyrical' },
  dir_ussen: { quote: '交差点を右折してください', speaker: '通行人', mood: 'lyrical' },
  dir_sasetsu: { quote: '最初の角を左折してください', speaker: '通行人', mood: 'lyrical' },
  dir_kosaten: { quote: '次の交差点を渡ってください', speaker: '通行人', mood: 'lyrical' },
  dir_mejirushi: { quote: 'コンビニが目印です', speaker: '通行人', mood: 'warm' },
  dir_toho: { quote: '駅から徒歩5分です', speaker: 'パンフレット', mood: 'lyrical' },
  dir_maigo: { quote: '迷子になってしまいました', speaker: '旅行者', mood: 'melancholy' },
  dir_chizu: { quote: '地図を見せてもらえますか？', speaker: '旅行者', mood: 'lyrical' },
}

const MOOD_STYLES: Record<string, {
  bg: string
  accent: string
  textLight: string
  textDim: string
  pattern: string
}> = {
  dramatic: {
    bg: 'from-stone-900 via-stone-800 to-stone-900',
    accent: '#C0392B',
    textLight: '#F5F0E8',
    textDim: 'rgba(245,240,232,0.5)',
    pattern: 'diagonal',
  },
  tense: {
    bg: 'from-slate-900 via-slate-800 to-slate-900',
    accent: '#E74C3C',
    textLight: '#ECF0F1',
    textDim: 'rgba(236,240,241,0.45)',
    pattern: 'grid',
  },
  warm: {
    bg: 'from-amber-900 via-amber-800 to-stone-900',
    accent: '#F39C12',
    textLight: '#FEF9EF',
    textDim: 'rgba(254,249,239,0.5)',
    pattern: 'dots',
  },
  comic: {
    bg: 'from-rose-800 via-pink-800 to-rose-900',
    accent: '#FF6B9D',
    textLight: '#FFF0F5',
    textDim: 'rgba(255,240,245,0.5)',
    pattern: 'dots',
  },
  lyrical: {
    bg: 'from-indigo-900 via-purple-900 to-indigo-900',
    accent: '#9B59B6',
    textLight: '#EEE8F8',
    textDim: 'rgba(238,232,248,0.5)',
    pattern: 'diagonal',
  },
  melancholy: {
    bg: 'from-zinc-900 via-neutral-800 to-zinc-900',
    accent: '#7F8C8D',
    textLight: '#ECF0F1',
    textDim: 'rgba(236,240,241,0.45)',
    pattern: 'grid',
  },
}

interface Props {
  word: Word
}

export default function SceneIllustration({ word }: Props) {
  const drama = DRAMAS.find(d => d.id === word.drama_id)
  const scene = SCENE_DATA[word.id]

  if (!drama || !scene) return null

  const style = MOOD_STYLES[scene.mood]
  const shortQuote = scene.quote.length > 22
    ? scene.quote.slice(0, 22) + '…'
    : scene.quote

  return (
    <div className={`relative w-full rounded-xl overflow-hidden bg-gradient-to-br ${style.bg}`}
      style={{ minHeight: 160 }}>

      {/* Background pattern SVG */}
      <svg className="absolute inset-0 w-full h-full opacity-10" aria-hidden>
        {scene.mood === 'tense' || scene.mood === 'melancholy' ? (
          // Grid lines
          <pattern id={`p-${word.id}`} x="0" y="0" width="24" height="24" patternUnits="userSpaceOnUse">
            <path d="M 24 0 L 0 0 0 24" fill="none" stroke="white" strokeWidth="0.5" />
          </pattern>
        ) : scene.mood === 'dramatic' ? (
          // Diagonal lines
          <pattern id={`p-${word.id}`} x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
            <path d="M 0 20 L 20 0" stroke="white" strokeWidth="0.5" />
          </pattern>
        ) : (
          // Dots
          <pattern id={`p-${word.id}`} x="0" y="0" width="16" height="16" patternUnits="userSpaceOnUse">
            <circle cx="8" cy="8" r="1" fill="white" />
          </pattern>
        )}
        <rect width="100%" height="100%" fill={`url(#p-${word.id})`} />
      </svg>

      {/* Accent vertical bar */}
      <div className="absolute left-0 top-0 bottom-0 w-1 rounded-l-xl"
        style={{ background: style.accent }} />

      {/* Content */}
      <div className="relative px-5 py-4 flex flex-col justify-between h-full" style={{ minHeight: 160 }}>

        {/* Top: drama title */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <span className="text-xs font-medium px-2 py-0.5 rounded"
              style={{ background: style.accent + '33', color: style.accent, border: `1px solid ${style.accent}55` }}>
              {drama.title_jp}
            </span>
            <span style={{ color: style.textDim }} className="text-xs">{drama.year}</span>
          </div>
          <span style={{ color: style.textDim }} className="text-xs">{drama.genre}</span>
        </div>

        {/* Middle: big Japanese word */}
        <div className="flex-1 flex flex-col justify-center py-2">
          <div className="flex items-baseline gap-3 mb-1">
            <span className="font-bold leading-none" style={{
              fontFamily: 'Noto Serif JP, serif',
              fontSize: '2.8rem',
              color: style.textLight,
              textShadow: `0 0 20px ${style.accent}66`,
            }}>
              {word.japanese}
            </span>
            <span style={{ color: style.textDim, fontSize: '1rem' }}>{word.reading}</span>
          </div>
          <div style={{ color: style.accent, fontSize: '0.85rem', fontWeight: 600 }}>
            {word.meaning_zh}
          </div>
        </div>

        {/* Bottom: quote */}
        <div className="mt-3 border-t pt-3" style={{ borderColor: style.textDim + '44' }}>
          <div className="flex items-start gap-2">
            <p className="text-sm leading-relaxed italic flex-1" style={{ color: style.textLight }}>
              「{shortQuote}」
            </p>
            <button
              onClick={() => speakJa(scene.quote_reading || scene.quote)}
              className="text-base opacity-60 active:opacity-30 shrink-0 mt-0.5"
              aria-label="朗读台词"
            >
              🔊
            </button>
          </div>
          {scene.speaker && (
            <p className="text-xs mt-1" style={{ color: style.textDim }}>
              — {scene.speaker}
            </p>
          )}
        </div>
      </div>
    </div>
  )
}
