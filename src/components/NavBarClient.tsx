'use client'

import * as React from 'react'
import dynamic from 'next/dynamic'

type NavBarClientProps = {
  actions?: React.ReactNode
  searchQuery: string
  onSearchChange: (value: string) => void
}

const NavBar = dynamic<NavBarClientProps>(() => import('@/src/components/NavBar'), {
  ssr: false
})

export default function NavBarClient(props: NavBarClientProps) {
  return <NavBar {...props} />
}
