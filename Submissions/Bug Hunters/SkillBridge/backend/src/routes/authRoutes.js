const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const authController = require('../controllers/authController');
const authMiddleware = require('../middleware/authMiddleware');

// Validation rules
const registerValidation = [
  body('name').trim().notEmpty().withMessage('Name is required'),
  body('email').isEmail().normalizeEmail().withMessage('Valid email is required'),
  body('password').isLength({ min: 12 }).withMessage('Password must be at least 12 characters'),
  body('role').optional().isIn(['student', 'instructor', 'admin']).withMessage('Invalid role'),
  body('accessKey').custom((value, { req }) => {
    const role = req.body.role;
    
    // No access key required for students
    if (role === 'student') {
      return true;
    }
    
    // Access key required for instructor and admin
    if (role === 'instructor' || role === 'admin') {
      if (!value) {
        throw new Error(`${role} access key is required`);
      }
      
      // Validate access keys
      const validKeys = {
        instructor: process.env.INSTRUCTOR_ACCESS_KEY || 'INSTRUCTOR_KEY_2024',
        admin: process.env.ADMIN_ACCESS_KEY || 'ADMIN_KEY_2024'
      };
      
      if (value !== validKeys[role]) {
        throw new Error(`Invalid ${role} access key`);
      }
    }
    
    return true;
  })
];

const loginValidation = [
  body('email').isEmail().normalizeEmail().withMessage('Valid email is required'),
  body('password').notEmpty().withMessage('Password is required')
];

// Validation middleware
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      message: 'Validation failed',
      errors: errors.array()
    });
  }
  next();
};

// Routes
router.post('/register', registerValidation, handleValidationErrors, authController.register);
router.post('/login', loginValidation, handleValidationErrors, authController.login);
router.get('/me', authMiddleware, authController.getProfile);
router.put('/profile', authMiddleware, authController.updateProfile);
router.post('/logout', authMiddleware, authController.logout);

module.exports = router;
