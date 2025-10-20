import { useThemeContext } from '@/context/themeContext'
import { Transaction } from '@/hooks/useTransaction'
import {
  ArrowDownRight,
  ArrowUpRight,
  Calendar,
  CreditCard,
  DollarSign,
  FileText,
  FolderOpen,
  Image as ImageIcon,
  Tag,
  Wallet as WalletIcon,
  X,
} from 'lucide-react-native'
import React from 'react'
import { Image, Modal, ScrollView, Text, TouchableOpacity, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

interface TransactionDetailModalProps {
  visible: boolean
  onClose: () => void
  transaction: Transaction | null
  walletName?: string
}

export default function TransactionDetailModal({
  visible,
  onClose,
  transaction,
  walletName,
}: TransactionDetailModalProps) {
  const { theme } = useThemeContext()

  if (!transaction) return null

  const isIncome = transaction.type === 'income'
  const formattedDate = new Date(transaction.date).toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
  const formattedTime = new Date(transaction.date).toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
  })

  const DetailRow = ({
    icon: Icon,
    label,
    value,
    color,
  }: {
    icon: any
    label: string
    value: string
    color?: string
  }) => (
    <View
      className={`flex-row items-center p-4 rounded-2xl mb-3 ${
        theme === 'dark' ? 'bg-gray-800/50' : 'bg-white/50'
      }`}
    >
      <View
        className={`w-10 h-10 rounded-full items-center justify-center mr-4 ${
          theme === 'dark' ? 'bg-gray-700/50' : 'bg-gray-100'
        }`}
      >
        <Icon size={20} color={color || (theme === 'dark' ? '#9CA3AF' : '#6B7280')} />
      </View>
      <View className="flex-1">
        <Text
          className={`text-xs mb-1 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}
        >
          {label}
        </Text>
        <Text
          className={`text-base font-semibold ${
            theme === 'dark' ? 'text-gray-100' : 'text-gray-900'
          }`}
        >
          {value}
        </Text>
      </View>
    </View>
  )

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View className="flex-1 bg-black/50">
        <SafeAreaView
          className={`flex-1 mt-20 rounded-t-3xl ${
            theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'
          }`}
        >
          {/* Header */}
          <View
            className={`px-6 py-4 border-b ${
              theme === 'dark' ? 'border-gray-800' : 'border-gray-200'
            }`}
          >
            <View className="flex-row items-center justify-between">
              <Text
                className={`text-xl font-bold ${
                  theme === 'dark' ? 'text-gray-100' : 'text-gray-900'
                }`}
              >
                Transaction Details
              </Text>
              <TouchableOpacity
                onPress={onClose}
                className={`w-10 h-10 rounded-full items-center justify-center ${
                  theme === 'dark' ? 'bg-gray-800' : 'bg-gray-200'
                }`}
              >
                <X size={20} color={theme === 'dark' ? '#F3F4F6' : '#111827'} />
              </TouchableOpacity>
            </View>
          </View>

          <ScrollView className="flex-1 px-6 py-6" showsVerticalScrollIndicator={false}>
            {/* Amount Card */}
            <View
              className={`p-6 rounded-3xl mb-6 items-center border ${
                isIncome
                  ? theme === 'dark'
                    ? 'bg-green-900/20 border-green-800/50'
                    : 'bg-green-50 border-green-200'
                  : theme === 'dark'
                  ? 'bg-red-900/20 border-red-800/50'
                  : 'bg-red-50 border-red-200'
              }`}
            >
              <View
                className={`w-16 h-16 rounded-full items-center justify-center mb-4 ${
                  isIncome
                    ? theme === 'dark'
                      ? 'bg-green-800/50'
                      : 'bg-green-100'
                    : theme === 'dark'
                    ? 'bg-red-800/50'
                    : 'bg-red-100'
                }`}
              >
                {isIncome ? (
                  <ArrowDownRight size={32} color="#10B981" />
                ) : (
                  <ArrowUpRight size={32} color="#EF4444" />
                )}
              </View>
              <Text
                className={`text-sm font-medium mb-2 ${
                  isIncome ? 'text-green-600' : 'text-red-600'
                }`}
              >
                {isIncome ? 'Income' : 'Expense'}
              </Text>
              <Text
                className={`text-4xl font-bold ${
                  theme === 'dark' ? 'text-gray-100' : 'text-gray-900'
                }`}
              >
                ${Number(transaction.amount).toFixed(2)}
              </Text>
            </View>

            {/* Transaction Details */}
            <Text
              className={`text-base font-semibold mb-3 ${
                theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
              }`}
            >
              Information
            </Text>

            <DetailRow icon={Tag} label="Category" value={transaction.category} />

            <DetailRow
              icon={WalletIcon}
              label="Wallet"
              value={walletName || 'Unknown Wallet'}
            />

            <DetailRow
              icon={CreditCard}
              label="Payment Method"
              value={transaction.payment_method}
            />

            <DetailRow icon={Calendar} label="Date" value={formattedDate} />

            <DetailRow icon={Calendar} label="Time" value={formattedTime} />

            {transaction.note && (
              <DetailRow icon={FileText} label="Note" value={transaction.note} />
            )}

            {/* Transaction ID */}
            <DetailRow icon={FolderOpen} label="Transaction ID" value={`#${transaction.id}`} />

            {/* Receipt Image */}
            {transaction.image && (
              <View className="mt-2">
                <Text
                  className={`text-base font-semibold mb-3 ${
                    theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                  }`}
                >
                  Receipt
                </Text>
                <View
                  className={`rounded-2xl overflow-hidden border ${
                    theme === 'dark' ? 'border-gray-800' : 'border-gray-200'
                  }`}
                >
                  <Image
                    source={{ uri: transaction.image }}
                    className="w-full h-64"
                    resizeMode="cover"
                  />
                </View>
              </View>
            )}
          </ScrollView>

          {/* Close Button */}
          <View className="px-6 pb-6">
            <TouchableOpacity
              onPress={onClose}
              className={`py-4 rounded-2xl items-center ${
                theme === 'dark' ? 'bg-gray-800' : 'bg-gray-200'
              }`}
            >
              <Text
                className={`text-base font-semibold ${
                  theme === 'dark' ? 'text-gray-100' : 'text-gray-900'
                }`}
              >
                Close
              </Text>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </View>
    </Modal>
  )
}
