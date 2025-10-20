// routes/transactions.js
const express = require('express');
const router = express.Router();
const Transaction = require('../models/Transactions');
const User = require('../models/User');
const authMiddleware = require('../middlewares/authMiddleware');
// const auth = require('../middleware/authMiddleware');

// GET all transactions for the authenticated user with optional filtering
router.get('/', authMiddleware, async (req, res) => {
  try {
    const { 
      page = 1, 
      limit = 10, 
      category, 
      type, 
      startDate, 
      endDate,
      sortBy = 'date',
      sortOrder = 'desc'
    } = req.query;

    // Build filter object
    const filter = { userId: req.user.id };
    
    if (category && category !== 'all') {
      filter.category = category;
    }
    
    if (type && type !== 'all') {
      filter.type = type;
    }
    
    if (startDate || endDate) {
      filter.date = {};
      if (startDate) filter.date.$gte = new Date(startDate);
      if (endDate) filter.date.$lte = new Date(endDate);
    }

    // Sort configuration
    const sortConfig = {};
    sortConfig[sortBy] = sortOrder === 'asc' ? 1 : -1;

    // Execute query with pagination
    const transactions = await Transaction.find(filter)
      .sort(sortConfig)
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .select('amount category description type date createdAt');

    // Get total count for pagination
    const totalCount = await Transaction.countDocuments(filter);

    res.json({
      success: true,
      transactions,
      totalPages: Math.ceil(totalCount / limit),
      currentPage: parseInt(page),
      totalTransactions: totalCount
    });

  } catch (error) {
    console.error('Error fetching transactions:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching transactions'
    });
  }
});

// GET recent transactions (for dashboard - limited to 5)
router.get('/recent', authMiddleware, async (req, res) => {
  try {
    const transactions = await Transaction.find({ userId: req.user.id })
      .sort({ date: -1, createdAt: -1 })
      .limit(5)
      .select('amount category description type date');

    res.json({
      success: true,
      transactions
    });
  } catch (error) {
    console.error('Error fetching recent transactions:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching recent transactions'
    });
  }
});

// GET transaction by ID
router.get('/:id', authMiddleware, async (req, res) => {
  try {
    const transaction = await Transaction.findOne({
      _id: req.params.id,
      userId: req.user.id
    });

    if (!transaction) {
      return res.status(404).json({
        success: false,
        message: 'Transaction not found'
      });
    }

    res.json({
      success: true,
      transaction
    });
  } catch (error) {
    console.error('Error fetching transaction:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching transaction'
    });
  }
});

// POST create new transaction (Quick Add)
router.post('/quick-add', authMiddleware, async (req, res) => {
  try {
    const { amount, category, description = '' } = req.body;

    console.log('Quick Add Request:', { 
      userId: req.user.id, 
      amount, 
      category, 
      description 
    });

    // Validation
    if (!amount || !category) {
      return res.status(400).json({
        success: false,
        message: 'Amount and category are required'
      });
    }

    const amountNum = parseFloat(amount);
    if (isNaN(amountNum) || amountNum <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Amount must be a valid positive number'
      });
    }

    // Get user with current balance
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Check if user has sufficient balance (for expenses)
    if (amountNum > 0 && user.balance < amountNum) {
      return res.status(400).json({
        success: false,
        message: `Insufficient balance. You have $${user.balance.toFixed(2)} but trying to spend $${amountNum.toFixed(2)}`
      });
    }

    // Create and save transaction
    const transaction = new Transaction({
      userId: req.user.id,
      amount: amountNum,
      category,
      description: description || `${category} Expense`,
      type: 'expense'
    });

    await transaction.save();

    // Update user balance (subtract expense)
    user.balance -= amountNum;
    
    // Add points (1 point per dollar spent, rounded down)
    const pointsEarned = Math.floor(amountNum);
    user.points += pointsEarned;
    
    // Badge logic
    updateUserBadges(user);

    await user.save();

    // Return success response
    res.json({
      success: true,
      transaction: {
        id: transaction._id,
        amount: transaction.amount,
        category: transaction.category,
        description: transaction.description,
        date: transaction.date,
        type: transaction.type
      },
      newBalance: user.balance,
      newPoints: user.points,
      badges: user.badges,
      pointsEarned: pointsEarned,
      message: `Expense of $${amountNum.toFixed(2)} added successfully. Earned ${pointsEarned} points!`
    });

  } catch (error) {
    console.error('Error in quick-add transaction:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while processing transaction',
      error: error.message
    });
  }
});

