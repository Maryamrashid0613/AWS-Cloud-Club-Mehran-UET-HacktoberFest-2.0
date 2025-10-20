const Course = require('../models/Course');
const Enrollment = require('../models/Enrollment');

const getMyCourses = async (req, res) => {
  try {
    const courses = await Course.find({ instructor: req.user.id })
      .sort({ createdAt: -1 });

    res.json({ courses });
  } catch (error) {
    console.error('Get my courses error:', error);
    res.status(500).json({ message: 'Failed to fetch courses', error: error.message });
  }
};

const createCourse = async (req, res) => {
  try {
    const courseData = {
      ...req.body,
      instructor: req.user.id
    };

    const course = new Course(courseData);
    await course.save();

    res.status(201).json({
      message: 'Course created successfully',
      course
    });
  } catch (error) {
    console.error('Create course error:', error);
    res.status(500).json({ message: 'Failed to create course', error: error.message });
  }
};

const getCourse = async (req, res) => {
  try {
    const course = await Course.findOne({
      _id: req.params.id,
      instructor: req.user.id
    });

    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    res.json({ course });
  } catch (error) {
    console.error('Get course error:', error);
    res.status(500).json({ message: 'Failed to fetch course', error: error.message });
  }
};

const updateCourse = async (req, res) => {
  try {
    const course = await Course.findOneAndUpdate(
      { _id: req.params.id, instructor: req.user.id },
      req.body,
      { new: true, runValidators: true }
    );

    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    res.json({
      message: 'Course updated successfully',
      course
    });
  } catch (error) {
    console.error('Update course error:', error);
    res.status(500).json({ message: 'Failed to update course', error: error.message });
  }
};

const deleteCourse = async (req, res) => {
  try {
    const course = await Course.findOneAndDelete({
      _id: req.params.id,
      instructor: req.user.id
    });

    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    res.json({ message: 'Course deleted successfully' });
  } catch (error) {
    console.error('Delete course error:', error);
    res.status(500).json({ message: 'Failed to delete course', error: error.message });
  }
};

const publishCourse = async (req, res) => {
  try {
    const course = await Course.findOneAndUpdate(
      { _id: req.params.id, instructor: req.user.id },
      { status: 'pending', isPublished: true },
      { new: true }
    );

    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    res.json({
      message: 'Course submitted for approval',
      course
    });
  } catch (error) {
    console.error('Publish course error:', error);
    res.status(500).json({ message: 'Failed to publish course', error: error.message });
  }
};

const getAnalytics = async (req, res) => {
  try {
    const totalCourses = await Course.countDocuments({ instructor: req.user.id });
    const publishedCourses = await Course.countDocuments({ 
      instructor: req.user.id, 
      isPublished: true 
    });
    const totalEnrollments = await Enrollment.countDocuments({
      course: { $in: await Course.find({ instructor: req.user.id }).select('_id') }
    });

    res.json({
      totalCourses,
      publishedCourses,
      totalEnrollments
    });
  } catch (error) {
    console.error('Get analytics error:', error);
    res.status(500).json({ message: 'Failed to fetch analytics', error: error.message });
  }
};

const getCourseAnalytics = async (req, res) => {
  try {
    const course = await Course.findOne({
      _id: req.params.id,
      instructor: req.user.id
    });

    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    const enrollments = await Enrollment.find({ course: req.params.id })
      .populate('student', 'name email');

    res.json({
      course: course.title,
      totalEnrollments: enrollments.length,
      enrollments
    });
  } catch (error) {
    console.error('Get course analytics error:', error);
    res.status(500).json({ message: 'Failed to fetch course analytics', error: error.message });
  }
};

const getCourseStudents = async (req, res) => {
  try {
    const course = await Course.findOne({
      _id: req.params.id,
      instructor: req.user.id
    });

    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    const enrollments = await Enrollment.find({ course: req.params.id })
      .populate('student', 'name email avatar')
      .sort({ enrolledAt: -1 });

    res.json({ enrollments });
  } catch (error) {
    console.error('Get course students error:', error);
    res.status(500).json({ message: 'Failed to fetch course students', error: error.message });
  }
};

module.exports = {
  getMyCourses,
  createCourse,
  getCourse,
  updateCourse,
  deleteCourse,
  publishCourse,
  getAnalytics,
  getCourseAnalytics,
  getCourseStudents
};
