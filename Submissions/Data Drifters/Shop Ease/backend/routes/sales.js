// routes/sales.js
const express = require('express');
const {
  createSale,
  getSales,
  getSalesReports
} = require('../controllers/saleController');
const { protect, authorize } = require('../middleware/authMiddleware');
const router = express.Router();

// Sales can be created by Admin or Cashier
router.post('/', protect, authorize('admin', 'cashier'), createSale);

// Get all sales (Admin and Cashier can view, but maybe only Admin sees full details in a real app)
router.get('/', protect, getSales);

// Sales reports are typically for Admin only
router.get('/reports', protect, authorize('admin'), getSalesReports);

module.exports = router;