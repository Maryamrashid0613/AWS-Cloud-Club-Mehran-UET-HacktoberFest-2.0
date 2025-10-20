const fs = require('fs');
const path = require('path');

const envContent = `# Database Configuration
DB_URI=mongodb://localhost:27017/mongodb+srv://majidalitangri7_db_user:e-cmmerce@cluster0.4ikieel.mongodb.net/ecommerce?retryWrites=true&w=majority&appName=Cluster0

# JWT Configuration
JWT_SECRET=your_super_secret_jwt_key_here_change_this_in_production_123456789
JWT_EXPIRES_IN=7d

# Access Keys for Registration
INSTRUCTOR_ACCESS_KEY=INSTRUCTOR_KEY_2024
ADMIN_ACCESS_KEY=ADMIN_KEY_2024

# AWS S3 Configuration
AWS_ACCESS_KEY_ID=AKIAQVTYSZDSQNKBD64W
AWS_SECRET_ACCESS_KEY=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
AWS_REGION=us-east-1
AWS_S3_BUCKET=skillbridge-uploadsgit 

# Server Configuration
PORT=5000
NODE_ENV=development

# CORS Configuration
FRONTEND_URL=http://localhost:3000`;

const envPath = path.join(__dirname, '.env');

if (!fs.existsSync(envPath)) {
  fs.writeFileSync(envPath, envContent);
  console.log('✅ .env file created successfully!');
  console.log('📝 Please update the AWS credentials in the .env file');
} else {
  console.log('⚠️  .env file already exists');
}
