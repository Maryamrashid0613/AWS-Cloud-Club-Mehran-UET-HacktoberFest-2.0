import { useThemeContext } from '@/context/themeContext'
import { Wallet } from '@/hooks/useWallet'
import { X } from 'lucide-react-native'
import React, { useEffect, useState } from 'react'
import {
  ActivityIndicator,
  Modal,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

interface WalletModalProps {
  visible: boolean
  onClose: () => void
  onSave: (data: {
    wallet_name: string
    balance: number
    wallet_color: string
  }) => Promise<void>
  wallet?: Wallet | null
  onDelete?: (walletId: number) => Promise<void>
}

const WALLET_COLORS = [
  '#3B82F6',
  '#10B981',
  '#F59E0B',
  '#EF4444',
  '#8B5CF6',
  '#EC4899',
  '#06B6D4',
  '#84CC16',
]

export default function WalletModal({
  visible,
  onClose,
  onSave,
  wallet,
  onDelete,
}: WalletModalProps) {
  const { theme } = useThemeContext()
  const [walletName, setWalletName] = useState('')
  const [balance, setBalance] = useState('')
  const [selectedColor, setSelectedColor] = useState(WALLET_COLORS[0])
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState<{ [key: string]: string }>({})

  useEffect(() => {
    if (wallet) {
      setWalletName(wallet.wallet_name)
      setBalance(String(wallet.balance))
      setSelectedColor(wallet.wallet_color)
    } else {
      resetForm()
    }
  }, [wallet, visible])

  const resetForm = () => {
    setWalletName('')
    setBalance('')
    setSelectedColor(WALLET_COLORS[0])
    setErrors({})
  }

  const validate = () => {
    const newErrors: { [key: string]: string } = {}

    if (!walletName.trim()) {
      newErrors.walletName = 'Wallet name is required'
    }

    if (!balance.trim() || isNaN(Number(balance))) {
      newErrors.balance = 'Valid balance is required'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSave = async () => {
    if (!validate()) return

    try {
      setLoading(true)
      await onSave({
        wallet_name: walletName,
        balance: Number(balance),
        wallet_color: selectedColor,
      })
      resetForm()
    } catch (error) {
      console.error('Error saving wallet:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!wallet || !onDelete) return

    try {
      setLoading(true)
      await onDelete(wallet.id)
      resetForm()
      onClose()
    } catch (error) {
      console.error('Error deleting wallet:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={false}
      onRequestClose={onClose}
    >
      <SafeAreaView className={`flex-1 ${theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'}`}>
          <ScrollView 
            className="p-6" 
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 40 }}
          >
            {/* Header */}
            <View className="flex-row items-center justify-between mb-6">
              <Text
                className={`text-2xl font-bold ${
                  theme === 'dark' ? 'text-gray-100' : 'text-gray-900'
                }`}
              >
                {wallet ? 'Edit Wallet' : 'Create Wallet'}
              </Text>
              <TouchableOpacity
                onPress={onClose}
                className={`w-10 h-10 rounded-full items-center justify-center ${
                  theme === 'dark' ? 'bg-gray-800/60' : 'bg-white/60'
                }`}
              >
                <X
                  size={20}
                  color={theme === 'dark' ? '#F3F4F6' : '#111827'}
                />
              </TouchableOpacity>
            </View>

            {/* Wallet Name */}
            <View className="mb-4">
              <Text
                className={`text-sm font-medium mb-2 ${
                  theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                }`}
              >
                Wallet Name
              </Text>
              <TextInput
                value={walletName}
                onChangeText={setWalletName}
                placeholder="e.g., Main Wallet"
                placeholderTextColor={theme === 'dark' ? '#6B7280' : '#9CA3AF'}
                className={`px-4 py-4 rounded-2xl border shadow-md ${
                  theme === 'dark'
                    ? 'bg-gray-800/60 border-gray-700 text-gray-100 shadow-black/30'
                    : 'bg-white/60 border-gray-200 text-gray-900 shadow-gray-200/50'
                } ${errors.walletName ? 'border-red-500' : ''}`}
              />
              {errors.walletName && (
                <Text
                  className={`text-sm mt-1 ml-2 ${
                    theme === 'dark' ? 'text-red-400' : 'text-red-600'
                  }`}
                >
                  {errors.walletName}
                </Text>
              )}
            </View>

            {/* Balance */}
            <View className="mb-4">
              <Text
                className={`text-sm font-medium mb-2 ${
                  theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                }`}
              >
                Initial Balance
              </Text>
              <TextInput
                value={balance}
                onChangeText={setBalance}
                placeholder="0.00"
                keyboardType="decimal-pad"
                placeholderTextColor={theme === 'dark' ? '#6B7280' : '#9CA3AF'}
                className={`px-4 py-4 rounded-2xl border shadow-md ${
                  theme === 'dark'
                    ? 'bg-gray-800/60 border-gray-700 text-gray-100 shadow-black/30'
                    : 'bg-white/60 border-gray-200 text-gray-900 shadow-gray-200/50'
                } ${errors.balance ? 'border-red-500' : ''}`}
              />
              {errors.balance && (
                <Text
                  className={`text-sm mt-1 ml-2 ${
                    theme === 'dark' ? 'text-red-400' : 'text-red-600'
                  }`}
                >
                  {errors.balance}
                </Text>
              )}
            </View>

            {/* Color Selection */}
            <View className="mb-6">
              <Text
                className={`text-sm font-medium mb-3 ${
                  theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                }`}
              >
                Wallet Color
              </Text>
              <View className="flex-row flex-wrap gap-3">
                {WALLET_COLORS.map((color) => (
                  <TouchableOpacity
                    key={color}
                    onPress={() => setSelectedColor(color)}
                    className={`w-12 h-12 rounded-full items-center justify-center ${
                      selectedColor === color ? 'scale-110' : ''
                    }`}
                    style={{
                      backgroundColor: color,
                      borderWidth: selectedColor === color ? 3 : 0,
                      borderColor: theme === 'dark' ? '#F3F4F6' : '#111827',
                    }}
                  />
                ))}
              </View>
            </View>

            {/* Buttons */}
            <View className="gap-3">
              <TouchableOpacity
                onPress={handleSave}
                disabled={loading}
                className={`py-4 rounded-2xl shadow-md ${
                  theme === 'dark'
                    ? 'bg-gray-700 shadow-black/30'
                    : 'bg-gray-100 shadow-gray-200/50'
                } ${loading ? 'opacity-50' : ''}`}
              >
                {loading ? (
                  <ActivityIndicator
                    color={theme === 'dark' ? '#F3F4F6' : '#111827'}
                  />
                ) : (
                  <Text
                    className={`text-center text-lg font-semibold ${
                      theme === 'dark' ? 'text-gray-100' : 'text-gray-900'
                    }`}
                  >
                    {wallet ? 'Update Wallet' : 'Create Wallet'}
                  </Text>
                )}
              </TouchableOpacity>

              {wallet && onDelete && (
                <TouchableOpacity
                  onPress={handleDelete}
                  disabled={loading}
                  className={`py-4 rounded-2xl border shadow-md ${
                    theme === 'dark'
                      ? 'bg-red-900/30 border-red-400 shadow-black/30'
                      : 'bg-red-100 border-red-600 shadow-gray-200/50'
                  } ${loading ? 'opacity-50' : ''}`}
                >
                  <Text
                    className={`text-center text-lg font-semibold ${
                      theme === 'dark' ? 'text-red-100' : 'text-red-600'
                    }`}
                  >
                    Delete Wallet
                  </Text>
                </TouchableOpacity>
              )}
            </View>
          </ScrollView>
      </SafeAreaView>
    </Modal>
  )
}
