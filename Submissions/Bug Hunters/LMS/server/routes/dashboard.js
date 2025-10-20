const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Transaction = require('../models/Transactions');
const authMiddleware = require('../middlewares/authMiddleware');

// GET /api/dashboard - Get dashboard data (balance, points, badges, recent transactions)
router.get('/', authMiddleware, async (req, res) => {
  try {
    // Get user data
    const user = await User.findById(req.user.id).select('balance points badges');
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Get recent transactions (5 most recent)
    const recentTransactions = await Transaction.find({ userId: req.user.id })
      .sort({ date: -1, createdAt: -1 })
      .limit(5)
      .select('amount category description type date');

    res.json({
      success: true,
      balance: user.balance,
      points: user.points,
      badges: user.badges,
      recentTransactions
    });

  } catch (error) {
    console.error('Error fetching dashboard data:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching dashboard data'
    });
  }
});

module.exports = router;