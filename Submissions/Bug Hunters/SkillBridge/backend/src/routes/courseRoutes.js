const express = require('express');
const { body, validationResult } = require('express-validator');
const courseController = require('../controllers/courseController');
const authMiddleware = require('../middleware/authMiddleware');
const { upload } = require('../config/awsConfig');

const router = express.Router();

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

// Course validation rules
const courseValidation = [
  body('title').trim().notEmpty().withMessage('Course title is required'),
  body('description').trim().notEmpty().withMessage('Course description is required'),
  body('category').trim().notEmpty().withMessage('Course category is required'),
  body('difficultyLevel').isIn(['Beginner', 'Intermediate', 'Advanced']).withMessage('Invalid difficulty level'),
  body('duration').isNumeric().withMessage('Duration must be a number'),
  body('syllabus').trim().notEmpty().withMessage('Course syllabus is required')
];

// Public routes
router.get('/public', courseController.getPublicCourses);
router.get('/public/:id', courseController.getPublicCourseById);

// Protected routes
router.use(authMiddleware);

// Student routes
router.get('/student/available', courseController.getAvailableCourses);
router.get('/student/enrollments', courseController.getStudentEnrollments);
router.post('/student/enroll/:courseId', courseController.enrollInCourse);
router.post('/student/review/:courseId', [
  body('rating').isInt({ min: 1, max: 5 }).withMessage('Rating must be between 1 and 5'),
  body('comment').optional().trim()
], handleValidationErrors, courseController.addReview);

// Instructor routes
router.get('/instructor/my-courses', courseController.getInstructorCourses);
router.post('/instructor/create', upload.single('thumbnail'), courseValidation, handleValidationErrors, courseController.createCourse);
router.put('/instructor/update/:id', upload.single('thumbnail'), courseValidation, handleValidationErrors, courseController.updateCourse);
router.delete('/instructor/delete/:id', courseController.deleteCourse);

// Admin routes
router.get('/admin/stats', courseController.getPlatformStats);
router.get('/admin/pending-courses', courseController.getPendingCourses);
router.put('/admin/approve/:id', courseController.approveCourse);
router.put('/admin/reject/:id', courseController.rejectCourse);

module.exports = router;
