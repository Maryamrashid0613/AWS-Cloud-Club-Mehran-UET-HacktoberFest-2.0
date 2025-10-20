// src/lib/api.ts
import { toast } from 'sonner';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000/api";

interface User {
  _id: string;
  name: string;
  email: string;
  role: 'student' | 'instructor' | 'admin';
  isApproved?: boolean; // For instructors
  createdAt: string;
}

interface Course {
  _id: string;
  title: string;
  instructor: {
    _id: string;
    name: string;
  };
  category: string;
  difficulty: string;
  isApproved?: boolean;
  createdAt: string;
}

interface Instructor {
    _id: string;
    name: string;
    email: string;
    isApproved: boolean;
    createdAt: string;
}


// --- Utility for API Calls ---
export async function adminFetch<T>(endpoint: string, options?: RequestInit): Promise<T> {
  // In a real app, get token securely (e.g., from an HTTP-only cookie)
  const adminToken = localStorage.getItem('token') || 'dummy-admin-token';

  const headers = {
    'Content-Type': 'application/json',
    ...(adminToken && { 'Authorization': `Bearer ${adminToken}` }),
    ...options?.headers,
  };

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers,
    });

    const responseText = await response.text(); // Read as text first
    let data: any;
    try {
      data = responseText ? JSON.parse(responseText) : {}; // Attempt to parse
    } catch (parseError) {
      console.warn(`Failed to parse JSON for ${endpoint}. Response: ${responseText}`);
      data = {}; // Default to empty object if parsing fails
    }

    if (!response.ok) {
        console.error(`API Error for ${endpoint}:`, response.status, data);
        const errorMessage = data.message || `API error: ${response.status} ${response.statusText}`;
        toast.error(errorMessage);
        throw new Error(errorMessage);
    }
    toast.success("Action successful!"); // Generic success toast, refine for specific actions
    return data as T;
  } catch (error: any) {
    console.error(`Fetch error for ${endpoint}:`, error);
    toast.error(error.message || "An unexpected error occurred.");
    throw error;
  }
}

// --- Specific Admin API Functions ---

// User Management
export const getAllUsers = async (): Promise<User[]> => {
  // Simulate fetching users
  return adminFetch<User[]>('/admin/users');
};

export const deleteUser = async (userId: string): Promise<{ message: string }> => {
  return adminFetch<{ message: string }>(`/admin/users/${userId}`, {
    method: 'DELETE',
  });
};

// Instructor Management
export const getPendingInstructors = async (): Promise<Instructor[]> => {
  return adminFetch<Instructor[]>('/admin/instructors/pending');
};

export const approveInstructor = async (instructorId: string): Promise<{ message: string }> => {
  return adminFetch<{ message: string }>(`/admin/instructors/${instructorId}/approve`, {
    method: 'PUT',
  });
};

export const rejectInstructor = async (instructorId: string): Promise<{ message: string }> => {
  return adminFetch<{ message: string }>(`/admin/instructors/${instructorId}/reject`, {
    method: 'PUT',
  });
};

// Course Management
export const getPendingCourses = async (): Promise<Course[]> => {
  return adminFetch<Course[]>('/admin/courses/pending');
};

export const approveCourse = async (courseId: string): Promise<{ message: string }> => {
  return adminFetch<{ message: string }>(`/admin/courses/${courseId}/approve`, {
    method: 'PUT',
  });
};

export const rejectCourse = async (courseId: string): Promise<{ message: string }> => {
  return adminFetch<{ message: string }>(`/admin/courses/${courseId}/reject`, {
    method: 'PUT',
  });
};

export const getAllCourses = async (): Promise<Course[]> => {
    return adminFetch<Course[]>('/courses'); // Public endpoint in your collection
};

export const deleteCourse = async (courseId: string): Promise<{ message: string }> => {
    return adminFetch<{ message: string }>(`/courses/${courseId}`, {
      method: 'DELETE',
    });
};


// Analytics
export const getPlatformAnalytics = async (): Promise<any> => {
  return adminFetch<any>('/admin/analytics');
};

// // src/lib/api.ts
// const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000/api";

// export async function adminFetch(endpoint: string, options?: RequestInit) {
//   const adminToken = localStorage.getItem('adminToken'); // Or retrieve from secure cookie/context
//   const headers = {
//     'Content-Type': 'application/json',
//     ...(adminToken && { 'Authorization': `Bearer ${adminToken}` }),
//     ...options?.headers,
//   };

//   const response = await fetch(`${API_BASE_URL}${endpoint}`, {
//     ...options,
//     headers,
//   });

//   if (!response.ok) {
//     const errorData = await response.json();
//     throw new Error(errorData.message || 'An API error occurred');
//   }

//   return response.json();
// }