// Dummy data for SkillBridge LMS
export const users = [
  {
    id: 1,
    name: "John Doe",
    email: "john@student.com",
    role: "student",
    password: "password123",
    avatar: "https://i.pravatar.cc/150?img=1",
    joinedDate: "2024-01-15",
  },
  {
    id: 2,
    name: "Sarah Wilson",
    email: "sarah@instructor.com",
    role: "instructor",
    password: "password123",
    avatar: "https://i.pravatar.cc/150?img=5",
    joinedDate: "2023-08-10",
    approved: true,
    bio: "Full-stack developer with 5+ years experience",
  },
  {
    id: 3,
    name: "Admin User",
    email: "admin@skillbridge.com",
    role: "admin",
    password: "admin123",
    avatar: "https://i.pravatar.cc/150?img=3",
    joinedDate: "2023-01-01",
  },
  {
    id: 4,
    name: "Mike Johnson",
    email: "mike@instructor.com",
    role: "instructor",
    password: "password123",
    avatar: "https://i.pravatar.cc/150?img=7",
    joinedDate: "2024-02-20",
    approved: false,
    bio: "UI/UX Designer with passion for teaching",
  },
  {
    id: 5,
    name: "Emily Chen",
    email: "emily@student.com",
    role: "student",
    password: "password123",
    avatar: "https://i.pravatar.cc/150?img=9",
    joinedDate: "2024-03-05",
  },
];

export const courses = [
  {
    id: 1,
    title: "React Fundamentals",
    description: "Learn the basics of React from scratch",
    instructorId: 2,
    instructorName: "Sarah Wilson",
    category: "Programming",
    duration: "8 weeks",
    difficultyLevel: "Beginner",
    syllabus: [
      "Introduction to React",
      "Components and JSX",
      "State and Props",
      "Event Handling",
      "Forms and Validation",
      "React Hooks",
      "Context API",
      "Building a Complete App",
    ],
    price: 99,
    thumbnail:
      "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=400&h=225&fit=crop&auto=format",
    approved: true,
    createdDate: "2024-01-20",
    totalLessons: 24,
    totalEnrollments: 156,
    averageRating: 4.8,
    lessons: [
      {
        id: 1,
        title: "What is React?",
        type: "video",
        content: "https://www.youtube.com/embed/Tn6-PIqc4UM",
        duration: "15 min",
        description: "Introduction to React and its ecosystem",
      },
      {
        id: 2,
        title: "Setting up Development Environment",
        type: "video",
        content: "https://www.youtube.com/embed/SqcY0GlETPk",
        duration: "20 min",
        description:
          "Installing Node.js, npm, and creating your first React app",
      },
      {
        id: 3,
        title: "Course Materials",
        type: "pdf",
        content: "React fundamentals guide and best practices",
        description: "Downloadable PDF with course materials and references",
      },
    ],
  },
  {
    id: 2,
    title: "Advanced JavaScript",
    description: "Master advanced JavaScript concepts and patterns",
    instructorId: 2,
    instructorName: "Sarah Wilson",
    category: "Programming",
    duration: "6 weeks",
    difficultyLevel: "Advanced",
    syllabus: [
      "Closures and Scope",
      "Async/Await and Promises",
      "Design Patterns",
      "ES6+ Features",
      "Performance Optimization",
      "Testing Strategies",
    ],
    price: 149,
    thumbnail:
      "https://images.unsplash.com/photo-1627398242454-45a1465c2479?w=400&h=225&fit=crop&auto=format",
    approved: true,
    createdDate: "2024-02-15",
    totalLessons: 18,
    totalEnrollments: 89,
    averageRating: 4.9,
    lessons: [
      {
        id: 1,
        title: "Understanding Closures",
        type: "video",
        content: "https://www.youtube.com/embed/3PHXvlpOkf4",
        duration: "25 min",
        description:
          "Deep dive into JavaScript closures and practical examples",
      },
      {
        id: 2,
        title: "Async Programming",
        type: "video",
        content: "https://www.youtube.com/embed/PoRJizFvM7s",
        duration: "30 min",
        description:
          "Mastering promises, async/await, and handling asynchronous operations",
      },
    ],
  },
  {
    id: 3,
    title: "UI/UX Design Principles",
    description:
      "Learn the fundamentals of user interface and user experience design",
    instructorId: 4,
    instructorName: "Mike Johnson",
    category: "Design",
    duration: "5 weeks",
    difficultyLevel: "Beginner",
    syllabus: [
      "Design Thinking Process",
      "User Research Methods",
      "Wireframing and Prototyping",
      "Visual Design Principles",
      "Usability Testing",
    ],
    price: 79,
    thumbnail:
      "https://images.unsplash.com/photo-1586717791821-3f44a563fa4c?w=400&h=225&fit=crop&auto=format",
    approved: false,
    createdDate: "2024-03-10",
    totalLessons: 15,
    totalEnrollments: 0,
    averageRating: 0,
    lessons: [
      {
        id: 1,
        title: "Introduction to Design Thinking",
        type: "video",
        content: "https://www.youtube.com/embed/_r0VX-aU_T8",
        duration: "20 min",
        description: "Understanding the design thinking methodology",
      },
    ],
  },
  {
    id: 4,
    title: "Digital Marketing Basics",
    description:
      "Learn the essentials of digital marketing and online promotion",
    instructorId: 2,
    instructorName: "Sarah Wilson",
    category: "Business",
    duration: "4 weeks",
    difficultyLevel: "Beginner",
    syllabus: [
      "Introduction to Digital Marketing",
      "Social Media Marketing",
      "Email Marketing",
      "SEO Fundamentals",
      "Analytics and Measurement",
    ],
    price: 69,
    thumbnail:
      "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=225&fit=crop&auto=format",
    approved: true,
    createdDate: "2024-01-30",
    totalLessons: 12,
    totalEnrollments: 203,
    averageRating: 4.6,
    lessons: [
      {
        id: 1,
        title: "What is Digital Marketing?",
        type: "video",
        content: "https://www.youtube.com/embed/bixR-KIJKYM",
        duration: "18 min",
        description:
          "Overview of digital marketing landscape and opportunities",
      },
    ],
  },
];

