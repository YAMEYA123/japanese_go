import { READINGS } from '@/lib/data/readings'
import ReadingDetail from './ReadingDetail'

export function generateStaticParams() {
  return READINGS.map(r => ({ id: r.id }))
}

export default function ReadingPage({ params }: { params: { id: string } }) {
  return <ReadingDetail id={params.id} />
}
