'use client'

import { useState } from 'react'
import { Volume2 } from 'lucide-react'

function speakJa(text: string) {
  if (typeof window === 'undefined' || !window.speechSynthesis) return
  window.speechSynthesis.cancel()
  const u = new SpeechSynthesisUtterance(text)
  u.lang = 'ja-JP'
  u.rate = 0.85
  window.speechSynthesis.speak(u)
}

type KanaCell = {
  kana: string
  romaji: string
  example: string
  exampleMeaning: string
} | null

type KanaRow = {
  label: string
  cells: KanaCell[]
}

type KanaSection = {
  id: string
  title: string
  subtitle: string
  columns: string[]
  rows: KanaRow[]
}

// ── 平假名 ────────────────────────────────────────────────
const HIRAGANA_SEION: KanaSection = {
  id: 'seion',
  title: '清音',
  subtitle: 'せいおん · 基本50音',
  columns: ['a', 'i', 'u', 'e', 'o'],
  rows: [
    { label: '∅', cells: [
      { kana: 'あ', romaji: 'a',  example: 'あお',   exampleMeaning: '蓝色' },
      { kana: 'い', romaji: 'i',  example: 'いぬ',   exampleMeaning: '狗' },
      { kana: 'う', romaji: 'u',  example: 'うみ',   exampleMeaning: '大海' },
      { kana: 'え', romaji: 'e',  example: 'えき',   exampleMeaning: '车站' },
      { kana: 'お', romaji: 'o',  example: 'おかし', exampleMeaning: '零食' },
    ]},
    { label: 'k', cells: [
      { kana: 'か', romaji: 'ka',  example: 'かさ',    exampleMeaning: '雨伞' },
      { kana: 'き', romaji: 'ki',  example: 'きって',  exampleMeaning: '邮票' },
      { kana: 'く', romaji: 'ku',  example: 'くも',    exampleMeaning: '云' },
      { kana: 'け', romaji: 'ke',  example: 'けいたい',exampleMeaning: '手机' },
      { kana: 'こ', romaji: 'ko',  example: 'こども',  exampleMeaning: '小孩' },
    ]},
    { label: 's', cells: [
      { kana: 'さ', romaji: 'sa',  example: 'さかな', exampleMeaning: '鱼' },
      { kana: 'し', romaji: 'shi', example: 'しろ',   exampleMeaning: '白色' },
      { kana: 'す', romaji: 'su',  example: 'すし',   exampleMeaning: '寿司' },
      { kana: 'せ', romaji: 'se',  example: 'せんせい',exampleMeaning: '老师' },
      { kana: 'そ', romaji: 'so',  example: 'そら',   exampleMeaning: '天空' },
    ]},
    { label: 't', cells: [
      { kana: 'た', romaji: 'ta',  example: 'たまご', exampleMeaning: '鸡蛋' },
      { kana: 'ち', romaji: 'chi', example: 'ちず',   exampleMeaning: '地图' },
      { kana: 'つ', romaji: 'tsu', example: 'つき',   exampleMeaning: '月亮' },
      { kana: 'て', romaji: 'te',  example: 'てがみ', exampleMeaning: '信件' },
      { kana: 'と', romaji: 'to',  example: 'とり',   exampleMeaning: '鸟' },
    ]},
    { label: 'n', cells: [
      { kana: 'な', romaji: 'na', example: 'なまえ', exampleMeaning: '名字' },
      { kana: 'に', romaji: 'ni', example: 'にわ',   exampleMeaning: '庭院' },
      { kana: 'ぬ', romaji: 'nu', example: 'ぬの',   exampleMeaning: '布' },
      { kana: 'ね', romaji: 'ne', example: 'ねこ',   exampleMeaning: '猫' },
      { kana: 'の', romaji: 'no', example: 'のり',   exampleMeaning: '海苔' },
    ]},
    { label: 'h', cells: [
      { kana: 'は', romaji: 'ha', example: 'はな', exampleMeaning: '花' },
      { kana: 'ひ', romaji: 'hi', example: 'ひと', exampleMeaning: '人' },
      { kana: 'ふ', romaji: 'fu', example: 'ふね', exampleMeaning: '船' },
      { kana: 'へ', romaji: 'he', example: 'へや', exampleMeaning: '房间' },
      { kana: 'ほ', romaji: 'ho', example: 'ほし', exampleMeaning: '星星' },
    ]},
    { label: 'm', cells: [
      { kana: 'ま', romaji: 'ma', example: 'まち',   exampleMeaning: '城市' },
      { kana: 'み', romaji: 'mi', example: 'みず',   exampleMeaning: '水' },
      { kana: 'む', romaji: 'mu', example: 'むし',   exampleMeaning: '虫子' },
      { kana: 'め', romaji: 'me', example: 'めがね', exampleMeaning: '眼镜' },
      { kana: 'も', romaji: 'mo', example: 'もり',   exampleMeaning: '森林' },
    ]},
    { label: 'y', cells: [
      { kana: 'や', romaji: 'ya', example: 'やま', exampleMeaning: '山' },
      null,
      { kana: 'ゆ', romaji: 'yu', example: 'ゆき', exampleMeaning: '雪' },
      null,
      { kana: 'よ', romaji: 'yo', example: 'よる', exampleMeaning: '夜晚' },
    ]},
    { label: 'r', cells: [
      { kana: 'ら', romaji: 'ra', example: 'らいねん',   exampleMeaning: '明年' },
      { kana: 'り', romaji: 'ri', example: 'りんご',     exampleMeaning: '苹果' },
      { kana: 'る', romaji: 'ru', example: 'るすばん',   exampleMeaning: '看家' },
      { kana: 'れ', romaji: 're', example: 'れいぞうこ', exampleMeaning: '冰箱' },
      { kana: 'ろ', romaji: 'ro', example: 'ろうそく',   exampleMeaning: '蜡烛' },
    ]},
    { label: 'w', cells: [
      { kana: 'わ', romaji: 'wa', example: 'わたし', exampleMeaning: '我' },
      null, null, null,
      { kana: 'を', romaji: 'wo', example: 'を',     exampleMeaning: '宾格助词' },
    ]},
    { label: 'n', cells: [
      { kana: 'ん', romaji: 'n', example: 'ほん', exampleMeaning: '书' },
      null, null, null, null,
    ]},
  ],
}

