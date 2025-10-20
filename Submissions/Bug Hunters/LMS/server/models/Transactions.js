// models/Transaction.js
const mongoose = require('mongoose')

const transactionSchema = new mongoose.Schema({
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  amount: { 
    type: Number, 
    required: true 
  },
  category: { 
    type: String, 
    required: true,
    enum: ['Food', 'Transport', 'Entertainment', 'Utilities', 'Other']
  },
  description: { 
    type: String, 
    default: '' 
  },
  type: { 
    type: String, 
    enum: ['expense', 'income'], 
    default: 'expense' 
  },
  date: { 
    type: Date, 
    default: Date.now 
  },
}, {
  timestamps: true
})

module.exports = mongoose.model('Transaction', transactionSchema)