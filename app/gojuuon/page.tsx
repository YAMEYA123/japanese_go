'use client';

import { useState } from 'react';

type KanaCell = {
  kana: string;
  romaji: string;
  example: string;
  exampleMeaning: string;
} | null;

type KanaRow = {
  consonant: string;
  cells: KanaCell[];
};

const VOWELS = ['a', 'i', 'u', 'e', 'o'];

const HIRAGANA_ROWS: KanaRow[] = [
  {
    consonant: '∅',
    cells: [
      { kana: 'あ', romaji: 'a', example: 'あお', exampleMeaning: 'blue' },
      { kana: 'い', romaji: 'i', example: 'いぬ', exampleMeaning: 'dog' },
      { kana: 'う', romaji: 'u', example: 'うみ', exampleMeaning: 'sea' },
      { kana: 'え', romaji: 'e', example: 'えき', exampleMeaning: 'station' },
      { kana: 'お', romaji: 'o', example: 'おかし', exampleMeaning: 'snack' },
    ],
  },
  {
    consonant: 'k',
    cells: [
      { kana: 'か', romaji: 'ka', example: 'かさ', exampleMeaning: 'umbrella' },
      { kana: 'き', romaji: 'ki', example: 'きって', exampleMeaning: 'stamp' },
      { kana: 'く', romaji: 'ku', example: 'くも', exampleMeaning: 'cloud' },
      { kana: 'け', romaji: 'ke', example: 'けいたい', exampleMeaning: 'mobile phone' },
      { kana: 'こ', romaji: 'ko', example: 'こども', exampleMeaning: 'child' },
    ],
  },
  {
    consonant: 's',
    cells: [
      { kana: 'さ', romaji: 'sa', example: 'さかな', exampleMeaning: 'fish' },
      { kana: 'し', romaji: 'shi', example: 'しろ', exampleMeaning: 'white' },
      { kana: 'す', romaji: 'su', example: 'すし', exampleMeaning: 'sushi' },
      { kana: 'せ', romaji: 'se', example: 'せんせい', exampleMeaning: 'teacher' },
      { kana: 'そ', romaji: 'so', example: 'そら', exampleMeaning: 'sky' },
    ],
  },
  {
    consonant: 't',
    cells: [
      { kana: 'た', romaji: 'ta', example: 'たまご', exampleMeaning: 'egg' },
      { kana: 'ち', romaji: 'chi', example: 'ちず', exampleMeaning: 'map' },
      { kana: 'つ', romaji: 'tsu', example: 'つき', exampleMeaning: 'moon' },
      { kana: 'て', romaji: 'te', example: 'てがみ', exampleMeaning: 'letter' },
      { kana: 'と', romaji: 'to', example: 'とり', exampleMeaning: 'bird' },
    ],
  },
  {
    consonant: 'n',
    cells: [
      { kana: 'な', romaji: 'na', example: 'なまえ', exampleMeaning: 'name' },
      { kana: 'に', romaji: 'ni', example: 'にわ', exampleMeaning: 'garden' },
      { kana: 'ぬ', romaji: 'nu', example: 'ぬの', exampleMeaning: 'cloth' },
      { kana: 'ね', romaji: 'ne', example: 'ねこ', exampleMeaning: 'cat' },
      { kana: 'の', romaji: 'no', example: 'のり', exampleMeaning: 'seaweed' },
    ],
  },
  {
    consonant: 'h',
    cells: [
      { kana: 'は', romaji: 'ha', example: 'はな', exampleMeaning: 'flower' },
      { kana: 'ひ', romaji: 'hi', example: 'ひと', exampleMeaning: 'person' },
      { kana: 'ふ', romaji: 'fu', example: 'ふね', exampleMeaning: 'ship' },
      { kana: 'へ', romaji: 'he', example: 'へや', exampleMeaning: 'room' },
      { kana: 'ほ', romaji: 'ho', example: 'ほし', exampleMeaning: 'star' },
    ],
  },
  {
    consonant: 'm',
    cells: [
      { kana: 'ま', romaji: 'ma', example: 'まち', exampleMeaning: 'town' },
      { kana: 'み', romaji: 'mi', example: 'みず', exampleMeaning: 'water' },
      { kana: 'む', romaji: 'mu', example: 'むし', exampleMeaning: 'insect' },
      { kana: 'め', romaji: 'me', example: 'めだか', exampleMeaning: 'killifish' },
      { kana: 'も', romaji: 'mo', example: 'もり', exampleMeaning: 'forest' },
    ],
  },
  {
    consonant: 'y',
    cells: [
      { kana: 'や', romaji: 'ya', example: 'やま', exampleMeaning: 'mountain' },
      null,
      { kana: 'ゆ', romaji: 'yu', example: 'ゆき', exampleMeaning: 'snow' },
      null,
      { kana: 'よ', romaji: 'yo', example: 'よる', exampleMeaning: 'night' },
    ],
  },
  {
    consonant: 'r',
    cells: [
      { kana: 'ら', romaji: 'ra', example: 'らいねん', exampleMeaning: 'next year' },
      { kana: 'り', romaji: 'ri', example: 'りんご', exampleMeaning: 'apple' },
      { kana: 'る', romaji: 'ru', example: 'るすばん', exampleMeaning: 'house-sitting' },
      { kana: 'れ', romaji: 're', example: 'れいぞうこ', exampleMeaning: 'refrigerator' },
      { kana: 'ろ', romaji: 'ro', example: 'ろうそく', exampleMeaning: 'candle' },
    ],
  },
  {
    consonant: 'w',
    cells: [
      { kana: 'わ', romaji: 'wa', example: 'わたし', exampleMeaning: 'I / me' },
      null,
      null,
      null,
      { kana: 'を', romaji: 'wo', example: 'を (particle)', exampleMeaning: 'object marker' },
    ],
  },
  {
    consonant: 'n',
    cells: [
      { kana: 'ん', romaji: 'n', example: 'ほん', exampleMeaning: 'book' },
      null,
      null,
      null,
      null,
    ],
  },
];

