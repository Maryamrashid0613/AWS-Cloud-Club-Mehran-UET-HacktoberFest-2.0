import { GoogleGenerativeAI } from '@google/generative-ai'

const API_KEY = process.env.EXPO_PUBLIC_GEMINI_API_KEY || ''

if (!API_KEY) {
  console.error('EXPO_PUBLIC_GEMINI_API_KEY is not set in .env file')
}

const genAI = new GoogleGenerativeAI(API_KEY)

// Tool definitions for function calling
export const tools = [
  {
    name: 'get_transactions',
    description: 'Get the latest transactions from the user\'s wallet. Returns recent transactions with details like amount, category, date, and type (income/expense).',
    parameters: {
      type: 'object',
      properties: {
        limit: {
          type: 'number',
          description: 'Number of transactions to retrieve (default: 10)',
        },
        type: {
          type: 'string',
          enum: ['all', 'income', 'expense'],
          description: 'Filter by transaction type (default: all)',
        },
      },
    },
  },
  {
    name: 'add_transaction',
    description: 'Add a new transaction (income or expense). This requires wallet_id, amount, type, and category.',
    parameters: {
      type: 'object',
      properties: {
        wallet_id: {
          type: 'number',
          description: 'The ID of the wallet to add transaction to',
        },
        amount: {
          type: 'number',
          description: 'The transaction amount',
        },
        type: {
          type: 'string',
          enum: ['income', 'expense'],
          description: 'Type of transaction',
        },
        category: {
          type: 'string',
          description: 'Category of the transaction (e.g., Food, Transport, Salary)',
        },
        note: {
          type: 'string',
          description: 'Optional note or description for the transaction',
        },
        payment_method: {
          type: 'string',
          enum: ['Cash', 'Card', 'Bank Transfer', 'E-Wallet'],
          description: 'Payment method used (default: Cash)',
        },
      },
      required: ['amount', 'type', 'category'],
    },
  },
  {
    name: 'get_wallets',
    description: 'Get all available wallets with their balances and names. Use this when user needs to choose a wallet or wants to know wallet information.',
    parameters: {
      type: 'object',
      properties: {},
    },
  },
  {
    name: 'get_spending_summary',
    description: 'Get a summary of spending including total income, total expense, and expense by category. Useful for financial analysis.',
    parameters: {
      type: 'object',
      properties: {},
    },
  },
]

export const getGeminiModel = () => {
  return genAI.getGenerativeModel({
    model: 'gemini-2.0-flash-exp',
    systemInstruction: `You are a helpful financial assistant for an expense tracking app.

Your role:
1. Help users track expenses and income
2. Answer questions about transactions and spending
3. Provide financial advice based on their data
4. Be friendly and concise

Guidelines:
- Keep responses short and clear
- No markdown formatting
- Use simple text only
- Be conversational
- When user asks to add transaction, encourage them to specify amount and category
- When showing data, format it simply with line breaks

Example responses:
- "Your total expense is $500 and income is $1000. You have spent 50% of your balance."
- "Here are your recent transactions: 1. Food $50, 2. Transport $30"
- "I can help you add a transaction! Just tell me: amount, category (like Food, Transport), and if its income or expense."`,
  })
}

export interface ChatMessage {
  role: 'user' | 'assistant' | 'function'
  content: string
  timestamp: Date
  functionCall?: {
    name: string
    args: any
  }
}