const HIRAGANA_DAKUTEN: KanaSection = {
  id: 'dakuten',
  title: '濁音・半濁音',
  subtitle: 'だくおん・はんだくおん',
  columns: ['a', 'i', 'u', 'e', 'o'],
  rows: [
    { label: 'g', cells: [
      { kana: 'が', romaji: 'ga', example: 'がくせい', exampleMeaning: '学生' },
      { kana: 'ぎ', romaji: 'gi', example: 'ぎんこう', exampleMeaning: '银行' },
      { kana: 'ぐ', romaji: 'gu', example: 'ぐあい',   exampleMeaning: '状态' },
      { kana: 'げ', romaji: 'ge', example: 'げんき',   exampleMeaning: '精神好' },
      { kana: 'ご', romaji: 'go', example: 'ごはん',   exampleMeaning: '米饭' },
    ]},
    { label: 'z', cells: [
      { kana: 'ざ', romaji: 'za',  example: 'ざっし',  exampleMeaning: '杂志' },
      { kana: 'じ', romaji: 'ji',  example: 'じかん',  exampleMeaning: '时间' },
      { kana: 'ず', romaji: 'zu',  example: 'ずっと',  exampleMeaning: '一直' },
      { kana: 'ぜ', romaji: 'ze',  example: 'ぜんぶ',  exampleMeaning: '全部' },
      { kana: 'ぞ', romaji: 'zo',  example: 'ぞうきん',exampleMeaning: '抹布' },
    ]},
    { label: 'd', cells: [
      { kana: 'だ', romaji: 'da',  example: 'だいがく', exampleMeaning: '大学' },
      { kana: 'ぢ', romaji: 'di',  example: 'はなぢ',   exampleMeaning: '流鼻血' },
      { kana: 'づ', romaji: 'du',  example: 'つづく',   exampleMeaning: '继续' },
      { kana: 'で', romaji: 'de',  example: 'でんしゃ', exampleMeaning: '电车' },
      { kana: 'ど', romaji: 'do',  example: 'どうぞ',   exampleMeaning: '请' },
    ]},
    { label: 'b', cells: [
      { kana: 'ば', romaji: 'ba', example: 'ばしょ',   exampleMeaning: '场所' },
      { kana: 'び', romaji: 'bi', example: 'びょうき', exampleMeaning: '生病' },
      { kana: 'ぶ', romaji: 'bu', example: 'ぶたにく', exampleMeaning: '猪肉' },
      { kana: 'べ', romaji: 'be', example: 'べんきょう',exampleMeaning: '学习' },
      { kana: 'ぼ', romaji: 'bo', example: 'ぼうし',   exampleMeaning: '帽子' },
    ]},
    { label: 'p', cells: [
      { kana: 'ぱ', romaji: 'pa', example: 'ぱん',     exampleMeaning: '面包' },
      { kana: 'ぴ', romaji: 'pi', example: 'ぴかぴか', exampleMeaning: '闪亮亮' },
      { kana: 'ぷ', romaji: 'pu', example: 'てんぷら', exampleMeaning: '天妇罗' },
      { kana: 'ぺ', romaji: 'pe', example: 'いっぺん', exampleMeaning: '一次' },
      { kana: 'ぽ', romaji: 'po', example: 'ほっぽう', exampleMeaning: '北方' },
    ]},
  ],
}

