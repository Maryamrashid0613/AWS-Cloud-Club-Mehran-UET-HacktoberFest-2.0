# SkillBridge Backend API

A comprehensive Learning Management System (LMS) backend built with Node.js, Express, and MongoDB.

## Features

- **User Authentication & Authorization**
  - JWT-based authentication
  - Role-based access control (Student, Instructor, Admin)
  - Password hashing with bcrypt

- **Course Management**
  - Create, read, update, delete courses
  - Course approval workflow
  - Video lesson management
  - Course categorization and filtering

- **Enrollment System**
  - Course enrollment tracking
  - Progress monitoring
  - Completion certificates

- **Review & Rating System**
  - Course reviews and ratings
  - Verified enrollment reviews

- **File Upload**
  - AWS S3 integration for media files
  - Image and video upload support

- **Analytics & Reporting**
  - Course analytics for instructors
  - Admin dashboard with comprehensive metrics

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JSON Web Tokens (JWT)
- **File Storage**: AWS S3
- **Security**: Helmet, CORS, Rate Limiting
- **Validation**: Express Validator

## Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd SkillBridge/backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   - Copy `.env.example` to `.env`
   - Configure the following variables:
     ```
     DB_URI=mongodb://localhost:27017/skillbridge
     JWT_SECRET=your_super_secret_jwt_key_here
     AWS_ACCESS_KEY_ID=your_aws_access_key_id
     AWS_SECRET_ACCESS_KEY=your_aws_secret_access_key
     AWS_REGION=us-east-1
     AWS_S3_BUCKET=skillbridge-uploads
     PORT=5000
     FRONTEND_URL=http://localhost:3000
     ```

4. **Start the server**
   ```bash
   # Development mode
   npm run dev
   
   # Production mode
   npm start
   ```

## API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user profile
- `PUT /api/auth/profile` - Update user profile
- `POST /api/auth/logout` - User logout

### Student Routes
- `GET /api/student/courses` - Get available courses
- `POST /api/student/courses/:id/enroll` - Enroll in course
- `GET /api/student/enrollments` - Get my enrollments
- `PUT /api/student/enrollments/:id/progress` - Update progress
- `POST /api/student/courses/:id/review` - Add course review

### Instructor Routes
- `GET /api/instructor/courses` - Get my courses
- `POST /api/instructor/courses` - Create course
- `PUT /api/instructor/courses/:id` - Update course
- `DELETE /api/instructor/courses/:id` - Delete course
- `POST /api/instructor/courses/:id/publish` - Publish course

### Admin Routes
- `GET /api/admin/users` - Get all users
- `PUT /api/admin/users/:id/role` - Update user role
- `GET /api/admin/courses/pending` - Get pending courses
- `PUT /api/admin/courses/:id/approve` - Approve course
- `GET /api/admin/analytics` - Get system analytics

### Upload Routes
- `POST /api/upload/single` - Upload single file
- `POST /api/upload/multiple` - Upload multiple files

## Database Models

### User
- Personal information (name, email, password)
- Role-based permissions
- Enrolled courses and created courses
- Profile settings

### Course
- Course details (title, description, category)
- Instructor assignment
- Lesson structure with videos
- Enrollment tracking and ratings

### Enrollment
- Student-course relationship
- Progress tracking
- Completion status
- Certificate generation

### Review
- Course ratings and comments
- Verified enrollment reviews
- Helpful voting system

## Security Features

- **Authentication**: JWT tokens with expiration
- **Authorization**: Role-based access control
- **Input Validation**: Express validator middleware
- **Rate Limiting**: Prevent API abuse
- **CORS**: Cross-origin resource sharing
- **Helmet**: Security headers
- **Password Hashing**: bcrypt with salt rounds

## Development

### Scripts
- `npm start` - Start production server
- `npm run dev` - Start development server with nodemon
- `npm test` - Run tests

### Code Structure
```
src/
├── config/          # Database and AWS configuration
├── middleware/      # Custom middleware functions
├── models/          # Mongoose data models
├── routes/          # Express route definitions
├── controllers/     # Route handler logic
├── utils/           # Utility functions
├── app.js           # Express app configuration
└── server.js        # Server entry point
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

This project is licensed under the MIT License.
