'use client'

import { Bell } from 'lucide-react'
import { Button } from '@/components/ui/button'

export function Topbar() {
  return (
    <div className="flex h-16 items-center justify-between border-b border-gray-700 bg-gray-800 px-6">
      <div className="flex items-center gap-4">
        <h2 className="text-xl font-semibold text-gray-100">
          Inventory & Sales Management
        </h2>
      </div>

      <div className="flex items-center gap-3">
        <Button variant="ghost" size="sm" className="h-9 w-9 p-0">
          <Bell className="h-5 w-5" />
        </Button>
      </div>
    </div>
  )
}
