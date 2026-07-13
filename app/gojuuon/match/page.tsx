'use client'
import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { RefreshCw } from 'lucide-react'

type Mode = 'hira-kata' | 'hira-romaji' | 'kata-romaji'

const ALL_KANA = [
  { hiragana: 'あ', katakana: 'ア', romaji: 'a' },
  { hiragana: 'い', katakana: 'イ', romaji: 'i' },
  { hiragana: 'う', katakana: 'ウ', romaji: 'u' },
  { hiragana: 'え', katakana: 'エ', romaji: 'e' },
  { hiragana: 'お', katakana: 'オ', romaji: 'o' },
  { hiragana: 'か', katakana: 'カ', romaji: 'ka' },
  { hiragana: 'き', katakana: 'キ', romaji: 'ki' },
  { hiragana: 'く', katakana: 'ク', romaji: 'ku' },
  { hiragana: 'け', katakana: 'ケ', romaji: 'ke' },
  { hiragana: 'こ', katakana: 'コ', romaji: 'ko' },
  { hiragana: 'さ', katakana: 'サ', romaji: 'sa' },
  { hiragana: 'し', katakana: 'シ', romaji: 'shi' },
  { hiragana: 'す', katakana: 'ス', romaji: 'su' },
  { hiragana: 'せ', katakana: 'セ', romaji: 'se' },
  { hiragana: 'そ', katakana: 'ソ', romaji: 'so' },
  { hiragana: 'た', katakana: 'タ', romaji: 'ta' },
  { hiragana: 'ち', katakana: 'チ', romaji: 'chi' },
  { hiragana: 'つ', katakana: 'ツ', romaji: 'tsu' },
  { hiragana: 'て', katakana: 'テ', romaji: 'te' },
  { hiragana: 'と', katakana: 'ト', romaji: 'to' },
  { hiragana: 'な', katakana: 'ナ', romaji: 'na' },
  { hiragana: 'に', katakana: 'ニ', romaji: 'ni' },
  { hiragana: 'ぬ', katakana: 'ヌ', romaji: 'nu' },
  { hiragana: 'ね', katakana: 'ネ', romaji: 'ne' },
  { hiragana: 'の', katakana: 'ノ', romaji: 'no' },
  { hiragana: 'は', katakana: 'ハ', romaji: 'ha' },
  { hiragana: 'ひ', katakana: 'ヒ', romaji: 'hi' },
  { hiragana: 'ふ', katakana: 'フ', romaji: 'fu' },
  { hiragana: 'へ', katakana: 'ヘ', romaji: 'he' },
  { hiragana: 'ほ', katakana: 'ホ', romaji: 'ho' },
  { hiragana: 'ま', katakana: 'マ', romaji: 'ma' },
  { hiragana: 'み', katakana: 'ミ', romaji: 'mi' },
  { hiragana: 'む', katakana: 'ム', romaji: 'mu' },
  { hiragana: 'め', katakana: 'メ', romaji: 'me' },
  { hiragana: 'も', katakana: 'モ', romaji: 'mo' },
  { hiragana: 'や', katakana: 'ヤ', romaji: 'ya' },
  { hiragana: 'ゆ', katakana: 'ユ', romaji: 'yu' },
  { hiragana: 'よ', katakana: 'ヨ', romaji: 'yo' },
  { hiragana: 'ら', katakana: 'ラ', romaji: 'ra' },
  { hiragana: 'り', katakana: 'リ', romaji: 'ri' },
  { hiragana: 'る', katakana: 'ル', romaji: 'ru' },
  { hiragana: 'れ', katakana: 'レ', romaji: 're' },
  { hiragana: 'ろ', katakana: 'ロ', romaji: 'ro' },
  { hiragana: 'わ', katakana: 'ワ', romaji: 'wa' },
  { hiragana: 'を', katakana: 'ヲ', romaji: 'wo' },
  { hiragana: 'ん', katakana: 'ン', romaji: 'n' },
]

