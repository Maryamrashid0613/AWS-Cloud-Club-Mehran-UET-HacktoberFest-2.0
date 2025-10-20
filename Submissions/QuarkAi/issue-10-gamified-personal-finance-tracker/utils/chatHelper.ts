// Helper functions for parsing natural language transaction requests

export interface TransactionRequest {
  amount?: number
  type?: 'income' | 'expense'
  category?: string
  note?: string
  payment_method?: string
  wallet_id?: number
  needsMoreInfo: boolean
  missingFields: string[]
}

const EXPENSE_CATEGORIES = [
  'Food',
  'Transport',
  'Shopping',
  'Bills',
  'Entertainment',
  'Health',
  'Education',
  'Other',
]

const INCOME_CATEGORIES = ['Salary', 'Business', 'Investment', 'Gift', 'Other']

const PAYMENT_METHODS = ['Cash', 'Card', 'Bank Transfer', 'E-Wallet']

export const parseTransactionRequest = (message: string): TransactionRequest => {
  const lowerMessage = message.toLowerCase()
  const request: TransactionRequest = {
    needsMoreInfo: false,
    missingFields: [],
  }

  // Detect type
  if (
    lowerMessage.includes('expense') ||
    lowerMessage.includes('spent') ||
    lowerMessage.includes('paid') ||
    lowerMessage.includes('buy') ||
    lowerMessage.includes('bought')
  ) {
    request.type = 'expense'
  } else if (
    lowerMessage.includes('income') ||
    lowerMessage.includes('earned') ||
    lowerMessage.includes('received') ||
    lowerMessage.includes('salary')
  ) {
    request.type = 'income'
  }

  // Extract amount - look for patterns like $50, 50$, 50 dollars, etc.
  const amountPatterns = [
    /\$\s*(\d+(?:\.\d{2})?)/,  // $50 or $50.00
    /(\d+(?:\.\d{2})?)\s*\$/,   // 50$ or 50.00$
    /(\d+(?:\.\d{2})?)\s*dollars?/i, // 50 dollars
    /(\d+(?:\.\d{2})?)\s*bucks?/i,   // 50 bucks
    /amount\s*:?\s*(\d+(?:\.\d{2})?)/i, // amount: 50
  ]

  for (const pattern of amountPatterns) {
    const match = message.match(pattern)
    if (match) {
      request.amount = parseFloat(match[1])
      break
    }
  }

  // Detect category based on keywords
  const categoryKeywords: Record<string, string[]> = {
    Food: ['food', 'restaurant', 'lunch', 'dinner', 'breakfast', 'meal', 'eat', 'grocery', 'groceries'],
    Transport: ['transport', 'taxi', 'uber', 'gas', 'fuel', 'bus', 'train', 'metro', 'ride'],
    Shopping: ['shopping', 'clothes', 'clothing', 'shoes', 'mall', 'store', 'purchase'],
    Bills: ['bill', 'bills', 'rent', 'electricity', 'water', 'internet', 'utility'],
    Entertainment: ['entertainment', 'movie', 'cinema', 'game', 'gaming', 'concert', 'show'],
    Health: ['health', 'doctor', 'hospital', 'medicine', 'pharmacy', 'medical'],
    Education: ['education', 'school', 'course', 'book', 'books', 'tuition', 'class'],
    Salary: ['salary', 'paycheck', 'wage'],
    Business: ['business', 'freelance', 'client', 'project'],
    Investment: ['investment', 'dividend', 'stock', 'crypto', 'interest'],
    Gift: ['gift', 'present', 'bonus'],
  }

  for (const [category, keywords] of Object.entries(categoryKeywords)) {
    if (keywords.some((keyword) => lowerMessage.includes(keyword))) {
      request.category = category
      break
    }
  }

  // Detect payment method
  if (lowerMessage.includes('cash')) request.payment_method = 'Cash'
  else if (lowerMessage.includes('card') || lowerMessage.includes('credit') || lowerMessage.includes('debit')) {
    request.payment_method = 'Card'
  } else if (lowerMessage.includes('bank') || lowerMessage.includes('transfer')) {
    request.payment_method = 'Bank Transfer'
  } else if (lowerMessage.includes('wallet') || lowerMessage.includes('e-wallet') || lowerMessage.includes('paypal')) {
    request.payment_method = 'E-Wallet'
  }

  // Extract note - look for "for" or "note:"
  const notePatterns = [
    /for\s+(.+?)(?:\.|$)/i,
    /note:?\s*(.+?)(?:\.|$)/i,
    /description:?\s*(.+?)(?:\.|$)/i,
  ]

  for (const pattern of notePatterns) {
    const match = message.match(pattern)
    if (match) {
      request.note = match[1].trim()
      break
    }
  }

  // Check what's missing
  if (!request.amount) request.missingFields.push('amount')
  if (!request.type) request.missingFields.push('type (income or expense)')
  if (!request.category) request.missingFields.push('category')

  request.needsMoreInfo = request.missingFields.length > 0

  return request
}

