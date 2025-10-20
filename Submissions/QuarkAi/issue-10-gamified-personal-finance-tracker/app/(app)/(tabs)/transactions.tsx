import FilterModal, { FilterOptions } from '@/components/FilterModal'
import TransactionDetailModal from '@/components/TransactionDetailModal'
import TransactionModal from '@/components/TransactionModal'
import { useCurrency } from '@/context/currencyContext'
import { useData } from '@/context/dataContext'
import { useThemeContext } from '@/context/themeContext'
import { Transaction, useTransaction } from '@/hooks/useTransaction'
import { Edit, Filter, Image as ImageIcon, SlidersHorizontal, Trash2 } from 'lucide-react-native'
import React, { useMemo, useState } from 'react'
import {
    ActivityIndicator,
    Alert,
    Image,
    Modal,
    RefreshControl,
    ScrollView,
    Text,
    TouchableOpacity,
    View,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

export default function TransactionsScreen() {
  const { theme } = useThemeContext()
  const { formatAmount } = useCurrency()
  const {
    wallets,
    selectedWallet,
    setSelectedWallet,
    transactions,
    transactionLoading: loading,
    updateTransaction,
    deleteTransaction,
    refreshAll,
  } = useData()
  
  const { pickImage } = useTransaction()

  const [transactionModalVisible, setTransactionModalVisible] = useState(false)
  const [selectedTransaction, setSelectedTransaction] =
    useState<Transaction | null>(null)
  const [filterType, setFilterType] = useState<'all' | 'income' | 'expense'>(
    'all'
  )
  const [refreshing, setRefreshing] = useState(false)
  const [imageModalVisible, setImageModalVisible] = useState(false)
  const [selectedImage, setSelectedImage] = useState<string | null>(null)
  const [actionMenuVisible, setActionMenuVisible] = useState(false)
  const [detailModalVisible, setDetailModalVisible] = useState(false)
  const [detailTransaction, setDetailTransaction] = useState<Transaction | null>(null)
  const [filterModalVisible, setFilterModalVisible] = useState(false)
  const [activeFilters, setActiveFilters] = useState<FilterOptions>({
    searchQuery: '',
    type: 'all',
    categories: [],
    dateRange: 'all',
    amountRange: { min: '', max: '' },
    sortBy: 'date',
    sortOrder: 'desc',
  })

  const onRefresh = async () => {
    setRefreshing(true)
    await refreshAll()
    setRefreshing(false)
  }

  const handleTransactionPress = (transaction: Transaction) => {
    setDetailTransaction(transaction)
    setDetailModalVisible(true)
  }

  const handleTransactionLongPress = (transaction: Transaction) => {
    setSelectedTransaction(transaction)
    setActionMenuVisible(true)
  }

  const handleEditTransaction = () => {
    setActionMenuVisible(false)
    setTransactionModalVisible(true)
  }

  const handleDeleteTransaction = async () => {
    if (!selectedTransaction) return
    
    setActionMenuVisible(false)
    
    Alert.alert(
      'Delete Transaction',
      'Are you sure you want to delete this transaction?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            await deleteTransaction(selectedTransaction.id)
            setSelectedTransaction(null)
          },
        },
      ]
    )
  }

  const handleCloseModal = () => {
    setTransactionModalVisible(false)
    setSelectedTransaction(null)
  }

  const handleSaveTransaction = async (data: any) => {
    if (selectedTransaction) {
      await updateTransaction(selectedTransaction.id, data)
    }
  }

  const handleImagePress = (imageUrl: string) => {
    setSelectedImage(imageUrl)
    setImageModalVisible(true)
  }

  const handleApplyFilters = (filters: FilterOptions) => {
    setActiveFilters(filters)
    setFilterType(filters.type)
  }

  // Get unique categories from transactions
  const availableCategories = useMemo(() => {
    const categories = new Set<string>()
    transactions.forEach((t) => {
      if (t.category) categories.add(t.category)
    })
    return Array.from(categories)
  }, [transactions])

  // Apply all filters
  const filteredTransactions = useMemo(() => {
    let filtered = [...transactions]

    // Search filter
    if (activeFilters.searchQuery) {
      const query = activeFilters.searchQuery.toLowerCase()
      filtered = filtered.filter(
        (t) =>
          t.category?.toLowerCase().includes(query) ||
          t.note?.toLowerCase().includes(query) ||
          t.payment_method?.toLowerCase().includes(query)
      )
    }

    // Type filter
    if (activeFilters.type !== 'all') {
      filtered = filtered.filter((t) => t.type === activeFilters.type)
    }

    // Category filter
    if (activeFilters.categories.length > 0) {
      filtered = filtered.filter((t) =>
        activeFilters.categories.includes(t.category)
      )
    }

    // Date range filter
    if (activeFilters.dateRange !== 'all') {
      const now = new Date()
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
      
      filtered = filtered.filter((t) => {
        const transactionDate = new Date(t.date)
        
        switch (activeFilters.dateRange) {
          case 'today':
            return transactionDate >= today
          case 'week':
            const weekAgo = new Date(today)
            weekAgo.setDate(weekAgo.getDate() - 7)
            return transactionDate >= weekAgo
          case 'month':
            const monthAgo = new Date(today)
            monthAgo.setMonth(monthAgo.getMonth() - 1)
            return transactionDate >= monthAgo
          case 'year':
            const yearAgo = new Date(today)
            yearAgo.setFullYear(yearAgo.getFullYear() - 1)
            return transactionDate >= yearAgo
          default:
            return true
        }
      })
    }

    // Amount range filter
    const minAmount = parseFloat(activeFilters.amountRange.min) || 0
    const maxAmount = parseFloat(activeFilters.amountRange.max) || Infinity
    
    filtered = filtered.filter((t) => {
      const amount = parseFloat(t.amount.toString())
      return amount >= minAmount && amount <= maxAmount
    })

    // Sort
    filtered.sort((a, b) => {
      let comparison = 0
      
      switch (activeFilters.sortBy) {
        case 'date':
          comparison = new Date(a.date).getTime() - new Date(b.date).getTime()
          break
        case 'amount':
          comparison = parseFloat(a.amount.toString()) - parseFloat(b.amount.toString())
          break
        case 'category':
          comparison = (a.category || '').localeCompare(b.category || '')
          break
      }
      
      return activeFilters.sortOrder === 'asc' ? comparison : -comparison
    })

    return filtered
  }, [transactions, activeFilters])

  const groupedTransactions = filteredTransactions.reduce((groups, transaction) => {
    const date = new Date(transaction.date).toLocaleDateString()
    if (!groups[date]) {
      groups[date] = []
    }
    groups[date].push(transaction)
    return groups
  }, {} as Record<string, Transaction[]>)

  // Count active filters
  const activeFilterCount = useMemo(() => {
    let count = 0
    if (activeFilters.searchQuery) count++
    if (activeFilters.type !== 'all') count++
    if (activeFilters.categories.length > 0) count++
    if (activeFilters.dateRange !== 'all') count++
    if (activeFilters.amountRange.min || activeFilters.amountRange.max) count++
    return count
  }, [activeFilters])

  return (
    <SafeAreaView
      className={`flex-1 ${theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'}`}
    >
      {/* Header */}
      <View className="px-6 pt-4 pb-4">
        <View className="flex-row items-center justify-between mb-4">
          <Text
            className={`text-3xl font-bold ${
              theme === 'dark' ? 'text-gray-100' : 'text-gray-900'
            }`}
          >
            Transactions
          </Text>
          
          {/* Filter Button */}
          <TouchableOpacity
            onPress={() => setFilterModalVisible(true)}
            className={`w-12 h-12 rounded-full items-center justify-center ${
              activeFilterCount > 0
                ? 'bg-blue-500'
                : theme === 'dark'
                ? 'bg-gray-800/60 border border-gray-700'
                : 'bg-white/60 border border-gray-200'
            }`}
          >
            <SlidersHorizontal
              size={20}
              color={activeFilterCount > 0 ? '#FFFFFF' : theme === 'dark' ? '#9CA3AF' : '#6B7280'}
            />
            {activeFilterCount > 0 && (
              <View className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-red-500 items-center justify-center">
                <Text className="text-xs font-bold text-white">
                  {activeFilterCount}
                </Text>
              </View>
            )}
          </TouchableOpacity>
        </View>

        {/* Wallet Selector */}
        {wallets.length > 0 && (
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View className="flex-row gap-2">
              {wallets.map((wallet) => (
                <TouchableOpacity
                  key={wallet.id}
                  onPress={() => setSelectedWallet(wallet)}
                  className={`px-4 py-2 rounded-full border ${
                    selectedWallet?.id === wallet.id
                      ? 'border-blue-500'
                      : theme === 'dark'
                      ? 'bg-gray-800/60 border-gray-700'
                      : 'bg-white/60 border-gray-200'
                  }`}
                  style={{
                    backgroundColor:
                      selectedWallet?.id === wallet.id
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
        )}
      </View>

      {/* Filter Tabs */}
      <View className="px-6 pb-4">
        <View className="flex-row gap-2">
          <TouchableOpacity
            onPress={() => setFilterType('all')}
            className={`flex-1 py-3 rounded-2xl border ${
              filterType === 'all'
                ? 'bg-blue-500 border-blue-500'
                : theme === 'dark'
                ? 'bg-gray-800/60 border-gray-700'
                : 'bg-white/60 border-gray-200'
            }`}
          >
            <Text
              className={`text-center font-semibold ${
                filterType === 'all'
                  ? 'text-white'
                  : theme === 'dark'
                  ? 'text-gray-400'
                  : 'text-gray-600'
              }`}
            >
              All
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setFilterType('income')}
            className={`flex-1 py-3 rounded-2xl border ${
              filterType === 'income'
                ? 'bg-green-500 border-green-500'
                : theme === 'dark'
                ? 'bg-gray-800/60 border-gray-700'
                : 'bg-white/60 border-gray-200'
            }`}
          >
            <Text
              className={`text-center font-semibold ${
                filterType === 'income'
                  ? 'text-white'
                  : theme === 'dark'
                  ? 'text-gray-400'
                  : 'text-gray-600'
              }`}
            >
              Income
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setFilterType('expense')}
            className={`flex-1 py-3 rounded-2xl border ${
              filterType === 'expense'
                ? 'bg-red-500 border-red-500'
                : theme === 'dark'
                ? 'bg-gray-800/60 border-gray-700'
                : 'bg-white/60 border-gray-200'
            }`}
          >
            <Text
              className={`text-center font-semibold ${
                filterType === 'expense'
                  ? 'text-white'
                  : theme === 'dark'
                  ? 'text-gray-400'
                  : 'text-gray-600'
              }`}
            >
              Expense
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Transactions List */}
      <ScrollView
        className="flex-1 px-6"
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {loading ? (
          <View className="py-8 items-center">
            <ActivityIndicator
              color={theme === 'dark' ? '#3B82F6' : '#1D4ED8'}
            />
          </View>
        ) : filteredTransactions.length === 0 ? (
          <View
            className={`p-6 rounded-2xl border border-dashed items-center mt-4 ${
              theme === 'dark'
                ? 'bg-gray-800/30 border-gray-700'
                : 'bg-white/30 border-gray-300'
            }`}
          >
            <Filter
              size={32}
              color={theme === 'dark' ? '#9CA3AF' : '#6B7280'}
            />
            <Text
              className={`text-center mt-3 ${
                theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
              }`}
            >
              No transactions found
            </Text>
          </View>
        ) : (
          <View className="pb-24">
            {Object.entries(groupedTransactions).map(([date, txns]) => (
              <View key={date} className="mb-6">
                <Text
                  className={`text-sm font-semibold mb-3 ${
                    theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                  }`}
                >
                  {date}
                </Text>
                <View className="gap-3">
                  {txns.map((transaction) => (
                    <TouchableOpacity
                      key={transaction.id}
                      onPress={() => handleTransactionPress(transaction)}
                      onLongPress={() => handleTransactionLongPress(transaction)}
                      activeOpacity={0.7}
                      className={`p-4 rounded-2xl border shadow-md ${
                        theme === 'dark'
                          ? 'bg-gray-800/50 border-gray-700/60 shadow-black/30'
                          : 'bg-white/50 border-gray-200/60 shadow-gray-200/50'
                      }`}
                    >
                      <View className="flex-row items-center justify-between">
                        <View className="flex-1 flex-row items-center gap-3">
                          {/* Category Icon */}
                          <View
                            className={`w-12 h-12 rounded-2xl items-center justify-center ${
                              transaction.type === 'income'
                                ? 'bg-green-500/20'
                                : 'bg-red-500/20'
                            }`}
                          >
                            <Text className="text-2xl">
                              {transaction.category === 'Food'
                                ? '🍔'
                                : transaction.category === 'Transport'
                                ? '🚗'
                                : transaction.category === 'Shopping'
                                ? '🛍️'
                                : transaction.category === 'Bills'
                                ? '📄'
                                : transaction.category === 'Salary'
                                ? '💰'
                                : transaction.category === 'Business'
                                ? '💼'
                                : '📊'}
                            </Text>
                          </View>

                          <View className="flex-1">
                            <Text
                              className={`text-base font-semibold mb-1 ${
                                theme === 'dark'
                                  ? 'text-gray-100'
                                  : 'text-gray-900'
                              }`}
                            >
                              {transaction.category}
                            </Text>
                            <View className="flex-row items-center gap-2">
                              <Text
                                className={`text-sm ${
                                  theme === 'dark'
                                    ? 'text-gray-400'
                                    : 'text-gray-600'
                                }`}
                              >
                                {transaction.payment_method}
                              </Text>
                              {transaction.image && (
                                <TouchableOpacity
                                  onPress={() =>
                                    handleImagePress(transaction.image!)
                                  }
                                >
                                  <ImageIcon
                                    size={14}
                                    color="#3B82F6"
                                  />
                                </TouchableOpacity>
                              )}
                            </View>
                            {transaction.note && (
                              <Text
                                className={`text-xs mt-1 ${
                                  theme === 'dark'
                                    ? 'text-gray-500'
                                    : 'text-gray-500'
                                }`}
                                numberOfLines={1}
                              >
                                {transaction.note}
                              </Text>
                            )}
                          </View>
                        </View>

                        <Text
                          className={`text-lg font-bold ${
                            transaction.type === 'income'
                              ? 'text-green-500'
                              : 'text-red-500'
                          }`}
                        >
                          {transaction.type === 'income' ? '+' : '-'}
                          {formatAmount(transaction.amount)}
                        </Text>
                      </View>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            ))}
          </View>
        )}
      </ScrollView>

      {/* Action Menu Modal */}
      <Modal
        visible={actionMenuVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setActionMenuVisible(false)}
      >
        <TouchableOpacity
          className="flex-1 bg-black/50"
          activeOpacity={1}
          onPress={() => setActionMenuVisible(false)}
        >
          <View className="flex-1 items-center justify-center px-6">
            <View
              className={`w-full rounded-3xl p-4 shadow-xl ${
                theme === 'dark'
                  ? 'bg-gray-800 border border-gray-700'
                  : 'bg-white border border-gray-200'
              }`}
            >
              <TouchableOpacity
                onPress={handleEditTransaction}
                className={`flex-row items-center p-4 rounded-2xl mb-2 ${
                  theme === 'dark' ? 'bg-gray-700/50' : 'bg-gray-100/50'
                }`}
              >
                <Edit
                  size={20}
                  color={theme === 'dark' ? '#3B82F6' : '#1D4ED8'}
                />
                <Text
                  className={`text-base font-semibold ml-3 ${
                    theme === 'dark' ? 'text-gray-100' : 'text-gray-900'
                  }`}
                >
                  Edit Transaction
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={handleDeleteTransaction}
                className={`flex-row items-center p-4 rounded-2xl ${
                  theme === 'dark' ? 'bg-red-900/30' : 'bg-red-100/50'
                }`}
              >
                <Trash2 size={20} color="#EF4444" />
                <Text
                  className={`text-base font-semibold ml-3 ${
                    theme === 'dark' ? 'text-red-100' : 'text-red-600'
                  }`}
                >
                  Delete Transaction
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </TouchableOpacity>
      </Modal>

      {/* Transaction Modal */}
      <TransactionModal
        visible={transactionModalVisible}
        onClose={handleCloseModal}
        onSave={handleSaveTransaction}
        transaction={selectedTransaction}
        onDelete={deleteTransaction}
        wallets={wallets}
        onPickImage={pickImage}
      />

      {/* Image Modal */}
      <Modal
        visible={imageModalVisible}
        transparent
        onRequestClose={() => setImageModalVisible(false)}
      >
        <View className="flex-1 bg-black/90">
          <TouchableOpacity
            className="flex-1 items-center justify-center"
            activeOpacity={1}
            onPress={() => setImageModalVisible(false)}
          >
            {selectedImage && (
              <Image
                source={{ uri: selectedImage }}
                className="w-full h-full"
                resizeMode="contain"
              />
            )}
          </TouchableOpacity>
        </View>
      </Modal>

      {/* Transaction Detail Modal */}
      <TransactionDetailModal
        visible={detailModalVisible}
        onClose={() => setDetailModalVisible(false)}
        transaction={detailTransaction}
        walletName={wallets.find(w => w.id === detailTransaction?.wallet_id)?.wallet_name}
      />

      {/* Filter Modal */}
      <FilterModal
        visible={filterModalVisible}
        onClose={() => setFilterModalVisible(false)}
        onApply={handleApplyFilters}
        availableCategories={availableCategories}
        currentFilters={activeFilters}
      />
    </SafeAreaView>
  )
}