const HIRAGANA_YOUON: KanaSection = {
  id: 'youon',
  title: '拗音',
  subtitle: 'ようおん · 组合音',
  columns: ['ya', 'yu', 'yo'],
  rows: [
    { label: 'k', cells: [
      { kana: 'きゃ', romaji: 'kya', example: 'きゃく',   exampleMeaning: '客人' },
      { kana: 'きゅ', romaji: 'kyu', example: 'きゅうり', exampleMeaning: '黄瓜' },
      { kana: 'きょ', romaji: 'kyo', example: 'きょねん', exampleMeaning: '去年' },
    ]},
    { label: 's', cells: [
      { kana: 'しゃ', romaji: 'sha', example: 'しゃしん', exampleMeaning: '照片' },
      { kana: 'しゅ', romaji: 'shu', example: 'しゅうまつ',exampleMeaning: '周末' },
      { kana: 'しょ', romaji: 'sho', example: 'しょくじ', exampleMeaning: '吃饭' },
    ]},
    { label: 'ch', cells: [
      { kana: 'ちゃ', romaji: 'cha', example: 'おちゃ',   exampleMeaning: '茶' },
      { kana: 'ちゅ', romaji: 'chu', example: 'ちゅうごく',exampleMeaning: '中国' },
      { kana: 'ちょ', romaji: 'cho', example: 'ちょっと', exampleMeaning: '稍微' },
    ]},
    { label: 'n', cells: [
      { kana: 'にゃ', romaji: 'nya', example: 'にゃんこ', exampleMeaning: '小猫' },
      { kana: 'にゅ', romaji: 'nyu', example: 'にゅうがく',exampleMeaning: '入学' },
      { kana: 'にょ', romaji: 'nyo', example: 'にょろ',   exampleMeaning: '蜿蜒状' },
    ]},
    { label: 'h', cells: [
      { kana: 'ひゃ', romaji: 'hya', example: 'ひゃく',   exampleMeaning: '一百' },
      { kana: 'ひゅ', romaji: 'hyu', example: 'ひゅうひゅう',exampleMeaning: '风声呼呼' },
      { kana: 'ひょ', romaji: 'hyo', example: 'ひょう',   exampleMeaning: '冰雹' },
    ]},
    { label: 'm', cells: [
      { kana: 'みゃ', romaji: 'mya', example: 'みゃく',   exampleMeaning: '脉搏' },
      { kana: 'みゅ', romaji: 'myu', example: 'みゅーじっく',exampleMeaning: '音乐(借) ' },
      { kana: 'みょ', romaji: 'myo', example: 'みょうじ', exampleMeaning: '姓氏' },
    ]},
    { label: 'r', cells: [
      { kana: 'りゃ', romaji: 'rya', example: 'りゃくご', exampleMeaning: '缩写' },
      { kana: 'りゅ', romaji: 'ryu', example: 'りゅうがく',exampleMeaning: '留学' },
      { kana: 'りょ', romaji: 'ryo', example: 'りょこう', exampleMeaning: '旅行' },
    ]},
    { label: 'g', cells: [
      { kana: 'ぎゃ', romaji: 'gya', example: 'ぎゃく',   exampleMeaning: '相反' },
      { kana: 'ぎゅ', romaji: 'gyu', example: 'ぎゅうにく',exampleMeaning: '牛肉' },
      { kana: 'ぎょ', romaji: 'gyo', example: 'ぎょうざ', exampleMeaning: '饺子' },
    ]},
    { label: 'j', cells: [
      { kana: 'じゃ', romaji: 'ja',  example: 'じゃがいも',exampleMeaning: '土豆' },
      { kana: 'じゅ', romaji: 'ju',  example: 'じゅうしょ',exampleMeaning: '地址' },
      { kana: 'じょ', romaji: 'jo',  example: 'じょうず', exampleMeaning: '擅长' },
    ]},
    { label: 'b', cells: [
      { kana: 'びゃ', romaji: 'bya', example: 'びゃく',   exampleMeaning: '白色(旧)' },
      { kana: 'びゅ', romaji: 'byu', example: 'びゅうびゅう',exampleMeaning: '呼呼风声' },
      { kana: 'びょ', romaji: 'byo', example: 'びょういん',exampleMeaning: '医院' },
    ]},
    { label: 'p', cells: [
      { kana: 'ぴゃ', romaji: 'pya', example: 'ぴゃ',     exampleMeaning: '(感叹词)' },
      { kana: 'ぴゅ', romaji: 'pyu', example: 'ぴゅっと', exampleMeaning: '急速地' },
      { kana: 'ぴょ', romaji: 'pyo', example: 'ぴょんぴょん',exampleMeaning: '蹦蹦跳' },
    ]},
  ],
}