export const generateMissingInfoPrompt = (request: TransactionRequest, availableWallets: any[]): string => {
  let prompt = "I'd like to help you add this transaction! "

  if (request.missingFields.length > 0) {
    prompt += `However, I need a bit more information:\n\n`
    
    if (request.missingFields.includes('amount')) {
      prompt += '• How much is the amount?\n'
    }
    if (request.missingFields.includes('type (income or expense)')) {
      prompt += '• Is this an income or expense?\n'
    }
    if (request.missingFields.includes('category')) {
      const categories = request.type === 'income' ? INCOME_CATEGORIES : EXPENSE_CATEGORIES
      prompt += `• What category? (${categories.slice(0, 4).join(', ')}, etc.)\n`
    }
  }

  if (availableWallets.length > 1 && !request.wallet_id) {
    prompt += `\nAvailable wallets:\n`
    availableWallets.forEach((w, i) => {
      prompt += `${i + 1}. ${w.wallet_name} ($${w.balance})\n`
    })
    prompt += `\nWhich wallet would you like to use?`
  } else if (availableWallets.length === 0) {
    prompt += `\n⚠️ You don't have any wallets yet. Please create a wallet first!`
  }

  return prompt
}

export const formatTransactionSummary = (transaction: TransactionRequest): string => {
  const type = transaction.type === 'income' ? '💰 Income' : '💸 Expense'
  const amount = `$${transaction.amount?.toFixed(2) || '0.00'}`
  const category = transaction.category || 'Uncategorized'
  const payment = transaction.payment_method || 'Cash'
  const note = transaction.note ? `\nNote: ${transaction.note}` : ''

  return `${type}: ${amount}\nCategory: ${category}\nPayment: ${payment}${note}`
}

export const isAddTransactionIntent = (message: string): boolean => {
  const lowerMessage = message.toLowerCase()
  const addKeywords = ['add', 'create', 'record', 'save', 'log', 'spent', 'paid', 'bought', 'earned', 'received']
  const transactionKeywords = ['transaction', 'expense', 'income', 'spending']

  // Check if message contains add intent and transaction related words
  const hasAddIntent = addKeywords.some((keyword) => lowerMessage.includes(keyword))
  const hasTransactionContext = transactionKeywords.some((keyword) => lowerMessage.includes(keyword))
  
  // Or check if message mentions amount with action verbs
  const hasAmount = /\$\s*\d+|\d+\s*\$|\d+\s*dollars?/i.test(message)
  const actionVerbs = ['spent', 'paid', 'bought', 'earned', 'received']
  const hasActionVerb = actionVerbs.some((verb) => lowerMessage.includes(verb))

  return (hasAddIntent && (hasTransactionContext || hasAmount)) || (hasAmount && hasActionVerb)
}
