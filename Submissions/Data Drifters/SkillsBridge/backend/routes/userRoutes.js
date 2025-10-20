const express = require('express');
const {
  getMyEnrollments,
  getMyCoursesAsInstructor,
  getDetailedEnrollment,
  generateCertificate,
} = require('../controllers/userController');
const { protect, authorizeRoles } = require('../middleware/authMiddleware');
const router = express.Router();

// Student-specific routes
router.get('/me/enrollments', protect, authorizeRoles('student'), getMyEnrollments); // Get all courses a student is enrolled in
router.get('/me/enrollments/:courseId', protect, authorizeRoles('student'), getDetailedEnrollment); // Get detailed enrollment for a specific course
router.get('/me/enrollments/:enrollmentId/certificate', protect, authorizeRoles('student'), generateCertificate); // Generate certificate

// Instructor-specific routes
router.get('/me/courses', protect, authorizeRoles('instructor'), getMyCoursesAsInstructor); // Get all courses created by an instructor

module.exports = router;