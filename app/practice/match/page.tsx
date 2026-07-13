'use client'
import { useState, useCallback } from 'react'
import Link from 'next/link'
import { RefreshCw } from 'lucide-react'
import { getAllWords } from '@/lib/data/words'
import { useAppStore } from '@/lib/store'
import { Word } from '@/lib/types'

const PAIR_COUNT = 6

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

function speakJa(text: string) {
  if (typeof window === 'undefined' || !window.speechSynthesis) return
  window.speechSynthesis.cancel()
  const u = new SpeechSynthesisUtterance(text)
  u.lang = 'ja-JP'
  u.rate = 0.85
  window.speechSynthesis.speak(u)
}

function pickWords(selectedDramaIds: string[]): Word[] {
  const all = getAllWords()
  const pool = selectedDramaIds.length > 0
    ? all.filter(w => w.drama_id && selectedDramaIds.includes(w.drama_id))
    : all
  const source = pool.length >= PAIR_COUNT ? pool : all
  return shuffle(source).slice(0, PAIR_COUNT)
}

export default function WordMatchPage() {
  const selectedDramaIds = useAppStore(s => s.selectedDramaIds)
  const [words, setWords] = useState<Word[]>(() => pickWords(selectedDramaIds))
  const [rightOrder, setRightOrder] = useState<Word[]>(() => shuffle([...words]))
  const [selectedLeft, setSelectedLeft] = useState<string | null>(null)
  const [matched, setMatched] = useState<Set<string>>(new Set())
  const [wrong, setWrong] = useState<string | null>(null)
  const [errors, setErrors] = useState(0)
  const [done, setDone] = useState(false)

  const restart = useCallback(() => {
    const w = pickWords(selectedDramaIds)
    setWords(w)
    setRightOrder(shuffle([...w]))
    setSelectedLeft(null)
    setMatched(new Set())
    setWrong(null)
    setErrors(0)
    setDone(false)
  }, [selectedDramaIds])

  function handleLeft(id: string) {
    if (matched.has(id) || wrong) return
    setSelectedLeft(id === selectedLeft ? null : id)
    speakJa(words.find(w => w.id === id)?.reading ?? '')
  }

  function handleRight(id: string) {
    if (matched.has(id) || wrong) return
    if (!selectedLeft) return
    if (selectedLeft === id) {
      const next = new Set(matched).add(id)
      setMatched(next)
      setSelectedLeft(null)
      if (next.size === PAIR_COUNT) setDone(true)
    } else {
      setErrors(e => e + 1)
      setWrong(id)
      setTimeout(() => {
        setWrong(null)
        setSelectedLeft(null)
      }, 500)
    }
  }

  if (done) {
    const perfect = errors === 0
    return (
      <div className="min-h-screen bg-[#F8F4ED] flex flex-col items-center justify-center px-4 pb-24">
        <div className="text-6xl mb-4">{perfect ? '🌟' : '🎉'}</div>
        <h2 className="text-2xl font-bold text-stone-800 mb-2" style={{ fontFamily: 'Noto Serif JP, serif' }}>
          {perfect ? '満点！' : 'クリア！'}
        </h2>
        <p className="text-stone-500 mb-1">
          {PAIR_COUNT} 对全部配对完成
        </p>
        <p className="text-stone-400 text-sm mb-8">
          {perfect ? '零失误，太厉害了！' : `失误 ${errors} 次`}
        </p>
        <div className="space-y-3 w-full max-w-xs">
          <button
            onClick={restart}
            className="w-full bg-red-600 text-white rounded-2xl py-3.5 font-medium flex items-center justify-center gap-2"
          >
            <RefreshCw size={16} /> 换一组词
          </button>
          <Link href="/practice" className="block w-full bg-stone-100 text-stone-700 rounded-2xl py-3.5 font-medium text-center">
            返回练习
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#F8F4ED] pb-24">
      <div className="bg-white border-b border-stone-200 px-4 py-4 flex items-center justify-between shadow-sm">
        <Link href="/practice" className="text-stone-400 text-sm">✕</Link>
        <div className="text-center">
          <p className="text-sm font-semibold text-stone-700">词汇连连看</p>
          <p className="text-xs text-stone-400">{matched.size}/{PAIR_COUNT} 已配对 · 失误 {errors}</p>
        </div>
        <button onClick={restart} className="text-stone-400">
          <RefreshCw size={16} />
        </button>
      </div>

      <div className="px-4 pt-5">
        {/* progress */}
        <div className="h-1.5 bg-stone-200 rounded-full mb-5 overflow-hidden">
          <div
            className="h-full bg-red-500 rounded-full transition-all duration-500"
            style={{ width: `${(matched.size / PAIR_COUNT) * 100}%` }}
          />
        </div>

        <p className="text-xs text-stone-400 text-center mb-4">先选左边的读音，再点右边的意思配对</p>

        <div className="grid grid-cols-2 gap-3">
          {/* Left column: Japanese readings */}
          <div className="space-y-2">
            {words.map(word => {
              const isMatched = matched.has(word.id)
              const isSel = selectedLeft === word.id
              return (
                <button
                  key={word.id}
                  onClick={() => handleLeft(word.id)}
                  disabled={isMatched}
                  className={`
                    w-full rounded-2xl px-3 py-3.5 text-center transition-all duration-150 active:scale-95 border
                    ${isMatched
                      ? 'bg-emerald-50 border-emerald-200 text-emerald-400'
                      : isSel
                      ? 'bg-red-600 border-red-600 text-white shadow-md scale-[1.02]'
                      : 'bg-white border-stone-100 text-stone-800 shadow-sm'}
                  `}
                >
                  <span
                    className="block text-lg font-bold leading-tight"
                    style={{ fontFamily: 'Noto Serif JP, serif' }}
                    translate="no"
                  >
                    {isMatched ? '✓' : word.reading}
                  </span>
                  {!isMatched && word.japanese !== word.reading && (
                    <span className="block text-xs text-stone-300 mt-0.5" translate="no">
                      {isSel ? word.japanese : word.japanese}
                    </span>
                  )}
                </button>
              )
            })}
          </div>

          {/* Right column: Chinese meanings (shuffled) */}
          <div className="space-y-2">
            {rightOrder.map(word => {
              const isMatched = matched.has(word.id)
              const isWrongSel = wrong === word.id
              return (
                <button
                  key={word.id}
                  onClick={() => handleRight(word.id)}
                  disabled={isMatched}
                  className={`
                    w-full rounded-2xl px-3 py-3.5 text-center transition-all duration-150 active:scale-95 border
                    ${isMatched
                      ? 'bg-emerald-50 border-emerald-200 text-emerald-400'
                      : isWrongSel
                      ? 'bg-red-100 border-red-300 text-red-600 scale-95'
                      : selectedLeft
                      ? 'bg-white border-stone-200 text-stone-700 shadow-sm cursor-pointer'
                      : 'bg-white border-stone-100 text-stone-500 shadow-sm'}
                  `}
                >
                  <span className="block text-sm font-medium leading-snug">
                    {isMatched ? '✓' : word.meaning_zh}
                  </span>
                </button>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
