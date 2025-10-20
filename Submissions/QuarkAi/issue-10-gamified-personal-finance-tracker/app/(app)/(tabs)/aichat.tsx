import { useData } from '@/context/dataContext'
import { useThemeContext } from '@/context/themeContext'
import { getGeminiModel } from '@/utils/gemini'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { Bot, Send, Sparkles, Trash2 } from 'lucide-react-native'
import React, { useEffect, useRef, useState } from 'react'
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

interface ChatMessage {
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
  isLoading?: boolean
}

const CHAT_HISTORY_KEY = 'ai_chat_history'

export default function AiChatScreen() {
  const { theme } = useThemeContext()
  const {
    transactions,
    wallets,
    selectedWallet,
    stats,
    createTransaction,
  } = useData()

  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [inputText, setInputText] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const scrollViewRef = useRef<ScrollView>(null)

  useEffect(() => {
    loadChatHistory()
  }, [])

  useEffect(() => {
    saveChatHistory()
  }, [messages])

  const loadChatHistory = async () => {
    try {
      const savedHistory = await AsyncStorage.getItem(CHAT_HISTORY_KEY)
      if (savedHistory) {
        const parsed = JSON.parse(savedHistory)
        setMessages(
          parsed.map((msg: any) => ({
            ...msg,
            timestamp: new Date(msg.timestamp),
          }))
        )
      } else {
        // Welcome message
        setMessages([
          {
            role: 'assistant',
            content: "Hi! I'm your financial assistant. I can help you:\n\n- Track and analyze your expenses\n- View recent transactions\n- Add new transactions via chat\n- Get financial insights\n- Answer budgeting questions\n\nTry asking:\n\"Show my transactions\"\n\"I spent $50 on food\"\n\"How's my spending?\"\n\nHow can I help you today?",
            timestamp: new Date(),
          },
        ])
      }
    } catch (error) {
      console.error('Error loading chat history:', error)
    }
  }

  const saveChatHistory = async () => {
    try {
      await AsyncStorage.setItem(CHAT_HISTORY_KEY, JSON.stringify(messages))
    } catch (error) {
      console.error('Error saving chat history:', error)
    }
  }

  const clearChatHistory = () => {
    Alert.alert(
      'Clear Chat History',
      'Are you sure you want to clear all chat history?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Clear',
          style: 'destructive',
          onPress: async () => {
            await AsyncStorage.removeItem(CHAT_HISTORY_KEY)
            setMessages([
              {
                role: 'assistant',
                content: "Chat history cleared! How can I help you today?\n\nTry:\n\"Show my transactions\"\n\"I spent $50 on food\"\n\"How's my spending?\"",
                timestamp: new Date(),
              },
            ])
          },
        },
      ]
    )
  }

  const getTransactionsData = (limit: number = 10, type: string = 'all') => {
    let filtered = transactions
    if (type !== 'all') {
      filtered = transactions.filter((t) => t.type === type)
    }
    return filtered.slice(0, limit)
  }

  const getWalletsData = () => {
    return wallets.map((w) => ({
      id: w.id,
      name: w.wallet_name,
      balance: w.balance,
      color: w.wallet_color,
    }))
  }

  const getSpendingSummary = () => {
    const categoryTotals: { [key: string]: number } = {}
    transactions
      .filter((t) => t.type === 'expense')
      .forEach((t) => {
        categoryTotals[t.category] = (categoryTotals[t.category] || 0) + Number(t.amount)
      })

    return {
      totalIncome: stats.totalIncome,
      totalExpense: stats.totalExpense,
      todayExpense: stats.todayExpense,
      todayIncome: stats.todayIncome,
      expensePercentage: stats.expensePercentage,
      categoryBreakdown: categoryTotals,
      walletBalance: selectedWallet?.balance || 0,
    }
  }

  const executeFunctionCall = async (functionName: string, args: any) => {
    switch (functionName) {
      case 'get_transactions':
        const txns = getTransactionsData(args.limit || 10, args.type || 'all')
        return {
          transactions: txns.map((t) => ({
            id: t.id,
            amount: t.amount,
            type: t.type,
            category: t.category,
            date: t.date,
            note: t.note,
            payment_method: t.payment_method,
          })),
          count: txns.length,
        }

      case 'get_wallets':
        return {
          wallets: getWalletsData(),
          selectedWallet: selectedWallet
            ? {
                id: selectedWallet.id,
                name: selectedWallet.wallet_name,
                balance: selectedWallet.balance,
              }
            : null,
        }

      case 'add_transaction':
        try {
          const walletId = args.wallet_id || selectedWallet?.id
          if (!walletId) {
            return {
              error: 'No wallet selected. Please choose a wallet first.',
              available_wallets: getWalletsData(),
            }
          }

          await createTransaction({
            wallet_id: walletId,
            type: args.type,
            amount: Number(args.amount),
            category: args.category,
            note: args.note || '',
            payment_method: args.payment_method || 'Cash',
            date: new Date().toISOString(),
          })

          return {
            success: true,
            message: `Transaction added successfully: ${args.type === 'income' ? '+' : '-'}$${args.amount} (${args.category})`,
          }
        } catch (error: any) {
          return {
            error: `Failed to add transaction: ${error.message}`,
          }
        }

      case 'get_spending_summary':
        return getSpendingSummary()

      default:
        return { error: 'Unknown function' }
    }
  }

  const sendMessage = async () => {
    if (!inputText.trim() || isLoading) return

    const userMessage: ChatMessage = {
      role: 'user',
      content: inputText.trim(),
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInputText('')
    setIsLoading(true)

    try {
      const model = getGeminiModel()

      // Build context from chat history - IMPORTANT: Filter out welcome message and ensure first is 'user'
      const chatHistory = messages
        .filter((msg, index) => {
          // Skip first message if it's from assistant (welcome message)
          if (index === 0 && msg.role === 'assistant') return false
          return true
        })
        .map((msg) => ({
          role: msg.role === 'user' ? 'user' : 'model',
          parts: [{ text: msg.content }],
        }))

      // Add current user data context
      const contextInfo = `

[Your Current Financial Data:
- Wallet: ${selectedWallet?.wallet_name || 'None'} - Balance: $${selectedWallet?.balance || 0}
- Total Wallets: ${wallets.length}
- Total Income: $${stats.totalIncome}
- Total Expense: $${stats.totalExpense}
- Today Expense: $${stats.todayExpense}
- Expense Usage: ${stats.expensePercentage.toFixed(1)}%
- Recent Transactions Count: ${transactions.slice(0, 5).length}]`

      const chat = model.startChat({
        history: chatHistory,
        generationConfig: {
          maxOutputTokens: 800,
          temperature: 0.7,
        },
      })

      const result = await chat.sendMessage(userMessage.content + contextInfo)
      const response = await result.response
      let responseText = response.text()

      // Check if function calling is needed
      let functionData = null
      const lowerMsg = userMessage.content.toLowerCase()
      
      // Get transactions
      if (
        (lowerMsg.includes('show') || lowerMsg.includes('list') || lowerMsg.includes('get') || lowerMsg.includes('view')) &&
        lowerMsg.includes('transaction')
      ) {
        functionData = await executeFunctionCall('get_transactions', { limit: 5 })
        const txns = functionData?.transactions || []
        if (txns.length > 0) {
          responseText += '\n\nYour Recent Transactions:\n'
          txns.forEach((t: any, i: number) => {
            responseText += `${i + 1}. ${t.type === 'income' ? '+' : '-'}$${t.amount} - ${t.category} (${t.date.split('T')[0]})\n`
          })
        }
      }
      
      // Get wallets
      if (
        (lowerMsg.includes('show') || lowerMsg.includes('list') || lowerMsg.includes('get')) &&
        lowerMsg.includes('wallet')
      ) {
        functionData = await executeFunctionCall('get_wallets', {})
        const walletList = functionData.wallets || []
        if (walletList.length > 0) {
          responseText += '\n\nYour Wallets:\n'
          walletList.forEach((w: any, i: number) => {
            responseText += `${i + 1}. ${w.name} - $${w.balance}\n`
          })
        }
      }
      
      // Get spending summary
      if (lowerMsg.includes('spending') || lowerMsg.includes('summary') || lowerMsg.includes('analysis')) {
        functionData = await executeFunctionCall('get_spending_summary', {})
        if (functionData) {
          responseText += `\n\nSpending Summary:
Total Income: $${functionData.totalIncome}
Total Expense: $${functionData.totalExpense}
Today Expense: $${functionData.todayExpense}
Expense Usage: ${functionData.expensePercentage.toFixed(1)}%\n`
          
          if (functionData.categoryBreakdown) {
            responseText += '\nTop Categories:\n'
            const sorted = Object.entries(functionData.categoryBreakdown)
              .sort((a: any, b: any) => b[1] - a[1])
              .slice(0, 3)
            sorted.forEach(([cat, amt]: any, i: number) => {
              responseText += `${i + 1}. ${cat}: $${amt}\n`
            })
          }
        }
      }

      // Add transaction
      if (
        (lowerMsg.includes('add') || lowerMsg.includes('spent') || lowerMsg.includes('paid') || lowerMsg.includes('earned')) &&
        (lowerMsg.includes('transaction') || lowerMsg.includes('expense') || lowerMsg.includes('income') || /\$\d+|\d+\s*dollars?/i.test(userMessage.content))
      ) {
        // Extract amount
        const amountMatch = userMessage.content.match(/\$\s*(\d+(?:\.\d{2})?)|(\d+(?:\.\d{2})?)\s*\$/i)
        const amount = amountMatch ? parseFloat(amountMatch[1] || amountMatch[2]) : null
        
        if (amount && selectedWallet) {
          // Detect type
          const isIncome = lowerMsg.includes('income') || lowerMsg.includes('earned') || lowerMsg.includes('received')
          const type = isIncome ? 'income' : 'expense'
          
          // Detect category
          const categories = {
            food: ['food', 'lunch', 'dinner', 'restaurant', 'meal', 'grocery'],
            transport: ['transport', 'taxi', 'uber', 'gas', 'fuel', 'bus'],
            shopping: ['shopping', 'clothes', 'shoes', 'mall'],
            bills: ['bill', 'rent', 'electricity', 'water', 'internet'],
            salary: ['salary', 'paycheck', 'wage'],
            business: ['business', 'freelance', 'client'],
          }
          
          let category = 'Other'
          for (const [cat, keywords] of Object.entries(categories)) {
            if (keywords.some(k => lowerMsg.includes(k))) {
              category = cat.charAt(0).toUpperCase() + cat.slice(1)
              break
            }
          }
          
          try {
            await createTransaction({
              wallet_id: selectedWallet.id,
              type,
              amount,
              category,
              note: '',
              payment_method: 'Cash',
              date: new Date().toISOString(),
            })
            
            responseText = `Transaction added successfully!\n${type === 'income' ? '+' : '-'}$${amount} (${category})\nNew wallet balance: $${selectedWallet.balance + (type === 'income' ? amount : -amount)}`
          } catch (err) {
            responseText = 'Sorry, I could not add the transaction. Please try again.'
          }
        } else if (!amount) {
          responseText = 'Please tell me the amount. Example: "I spent $50 on food"'
        } else if (!selectedWallet) {
          responseText = 'Please select a wallet first from the dashboard.'
        }
      }

      const assistantMessage: ChatMessage = {
        role: 'assistant',
        content: responseText,
        timestamp: new Date(),
      }

      setMessages((prev) => [...prev, assistantMessage])
    } catch (error: any) {
      console.error('Error sending message:', error)
      
      const errorMessage: ChatMessage = {
        role: 'assistant',
        content: `Sorry, I encountered an error. Please try again.`,
        timestamp: new Date(),
      }

      setMessages((prev) => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  const formatTime = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    }).format(date)
  }

  return (
    <SafeAreaView
      className={`flex-1 ${theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'}`}
    >
      {/* Header */}
      <View
        className={`px-6 py-4 border-b ${
          theme === 'dark' ? 'border-gray-800' : 'border-gray-200'
        }`}
      >
        <View className="flex-row items-center justify-between">
          <View className="flex-row items-center">
            <View
              className={`w-12 h-12 rounded-full items-center justify-center mr-3 ${
                theme === 'dark' ? 'bg-blue-900/30' : 'bg-blue-100'
              }`}
            >
              <Bot size={24} color="#3B82F6" />
            </View>
            <View>
              <Text
                className={`text-xl font-bold ${
                  theme === 'dark' ? 'text-gray-100' : 'text-gray-900'
                }`}
              >
                AI Assistant
              </Text>
              <View className="flex-row items-center">
                <View className="w-2 h-2 rounded-full bg-green-500 mr-2" />
                <Text
                  className={`text-sm ${
                    theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                  }`}
                >
                  Online
                </Text>
              </View>
            </View>
          </View>
          <TouchableOpacity
            onPress={clearChatHistory}
            className={`w-10 h-10 rounded-full items-center justify-center ${
              theme === 'dark' ? 'bg-gray-800' : 'bg-gray-200'
            }`}
          >
            <Trash2 size={18} color={theme === 'dark' ? '#F87171' : '#DC2626'} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Messages */}
      <ScrollView
        ref={scrollViewRef}
        className="flex-1 px-6 py-4"
        showsVerticalScrollIndicator={false}
        onContentSizeChange={() =>
          scrollViewRef.current?.scrollToEnd({ animated: true })
        }
      >
        {messages.map((message, index) => (
          <View
            key={index}
            className={`mb-4 ${
              message.role === 'user' ? 'items-end' : 'items-start'
            }`}
          >
            <View
              className={`max-w-[80%] p-4 rounded-2xl ${
                message.role === 'user'
                  ? theme === 'dark'
                    ? 'bg-blue-600'
                    : 'bg-blue-500'
                  : theme === 'dark'
                  ? 'bg-gray-800'
                  : 'bg-white'
              }`}
            >
              <Text
                className={`text-base ${
                  message.role === 'user'
                    ? 'text-white'
                    : theme === 'dark'
                    ? 'text-gray-100'
                    : 'text-gray-900'
                }`}
              >
                {message.content}
              </Text>
              <Text
                className={`text-xs mt-2 ${
                  message.role === 'user'
                    ? 'text-blue-200'
                    : theme === 'dark'
                    ? 'text-gray-500'
                    : 'text-gray-500'
                }`}
              >
                {formatTime(message.timestamp)}
              </Text>
            </View>
          </View>
        ))}

        {isLoading && (
          <View className="mb-4 items-start">
            <View
              className={`p-4 rounded-2xl ${
                theme === 'dark' ? 'bg-gray-800' : 'bg-white'
              }`}
            >
              <ActivityIndicator
                size="small"
                color={theme === 'dark' ? '#3B82F6' : '#2563EB'}
              />
            </View>
          </View>
        )}
      </ScrollView>

      {/* Input */}
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className={`px-6 py-4 border-t ${
          theme === 'dark' ? 'border-gray-800' : 'border-gray-200'
        }`}
      >
        <View className="flex-row items-center gap-3">
          <View
            className={`flex-1 flex-row items-center px-4 py-3 rounded-2xl ${
              theme === 'dark' ? 'bg-gray-800' : 'bg-white'
            }`}
          >
            <Sparkles size={20} color={theme === 'dark' ? '#9CA3AF' : '#6B7280'} />
            <TextInput
              className={`flex-1 ml-3 text-base ${
                theme === 'dark' ? 'text-gray-100' : 'text-gray-900'
              }`}
              placeholder="Ask me anything..."
              placeholderTextColor={theme === 'dark' ? '#6B7280' : '#9CA3AF'}
              value={inputText}
              onChangeText={setInputText}
              onSubmitEditing={sendMessage}
              multiline
              maxLength={500}
            />
          </View>
          <TouchableOpacity
            onPress={sendMessage}
            disabled={!inputText.trim() || isLoading}
            className={`w-12 h-12 rounded-full items-center justify-center ${
              !inputText.trim() || isLoading
                ? theme === 'dark'
                  ? 'bg-gray-800'
                  : 'bg-gray-200'
                : theme === 'dark'
                ? 'bg-blue-600'
                : 'bg-blue-500'
            }`}
          >
            <Send
              size={20}
              color={
                !inputText.trim() || isLoading
                  ? theme === 'dark'
                    ? '#4B5563'
                    : '#9CA3AF'
                  : '#FFFFFF'
              }
            />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  )
}