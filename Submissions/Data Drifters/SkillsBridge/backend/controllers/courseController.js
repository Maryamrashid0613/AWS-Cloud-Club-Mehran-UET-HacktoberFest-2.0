const Course = require('../models/Course');
const Enrollment = require('../models/Enrollment');
const User = require('../models/User'); // To populate instructor details

const upload = require('../middleware/uploadMiddleware'); // Import the updated multer-cloudinary middleware

// @desc    Upload a lesson file (video/pdf) to Cloudinary
// @route   POST /api/courses/upload-lesson-file
// @access  Private/Instructor
const uploadLessonFile = (req, res) => {
  // 'lessonFile' is the field name from the frontend form
  upload.single('lessonFile')(req, res, function (err) {
    if (err instanceof multer.MulterError) {
      return res.status(400).json({ message: err.message });
    } else if (err) {
      return res.status(500).json({ message: err.message });
    }

    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    // File uploaded successfully to Cloudinary
    res.json({
      message: 'File uploaded successfully to Cloudinary',
      // The Cloudinary URL is in req.file.path
      fileUrl: req.file.path,
      publicId: req.file.filename, // This is the public_id used by Cloudinary
      originalName: req.file.originalname,
      mimetype: req.file.mimetype,
      size: req.file.size
    });
  });
};



// Helper to validate Lesson structure
const validateLesson = (lesson) => {
  if (!lesson.title || !lesson.type) return false;
  if (lesson.type === 'video' && !lesson.contentUrl) return false;
  if (lesson.type === 'pdf' && !lesson.contentUrl) return false;
  if (lesson.type === 'text' && !lesson.textContent) return false;
  return true;
};

