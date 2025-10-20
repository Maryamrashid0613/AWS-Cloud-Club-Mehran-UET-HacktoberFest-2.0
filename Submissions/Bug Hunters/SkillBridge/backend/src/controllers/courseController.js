const Course = require('../models/Course');
const Enrollment = require('../models/Enrollment');
const User = require('../models/User');

// Public routes
const getPublicCourses = async (req, res) => {
  try {
    const { category, difficulty, search, page = 1, limit = 12 } = req.query;
    
    const query = { status: 'approved' };
    
    if (category) query.category = category;
    if (difficulty) query.difficultyLevel = difficulty;
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    const courses = await Course.find(query)
      .populate('instructor', 'name email')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Course.countDocuments(query);

    res.json({
      success: true,
      courses,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    console.error('Error fetching public courses:', error);
    res.status(500).json({ message: 'Failed to fetch courses' });
  }
};

const getPublicCourseById = async (req, res) => {
  try {
    const course = await Course.findOne({ 
      _id: req.params.id, 
      status: 'approved' 
    }).populate('instructor', 'name email');

    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    res.json({ success: true, course });
  } catch (error) {
    console.error('Error fetching course:', error);
    res.status(500).json({ message: 'Failed to fetch course' });
  }
};

// Student routes
const getAvailableCourses = async (req, res) => {
  try {
    const courses = await Course.find({ status: 'approved' })
      .populate('instructor', 'name email')
      .sort({ createdAt: -1 });

    res.json({ success: true, courses });
  } catch (error) {
    console.error('Error fetching available courses:', error);
    res.status(500).json({ message: 'Failed to fetch courses' });
  }
};

const getStudentEnrollments = async (req, res) => {
  try {
    const enrollments = await Enrollment.find({ student: req.user.id })
      .populate('course')
      .sort({ enrolledAt: -1 });

    res.json({ success: true, enrollments });
  } catch (error) {
    console.error('Error fetching enrollments:', error);
    res.status(500).json({ message: 'Failed to fetch enrollments' });
  }
};

const enrollInCourse = async (req, res) => {
  try {
    const { courseId } = req.params;
    const studentId = req.user.id;

    // Check if course exists and is approved
    const course = await Course.findOne({ _id: courseId, status: 'approved' });
    if (!course) {
      return res.status(404).json({ message: 'Course not found or not approved' });
    }

    // Check if already enrolled
    const existingEnrollment = await Enrollment.findOne({ 
      student: studentId, 
      course: courseId 
    });
    
    if (existingEnrollment) {
      return res.status(400).json({ message: 'Already enrolled in this course' });
    }

    // Create enrollment
    const enrollment = new Enrollment({
      student: studentId,
      course: courseId,
      enrolledAt: new Date()
    });

    await enrollment.save();

    // Update course enrollment count
    await Course.findByIdAndUpdate(courseId, { 
      $inc: { enrollmentCount: 1 } 
    });

    res.json({ 
      success: true, 
      message: 'Successfully enrolled in course',
      enrollment 
    });
  } catch (error) {
    console.error('Error enrolling in course:', error);
    res.status(500).json({ message: 'Failed to enroll in course' });
  }
};

const addReview = async (req, res) => {
  try {
    const { courseId } = req.params;
    const { rating, comment } = req.body;
    const studentId = req.user.id;

    // Check if student is enrolled
    const enrollment = await Enrollment.findOne({ 
      student: studentId, 
      course: courseId 
    });
    
    if (!enrollment) {
      return res.status(400).json({ message: 'You must be enrolled to review this course' });
    }

    // Update enrollment with review
    enrollment.rating = rating;
    enrollment.review = comment;
    enrollment.reviewedAt = new Date();
    await enrollment.save();

    // Update course average rating
    const reviews = await Enrollment.find({ 
      course: courseId, 
      rating: { $exists: true } 
    });
    
    const averageRating = reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length;
    
    await Course.findByIdAndUpdate(courseId, { 
      'rating.average': averageRating,
      'rating.count': reviews.length
    });

    res.json({ 
      success: true, 
      message: 'Review added successfully' 
    });
  } catch (error) {
    console.error('Error adding review:', error);
    res.status(500).json({ message: 'Failed to add review' });
  }
};

// Instructor routes
const getInstructorCourses = async (req, res) => {
  try {
    const courses = await Course.find({ instructor: req.user.id })
      .sort({ createdAt: -1 });

    res.json({ success: true, courses });
  } catch (error) {
    console.error('Error fetching instructor courses:', error);
    res.status(500).json({ message: 'Failed to fetch courses' });
  }
};

const createCourse = async (req, res) => {
  try {
    const courseData = {
      ...req.body,
      instructor: req.user.id,
      status: 'pending', // This is crucial
      enrollmentCount: 0,
      rating: { average: 0, count: 0 }
    };

    if (req.file) {
      courseData.thumbnail = req.file.path;
    }

    const course = new Course(courseData);
    await course.save();

    res.status(201).json({ 
      success: true, 
      message: 'Course created successfully. Awaiting admin approval.',
      course 
    });
  } catch (error) {
    console.error('Error creating course:', error);
    res.status(500).json({ message: 'Failed to create course' });
  }
};

const updateCourse = async (req, res) => {
  try {
    const { id } = req.params;
    const course = await Course.findOne({ _id: id, instructor: req.user.id });

    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    const updateData = { ...req.body };
    if (req.file) {
      updateData.thumbnail = req.file.path;
    }

    const updatedCourse = await Course.findByIdAndUpdate(
      id, 
      updateData, 
      { new: true }
    );

    res.json({ 
      success: true, 
      message: 'Course updated successfully',
      course: updatedCourse 
    });
  } catch (error) {
    console.error('Error updating course:', error);
    res.status(500).json({ message: 'Failed to update course' });
  }
};

const deleteCourse = async (req, res) => {
  try {
    const { id } = req.params;
    const course = await Course.findOne({ _id: id, instructor: req.user.id });

    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    await Course.findByIdAndDelete(id);
    await Enrollment.deleteMany({ course: id });

    res.json({ 
      success: true, 
      message: 'Course deleted successfully' 
    });
  } catch (error) {
    console.error('Error deleting course:', error);
    res.status(500).json({ message: 'Failed to delete course' });
  }
};

// Admin routes
const getPlatformStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalCourses = await Course.countDocuments();
    const totalEnrollments = await Enrollment.countDocuments();
    const pendingApprovals = await Course.countDocuments({ status: 'pending' });

    res.json({
      success: true,
      totalUsers,
      totalCourses,
      totalEnrollments,
      pendingApprovals
    });
  } catch (error) {
    console.error('Error fetching platform stats:', error);
    res.status(500).json({ message: 'Failed to fetch platform stats' });
  }
};

