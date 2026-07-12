export interface TravelPhrase {
  id: string
  japanese: string
  reading: string
  meaning_zh: string
  tip?: string
}

export interface TravelScene {
  id: string
  icon: string
  name_zh: string
  name_jp: string
  color: string
  phrases: TravelPhrase[]
}

export const TRAVEL_SCENES: TravelScene[] = [
  {
    id: 'hotel',
    icon: '🏨',
    name_zh: '酒店',
    name_jp: 'ホテル',
    color: 'from-blue-500 to-indigo-600',
    phrases: [
      { id: 'h1', japanese: 'チェックインをお願いします。', reading: 'チェックインをおねがいします。', meaning_zh: '我要办理入住。' },
      { id: 'h2', japanese: '予約した○○です。', reading: 'よやくした○○です。', meaning_zh: '我是预约的○○（姓名）。' },
      { id: 'h3', japanese: 'シングルルームを一部屋お願いします。', reading: 'シングルルームをひとへやおねがいします。', meaning_zh: '请给我一间单人房。' },
      { id: 'h4', japanese: 'Wi-Fiのパスワードを教えてください。', reading: 'ワイファイのパスワードをおしえてください。', meaning_zh: '请告诉我Wi-Fi密码。' },
      { id: 'h5', japanese: 'タオルをもう一枚もらえますか？', reading: 'タオルをもういちまいもらえますか？', meaning_zh: '可以再给我一条毛巾吗？' },
      { id: 'h6', japanese: 'エアコンの使い方を教えてください。', reading: 'エアコンのつかいかたをおしえてください。', meaning_zh: '请教我怎么用空调。' },
      { id: 'h7', japanese: 'チェックアウトは何時ですか？', reading: 'チェックアウトはなんじですか？', meaning_zh: '退房时间是几点？' },
      { id: 'h8', japanese: 'チェックアウトをお願いします。', reading: 'チェックアウトをおねがいします。', meaning_zh: '我要退房。' },
      { id: 'h9', japanese: 'ここに荷物を預かってもらえますか？', reading: 'ここににもつをあずかってもらえますか？', meaning_zh: '可以帮我寄存行李吗？' },
      { id: 'h10', japanese: '領収書をください。', reading: 'りょうしゅうしょをください。', meaning_zh: '请给我收据。' },
    ],
  },
  {
    id: 'restaurant',
    icon: '🍜',
    name_zh: '餐厅',
    name_jp: 'レストラン',
    color: 'from-orange-500 to-red-500',
    phrases: [
      { id: 'r1', japanese: '二人です。', reading: 'ふたりです。', meaning_zh: '两个人。', tip: '进门时店员问人数' },
      { id: 'r2', japanese: 'メニューを見せてください。', reading: 'メニューをみせてください。', meaning_zh: '请给我看菜单。' },
      { id: 'r3', japanese: 'これをください。', reading: 'これをください。', meaning_zh: '我要这个。（指着菜单点菜）' },
      { id: 'r4', japanese: 'おすすめは何ですか？', reading: 'おすすめはなんですか？', meaning_zh: '你们的推荐菜是什么？' },
      { id: 'r5', japanese: 'お会計をお願いします。', reading: 'おかいけいをおねがいします。', meaning_zh: '请结账。' },
      { id: 'r6', japanese: 'カードで払えますか？', reading: 'カードではらえますか？', meaning_zh: '可以刷卡吗？' },
      { id: 'r7', japanese: '辛くないものはありますか？', reading: 'からくないものはありますか？', meaning_zh: '有不辣的菜吗？' },
      { id: 'r8', japanese: 'アレルギーがあります。', reading: 'アレルギーがあります。', meaning_zh: '我有过敏。', tip: '后接过敏食材名称' },
      { id: 'r9', japanese: 'お水をください。', reading: 'おみずをください。', meaning_zh: '请给我一杯水。' },
      { id: 'r10', japanese: 'とても美味しかったです！', reading: 'とてもおいしかったです！', meaning_zh: '非常好吃！' },
    ],
  },
  {
    id: 'transport',
    icon: '🚃',
    name_zh: '交通',
    name_jp: '交通',
    color: 'from-emerald-500 to-teal-600',
    phrases: [
      { id: 't1', japanese: '○○までいくらですか？', reading: '○○までいくらですか？', meaning_zh: '去○○要多少钱？' },
      { id: 't2', japanese: '○○行きの電車はどれですか？', reading: '○○ゆきのでんしゃはどれですか？', meaning_zh: '去○○的电车是哪一趟？' },
      { id: 't3', japanese: '○○まで一枚ください。', reading: '○○までいちまいください。', meaning_zh: '请给我一张到○○的票。' },
      { id: 't4', japanese: '次は○○駅ですか？', reading: 'つぎは○○えきですか？', meaning_zh: '下一站是○○站吗？' },
      { id: 't5', japanese: 'この電車は○○に止まりますか？', reading: 'このでんしゃは○○にとまりますか？', meaning_zh: '这趟电车停○○吗？' },
      { id: 't6', japanese: '乗り換えはどこですか？', reading: 'のりかえはどこですか？', meaning_zh: '在哪里换乘？' },
      { id: 't7', japanese: '○○駅まで連れて行ってください。', reading: '○○えきまでつれていってください。', meaning_zh: '（打车时）请送我去○○站。' },
      { id: 't8', japanese: 'ここで降ります。', reading: 'ここでおります。', meaning_zh: '我在这里下车。' },
      { id: 't9', japanese: '終電は何時ですか？', reading: 'しゅうでんはなんじですか？', meaning_zh: '末班车是几点？' },
      { id: 't10', japanese: 'ICカードはありますか？', reading: 'アイシーカードはありますか？', meaning_zh: '有IC卡吗？（Suica等）' },
    ],
  },
  {
    id: 'shopping',
    icon: '🛍️',
    name_zh: '购物',
    name_jp: 'ショッピング',
    color: 'from-pink-500 to-rose-500',
    phrases: [
      { id: 's1', japanese: 'これはいくらですか？', reading: 'これはいくらですか？', meaning_zh: '这个多少钱？' },
      { id: 's2', japanese: 'Mサイズはありますか？', reading: 'エムサイズはありますか？', meaning_zh: '有M码吗？' },
      { id: 's3', japanese: '試着してもいいですか？', reading: 'しちゃくしてもいいですか？', meaning_zh: '可以试穿吗？' },
      { id: 's4', japanese: '袋に入れてください。', reading: 'ふくろにいれてください。', meaning_zh: '请装进袋子里。' },
      { id: 's5', japanese: '免税手続きをお願いします。', reading: 'めんぜいてつづきをおねがいします。', meaning_zh: '请帮我办理免税手续。' },
      { id: 's6', japanese: 'カードは使えますか？', reading: 'カードはつかえますか？', meaning_zh: '可以用信用卡吗？' },
      { id: 's7', japanese: 'ギフト用に包んでもらえますか？', reading: 'ギフトようにつつんでもらえますか？', meaning_zh: '可以包装成礼品吗？' },
      { id: 's8', japanese: 'これください。', reading: 'これください。', meaning_zh: '我要买这个。' },
      { id: 's9', japanese: 'レシートをください。', reading: 'レシートをください。', meaning_zh: '请给我收据。' },
      { id: 's10', japanese: '在庫はありますか？', reading: 'ざいこはありますか？', meaning_zh: '有库存吗？' },
    ],
  },
  {
    id: 'medical',
    icon: '🏥',
    name_zh: '就医',
    name_jp: '病院・薬局',
    color: 'from-red-500 to-rose-600',
    phrases: [
      { id: 'm1', japanese: '具合が悪いです。', reading: 'ぐあいがわるいです。', meaning_zh: '我身体不舒服。' },
      { id: 'm2', japanese: '頭が痛いです。', reading: 'あたまがいたいです。', meaning_zh: '我头痛。' },
      { id: 'm3', japanese: '熱があります。', reading: 'ねつがあります。', meaning_zh: '我发烧了。' },
      { id: 'm4', japanese: 'お腹が痛いです。', reading: 'おなかがいたいです。', meaning_zh: '我肚子痛。' },
      { id: 'm5', japanese: '保険証を持っていません。', reading: 'ほけんしょうをもっていません。', meaning_zh: '我没有保险证（医保卡）。' },
      { id: 'm6', japanese: '処方箋をください。', reading: 'しょほうせんをください。', meaning_zh: '请给我开处方。' },
      { id: 'm7', japanese: 'この薬の飲み方を教えてください。', reading: 'このくすりののみかたをおしえてください。', meaning_zh: '请告诉我这个药怎么服用。' },
      { id: 'm8', japanese: '救急車を呼んでください！', reading: 'きゅうきゅうしゃをよんでください！', meaning_zh: '请叫救护车！', tip: '紧急情况' },
      { id: 'm9', japanese: 'アレルギーがあります。', reading: 'アレルギーがあります。', meaning_zh: '我有过敏症。' },
      { id: 'm10', japanese: '日本語がよくわかりません。', reading: 'にほんごがよくわかりません。', meaning_zh: '我不太懂日语。', tip: '就医时说明语言障碍' },
    ],
  },
  {
    id: 'directions',
    icon: '🗺️',
    name_zh: '问路',
    name_jp: '道案内',
    color: 'from-violet-500 to-purple-600',
    phrases: [
      { id: 'd1', japanese: '○○はどこですか？', reading: '○○はどこですか？', meaning_zh: '○○在哪里？' },
      { id: 'd2', japanese: '○○まで歩いて何分ですか？', reading: '○○まであるいてなんぷんですか？', meaning_zh: '步行到○○要几分钟？' },
      { id: 'd3', japanese: 'この地図で現在地を教えてください。', reading: 'このちずでげんざいちをおしえてください。', meaning_zh: '请在地图上告诉我现在的位置。' },
      { id: 'd4', japanese: '右に曲がってください。', reading: 'みぎにまがってください。', meaning_zh: '请向右转。' },
      { id: 'd5', japanese: '左に曲がってください。', reading: 'ひだりにまがってください。', meaning_zh: '请向左转。' },
      { id: 'd6', japanese: 'まっすぐ行ってください。', reading: 'まっすぐいってください。', meaning_zh: '请直走。' },
      { id: 'd7', japanese: '近くにコンビニはありますか？', reading: 'ちかくにコンビニはありますか？', meaning_zh: '附近有便利店吗？' },
      { id: 'd8', japanese: '道に迷いました。', reading: 'みちにまよいました。', meaning_zh: '我迷路了。' },
      { id: 'd9', japanese: 'もう一度言ってもらえますか？', reading: 'もういちどいってもらえますか？', meaning_zh: '可以再说一遍吗？' },
      { id: 'd10', japanese: 'ゆっくり話してください。', reading: 'ゆっくりはなしてください。', meaning_zh: '请说慢一点。' },
    ],
  },
]
