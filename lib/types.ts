export type OriginType = 'yamato' | 'kango' | 'gairaigo' | 'mixed'
export type JLPTLevel = 'N1' | 'N2' | 'N3' | 'N4' | 'N5' | null

export interface KanjiBreakdown {
  kanji: string
  reading: string
  meaning: string
  origin: string
  zh_modern?: string
}

export interface Etymology {
  origin_type: OriginType
  kanji_breakdown: KanjiBreakdown[]
  related_words: string[]
  zh_comparison?: string
  interesting_fact: string
}

export interface Word {
  id: string
  japanese: string
  reading: string
  meaning_zh: string
  meaning_en: string
  jlpt_level: JLPTLevel
  drama_id?: string
  scene_context?: string
  // 本地截图路径，放在 public/scenes/<word_id>.jpg 即可自动显示
  scene_image?: string
  etymology: Etymology
}

export interface Drama {
  id: string
  title_jp: string
  title_zh: string
  genre: string
  year: number
  description: string
  word_count: number
  cover_color: string
  category?: 'drama' | 'book' | 'travel'
  author?: string
}

export interface SRSCard {
  word_id: string
  interval: number
  ease_factor: number
  repetitions: number
  next_review: string
  last_reviewed: string
}

export interface UserProgress {
  user_id: string
  srs_cards: Record<string, SRSCard>
  selected_drama_ids: string[]
  total_reviewed: number
  streak_days: number
  last_study_date: string
}

export interface StudySession {
  words_studied: string[]
  duration_seconds: number
  mode: '1min' | '5min' | '10min'
  date: string
}

export type ReviewQuality = 0 | 1 | 2 | 3 | 4 | 5