// ── 片假名 ────────────────────────────────────────────────
const KATAKANA_SEION: KanaSection = {
  id: 'seion',
  title: '清音',
  subtitle: 'せいおん · 基本50音',
  columns: ['a', 'i', 'u', 'e', 'o'],
  rows: [
    { label: '∅', cells: [
      { kana: 'ア', romaji: 'a',  example: 'アイス',   exampleMeaning: '冰淇淋' },
      { kana: 'イ', romaji: 'i',  example: 'イメージ', exampleMeaning: '印象' },
      { kana: 'ウ', romaji: 'u',  example: 'ウイルス', exampleMeaning: '病毒' },
      { kana: 'エ', romaji: 'e',  example: 'エレベーター',exampleMeaning: '电梯' },
      { kana: 'オ', romaji: 'o',  example: 'オレンジ', exampleMeaning: '橙子' },
    ]},
    { label: 'k', cells: [
      { kana: 'カ', romaji: 'ka', example: 'カメラ',   exampleMeaning: '相机' },
      { kana: 'キ', romaji: 'ki', example: 'キー',     exampleMeaning: '钥匙' },
      { kana: 'ク', romaji: 'ku', example: 'クラス',   exampleMeaning: '班级' },
      { kana: 'ケ', romaji: 'ke', example: 'ケーキ',   exampleMeaning: '蛋糕' },
      { kana: 'コ', romaji: 'ko', example: 'コーヒー', exampleMeaning: '咖啡' },
    ]},
    { label: 's', cells: [
      { kana: 'サ', romaji: 'sa',  example: 'サラダ',  exampleMeaning: '沙拉' },
      { kana: 'シ', romaji: 'shi', example: 'シャツ',  exampleMeaning: '衬衫' },
      { kana: 'ス', romaji: 'su',  example: 'スープ',  exampleMeaning: '汤' },
      { kana: 'セ', romaji: 'se',  example: 'セーター',exampleMeaning: '毛衣' },
      { kana: 'ソ', romaji: 'so',  example: 'ソファ',  exampleMeaning: '沙发' },
    ]},
    { label: 't', cells: [
      { kana: 'タ', romaji: 'ta',  example: 'タクシー', exampleMeaning: '出租车' },
      { kana: 'チ', romaji: 'chi', example: 'チーズ',   exampleMeaning: '奶酪' },
      { kana: 'ツ', romaji: 'tsu', example: 'ツアー',   exampleMeaning: '旅游团' },
      { kana: 'テ', romaji: 'te',  example: 'テスト',   exampleMeaning: '考试' },
      { kana: 'ト', romaji: 'to',  example: 'トマト',   exampleMeaning: '番茄' },
    ]},
    { label: 'n', cells: [
      { kana: 'ナ', romaji: 'na', example: 'ナイフ',   exampleMeaning: '刀' },
      { kana: 'ニ', romaji: 'ni', example: 'ニュース', exampleMeaning: '新闻' },
      { kana: 'ヌ', romaji: 'nu', example: 'ヌードル', exampleMeaning: '面条' },
      { kana: 'ネ', romaji: 'ne', example: 'ネクタイ', exampleMeaning: '领带' },
      { kana: 'ノ', romaji: 'no', example: 'ノート',   exampleMeaning: '笔记本' },
    ]},
    { label: 'h', cells: [
      { kana: 'ハ', romaji: 'ha', example: 'ハム',     exampleMeaning: '火腿' },
      { kana: 'ヒ', romaji: 'hi', example: 'ヒーター', exampleMeaning: '暖气' },
      { kana: 'フ', romaji: 'fu', example: 'フォーク', exampleMeaning: '叉子' },
      { kana: 'ヘ', romaji: 'he', example: 'ヘルメット',exampleMeaning: '头盔' },
      { kana: 'ホ', romaji: 'ho', example: 'ホテル',   exampleMeaning: '酒店' },
    ]},
    { label: 'm', cells: [
      { kana: 'マ', romaji: 'ma', example: 'マップ',   exampleMeaning: '地图' },
      { kana: 'ミ', romaji: 'mi', example: 'ミルク',   exampleMeaning: '牛奶' },
      { kana: 'ム', romaji: 'mu', example: 'ムード',   exampleMeaning: '气氛' },
      { kana: 'メ', romaji: 'me', example: 'メニュー', exampleMeaning: '菜单' },
      { kana: 'モ', romaji: 'mo', example: 'モデル',   exampleMeaning: '模特' },
    ]},
    { label: 'y', cells: [
      { kana: 'ヤ', romaji: 'ya', example: 'ヤード',     exampleMeaning: '码(单位)' },
      null,
      { kana: 'ユ', romaji: 'yu', example: 'ユニフォーム',exampleMeaning: '制服' },
      null,
      { kana: 'ヨ', romaji: 'yo', example: 'ヨーグルト',  exampleMeaning: '酸奶' },
    ]},
    { label: 'r', cells: [
      { kana: 'ラ', romaji: 'ra', example: 'ラジオ',   exampleMeaning: '收音机' },
      { kana: 'リ', romaji: 'ri', example: 'リモコン', exampleMeaning: '遥控器' },
      { kana: 'ル', romaji: 'ru', example: 'ルール',   exampleMeaning: '规则' },
      { kana: 'レ', romaji: 're', example: 'レストラン',exampleMeaning: '餐厅' },
      { kana: 'ロ', romaji: 'ro', example: 'ロボット', exampleMeaning: '机器人' },
    ]},
    { label: 'w', cells: [
      { kana: 'ワ', romaji: 'wa', example: 'ワイン', exampleMeaning: '葡萄酒' },
      null, null, null,
      { kana: 'ヲ', romaji: 'wo', example: 'ヲ',     exampleMeaning: '宾格助词' },
    ]},
    { label: 'n', cells: [
      { kana: 'ン', romaji: 'n', example: 'パン', exampleMeaning: '面包' },
      null, null, null, null,
    ]},
  ],
}

