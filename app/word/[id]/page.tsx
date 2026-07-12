import { WORDS } from '@/lib/data/words'
import WordDetail from './WordDetail'

export function generateStaticParams() {
  return WORDS.map(w => ({ id: w.id }))
}

export default function WordPage() {
  return <WordDetail />
}
