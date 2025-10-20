'use client'

import { useUser } from '@/hooks/useUser'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

export function UserInfoDebug() {
  const { user, profile, loading, isAdmin } = useUser()

  if (loading) {
    return (
      <Card className="bg-blue-900/30 border-blue-600/50">
        <CardContent className="p-4">
          <p className="text-sm text-blue-300">Loading user info...</p>
        </CardContent>
      </Card>
    )
  }

  if (!user || !profile) {
    return (
      <Card className="bg-red-900/30 border-red-600/50">
        <CardContent className="p-4">
          <p className="text-sm text-red-300">❌ Not logged in</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="bg-blue-900/30 border-blue-600/50">
      <CardHeader>
        <CardTitle className="text-sm flex items-center gap-2">
          🔍 User Information (Debug)
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2 text-sm">
        <div className="flex justify-between">
          <span className="text-gray-400">Email:</span>
          <span className="text-gray-200 font-mono text-xs">{profile.email}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-400">Name:</span>
          <span className="text-gray-200">{profile.full_name || 'Not set'}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-gray-400">Role:</span>
          <Badge variant={isAdmin ? 'success' : 'warning'}>
            {profile.role.toUpperCase()}
          </Badge>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-gray-400">Admin Access:</span>
          <span className={isAdmin ? 'text-green-400' : 'text-yellow-400'}>
            {isAdmin ? '✓ Yes' : '✗ No'}
          </span>
        </div>
        <div className="mt-3 pt-3 border-t border-blue-600/30">
          <p className="text-xs text-gray-400">
            User ID: <span className="font-mono">{user.id.slice(0, 8)}...</span>
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
