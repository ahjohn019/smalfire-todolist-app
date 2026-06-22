'use client'

import * as React from 'react'
import KanbanTemplate from '@/src/components/KanbanTemplate'
import NavBar from '@/src/components/NavBar'
import Filter from '@/src/components/Filter'
import { useFilter } from '@/src/hooks/useFilter'

export default function KanbanBoardClient() {
  const { defaultTaskFilters } = useFilter()
  const [searchQuery, setSearchQuery] = React.useState('')
  const [filters, setFilters] = React.useState(defaultTaskFilters)

  return (
    <>
      <NavBar
        actions={<Filter filters={filters} onChange={setFilters} />}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />
      <KanbanTemplate filters={filters} searchQuery={searchQuery} />
    </>
  )
}
