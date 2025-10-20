import { useAuth } from '@clerk/clerk-expo'
import * as ImagePicker from 'expo-image-picker'
import { useEffect, useState } from 'react'
import { supabase } from '../utils/supabase'

export interface Transaction {
  id: number
  created_at: string
  user_id: string
  wallet_id: number
  type: 'income' | 'expense'
  amount: number
  category: string
  note: string
  image: string | null
  payment_method: string
  date: string
}

export interface TransactionStats {
  totalIncome: number
  totalExpense: number
  balance: number
  todayExpense: number
  todayIncome: number
  expensePercentage: number
  isHighExpense: boolean
}

export const useTransaction = (walletId?: number) => {
  const { userId } = useAuth()
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [stats, setStats] = useState<TransactionStats>({
    totalIncome: 0,
    totalExpense: 0,
    balance: 0,
    todayExpense: 0,
    todayIncome: 0,
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (userId) {
      fetchTransactions()
    }
  }, [userId, walletId])

  const fetchTransactions = async () => {
    try {
      setLoading(true)
      setError(null)

      let query = supabase
        .from('transactions')
        .select('*')
        .eq('user_id', userId)
        .order('date', { ascending: false })

      if (walletId) {
        query = query.eq('wallet_id', walletId)
      }

      const { data, error: fetchError } = await query

      if (fetchError) throw fetchError

      setTransactions(data || [])
      calculateStats(data || [])
    } catch (err: any) {
      setError(err.message)
      console.error('Error fetching transactions:', err)
    } finally {
      setLoading(false)
    }
  }

  const calculateStats = (txns: Transaction[]) => {
    const today = new Date().toISOString().split('T')[0]

    const totalIncome = txns
      .filter((t) => t.type === 'income')
      .reduce((sum, t) => sum + Number(t.amount), 0)

    const totalExpense = txns
      .filter((t) => t.type === 'expense')
      .reduce((sum, t) => sum + Number(t.amount), 0)

    const todayIncome = txns
      .filter((t) => t.type === 'income' && t.date.startsWith(today))
      .reduce((sum, t) => sum + Number(t.amount), 0)

    const todayExpense = txns
      .filter((t) => t.type === 'expense' && t.date.startsWith(today))
      .reduce((sum, t) => sum + Number(t.amount), 0)

    setStats({
      totalIncome,
      totalExpense,
      balance: totalIncome - totalExpense,
      todayIncome,
      todayExpense,
    })
  }

  const uploadImage = async (imageUri: string): Promise<string | null> => {
    try {
      // For React Native, we need to use FormData or direct file upload
      const fileExt = imageUri.split('.').pop() || 'jpg'
      const fileName = `${userId}_${Date.now()}.${fileExt}`
      const filePath = imageUri.replace('file://', '')

      // Create form data for file upload
      const formData = new FormData()
      formData.append('file', {
        uri: imageUri,
        name: fileName,
        type: `image/${fileExt}`,
      } as any)

      // Upload using fetch to Supabase storage
      const { data, error: uploadError } = await supabase.storage
        .from('userimage')
        .upload(fileName, formData, {
          contentType: `image/${fileExt}`,
          upsert: false,
        })

      if (uploadError) {
        console.error('Upload error:', uploadError)
        
        // Fallback: Try with blob/base64
        try {
          const response = await fetch(imageUri)
          const blob = await response.blob()
          
          const { data: retryData, error: retryError } = await supabase.storage
            .from('userimage')
            .upload(fileName, blob, {
              contentType: `image/${fileExt}`,
              upsert: false,
            })
          
          if (retryError) throw retryError
          
          const { data: { publicUrl } } = supabase.storage
            .from('userimage')
            .getPublicUrl(retryData.path)
          
          return publicUrl
        } catch (retryErr) {
          throw uploadError
        }
      }

      const {
        data: { publicUrl },
      } = supabase.storage.from('userimage').getPublicUrl(data.path)

      return publicUrl
    } catch (err: any) {
      console.error('Error uploading image:', err)
      return null
    }
  }

  const createTransaction = async (
    transactionData: Omit<Transaction, 'id' | 'created_at' | 'user_id'> & {
      imageUri?: string
    }
  ) => {
    try {
      setLoading(true)
      setError(null)

      let imageUrl = null
      if (transactionData.imageUri) {
        imageUrl = await uploadImage(transactionData.imageUri)
      }

      const { imageUri, ...dataToInsert } = transactionData

      const { data, error: createError } = await supabase
        .from('transactions')
        .insert([
          {
            user_id: userId,
            ...dataToInsert,
            image: imageUrl,
          },
        ])
        .select()
        .single()

      if (createError) throw createError

      if (transactionData.type === 'income') {
        try {
          const { data: userData, error: userError } = await supabase
            .from('users')
            .select('points, level')
            .eq('uuid', userId)
            .single()

          if (!userError && userData) {
            const newPoints = Number(userData.points) + 10
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
      }

      await fetchTransactions()
      return data
    } catch (err: any) {
      setError(err.message)
      console.error('Error creating transaction:', err)
      throw err
    } finally {
      setLoading(false)
    }
  }

  const updateTransaction = async (
    transactionId: number,
    updates: Partial<Transaction> & { imageUri?: string }
  ) => {
    try {
      setLoading(true)
      setError(null)

      let imageUrl = updates.image
      if (updates.imageUri) {
        imageUrl = await uploadImage(updates.imageUri)
      }

      const { imageUri, ...dataToUpdate } = updates

      const { data, error: updateError } = await supabase
        .from('transactions')
        .update({ ...dataToUpdate, image: imageUrl })
        .eq('id', transactionId)
        .eq('user_id', userId)
        .select()
        .single()

      if (updateError) throw updateError

      await fetchTransactions()
      return data
    } catch (err: any) {
      setError(err.message)
      console.error('Error updating transaction:', err)
      throw err
    } finally {
      setLoading(false)
    }
  }

  const deleteTransaction = async (transactionId: number) => {
    try {
      setLoading(true)
      setError(null)

      const { error: deleteError } = await supabase
        .from('transactions')
        .delete()
        .eq('id', transactionId)
        .eq('user_id', userId)

      if (deleteError) throw deleteError

      await fetchTransactions()
    } catch (err: any) {
      setError(err.message)
      console.error('Error deleting transaction:', err)
      throw err
    } finally {
      setLoading(false)
    }
  }

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync()

    if (status !== 'granted') {
      alert('Sorry, we need camera roll permissions to upload images!')
      return null
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.5,
    })

    if (!result.canceled) {
      return result.assets[0].uri
    }

    return null
  }

  return {
    transactions,
    stats,
    loading,
    error,
    fetchTransactions,
    createTransaction,
    updateTransaction,
    deleteTransaction,
    pickImage,
  }
}
