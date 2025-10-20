// routes/balance.js
const express = require('express');
const router = express.Router();
const User = require('../models/User');
const authMiddleware = require('../middlewares/authMiddleware'); // Your authentication middleware

// GET current user balance
router.get('/', authMiddleware, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('balance');
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        res.json({
            success: true,
            balance: user.balance
        });
    } catch (error) {
        console.error('Error fetching balance:', error);
        res.status(500).json({
            success: false,
            message: 'Server error while fetching balance'
        });
    }
});

// POST update user balance (add amount)
router.post('/update', authMiddleware, async (req, res) => {
    try {
        const { amount } = req.body;

        // Validate input
        if (amount === undefined || amount === null) {
            return res.status(400).json({
                success: false,
                message: 'Amount is required'
            });
        }

        const amountNum = parseFloat(amount);
        if (isNaN(amountNum) || amountNum <= 0) {
            return res.status(400).json({
                success: false,
                message: 'Amount must be a valid positive number'
            });
        }

        // Find user and update balance
        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        // Update balance by adding the amount
        user.balance += amountNum;
        
        // Save the updated user
        await user.save();

        res.json({
            success: true,
            balance: user.balance,
            message: `Successfully added $${amountNum.toFixed(2)} to your balance`
        });

    } catch (error) {
        console.error('Error updating balance:', error);
        res.status(500).json({
            success: false,
            message: 'Server error while updating balance'
        });
    }
});

module.exports = router;