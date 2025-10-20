// routes/products.js
const express = require('express');
const {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  getLowStockProducts
} = require('../controllers/productController');
const { protect, authorize } = require('../middleware/authMiddleware');
const router = express.Router();

// Routes accessible by Admin and Cashier
router.get('/', protect, getProducts);
router.get('/:id', protect, getProductById);
router.get('/lowstock', protect, getLowStockProducts); // Specific low stock route

// Routes accessible by Admin only
router.post('/', protect, authorize('admin'), createProduct);
router.put('/:id', protect, authorize('admin'), updateProduct);
router.delete('/:id', protect, authorize('admin'), deleteProduct);


module.exports = router;