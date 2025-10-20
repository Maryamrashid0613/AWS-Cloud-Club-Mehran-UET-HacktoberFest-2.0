const express = require('express');
const {
  getCourses,
  getCourseById,
  createCourse,
  updateCourse,
  deleteCourse,
  enrollInCourse,
  updateCourseProgress,
  addCourseReview,
  uploadLessonFile,
} = require('../controllers/courseController');
const { protect, authorizeRoles } = require('../middleware/authMiddleware');
const router = express.Router();

// Public routes
router.get('/', getCourses); // Browse courses
router.get('/:id', getCourseById); // View single course details

// Instructor routes
router.post('/', protect, authorizeRoles('instructor'), createCourse); // Create new course
router.put('/:id', protect, authorizeRoles('instructor'), updateCourse); // Update own course
router.delete('/:id', protect, authorizeRoles('instructor', 'admin'), deleteCourse); // Delete own course (admin can also delete)
router.post('/upload-lesson-file', protect, authorizeRoles('instructor'), uploadLessonFile);




// Student routes
router.post('/:id/enroll', protect, authorizeRoles('student'), enrollInCourse); // Enroll in a course
router.put('/:courseId/progress/:lessonId', protect, authorizeRoles('student'), updateCourseProgress); // Update lesson progress
router.post('/:id/reviews', protect, authorizeRoles('student'), addCourseReview); // Add review/rating

module.exports = router;