// POST create custom transaction (with type - expense or income)
// router.post('/quick-add', authMiddleware, async (req, res) => {
//   try {
//     const { amount, category, description = '', type = 'expense', date } = req.body;
// console.log('Create Transaction Request:', { userId: req.user.id, amount, category, description, type, date });
//     // Validation
//     if (!amount || !category) {
//       return res.status(400).json({
//         success: false,
//         message: 'Amount and category are required'
//       });
//     }

//     const amountNum = parseFloat(amount);
//     if (isNaN(amountNum) || amountNum <= 0) {
//       return res.status(400).json({
//         success: false,
//         message: 'Amount must be a valid positive number'
//       });
//     }

//     if (!['expense', 'income'].includes(type)) {
//       return res.status(400).json({
//         success: false,
//         message: 'Type must be either "expense" or "income"'
//       });
//     }

//     const user = await User.findById(req.user.id);
//     if (!user) {
//       return res.status(404).json({
//         success: false,
//         message: 'User not found'
//       });
//     }

//     // For expenses, check balance
//     if (type === 'expense' && user.balance < amountNum) {
//       return res.status(400).json({
//         success: false,
//         message: `Insufficient balance. You have $${user.balance.toFixed(2)} but trying to spend $${amountNum.toFixed(2)}`
//       });
//     }

//     // Create transaction
//     const transaction = new Transaction({
//       userId: req.user.id,
//       amount: amountNum,
//       category,
//       description,
//       type,
//       date: date ? new Date(date) : new Date()
//     });

//     await transaction.save();

//     // Update user balance and points
//     if (type === 'expense') {
//       user.balance -= amountNum;
//       const pointsEarned = Math.floor(amountNum);
//       user.points += pointsEarned;
//       updateUserBadges(user);
//     } else {
//       user.balance += amountNum;
//     }

//     await user.save();

//     res.json({
//       success: true,
//       transaction: {
//         id: transaction._id,
//         amount: transaction.amount,
//         category: transaction.category,
//         description: transaction.description,
//         type: transaction.type,
//         date: transaction.date
//       },
//       newBalance: user.balance,
//       newPoints: user.points,
//       badges: user.badges,
//       message: type === 'expense' 
//         ? `Expense of $${amountNum.toFixed(2)} added successfully. Earned ${Math.floor(amountNum)} points!`
//         : `Income of $${amountNum.toFixed(2)} added successfully.`
//     });

//   } catch (error) {
//     console.error('Error creating transaction:', error);
//     res.status(500).json({
//       success: false,
//       message: 'Server error while creating transaction'
//     });
//   }
// });

// PUT update transaction
router.put('/:id', async (req, res) => {
  try {
    const { amount, category, description, type, date } = req.body;

    // Find the transaction
    const transaction = await Transaction.findOne({
      _id: req.params.id,
      userId: req.user.id
    });

    if (!transaction) {
      return res.status(404).json({
        success: false,
        message: 'Transaction not found'
      });
    }

    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Store old values for balance adjustment
    const oldAmount = transaction.amount;
    const oldType = transaction.type;

    // Update transaction
    if (amount !== undefined) {
      const newAmount = parseFloat(amount);
      if (isNaN(newAmount) || newAmount <= 0) {
        return res.status(400).json({
          success: false,
          message: 'Amount must be a valid positive number'
        });
      }
      transaction.amount = newAmount;
    }

    if (category) transaction.category = category;
    if (description !== undefined) transaction.description = description;
    if (type) transaction.type = type;
    if (date) transaction.date = new Date(date);

    // Revert old transaction effect and apply new one
    if (oldType === 'expense') {
      user.balance += oldAmount; // Add back old expense
      user.points -= Math.floor(oldAmount); // Remove old points
    } else {
      user.balance -= oldAmount; // Remove old income
    }

    // Check if new amount is valid for expense
    if (transaction.type === 'expense' && user.balance < transaction.amount) {
      return res.status(400).json({
        success: false,
        message: `Insufficient balance for updated expense. You have $${user.balance.toFixed(2)} but trying to spend $${transaction.amount.toFixed(2)}`
      });
    }

    // Apply new transaction effect
    if (transaction.type === 'expense') {
      user.balance -= transaction.amount;
      user.points += Math.floor(transaction.amount);
    } else {
      user.balance += transaction.amount;
    }

    // Update badges
    updateUserBadges(user);

    await transaction.save();
    await user.save();

    res.json({
      success: true,
      transaction,
      newBalance: user.balance,
      newPoints: user.points,
      badges: user.badges,
      message: 'Transaction updated successfully'
    });

  } catch (error) {
    console.error('Error updating transaction:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while updating transaction'
    });
  }
});

