'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { useUser } from '@/hooks/useUser'

export default function SettingsPage() {
  const { user, profile } = useUser()
  const [fullName, setFullName] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')

  const supabase = createClient()

  useEffect(() => {
    if (profile) {
      setFullName(profile.full_name || '')
    }
  }, [profile])

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) return

    setLoading(true)
    setMessage('')

    try {
      const { error } = await supabase
        .from('profiles')
        .update({ full_name: fullName })
        .eq('id', user.id)

      if (error) throw error

      setMessage('Profile updated successfully!')
    } catch (error: any) {
      setMessage(error.message || 'Failed to update profile')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Settings</h1>

      {/* Debug User Info */}
      <div className="bg-blue-900/20 border border-blue-600/40 rounded-lg p-4">
        <h3 className="text-sm font-semibold text-blue-300 mb-2">👤 Current User Status</h3>
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div>
            <span className="text-gray-400">Email:</span>
            <p className="text-gray-200 font-mono text-xs mt-1">{profile?.email}</p>
          </div>
          <div>
            <span className="text-gray-400">Role:</span>
            <p className="text-gray-200 font-semibold mt-1 capitalize">
              {profile?.role} {profile?.role === 'admin' ? '✓' : ''}
            </p>
          </div>
        </div>
        {profile?.role !== 'admin' && (
          <div className="mt-3 pt-3 border-t border-blue-600/30">
            <p className="text-xs text-yellow-300">
              ⚠️ You need admin role to manage products. See <code className="bg-gray-800 px-1 py-0.5 rounded">ADMIN_SETUP.md</code> for instructions.
            </p>
          </div>
        )}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Profile Information</CardTitle>
          <CardDescription>Update your account details</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleUpdateProfile} className="space-y-4">
            {message && (
              <div className={`rounded-lg p-3 text-sm ${
                message.includes('success')
                  ? 'bg-green-50 text-green-600'
                  : 'bg-red-50 text-red-600'
              }`}>
                {message}
              </div>
            )}

            <Input
              label="Email"
              type="email"
              value={profile?.email || ''}
              disabled
            />

            <Input
              label="Full Name"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
            />

            <Input
              label="Role"
              value={profile?.role || ''}
              disabled
            />

            <Button type="submit" disabled={loading}>
              {loading ? 'Updating...' : 'Update Profile'}
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Account Information</CardTitle>
          <CardDescription>Your account details</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <div>
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">User ID</p>
            <p className="text-sm">{user?.id}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
              Account Created
            </p>
            <p className="text-sm">
              {profile?.created_at ? new Date(profile.created_at).toLocaleDateString() : 'N/A'}
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
