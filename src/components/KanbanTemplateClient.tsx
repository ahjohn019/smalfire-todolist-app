'use client'

import dynamic from 'next/dynamic'
import type { TaskFilters } from '@/src/hooks/useFilter'

type KanbanTemplateClientProps = {
  filters: TaskFilters
  searchQuery: string
}

const KanbanTemplate = dynamic<KanbanTemplateClientProps>(
  () => import('@/src/components/KanbanTemplate'),
  {
  ssr: false
  }
)

export default function KanbanTemplateClient(props: KanbanTemplateClientProps) {
  return <KanbanTemplate {...props} />
}
