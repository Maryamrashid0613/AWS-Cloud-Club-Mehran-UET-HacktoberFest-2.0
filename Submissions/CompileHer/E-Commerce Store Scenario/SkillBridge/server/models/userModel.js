import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ['student', 'instructor', 'admin'],
      default: 'student',
    },
    isApproved: {
      type: Boolean,
      default: false, // This is specifically for instructors awaiting admin approval
    },
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt fields
  }
);

// This function runs BEFORE a user document is saved to the database
userSchema.pre('save', async function (next) {
  // Only hash the password if it has been modified (or is new)
  if (!this.isModified('password')) {
    next();
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Add a method to the schema to compare entered password with the hashed password
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Create the model from the schema
const User = mongoose.model('User', userSchema);

// **This is the most important line for fixing your error**
export default User;