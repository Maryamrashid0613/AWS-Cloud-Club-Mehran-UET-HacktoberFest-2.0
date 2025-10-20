const User = require('../models/User');
const Course = require('../models/Course');
const Enrollment = require('../models/Enrollment');

const getAllUsers = async (req, res) => {
  try {
    const { page = 1, limit = 10, role } = req.query;
    const query = {};

    if (role) query.role = role;

    const users = await User.find(query)
      .select('-password')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await User.countDocuments(query);

    res.json({
      success: true,
      users,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    console.error('Get all users error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch users', error: error.message });
  }
};

const getUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
      .select('-password')
      .populate('enrolledCourses.course')
      .populate('createdCourses');

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    res.json({ success: true, user });
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch user', error: error.message });
  }
};

const updateUserRole = async (req, res) => {
  try {
    const { role } = req.body;

    if (!['student', 'instructor', 'admin'].includes(role)) {
      return res.status(400).json({ success: false, message: 'Invalid role' });
    }

    const user = await User.findByIdAndUpdate(
      req.params.id,
      { role },
      { new: true, runValidators: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    res.json({
      success: true,
      message: 'User role updated successfully',
      user
    });
  } catch (error) {
    console.error('Update user role error:', error);
    res.status(500).json({ success: false, message: 'Failed to update user role', error: error.message });
  }
};

const deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    res.json({ success: true, message: 'User deleted successfully' });
  } catch (error) {
    console.error('Delete user error:', error);
    res.status(500).json({ success: false, message: 'Failed to delete user', error: error.message });
  }
};

const getPendingCourses = async (req, res) => {
  try {
    const courses = await Course.find({ status: 'pending' })
      .populate('instructor', 'name email')
      .sort({ createdAt: -1 });

    res.json({ 
      success: true, 
      courses 
    });
  } catch (error) {
    console.error('Get pending courses error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch pending courses', error: error.message });
  }
};

const approveCourse = async (req, res) => {
  try {
    const course = await Course.findByIdAndUpdate(
      req.params.id,
      { status: 'approved', publishedAt: new Date() },
      { new: true }
    ).populate('instructor', 'name email');

    if (!course) {
      return res.status(404).json({ success: false, message: 'Course not found' });
    }

    res.json({
      success: true,
      message: 'Course approved successfully',
      course
    });
  } catch (error) {
    console.error('Approve course error:', error);
    res.status(500).json({ success: false, message: 'Failed to approve course', error: error.message });
  }
};

const rejectCourse = async (req, res) => {
  try {
    const course = await Course.findByIdAndUpdate(
      req.params.id,
      { status: 'rejected' },
      { new: true }
    ).populate('instructor', 'name email');

    if (!course) {
      return res.status(404).json({ success: false, message: 'Course not found' });
    }

    res.json({
      success: true,
      message: 'Course rejected successfully',
      course
    });
  } catch (error) {
    console.error('Reject course error:', error);
    res.status(500).json({ success: false, message: 'Failed to reject course', error: error.message });
  }
};

const getAnalytics = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalInstructors = await User.countDocuments({ role: 'instructor' });
    const totalStudents = await User.countDocuments({ role: 'student' });
    const totalCourses = await Course.countDocuments();
    const approvedCourses = await Course.countDocuments({ status: 'approved' });
    const pendingCourses = await Course.countDocuments({ status: 'pending' });
    const totalEnrollments = await Enrollment.countDocuments();

    res.json({
      success: true,
      users: {
        total: totalUsers,
        instructors: totalInstructors,
        students: totalStudents
      },
      courses: {
        total: totalCourses,
        approved: approvedCourses,
        pending: pendingCourses
      },
      enrollments: {
        total: totalEnrollments
      }
    });
  } catch (error) {
    console.error('Get analytics error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch analytics', error: error.message });
  }
};

const getCourseReports = async (req, res) => {
  try {
    const courses = await Course.find({ status: 'approved' })
      .populate('instructor', 'name')
      .sort({ enrollmentCount: -1 });

    res.json({ success: true, courses });
  } catch (error) {
    console.error('Get course reports error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch course reports', error: error.message });
  }
};

const getUserReports = async (req, res) => {
  try {
    const users = await User.find()
      .select('name email role createdAt')
      .sort({ createdAt: -1 });

    res.json({ success: true, users });
  } catch (error) {
    console.error('Get user reports error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch user reports', error: error.message });
  }
};

const getSettings = async (req, res) => {
  try {
    const settings = {
      siteName: 'SkillBridge',
      allowRegistration: true,
      requireEmailVerification: false,
      defaultUserRole: 'student'
    };

    res.json({ success: true, settings });
  } catch (error) {
    console.error('Get settings error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch settings', error: error.message });
  }
};

const updateSettings = async (req, res) => {
  try {
    const settings = req.body;

    res.json({
      success: true,
      message: 'Settings updated successfully',
      settings
    });
  } catch (error) {
    console.error('Update settings error:', error);
    res.status(500).json({ success: false, message: 'Failed to update settings', error: error.message });
  }
};

// Add this if you don't have getPendingInstructors
const getPendingInstructors = async (req, res) => {
  try {
    // For now, return empty array if you don't have instructor approval system
    const instructors = await User.find({ 
      role: 'instructor', 
      status: 'pending' 
    }).select('-password') || [];

    res.json({ 
      success: true, 
      instructors 
    });
  } catch (error) {
    console.error('Error fetching pending instructors:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch pending instructors', error: error.message });
  }
};

// REMOVE THESE DUPLICATE FUNCTIONS - THEY ARE ALREADY DEFINED ABOVE
// const getAnalytics = async (req, res) => { ... } // DUPLICATE - REMOVE
// const getPendingCourses = async (req, res) => { ... } // DUPLICATE - REMOVE

module.exports = {
  getAllUsers,
  getUser,
  updateUserRole,
  deleteUser,
  getPendingCourses,
  approveCourse,
  rejectCourse,
  getAnalytics,
  getCourseReports,
  getUserReports,
  getSettings,
  updateSettings,
  getPendingInstructors // ADD THIS
};