// DELETE transaction
router.delete('/:id', async (req, res) => {
  try {
    const transaction = await Transaction.findOne({
      _id: req.params.id,
      userId: req.user.id
    });

    if (!transaction) {
      return res.status(404).json({
        success: false,
        message: 'Transaction not found'
      });
    }

    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Revert transaction effect on balance and points
    if (transaction.type === 'expense') {
      user.balance += transaction.amount;
      user.points -= Math.floor(transaction.amount);
    } else {
      user.balance -= transaction.amount;
    }

    // Update badges after points change
    updateUserBadges(user);

    await Transaction.findByIdAndDelete(req.params.id);
    await user.save();

    res.json({
      success: true,
      message: 'Transaction deleted successfully',
      newBalance: user.balance,
      newPoints: user.points,
      badges: user.badges
    });

  } catch (error) {
    console.error('Error deleting transaction:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while deleting transaction'
    });
  }
});

// GET transaction statistics
router.get('/stats/summary', authMiddleware, async (req, res) => {
  try {
    const { period = 'month' } = req.query; // month, week, year, all
    let startDate;

    switch (period) {
      case 'week':
        startDate = new Date();
        startDate.setDate(startDate.getDate() - 7);
        break;
      case 'month':
        startDate = new Date();
        startDate.setMonth(startDate.getMonth() - 1);
        break;
      case 'year':
        startDate = new Date();
        startDate.setFullYear(startDate.getFullYear() - 1);
        break;
      default:
        startDate = new Date(0); // All time
    }

    const stats = await Transaction.aggregate([
      {
        $match: {
          userId: req.user._id ? req.user._id : new mongoose.Types.ObjectId(req.user.id),
          date: { $gte: startDate }
        }
      },
      {
        $group: {
          _id: '$type',
          totalAmount: { $sum: '$amount' },
          count: { $sum: 1 }
        }
      }
    ]);

    const categoryStats = await Transaction.aggregate([
      {
        $match: {
          userId: req.user._id ? req.user._id : new mongoose.Types.ObjectId(req.user.id),
          type: 'expense',
          date: { $gte: startDate }
        }
      },
      {
        $group: {
          _id: '$category',
          totalAmount: { $sum: '$amount' },
          count: { $sum: 1 }
        }
      },
      {
        $sort: { totalAmount: -1 }
      }
    ]);

    // Format response
    const expenseTotal = stats.find(s => s._id === 'expense')?.totalAmount || 0;
    const incomeTotal = stats.find(s => s._id === 'income')?.totalAmount || 0;

    res.json({
      success: true,
      summary: {
        expenseTotal,
        incomeTotal,
        netFlow: incomeTotal - expenseTotal,
        expenseCount: stats.find(s => s._id === 'expense')?.count || 0,
        incomeCount: stats.find(s => s._id === 'income')?.count || 0
      },
      categoryBreakdown: categoryStats,
      period
    });

  } catch (error) {
    console.error('Error fetching transaction stats:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching transaction statistics'
    });
  }
});

// Helper function to update user badges
function updateUserBadges(user) {
  const badges = user.badges || [];
  
  // Spending badges
  if (user.points >= 100 && !badges.includes('Spender')) {
    badges.push('Spender');
  }
  if (user.points >= 500 && !badges.includes('Big Spender')) {
    badges.push('Big Spender');
  }
  if (user.points >= 1000 && !badges.includes('Elite Spender')) {
    badges.push('Elite Spender');
  }
  
  // Savings badges
  if (user.balance >= 1000 && !badges.includes('Saver')) {
    badges.push('Saver');
  }
  if (user.balance >= 5000 && !badges.includes('Big Saver')) {
    badges.push('Big Saver');
  }

  user.badges = [...new Set(badges)]; // Remove duplicates
}

module.exports = router;