import ChartsModal from '@/components/ChartsModal'
import CurrencyModal from '@/components/CurrencyModal'
import LeaderboardModal from '@/components/LeaderboardModal'
import SimpleChart from '@/components/SimpleChart'
import TransactionModal from '@/components/TransactionModal'
import WalletModal from '@/components/WalletModal'
import { useCurrency } from '@/context/currencyContext'
import { useData } from '@/context/dataContext'
import { useThemeContext } from '@/context/themeContext'
import { useUserContext } from '@/context/userContext'
import { useTransaction } from '@/hooks/useTransaction'
import { Wallet } from '@/hooks/useWallet'
import {
    ArrowDownRight,
    ArrowUpRight,
    BarChart3,
    Edit,
    Moon,
    Plus,
    Repeat,
    Settings,
    Star,
    Sun,
    Trash2,
    Trophy,
    Wallet as WalletIcon,
    Zap,
} from 'lucide-react-native'
import React, { useMemo, useState } from 'react'
import {
    ActivityIndicator,
    Alert,
    Modal,
    RefreshControl,
    ScrollView,
    Text,
    TouchableOpacity,
    View,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

export default function DashboardScreen() {
  const { theme, toggleTheme } = useThemeContext()
  const { formatAmount } = useCurrency()
  const { user, refreshUser } = useUserContext()
  const {
    wallets,
    selectedWallet,
    setSelectedWallet,
    walletLoading,
    createWallet,
    updateWallet,
    deleteWallet,
    transactions,
    stats,
    transactionLoading,
    createTransaction,
    refreshAll,
  } = useData()

  const { pickImage } = useTransaction()

  const [walletModalVisible, setWalletModalVisible] = useState(false)
  const [transactionModalVisible, setTransactionModalVisible] = useState(false)
  const [editingWallet, setEditingWallet] = useState<Wallet | null>(null)
  const [actionMenuVisible, setActionMenuVisible] = useState(false)
  const [walletSelectorVisible, setWalletSelectorVisible] = useState(false)
  const [currencyModalVisible, setCurrencyModalVisible] = useState(false)
  const [leaderboardModalVisible, setLeaderboardModalVisible] = useState(false)
  const [chartsModalVisible, setChartsModalVisible] = useState(false)
  const [refreshing, setRefreshing] = useState(false)

  const onRefresh = async () => {
    setRefreshing(true)
    await refreshAll()
    setRefreshing(false)
  }

  const handleWalletLongPress = () => {
    if (selectedWallet) {
      setEditingWallet(selectedWallet)
    }
    setActionMenuVisible(true)
  }

  const handleEditWallet = () => {
    setActionMenuVisible(false)
    setWalletModalVisible(true)
  }

  const handleAddWallet = () => {
    setActionMenuVisible(false)
    setEditingWallet(null)
    setWalletModalVisible(true)
  }

  const handleChangeWallet = () => {
    setActionMenuVisible(false)
    setWalletSelectorVisible(true)
  }

  const handleDeleteWallet = async () => {
    if (!editingWallet) return
    
    setActionMenuVisible(false)
    
    Alert.alert(
      'Delete Wallet',
      'Are you sure you want to delete this wallet? All transactions will be deleted.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            await deleteWallet(editingWallet.id)
            setEditingWallet(null)
          },
        },
      ]
    )
  }

  const handleCloseWalletModal = () => {
    setWalletModalVisible(false)
    setEditingWallet(null)
  }

  const handleSaveWallet = async (data: any) => {
    try {
      // Close modal first to prevent navigation context issues
      setWalletModalVisible(false)
      setEditingWallet(null)
      
      // Small delay to ensure modal is fully closed
      await new Promise(resolve => setTimeout(resolve, 100))
      
      // Then create or update wallet
      if (editingWallet) {
        await updateWallet(editingWallet.id, data)
      } else {
        await createWallet(data)
      }
    } catch (error) {
      console.error('Error saving wallet:', error)
    }
  }

  const handleSaveTransaction = async (data: any) => {
    try {
      // Close modal first to prevent navigation context issues
      setTransactionModalVisible(false)
      // Small delay to ensure modal is fully closed
      await new Promise(resolve => setTimeout(resolve, 100))
      // Then create transaction
      await createTransaction(data)
    } catch (error) {
      console.error('Error saving transaction:', error)
    }
  }

  const handleSelectWallet = (wallet: Wallet) => {
    // Close modal first to avoid navigation context issues
    setWalletSelectorVisible(false)
    
    // Set selected wallet after a brief delay to ensure modal is closed
    setTimeout(() => {
      setSelectedWallet(wallet)
    }, 100)
  }

  // Memoize chart data to prevent unnecessary re-renders
  const chartData = useMemo(() => {
    if (!transactions || transactions.length === 0) {
      return []
    }
    
    const categoryMap = new Map<string, number>()
    
    transactions
      .filter((t) => t && t.type === 'expense')
      .forEach((t) => {
        const current = categoryMap.get(t.category) || 0
        categoryMap.set(t.category, current + Number(t.amount))
      })

    const sortedCategories = Array.from(categoryMap.entries())
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5)

    const colors = ['#EF4444', '#F59E0B', '#10B981', '#3B82F6', '#8B5CF6']

    return sortedCategories.map(([label, value], index) => ({
      label,
      value,
      color: colors[index] || '#6B7280',
    }))
  }, [transactions])

  const maxChartValue = useMemo(() => 
    chartData.length > 0 ? Math.max(...chartData.map((d) => d.value), 0) : 0
  , [chartData])

  const recentTransactions = useMemo(() => 
    (transactions || []).slice(0, 3)
  , [transactions])

  const levelProgress = useMemo(() => {
    if (!user) return { current: 0, max: 100, percent: 0, nextLevel: 1, pointsToNextLevel: 100 }
    
    const currentPoints = Number(user.points)
    const currentLevel = Number(user.level)
    const nextLevel = currentLevel + 1
    const pointsForNextLevel = nextLevel * 100
    const pointsForCurrentLevel = currentLevel * 100
    const pointsInCurrentLevel = currentPoints - pointsForCurrentLevel
    const pointsNeededForNextLevel = pointsForNextLevel - currentPoints
    const percent = (pointsInCurrentLevel / 100) * 100
    
    return {
      current: pointsInCurrentLevel,
      max: 100,
      percent: Math.min(percent, 100),
      nextLevel,
      pointsToNextLevel: pointsNeededForNextLevel
    }
  }, [user])

  const onRefreshWithUser = async () => {
    setRefreshing(true)
    await Promise.all([refreshAll(), refreshUser()])
    setRefreshing(false)
  }

  return (
    <SafeAreaView
      className={`flex-1 ${theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'}`}
    >
      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefreshWithUser} />
        }
      >
        {/* Header */}
        <View className="px-6 pt-4 pb-6">
          <View className="flex-row items-center justify-between">
            <Text
              className={`text-2xl font-bold ${
                theme === 'dark' ? 'text-gray-100' : 'text-gray-900'
              }`}
            >
              Dashboard
            </Text>
            <View className="flex-row items-center gap-3">
              <TouchableOpacity
                onPress={() => setChartsModalVisible(true)}
                className={`w-12 h-12 rounded-full items-center justify-center ${
                  theme === 'dark'
                    ? 'bg-gray-800/60 border border-gray-700/60'
                    : 'bg-white/60 border border-gray-200/60'
                }`}
              >
                <BarChart3
                  size={20}
                  color={theme === 'dark' ? '#A78BFA' : '#7C3AED'}
                />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => setLeaderboardModalVisible(true)}
                className={`w-12 h-12 rounded-full items-center justify-center ${
                  theme === 'dark'
                    ? 'bg-gray-800/60 border border-gray-700/60'
                    : 'bg-white/60 border border-gray-200/60'
                }`}
              >
                <Trophy
                  size={20}
                  color={theme === 'dark' ? '#FBBF24' : '#F59E0B'}
                />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => setCurrencyModalVisible(true)}
                className={`w-12 h-12 rounded-full items-center justify-center ${
                  theme === 'dark'
                    ? 'bg-gray-800/60 border border-gray-700/60'
                    : 'bg-white/60 border border-gray-200/60'
                }`}
              >
                <Settings
                  size={20}
                  color={theme === 'dark' ? '#10B981' : '#059669'}
                />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={toggleTheme}
                className={`w-12 h-12 rounded-full items-center justify-center ${
                  theme === 'dark'
                    ? 'bg-gray-800/60 border border-gray-700/60'
                    : 'bg-white/60 border border-gray-200/60'
                }`}
              >
                {theme === 'dark' ? (
                  <Sun size={20} color="#F59E0B" />
                ) : (
                  <Moon size={20} color="#6366F1" />
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Level Progress Card */}
        {user && (
          <View className="px-6 mb-6">
            <View
              className={`p-5 rounded-3xl border shadow-md ${
                theme === 'dark'
                  ? 'bg-gradient-to-br bg-purple-900/30 border-purple-700/60 shadow-black/30'
                  : 'bg-gradient-to-br bg-purple-100/50 border-purple-300/60 shadow-purple-200/50'
              }`}
            >
              <View className="flex-row items-center justify-between mb-4">
                <View className="flex-row items-center gap-2">
                  <View className={`w-10 h-10 rounded-full items-center justify-center ${
                    theme === 'dark' ? 'bg-purple-700/50' : 'bg-purple-500/20'
                  }`}>
                    <Trophy size={20} color={theme === 'dark' ? '#A78BFA' : '#7C3AED'} />
                  </View>
                  <View>
                    <Text
                      className={`text-lg font-bold ${
                        theme === 'dark' ? 'text-purple-200' : 'text-purple-900'
                      }`}
                    >
                      Level {user.level}
                    </Text>
                    <Text
                      className={`text-xs ${
                        theme === 'dark' ? 'text-purple-300' : 'text-purple-600'
                      }`}
                    >
                      Finance Champion
                    </Text>
                  </View>
                </View>
                <View className="items-end">
                  <View className="flex-row items-center gap-1">
                    <Zap size={16} color={theme === 'dark' ? '#FBBF24' : '#F59E0B'} fill={theme === 'dark' ? '#FBBF24' : '#F59E0B'} />
                    <Text
                      className={`text-2xl font-bold ${
                        theme === 'dark' ? 'text-purple-100' : 'text-purple-900'
                      }`}
                    >
                      {user.points}
                    </Text>
                  </View>
                  <Text
                    className={`text-xs ${
                      theme === 'dark' ? 'text-purple-300' : 'text-purple-600'
                    }`}
                  >
                    Total Points
                  </Text>
                </View>
              </View>

              <View className="space-y-2">
                <View className="flex-row items-center justify-between mb-2">
                  <Text
                    className={`text-sm ${
                      theme === 'dark' ? 'text-purple-300' : 'text-purple-700'
                    }`}
                  >
                    Progress to Level {levelProgress.nextLevel}
                  </Text>
                  <Text
                    className={`text-sm font-semibold ${
                      theme === 'dark' ? 'text-purple-200' : 'text-purple-900'
                    }`}
                  >
                    {levelProgress.current}/{levelProgress.max}
                  </Text>
                </View>
                <View
                  className={`w-full h-3 rounded-full overflow-hidden ${
                    theme === 'dark' ? 'bg-purple-950/50' : 'bg-purple-200/50'
                  }`}
                >
                  <View
                    className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"
                    style={{ width: `${levelProgress.percent}%` }}
                  />
                </View>
                <View className="flex-row items-center justify-between">
                  <View className="flex-row items-center gap-1">
                    <Star size={12} color={theme === 'dark' ? '#FBBF24' : '#F59E0B'} fill={theme === 'dark' ? '#FBBF24' : '#F59E0B'} />
                    <Text
                      className={`text-xs ${
                        theme === 'dark' ? 'text-purple-300' : 'text-purple-600'
                      }`}
                    >
                      {levelProgress.pointsToNextLevel} pts to next level
                    </Text>
                  </View>
                  <Text
                    className={`text-xs font-bold ${
                      theme === 'dark' ? 'text-purple-200' : 'text-purple-800'
                    }`}
                  >
                    {levelProgress.percent.toFixed(0)}%
                  </Text>
                </View>
              </View>
            </View>
          </View>
        )}

        {/* Single Wallet Display */}
        <View className="px-6 mb-6">
          {wallets.length === 0 ? (
            <TouchableOpacity
              onPress={handleAddWallet}
              className={`p-6 rounded-3xl border border-dashed items-center shadow-md ${
                theme === 'dark'
                  ? 'bg-gray-800/50 border-gray-700 shadow-black/30'
                  : 'bg-white/50 border-gray-300 shadow-gray-200/50'
              }`}
            >
              <WalletIcon
                size={32}
                color={theme === 'dark' ? '#9CA3AF' : '#6B7280'}
              />
              <Text
                className={`mt-3 text-lg font-semibold ${
                  theme === 'dark' ? 'text-gray-100' : 'text-gray-900'
                }`}
              >
                Create Your First Wallet
              </Text>
              <Text
                className={`mt-1 text-center ${
                  theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                }`}
              >
                Start tracking your expenses by creating a wallet
              </Text>
            </TouchableOpacity>
          ) : selectedWallet ? (
            <TouchableOpacity
              onLongPress={handleWalletLongPress}
              activeOpacity={0.7}
              className={`p-6 rounded-3xl border shadow-md ${
                theme === 'dark'
                  ? 'bg-gray-800/50 border-gray-700/60 shadow-black/30'
                  : 'bg-white/50 border-gray-200/60 shadow-gray-200/50'
              }`}
              style={{
                borderLeftWidth: 4,
                borderLeftColor: selectedWallet.wallet_color,
              }}
            >
              <View className="flex-row items-center justify-between mb-3">
                <Text
                  className={`text-base ${
                    theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                  }`}
                >
                  {selectedWallet.wallet_name}
                </Text>
                {wallets.length > 1 && (
                  <View className="flex-row items-center">
                    <Text
                      className={`text-xs ${
                        theme === 'dark' ? 'text-gray-500' : 'text-gray-500'
                      }`}
                    >
                      Long press to change
                    </Text>
                  </View>
                )}
              </View>
              <Text
                className={`text-4xl font-bold mb-4 ${
                  theme === 'dark' ? 'text-gray-100' : 'text-gray-900'
                }`}
              >
                {formatAmount(selectedWallet.balance)}
              </Text>

              {/* Expense Progress Bar */}
              <View className="space-y-2">
                <View className="flex-row items-center justify-between">
                  <Text
                    className={`text-sm ${
                      theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                    }`}
                  >
                    Expense Usage
                  </Text>
                  <Text
                    className={`text-sm font-semibold ${
                      stats.isHighExpense
                        ? 'text-red-500'
                        : theme === 'dark'
                        ? 'text-gray-300'
                        : 'text-gray-700'
                    }`}
                  >
                    {stats.expensePercentage.toFixed(1)}%
                  </Text>
                </View>
                <View
                  className={`w-full h-2 rounded-full ${
                    theme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'
                  }`}
                >
                  <View
                    className={`h-full rounded-full ${
                      stats.isHighExpense
                        ? 'bg-red-500'
                        : 'bg-green-500'
                    }`}
                    style={{ width: `${Math.min(stats.expensePercentage, 100)}%` }}
                  />
                </View>
                {stats.isHighExpense && (
                  <Text className="text-xs text-red-500 font-medium">
                    ⚠️ You&apos;'ve used {stats.expensePercentage.toFixed(0)}% of your wallet balance
                  </Text>
                )}
              </View>
            </TouchableOpacity>
          ) : null}
        </View>

        {/* Stats Cards */}
        {selectedWallet && (
          <View className="px-6 mb-6">
            <View className="flex-row gap-3 mb-3">
              {/* Today's Expense */}
              <View
                className={`flex-1 p-4 rounded-2xl border shadow-md ${
                  theme === 'dark'
                    ? 'bg-gray-800/50 border-gray-700/60 shadow-black/30'
                    : 'bg-white/50 border-gray-200/60 shadow-gray-200/50'
                }`}
              >
                <View className="flex-row items-center gap-2 mb-2">
                  <View className="w-8 h-8 rounded-full bg-red-500/20 items-center justify-center">
                    <ArrowDownRight size={16} color="#EF4444" />
                  </View>
                  <Text
                    className={`text-sm ${
                      theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                    }`}
                  >
                    Today
                  </Text>
                </View>
                <Text
                  className={`text-xl font-bold ${
                    theme === 'dark' ? 'text-gray-100' : 'text-gray-900'
                  }`}
                >
                  {formatAmount(stats.todayExpense)}
                </Text>
                <Text
                  className={`text-xs ${
                    theme === 'dark' ? 'text-gray-500' : 'text-gray-500'
                  }`}
                >
                  Expense
                </Text>
              </View>

              {/* Today's Income */}
              <View
                className={`flex-1 p-4 rounded-2xl border shadow-md ${
                  theme === 'dark'
                    ? 'bg-gray-800/50 border-gray-700/60 shadow-black/30'
                    : 'bg-white/50 border-gray-200/60 shadow-gray-200/50'
                }`}
              >
                <View className="flex-row items-center gap-2 mb-2">
                  <View className="w-8 h-8 rounded-full bg-green-500/20 items-center justify-center">
                    <ArrowUpRight size={16} color="#10B981" />
                  </View>
                  <Text
                    className={`text-sm ${
                      theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                    }`}
                  >
                    Today
                  </Text>
                </View>
                <Text
                  className={`text-xl font-bold ${
                    theme === 'dark' ? 'text-gray-100' : 'text-gray-900'
                  }`}
                >
                  {formatAmount(stats.todayIncome)}
                </Text>
                <Text
                  className={`text-xs ${
                    theme === 'dark' ? 'text-gray-500' : 'text-gray-500'
                  }`}
                >
                  Income
                </Text>
              </View>
            </View>

            {/* Total Stats */}
            <View className="flex-row gap-3 mb-6">
              {/* Total Income */}
              <View
                className={`flex-1 p-4 rounded-2xl border shadow-md ${
                  theme === 'dark'
                    ? 'bg-gray-800/50 border-gray-700/60 shadow-black/30'
                    : 'bg-white/50 border-gray-200/60 shadow-gray-200/50'
                }`}
              >
                <Text
                  className={`text-sm mb-1 ${
                    theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                  }`}
                >
                  Total Income
                </Text>
                <Text className={`text-xl font-bold text-green-500`}>
                  {formatAmount(stats.totalIncome)}
                </Text>
              </View>

              {/* Total Expense */}
              <View
                className={`flex-1 p-4 rounded-2xl border shadow-md ${
                  theme === 'dark'
                    ? 'bg-gray-800/50 border-gray-700/60 shadow-black/30'
                    : 'bg-white/50 border-gray-200/60 shadow-gray-200/50'
                }`}
              >
                <Text
                  className={`text-sm mb-1 ${
                    theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                  }`}
                >
                  Total Expense
                </Text>
                <Text className={`text-xl font-bold text-red-500`}>
                  {formatAmount(stats.totalExpense)}
                </Text>
              </View>
            </View>

            {/* Chart */}
            <View className="mb-6">
              <Text
                className={`text-xl font-bold mb-4 ${
                  theme === 'dark' ? 'text-gray-100' : 'text-gray-900'
                }`}
              >
                Top Expenses
              </Text>
              <SimpleChart data={chartData} maxValue={maxChartValue} />
            </View>
          </View>
        )}

        {/* Recent Transactions */}
        {selectedWallet && (
          <View className="px-6 mb-24">
            <View className="flex-row items-center justify-between mb-4">
              <Text
                className={`text-xl font-bold ${
                  theme === 'dark' ? 'text-gray-100' : 'text-gray-900'
                }`}
              >
                Recent Transactions
              </Text>
            </View>

            {transactionLoading ? (
              <View className="py-8 items-center">
                <ActivityIndicator
                  color={theme === 'dark' ? '#3B82F6' : '#1D4ED8'}
                />
              </View>
            ) : recentTransactions.length === 0 ? (
              <View
                className={`p-6 rounded-2xl border border-dashed items-center ${
                  theme === 'dark'
                    ? 'bg-gray-800/30 border-gray-700'
                    : 'bg-white/30 border-gray-300'
                }`}
              >
                <Text
                  className={`text-center ${
                    theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                  }`}
                >
                  No transactions yet. Use the + tab to add transactions!
                </Text>
              </View>
            ) : (
              <View className="gap-3">
                {recentTransactions.map((transaction) => (
                  <View
                    key={transaction.id}
                    className={`p-4 rounded-2xl border shadow-md ${
                      theme === 'dark'
                        ? 'bg-gray-800/50 border-gray-700/60 shadow-black/30'
                        : 'bg-white/50 border-gray-200/60 shadow-gray-200/50'
                    }`}
                  >
                    <View className="flex-row items-center justify-between">
                      <View className="flex-1">
                        <Text
                          className={`text-base font-semibold mb-1 ${
                            theme === 'dark' ? 'text-gray-100' : 'text-gray-900'
                          }`}
                        >
                          {transaction.category}
                        </Text>
                        <Text
                          className={`text-sm ${
                            theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                          }`}
                        >
                          {transaction.note || transaction.payment_method}
                        </Text>
                        <Text
                          className={`text-xs mt-1 ${
                            theme === 'dark' ? 'text-gray-500' : 'text-gray-500'
                          }`}
                        >
                          {new Date(transaction.date).toLocaleDateString()}
                        </Text>
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
                  </View>
                ))}
              </View>
            )}
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
              {wallets.length > 1 && (
                <TouchableOpacity
                  onPress={handleChangeWallet}
                  className={`flex-row items-center p-4 rounded-2xl mb-2 ${
                    theme === 'dark' ? 'bg-gray-700/50' : 'bg-gray-100/50'
                  }`}
                >
                  <Repeat
                    size={20}
                    color={theme === 'dark' ? '#3B82F6' : '#1D4ED8'}
                  />
                  <Text
                    className={`text-base font-semibold ml-3 ${
                      theme === 'dark' ? 'text-gray-100' : 'text-gray-900'
                    }`}
                  >
                    Change Wallet
                  </Text>
                </TouchableOpacity>
              )}

              <TouchableOpacity
                onPress={handleEditWallet}
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
                  Edit Wallet
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={handleAddWallet}
                className={`flex-row items-center p-4 rounded-2xl mb-2 ${
                  theme === 'dark' ? 'bg-gray-700/50' : 'bg-gray-100/50'
                }`}
              >
                <Plus
                  size={20}
                  color={theme === 'dark' ? '#10B981' : '#059669'}
                />
                <Text
                  className={`text-base font-semibold ml-3 ${
                    theme === 'dark' ? 'text-gray-100' : 'text-gray-900'
                  }`}
                >
                  Add New Wallet
                </Text>
              </TouchableOpacity>

              {wallets.length > 1 && (
                <TouchableOpacity
                  onPress={handleDeleteWallet}
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
                    Delete Wallet
                  </Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        </TouchableOpacity>
      </Modal>

      {/* Wallet Selector Modal */}
      <Modal
        visible={walletSelectorVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setWalletSelectorVisible(false)}
      >
        <View className="flex-1 bg-black/50">
          <TouchableOpacity
            className="flex-1"
            activeOpacity={1}
            onPress={() => setWalletSelectorVisible(false)}
          />
          <View
            className={`rounded-t-3xl p-6 ${
              theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'
            }`}
            style={{ maxHeight: '70%' }}
          >
            <Text
              className={`text-2xl font-bold mb-6 ${
                theme === 'dark' ? 'text-gray-100' : 'text-gray-900'
              }`}
            >
              Select Wallet
            </Text>
            <ScrollView showsVerticalScrollIndicator={false}>
              {wallets.map((wallet) => (
                <TouchableOpacity
                  key={wallet.id}
                  onPress={() => handleSelectWallet(wallet)}
                  className={`p-4 rounded-2xl border mb-3 ${
                    selectedWallet?.id === wallet.id
                      ? theme === 'dark'
                        ? 'bg-gray-700/70 border-gray-600'
                        : 'bg-gray-100/70 border-gray-300'
                      : theme === 'dark'
                      ? 'bg-gray-800/50 border-gray-700'
                      : 'bg-white/50 border-gray-200'
                  }`}
                  style={{
                    borderLeftWidth: 4,
                    borderLeftColor: wallet.wallet_color,
                  }}
                >
                  <View className="flex-row items-center justify-between">
                    <View className="flex-1">
                      <Text
                        className={`text-lg font-semibold mb-1 ${
                          theme === 'dark' ? 'text-gray-100' : 'text-gray-900'
                        }`}
                      >
                        {wallet.wallet_name}
                      </Text>
                      <Text
                        className={`text-2xl font-bold ${
                          theme === 'dark' ? 'text-gray-100' : 'text-gray-900'
                        }`}
                      >
                        {formatAmount(wallet.balance)}
                      </Text>
                    </View>
                    {selectedWallet?.id === wallet.id && (
                      <View className="w-6 h-6 rounded-full bg-blue-500 items-center justify-center">
                        <Text className="text-white font-bold">✓</Text>
                      </View>
                    )}
                  </View>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* Modals */}
      <WalletModal
        visible={walletModalVisible}
        onClose={handleCloseWalletModal}
        onSave={handleSaveWallet}
        wallet={editingWallet}
        onDelete={wallets.length > 1 ? deleteWallet : undefined}
      />

      <TransactionModal
        visible={transactionModalVisible}
        onClose={() => setTransactionModalVisible(false)}
        onSave={handleSaveTransaction}
        wallets={wallets}
        onPickImage={pickImage}
      />

      <CurrencyModal
        visible={currencyModalVisible}
        onClose={() => setCurrencyModalVisible(false)}
      />

      <ChartsModal
        visible={chartsModalVisible}
        onClose={() => setChartsModalVisible(false)}
      />

      <LeaderboardModal
        visible={leaderboardModalVisible}
        onClose={() => setLeaderboardModalVisible(false)}
      />
    </SafeAreaView>
  )
}