const KATAKANA_ROWS: KanaRow[] = [
  {
    consonant: '∅',
    cells: [
      { kana: 'ア', romaji: 'a', example: 'アイス', exampleMeaning: 'ice cream' },
      { kana: 'イ', romaji: 'i', example: 'イヌ', exampleMeaning: 'dog' },
      { kana: 'ウ', romaji: 'u', example: 'ウミ', exampleMeaning: 'sea' },
      { kana: 'エ', romaji: 'e', example: 'エキ', exampleMeaning: 'station' },
      { kana: 'オ', romaji: 'o', example: 'オレンジ', exampleMeaning: 'orange' },
    ],
  },
  {
    consonant: 'k',
    cells: [
      { kana: 'カ', romaji: 'ka', example: 'カメラ', exampleMeaning: 'camera' },
      { kana: 'キ', romaji: 'ki', example: 'キー', exampleMeaning: 'key' },
      { kana: 'ク', romaji: 'ku', example: 'クラス', exampleMeaning: 'class' },
      { kana: 'ケ', romaji: 'ke', example: 'ケーキ', exampleMeaning: 'cake' },
      { kana: 'コ', romaji: 'ko', example: 'コーヒー', exampleMeaning: 'coffee' },
    ],
  },
  {
    consonant: 's',
    cells: [
      { kana: 'サ', romaji: 'sa', example: 'サラダ', exampleMeaning: 'salad' },
      { kana: 'シ', romaji: 'shi', example: 'シャツ', exampleMeaning: 'shirt' },
      { kana: 'ス', romaji: 'su', example: 'スープ', exampleMeaning: 'soup' },
      { kana: 'セ', romaji: 'se', example: 'セーター', exampleMeaning: 'sweater' },
      { kana: 'ソ', romaji: 'so', example: 'ソファ', exampleMeaning: 'sofa' },
    ],
  },
  {
    consonant: 't',
    cells: [
      { kana: 'タ', romaji: 'ta', example: 'タクシー', exampleMeaning: 'taxi' },
      { kana: 'チ', romaji: 'chi', example: 'チーズ', exampleMeaning: 'cheese' },
      { kana: 'ツ', romaji: 'tsu', example: 'ツアー', exampleMeaning: 'tour' },
      { kana: 'テ', romaji: 'te', example: 'テスト', exampleMeaning: 'test' },
      { kana: 'ト', romaji: 'to', example: 'トマト', exampleMeaning: 'tomato' },
    ],
  },
  {
    consonant: 'n',
    cells: [
      { kana: 'ナ', romaji: 'na', example: 'ナイフ', exampleMeaning: 'knife' },
      { kana: 'ニ', romaji: 'ni', example: 'ニュース', exampleMeaning: 'news' },
      { kana: 'ヌ', romaji: 'nu', example: 'ヌードル', exampleMeaning: 'noodle' },
      { kana: 'ネ', romaji: 'ne', example: 'ネクタイ', exampleMeaning: 'necktie' },
      { kana: 'ノ', romaji: 'no', example: 'ノート', exampleMeaning: 'notebook' },
    ],
  },
  {
    consonant: 'h',
    cells: [
      { kana: 'ハ', romaji: 'ha', example: 'ハム', exampleMeaning: 'ham' },
      { kana: 'ヒ', romaji: 'hi', example: 'ヒーター', exampleMeaning: 'heater' },
      { kana: 'フ', romaji: 'fu', example: 'フォーク', exampleMeaning: 'fork' },
      { kana: 'ヘ', romaji: 'he', example: 'ヘルメット', exampleMeaning: 'helmet' },
      { kana: 'ホ', romaji: 'ho', example: 'ホテル', exampleMeaning: 'hotel' },
    ],
  },
  {
    consonant: 'm',
    cells: [
      { kana: 'マ', romaji: 'ma', example: 'マップ', exampleMeaning: 'map' },
      { kana: 'ミ', romaji: 'mi', example: 'ミルク', exampleMeaning: 'milk' },
      { kana: 'ム', romaji: 'mu', example: 'ムード', exampleMeaning: 'mood' },
      { kana: 'メ', romaji: 'me', example: 'メニュー', exampleMeaning: 'menu' },
      { kana: 'モ', romaji: 'mo', example: 'モデル', exampleMeaning: 'model' },
    ],
  },
  {
    consonant: 'y',
    cells: [
      { kana: 'ヤ', romaji: 'ya', example: 'ヤード', exampleMeaning: 'yard' },
      null,
      { kana: 'ユ', romaji: 'yu', example: 'ユニフォーム', exampleMeaning: 'uniform' },
      null,
      { kana: 'ヨ', romaji: 'yo', example: 'ヨーグルト', exampleMeaning: 'yogurt' },
    ],
  },
  {
    consonant: 'r',
    cells: [
      { kana: 'ラ', romaji: 'ra', example: 'ラジオ', exampleMeaning: 'radio' },
      { kana: 'リ', romaji: 'ri', example: 'リモコン', exampleMeaning: 'remote control' },
      { kana: 'ル', romaji: 'ru', example: 'ルール', exampleMeaning: 'rule' },
      { kana: 'レ', romaji: 're', example: 'レストラン', exampleMeaning: 'restaurant' },
      { kana: 'ロ', romaji: 'ro', example: 'ロボット', exampleMeaning: 'robot' },
    ],
  },
  {
    consonant: 'w',
    cells: [
      { kana: 'ワ', romaji: 'wa', example: 'ワイン', exampleMeaning: 'wine' },
      null,
      null,
      null,
      { kana: 'ヲ', romaji: 'wo', example: 'ヲ (particle)', exampleMeaning: 'object marker' },
    ],
  },
  {
    consonant: 'n',
    cells: [
      { kana: 'ン', romaji: 'n', example: 'パン', exampleMeaning: 'bread' },
      null,
      null,
      null,
      null,
    ],
  },
];

