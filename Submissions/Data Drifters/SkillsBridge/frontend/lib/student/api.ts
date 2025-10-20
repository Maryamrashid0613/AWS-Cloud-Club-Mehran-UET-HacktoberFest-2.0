// services/api.ts
import axios from 'axios';
import { toast } from 'sonner';
import { useRouter } from "next/navigation"

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000/api';

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add a request interceptor to include the auth token
api.interceptors.request.use(
    (config) => {
        // Dynamically get the token based on the user's role or current context
        // For simplicity, let's assume we store the token as 'userToken' or similar after login
        // Or you can have separate 'studentToken', 'instructorToken', etc.
        const token = localStorage.getItem('token') || localStorage.getItem('token'); // Adapt as needed
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Add a response interceptor for error handling and toasts
api.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
          const router = useRouter()

        const status = error.response?.status;
        const message =
            error.response?.data?.message ||
            error.message ||
            'An unexpected error occurred.';
        console.log("status", status)
        // Handle 401 Unauthorized globally
        if (status == 401) {
            console.log("status if condtion")

            toast.error('Session expired. Please log in again.');

            // Clear local token if any
            localStorage.removeItem('token');

            // Avoid infinite redirects if already on login page
            if (typeof window !== 'undefined' && !window.location.pathname.includes('/login')) {
                router.push('/login'); // Client-side redirect
            }
        } else {
            // Show toast for all other errors
            toast.error(message);
        }

        return Promise.reject(error);
    }
);

export const auth = {
    login: (credentials: any) => api.post('/auth/login', credentials),
    register: (userData: any) => api.post('/auth/register', userData),
    getProfile: () => api.get('/auth/profile'),
};

export const courses = {
    getAllCourses: (params?: any) => api.get('/courses', { params }),
    getCourseById: (id: string) => api.get(`/courses/${id}`),
    createCourse: (courseData: any) => api.post('/courses', courseData),
    updateCourse: (id: string, courseData: any) => api.put(`/courses/${id}`, courseData),
    deleteCourse: (id: string) => api.delete(`/courses/${id}`),
    // Public endpoint for adding reviews
    addReview: (courseId: string, reviewData: { rating: number; comment?: string }) =>
        api.post(`/courses/${courseId}/reviews`, reviewData),
};

// NEW: Student-specific actions
export const studentActions = {
    enrollInCourse: (courseId: string) => api.post(`/courses/${courseId}/enroll`),
    updateCourseProgress: (courseId: string, syllabusItemId: string) =>
        api.put(`/courses/${courseId}/progress/${syllabusItemId}`),
};

// NEW: Student Dashboard Endpoints
export const studentDashboard = {
    getMyEnrollments: () => api.get('/users/me/enrollments'),
    getDetailedEnrollment: (courseId: string) => api.get(`/users/me/enrollments/${courseId}`),
    generateCertificate: (enrollmentId: string) => api.get(`/users/me/enrollments/${enrollmentId}/certificate`, { responseType: 'blob' }), // Expects a file
};


export default api;