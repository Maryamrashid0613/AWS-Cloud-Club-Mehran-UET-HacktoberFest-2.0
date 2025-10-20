// src/app/(dashboard)/instructor/courses/[courseId]/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { courses } from '@/lib/instructor/api';
import { toast } from 'sonner';
import { Course } from '@/types/index';
// import CourseForm from '@/components/dashboard/CourseForm';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import CourseForm from '@/components/dashboard/CourseFrom';

export default function EditCoursePage({ params }: { params: { courseId: string } }) {
  const { courseId } = params;
  const router = useRouter();
  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        setLoading(true);
        const response = await courses.getCourseById(courseId);
        setCourse(response.data);
      } catch (err: any) {
        setError(err.message || 'Failed to fetch course details.');
        toast.error('Failed to load course for editing.');
        router.push('/instructor/courses'); // Redirect if course not found or error
      } finally {
        setLoading(false);
      }
    };

    if (courseId) {
      fetchCourse();
    }
  }, [courseId, router]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-full">
        <p>Loading course details...</p>
      </div>
    );
  }

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  if (!course) {
    return <div className="text-muted-foreground">Course not found.</div>;
  }

  return (
    <div className="max-w-3xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle>Edit Course: {course.title}</CardTitle>
        </CardHeader>
        <CardContent>
          <CourseForm initialData={course} courseId={courseId} />
        </CardContent>
      </Card>
    </div>
  );
}