import { useThemeContext } from '@/context/themeContext'
import { Transaction } from '@/hooks/useTransaction'
import { Wallet } from '@/hooks/useWallet'
import { Camera, X } from 'lucide-react-native'
import React, { useEffect, useState } from 'react'
import {
  ActivityIndicator,
  Image,
  Modal,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

interface TransactionModalProps {
  visible: boolean
  onClose: () => void
  onSave: (data: any) => Promise<void>
  transaction?: Transaction | null
  onDelete?: (transactionId: number) => Promise<void>
  wallets: Wallet[]
  onPickImage: () => Promise<string | null>
}

const CATEGORIES = {
  expense: [
    'Food',
    'Transport',
    'Shopping',
    'Bills',
    'Entertainment',
    'Health',
    'Education',
    'Other',
  ],
  income: ['Salary', 'Business', 'Investment', 'Gift', 'Other'],
}

const PAYMENT_METHODS = ['Cash', 'Card', 'Bank Transfer', 'E-Wallet']

export default function TransactionModal({
  visible,
  onClose,
  onSave,
  transaction,
  onDelete,
  wallets,
  onPickImage,
}: TransactionModalProps) {
  const { theme } = useThemeContext()
  const [type, setType] = useState<'income' | 'expense'>('expense')
  const [amount, setAmount] = useState('')
  const [category, setCategory] = useState('')
  const [note, setNote] = useState('')
  const [paymentMethod, setPaymentMethod] = useState('Cash')
  const [selectedWalletId, setSelectedWalletId] = useState<number | null>(null)
  const [imageUri, setImageUri] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState<{ [key: string]: string }>({})

  useEffect(() => {
    if (transaction) {
      setType(transaction.type)
      setAmount(String(transaction.amount))
      setCategory(transaction.category)
      setNote(transaction.note)
      setPaymentMethod(transaction.payment_method)
      setSelectedWalletId(transaction.wallet_id)
      setImageUri(transaction.image)
    } else {
      resetForm()
    }
  }, [transaction, visible])

  useEffect(() => {
    if (wallets.length > 0 && !selectedWalletId) {
      setSelectedWalletId(wallets[0].id)
    }
  }, [wallets])

  const resetForm = () => {
    setType('expense')
    setAmount('')
    setCategory('')
    setNote('')
    setPaymentMethod('Cash')
    setSelectedWalletId(wallets[0]?.id || null)
    setImageUri(null)
    setErrors({})
  }

  const validate = () => {
    const newErrors: { [key: string]: string } = {}

    if (!amount.trim() || isNaN(Number(amount)) || Number(amount) <= 0) {
      newErrors.amount = 'Valid amount is required'
    }

    if (!category) {
      newErrors.category = 'Category is required'
    }

    if (!selectedWalletId) {
      newErrors.wallet = 'Wallet is required'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSave = async () => {
    if (!validate()) return

    try {
      setLoading(true)
      
      await onSave({
        wallet_id: selectedWalletId,
        type,
        amount: Number(amount),
        category,
        note,
        payment_method: paymentMethod,
        date: new Date().toISOString(),
        imageUri,
      })
      
      resetForm()
    } catch (error) {
      console.error('Error saving transaction:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!transaction || !onDelete) return

    try {
      setLoading(true)
      await onDelete(transaction.id)
      resetForm()
      onClose()
    } catch (error) {
      console.error('Error deleting transaction:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleImagePick = async () => {
    const uri = await onPickImage()
    if (uri) {
      setImageUri(uri)
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
                {transaction ? 'Edit Transaction' : 'Add Transaction'}
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

            {/* Type Toggle */}
            <View className="flex-row gap-3 mb-4">
              <TouchableOpacity
                onPress={() => setType('expense')}
                className={`flex-1 py-3 rounded-2xl border ${
                  type === 'expense'
                    ? 'bg-red-500 border-red-500'
                    : theme === 'dark'
                    ? 'bg-gray-800/60 border-gray-700'
                    : 'bg-white/60 border-gray-200'
                }`}
              >
                <Text
                  className={`text-center font-semibold ${
                    type === 'expense' ? 'text-white' : theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                  }`}
                >
                  Expense
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => setType('income')}
                className={`flex-1 py-3 rounded-2xl border ${
                  type === 'income'
                    ? 'bg-green-500 border-green-500'
                    : theme === 'dark'
                    ? 'bg-gray-800/60 border-gray-700'
                    : 'bg-white/60 border-gray-200'
                }`}
              >
                <Text
                  className={`text-center font-semibold ${
                    type === 'income' ? 'text-white' : theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                  }`}
                >
                  Income
                </Text>
              </TouchableOpacity>
            </View>

            {/* Amount */}
            <View className="mb-4">
              <Text
                className={`text-sm font-medium mb-2 ${
                  theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                }`}
              >
                Amount
              </Text>
              <TextInput
                value={amount}
                onChangeText={setAmount}
                placeholder="0.00"
                keyboardType="decimal-pad"
                placeholderTextColor={theme === 'dark' ? '#6B7280' : '#9CA3AF'}
                className={`px-4 py-4 rounded-2xl border shadow-md text-xl font-bold ${
                  theme === 'dark'
                    ? 'bg-gray-800/60 border-gray-700 text-gray-100 shadow-black/30'
                    : 'bg-white/60 border-gray-200 text-gray-900 shadow-gray-200/50'
                } ${errors.amount ? 'border-red-500' : ''}`}
              />
              {errors.amount && (
                <Text
                  className={`text-sm mt-1 ml-2 ${
                    theme === 'dark' ? 'text-red-400' : 'text-red-600'
                  }`}
                >
                  {errors.amount}
                </Text>
              )}
            </View>

            {/* Wallet Selection */}
            <View className="mb-4">
              <Text
                className={`text-sm font-medium mb-2 ${
                  theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                }`}
              >
                Wallet
              </Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                <View className="flex-row gap-2">
                  {wallets.map((wallet) => (
                    <TouchableOpacity
                      key={wallet.id}
                      onPress={() => setSelectedWalletId(wallet.id)}
                      className={`px-4 py-3 rounded-2xl border ${
                        selectedWalletId === wallet.id
                          ? 'border-blue-500'
                          : theme === 'dark'
                          ? 'bg-gray-800/60 border-gray-700'
                          : 'bg-white/60 border-gray-200'
                      }`}
                      style={{
                        backgroundColor:
                          selectedWalletId === wallet.id
                            ? `${wallet.wallet_color}20`
                            : undefined,
                      }}
                    >
                      <Text
                        className={`font-medium ${
                          theme === 'dark' ? 'text-gray-100' : 'text-gray-900'
                        }`}
                      >
                        {wallet.wallet_name}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </ScrollView>
              {errors.wallet && (
                <Text
                  className={`text-sm mt-1 ml-2 ${
                    theme === 'dark' ? 'text-red-400' : 'text-red-600'
                  }`}
                >
                  {errors.wallet}
                </Text>
              )}
            </View>

            {/* Category */}
            <View className="mb-4">
              <Text
                className={`text-sm font-medium mb-2 ${
                  theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                }`}
              >
                Category
              </Text>
              <View className="flex-row flex-wrap gap-2">
                {CATEGORIES[type].map((cat) => (
                  <TouchableOpacity
                    key={cat}
                    onPress={() => setCategory(cat)}
                    className={`px-4 py-2 rounded-full border ${
                      category === cat
                        ? 'bg-blue-500 border-blue-500'
                        : theme === 'dark'
                        ? 'bg-gray-800/60 border-gray-700'
                        : 'bg-white/60 border-gray-200'
                    }`}
                  >
                    <Text
                      className={`font-medium ${
                        category === cat
                          ? 'text-white'
                          : theme === 'dark'
                          ? 'text-gray-400'
                          : 'text-gray-600'
                      }`}
                    >
                      {cat}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
              {errors.category && (
                <Text
                  className={`text-sm mt-1 ml-2 ${
                    theme === 'dark' ? 'text-red-400' : 'text-red-600'
                  }`}
                >
                  {errors.category}
                </Text>
              )}
            </View>

            {/* Payment Method */}
            <View className="mb-4">
              <Text
                className={`text-sm font-medium mb-2 ${
                  theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                }`}
              >
                Payment Method
              </Text>
              <View className="flex-row flex-wrap gap-2">
                {PAYMENT_METHODS.map((method) => (
                  <TouchableOpacity
                    key={method}
                    onPress={() => setPaymentMethod(method)}
                    className={`px-4 py-2 rounded-full border ${
                      paymentMethod === method
                        ? 'bg-blue-500 border-blue-500'
                        : theme === 'dark'
                        ? 'bg-gray-800/60 border-gray-700'
                        : 'bg-white/60 border-gray-200'
                    }`}
                  >
                    <Text
                      className={`font-medium ${
                        paymentMethod === method
                          ? 'text-white'
                          : theme === 'dark'
                          ? 'text-gray-400'
                          : 'text-gray-600'
                      }`}
                    >
                      {method}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Note */}
            <View className="mb-4">
              <Text
                className={`text-sm font-medium mb-2 ${
                  theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                }`}
              >
                Note (Optional)
              </Text>
              <TextInput
                value={note}
                onChangeText={setNote}
                placeholder="Add a note..."
                multiline
                numberOfLines={3}
                placeholderTextColor={theme === 'dark' ? '#6B7280' : '#9CA3AF'}
                className={`px-4 py-3 rounded-2xl border shadow-md ${
                  theme === 'dark'
                    ? 'bg-gray-800/60 border-gray-700 text-gray-100 shadow-black/30'
                    : 'bg-white/60 border-gray-200 text-gray-900 shadow-gray-200/50'
                }`}
                style={{ textAlignVertical: 'top' }}
              />
            </View>

            {/* Image */}
            <View className="mb-6">
              <Text
                className={`text-sm font-medium mb-2 ${
                  theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                }`}
              >
                Receipt (Optional)
              </Text>
              {imageUri ? (
                <View className="relative">
                  <Image
                    source={{ uri: imageUri }}
                    className="w-full h-48 rounded-2xl"
                    resizeMode="cover"
                  />
                  <TouchableOpacity
                    onPress={() => setImageUri(null)}
                    className="absolute top-2 right-2 w-8 h-8 rounded-full bg-red-500 items-center justify-center"
                  >
                    <X size={16} color="#FFFFFF" />
                  </TouchableOpacity>
                </View>
              ) : (
                <TouchableOpacity
                  onPress={handleImagePick}
                  className={`py-8 rounded-2xl border-2 border-dashed items-center justify-center ${
                    theme === 'dark'
                      ? 'border-gray-700 bg-gray-800/30'
                      : 'border-gray-300 bg-gray-100/30'
                  }`}
                >
                  <Camera
                    size={32}
                    color={theme === 'dark' ? '#9CA3AF' : '#6B7280'}
                  />
                  <Text
                    className={`mt-2 ${
                      theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                    }`}
                  >
                    Tap to add receipt
                  </Text>
                </TouchableOpacity>
              )}
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
                    {transaction ? 'Update Transaction' : 'Add Transaction'}
                  </Text>
                )}
              </TouchableOpacity>

              {transaction && onDelete && (
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
                    Delete Transaction
                  </Text>
                </TouchableOpacity>
              )}
            </View>
          </ScrollView>
      </SafeAreaView>
    </Modal>
  )
}