const getPendingCourses = async (req, res) => {
  try {
    const courses = await Course.find({ status: 'pending' })
      .populate('instructor', 'name email')
      .sort({ createdAt: -1 });

    res.json({ success: true, courses });
  } catch (error) {
    console.error('Error fetching pending courses:', error);
    res.status(500).json({ message: 'Failed to fetch pending courses' });
  }
};

const approveCourse = async (req, res) => {
  try {
    const { id } = req.params;
    const course = await Course.findByIdAndUpdate(
      id, 
      { status: 'approved' }, 
      { new: true }
    );

    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    res.json({ 
      success: true, 
      message: 'Course approved successfully',
      course 
    });
  } catch (error) {
    console.error('Error approving course:', error);
    res.status(500).json({ message: 'Failed to approve course' });
  }
};

const rejectCourse = async (req, res) => {
  try {
    const { id } = req.params;
    const course = await Course.findByIdAndUpdate(
      id, 
      { status: 'rejected' }, 
      { new: true }
    );

    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    res.json({ 
      success: true, 
      message: 'Course rejected',
      course 
    });
  } catch (error) {
    console.error('Error rejecting course:', error);
    res.status(500).json({ message: 'Failed to reject course' });
  }
};

module.exports = {
  getPublicCourses,
  getPublicCourseById,
  getAvailableCourses,
  getStudentEnrollments,
  enrollInCourse,
  addReview,
  getInstructorCourses,
  createCourse,
  updateCourse,
  deleteCourse,
  getPlatformStats,
  getPendingCourses,
  approveCourse,
  rejectCourse
};