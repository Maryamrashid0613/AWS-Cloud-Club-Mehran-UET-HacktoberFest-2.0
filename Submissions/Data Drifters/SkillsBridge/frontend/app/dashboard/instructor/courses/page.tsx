'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { instructorDashboard, courses } from '@/lib/instructor/api';
import { toast } from 'sonner';
import { Course } from '@/types/index'; // Define this type
import { AlertCircle, CheckCircle2, Pencil, Trash2 } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';


export default function InstructorCoursesPage() {
  const [myCourses, setMyCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchMyCourses = async () => {
    try {
      setLoading(true);
      const response = await instructorDashboard.getMyCourses();
      setMyCourses(response.data);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch courses.');
      toast.error('Failed to load your courses.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyCourses();
  }, []);

  const handleDeleteCourse = async (courseId: string) => {
    try {
      await courses.deleteCourse(courseId);
      toast.success('Course deleted successfully!');
      fetchMyCourses(); // Refresh the list
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to delete course.');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-full">
        <p>Loading your courses...</p>
      </div>
    );
  }

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">My Courses</h1>
        <Button asChild>
          <Link href="/dashboard/instructor/courses/create">Create New Course</Link>
        </Button>
      </div>

      {myCourses.length === 0 ? (
        <p className="text-muted-foreground">You haven't created any courses yet. Start by creating one!</p>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {myCourses.map((course) => (
            <Card key={course._id}>
              <CardHeader>
                <CardTitle>{course.title}</CardTitle>
                <CardDescription className="flex items-center gap-2">
                  {course.isApproved ? (
                    <span className="text-green-600 flex items-center gap-1">
                      <CheckCircle2 className="h-4 w-4" /> Approved
                    </span>
                  ) : (
                    <span className="text-orange-500 flex items-center gap-1">
                      <AlertCircle className="h-4 w-4" /> Pending Approval
                    </span>
                  )}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground line-clamp-3">{course.description}</p>
                <div className="flex items-center justify-between text-sm">
                  <span>Category: {course.category}</span>
                  <span>Difficulty: {course.difficulty}</span>
                </div>
                <div className="flex gap-2">
                  <Button asChild variant="outline" className="flex-1">
                    <Link href={`/dashboard/instructor/courses/${course._id}`}>
                      <Pencil className="mr-2 h-4 w-4" /> Edit
                    </Link>
                  </Button>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="destructive" className="flex-1">
                        <Trash2 className="mr-2 h-4 w-4" /> Delete
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                          This action cannot be undone. This will permanently delete your course
                          and remove its data from our servers.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={() => handleDeleteCourse(course._id)}>
                          Continue
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}