type SelectedCell = {
  rowIndex: number;
  colIndex: number;
  data: KanaCell;
};

export default function GojuuonPage() {
  const [activeTab, setActiveTab] = useState<'hiragana' | 'katakana'>('hiragana');
  const [selected, setSelected] = useState<SelectedCell | null>(null);

  const rows = activeTab === 'hiragana' ? HIRAGANA_ROWS : KATAKANA_ROWS;

  const handleCellClick = (rowIndex: number, colIndex: number, cell: KanaCell) => {
    if (!cell) return;
    if (selected?.rowIndex === rowIndex && selected?.colIndex === colIndex) {
      setSelected(null);
    } else {
      setSelected({ rowIndex, colIndex, data: cell });
    }
  };

  const handleTabChange = (tab: 'hiragana' | 'katakana') => {
    setActiveTab(tab);
    setSelected(null);
  };

  return (
    <div className="min-h-screen bg-[#F8F4ED] pb-24">
      {/* Header */}
      <div className="bg-white border-b border-stone-200 px-4 py-5 text-center shadow-sm">
        <h1
          className="text-2xl font-bold text-stone-800"
          style={{ fontFamily: 'Noto Serif JP, serif' }}
          translate="no"
        >
          五十音
        </h1>
        <p className="text-sm text-stone-500 mt-1">ごじゅうおん · Gojuuon</p>
      </div>

      <div className="max-w-2xl mx-auto px-3 pt-5">
        {/* Tabs */}
        <div className="flex bg-stone-100 rounded-xl p-1 mb-5 gap-1">
          <button
            onClick={() => handleTabChange('hiragana')}
            className={`flex-1 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200 ${
              activeTab === 'hiragana'
                ? 'bg-white text-red-700 shadow-sm'
                : 'text-stone-500 hover:text-stone-700'
            }`}
          >
            <span translate="no" style={{ fontFamily: 'Noto Serif JP, serif' }}>
              ひらがな
            </span>
          </button>
          <button
            onClick={() => handleTabChange('katakana')}
            className={`flex-1 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200 ${
              activeTab === 'katakana'
                ? 'bg-white text-red-700 shadow-sm'
                : 'text-stone-500 hover:text-stone-700'
            }`}
          >
            <span translate="no" style={{ fontFamily: 'Noto Serif JP, serif' }}>
              カタカナ
            </span>
          </button>
        </div>

        {/* Detail Panel */}
        {selected && selected.data && (
          <div className="bg-white rounded-2xl shadow-md border border-stone-100 mb-5 p-5 flex items-center gap-5 animate-in fade-in duration-200">
            <div
              className="text-6xl font-bold text-red-700 leading-none select-none w-20 text-center flex-shrink-0"
              style={{ fontFamily: 'Noto Serif JP, serif' }}
              translate="no"
            >
              {selected.data.kana}
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-xl font-bold text-stone-700 mb-1 uppercase tracking-widest">
                {selected.data.romaji}
              </div>
              <div className="flex items-baseline gap-2 flex-wrap">
                <span
                  className="text-lg font-semibold text-stone-800"
                  style={{ fontFamily: 'Noto Serif JP, serif' }}
                  translate="no"
                >
                  {selected.data.example}
                </span>
                <span className="text-sm text-stone-400">— {selected.data.exampleMeaning}</span>
              </div>
            </div>
          </div>
        )}

        {/* Grid */}
        <div className="bg-white rounded-2xl shadow-sm border border-stone-100 overflow-hidden">
          {/* Column headers */}
          <div className="grid grid-cols-6 border-b border-stone-100">
            <div className="py-2 flex items-center justify-center">
              <span className="text-xs text-stone-300 font-medium uppercase tracking-widest">—</span>
            </div>
            {VOWELS.map((v) => (
              <div
                key={v}
                className="py-2 flex items-center justify-center border-l border-stone-100"
              >
                <span className="text-xs font-bold text-stone-400 uppercase tracking-widest">
                  {v}
                </span>
              </div>
            ))}
          </div>

          {/* Rows */}
          {rows.map((row, rowIndex) => (
            <div
              key={`${row.consonant}-${rowIndex}`}
              className="grid grid-cols-6 border-b border-stone-100 last:border-b-0"
            >
              {/* Consonant label */}
              <div className="flex items-center justify-center py-1 bg-stone-50">
                <span className="text-xs font-bold text-stone-400 uppercase tracking-widest">
                  {row.consonant}
                </span>
              </div>

              {/* Kana cells */}
              {row.cells.map((cell, colIndex) => {
                const isSelected =
                  selected?.rowIndex === rowIndex && selected?.colIndex === colIndex;
                return (
                  <div
                    key={colIndex}
                    onClick={() => handleCellClick(rowIndex, colIndex, cell)}
                    className={`border-l border-stone-100 flex flex-col items-center justify-center py-2 px-1 transition-all duration-150 ${
                      cell
                        ? isSelected
                          ? 'bg-red-50 cursor-pointer'
                          : 'cursor-pointer hover:bg-stone-50 active:bg-red-50'
                        : 'bg-stone-50/40'
                    }`}
                  >
                    {cell ? (
                      <>
                        <span
                          className={`text-xl sm:text-2xl font-bold leading-none select-none transition-colors duration-150 ${
                            isSelected ? 'text-red-700' : 'text-stone-800'
                          }`}
                          style={{ fontFamily: 'Noto Serif JP, serif' }}
                          translate="no"
                        >
                          {cell.kana}
                        </span>
                        <span
                          className={`text-[9px] sm:text-[10px] font-medium mt-1 tracking-wide transition-colors duration-150 ${
                            isSelected ? 'text-red-500' : 'text-stone-400'
                          }`}
                        >
                          {cell.romaji}
                        </span>
                      </>
                    ) : null}
                  </div>
                );
              })}
            </div>
          ))}
        </div>

        {/* Hint text */}
        <p className="text-center text-xs text-stone-400 mt-4 mb-2">
          Tap a character to see details
        </p>
      </div>
    </div>
  );
}
