const fs = require('fs');
const path = require('path');

const envContent = `VITE_API_URL=http://localhost:5000/api`;

const envPath = path.join(__dirname, '.env');

if (!fs.existsSync(envPath)) {
  fs.writeFileSync(envPath, envContent);
  console.log('✅ Frontend .env file created successfully!');
} else {
  console.log('⚠️  Frontend .env file already exists');
}
