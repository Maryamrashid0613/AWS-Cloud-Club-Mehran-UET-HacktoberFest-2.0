const User = require('../models/User');
const Enrollment = require('../models/Enrollment');
const Course = require('../models/Course');

// @desc    Get current user's enrollments (Student dashboard)
// @route   GET /api/users/me/enrollments
// @access  Private/Student
const getMyEnrollments = async (req, res) => {
  try {
    if (req.user.role !== 'student') {
        return res.status(403).json({ message: 'Only students can view enrollments' });
    }
    const enrollments = await Enrollment.find({ student: req.user._id })
      .populate('course', 'title description instructor category difficulty averageRating numReviews'); // Populate course details

    res.json(enrollments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get courses created by the current instructor (Instructor dashboard)
// @route   GET /api/users/me/courses
// @access  Private/Instructor
const getMyCoursesAsInstructor = async (req, res) => {
  try {
    if (req.user.role !== 'instructor') {
      return res.status(403).json({ message: 'Only instructors can view their courses' });
    }

    const courses = await Course.find({ instructor: req.user._id });
    res.json(courses);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get detailed enrollment for a specific course (student view)
// @route   GET /api/users/me/enrollments/:courseId
// @access  Private/Student
const getDetailedEnrollment = async (req, res) => {
    try {
        if (req.user.role !== 'student') {
            return res.status(403).json({ message: 'Only students can view detailed enrollments' });
        }

        const { courseId } = req.params;
        const enrollment = await Enrollment.findOne({ student: req.user._id, course: courseId })
            .populate('course')
            .populate({
                path: 'course',
                populate: { path: 'instructor', select: 'name email' } // Populate instructor inside course
            });

        if (!enrollment) {
            return res.status(404).json({ message: 'Enrollment not found for this course' });
        }
        res.json(enrollment);

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Generate a completion certificate (BONUS)
// @route   GET /api/users/me/enrollments/:enrollmentId/certificate
// @access  Private/Student
const generateCertificate = async (req, res) => {
    try {
        if (req.user.role !== 'student') {
            return res.status(403).json({ message: 'Only students can generate certificates' });
        }

        const { enrollmentId } = req.params;
        const enrollment = await Enrollment.findOne({ _id: enrollmentId, student: req.user._id })
            .populate('course', 'title')
            .populate('student', 'name');

        if (!enrollment) {
            return res.status(404).json({ message: 'Enrollment not found' });
        }

        if (!enrollment.isCompleted) {
            return res.status(400).json({ message: 'Course not yet completed' });
        }

        // --- IMAGE GENERATION FOR CERTIFICATE ---
        // Instead of generating a PDF directly in the backend,
        // we can trigger the image generation model here to create a certificate image.
        // The frontend would then display this image or allow download.
        // For the hackathon, this is a cool way to visualize it.

        const certificateData = {
            studentName: enrollment.student.name,
            courseTitle: enrollment.course.title,
            completionDate: enrollment.completedAt.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
        };

        // This is where you'd trigger the image model.
        // In a real application, you'd send this data to a service
        // that generates the image and returns a URL.
        // For this demo, let's just describe what it would generate.

        const prompt = `A professional looking certificate of completion for an online course.
                        It should feature a modern design, a seal, and elegant typography.
                        Include the text: "Certificate of Completion",
                        "This certifies that ${certificateData.studentName} has successfully completed the course",
                        "Course: ${certificateData.courseTitle}",
                        "Date: ${certificateData.completionDate}".`;

        // Output the tag, the actual image generation will happen via the AI model
        // that replaces this tag with an image based on the context.
        res.status(200).json({
            message: 'Certificate data ready. Frontend can trigger image generation.',
            certificatePrompt: prompt,
            certificate: `
            <div style="font-family: 'Times New Roman', serif; border: 10px double #333; padding: 50px; text-align: center; max-width: 800px; margin: 50px auto; background-color: #f9f9f9;">
                <h1 style="color: #004085; font-size: 3em; margin-bottom: 20px;">CERTIFICATE OF COMPLETION</h1>
                <p style="font-size: 1.2em; color: #555;">This certifies that</p>
                <h2 style="color: #007bff; font-size: 2.5em; margin: 15px 0;">${certificateData.studentName}</h2>
                <p style="font-size: 1.2em; color: #555;">has successfully completed the online course</p>
                <h3 style="color: #28a745; font-size: 2em; margin: 15px 0;">${certificateData.courseTitle}</h3>
                <p style="font-size: 1.2em; color: #555;">on this day</p>
                <p style="font-size: 1.5em; color: #6c757d; margin-top: 10px;">${certificateData.completionDate}</p>
                <div style="margin-top: 40px;">
                    <span style="border-top: 1px solid #aaa; padding-top: 5px; margin-right: 50px;">Instructor Signature</span>
                    <span style="border-top: 1px solid #aaa; padding-top: 5px;">Platform Admin Signature</span>
                </div>
            </div>
            `
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
  getMyEnrollments,
  getMyCoursesAsInstructor,
  getDetailedEnrollment,
  generateCertificate,
};