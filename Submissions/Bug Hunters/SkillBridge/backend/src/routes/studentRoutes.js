const express = require('express');
const router = express.Router();
const studentController = require('../controllers/studentController');
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');

// All routes require authentication and student role
router.use(authMiddleware);
router.use(roleMiddleware('student'));

// Course enrollment and learning routes
router.get('/courses', studentController.getAvailableCourses);
router.get('/courses/:id', studentController.getCourseDetails);
router.post('/courses/:id/enroll', studentController.enrollInCourse);
router.get('/enrollments', studentController.getMyEnrollments);
router.get('/enrollments/:id', studentController.getEnrollment);
router.put('/enrollments/:id/progress', studentController.updateProgress);

// Reviews and ratings
router.post('/courses/:id/review', studentController.addReview);
router.put('/reviews/:id', studentController.updateReview);
router.delete('/reviews/:id', studentController.deleteReview);

// Dashboard and progress
router.get('/dashboard', studentController.getDashboard);
router.get('/certificates', studentController.getCertificates);

module.exports = router;
