'use client'

import { useEffect } from 'react'

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // Force dark mode on mount
    document.documentElement.classList.add('dark')
  }, [])

  return <>{children}</>
}
