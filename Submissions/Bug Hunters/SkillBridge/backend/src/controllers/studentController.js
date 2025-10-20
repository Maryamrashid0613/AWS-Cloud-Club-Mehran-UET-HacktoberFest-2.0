const Course = require('../models/Course');
const Enrollment = require('../models/Enrollment');
const Review = require('../models/Review');

const getAvailableCourses = async (req, res) => {
  try {
    const { page = 1, limit = 10, category, level, search } = req.query;
    const query = { isPublished: true, status: 'approved' };

    if (category) query.category = category;
    if (level) query.level = level;
    if (search) {
      query.$text = { $search: search };
    }

    const courses = await Course.find(query)
      .populate('instructor', 'name avatar')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Course.countDocuments(query);

    res.json({
      courses,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    console.error('Get available courses error:', error);
    res.status(500).json({ message: 'Failed to fetch courses', error: error.message });
  }
};

const getCourseDetails = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id)
      .populate('instructor', 'name avatar bio')
      .populate('reviews.student', 'name avatar');

    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    res.json({ course });
  } catch (error) {
    console.error('Get course details error:', error);
    res.status(500).json({ message: 'Failed to fetch course details', error: error.message });
  }
};

const enrollInCourse = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    // Check if already enrolled
    const existingEnrollment = await Enrollment.findOne({
      student: req.user.id,
      course: req.params.id
    });

    if (existingEnrollment) {
      return res.status(400).json({ message: 'Already enrolled in this course' });
    }

    const enrollment = new Enrollment({
      student: req.user.id,
      course: req.params.id
    });

    await enrollment.save();

    // Update enrollment count
    course.enrollmentCount += 1;
    await course.save();

    res.status(201).json({
      message: 'Successfully enrolled in course',
      enrollment
    });
  } catch (error) {
    console.error('Enroll in course error:', error);
    res.status(500).json({ message: 'Failed to enroll in course', error: error.message });
  }
};

const getMyEnrollments = async (req, res) => {
  try {
    const enrollments = await Enrollment.find({ student: req.user.id })
      .populate('course')
      .sort({ enrolledAt: -1 });

    res.json({ enrollments });
  } catch (error) {
    console.error('Get my enrollments error:', error);
    res.status(500).json({ message: 'Failed to fetch enrollments', error: error.message });
  }
};

const getEnrollment = async (req, res) => {
  try {
    const enrollment = await Enrollment.findOne({
      _id: req.params.id,
      student: req.user.id
    }).populate('course');

    if (!enrollment) {
      return res.status(404).json({ message: 'Enrollment not found' });
    }

    res.json({ enrollment });
  } catch (error) {
    console.error('Get enrollment error:', error);
    res.status(500).json({ message: 'Failed to fetch enrollment', error: error.message });
  }
};

const updateProgress = async (req, res) => {
  try {
    const { lessonId } = req.body;
    const enrollment = await Enrollment.findOne({
      _id: req.params.id,
      student: req.user.id
    }).populate('course');

    if (!enrollment) {
      return res.status(404).json({ message: 'Enrollment not found' });
    }

    // Check if lesson is already completed
    const isAlreadyCompleted = enrollment.completedLessons.some(
      lesson => lesson.lesson.toString() === lessonId
    );

    if (!isAlreadyCompleted) {
      enrollment.completedLessons.push({
        lesson: lessonId,
        completedAt: new Date()
      });

      // Update progress
      const totalLessons = enrollment.course.lessons.length;
      enrollment.progress = Math.round((enrollment.completedLessons.length / totalLessons) * 100);

      if (enrollment.progress === 100) {
        enrollment.isCompleted = true;
        enrollment.completedAt = new Date();
      }

      await enrollment.save();
    }

    res.json({
      message: 'Progress updated successfully',
      enrollment
    });
  } catch (error) {
    console.error('Update progress error:', error);
    res.status(500).json({ message: 'Failed to update progress', error: error.message });
  }
};

const addReview = async (req, res) => {
  try {
    const { rating, comment } = req.body;

    // Check if user is enrolled
    const enrollment = await Enrollment.findOne({
      student: req.user.id,
      course: req.params.id
    });

    if (!enrollment) {
      return res.status(400).json({ message: 'You must be enrolled to review this course' });
    }

    // Check if already reviewed
    const existingReview = await Review.findOne({
      student: req.user.id,
      course: req.params.id
    });

    if (existingReview) {
      return res.status(400).json({ message: 'You have already reviewed this course' });
    }

    const review = new Review({
      student: req.user.id,
      course: req.params.id,
      rating,
      comment,
      isVerified: true // Assuming enrollment means verification
    });

    await review.save();

    res.status(201).json({
      message: 'Review added successfully',
      review
    });
  } catch (error) {
    console.error('Add review error:', error);
    res.status(500).json({ message: 'Failed to add review', error: error.message });
  }
};

const updateReview = async (req, res) => {
  try {
    const { rating, comment } = req.body;

    const review = await Review.findOneAndUpdate(
      { _id: req.params.id, student: req.user.id },
      { rating, comment },
      { new: true, runValidators: true }
    );

    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }

    res.json({
      message: 'Review updated successfully',
      review
    });
  } catch (error) {
    console.error('Update review error:', error);
    res.status(500).json({ message: 'Failed to update review', error: error.message });
  }
};

const deleteReview = async (req, res) => {
  try {
    const review = await Review.findOneAndDelete({
      _id: req.params.id,
      student: req.user.id
    });

    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }

    res.json({ message: 'Review deleted successfully' });
  } catch (error) {
    console.error('Delete review error:', error);
    res.status(500).json({ message: 'Failed to delete review', error: error.message });
  }
};

const getDashboard = async (req, res) => {
  try {
    const enrollments = await Enrollment.find({ student: req.user.id })
      .populate('course', 'title thumbnail instructor')
      .sort({ enrolledAt: -1 })
      .limit(5);

    const totalEnrollments = await Enrollment.countDocuments({ student: req.user.id });
    const completedCourses = await Enrollment.countDocuments({ 
      student: req.user.id, 
      isCompleted: true 
    });

    res.json({
      recentEnrollments: enrollments,
      totalEnrollments,
      completedCourses
    });
  } catch (error) {
    console.error('Get dashboard error:', error);
    res.status(500).json({ message: 'Failed to fetch dashboard data', error: error.message });
  }
};

const getCertificates = async (req, res) => {
  try {
    const enrollments = await Enrollment.find({
      student: req.user.id,
      isCompleted: true,
      certificateIssued: true
    }).populate('course', 'title');

    res.json({ certificates: enrollments });
  } catch (error) {
    console.error('Get certificates error:', error);
    res.status(500).json({ message: 'Failed to fetch certificates', error: error.message });
  }
};

module.exports = {
  getAvailableCourses,
  getCourseDetails,
  enrollInCourse,
  getMyEnrollments,
  getEnrollment,
  updateProgress,
  addReview,
  updateReview,
  deleteReview,
  getDashboard,
  getCertificates
};
