'use client'
import { Suspense, useState } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { useAppStore } from '@/lib/store'
import { WORDS, getAllWords } from '@/lib/data/words'
import { getDueCards, getNewCards } from '@/lib/srs'
import EtymologyCard from '@/components/EtymologyCard'
import { Word, ReviewQuality } from '@/lib/types'

type Mode = '1min' | '5min' | '10min' | null

function PracticeContent() {
  const router = useRouter()
  const params = useSearchParams()
  const initialMode = (params.get('mode') as Mode) ?? null
  const [mode, setMode] = useState<Mode>(initialMode)
  const [sessionWords, setSessionWords] = useState<Word[]>([])
  const [index, setIndex] = useState(0)
  const [done, setDone] = useState(false)
  const [reviewed, setReviewed] = useState(0)
  const { srsCards, reviewWord } = useAppStore()

  function startSession(m: Mode) {
    const allIds = getAllWords().map(w => w.id)
    const due = getDueCards(srsCards).map(c => c.word_id)
    const newIds = getNewCards(srsCards, allIds)

    let picked: Word[] = []
    if (m === '1min') {
      const id = due[0] ?? newIds[0] ?? allIds[0]
      picked = [WORDS.find(w => w.id === id)!].filter(Boolean)
    } else if (m === '5min') {
      const pool = [...due, ...newIds].slice(0, 3)
      picked = pool.map(id => WORDS.find(w => w.id === id)!).filter(Boolean)
      if (picked.length < 3) {
        const extra = allIds.filter(id => !pool.includes(id)).slice(0, 3 - picked.length)
        picked = [...picked, ...extra.map(id => WORDS.find(w => w.id === id)!).filter(Boolean)]
      }
    } else {
      const pool = [...due, ...newIds.slice(0, 5)]
      picked = pool.map(id => WORDS.find(w => w.id === id)!).filter(Boolean)
      if (picked.length === 0) picked = WORDS.slice(0, 5)
    }

    setSessionWords(picked)
    setIndex(0)
    setDone(false)
    setReviewed(0)
    setMode(m)
  }

  function handleReview(quality: ReviewQuality) {
    const word = sessionWords[index]
    reviewWord(word.id, quality)
    setReviewed(r => r + 1)
    if (index + 1 >= sessionWords.length) {
      setDone(true)
    } else {
      setIndex(i => i + 1)
    }
  }

  // Mode selector
  if (!mode) {
    return (
      <div className="px-4 pt-8">
        <h1 className="text-2xl font-bold text-stone-900 mb-1" style={{ fontFamily: 'Noto Serif JP, serif' }}>
          練習
        </h1>
        <p className="text-stone-500 text-sm mb-6">选择今天有多少时间</p>
        <div className="space-y-3">
          {([
            { m: '1min' as Mode, emoji: '⚡', label: '1分钟', sub: '浏览一张词源卡，轻松完成', color: 'from-yellow-50 to-orange-50 border-orange-100' },
            { m: '5min' as Mode, emoji: '📖', label: '5分钟', sub: '3个词，场景填空练习', color: 'from-blue-50 to-indigo-50 border-blue-100' },
            { m: '10min' as Mode, emoji: '🎯', label: '10分钟', sub: '全部到期词条，系统复习', color: 'from-emerald-50 to-teal-50 border-emerald-100' },
          ]).map(item => (
            <button
              key={item.m!}
              onClick={() => startSession(item.m)}
              className={`w-full bg-gradient-to-br ${item.color} border rounded-2xl px-5 py-4 flex items-center gap-4 active:scale-98 transition-transform`}
            >
              <span className="text-3xl">{item.emoji}</span>
              <div className="text-left">
                <p className="font-bold text-stone-800">{item.label}</p>
                <p className="text-stone-500 text-sm">{item.sub}</p>
              </div>
              <span className="ml-auto text-stone-300 text-xl">→</span>
            </button>
          ))}
        </div>
      </div>
    )
  }

  // Done screen
  if (done) {
    return (
      <div className="px-4 pt-16 text-center">
        <div className="text-6xl mb-4">🎉</div>
        <h2 className="text-2xl font-bold text-stone-900 mb-2" style={{ fontFamily: 'Noto Serif JP, serif' }}>
          お疲れ様！
        </h2>
        <p className="text-stone-600 mb-1">本次学习了 <strong>{reviewed}</strong> 个词</p>
        <p className="text-stone-400 text-sm mb-8">坚持每天练习，记忆更牢固</p>
        <div className="space-y-3">
          <button
            onClick={() => startSession(mode)}
            className="w-full bg-red-600 text-white rounded-2xl py-3.5 font-medium active:bg-red-700 transition-colors"
          >
            再来一组
          </button>
          <button
            onClick={() => { setMode(null); router.push('/') }}
            className="w-full bg-stone-100 text-stone-700 rounded-2xl py-3.5 font-medium"
          >
            回到首页
          </button>
        </div>
      </div>
    )
  }

  const currentWord = sessionWords[index]
  if (!currentWord) return null

  return (
    <div className="px-4 pt-6">
      {/* Progress */}
      <div className="flex items-center justify-between mb-4">
        <button onClick={() => setMode(null)} className="text-stone-400 text-sm">✕</button>
        <div className="flex gap-1.5">
          {sessionWords.map((_, i) => (
            <div
              key={i}
              className={`h-1.5 rounded-full transition-all ${
                i < index ? 'bg-red-500 w-6' : i === index ? 'bg-red-300 w-6' : 'bg-stone-200 w-4'
              }`}
            />
          ))}
        </div>
        <span className="text-stone-400 text-sm">{index + 1}/{sessionWords.length}</span>
      </div>

      <EtymologyCard
        word={currentWord}
        onReview={handleReview}
        showReviewButtons={true}
        compact={mode === '1min'}
      />
    </div>
  )
}

export default function PracticePage() {
  return (
    <Suspense>
      <PracticeContent />
    </Suspense>
  )
}
