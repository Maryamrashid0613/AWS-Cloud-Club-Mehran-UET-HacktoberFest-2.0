const User = require('../models/User');
const Course = require('../models/Course');
const Enrollment = require('../models/Enrollment');

// @desc    Get all pending instructor accounts
// @route   GET /api/admin/instructors/pending
// @access  Private/Admin
const getPendingInstructors = async (req, res) => {
  try {
    const instructors = await User.find({ role: 'instructor', isApproved: false }).select('-password');
    res.json(instructors);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Approve an instructor account
// @route   PUT /api/admin/instructors/:id/approve
// @access  Private/Admin
const approveInstructor = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (user && user.role === 'instructor') {
      user.isApproved = true;
      await user.save();
      res.json({ message: 'Instructor approved successfully' });
    } else {
      res.status(404).json({ message: 'Instructor not found or not an instructor role' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Reject (decline approval for) an instructor account
// @route   PUT /api/admin/instructors/:id/reject
// @access  Private/Admin
const rejectInstructor = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);

        if (user && user.role === 'instructor') {
            user.isApproved = false; // Explicitly set to false, in case it was accidentally true or you need to revert
            await user.save();
            // Optionally, you might want to delete the user or set a 'rejected' status
            res.json({ message: 'Instructor approval rejected' });
        } else {
            res.status(404).json({ message: 'Instructor not found or not an instructor role' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get all pending courses for approval
// @route   GET /api/admin/courses/pending
// @access  Private/Admin
const getPendingCourses = async (req, res) => {
  try {
    const courses = await Course.find({ isApproved: false }).populate('instructor', 'name email');
    res.json(courses);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Approve a course
// @route   PUT /api/admin/courses/:id/approve
// @access  Private/Admin
const approveCourse = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);

    if (course) {
      course.isApproved = true;
      await course.save();
      res.json({ message: 'Course approved successfully' });
    } else {
      res.status(404).json({ message: 'Course not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Reject a course
// @route   PUT /api/admin/courses/:id/reject
// @access  Private/Admin
const rejectCourse = async (req, res) => {
    try {
        const course = await Course.findById(req.params.id);

        if (course) {
            course.isApproved = false; // Explicitly set to false
            await course.save();
            // Optionally, you might want to send a notification to the instructor
            res.json({ message: 'Course approval rejected' });
        } else {
            res.status(404).json({ message: 'Course not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


// @desc    Get all users (students, instructors, admins)
// @route   GET /api/admin/users
// @access  Private/Admin
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({ role: { $ne: 'admin' } }).select('-password');
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete a user
// @route   DELETE /api/admin/users/:id
// @access  Private/Admin
const deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (user) {
        // Prevent deleting the primary admin or self-deletion if that's a concern
        if (user.role === 'admin' && user._id.toString() === req.user._id.toString()) {
            return res.status(403).json({ message: 'Cannot delete your own admin account' });
        }
        await User.deleteOne({ _id: req.params.id });

        // Also delete related enrollments and courses if user was an instructor
        if (user.role === 'instructor') {
            await Course.deleteMany({ instructor: req.params.id });
        }
        await Enrollment.deleteMany({ student: req.params.id }); // Covers both student & instructor if they were also students
        res.json({ message: 'User removed' });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get platform analytics (active users, total enrollments, etc.)
// @route   GET /api/admin/analytics
// @access  Private/Admin
const getPlatformAnalytics = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalStudents = await User.countDocuments({ role: 'student' });
    const totalInstructors = await User.countDocuments({ role: 'instructor' });
    const approvedInstructors = await User.countDocuments({ role: 'instructor', isApproved: true });
    const pendingInstructors = await User.countDocuments({ role: 'instructor', isApproved: false });
    const totalCourses = await Course.countDocuments();
    const approvedCourses = await Course.countDocuments({ isApproved: true });
    const pendingCourses = await Course.countDocuments({ isApproved: false });
    const totalEnrollments = await Enrollment.countDocuments();
    const completedEnrollments = await Enrollment.countDocuments({ isCompleted: true });

    // You can add more complex analytics like:
    // - Courses by category
    // - Top enrolled courses
    // - Active users (e.g., users with activity in last X days - requires more tracking)

    res.json({
      totalUsers,
      totalStudents,
      totalInstructors,
      approvedInstructors,
      pendingInstructors,
      totalCourses,
      approvedCourses,
      pendingCourses,
      totalEnrollments,
      completedEnrollments,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getPendingInstructors,
  approveInstructor,
  rejectInstructor,
  getPendingCourses,
  approveCourse,
  rejectCourse,
  getAllUsers,
  deleteUser,
  getPlatformAnalytics,
};