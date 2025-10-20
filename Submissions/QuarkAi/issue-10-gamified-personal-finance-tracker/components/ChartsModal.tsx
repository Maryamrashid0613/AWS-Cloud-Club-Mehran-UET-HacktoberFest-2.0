import { useThemeContext } from '@/context/themeContext'
import { supabase } from '@/utils/supabase'
import { useAuth } from '@clerk/clerk-expo'
import { File, Paths } from 'expo-file-system'
import { printToFileAsync } from 'expo-print'
import * as Sharing from 'expo-sharing'
import { BarChart3, Download, LineChart as LineChartIcon, PieChart as PieChartIcon, TrendingUp, X } from 'lucide-react-native'
import React, { useEffect, useState } from 'react'
import { ActivityIndicator, Alert, Dimensions, Modal, ScrollView, Text, TouchableOpacity, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

interface ChartsModalProps {
  visible: boolean
  onClose: () => void
}

type TimePeriod = 'weekly' | 'monthly' | 'yearly'

interface Transaction {
  id: number
  type: 'income' | 'expense'
  amount: number
  category: string
  date: string
}

const { width } = Dimensions.get('window')

export default function ChartsModal({ visible, onClose }: ChartsModalProps) {
  const { theme } = useThemeContext()
  const { userId } = useAuth()
  const [timePeriod, setTimePeriod] = useState<TimePeriod>('monthly')
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [loading, setLoading] = useState(false)
  const [exporting, setExporting] = useState(false)

  useEffect(() => {
    if (visible && userId) {
      fetchTransactions()
    }
  }, [visible, userId, timePeriod])

  const fetchTransactions = async () => {
    try {
      setLoading(true)
      const now = new Date()
      let startDate = new Date()

      if (timePeriod === 'weekly') {
        startDate.setDate(now.getDate() - 7)
      } else if (timePeriod === 'monthly') {
        startDate.setMonth(now.getMonth() - 1)
      } else {
        startDate.setFullYear(now.getFullYear() - 1)
      }

      const { data, error } = await supabase
        .from('transactions')
        .select('id, type, amount, category, date')
        .eq('user_id', userId)
        .gte('date', startDate.toISOString())
        .order('date', { ascending: true })

      if (error) throw error

      setTransactions(data || [])
    } catch (error) {
      console.error('Error fetching transactions:', error)
    } finally {
      setLoading(false)
    }
  }

  const getCategoryData = () => {
    const categoryMap = new Map<string, number>()
    
    transactions
      .filter((t) => t.type === 'expense')
      .forEach((t) => {
        const current = categoryMap.get(t.category) || 0
        categoryMap.set(t.category, current + Number(t.amount))
      })

    return Array.from(categoryMap.entries())
      .map(([category, amount]) => ({ category, amount }))
      .sort((a, b) => b.amount - a.amount)
      .slice(0, 5)
  }

  const getTimeSeriesData = () => {
    const dataMap = new Map<string, { income: number; expense: number }>()
    
    transactions.forEach((t) => {
      const date = new Date(t.date)
      let key = ''
      
      if (timePeriod === 'weekly') {
        key = date.toLocaleDateString('en-US', { weekday: 'short' })
      } else if (timePeriod === 'monthly') {
        key = date.toLocaleDateString('en-US', { day: 'numeric', month: 'short' })
      } else {
        key = date.toLocaleDateString('en-US', { month: 'short', year: '2-digit' })
      }
      
      if (!dataMap.has(key)) {
        dataMap.set(key, { income: 0, expense: 0 })
      }
      
      const current = dataMap.get(key)!
      if (t.type === 'income') {
        current.income += Number(t.amount)
      } else {
        current.expense += Number(t.amount)
      }
    })

    return Array.from(dataMap.entries()).map(([label, values]) => ({
      label,
      income: values.income,
      expense: values.expense,
    }))
  }

  const categoryData = getCategoryData()
  const timeSeriesData = getTimeSeriesData()

  const colors = ['#EF4444', '#F59E0B', '#10B981', '#3B82F6', '#8B5CF6']
  const totalExpense = categoryData.reduce((sum, item) => sum + item.amount, 0)

  const maxValue = Math.max(
    ...timeSeriesData.map((d) => Math.max(d.income, d.expense)),
    1
  )

  const exportToCSV = async () => {
    try {
      setExporting(true)
      
      // Create CSV content
      let csvContent = 'Date,Type,Category,Amount\n'
      
      transactions.forEach((transaction) => {
        const date = new Date(transaction.date).toLocaleDateString()
        csvContent += `${date},${transaction.type},${transaction.category},${transaction.amount}\n`
      })
      
      // Add summary section
      csvContent += '\n\nSummary\n'
      csvContent += `Total Income,${timeSeriesData.reduce((sum, d) => sum + d.income, 0).toFixed(2)}\n`
      csvContent += `Total Expense,${timeSeriesData.reduce((sum, d) => sum + d.expense, 0).toFixed(2)}\n`
      csvContent += `Net Balance,${timeSeriesData.reduce((sum, d) => sum + d.income - d.expense, 0).toFixed(2)}\n`
      
      // Add category breakdown
      csvContent += '\n\nCategory Breakdown\n'
      csvContent += 'Category,Amount,Percentage\n'
      categoryData.forEach((item) => {
        const percentage = ((item.amount / totalExpense) * 100).toFixed(1)
        csvContent += `${item.category},${item.amount.toFixed(2)},${percentage}%\n`
      })
      
      // Save file using new expo-file-system API
      const fileName = `financial_report_${timePeriod}_${Date.now()}.csv`
      const file = new File(Paths.cache, fileName)
      await file.write(csvContent)
      
      // Share file
      const canShare = await Sharing.isAvailableAsync()
      if (canShare) {
        await Sharing.shareAsync(file.uri)
        Alert.alert('Success', 'CSV file exported successfully!')
      } else {
        Alert.alert('Error', 'Sharing is not available on this device')
      }
    } catch (error) {
      console.error('Error exporting CSV:', error)
      Alert.alert('Error', 'Failed to export CSV file')
    } finally {
      setExporting(false)
    }
  }

  const exportToPDF = async () => {
    try {
      setExporting(true)
      
      // Create HTML content for PDF
      const totalIncome = timeSeriesData.reduce((sum, d) => sum + d.income, 0)
      const totalExpense = timeSeriesData.reduce((sum, d) => sum + d.expense, 0)
      const netBalance = totalIncome - totalExpense
      
      const html = `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <title>Financial Report</title>
          <style>
            body {
              font-family: 'Helvetica', 'Arial', sans-serif;
              padding: 40px;
              color: #333;
            }
            .header {
              text-align: center;
              margin-bottom: 40px;
              border-bottom: 3px solid #3B82F6;
              padding-bottom: 20px;
            }
            .header h1 {
              color: #1D4ED8;
              margin: 0;
              font-size: 32px;
            }
            .header p {
              color: #6B7280;
              margin: 10px 0 0 0;
              font-size: 14px;
            }
            .summary {
              background: #F3F4F6;
              padding: 20px;
              border-radius: 10px;
              margin-bottom: 30px;
            }
            .summary h2 {
              color: #1F2937;
              margin-top: 0;
              font-size: 20px;
            }
            .summary-grid {
              display: grid;
              grid-template-columns: 1fr 1fr 1fr;
              gap: 20px;
              margin-top: 15px;
            }
            .summary-item {
              text-align: center;
              padding: 15px;
              background: white;
              border-radius: 8px;
            }
            .summary-label {
              font-size: 12px;
              color: #6B7280;
              margin-bottom: 5px;
            }
            .summary-value {
              font-size: 24px;
              font-weight: bold;
            }
            .income { color: #10B981; }
            .expense { color: #EF4444; }
            .balance { color: ${netBalance >= 0 ? '#10B981' : '#EF4444'}; }
            table {
              width: 100%;
              border-collapse: collapse;
              margin-bottom: 30px;
            }
            th {
              background: #1D4ED8;
              color: white;
              padding: 12px;
              text-align: left;
              font-size: 12px;
              text-transform: uppercase;
            }
            td {
              padding: 10px 12px;
              border-bottom: 1px solid #E5E7EB;
              font-size: 14px;
            }
            tr:hover {
              background: #F9FAFB;
            }
            .section-title {
              color: #1F2937;
              margin-top: 30px;
              margin-bottom: 15px;
              font-size: 18px;
              border-left: 4px solid #3B82F6;
              padding-left: 15px;
            }
            .footer {
              margin-top: 40px;
              padding-top: 20px;
              border-top: 1px solid #E5E7EB;
              text-align: center;
              color: #6B7280;
              font-size: 12px;
            }
            .category-item {
              display: flex;
              justify-content: space-between;
              padding: 10px;
              border-bottom: 1px solid #E5E7EB;
            }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>📊 Financial Report</h1>
            <p>Period: ${timePeriod.charAt(0).toUpperCase() + timePeriod.slice(1)} | Generated: ${new Date().toLocaleDateString()}</p>
          </div>

          <div class="summary">
            <h2>Summary</h2>
            <div class="summary-grid">
              <div class="summary-item">
                <div class="summary-label">Total Income</div>
                <div class="summary-value income">$${totalIncome.toFixed(2)}</div>
              </div>
              <div class="summary-item">
                <div class="summary-label">Total Expense</div>
                <div class="summary-value expense">$${totalExpense.toFixed(2)}</div>
              </div>
              <div class="summary-item">
                <div class="summary-label">Net Balance</div>
                <div class="summary-value balance">$${netBalance.toFixed(2)}</div>
              </div>
            </div>
          </div>

          <h3 class="section-title">Transaction History</h3>
          <table>
            <thead>
              <tr>
                <th>Date</th>
                <th>Type</th>
                <th>Category</th>
                <th>Amount</th>
              </tr>
            </thead>
            <tbody>
              ${transactions.map((t) => `
                <tr>
                  <td>${new Date(t.date).toLocaleDateString()}</td>
                  <td style="color: ${t.type === 'income' ? '#10B981' : '#EF4444'}; font-weight: 600;">
                    ${t.type.charAt(0).toUpperCase() + t.type.slice(1)}
                  </td>
                  <td>${t.category}</td>
                  <td style="font-weight: 600;">$${Number(t.amount).toFixed(2)}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>

          ${categoryData.length > 0 ? `
            <h3 class="section-title">Expense by Category</h3>
            <table>
              <thead>
                <tr>
                  <th>Category</th>
                  <th>Amount</th>
                  <th>Percentage</th>
                </tr>
              </thead>
              <tbody>
                ${categoryData.map((item) => {
                  const percentage = ((item.amount / totalExpense) * 100).toFixed(1)
                  return `
                    <tr>
                      <td>${item.category}</td>
                      <td style="font-weight: 600;">$${item.amount.toFixed(2)}</td>
                      <td>${percentage}%</td>
                    </tr>
                  `
                }).join('')}
              </tbody>
            </table>
          ` : ''}

          <div class="footer">
            <p>Gamified Personal Finance Tracker | This report is auto-generated</p>
          </div>
        </body>
        </html>
      `
      
     
      const { uri } = await printToFileAsync({
        html,
        base64: false,
      })
      
     
      const canShare = await Sharing.isAvailableAsync()
      if (canShare) {
        await Sharing.shareAsync(uri, {
          UTI: '.pdf',
          mimeType: 'application/pdf',
        })
        Alert.alert('Success', 'PDF file exported successfully!')
      } else {
        Alert.alert('Error', 'Sharing is not available on this device')
      }
    } catch (error) {
      console.error('Error exporting PDF:', error)
      Alert.alert('Error', 'Failed to export PDF file')
    } finally {
      setExporting(false)
    }
  }

  const showExportOptions = () => {
    Alert.alert(
      'Export Financial Data',
      'Choose export format',
      [
        {
          text: 'CSV',
          onPress: exportToCSV,
        },
        {
          text: 'PDF',
          onPress: exportToPDF,
        },
        {
          text: 'Cancel',
          style: 'cancel',
        },
      ],
      { cancelable: true }
    )
  }

  return (
    <Modal
      visible={visible}
      animationType="slide"
      onRequestClose={onClose}
    >
      <SafeAreaView className={`flex-1 ${theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'}`}>
        <View className="flex-1">
          <View className={`px-6 pt-4 pb-4 border-b ${
            theme === 'dark' ? 'border-gray-800' : 'border-gray-200'
          }`}>
            <View className="flex-row items-center justify-between mb-4">
              <View className="flex-row items-center gap-3">
                <View className={`w-12 h-12 rounded-full items-center justify-center ${
                  theme === 'dark'
                    ? 'bg-gray-800/60 border border-gray-700/60'
                    : 'bg-white/60 border border-gray-200/60'
                }`}>
                  <BarChart3 size={20} color={theme === 'dark' ? '#3B82F6' : '#1D4ED8'} />
                </View>
                <Text
                  className={`text-3xl font-bold ${
                    theme === 'dark' ? 'text-gray-100' : 'text-gray-900'
                  }`}
                >
                  Analytics
                </Text>
              </View>
              <View className="flex-row gap-2">
                <TouchableOpacity
                  onPress={showExportOptions}
                  disabled={exporting || loading || transactions.length === 0}
                  className={`w-12 h-12 rounded-full items-center justify-center ${
                    exporting || loading || transactions.length === 0
                      ? theme === 'dark' 
                        ? 'bg-gray-800/30' 
                        : 'bg-gray-200/30'
                      : theme === 'dark' 
                        ? 'bg-blue-600' 
                        : 'bg-blue-500'
                  }`}
                >
                  {exporting ? (
                    <ActivityIndicator size="small" color="#FFFFFF" />
                  ) : (
                    <Download 
                      size={20} 
                      color={
                        transactions.length === 0 
                          ? theme === 'dark' ? '#4B5563' : '#9CA3AF'
                          : '#FFFFFF'
                      } 
                    />
                  )}
                </TouchableOpacity>
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

            <View className="flex-row gap-2">
              {(['weekly', 'monthly', 'yearly'] as TimePeriod[]).map((period) => (
                <TouchableOpacity
                  key={period}
                  onPress={() => setTimePeriod(period)}
                  className={`flex-1 py-3 rounded-2xl border ${
                    timePeriod === period
                      ? theme === 'dark'
                        ? 'bg-blue-600 border-blue-600'
                        : 'bg-blue-500 border-blue-500'
                      : theme === 'dark'
                      ? 'bg-gray-800/60 border-gray-700'
                      : 'bg-white/60 border-gray-200'
                  }`}
                >
                  <Text
                    className={`text-center font-semibold capitalize ${
                      timePeriod === period
                        ? 'text-white'
                        : theme === 'dark'
                        ? 'text-gray-400'
                        : 'text-gray-600'
                    }`}
                  >
                    {period}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <ScrollView 
            className="flex-1 px-6"
            showsVerticalScrollIndicator={false}
          >
            {loading ? (
              <View className="py-20 items-center">
                <ActivityIndicator
                  color={theme === 'dark' ? '#3B82F6' : '#1D4ED8'}
                  size="large"
                />
              </View>
            ) : (
              <View className="py-6 gap-6">
                {/* Expense Categories - Pie Chart */}
                <View
                  className={`p-5 rounded-3xl border shadow-md ${
                    theme === 'dark'
                      ? 'bg-gray-800/50 border-gray-700/60 shadow-black/30'
                      : 'bg-white/50 border-gray-200/60 shadow-gray-200/50'
                  }`}
                >
                  <View className="flex-row items-center gap-2 mb-4">
                    <PieChartIcon size={20} color={theme === 'dark' ? '#F59E0B' : '#D97706'} />
                    <Text
                      className={`text-lg font-bold ${
                        theme === 'dark' ? 'text-gray-100' : 'text-gray-900'
                      }`}
                    >
                      Expense Categories
                    </Text>
                  </View>

                  {categoryData.length === 0 ? (
                    <View className="py-8 items-center">
                      <Text
                        className={`text-center ${
                          theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                        }`}
                      >
                        No expense data available
                      </Text>
                    </View>
                  ) : (
                    <>
                      <View className="items-center mb-6">
                        <View className="relative" style={{ width: 200, height: 200 }}>
                          {categoryData.map((item, index) => {
                            const percentage = (item.amount / totalExpense) * 100
                            const startAngle = categoryData
                              .slice(0, index)
                              .reduce((sum, cat) => sum + (cat.amount / totalExpense) * 360, 0)
                            
                            return (
                              <View
                                key={item.category}
                                style={{
                                  position: 'absolute',
                                  width: 200,
                                  height: 200,
                                  transform: [{ rotate: `${startAngle}deg` }],
                                }}
                              >
                                <View
                                  style={{
                                    width: 200,
                                    height: 200,
                                    borderRadius: 100,
                                    backgroundColor: colors[index % colors.length],
                                    opacity: 0.8,
                                  }}
                                />
                              </View>
                            )
                          })}
                          <View
                            className={`absolute inset-0 m-auto w-24 h-24 rounded-full items-center justify-center ${
                              theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'
                            }`}
                          >
                            <Text
                              className={`text-xs ${
                                theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                              }`}
                            >
                              Total
                            </Text>
                            <Text
                              className={`text-base font-bold ${
                                theme === 'dark' ? 'text-gray-100' : 'text-gray-900'
                              }`}
                            >
                              ${totalExpense.toFixed(0)}
                            </Text>
                          </View>
                        </View>
                      </View>

                      <View className="gap-3">
                        {categoryData.map((item, index) => {
                          const percentage = ((item.amount / totalExpense) * 100).toFixed(1)
                          return (
                            <View
                              key={item.category}
                              className="flex-row items-center justify-between"
                            >
                              <View className="flex-row items-center gap-2 flex-1">
                                <View
                                  style={{
                                    width: 12,
                                    height: 12,
                                    borderRadius: 6,
                                    backgroundColor: colors[index % colors.length],
                                  }}
                                />
                                <Text
                                  className={`text-sm font-medium ${
                                    theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                                  }`}
                                  numberOfLines={1}
                                >
                                  {item.category}
                                </Text>
                              </View>
                              <View className="items-end">
                                <Text
                                  className={`text-sm font-bold ${
                                    theme === 'dark' ? 'text-gray-100' : 'text-gray-900'
                                  }`}
                                >
                                  ${item.amount.toFixed(0)}
                                </Text>
                                <Text
                                  className={`text-xs ${
                                    theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                                  }`}
                                >
                                  {percentage}%
                                </Text>
                              </View>
                            </View>
                          )
                        })}
                      </View>
                    </>
                  )}
                </View>

                {/* Income vs Expense - Line Chart */}
                <View
                  className={`p-5 rounded-3xl border shadow-md ${
                    theme === 'dark'
                      ? 'bg-gray-800/50 border-gray-700/60 shadow-black/30'
                      : 'bg-white/50 border-gray-200/60 shadow-gray-200/50'
                  }`}
                >
                  <View className="flex-row items-center gap-2 mb-4">
                    <LineChartIcon size={20} color={theme === 'dark' ? '#10B981' : '#059669'} />
                    <Text
                      className={`text-lg font-bold ${
                        theme === 'dark' ? 'text-gray-100' : 'text-gray-900'
                      }`}
                    >
                      Income vs Expense
                    </Text>
                  </View>

                  {timeSeriesData.length === 0 ? (
                    <View className="py-8 items-center">
                      <Text
                        className={`text-center ${
                          theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                        }`}
                      >
                        No transaction data available
                      </Text>
                    </View>
                  ) : (
                    <>
                      <View className="flex-row gap-4 mb-4">
                        <View className="flex-row items-center gap-2">
                          <View className="w-4 h-4 rounded-full bg-green-500" />
                          <Text
                            className={`text-xs ${
                              theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                            }`}
                          >
                            Income
                          </Text>
                        </View>
                        <View className="flex-row items-center gap-2">
                          <View className="w-4 h-4 rounded-full bg-red-500" />
                          <Text
                            className={`text-xs ${
                              theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                            }`}
                          >
                            Expense
                          </Text>
                        </View>
                      </View>

                      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                        <View style={{ width: Math.max(width - 80, timeSeriesData.length * 60) }}>
                          <View style={{ height: 200, position: 'relative' }}>
                            {[0, 25, 50, 75, 100].map((percent) => (
                              <View
                                key={percent}
                                style={{
                                  position: 'absolute',
                                  top: `${100 - percent}%`,
                                  left: 0,
                                  right: 0,
                                  height: 1,
                                  backgroundColor: theme === 'dark' ? '#374151' : '#E5E7EB',
                                }}
                              />
                            ))}

                            {timeSeriesData.map((point, index) => {
                              const incomeHeight = (point.income / maxValue) * 180
                              const expenseHeight = (point.expense / maxValue) * 180
                              const x = (index / (timeSeriesData.length - 1 || 1)) * 100
                              
                              return (
                                <View
                                  key={index}
                                  style={{
                                    position: 'absolute',
                                    left: `${x}%`,
                                    bottom: 0,
                                    alignItems: 'center',
                                    width: 40,
                                  }}
                                >
                                  <View className="flex-row gap-1 mb-2">
                                    {point.income > 0 && (
                                      <View
                                        style={{
                                          width: 6,
                                          height: Math.max(incomeHeight, 4),
                                          backgroundColor: '#10B981',
                                          borderRadius: 3,
                                        }}
                                      />
                                    )}
                                    {point.expense > 0 && (
                                      <View
                                        style={{
                                          width: 6,
                                          height: Math.max(expenseHeight, 4),
                                          backgroundColor: '#EF4444',
                                          borderRadius: 3,
                                        }}
                                      />
                                    )}
                                  </View>
                                </View>
                              )
                            })}
                          </View>

                          <View className="flex-row justify-between mt-2">
                            {timeSeriesData.map((point, index) => (
                              <Text
                                key={index}
                                className={`text-xs ${
                                  theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                                }`}
                                style={{ width: 40, textAlign: 'center' }}
                              >
                                {point.label}
                              </Text>
                            ))}
                          </View>
                        </View>
                      </ScrollView>
                    </>
                  )}
                </View>

                {/* Summary Stats */}
                <View
                  className={`p-5 rounded-3xl border shadow-md ${
                    theme === 'dark'
                      ? 'bg-gray-800/50 border-gray-700/60 shadow-black/30'
                      : 'bg-white/50 border-gray-200/60 shadow-gray-200/50'
                  }`}
                >
                  <View className="flex-row items-center gap-2 mb-4">
                    <TrendingUp size={20} color={theme === 'dark' ? '#3B82F6' : '#1D4ED8'} />
                    <Text
                      className={`text-lg font-bold ${
                        theme === 'dark' ? 'text-gray-100' : 'text-gray-900'
                      }`}
                    >
                      Summary
                    </Text>
                  </View>

                  <View className="gap-3">
                    <View className="flex-row items-center justify-between">
                      <Text
                        className={`text-sm ${
                          theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                        }`}
                      >
                        Total Income
                      </Text>
                      <Text className="text-lg font-bold text-green-500">
                        $
                        {timeSeriesData
                          .reduce((sum, d) => sum + d.income, 0)
                          .toFixed(2)}
                      </Text>
                    </View>
                    <View className="flex-row items-center justify-between">
                      <Text
                        className={`text-sm ${
                          theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                        }`}
                      >
                        Total Expense
                      </Text>
                      <Text className="text-lg font-bold text-red-500">
                        $
                        {timeSeriesData
                          .reduce((sum, d) => sum + d.expense, 0)
                          .toFixed(2)}
                      </Text>
                    </View>
                    <View
                      className={`h-px ${
                        theme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'
                      }`}
                    />
                    <View className="flex-row items-center justify-between">
                      <Text
                        className={`text-sm font-semibold ${
                          theme === 'dark' ? 'text-gray-200' : 'text-gray-800'
                        }`}
                      >
                        Net Balance
                      </Text>
                      <Text
                        className={`text-xl font-bold ${
                          timeSeriesData.reduce((sum, d) => sum + d.income - d.expense, 0) >= 0
                            ? 'text-green-500'
                            : 'text-red-500'
                        }`}
                      >
                        $
                        {timeSeriesData
                          .reduce((sum, d) => sum + d.income - d.expense, 0)
                          .toFixed(2)}
                      </Text>
                    </View>
                  </View>
                </View>
              </View>
            )}
          </ScrollView>
        </View>
      </SafeAreaView>
    </Modal>
  )
}
