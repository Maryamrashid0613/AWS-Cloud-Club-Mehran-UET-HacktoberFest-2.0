import mongoose from 'mongoose';

// Defines the structure for a single lesson within a course
const lessonSchema = mongoose.Schema({
  title: { type: String, required: true },
  contentType: { type: String, enum: ['video', 'pdf', 'text'], required: true },
  content: { type: String, required: true }, // URL for video/pdf, or text content
});

// Defines the structure for a single review
const reviewSchema = mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' },
    name: { type: String, required: true },
    rating: { type: Number, required: true },
    comment: { type: String, required: true },
  },
  { timestamps: true }
);

// Defines the main structure for a course
const courseSchema = mongoose.Schema(
  {
    instructor: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' },
    title: { type: String, required: true },
    category: { type: String, required: true },
    level: { type: String, enum: ['Beginner', 'Intermediate', 'Advanced'], required: true },
    duration: { type: Number, required: true }, // Duration in hours
    description: { type: String, required: true },
    syllabus: [{ type: String }],
    lessons: [lessonSchema],
    reviews: [reviewSchema],
    rating: { type: Number, required: true, default: 0 },
    numReviews: { type: Number, required: true, default: 0 },
    isApproved: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const Course = mongoose.model('Course', courseSchema);

export default Course;