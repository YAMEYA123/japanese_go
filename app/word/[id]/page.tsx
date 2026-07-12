'use client'
import { useParams, useRouter } from 'next/navigation'
import { getWordById } from '@/lib/data/words'
import EtymologyCard from '@/components/EtymologyCard'
import { useAppStore } from '@/lib/store'
import { ReviewQuality } from '@/lib/types'

export default function WordPage() {
  const { id } = useParams<{ id: string }>()
  const router = useRouter()
  const word = getWordById(id)
  const reviewWord = useAppStore(s => s.reviewWord)

  if (!word) return <div className="px-4 pt-8 text-stone-500">未找到该词条</div>

  function handleReview(quality: ReviewQuality) {
    reviewWord(id, quality)
    router.back()
  }

  return (
    <div className="px-4 pt-6 pb-4">
      <button onClick={() => router.back()} className="text-stone-500 text-sm mb-4 flex items-center gap-1">
        ← 返回
      </button>
      <EtymologyCard
        word={word}
        onReview={handleReview}
        showReviewButtons={true}
        compact={false}
      />
    </div>
  )
}