export const enrollments = [
  {
    id: 1,
    studentId: 1,
    courseId: 1,
    enrolledDate: "2024-02-01",
    progress: 75,
    completedLessons: [1, 2],
    lastActivity: "2024-10-15",
    completed: false,
  },
  {
    id: 2,
    studentId: 1,
    courseId: 4,
    enrolledDate: "2024-02-10",
    progress: 100,
    completedLessons: [1],
    lastActivity: "2024-10-10",
    completed: true,
    completedDate: "2024-03-15",
    rating: 5,
    review: "Excellent course! Very practical and easy to follow.",
  },
  {
    id: 3,
    studentId: 5,
    courseId: 1,
    enrolledDate: "2024-03-01",
    progress: 45,
    completedLessons: [1],
    lastActivity: "2024-10-12",
    completed: false,
  },
  {
    id: 4,
    studentId: 5,
    courseId: 2,
    enrolledDate: "2024-03-05",
    progress: 30,
    completedLessons: [],
    lastActivity: "2024-10-08",
    completed: false,
  },
];

export const reviews = [
  {
    id: 1,
    courseId: 1,
    studentId: 1,
    studentName: "John Doe",
    rating: 5,
    review:
      "Amazing course! The instructor explains everything clearly and the hands-on projects are very helpful.",
    date: "2024-10-01",
  },
  {
    id: 2,
    courseId: 1,
    studentId: 5,
    studentName: "Emily Chen",
    rating: 4,
    review: "Good course content, but could use more advanced examples.",
    date: "2024-09-28",
  },
  {
    id: 3,
    courseId: 4,
    studentId: 1,
    studentName: "John Doe",
    rating: 5,
    review: "Excellent course! Very practical and easy to follow.",
    date: "2024-03-16",
  },
  {
    id: 4,
    courseId: 2,
    studentId: 5,
    studentName: "Emily Chen",
    rating: 5,
    review:
      "Challenging but rewarding. Perfect for advancing JavaScript skills.",
    date: "2024-10-05",
  },
];

export const categories = [
  "Programming",
  "Design",
  "Business",
  "Marketing",
  "Data Science",
  "Photography",
];

export const difficultyLevels = ["Beginner", "Intermediate", "Advanced"];

// Helper functions
export const getCoursesByInstructor = (instructorId) => {
  return courses.filter((course) => course.instructorId === instructorId);
};

export const getEnrollmentsByStudent = (studentId) => {
  return enrollments.filter((enrollment) => enrollment.studentId === studentId);
};

export const getCourseReviews = (courseId) => {
  return reviews.filter((review) => review.courseId === courseId);
};

export const getApprovedCourses = () => {
  return courses.filter((course) => course.approved);
};

export const getPendingCourses = () => {
  return courses.filter((course) => !course.approved);
};

export const getPendingInstructors = () => {
  return users.filter((user) => user.role === "instructor" && !user.approved);
};

export const getAnalytics = () => {
  const activeUsers = users.filter((user) => user.role !== "admin").length;
  const totalEnrollments = enrollments.length;
  const totalCourses = courses.filter((course) => course.approved).length;
  const totalRevenue = enrollments.reduce((sum, enrollment) => {
    const course = courses.find((c) => c.id === enrollment.courseId);
    return sum + (course ? course.price : 0);
  }, 0);

  return {
    activeUsers,
    totalEnrollments,
    totalCourses,
    totalRevenue,
    averageRating: 4.7,
    completionRate: Math.round(
      (enrollments.filter((e) => e.completed).length / enrollments.length) * 100
    ),
  };
};
