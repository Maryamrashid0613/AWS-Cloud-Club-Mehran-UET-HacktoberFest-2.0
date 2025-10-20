// src/app/(dashboard)/student/page.tsx
'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { studentDashboard } from '@/lib/student/api';
import { toast } from 'sonner';
import { Enrollment, Course } from '@/types'; // Ensure types are correctly imported
import { BarChart, BookOpen, CheckCircle2, CircleDashed, Award } from 'lucide-react';
import { Button } from '@/components/ui/button';

// Helper function to calculate progress percentage
const calculateProgress = (enrollment: Enrollment, course: Course) => {
  if (!course?.syllabus?.length) return 0;
  const completedLessons = Array.from(enrollment.progress?.values() || []).filter(Boolean).length;
  return Math.round((completedLessons / course.syllabus.length) * 100);
};

export default function StudentOverviewPage() {
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMyEnrollments = async () => {
      try {
        setLoading(true);
        const response = await studentDashboard.getMyEnrollments();
        setEnrollments(response.data);
      } catch (err: any) {
        setError(err.response?.data?.message || 'Failed to fetch enrollments.');
        toast.error('Failed to load student dashboard.');
      } finally {
        setLoading(false);
      }
    };

    fetchMyEnrollments();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-full">
        <p>Loading your dashboard...</p>
      </div>
    );
  }

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  const totalEnrollments = enrollments.length;
  const completedCourses = enrollments.filter(e => e.isCompleted).length;
  const inProgressCourses = totalEnrollments - completedCourses;

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Welcome Back!</h1>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Enrolled Courses</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalEnrollments}</div>
            <p className="text-xs text-muted-foreground">
              Courses you are currently taking or have completed.
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Courses In Progress</CardTitle>
            <CircleDashed className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{inProgressCourses}</div>
            <p className="text-xs text-muted-foreground">
              Still working on these! Keep it up.
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Courses Completed</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{completedCourses}</div>
            <p className="text-xs text-muted-foreground">
              Great job on finishing these courses!
            </p>
          </CardContent>
        </Card>
      </div>

      <h2 className="text-2xl font-bold mt-8 mb-4">Your Recent Enrollments</h2>
      {enrollments.length === 0 ? (
        <div className="text-muted-foreground text-center p-8 border rounded-lg">
          <p>You haven't enrolled in any courses yet.</p>
          <Button asChild className="mt-4">
            <Link href="/courses">Browse Courses</Link>
          </Button>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {enrollments.slice(0, 3).map((enrollment) => ( // Show up to 3 recent enrollments
            <Card key={enrollment._id}>
              <CardHeader>
                <CardTitle>{(enrollment.course as Course).title}</CardTitle>
                <CardDescription>
                  Category: {(enrollment.course as Course).category}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span>Progress:</span>
                  <span>{calculateProgress(enrollment, enrollment.course as Course)}%</span>
                </div>
                <Progress value={calculateProgress(enrollment, enrollment.course as Course)} className="h-2" />
                <Button asChild variant="outline" className="w-full">
                  <Link href={`/student/enrollments/${(enrollment.course as Course)._id}`}>
                    {enrollment.isCompleted ? 'View Certificate' : 'Continue Learning'}
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {enrollments.length > 3 && (
        <div className="text-center mt-6">
          <Button asChild variant="secondary">
            <Link href="/student/enrollments">View All Enrollments</Link>
          </Button>
        </div>
      )}
    </div>
  );
}