const KATAKANA_DAKUTEN: KanaSection = {
  id: 'dakuten',
  title: '濁音・半濁音',
  subtitle: 'だくおん・はんだくおん',
  columns: ['a', 'i', 'u', 'e', 'o'],
  rows: [
    { label: 'g', cells: [
      { kana: 'ガ', romaji: 'ga', example: 'ガイド',   exampleMeaning: '向导' },
      { kana: 'ギ', romaji: 'gi', example: 'ギター',   exampleMeaning: '吉他' },
      { kana: 'グ', romaji: 'gu', example: 'グラス',   exampleMeaning: '玻璃杯' },
      { kana: 'ゲ', romaji: 'ge', example: 'ゲーム',   exampleMeaning: '游戏' },
      { kana: 'ゴ', romaji: 'go', example: 'ゴール',   exampleMeaning: '终点' },
    ]},
    { label: 'z', cells: [
      { kana: 'ザ', romaji: 'za',  example: 'ザッハトルテ',exampleMeaning: '萨赫蛋糕' },
      { kana: 'ジ', romaji: 'ji',  example: 'ジュース', exampleMeaning: '果汁' },
      { kana: 'ズ', romaji: 'zu',  example: 'ズボン',   exampleMeaning: '裤子' },
      { kana: 'ゼ', romaji: 'ze',  example: 'ゼロ',     exampleMeaning: '零' },
      { kana: 'ゾ', romaji: 'zo',  example: 'ゾーン',   exampleMeaning: '区域' },
    ]},
    { label: 'd', cells: [
      { kana: 'ダ', romaji: 'da',  example: 'ダンス',   exampleMeaning: '舞蹈' },
      { kana: 'ヂ', romaji: 'di',  example: 'ヂ',       exampleMeaning: '(罕用)' },
      { kana: 'ヅ', romaji: 'du',  example: 'ヅ',       exampleMeaning: '(罕用)' },
      { kana: 'デ', romaji: 'de',  example: 'デート',   exampleMeaning: '约会' },
      { kana: 'ド', romaji: 'do',  example: 'ドア',     exampleMeaning: '门' },
    ]},
    { label: 'b', cells: [
      { kana: 'バ', romaji: 'ba', example: 'バス',   exampleMeaning: '公交车' },
      { kana: 'ビ', romaji: 'bi', example: 'ビール', exampleMeaning: '啤酒' },
      { kana: 'ブ', romaji: 'bu', example: 'ブーツ', exampleMeaning: '靴子' },
      { kana: 'ベ', romaji: 'be', example: 'ベッド', exampleMeaning: '床' },
      { kana: 'ボ', romaji: 'bo', example: 'ボール', exampleMeaning: '球' },
    ]},
    { label: 'p', cells: [
      { kana: 'パ', romaji: 'pa', example: 'パスポート',exampleMeaning: '护照' },
      { kana: 'ピ', romaji: 'pi', example: 'ピアノ',   exampleMeaning: '钢琴' },
      { kana: 'プ', romaji: 'pu', example: 'プール',   exampleMeaning: '游泳池' },
      { kana: 'ペ', romaji: 'pe', example: 'ペン',     exampleMeaning: '钢笔' },
      { kana: 'ポ', romaji: 'po', example: 'ポスト',   exampleMeaning: '邮箱' },
    ]},
  ],
}

