const express = require('express');
const {
  getPendingInstructors,
  approveInstructor,
  rejectInstructor,
  getPendingCourses,
  approveCourse,
  rejectCourse,
  getAllUsers,
  getPlatformAnalytics,
  deleteUser,
} = require('../controllers/adminController');
const { protect, authorizeRoles } = require('../middleware/authMiddleware');
const router = express.Router();

// All admin routes are protected and require 'admin' role
router.use(protect, authorizeRoles('admin'));

// Instructor management
router.get('/instructors/pending', getPendingInstructors);
router.put('/instructors/:id/approve', approveInstructor);
router.put('/instructors/:id/reject', rejectInstructor); // If you want a "reject" status beyond just not approved

// Course management
router.get('/courses/pending', getPendingCourses);
router.put('/courses/:id/approve', approveCourse);
router.put('/courses/:id/reject', rejectCourse);

// User management (can be more specific if needed)
router.get('/users', getAllUsers);
router.delete('/users/:id', deleteUser); // Be careful with this!

// Platform analytics
router.get('/analytics', getPlatformAnalytics);

module.exports = router;