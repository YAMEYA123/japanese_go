import { SRSCard, ReviewQuality } from '@/lib/types'

export const DEFAULT_EASE = 2.5
export const MIN_EASE = 1.3

export function createNewCard(word_id: string): SRSCard {
  const now = new Date().toISOString()
  return {
    word_id,
    interval: 0,
    ease_factor: DEFAULT_EASE,
    repetitions: 0,
    next_review: now,
    last_reviewed: now,
  }
}

export function calculateNextReview(card: SRSCard, quality: ReviewQuality): SRSCard {
  let { interval, ease_factor, repetitions } = card

  if (quality < 3) {
    repetitions = 0
    interval = 1
  } else {
    if (repetitions === 0) interval = 1
    else if (repetitions === 1) interval = 6
    else interval = Math.round(interval * ease_factor)

    repetitions += 1
  }

  ease_factor = Math.max(
    MIN_EASE,
    ease_factor + 0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02)
  )

  const next = new Date()
  next.setDate(next.getDate() + interval)

  return {
    ...card,
    interval,
    ease_factor,
    repetitions,
    next_review: next.toISOString(),
    last_reviewed: new Date().toISOString(),
  }
}

export function isDue(next_review: string): boolean {
  return new Date(next_review) <= new Date()
}

export function getDueCards(cards: Record<string, SRSCard>): SRSCard[] {
  return Object.values(cards).filter(c => isDue(c.next_review))
}

export function getNewCards(cards: Record<string, SRSCard>, allWordIds: string[]): string[] {
  return allWordIds.filter(id => !cards[id])
}

export function getSRSLabel(card: SRSCard | undefined): { label: string; color: string } {
  if (!card) return { label: '未学习', color: 'text-gray-400' }
  if (isDue(card.next_review)) return { label: '待复习', color: 'text-red-500' }
  if (card.interval >= 21) return { label: '已熟记', color: 'text-emerald-600' }
  if (card.interval >= 7) return { label: '巩固中', color: 'text-blue-500' }
  return { label: '学习中', color: 'text-amber-500' }
}
