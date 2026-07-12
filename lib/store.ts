import { create } from 'zustand'
import { SRSCard, ReviewQuality } from '@/lib/types'
import { calculateNextReview, createNewCard, getDueCards } from '@/lib/srs'
import { WORDS } from '@/lib/data/words'

interface AppState {
  userId: string | null
  userEmail: string | null
  srsCards: Record<string, SRSCard>
  selectedDramaIds: string[]
  streakDays: number
  lastStudyDate: string
  totalReviewed: number
  _hydrated: boolean
  setUser: (id: string | null, email: string | null) => void
  selectDrama: (id: string) => void
  deselectDrama: (id: string) => void
  reviewWord: (wordId: string, quality: ReviewQuality) => void
  getDueCount: () => number
  updateStreak: () => void
  syncFromServer: (data: Partial<AppState>) => void
  hydrate: () => void
  persist: () => void
}

export const useAppStore = create<AppState>()((set, get) => ({
  userId: null,
  userEmail: null,
  srsCards: {},
  selectedDramaIds: [],
  streakDays: 0,
  lastStudyDate: '',
  totalReviewed: 0,
  _hydrated: false,

  setUser: (id, email) => set({ userId: id, userEmail: email }),

  selectDrama: (id) => {
    set(s => ({
      selectedDramaIds: s.selectedDramaIds.includes(id)
        ? s.selectedDramaIds
        : [...s.selectedDramaIds, id],
    }))
    get().persist()
  },

  deselectDrama: (id) => {
    set(s => ({
      selectedDramaIds: s.selectedDramaIds.filter(d => d !== id),
    }))
    get().persist()
  },

  reviewWord: (wordId, quality) => {
    const { srsCards, totalReviewed } = get()
    const existing = srsCards[wordId] ?? createNewCard(wordId)
    const updated = calculateNextReview(existing, quality)
    set({
      srsCards: { ...srsCards, [wordId]: updated },
      totalReviewed: totalReviewed + 1,
    })
    get().updateStreak()
    get().persist()
  },

  getDueCount: () => {
    const { srsCards } = get()
    return getDueCards(srsCards).length
  },

  updateStreak: () => {
    const { lastStudyDate, streakDays } = get()
    const today = new Date().toDateString()
    if (lastStudyDate === today) return
    const yesterday = new Date(Date.now() - 86400000).toDateString()
    set({
      lastStudyDate: today,
      streakDays: lastStudyDate === yesterday ? streakDays + 1 : 1,
    })
  },

  syncFromServer: (data) => set(data as AppState),

  hydrate: () => {
    if (typeof window === 'undefined') return
    try {
      const raw = localStorage.getItem('nihongo-app-store')
      if (!raw) { set({ _hydrated: true }); return }
      const saved = JSON.parse(raw)
      set({ ...saved, _hydrated: true })
    } catch {
      set({ _hydrated: true })
    }
  },

  persist: () => {
    if (typeof window === 'undefined') return
    try {
      const s = get()
      localStorage.setItem('nihongo-app-store', JSON.stringify({
        srsCards: s.srsCards,
        selectedDramaIds: s.selectedDramaIds,
        streakDays: s.streakDays,
        lastStudyDate: s.lastStudyDate,
        totalReviewed: s.totalReviewed,
      }))
    } catch {}
  },
}))

export function getTodayWordOfDay(): typeof WORDS[0] {
  const dayIndex = Math.floor(Date.now() / 86400000) % WORDS.length
  return WORDS[dayIndex]
}
