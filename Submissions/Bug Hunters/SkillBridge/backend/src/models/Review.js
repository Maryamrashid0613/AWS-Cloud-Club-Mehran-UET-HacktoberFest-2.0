const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Student is required']
  },
  course: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course',
    required: [true, 'Course is required']
  },
  rating: {
    type: Number,
    required: [true, 'Rating is required'],
    min: [1, 'Rating must be at least 1'],
    max: [5, 'Rating cannot be more than 5']
  },
  comment: {
    type: String,
    required: [true, 'Comment is required'],
    trim: true,
    maxlength: [500, 'Comment cannot be more than 500 characters']
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  helpfulVotes: {
    type: Number,
    default: 0
  },
  notHelpfulVotes: {
    type: Number,
    default: 0
  },
  votedBy: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    vote: {
      type: String,
      enum: ['helpful', 'notHelpful']
    }
  }]
}, {
  timestamps: true
});

// Ensure one review per student per course
reviewSchema.index({ student: 1, course: 1 }, { unique: true });

// Update course rating when review is saved
reviewSchema.post('save', async function() {
  try {
    const Course = mongoose.model('Course');
    const course = await Course.findById(this.course);
    
    if (course) {
      const reviews = await mongoose.model('Review').find({ course: this.course });
      const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
      
      course.rating = {
        average: Math.round((totalRating / reviews.length) * 10) / 10,
        count: reviews.length
      };
      
      await course.save();
    }
  } catch (error) {
    console.error('Error updating course rating:', error);
  }
});

// Update course rating when review is deleted
reviewSchema.post('remove', async function() {
  try {
    const Course = mongoose.model('Course');
    const course = await Course.findById(this.course);
    
    if (course) {
      const reviews = await mongoose.model('Review').find({ course: this.course });
      
      if (reviews.length === 0) {
        course.rating = { average: 0, count: 0 };
      } else {
        const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
        course.rating = {
          average: Math.round((totalRating / reviews.length) * 10) / 10,
          count: reviews.length
        };
      }
      
      await course.save();
    }
  } catch (error) {
    console.error('Error updating course rating:', error);
  }
});

module.exports = mongoose.model('Review', reviewSchema);
