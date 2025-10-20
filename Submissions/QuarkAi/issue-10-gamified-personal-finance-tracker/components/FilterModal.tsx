import { useThemeContext } from '@/context/themeContext'
import {
    Calendar,
    DollarSign,
    Filter as FilterIcon,
    Search,
    Tag,
    TrendingDown,
    TrendingUp,
    X
} from 'lucide-react-native'
import React, { useState } from 'react'
import {
    Modal,
    ScrollView,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

export interface FilterOptions {
  searchQuery: string
  type: 'all' | 'income' | 'expense'
  categories: string[]
  dateRange: 'all' | 'today' | 'week' | 'month' | 'year'
  amountRange: {
    min: string
    max: string
  }
  sortBy: 'date' | 'amount' | 'category'
  sortOrder: 'asc' | 'desc'
}

interface FilterModalProps {
  visible: boolean
  onClose: () => void
  onApply: (filters: FilterOptions) => void
  availableCategories: string[]
  currentFilters: FilterOptions
}

export default function FilterModal({
  visible,
  onClose,
  onApply,
  availableCategories,
  currentFilters,
}: FilterModalProps) {
  const { theme } = useThemeContext()
  const [filters, setFilters] = useState<FilterOptions>(currentFilters)

  const handleReset = () => {
    const resetFilters: FilterOptions = {
      searchQuery: '',
      type: 'all',
      categories: [],
      dateRange: 'all',
      amountRange: { min: '', max: '' },
      sortBy: 'date',
      sortOrder: 'desc',
    }
    setFilters(resetFilters)
  }

  const handleApply = () => {
    onApply(filters)
    onClose()
  }

  const toggleCategory = (category: string) => {
    setFilters((prev) => ({
      ...prev,
      categories: prev.categories.includes(category)
        ? prev.categories.filter((c) => c !== category)
        : [...prev.categories, category],
    }))
  }

  const getCategoryEmoji = (category: string) => {
    const emojiMap: Record<string, string> = {
      Food: '🍔',
      Transport: '🚗',
      Shopping: '🛍️',
      Bills: '📄',
      Salary: '💰',
      Business: '💼',
      Entertainment: '🎮',
      Health: '🏥',
      Education: '📚',
      Other: '📊',
    }
    return emojiMap[category] || '📊'
  }

  return (
    <Modal visible={visible} animationType="slide" onRequestClose={onClose}>
      <SafeAreaView
        className={`flex-1 ${theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'}`}
      >
        <View className="flex-1">
          {/* Header */}
          <View
            className={`px-6 pt-4 pb-4 border-b ${
              theme === 'dark' ? 'border-gray-800' : 'border-gray-200'
            }`}
          >
            <View className="flex-row items-center justify-between mb-4">
              <View className="flex-row items-center gap-3">
                <View
                  className={`w-12 h-12 rounded-full items-center justify-center ${
                    theme === 'dark'
                      ? 'bg-gray-800/60 border border-gray-700/60'
                      : 'bg-white/60 border border-gray-200/60'
                  }`}
                >
                  <FilterIcon
                    size={20}
                    color={theme === 'dark' ? '#3B82F6' : '#1D4ED8'}
                  />
                </View>
                <Text
                  className={`text-3xl font-bold ${
                    theme === 'dark' ? 'text-gray-100' : 'text-gray-900'
                  }`}
                >
                  Filters
                </Text>
              </View>
              <TouchableOpacity
                onPress={onClose}
                className={`w-12 h-12 rounded-full items-center justify-center ${
                  theme === 'dark' ? 'bg-gray-800/60' : 'bg-gray-200/60'
                }`}
              >
                <X size={24} color={theme === 'dark' ? '#F3F4F6' : '#111827'} />
              </TouchableOpacity>
            </View>
          </View>

          <ScrollView
            className="flex-1 px-6"
            showsVerticalScrollIndicator={false}
          >
            <View className="py-6 gap-6">
              {/* Search */}
              <View>
                <View className="flex-row items-center gap-2 mb-3">
                  <Search
                    size={18}
                    color={theme === 'dark' ? '#9CA3AF' : '#6B7280'}
                  />
                  <Text
                    className={`text-base font-semibold ${
                      theme === 'dark' ? 'text-gray-200' : 'text-gray-800'
                    }`}
                  >
                    Search
                  </Text>
                </View>
                <View
                  className={`flex-row items-center px-4 py-3 rounded-2xl border ${
                    theme === 'dark'
                      ? 'bg-gray-800/50 border-gray-700/60'
                      : 'bg-white/50 border-gray-200/60'
                  }`}
                >
                  <Search
                    size={20}
                    color={theme === 'dark' ? '#6B7280' : '#9CA3AF'}
                  />
                  <TextInput
                    value={filters.searchQuery}
                    onChangeText={(text) =>
                      setFilters((prev) => ({ ...prev, searchQuery: text }))
                    }
                    placeholder="Search by category or note..."
                    placeholderTextColor={theme === 'dark' ? '#6B7280' : '#9CA3AF'}
                    className={`flex-1 ml-3 text-base ${
                      theme === 'dark' ? 'text-gray-100' : 'text-gray-900'
                    }`}
                  />
                  {filters.searchQuery.length > 0 && (
                    <TouchableOpacity
                      onPress={() =>
                        setFilters((prev) => ({ ...prev, searchQuery: '' }))
                      }
                    >
                      <X size={20} color="#6B7280" />
                    </TouchableOpacity>
                  )}
                </View>
              </View>

              {/* Transaction Type */}
              <View>
                <View className="flex-row items-center gap-2 mb-3">
                  <TrendingUp
                    size={18}
                    color={theme === 'dark' ? '#9CA3AF' : '#6B7280'}
                  />
                  <Text
                    className={`text-base font-semibold ${
                      theme === 'dark' ? 'text-gray-200' : 'text-gray-800'
                    }`}
                  >
                    Transaction Type
                  </Text>
                </View>
                <View className="flex-row gap-2">
                  {(['all', 'income', 'expense'] as const).map((type) => (
                    <TouchableOpacity
                      key={type}
                      onPress={() =>
                        setFilters((prev) => ({ ...prev, type }))
                      }
                      className={`flex-1 py-3 rounded-2xl border ${
                        filters.type === type
                          ? type === 'income'
                            ? 'bg-green-500 border-green-500'
                            : type === 'expense'
                            ? 'bg-red-500 border-red-500'
                            : 'bg-blue-500 border-blue-500'
                          : theme === 'dark'
                          ? 'bg-gray-800/60 border-gray-700'
                          : 'bg-white/60 border-gray-200'
                      }`}
                    >
                      <Text
                        className={`text-center font-semibold capitalize ${
                          filters.type === type
                            ? 'text-white'
                            : theme === 'dark'
                            ? 'text-gray-400'
                            : 'text-gray-600'
                        }`}
                      >
                        {type}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              {/* Categories */}
              {availableCategories.length > 0 && (
                <View>
                  <View className="flex-row items-center gap-2 mb-3">
                    <Tag
                      size={18}
                      color={theme === 'dark' ? '#9CA3AF' : '#6B7280'}
                    />
                    <Text
                      className={`text-base font-semibold ${
                        theme === 'dark' ? 'text-gray-200' : 'text-gray-800'
                      }`}
                    >
                      Categories
                    </Text>
                    {filters.categories.length > 0 && (
                      <View className="px-2 py-1 rounded-full bg-blue-500">
                        <Text className="text-xs font-bold text-white">
                          {filters.categories.length}
                        </Text>
                      </View>
                    )}
                  </View>
                  <View className="flex-row flex-wrap gap-2">
                    {availableCategories.map((category) => {
                      const isSelected = filters.categories.includes(category)
                      return (
                        <TouchableOpacity
                          key={category}
                          onPress={() => toggleCategory(category)}
                          className={`px-4 py-2 rounded-full border flex-row items-center gap-2 ${
                            isSelected
                              ? 'bg-blue-500 border-blue-500'
                              : theme === 'dark'
                              ? 'bg-gray-800/60 border-gray-700'
                              : 'bg-white/60 border-gray-200'
                          }`}
                        >
                          <Text className="text-base">
                            {getCategoryEmoji(category)}
                          </Text>
                          <Text
                            className={`font-medium ${
                              isSelected
                                ? 'text-white'
                                : theme === 'dark'
                                ? 'text-gray-300'
                                : 'text-gray-700'
                            }`}
                          >
                            {category}
                          </Text>
                        </TouchableOpacity>
                      )
                    })}
                  </View>
                </View>
              )}

              {/* Date Range */}
              <View>
                <View className="flex-row items-center gap-2 mb-3">
                  <Calendar
                    size={18}
                    color={theme === 'dark' ? '#9CA3AF' : '#6B7280'}
                  />
                  <Text
                    className={`text-base font-semibold ${
                      theme === 'dark' ? 'text-gray-200' : 'text-gray-800'
                    }`}
                  >
                    Date Range
                  </Text>
                </View>
                <View className="flex-row flex-wrap gap-2">
                  {(['all', 'today', 'week', 'month', 'year'] as const).map(
                    (range) => (
                      <TouchableOpacity
                        key={range}
                        onPress={() =>
                          setFilters((prev) => ({ ...prev, dateRange: range }))
                        }
                        className={`px-4 py-2 rounded-full border ${
                          filters.dateRange === range
                            ? 'bg-blue-500 border-blue-500'
                            : theme === 'dark'
                            ? 'bg-gray-800/60 border-gray-700'
                            : 'bg-white/60 border-gray-200'
                        }`}
                      >
                        <Text
                          className={`font-medium capitalize ${
                            filters.dateRange === range
                              ? 'text-white'
                              : theme === 'dark'
                              ? 'text-gray-300'
                              : 'text-gray-700'
                          }`}
                        >
                          {range === 'all' ? 'All Time' : range === 'today' ? 'Today' : `This ${range}`}
                        </Text>
                      </TouchableOpacity>
                    )
                  )}
                </View>
              </View>

              {/* Amount Range */}
              <View>
                <View className="flex-row items-center gap-2 mb-3">
                  <DollarSign
                    size={18}
                    color={theme === 'dark' ? '#9CA3AF' : '#6B7280'}
                  />
                  <Text
                    className={`text-base font-semibold ${
                      theme === 'dark' ? 'text-gray-200' : 'text-gray-800'
                    }`}
                  >
                    Amount Range
                  </Text>
                </View>
                <View className="flex-row gap-2">
                  <View className="flex-1">
                    <Text
                      className={`text-sm mb-2 ${
                        theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                      }`}
                    >
                      Min Amount
                    </Text>
                    <View
                      className={`flex-row items-center px-4 py-3 rounded-2xl border ${
                        theme === 'dark'
                          ? 'bg-gray-800/50 border-gray-700/60'
                          : 'bg-white/50 border-gray-200/60'
                      }`}
                    >
                      <Text
                        className={`mr-2 ${
                          theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                        }`}
                      >
                        $
                      </Text>
                      <TextInput
                        value={filters.amountRange.min}
                        onChangeText={(text) =>
                          setFilters((prev) => ({
                            ...prev,
                            amountRange: { ...prev.amountRange, min: text },
                          }))
                        }
                        placeholder="0"
                        placeholderTextColor={
                          theme === 'dark' ? '#6B7280' : '#9CA3AF'
                        }
                        keyboardType="numeric"
                        className={`flex-1 text-base ${
                          theme === 'dark' ? 'text-gray-100' : 'text-gray-900'
                        }`}
                      />
                    </View>
                  </View>
                  <View className="flex-1">
                    <Text
                      className={`text-sm mb-2 ${
                        theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                      }`}
                    >
                      Max Amount
                    </Text>
                    <View
                      className={`flex-row items-center px-4 py-3 rounded-2xl border ${
                        theme === 'dark'
                          ? 'bg-gray-800/50 border-gray-700/60'
                          : 'bg-white/50 border-gray-200/60'
                      }`}
                    >
                      <Text
                        className={`mr-2 ${
                          theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                        }`}
                      >
                        $
                      </Text>
                      <TextInput
                        value={filters.amountRange.max}
                        onChangeText={(text) =>
                          setFilters((prev) => ({
                            ...prev,
                            amountRange: { ...prev.amountRange, max: text },
                          }))
                        }
                        placeholder="∞"
                        placeholderTextColor={
                          theme === 'dark' ? '#6B7280' : '#9CA3AF'
                        }
                        keyboardType="numeric"
                        className={`flex-1 text-base ${
                          theme === 'dark' ? 'text-gray-100' : 'text-gray-900'
                        }`}
                      />
                    </View>
                  </View>
                </View>
              </View>

              {/* Sort Options */}
              <View>
                <View className="flex-row items-center gap-2 mb-3">
                  <TrendingDown
                    size={18}
                    color={theme === 'dark' ? '#9CA3AF' : '#6B7280'}
                  />
                  <Text
                    className={`text-base font-semibold ${
                      theme === 'dark' ? 'text-gray-200' : 'text-gray-800'
                    }`}
                  >
                    Sort By
                  </Text>
                </View>
                <View className="flex-row gap-2 mb-2">
                  {(['date', 'amount', 'category'] as const).map((sort) => (
                    <TouchableOpacity
                      key={sort}
                      onPress={() =>
                        setFilters((prev) => ({ ...prev, sortBy: sort }))
                      }
                      className={`flex-1 py-3 rounded-2xl border ${
                        filters.sortBy === sort
                          ? 'bg-blue-500 border-blue-500'
                          : theme === 'dark'
                          ? 'bg-gray-800/60 border-gray-700'
                          : 'bg-white/60 border-gray-200'
                      }`}
                    >
                      <Text
                        className={`text-center font-semibold capitalize ${
                          filters.sortBy === sort
                            ? 'text-white'
                            : theme === 'dark'
                            ? 'text-gray-400'
                            : 'text-gray-600'
                        }`}
                      >
                        {sort}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
                <View className="flex-row gap-2">
                  {(['asc', 'desc'] as const).map((order) => (
                    <TouchableOpacity
                      key={order}
                      onPress={() =>
                        setFilters((prev) => ({ ...prev, sortOrder: order }))
                      }
                      className={`flex-1 py-3 rounded-2xl border ${
                        filters.sortOrder === order
                          ? 'bg-blue-500 border-blue-500'
                          : theme === 'dark'
                          ? 'bg-gray-800/60 border-gray-700'
                          : 'bg-white/60 border-gray-200'
                      }`}
                    >
                      <Text
                        className={`text-center font-semibold ${
                          filters.sortOrder === order
                            ? 'text-white'
                            : theme === 'dark'
                            ? 'text-gray-400'
                            : 'text-gray-600'
                        }`}
                      >
                        {order === 'asc' ? '↑ Ascending' : '↓ Descending'}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            </View>
          </ScrollView>

          {/* Bottom Actions */}
          <View
            className={`px-6 py-4 border-t ${
              theme === 'dark' ? 'border-gray-800' : 'border-gray-200'
            }`}
          >
            <View className="flex-row gap-3">
              <TouchableOpacity
                onPress={handleReset}
                className={`flex-1 py-4 rounded-2xl border ${
                  theme === 'dark'
                    ? 'bg-gray-800 border-gray-700'
                    : 'bg-white border-gray-200'
                }`}
              >
                <Text
                  className={`text-center font-bold text-base ${
                    theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                  }`}
                >
                  Reset
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={handleApply}
                className="flex-1 py-4 rounded-2xl bg-blue-500"
              >
                <Text className="text-center font-bold text-base text-white">
                  Apply Filters
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </SafeAreaView>
    </Modal>
  )
}
