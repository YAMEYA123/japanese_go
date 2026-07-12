import { DRAMAS } from '@/lib/data/dramas'
import DramaDetail from './DramaDetail'

export function generateStaticParams() {
  return DRAMAS.map(d => ({ id: d.id }))
}

export default function DramaDetailPage() {
  return <DramaDetail />
}
