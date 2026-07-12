'use client'

import { useState, useEffect, useCallback } from 'react'
import { QUIZZES, getQuizzesByLevel, Quiz } from '@/lib/data/quizzes'

function shuffleArray<T>(arr: T[]): T[] {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

type AnswerState = 'idle' | 'correct' | 'wrong'

interface QuizWithShuffledOptions extends Quiz {
  shuffledOptions: string[]
}

export default function N2QuizPage() {
  const [quizzes, setQuizzes] = useState<QuizWithShuffledOptions[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [score, setScore] = useState(0)
  const [answerState, setAnswerState] = useState<AnswerState>('idle')
  const [selectedOption, setSelectedOption] = useState<string | null>(null)
  const [isFinished, setIsFinished] = useState(false)

  const initQuizzes = useCallback(() => {
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

  useEffect(() => {
    initQuizzes()
  }, [initQuizzes])

  const currentQuiz = quizzes[currentIndex]
  const total = quizzes.length

  function handleAnswer(option: string) {
    if (answerState !== 'idle') return
    const correct = option === currentQuiz.options[0]
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

  function getOptionStyle(option: string): string {
    const base =
      'w-full py-3 px-4 rounded-xl border-2 text-base font-medium transition-all duration-200 text-left'
    if (answerState === 'idle') {
      return `${base} bg-white border-stone-200 text-stone-800 hover:border-red-400 hover:bg-red-50 active:scale-95`
    }
    const isCorrect = option === currentQuiz.options[0]
    const isSelected = option === selectedOption
    if (isCorrect) {
      return `${base} bg-green-100 border-green-500 text-green-800`
    }
    if (isSelected && !isCorrect) {
      return `${base} bg-red-100 border-red-500 text-red-800`
    }
    return `${base} bg-white border-stone-200 text-stone-400`
  }

  function renderSentence(sentence: string) {
    const parts = sentence.split(/【|】/)
    return (
      <p
        className="text-xl leading-relaxed text-stone-800 font-serif"
        style={{ fontFamily: "'Noto Serif JP', serif" }}
        translate="no"
      >
        {parts.map((part, i) => {
          if (i === 1) {
            return (
              <span key={i} className="text-red-600 font-bold">
                {part}
              </span>
            )
          }
          return <span key={i}>{part}</span>
        })}
      </p>
    )
  }

  if (quizzes.length === 0) {
    return (
      <div className="min-h-screen bg-[#F8F4ED] flex items-center justify-center">
        <p className="text-stone-500">読み込み中...</p>
      </div>
    )
  }

  if (isFinished) {
    const pct = Math.round((score / total) * 100)
    return (
      <div className="min-h-screen bg-[#F8F4ED] flex flex-col items-center justify-center px-4">
        <div className="bg-white rounded-3xl shadow-md p-8 w-full max-w-sm text-center">
          <div
            className="text-5xl font-bold text-red-600 mb-2"
            style={{ fontFamily: "'Noto Serif JP', serif" }}
            translate="no"
          >
            {score}/{total}
          </div>
          <div
            className="text-xl text-stone-600 mb-1"
            style={{ fontFamily: "'Noto Serif JP', serif" }}
            translate="no"
          >
            正解
          </div>
          <div className="text-stone-400 text-sm mb-6">正答率 {pct}%</div>
          <div className="w-full bg-stone-100 rounded-full h-3 mb-6">
            <div
              className="bg-red-500 h-3 rounded-full transition-all"
              style={{ width: `${pct}%` }}
            />
          </div>
          <button
            onClick={initQuizzes}
            className="w-full py-3 rounded-xl bg-red-600 text-white font-semibold text-base hover:bg-red-700 active:scale-95 transition-all"
          >
            もう一度挑戦する
          </button>
        </div>
      </div>
    )
  }

  const progressPct = ((currentIndex) / total) * 100

  return (
    <div className="min-h-screen bg-[#F8F4ED] flex flex-col items-center px-4 py-8">
      {/* Header */}
      <div className="w-full max-w-lg mb-6">
        <div className="flex items-baseline justify-between mb-1">
          <h1
            className="text-2xl font-bold text-stone-800"
            style={{ fontFamily: "'Noto Serif JP', serif" }}
            translate="no"
          >
            N2 語彙クイズ
          </h1>
          <span className="text-sm text-stone-400 font-medium" translate="no">
            四択問題
          </span>
        </div>

        {/* Progress bar */}
        <div className="flex items-center gap-3">
          <div className="flex-1 bg-stone-200 rounded-full h-2">
            <div
              className="bg-red-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${progressPct}%` }}
            />
          </div>
          <span className="text-xs text-stone-500 w-12 text-right shrink-0">
            {currentIndex + 1}/{total}
          </span>
        </div>
      </div>

      {/* Quiz card */}
      <div className="w-full max-w-lg bg-white rounded-3xl shadow-md p-6 flex flex-col gap-5">
        {/* Reading */}
        <div className="text-center">
          <span
            className="text-sm text-stone-400 bg-stone-50 border border-stone-200 rounded-full px-3 py-1"
            style={{ fontFamily: "'Noto Serif JP', serif" }}
            translate="no"
          >
            {currentQuiz.reading}
          </span>
        </div>

        {/* Word */}
        <div className="text-center">
          <span
            className="text-4xl font-bold text-red-600"
            style={{ fontFamily: "'Noto Serif JP', serif" }}
            translate="no"
          >
            {currentQuiz.word}
          </span>
        </div>

        {/* Sentence */}
        <div
          className="bg-stone-50 rounded-2xl px-5 py-4 border border-stone-100"
          translate="no"
        >
          {renderSentence(currentQuiz.sentence)}
        </div>

        {/* Options */}
        <div className="grid grid-cols-2 gap-3 mt-1">
          {currentQuiz.shuffledOptions.map((option, idx) => (
            <button
              key={`${currentQuiz.id}-${idx}`}
              className={getOptionStyle(option)}
              onClick={() => handleAnswer(option)}
              disabled={answerState !== 'idle'}
            >
              <span className="text-xs text-stone-400 mr-1">
                {['A', 'B', 'C', 'D'][idx]}
              </span>
              {option}
            </button>
          ))}
        </div>

        {/* Feedback */}
        {answerState !== 'idle' && (
          <div
            className={`text-center text-sm font-medium rounded-xl py-2 transition-all ${
              answerState === 'correct'
                ? 'bg-green-50 text-green-700'
                : 'bg-red-50 text-red-700'
            }`}
          >
            {answerState === 'correct' ? (
              <span>正解！ ✓</span>
            ) : (
              <span>
                不正解。正解は「{currentQuiz.options[0]}」です。
              </span>
            )}
          </div>
        )}
      </div>

      {/* Score indicator */}
      <div className="mt-4 text-stone-400 text-sm">
        現在のスコア: <span className="text-red-600 font-semibold">{score}</span> 正解
      </div>
    </div>
  )
}
