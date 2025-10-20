# SkillBridge - Learning Management System

A comprehensive Learning Management System (LMS) built with modern web technologies, designed to provide an intuitive platform for online education and skill development.

## 🚀 Features

### For Students
- **Course Discovery**: Browse and search through a vast library of courses
- **Enrollment System**: Easy course enrollment with progress tracking
- **Learning Dashboard**: Track progress, view certificates, and manage enrollments
- **Interactive Learning**: Video lessons with progress tracking
- **Certificates**: Earn certificates upon course completion
- **Reviews & Ratings**: Rate and review courses

### For Instructors
- **Course Creation**: Create and manage comprehensive courses
- **Content Management**: Upload videos, add descriptions, and organize lessons
- **Student Analytics**: Track student progress and engagement
- **Revenue Tracking**: Monitor course performance and earnings
- **Course Publishing**: Submit courses for admin approval

### For Administrators
- **User Management**: Manage students, instructors, and system users
- **Course Approval**: Review and approve instructor-submitted courses
- **Analytics Dashboard**: Comprehensive platform analytics and reporting
- **System Settings**: Configure platform-wide settings
- **Content Moderation**: Monitor and moderate platform content

## 🛠 Tech Stack

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT (JSON Web Tokens)
- **File Storage**: AWS S3
- **Security**: Helmet, CORS, Rate Limiting
- **Validation**: Express Validator

### Frontend
- **Framework**: React 18
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **Routing**: React Router DOM
- **State Management**: React Context API
- **Data Fetching**: React Query (TanStack Query)
- **Forms**: React Hook Form
- **HTTP Client**: Axios
- **Icons**: Lucide React

## 📁 Project Structure

```
SkillBridge/
├── backend/                    # Node.js + Express API
│   ├── src/
│   │   ├── config/            # Configuration files
│   │   ├── middleware/        # Custom middlewares
│   │   ├── models/           # Mongoose models
│   │   ├── routes/           # Express routes
│   │   ├── controllers/      # Route logic
│   │   ├── utils/            # Utility helpers
│   │   ├── app.js            # Express app setup
│   │   └── server.js         # Entry point
│   ├── package.json
│   └── README.md
│
├── frontend/                  # React + Tailwind Frontend
│   ├── src/
│   │   ├── components/       # Reusable UI components
│   │   ├── pages/           # Page components
│   │   ├── context/         # Global states
│   │   ├── hooks/           # Custom React hooks
│   │   ├── services/        # API calls
│   │   ├── App.jsx          # Main component
│   │   └── main.jsx         # ReactDOM render file
│   ├── package.json
│   └── README.md
│
├── .gitignore
└── README.md
```

## 🚀 Getting Started

### Prerequisites
- Node.js (version 16 or higher)
- MongoDB (local or cloud instance)
- AWS S3 bucket (for file storage)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd SkillBridge
   ```

2. **Set up the Backend**
   ```bash
   cd backend
   npm install
   
   # Create .env file with your configuration
   cp .env.example .env
   # Edit .env with your database and AWS credentials
   
   # Start the backend server
   npm run dev
   ```

3. **Set up the Frontend**
   ```bash
   cd ../frontend
   npm install
   
   # Create .env file
   echo "VITE_API_URL=http://localhost:5000/api" > .env
   
   # Start the frontend development server
   npm run dev
   ```

4. **Access the Application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000

### Environment Variables

#### Backend (.env)
```env
# Database
DB_URI=mongodb://localhost:27017/skillbridge

# JWT
JWT_SECRET=your_super_secret_jwt_key
JWT_EXPIRES_IN=7d

# AWS S3
AWS_ACCESS_KEY_ID=your_aws_access_key_id
AWS_SECRET_ACCESS_KEY=your_aws_secret_access_key
AWS_REGION=us-east-1
AWS_S3_BUCKET=skillbridge-uploads

# Server
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
```

#### Frontend (.env)
```env
VITE_API_URL=http://localhost:5000/api
```

## 🔧 Development

### Backend Development
```bash
cd backend
npm run dev    # Start with nodemon
npm start      # Start production server
npm test       # Run tests
```

### Frontend Development
```bash
cd frontend
npm run dev    # Start development server
npm run build  # Build for production
npm run preview # Preview production build
npm run lint   # Run ESLint
```

## 📚 API Documentation

### Authentication Endpoints
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user profile
- `PUT /api/auth/profile` - Update user profile

### Course Endpoints
- `GET /api/courses` - Get all courses
- `GET /api/courses/:id` - Get course by ID
- `POST /api/courses` - Create course (Instructor)
- `PUT /api/courses/:id` - Update course (Instructor)
- `DELETE /api/courses/:id` - Delete course (Instructor)

### Student Endpoints
- `GET /api/student/courses` - Get available courses
- `POST /api/student/courses/:id/enroll` - Enroll in course
- `GET /api/student/enrollments` - Get my enrollments
- `PUT /api/student/enrollments/:id/progress` - Update progress

### Admin Endpoints
- `GET /api/admin/users` - Get all users
- `PUT /api/admin/users/:id/role` - Update user role
- `GET /api/admin/courses/pending` - Get pending courses
- `PUT /api/admin/courses/:id/approve` - Approve course

## 🔐 Security Features

- JWT-based authentication
- Role-based access control
- Password hashing with bcrypt
- Input validation and sanitization
- Rate limiting
- CORS protection
- Security headers with Helmet

## 🎨 UI/UX Features

- Responsive design (mobile-first)
- Dark/light theme support
- Intuitive navigation
- Real-time notifications
- Loading states and error handling
- Accessibility compliance
- Modern, clean interface

## 🚀 Deployment

### Backend Deployment
1. Set up MongoDB Atlas or local MongoDB
2. Configure AWS S3 bucket
3. Set environment variables
4. Deploy to platforms like Heroku, Railway, or AWS

### Frontend Deployment
1. Build the application: `npm run build`
2. Deploy to platforms like Vercel, Netlify, or AWS S3

### Docker Deployment
```bash
# Build and run with Docker Compose
docker-compose up -d
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Express.js community for the excellent framework
- React team for the amazing library
- Tailwind CSS for the utility-first CSS framework
- MongoDB for the flexible database solution
- AWS for cloud services

## 📞 Support

If you have any questions or need help, please:
- Open an issue on GitHub
- Check the documentation
- Contact the development team

---

**SkillBridge** - Empowering education through technology 🎓
