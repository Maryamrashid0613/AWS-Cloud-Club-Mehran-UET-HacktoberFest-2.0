const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');

// All routes require authentication and admin role
router.use(authMiddleware);
router.use(roleMiddleware('admin'));

// User management
router.get('/users', adminController.getAllUsers);
router.get('/users/:id', adminController.getUser);
router.put('/users/:id/role', adminController.updateUserRole);
router.delete('/users/:id', adminController.deleteUser);

// Course approval - REMOVE DUPLICATES, KEEP THESE
router.get('/courses/pending', adminController.getPendingCourses);
router.put('/courses/:id/approve', adminController.approveCourse);
router.put('/courses/:id/reject', adminController.rejectCourse);

// Analytics and reports - REMOVE DUPLICATES, KEEP THESE
router.get('/analytics', adminController.getAnalytics);
router.get('/reports/courses', adminController.getCourseReports);
router.get('/reports/users', adminController.getUserReports);

// System settings
router.get('/settings', adminController.getSettings);
router.put('/settings', adminController.updateSettings);

// REMOVE THESE DUPLICATE ROUTES:
// router.get('/admin/analytics', adminController.getAnalytics);
// router.get('/admin/courses/pending', adminController.getPendingCourses);
// router.put('/admin/courses/:id/approve', adminController.approveCourse);
// router.put('/admin/courses/:id/reject', adminController.rejectCourse);

module.exports = router;