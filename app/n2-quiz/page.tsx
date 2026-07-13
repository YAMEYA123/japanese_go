'use client'

import { useState, useEffect, useCallback } from 'react'
import { getQuizzesByLevel, Quiz } from '@/lib/data/quizzes'
import { getGrammarQuizzes, GrammarQuiz } from '@/lib/data/n2-grammar'

function shuffleArray<T>(arr: T[]): T[] {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

type AnswerState = 'idle' | 'correct' | 'wrong'
type TabType = 'vocab' | 'grammar'

// ── Vocabulary Quiz ──────────────────────────────────────────────────────────

interface QuizWithShuffled extends Quiz {
  shuffledOptions: string[]
}

function VocabQuiz() {
  const [quizzes, setQuizzes] = useState<QuizWithShuffled[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [score, setScore] = useState(0)
  const [answerState, setAnswerState] = useState<AnswerState>('idle')
  const [selectedOption, setSelectedOption] = useState<string | null>(null)
  const [isFinished, setIsFinished] = useState(false)

  const init = useCallback(() => {
    const base = getQuizzesByLevel('N2')
    const shuffled = shuffleArray(base).map(q => ({
      ...q,
      shuffledOptions: shuffleArray(q.options),
    }))
    setQuizzes(shuffled)
    setCurrentIndex(0)
    setScore(0)
    setAnswerState('idle')
    setSelectedOption(null)
    setIsFinished(false)
  }, [])

  useEffect(() => { init() }, [init])

  const q = quizzes[currentIndex]
  const total = quizzes.length

  function handleAnswer(option: string) {
    if (answerState !== 'idle') return
    const correct = option === q.options[0]
    setSelectedOption(option)
    setAnswerState(correct ? 'correct' : 'wrong')
    if (correct) setScore(s => s + 1)
    setTimeout(() => {
      if (currentIndex + 1 >= total) {
        setIsFinished(true)
      } else {
        setCurrentIndex(i => i + 1)
        setAnswerState('idle')
        setSelectedOption(null)
      }
    }, 1500)
  }

  function optionStyle(option: string) {
    const base = 'w-full py-3 px-4 rounded-xl border-2 text-base font-medium transition-all duration-200 text-left'
    if (answerState === 'idle') return `${base} bg-white border-stone-200 text-stone-800 hover:border-red-400 hover:bg-red-50 active:scale-95`
    const isCorrect = option === q.options[0]
    const isSelected = option === selectedOption
    if (isCorrect) return `${base} bg-green-100 border-green-500 text-green-800`
    if (isSelected) return `${base} bg-red-100 border-red-500 text-red-800`
    return `${base} bg-white border-stone-200 text-stone-400`
  }

  function renderSentence(sentence: string) {
    const parts = sentence.split(/【|】/)
    return (
      <p className="text-xl leading-relaxed text-stone-800 font-serif" style={{ fontFamily: "'Noto Serif JP', serif" }} translate="no">
        {parts.map((part, i) =>
          i === 1 ? <span key={i} className="text-red-600 font-bold">{part}</span> : <span key={i}>{part}</span>
        )}
      </p>
    )
  }

  if (quizzes.length === 0) return <div className="flex-1 flex items-center justify-center"><p className="text-stone-400">読み込み中...</p></div>

  if (isFinished) {
    const pct = Math.round((score / total) * 100)
    return (
      <div className="flex-1 flex flex-col items-center justify-center px-4">
        <div className="bg-white rounded-3xl shadow-md p-8 w-full max-w-sm text-center">
          <div className="text-5xl font-bold text-red-600 mb-2" style={{ fontFamily: "'Noto Serif JP', serif" }} translate="no">{score}/{total}</div>
          <div className="text-xl text-stone-600 mb-1" style={{ fontFamily: "'Noto Serif JP', serif" }} translate="no">正解</div>
          <div className="text-stone-400 text-sm mb-6">正答率 {pct}%</div>
          <div className="w-full bg-stone-100 rounded-full h-3 mb-6">
            <div className="bg-red-500 h-3 rounded-full transition-all" style={{ width: `${pct}%` }} />
          </div>
          <button onClick={init} className="w-full py-3 rounded-xl bg-red-600 text-white font-semibold text-base hover:bg-red-700 active:scale-95 transition-all">
            もう一度挑戦する
          </button>
        </div>
      </div>
    )
  }

  const progressPct = (currentIndex / total) * 100

  return (
    <div className="flex-1 flex flex-col items-center px-4 py-6">
      <div className="w-full max-w-lg mb-5">
        <div className="flex items-center gap-3">
          <div className="flex-1 bg-stone-200 rounded-full h-2">
            <div className="bg-red-500 h-2 rounded-full transition-all duration-300" style={{ width: `${progressPct}%` }} />
          </div>
          <span className="text-xs text-stone-500 w-12 text-right shrink-0">{currentIndex + 1}/{total}</span>
        </div>
      </div>
      <div className="w-full max-w-lg bg-white rounded-3xl shadow-md p-6 flex flex-col gap-5">
        <div className="text-center">
          <span className="text-sm text-stone-400 bg-stone-50 border border-stone-200 rounded-full px-3 py-1" style={{ fontFamily: "'Noto Serif JP', serif" }} translate="no">
            {q.reading}
          </span>
        </div>
        <div className="text-center">
          <span className="text-4xl font-bold text-red-600" style={{ fontFamily: "'Noto Serif JP', serif" }} translate="no">{q.word}</span>
        </div>
        <div className="bg-stone-50 rounded-2xl px-5 py-4 border border-stone-100" translate="no">
          {renderSentence(q.sentence)}
        </div>
        <div className="grid grid-cols-2 gap-3 mt-1">
          {q.shuffledOptions.map((option, idx) => (
            <button key={`${q.id}-${idx}`} className={optionStyle(option)} onClick={() => handleAnswer(option)} disabled={answerState !== 'idle'}>
              <span className="text-xs text-stone-400 mr-1">{['A', 'B', 'C', 'D'][idx]}</span>
              {option}
            </button>
          ))}
        </div>
        {answerState !== 'idle' && (
          <div className={`text-center text-sm font-medium rounded-xl py-2 ${answerState === 'correct' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
            {answerState === 'correct' ? '正解！ ✓' : `不正解。正解は「${q.options[0]}」です。`}
          </div>
        )}
      </div>
      <div className="mt-4 text-stone-400 text-sm">現在のスコア: <span className="text-red-600 font-semibold">{score}</span> 正解</div>
    </div>
  )
}

// ── Grammar Quiz ──────────────────────────────────────────────────────────────

interface GrammarQuizWithShuffled extends GrammarQuiz {
  shuffledOptions: string[]
}

function GrammarQuizSection() {
  const [quizzes, setQuizzes] = useState<GrammarQuizWithShuffled[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [score, setScore] = useState(0)
  const [answerState, setAnswerState] = useState<AnswerState>('idle')
  const [selectedOption, setSelectedOption] = useState<string | null>(null)
  const [isFinished, setIsFinished] = useState(false)
  const [showExplanation, setShowExplanation] = useState(false)

  const init = useCallback(() => {
    const base = getGrammarQuizzes()
    const shuffled = shuffleArray(base).map(q => ({
      ...q,
      shuffledOptions: shuffleArray(q.options),
    }))
    setQuizzes(shuffled)
    setCurrentIndex(0)
    setScore(0)
    setAnswerState('idle')
    setSelectedOption(null)
    setIsFinished(false)
    setShowExplanation(false)
  }, [])

  useEffect(() => { init() }, [init])

  const q = quizzes[currentIndex]
  const total = quizzes.length

  function handleAnswer(option: string) {
    if (answerState !== 'idle') return
    const correct = option === q.options[0]
    setSelectedOption(option)
    setAnswerState(correct ? 'correct' : 'wrong')
    if (correct) setScore(s => s + 1)
    setShowExplanation(true)
  }

  function handleNext() {
    if (currentIndex + 1 >= total) {
      setIsFinished(true)
    } else {
      setCurrentIndex(i => i + 1)
      setAnswerState('idle')
      setSelectedOption(null)
      setShowExplanation(false)
    }
  }

  function optionStyle(option: string) {
    const base = 'w-full py-3 px-4 rounded-xl border-2 text-sm font-medium transition-all duration-200 text-left'
    if (answerState === 'idle') return `${base} bg-white border-stone-200 text-stone-800 hover:border-violet-400 hover:bg-violet-50 active:scale-95`
    const isCorrect = option === q.options[0]
    const isSelected = option === selectedOption
    if (isCorrect) return `${base} bg-green-100 border-green-500 text-green-800`
    if (isSelected) return `${base} bg-red-100 border-red-500 text-red-800`
    return `${base} bg-white border-stone-200 text-stone-400`
  }

  function renderSentence(sentence: string) {
    const parts = sentence.split(/【|】/)
    return (
      <p className="text-lg leading-relaxed text-stone-800" style={{ fontFamily: "'Noto Serif JP', serif" }} translate="no">
        {parts.map((part, i) =>
          i === 1 ? <span key={i} className="text-violet-600 font-bold border-b-2 border-violet-300">{part}</span> : <span key={i}>{part}</span>
        )}
      </p>
    )
  }

  if (quizzes.length === 0) return <div className="flex-1 flex items-center justify-center"><p className="text-stone-400">読み込み中...</p></div>

  if (isFinished) {
    const pct = Math.round((score / total) * 100)
    return (
      <div className="flex-1 flex flex-col items-center justify-center px-4">
        <div className="bg-white rounded-3xl shadow-md p-8 w-full max-w-sm text-center">
          <div className="text-5xl font-bold text-violet-600 mb-2" style={{ fontFamily: "'Noto Serif JP', serif" }}>{score}/{total}</div>
          <div className="text-xl text-stone-600 mb-1">文法クイズ完了</div>
          <div className="text-stone-400 text-sm mb-6">正答率 {pct}%</div>
          <div className="w-full bg-stone-100 rounded-full h-3 mb-6">
            <div className="bg-violet-500 h-3 rounded-full" style={{ width: `${pct}%` }} />
          </div>
          <button onClick={init} className="w-full py-3 rounded-xl bg-violet-600 text-white font-semibold text-base active:scale-95 transition-all">
            もう一度挑戦する
          </button>
        </div>
      </div>
    )
  }

  const progressPct = (currentIndex / total) * 100

  return (
    <div className="flex-1 flex flex-col items-center px-4 py-6">
      <div className="w-full max-w-lg mb-5">
        <div className="flex items-center gap-3">
          <div className="flex-1 bg-stone-200 rounded-full h-2">
            <div className="bg-violet-500 h-2 rounded-full transition-all duration-300" style={{ width: `${progressPct}%` }} />
          </div>
          <span className="text-xs text-stone-500 w-12 text-right shrink-0">{currentIndex + 1}/{total}</span>
        </div>
      </div>
      <div className="w-full max-w-lg bg-white rounded-3xl shadow-md p-6 flex flex-col gap-4">
        {/* Pattern */}
        <div className="flex items-center justify-between">
          <div>
            <span className="text-2xl font-bold text-violet-700" style={{ fontFamily: "'Noto Serif JP', serif" }} translate="no">
              {q.pattern}
            </span>
            <p className="text-stone-400 text-xs mt-0.5" translate="no">{q.pattern_reading}</p>
          </div>
          <span className="text-xs bg-violet-100 text-violet-600 px-2 py-1 rounded-full font-medium">N2文法</span>
        </div>

        {/* Sentence */}
        <div className="bg-stone-50 rounded-2xl px-5 py-4 border border-stone-100" translate="no">
          {renderSentence(q.sentence)}
          <p className="text-stone-400 text-xs mt-2">← 选出划线处正确的语法形式</p>
        </div>

        {/* Options */}
        <div className="flex flex-col gap-2.5">
          {q.shuffledOptions.map((option, idx) => (
            <button key={`${q.id}-${idx}`} className={optionStyle(option)} onClick={() => handleAnswer(option)} disabled={answerState !== 'idle'}>
              <span className="text-xs text-stone-400 mr-2">{['A', 'B', 'C', 'D'][idx]}</span>
              <span translate="no">{option}</span>
            </button>
          ))}
        </div>

        {/* Feedback + Explanation */}
        {answerState !== 'idle' && (
          <div className="space-y-2">
            <div className={`text-center text-sm font-medium rounded-xl py-2 ${answerState === 'correct' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
              {answerState === 'correct' ? '正解！ ✓' : `不正解。正解は「${q.options[0]}」です。`}
            </div>
            {showExplanation && (
              <div className="bg-violet-50 rounded-xl px-4 py-3 border border-violet-100">
                <p className="text-xs font-bold text-violet-700 mb-1">{q.meaning}</p>
                <p className="text-xs text-stone-600 leading-relaxed">{q.explanation}</p>
              </div>
            )}
            <button onClick={handleNext} className="w-full py-2.5 rounded-xl bg-stone-800 text-white text-sm font-medium active:scale-95 transition-all">
              次へ →
            </button>
          </div>
        )}
      </div>
      <div className="mt-4 text-stone-400 text-sm">現在のスコア: <span className="text-violet-600 font-semibold">{score}</span> 正解</div>
    </div>
  )
}

// ── Main Page ─────────────────────────────────────────────────────────────────

export default function N2QuizPage() {
  const [tab, setTab] = useState<TabType>('vocab')

  return (
    <div className="min-h-screen bg-[#F8F4ED] flex flex-col">
      {/* Header */}
      <div className="bg-white border-b border-stone-100 px-4 pt-6 pb-0">
        <h1 className="text-xl font-bold text-stone-800 mb-4" style={{ fontFamily: "'Noto Serif JP', serif" }} translate="no">
          N2 練習
        </h1>
        <div className="flex gap-0">
          {([
            { key: 'vocab', label: '語彙', sub: '词汇选义' },
            { key: 'grammar', label: '文法', sub: '语法填空' },
          ] as const).map(t => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={`flex-1 py-2.5 text-sm font-medium border-b-2 transition-colors ${
                tab === t.key
                  ? t.key === 'vocab' ? 'border-red-500 text-red-600' : 'border-violet-500 text-violet-600'
                  : 'border-transparent text-stone-400'
              }`}
            >
              <span translate="no">{t.label}</span>
              <span className="text-xs ml-1 opacity-60">{t.sub}</span>
            </button>
          ))}
        </div>
      </div>

      {tab === 'vocab' ? <VocabQuiz /> : <GrammarQuizSection />}
    </div>
  )
}
