const axios = require('axios');

const testRegistration = async () => {
  try {
    console.log('🧪 Testing registration...');
    
    const testUser = {
      name: 'Test User',
      email: 'test@example.com',
      password: 'testpassword123456', // 12+ characters
      role: 'student'
    };

    const response = await axios.post('http://localhost:5000/api/auth/register', testUser);
    
    console.log('✅ Registration successful!');
    console.log('Response:', response.data);
    
  } catch (error) {
    console.log('❌ Registration failed!');
    console.log('Error:', error.response?.data || error.message);
  }
};

// Wait a bit for server to start, then test
setTimeout(testRegistration, 3000);