// @desc    Get all courses (can be filtered/searched)
// @route   GET /api/courses
// @access  Public
const getCourses = async (req, res) => {
  try {
    const { category, difficulty, search } = req.query;
    let filter = { isApproved: true }; // Only show approved courses to public

    if (category) filter.category = category;
    if (difficulty) filter.difficulty = difficulty;
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }
console.log("filter",filter)
    const courses = await Course.find(filter)
      .populate('instructor', 'name email'); // Populate instructor name/email
    res.json(courses);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get a single course by ID
// @route   GET /api/courses/:id
// @access  Public
const getCourseById = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id)
      .populate('instructor', 'name email');

    if (course) {
        // Check if course is approved, unless the request is from the instructor or an admin
        if (!course.isApproved && req.user && req.user._id.toString() !== course.instructor._id.toString() && req.user.role !== 'admin') {
            return res.status(404).json({ message: 'Course not found or not approved' });
        }
      res.json(course);
    } else {
      res.status(404).json({ message: 'Course not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create a new course
// @route   POST /api/courses
// @access  Private/Instructor
const createCourse = async (req, res) => {
  const { title, description, category, duration, difficulty, syllabus } = req.body;

  // Validate syllabus
  if (syllabus && !syllabus.every(validateLesson)) {
    return res.status(400).json({ message: 'Invalid syllabus structure provided.' });
  }

  try {
    const course = new Course({
      instructor: req.user._id, // Instructor ID from auth middleware
      title,
      description,
      category,
      duration,
      difficulty,
      syllabus: syllabus || [], // Ensure syllabus is an array
      isApproved: false // New courses need admin approval
    });

    const createdCourse = await course.save();
    res.status(201).json(createdCourse);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update a course
// @route   PUT /api/courses/:id
// @access  Private/Instructor
const updateCourse = async (req, res) => {
  const { title, description, category, duration, difficulty, syllabus } = req.body;

  // Validate syllabus if provided
  if (syllabus && !syllabus.every(validateLesson)) {
    return res.status(400).json({ message: 'Invalid syllabus structure provided.' });
  }

  try {
    const course = await Course.findById(req.params.id);

    if (course) {
      // Check if logged-in user is the instructor of the course
      if (course.instructor.toString() !== req.user._id.toString()) {
        return res.status(403).json({ message: 'Not authorized to update this course' });
      }

      course.title = title || course.title;
      course.description = description || course.description;
      course.category = category || course.category;
      course.duration = duration || course.duration;
      course.difficulty = difficulty || course.difficulty;
      course.syllabus = syllabus || course.syllabus;
      course.isApproved = false; // Any update requires re-approval

      const updatedCourse = await course.save();
      res.json(updatedCourse);
    } else {
      res.status(404).json({ message: 'Course not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete a course
// @route   DELETE /api/courses/:id
// @access  Private/Instructor/Admin
const deleteCourse = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);

    if (course) {
      // Check if logged-in user is the instructor of the course or an admin
      if (course.instructor.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
        return res.status(403).json({ message: 'Not authorized to delete this course' });
      }

      await Course.deleteOne({ _id: req.params.id }); // Use deleteOne
      // Also delete related enrollments
      await Enrollment.deleteMany({ course: req.params.id });

      res.json({ message: 'Course removed' });
    } else {
      res.status(404).json({ message: 'Course not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Enroll a student in a course
// @route   POST /api/courses/:id/enroll
// @access  Private/Student
const enrollInCourse = async (req, res) => {
  try {
    const courseId = req.params.id;
    const studentId = req.user._id;

    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }
    if (!course.isApproved) {
        return res.status(403).json({ message: 'Cannot enroll in an unapproved course.' });
    }

    const existingEnrollment = await Enrollment.findOne({ student: studentId, course: courseId });
    if (existingEnrollment) {
      return res.status(400).json({ message: 'Already enrolled in this course' });
    }

    const enrollment = new Enrollment({
      student: studentId,
      course: courseId,
      progress: 0,
      isCompleted: false
    });

    const createdEnrollment = await enrollment.save();
    res.status(201).json(createdEnrollment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update student progress for a lesson/course
// @route   PUT /api/courses/:courseId/progress/:lessonId
// @access  Private/Student
const updateCourseProgress = async (req, res) => {
    const { courseId, lessonId } = req.params;
    const studentId = req.user._id;

    try {
        const enrollment = await Enrollment.findOne({ student: studentId, course: courseId });

        if (!enrollment) {
            return res.status(404).json({ message: 'Enrollment not found' });
        }

        const course = await Course.findById(courseId);
        if (!course) {
            return res.status(404).json({ message: 'Course not found' });
        }

        const lessonExists = course.syllabus.some(lesson => lesson._id.toString() === lessonId);
        if (!lessonExists) {
            return res.status(404).json({ message: 'Lesson not found in course' });
        }

        // Add lesson to completedLessons if not already present
        const isLessonCompleted = enrollment.completedLessons.some(item => item.lessonId.toString() === lessonId);
        if (!isLessonCompleted) {
            enrollment.completedLessons.push({ lessonId: lessonId });
        }

        // Calculate new progress percentage
        const totalLessons = course.syllabus.length;
        const completedCount = enrollment.completedLessons.length;
        enrollment.progress = totalLessons > 0 ? Math.round((completedCount / totalLessons) * 100) : 0;

        // Mark as completed if all lessons are done
        if (enrollment.progress === 100 && !enrollment.isCompleted) {
            enrollment.isCompleted = true;
            enrollment.completedAt = Date.now();
        }

        enrollment.lastActivity = Date.now();

        const updatedEnrollment = await enrollment.save();
        res.json(updatedEnrollment);

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Add a rating/review to a course
// @route   POST /api/courses/:id/reviews
// @access  Private/Student
const addCourseReview = async (req, res) => {
    const { rating, comment } = req.body; // Added 'comment' for future text reviews
    const studentId = req.user._id;

    try {
        const course = await Course.findById(req.params.id);

        if (course) {
            // Check if student is enrolled in the course and completed it (optional, but good practice)
            const enrollment = await Enrollment.findOne({ student: studentId, course: course._id, isCompleted: true });
            if (!enrollment) {
                return res.status(400).json({ message: 'You must complete the course to leave a review' });
            }

            const alreadyReviewed = course.ratings.find(
                (r) => r.user.toString() === studentId.toString()
            );

            if (alreadyReviewed) {
                // Update existing review
                alreadyReviewed.rating = rating;
                // Add comment update if you extend the model
            } else {
                // Add new review
                course.ratings.push({
                    user: studentId,
                    rating,
                    // comment // Add comment if you extend the model
                });
            }

            // Recalculate average rating
            course.updateAverageRating();

            await course.save();
            res.status(201).json({ message: 'Review added/updated' });
        } else {
            res.status(404).json({ message: 'Course not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


module.exports = {
  getCourses,
  getCourseById,
  createCourse,
  updateCourse,
  deleteCourse,
  enrollInCourse,
  updateCourseProgress,
  addCourseReview,
  uploadLessonFile,
};