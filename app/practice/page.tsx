'use client'
import { Suspense, useState } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { useAppStore } from '@/lib/store'
import { WORDS, getAllWords } from '@/lib/data/words'
import { getDueCards, getNewCards } from '@/lib/srs'
import EtymologyCard from '@/components/EtymologyCard'
import { Word, ReviewQuality } from '@/lib/types'
import { toRomaji } from '@/lib/romaji'
import Link from 'next/link'

type Mode = '1min' | '5min' | '10min' | 'n2' | null

function speakJa(text: string) {
  if (typeof window === 'undefined' || !window.speechSynthesis) return
  window.speechSynthesis.cancel()
  const u = new SpeechSynthesisUtterance(text)
  u.lang = 'ja-JP'
  u.rate = 0.85
  window.speechSynthesis.speak(u)
}

function FlashCard({ word, onReview }: { word: Word; onReview: (q: ReviewQuality) => void }) {
  const [flipped, setFlipped] = useState(false)
  const showRomaji = useAppStore(s => s.showRomaji)

  function handleFlip() {
    if (!flipped) {
      setFlipped(true)
      // 翻转后自动朗读
      setTimeout(() => speakJa(word.reading || word.japanese), 300)
    }
  }

  return (
    <div className="space-y-4">
      {/* 正面：中文意思；反面：日语读音 */}
      <div
        onClick={handleFlip}
        className="bg-white rounded-3xl shadow-sm border border-stone-100 p-8 text-center cursor-pointer active:scale-98 transition-transform min-h-[240px] flex flex-col items-center justify-center"
      >
        {!flipped ? (
          <>
            <p className="text-xs text-stone-400 mb-5 uppercase tracking-wide">这个词的日语怎么说？</p>
            <p className="text-2xl font-bold text-stone-800 mb-2">{word.meaning_zh}</p>
            {word.scene_context && (
              <p className="text-stone-400 text-xs mt-3 leading-relaxed max-w-xs mx-auto line-clamp-2">
                {word.scene_context}
              </p>
            )}
            <div className="mt-6 text-stone-300 text-3xl">？</div>
          </>
        ) : (
          <>
            <p className="text-xs text-stone-400 mb-4 uppercase tracking-wide">日语读音</p>
            <div
              className="text-5xl font-bold text-stone-900 mb-3"
              style={{ fontFamily: 'Noto Serif JP, serif' }}
              translate="no"
            >
              {word.japanese}
            </div>
            <div className="flex items-baseline gap-2 justify-center mb-1">
              <span className="text-xl text-red-600 font-medium" translate="no">{word.reading}</span>
              <button
                onClick={e => { e.stopPropagation(); speakJa(word.reading || word.japanese) }}
                className="text-base opacity-60 active:opacity-30"
              >🔊</button>
            </div>
            {showRomaji && <span className="text-sm text-stone-400">{toRomaji(word.reading)}</span>}
          </>
        )}
      </div>

      {flipped ? (
        <div className="space-y-2">
          <p className="text-center text-xs text-stone-400 mb-1">读音记住了吗？</p>
          <div className="grid grid-cols-3 gap-2">
            {([
              { q: 1 as ReviewQuality, label: '没记住', color: 'bg-red-50 text-red-600 border-red-100' },
              { q: 3 as ReviewQuality, label: '有印象', color: 'bg-amber-50 text-amber-600 border-amber-100' },
              { q: 5 as ReviewQuality, label: '记住了！', color: 'bg-emerald-50 text-emerald-600 border-emerald-100' },
            ]).map(item => (
              <button
                key={item.q}
                onClick={() => { setFlipped(false); onReview(item.q) }}
                className={`border rounded-xl py-3 text-sm font-medium ${item.color} active:scale-95 transition-transform`}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>
      ) : (
        <button
          onClick={handleFlip}
          className="w-full bg-red-600 text-white rounded-2xl py-4 font-medium text-base active:bg-red-700 transition-colors"
        >
          翻转查看读音
        </button>
      )}
    </div>
  )
}

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
    if (m === 'n2') {
      const n2Words = WORDS.filter(w => w.jlpt_level === 'N2')
      const n2Due = n2Words.filter(w => due.includes(w.id))
      const n2New = n2Words.filter(w => !srsCards[w.id] || srsCards[w.id].repetitions === 0)
      picked = [...n2Due, ...n2New].slice(0, 10)
      if (picked.length === 0) picked = n2Words.slice(0, 10)
    } else if (m === '1min') {
      const id = due[0] ?? newIds[0] ?? allIds[0]
      picked = [WORDS.find(w => w.id === id)!].filter(Boolean)
    } else if (m === '5min') {
      const pool = [...due, ...newIds].slice(0, 5)
      picked = pool.map(id => WORDS.find(w => w.id === id)!).filter(Boolean)
      if (picked.length < 3) {
        const extra = allIds.filter(id => !pool.includes(id)).slice(0, 5 - picked.length)
        picked = [...picked, ...extra.map(id => WORDS.find(w => w.id === id)!).filter(Boolean)]
      }
    } else {
      const pool = [...due, ...newIds.slice(0, 10)]
      picked = pool.map(id => WORDS.find(w => w.id === id)!).filter(Boolean)
      if (picked.length === 0) picked = WORDS.slice(0, 10)
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

  if (!mode) {
    return (
      <div className="px-4 pt-8">
        <h1 className="text-2xl font-bold text-stone-900 mb-1" style={{ fontFamily: 'Noto Serif JP, serif' }}>
          練習
        </h1>
        <p className="text-stone-500 text-sm mb-6">选择今天有多少时间</p>
        <div className="space-y-3">
          {([
            { m: '1min' as Mode, emoji: '⚡', label: '1分钟', sub: '1张词卡：看词→翻转→评分', color: 'from-yellow-50 to-orange-50 border-orange-100' },
            { m: '5min' as Mode, emoji: '📖', label: '5分钟', sub: '5个词，翻卡式快速复习', color: 'from-blue-50 to-indigo-50 border-blue-100' },
            { m: '10min' as Mode, emoji: '🎯', label: '10分钟', sub: '所有到期词条 + 详细词源解析', color: 'from-emerald-50 to-teal-50 border-emerald-100' },
            { m: 'n2' as Mode, emoji: '📝', label: 'N2 翻卡', sub: 'N2词汇翻卡专项练习', color: 'from-violet-50 to-purple-50 border-purple-100' },
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
        <Link
          href="/n2-quiz"
          className="w-full bg-gradient-to-br from-red-50 to-rose-50 border border-red-100 rounded-2xl px-5 py-4 flex items-center gap-4 active:scale-98 transition-transform mt-1"
        >
          <span className="text-3xl">🎌</span>
          <div className="text-left">
            <p className="font-bold text-stone-800">N2 四択テスト</p>
            <p className="text-stone-500 text-sm">30道N2词义选择题</p>
          </div>
          <span className="ml-auto text-stone-300 text-xl">→</span>
        </Link>
      </div>
    )
  }

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
          <button onClick={() => startSession(mode)} className="w-full bg-red-600 text-white rounded-2xl py-3.5 font-medium active:bg-red-700 transition-colors">
            再来一组
          </button>
          <button onClick={() => { setMode(null); router.push('/') }} className="w-full bg-stone-100 text-stone-700 rounded-2xl py-3.5 font-medium">
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
      <div className="flex items-center justify-between mb-4">
        <button onClick={() => setMode(null)} className="text-stone-400 text-sm">✕</button>
        <div className="flex gap-1.5">
          {sessionWords.map((_, i) => (
            <div key={i} className={`h-1.5 rounded-full transition-all ${i < index ? 'bg-red-500 w-6' : i === index ? 'bg-red-300 w-6' : 'bg-stone-200 w-4'}`} />
          ))}
        </div>
        <span className="text-stone-400 text-sm">{index + 1}/{sessionWords.length}</span>
      </div>
      {mode === '10min' ? (
        <EtymologyCard word={currentWord} onReview={handleReview} showReviewButtons={true} compact={false} />
      ) : (
        <FlashCard word={currentWord} onReview={handleReview} />
      )}
      {mode === 'n2' && (
        <div className="mt-3 text-center">
          <span className="text-xs text-purple-400 bg-purple-50 px-2 py-1 rounded-full">N2 専項</span>
        </div>
      )}
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
