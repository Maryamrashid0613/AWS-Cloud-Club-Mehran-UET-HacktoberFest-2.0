# SkillBridge Frontend

A modern, responsive frontend for the SkillBridge Learning Management System built with React, Vite, and Tailwind CSS.

## Features

- **Modern UI/UX**: Clean, responsive design with Tailwind CSS
- **Authentication**: Login/Register with JWT token management
- **Role-based Access**: Different dashboards for Students, Instructors, and Admins
- **Course Management**: Browse, enroll, and track course progress
- **Real-time Updates**: React Query for efficient data fetching
- **Form Handling**: React Hook Form with validation
- **Notifications**: Toast notifications for user feedback
- **Responsive Design**: Mobile-first approach with Tailwind CSS

## Tech Stack

- **Framework**: React 18
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **Routing**: React Router DOM
- **State Management**: React Context API
- **Data Fetching**: React Query (TanStack Query)
- **Forms**: React Hook Form
- **HTTP Client**: Axios
- **Icons**: Lucide React
- **Notifications**: React Hot Toast

## Getting Started

### Prerequisites

- Node.js (version 16 or higher)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd SkillBridge/frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   Create a `.env` file in the root directory:
   ```env
   VITE_API_URL=http://localhost:5000/api
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

   The application will be available at `http://localhost:3000`

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── Navbar.jsx      # Navigation bar
│   ├── Sidebar.jsx     # Sidebar navigation
│   ├── Loader.jsx      # Loading components
│   └── ProtectedRoute.jsx # Route protection
├── pages/              # Page components
│   ├── Home.jsx        # Landing page
│   ├── Login.jsx       # Login page
│   ├── Register.jsx    # Registration page
│   ├── Courses.jsx     # Course listing
│   ├── CourseDetail.jsx # Course details
│   ├── StudentDashboard.jsx # Student dashboard
│   ├── InstructorDashboard.jsx # Instructor dashboard
│   ├── AdminDashboard.jsx # Admin dashboard
│   └── NotFound.jsx    # 404 page
├── context/            # React Context providers
│   ├── AuthContext.jsx # Authentication state
│   └── CourseContext.jsx # Course state
├── hooks/              # Custom React hooks
│   └── useFetch.js     # Data fetching hook
├── services/           # API service functions
│   ├── api.js          # Axios configuration
│   ├── authService.js  # Authentication API calls
│   ├── courseService.js # Course-related API calls
│   └── uploadService.js # File upload API calls
├── App.jsx             # Main app component
├── main.jsx           # React entry point
└── index.css          # Global styles and Tailwind
```

## Key Features

### Authentication System
- JWT-based authentication
- Protected routes based on user roles
- Automatic token refresh
- Logout functionality

### User Roles
- **Student**: Browse courses, enroll, track progress
- **Instructor**: Create courses, manage students, view analytics
- **Admin**: Manage users, approve courses, view platform analytics

### Course Management
- Course browsing with filters
- Course enrollment
- Progress tracking
- Reviews and ratings
- Certificate generation

### Responsive Design
- Mobile-first approach
- Tailwind CSS for styling
- Consistent design system
- Accessible components

## API Integration

The frontend communicates with the backend API through service functions:

- `authService`: Authentication operations
- `courseService`: Course-related operations
- `uploadService`: File upload operations

All API calls include:
- Automatic token attachment
- Error handling
- Loading states
- Response caching (with React Query)

## Styling

The project uses Tailwind CSS with a custom configuration:

- **Primary Colors**: Blue palette for main branding
- **Secondary Colors**: Gray palette for neutral elements
- **Custom Components**: Reusable button, input, and card styles
- **Responsive Design**: Mobile-first breakpoints
- **Animations**: Smooth transitions and loading states

## State Management

The application uses React Context for global state management:

- **AuthContext**: User authentication state
- **CourseContext**: Course-related state

For server state, React Query is used for:
- Data fetching
- Caching
- Background updates
- Error handling

## Development Guidelines

### Code Style
- Use functional components with hooks
- Follow React best practices
- Use TypeScript-style prop validation
- Consistent naming conventions

### Component Structure
- Keep components small and focused
- Use custom hooks for logic reuse
- Implement proper error boundaries
- Follow accessibility guidelines

### API Integration
- Use service functions for API calls
- Implement proper error handling
- Show loading states
- Cache responses appropriately

## Deployment

### Build for Production
```bash
npm run build
```

### Deploy to Vercel
```bash
npx vercel
```

### Deploy to Netlify
```bash
npm run build
# Upload dist folder to Netlify
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.
