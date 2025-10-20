const mongoose = require('mongoose');

const LessonSchema = new mongoose.Schema({
  title: { type: String, required: true },
  type: { type: String, enum: ['video', 'pdf', 'text'], required: true }, // e.g., 'video', 'pdf', 'text'
  contentUrl: { type: String }, // URL for video (YouTube/S3) or PDF
  textContent: { type: String }, // For text modules
  duration: { type: Number, default: 0 } // In minutes
});

const CourseSchema = new mongoose.Schema({
  instructor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    required: true,
    unique: true
    },
  description: {
    type: String,
    required: true
  },
  category: {
    type: String,
    enum: ['Programming', 'Design', 'Business', 'Marketing', 'Photography', 'Other'],
    default: 'Other'
  },
  difficulty: {
    type: String,
    enum: ['Beginner', 'Intermediate', 'Advanced'],
    default: 'Beginner'
  },
  duration: { // Total course duration
    type: Number, // In hours or minutes
    required: true
  },
  syllabus: [LessonSchema], // Array of lessons
  isApproved: { // Admin approval for courses
    type: Boolean,
    default: false
  },
  ratings: [{
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    rating: { type: Number, min: 1, max: 5 }
  }],
  averageRating: {
    type: Number,
    default: 0
  },
  numReviews: {
    type: Number,
    default: 0
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// // Calculate average rating before saving
// CourseSchema.methods.updateAverageRating = function() {
//   const totalRatings = this.ratings.length;
//   if (totalRatings > 0) {
//     const sumRatings = this.ratings.reduce((acc, item) => item.rating + acc, 0);
//     this.averageRating = sumRatings / totalRatings;
//   } else {
//     this.averageRating = 0;
//   }
//   this.numReviews = totalRatings;
// };

module.exports = mongoose.model('Course', CourseSchema);