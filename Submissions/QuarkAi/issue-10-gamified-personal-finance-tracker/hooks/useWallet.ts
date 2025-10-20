import { useAuth } from '@clerk/clerk-expo'
import { useEffect, useState } from 'react'
import { supabase } from '../utils/supabase'

export interface Wallet {
  id: number
  created_at: string
  user_id: string
  wallet_name: string
  balance: number
  wallet_color: string
}

export const useWallet = () => {
  const { userId } = useAuth()
  const [wallets, setWallets] = useState<Wallet[]>([])
  const [selectedWallet, setSelectedWallet] = useState<Wallet | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (userId) {
      fetchWallets()
    }
  }, [userId])

  const fetchWallets = async () => {
    try {
      setLoading(true)
      setError(null)

      const { data, error: fetchError } = await supabase
        .from('wallet')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })

      if (fetchError) throw fetchError

      setWallets(data || [])
      
      if (data && data.length > 0 && !selectedWallet) {
        setSelectedWallet(data[0])
      }
    } catch (err: any) {
      setError(err.message)
      console.error('Error fetching wallets:', err)
    } finally {
      setLoading(false)
    }
  }

  const createWallet = async (walletData: {
    wallet_name: string
    balance: number
    wallet_color: string
  }) => {
    try {
      setLoading(true)
      setError(null)

      const { data, error: createError } = await supabase
        .from('wallet')
        .insert([
          {
            user_id: userId,
            ...walletData,
          },
        ])
        .select()
        .single()

      if (createError) throw createError

      try {
        const { data: userData, error: userError } = await supabase
          .from('users')
          .select('points, level')
          .eq('uuid', userId)
          .single()

        if (!userError && userData) {
          const newPoints = Number(userData.points) + 5
          const newLevel = Math.floor(newPoints / 100)

          await supabase
            .from('users')
            .update({ 
              points: newPoints,
              level: newLevel
            })
            .eq('uuid', userId)
        }
      } catch (pointsError) {
        console.error('Error updating points:', pointsError)
      }

      await fetchWallets()
      return data
    } catch (err: any) {
      setError(err.message)
      console.error('Error creating wallet:', err)
      throw err
    } finally {
      setLoading(false)
    }
  }

  const updateWallet = async (
    walletId: number,
    updates: Partial<Wallet>
  ) => {
    try {
      setLoading(true)
      setError(null)

      const { data, error: updateError } = await supabase
        .from('wallet')
        .update(updates)
        .eq('id', walletId)
        .eq('user_id', userId)
        .select()
        .single()

      if (updateError) throw updateError

      await fetchWallets()
      return data
    } catch (err: any) {
      setError(err.message)
      console.error('Error updating wallet:', err)
      throw err
    } finally {
      setLoading(false)
    }
  }

  const deleteWallet = async (walletId: number) => {
    try {
      setLoading(true)
      setError(null)

      const { error: deleteError } = await supabase
        .from('wallet')
        .delete()
        .eq('id', walletId)
        .eq('user_id', userId)

      if (deleteError) throw deleteError

      await fetchWallets()
    } catch (err: any) {
      setError(err.message)
      console.error('Error deleting wallet:', err)
      throw err
    } finally {
      setLoading(false)
    }
  }

  const updateWalletBalance = async (walletId: number, amount: number) => {
    try {
      const wallet = wallets.find((w) => w.id === walletId)
      if (!wallet) throw new Error('Wallet not found')

      const newBalance = Number(wallet.balance) + amount

      await updateWallet(walletId, { balance: newBalance })
    } catch (err: any) {
      console.error('Error updating wallet balance:', err)
      throw err
    }
  }

  return {
    wallets,
    selectedWallet,
    setSelectedWallet,
    loading,
    error,
    fetchWallets,
    createWallet,
    updateWallet,
    deleteWallet,
    updateWalletBalance,
  }
}