const KATAKANA_YOUON: KanaSection = {
  id: 'youon',
  title: '拗音',
  subtitle: 'ようおん · 组合音',
  columns: ['ya', 'yu', 'yo'],
  rows: [
    { label: 'k', cells: [
      { kana: 'キャ', romaji: 'kya', example: 'キャンプ',   exampleMeaning: '露营' },
      { kana: 'キュ', romaji: 'kyu', example: 'キュート',   exampleMeaning: '可爱' },
      { kana: 'キョ', romaji: 'kyo', example: 'キョロキョロ',exampleMeaning: '东张西望' },
    ]},
    { label: 's', cells: [
      { kana: 'シャ', romaji: 'sha', example: 'シャワー',  exampleMeaning: '淋浴' },
      { kana: 'シュ', romaji: 'shu', example: 'シュート',  exampleMeaning: '射门' },
      { kana: 'ショ', romaji: 'sho', example: 'ショップ',  exampleMeaning: '商店' },
    ]},
    { label: 'ch', cells: [
      { kana: 'チャ', romaji: 'cha', example: 'チャンス',   exampleMeaning: '机会' },
      { kana: 'チュ', romaji: 'chu', example: 'チューリップ',exampleMeaning: '郁金香' },
      { kana: 'チョ', romaji: 'cho', example: 'チョコ',     exampleMeaning: '巧克力' },
    ]},
    { label: 'n', cells: [
      { kana: 'ニャ', romaji: 'nya', example: 'ニャー',   exampleMeaning: '猫叫声' },
      { kana: 'ニュ', romaji: 'nyu', example: 'ニュース', exampleMeaning: '新闻' },
      { kana: 'ニョ', romaji: 'nyo', example: 'ニョッキ', exampleMeaning: '意面疙瘩' },
    ]},
    { label: 'h', cells: [
      { kana: 'ヒャ', romaji: 'hya', example: 'ヒャッハー',exampleMeaning: '欢呼声' },
      { kana: 'ヒュ', romaji: 'hyu', example: 'ヒュー',   exampleMeaning: '风声' },
      { kana: 'ヒョ', romaji: 'hyo', example: 'ヒョウ',   exampleMeaning: '豹' },
    ]},
    { label: 'm', cells: [
      { kana: 'ミャ', romaji: 'mya', example: 'ミャンマー',exampleMeaning: '缅甸' },
      { kana: 'ミュ', romaji: 'myu', example: 'ミュージック',exampleMeaning: '音乐' },
      { kana: 'ミョ', romaji: 'myo', example: 'ミョウバン',exampleMeaning: '明矾' },
    ]},
    { label: 'r', cells: [
      { kana: 'リャ', romaji: 'rya', example: 'リャマ',   exampleMeaning: '羊驼' },
      { kana: 'リュ', romaji: 'ryu', example: 'リュック', exampleMeaning: '背包' },
      { kana: 'リョ', romaji: 'ryo', example: 'リョーマ', exampleMeaning: '龙马(名)' },
    ]},
    { label: 'g', cells: [
      { kana: 'ギャ', romaji: 'gya', example: 'ギャップ',  exampleMeaning: '落差' },
      { kana: 'ギュ', romaji: 'gyu', example: 'ギュッと',  exampleMeaning: '紧紧地' },
      { kana: 'ギョ', romaji: 'gyo', example: 'ギョーザ',  exampleMeaning: '饺子' },
    ]},
    { label: 'j', cells: [
      { kana: 'ジャ', romaji: 'ja',  example: 'ジャズ',   exampleMeaning: '爵士乐' },
      { kana: 'ジュ', romaji: 'ju',  example: 'ジュース', exampleMeaning: '果汁' },
      { kana: 'ジョ', romaji: 'jo',  example: 'ジョギング',exampleMeaning: '慢跑' },
    ]},
    { label: 'b', cells: [
      { kana: 'ビャ', romaji: 'bya', example: 'ビャッコ', exampleMeaning: '白虎' },
      { kana: 'ビュ', romaji: 'byu', example: 'ビュッフェ',exampleMeaning: '自助餐' },
      { kana: 'ビョ', romaji: 'byo', example: 'ビョーン', exampleMeaning: '弹开声' },
    ]},
    { label: 'p', cells: [
      { kana: 'ピャ', romaji: 'pya', example: 'ピャ',     exampleMeaning: '(感叹)' },
      { kana: 'ピュ', romaji: 'pyu', example: 'ピュア',   exampleMeaning: '纯粹' },
      { kana: 'ピョ', romaji: 'pyo', example: 'ピョン',   exampleMeaning: '跳跃声' },
    ]},
  ],
}

