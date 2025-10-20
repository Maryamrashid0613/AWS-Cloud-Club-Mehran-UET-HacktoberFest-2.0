// routes/auth.js
const express = require('express');
const { registerUser, loginUser, getMe } = require('../controllers/authController');
const { protect, authorize } = require('../middleware/authMiddleware');
const router = express.Router();

router.post('/register', registerUser); // For initial setup, allow registration. In prod, restrict.
router.post('/login', loginUser);
router.get('/me', protect, getMe);

module.exports = router;