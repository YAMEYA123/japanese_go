import { READINGS } from '@/lib/data/readings'
import ReadingDetail from './ReadingDetail'

export function generateStaticParams() {
  return READINGS.map(r => ({ id: r.id }))
}

export default function ReadingPage() {
  return <ReadingDetail />
}