const HIRAGANA_SECTIONS = [HIRAGANA_SEION, HIRAGANA_DAKUTEN, HIRAGANA_YOUON]
const KATAKANA_SECTIONS = [KATAKANA_SEION, KATAKANA_DAKUTEN, KATAKANA_YOUON]

type SelectedCell = { sectionId: string; rowIndex: number; colIndex: number; data: KanaCell }

function KanaGrid({
  section,
  selected,
  onSelect,
}: {
  section: KanaSection
  selected: SelectedCell | null
  onSelect: (s: SelectedCell | null) => void
}) {
  const colCount = section.columns.length + 1

  return (
    <div className="mb-5">
      <div className="flex items-baseline gap-2 mb-2 px-1">
        <h2 className="text-sm font-bold text-stone-700">{section.title}</h2>
        <span className="text-xs text-stone-400">{section.subtitle}</span>
      </div>
      <div className="bg-white rounded-2xl shadow-sm border border-stone-100 overflow-hidden">
        {/* Column headers */}
        <div className={`grid border-b border-stone-100`} style={{ gridTemplateColumns: `repeat(${colCount}, minmax(0, 1fr))` }}>
          <div className="py-2 flex items-center justify-center">
            <span className="text-xs text-stone-300 font-medium">—</span>
          </div>
          {section.columns.map(v => (
            <div key={v} className="py-2 flex items-center justify-center border-l border-stone-100">
              <span className="text-xs font-bold text-stone-400 uppercase tracking-widest">{v}</span>
            </div>
          ))}
        </div>
        {/* Rows */}
        {section.rows.map((row, rowIndex) => (
          <div
            key={rowIndex}
            className="border-b border-stone-100 last:border-b-0"
            style={{ display: 'grid', gridTemplateColumns: `repeat(${colCount}, minmax(0, 1fr))` }}
          >
            <div className="flex items-center justify-center py-1 bg-stone-50">
              <span className="text-xs font-bold text-stone-400 uppercase">{row.label}</span>
            </div>
            {row.cells.map((cell, colIndex) => {
              const isSel = selected?.sectionId === section.id && selected.rowIndex === rowIndex && selected.colIndex === colIndex
              return (
                <div
                  key={colIndex}
                  onClick={() => {
                    if (!cell) return
                    if (isSel) { onSelect(null); return }
                    onSelect({ sectionId: section.id, rowIndex, colIndex, data: cell })
                    speakJa(cell.kana)
                  }}
                  className={`border-l border-stone-100 flex flex-col items-center justify-center py-2 px-1 transition-all duration-150 ${
                    cell ? (isSel ? 'bg-red-600 cursor-pointer shadow-sm scale-[1.05] z-10 relative' : 'cursor-pointer hover:bg-red-50 active:scale-[0.95] active:bg-red-50') : 'bg-stone-50/40'
                  }`}
                >
                  {cell ? (
                    <>
                      <span
                        className={`text-xl font-bold leading-none select-none transition-colors duration-150 ${isSel ? 'text-white' : 'text-stone-800'}`}
                        style={{ fontFamily: 'Noto Serif JP, serif' }}
                        translate="no"
                      >
                        {cell.kana}
                      </span>
                      <span className={`text-[9px] font-medium mt-1 tracking-wide ${isSel ? 'text-white/80' : 'text-stone-400'}`}>
                        {cell.romaji}
                      </span>
                    </>
                  ) : null}
                </div>
              )
            })}
          </div>
        ))}
      </div>
    </div>
  )
}