interface Card {
  id: string
  pairId: number
  text: string
  isKana: boolean
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

function buildCards(mode: Mode, count: number): Card[] {
  const pool = shuffle(ALL_KANA).slice(0, count)
  const cards: Card[] = []
  pool.forEach((k, idx) => {
    const [textA, textB, aIsKana, bIsKana] = mode === 'hira-kata'
      ? [k.hiragana, k.katakana, true, true]
      : mode === 'hira-romaji'
      ? [k.hiragana, k.romaji, true, false]
      : [k.katakana, k.romaji, true, false]
    cards.push({ id: `${idx}-a`, pairId: idx, text: textA, isKana: aIsKana })
    cards.push({ id: `${idx}-b`, pairId: idx, text: textB, isKana: bIsKana })
  })
  return shuffle(cards)
}

const PAIR_COUNT = 8

export default function GojuuonMatchPage() {
  const [mode, setMode] = useState<Mode | null>(null)
  const [cards, setCards] = useState<Card[]>([])
  const [matched, setMatched] = useState<Set<number>>(new Set())
  const [selected, setSelected] = useState<string | null>(null)
  const [wrong, setWrong] = useState<[string, string] | null>(null)
  const [moves, setMoves] = useState(0)
  const [done, setDone] = useState(false)

  const startGame = useCallback((m: Mode) => {
    setMode(m)
    setCards(buildCards(m, PAIR_COUNT))
    setMatched(new Set())
    setSelected(null)
    setWrong(null)
    setMoves(0)
    setDone(false)
  }, [])

  function handleSelect(card: Card) {
    if (matched.has(card.pairId)) return
    if (wrong) return
    if (selected === card.id) {
      setSelected(null)
      return
    }
    if (!selected) {
      setSelected(card.id)
      return
    }
    const selCard = cards.find(c => c.id === selected)!
    setMoves(m => m + 1)
    if (selCard.pairId === card.pairId) {
      const next = new Set(matched).add(card.pairId)
      setMatched(next)
      setSelected(null)
      if (next.size === PAIR_COUNT) setDone(true)
    } else {
      setWrong([selected, card.id])
      setTimeout(() => {
        setWrong(null)
        setSelected(null)
      }, 600)
    }
  }

  const MODE_LABELS: Record<Mode, string> = {
    'hira-kata': 'ひらがな ↔ カタカナ',
    'hira-romaji': 'ひらがな ↔ ローマ字',
    'kata-romaji': 'カタカナ ↔ ローマ字',
  }

  if (!mode) {
    return (
      <div className="min-h-screen bg-[#F8F4ED] px-4 pt-12 pb-24">
        <Link href="/gojuuon" className="text-stone-500 text-sm mb-6 flex items-center gap-1">← 返回五十音</Link>
        <h1 className="text-2xl font-bold text-stone-800 mb-1" style={{ fontFamily: 'Noto Serif JP, serif' }}>消消乐</h1>
        <p className="text-stone-500 text-sm mb-8">找到对应的假名配对，全部消除即胜！</p>
        <div className="space-y-3">
          {(['hira-kata', 'hira-romaji', 'kata-romaji'] as Mode[]).map(m => (
            <button
              key={m}
              onClick={() => startGame(m)}
              className="w-full bg-white rounded-2xl px-5 py-5 shadow-sm border border-stone-100 text-left flex items-center justify-between active:scale-98 transition-transform"
            >
              <div>
                <p className="font-bold text-stone-800 text-base" style={{ fontFamily: 'Noto Serif JP, serif' }}>
                  {MODE_LABELS[m]}
                </p>
                <p className="text-stone-400 text-xs mt-0.5">
                  {m === 'hira-kata' ? '平假名与片假名互配' : m === 'hira-romaji' ? '平假名与罗马音互配' : '片假名与罗马音互配'}
                </p>
              </div>
              <span className="text-stone-300 text-xl">→</span>
            </button>
          ))}
        </div>
      </div>
    )
  }

  if (done) {
    return (
      <div className="min-h-screen bg-[#F8F4ED] flex flex-col items-center justify-center px-4 pb-24">
        <div className="text-6xl mb-4">🎉</div>
        <h2 className="text-2xl font-bold text-stone-800 mb-2" style={{ fontFamily: 'Noto Serif JP, serif' }}>クリア！</h2>
        <p className="text-stone-500 mb-1">用了 <strong>{moves}</strong> 步完成</p>
        <p className="text-stone-400 text-sm mb-8">{PAIR_COUNT} 对全部消除</p>
        <div className="space-y-3 w-full max-w-xs">
          <button
            onClick={() => startGame(mode)}
            className="w-full bg-red-600 text-white rounded-2xl py-3.5 font-medium flex items-center justify-center gap-2"
          >
            <RefreshCw size={16} /> 再来一局
          </button>
          <button onClick={() => setMode(null)} className="w-full bg-stone-100 text-stone-700 rounded-2xl py-3.5 font-medium">
            换模式
          </button>
        </div>
      </div>
    )
  }

  const cols = 4
  return (
    <div className="min-h-screen bg-[#F8F4ED] pb-24">
      <div className="bg-white border-b border-stone-200 px-4 py-4 flex items-center justify-between shadow-sm">
        <button onClick={() => setMode(null)} className="text-stone-400 text-sm">✕</button>
        <div className="text-center">
          <p className="text-sm font-semibold text-stone-700" style={{ fontFamily: 'Noto Serif JP, serif' }}>
            {MODE_LABELS[mode]}
          </p>
          <p className="text-xs text-stone-400">{matched.size}/{PAIR_COUNT} 对 · {moves} 步</p>
        </div>
        <button onClick={() => startGame(mode)} className="text-stone-400">
          <RefreshCw size={16} />
        </button>
      </div>

      <div className="px-4 pt-5">
        {/* progress bar */}
        <div className="h-1.5 bg-stone-200 rounded-full mb-5 overflow-hidden">
          <div
            className="h-full bg-red-500 rounded-full transition-all duration-500"
            style={{ width: `${(matched.size / PAIR_COUNT) * 100}%` }}
          />
        </div>

        <div
          className="grid gap-3"
          style={{ gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))` }}
        >
          {cards.map(card => {
            const isMatched = matched.has(card.pairId)
            const isSel = selected === card.id
            const isWrong = wrong?.includes(card.id)
            return (
              <button
                key={card.id}
                onClick={() => handleSelect(card)}
                disabled={isMatched}
                className={`
                  aspect-square rounded-2xl flex items-center justify-center text-xl font-bold
                  transition-all duration-200 active:scale-95 border
                  ${isMatched
                    ? 'bg-emerald-50 border-emerald-200 text-emerald-300 scale-95'
                    : isWrong
                    ? 'bg-red-100 border-red-300 text-red-600 scale-95'
                    : isSel
                    ? 'bg-red-600 border-red-600 text-white shadow-lg scale-105'
                    : 'bg-white border-stone-100 text-stone-800 shadow-sm'}
                `}
                style={{ fontFamily: card.isKana ? 'Noto Serif JP, serif' : undefined }}
                translate="no"
              >
                {isMatched ? '✓' : card.text}
              </button>
            )
          })}
        </div>

        <p className="text-center text-xs text-stone-400 mt-6">点击两张卡片进行配对</p>
      </div>
    </div>
  )
}
