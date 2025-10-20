// src/types/index.ts

export type Role = 'student' | 'instructor' | 'admin';

export interface User {
  _id: string;
  name: string;
  email: string;
  role: Role;
  isApproved: boolean;
  createdAt: string;
  updatedAt: string;
}

export type SyllabusItemType = 'video' | 'text' | 'pdf';

export interface SyllabusItem {
  _id?: string; // Optional for new items
  title: string;
  type: SyllabusItemType;
  contentUrl?: string; // URL for video/pdf
  textContent?: string; // Content for text
  duration: number; // in minutes
}

export interface Review {
  _id: string;
  user: string; // User ID
  course: string; // Course ID
  rating: number; // 1-5
  comment?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Course {
  _id: string;
  instructor: User | string; // Can be populated User object or just ID
  title: string;
  description: string;
  category: string;
  duration: number; // in hours
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  syllabus: SyllabusItem[];
  reviews: Review[];
  averageRating: number;
  numReviews: number;
  isApproved: boolean; // For admin approval
  createdAt: string;
  updatedAt: string;
  enrollments?: Enrollment[]; // Optional, might be populated in specific queries
}

export interface Enrollment {
  _id: string;
  student: User | string; // Can be populated User object or just ID
  course: Course | string; // Can be populated Course object or just ID
  progress: Map<string, boolean>; // Map of syllabus item ID to completion status
  isCompleted: boolean;
  completionDate?: string;
  createdAt: string;
  updatedAt: string;
}

export interface AuthResponse {
  _id: string;
  name: string;
  email: string;
  role: Role;
  isApproved: boolean;
  token: string;
}