export default function GojuuonPage() {
  const [activeTab, setActiveTab] = useState<'hiragana' | 'katakana'>('hiragana')
  const [selected, setSelected] = useState<SelectedCell | null>(null)

  const sections = activeTab === 'hiragana' ? HIRAGANA_SECTIONS : KATAKANA_SECTIONS

  function handleTabChange(tab: 'hiragana' | 'katakana') {
    setActiveTab(tab)
    setSelected(null)
  }

  return (
    <div className="min-h-screen bg-[#F8F4ED] pb-24">
      {/* Header */}
      <div className="bg-white border-b border-stone-200 px-4 py-5 text-center shadow-sm">
        <h1 className="text-2xl font-bold text-stone-800" style={{ fontFamily: 'Noto Serif JP, serif' }} translate="no">
          五十音
        </h1>
        <p className="text-sm text-stone-500 mt-1">清音 · 濁音 · 拗音</p>
      </div>

      <div className="max-w-2xl mx-auto px-3 pt-5">
        {/* Tabs */}
        <div className="flex bg-stone-100 rounded-xl p-1 mb-5 gap-1">
          {(['hiragana', 'katakana'] as const).map(tab => (
            <button
              key={tab}
              onClick={() => handleTabChange(tab)}
              className={`flex-1 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200 ${
                activeTab === tab ? 'bg-white text-red-700 shadow-sm' : 'text-stone-500'
              }`}
            >
              <span translate="no" style={{ fontFamily: 'Noto Serif JP, serif' }}>
                {tab === 'hiragana' ? 'ひらがな' : 'カタカナ'}
              </span>
            </button>
          ))}
        </div>

        {/* Detail Panel */}
        {selected?.data && (
          <div className="bg-white rounded-2xl shadow-md border border-stone-100 mb-5 p-5 flex items-center gap-5">
            <button
              onClick={() => speakJa(selected.data!.kana)}
              className="text-5xl font-bold text-red-700 leading-none select-none w-16 text-center flex-shrink-0 active:opacity-60 transition-opacity"
              style={{ fontFamily: 'Noto Serif JP, serif' }}
              translate="no"
              aria-label="朗读假名"
            >
              {selected.data.kana}
            </button>
            <div className="flex-1 min-w-0">
              <div className="text-lg font-bold text-stone-700 mb-1 uppercase tracking-widest">
                {selected.data.romaji}
              </div>
              <div className="flex items-center gap-2 flex-wrap">
                <button
                  onClick={() => speakJa(selected.data!.example)}
                  className="text-base font-semibold text-stone-800 active:opacity-60 transition-opacity"
                  style={{ fontFamily: 'Noto Serif JP, serif' }}
                  translate="no"
                  aria-label="朗读例词"
                >
                  {selected.data.example}
                </button>
                <span className="text-sm text-stone-400">— {selected.data.exampleMeaning}</span>
                <button
                  onClick={() => speakJa(selected.data!.example)}
                  className="p-2 min-w-[36px] min-h-[36px] flex items-center justify-center text-stone-300 active:text-stone-600 transition-colors ml-auto"
                  aria-label="朗读例词"
                ><Volume2 size={14} /></button>
              </div>
            </div>
          </div>
        )}

        {/* Grids */}
        {sections.map(section => (
          <KanaGrid key={section.id} section={section} selected={selected} onSelect={setSelected} />
        ))}

        <p className="text-center text-xs text-stone-400 mt-2 mb-2">点击假名查看详情</p>
      </div>
    </div>
  )
}
