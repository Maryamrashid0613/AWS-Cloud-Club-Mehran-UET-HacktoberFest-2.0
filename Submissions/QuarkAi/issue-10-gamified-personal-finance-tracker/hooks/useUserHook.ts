import { useAuth, useUser } from '@clerk/clerk-expo'
import { useEffect, useState } from 'react'
import { supabase } from '../utils/supabase'

export interface User {
  id: number
  created_at: string
  uuid: string
  email: string | null
  name: string | null
  level: number
  points: number
}

export const useUserHook = () => {
  const { userId, isSignedIn } = useAuth()
  const { user: clerkUser } = useUser()
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (isSignedIn && userId && clerkUser) {
      initializeUser()
    }
  }, [isSignedIn, userId, clerkUser])

  // Real-time subscription for user updates
  useEffect(() => {
    if (!userId) return

    const channel = supabase
      .channel(`user-changes-${userId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'users',
          filter: `uuid=eq.${userId}`,
        },
        (payload) => {
          console.log('User update received:', payload)
          if (payload.new) {
            setUser(payload.new as User)
          }
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [userId])

  const initializeUser = async () => {
    try {
      setLoading(true)
      setError(null)

      const existingUser = await fetchUser()
      
      if (!existingUser) {
        await createUser()
      }
    } catch (err: any) {
      setError(err.message)
      console.error('Error initializing user:', err)
    } finally {
      setLoading(false)
    }
  }

  const fetchUser = async (): Promise<User | null> => {
    try {
      const { data, error: fetchError } = await supabase
        .from('users')
        .select('*')
        .eq('uuid', userId)
        .single()

      if (fetchError) {
        if (fetchError.code === 'PGRST116') {
          return null
        }
        throw fetchError
      }

      setUser(data)
      return data
    } catch (err: any) {
      console.error('Error fetching user:', err)
      throw err
    }
  }

  const createUser = async () => {
    try {
      const email = clerkUser?.emailAddresses?.[0]?.emailAddress || null
      const name = clerkUser?.fullName || clerkUser?.firstName || null

      const { data, error: createError } = await supabase
        .from('users')
        .insert([
          {
            uuid: userId,
            email: email,
            name: name,
            level: 0,
            points: 10,
          },
        ])
        .select()
        .single()

      if (createError) throw createError

      setUser(data)
      return data
    } catch (err: any) {
      setError(err.message)
      console.error('Error creating user:', err)
      throw err
    }
  }

  const updateUserPoints = async (pointsToAdd: number) => {
    if (!user) return

    try {
      const newPoints = Number(user.points) + pointsToAdd
      const newLevel = Math.floor(newPoints / 100) // Level up every 100 points

      const { data, error: updateError } = await supabase
        .from('users')
        .update({ 
          points: newPoints,
          level: newLevel 
        })
        .eq('uuid', userId)
        .select()
        .single()

      if (updateError) throw updateError

      setUser(data)
      return data
    } catch (err: any) {
      setError(err.message)
      console.error('Error updating points:', err)
      throw err
    }
  }

  const updateUserLevel = async (newLevel: number) => {
    if (!user) return

    try {
      const { data, error: updateError } = await supabase
        .from('users')
        .update({ level: newLevel })
        .eq('uuid', userId)
        .select()
        .single()

      if (updateError) throw updateError

      setUser(data)
      return data
    } catch (err: any) {
      setError(err.message)
      console.error('Error updating level:', err)
      throw err
    }
  }

  const refreshUser = async () => {
    try {
      setLoading(true)
      await fetchUser()
    } catch (err: any) {
      setError(err.message)
      console.error('Error refreshing user:', err)
    } finally {
      setLoading(false)
    }
  }

  return {
    user,
    loading,
    error,
    updateUserPoints,
    updateUserLevel,
    refreshUser,
    fetchUser,
    createUser,
  }
}
