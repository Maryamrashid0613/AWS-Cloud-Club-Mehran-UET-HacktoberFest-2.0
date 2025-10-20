const mongoose = require('mongoose');
const User = require('./src/models/User');
require('dotenv').config();

const createAdmin = async () => {
  try {
    // Connect to database
    await mongoose.connect(process.env.DB_URI);
    console.log('Connected to database');

    // Find user by email
    const email = 'admin@skillbridge.com'; // Change this to your admin email
    const user = await User.findOne({ email });

    if (!user) {
      console.log('❌ User not found. Please register first with email:', email);
      console.log('Go to http://localhost:3000/register and create an account');
      return;
    }

    // Update user role to admin
    user.role = 'admin';
    await user.save();

    console.log('✅ User role updated to admin successfully!');
    console.log('Admin Details:');
    console.log('- Name:', user.name);
    console.log('- Email:', user.email);
    console.log('- Role:', user.role);
    console.log('- ID:', user._id);

  } catch (error) {
    console.error('Error creating admin:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from database');
  }
};

createAdmin();
