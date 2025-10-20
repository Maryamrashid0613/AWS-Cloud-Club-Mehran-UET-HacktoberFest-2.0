import Course from "../models/courseModel.js"; // we'll create this model later
import asyncHandler from "express-async-handler";

// @desc    Get all approved courses
// @route   GET /api/courses
// @access  Public
const getCourses = asyncHandler(async (req, res) => {
  const courses = await Course.find({ isApproved: true });
  res.json(courses);
});

// @desc    Get course by ID
// @route   GET /api/courses/:id
// @access  Public
const getCourseById = asyncHandler(async (req, res) => {
  const course = await Course.findById(req.params.id);

  if (course) {
    res.json(course);
  } else {
    res.status(404);
    throw new Error("Course not found");
  }
});

// @desc    Create new course (unapproved by default)
// @route   POST /api/courses
// @access  Private (Instructor)
const createCourse = asyncHandler(async (req, res) => {
  const { title, description, category, price } = req.body;

  const course = new Course({
    title,
    description,
    category,
    price,
    instructor: req.user._id, // logged-in instructor
    isApproved: false,
  });

  const createdCourse = await course.save();
  res.status(201).json(createdCourse);
});

// @desc    Update a course
// @route   PUT /api/courses/:id
// @access  Private (Instructor/Admin)
const updateCourse = asyncHandler(async (req, res) => {
  const { title, description, category, price } = req.body;

  const course = await Course.findById(req.params.id);

  if (course) {
    course.title = title || course.title;
    course.description = description || course.description;
    course.category = category || course.category;
    course.price = price || course.price;

    const updatedCourse = await course.save();
    res.json(updatedCourse);
  } else {
    res.status(404);
    throw new Error("Course not found");
  }
});

// @desc    Delete a course
// @route   DELETE /api/courses/:id
// @access  Private (Instructor/Admin)
const deleteCourse = asyncHandler(async (req, res) => {
  const course = await Course.findById(req.params.id);

  if (course) {
    await course.remove();
    res.json({ message: "Course removed" });
  } else {
    res.status(404);
    throw new Error("Course not found");
  }
});

// @desc    Enroll in a course
// @route   POST /api/courses/:id/enroll
// @access  Private (Student)
const enrollCourse = asyncHandler(async (req, res) => {
  const course = await Course.findById(req.params.id);

  if (!course) {
    res.status(404);
    throw new Error("Course not found");
  }

  // Avoid duplicate enrollments
  if (course.enrolledStudents.includes(req.user._id)) {
    res.status(400);
    throw new Error("Already enrolled");
  }

  course.enrolledStudents.push(req.user._id);
  await course.save();
  res.json({ message: "Enrolled successfully" });
});

// @desc    Add a review to a course
// @route   POST /api/courses/:id/review
// @access  Private (Student)
const addCourseReview = asyncHandler(async (req, res) => {
  const { rating, comment } = req.body;

  const course = await Course.findById(req.params.id);

  if (!course) {
    res.status(404);
    throw new Error("Course not found");
  }

  const review = {
    name: req.user.name,
    rating: Number(rating),
    comment,
    user: req.user._id,
  };

  course.reviews.push(review);
  course.numReviews = course.reviews.length;
  course.rating =
    course.reviews.reduce((acc, item) => item.rating + acc, 0) /
    course.reviews.length;

  await course.save();
  res.status(201).json({ message: "Review added" });
});

export {
  getCourses,
  getCourseById,
  createCourse,
  updateCourse,
  deleteCourse,
  enrollCourse,
  addCourseReview,
};
