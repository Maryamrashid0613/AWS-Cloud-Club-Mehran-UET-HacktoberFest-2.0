const mongoose = require('mongoose');
const User = require('./src/models/User');
require('dotenv').config();

const createAdminDirect = async () => {
  try {
    // Connect to database
    await mongoose.connect(process.env.DB_URI);
    console.log('Connected to database');

    // Check if admin already exists
    const existingAdmin = await User.findOne({ email: 'admin@skillbridge.com' });
    if (existingAdmin) {
      console.log('✅ Admin user already exists!');
      console.log('Admin Details:');
      console.log('- Name:', existingAdmin.name);
      console.log('- Email:', existingAdmin.email);
      console.log('- Role:', existingAdmin.role);
      return;
    }

    // Create admin user
    const adminUser = new User({
      name: 'System Administrator',
      email: 'admin@skillbridge.com',
      password: 'adminpassword123456', // Change this to a secure password
      role: 'admin',
      isVerified: true
    });

    await adminUser.save();

    console.log('✅ Admin user created successfully!');
    console.log('Admin Login Credentials:');
    console.log('- Email: admin@skillbridge.com');
    console.log('- Password: adminpassword123456');
    console.log('- Role: admin');
    console.log('');
    console.log('⚠️  IMPORTANT: Change the password after first login!');

  } catch (error) {
    console.error('Error creating admin:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from database');
  }
};

createAdminDirect();
