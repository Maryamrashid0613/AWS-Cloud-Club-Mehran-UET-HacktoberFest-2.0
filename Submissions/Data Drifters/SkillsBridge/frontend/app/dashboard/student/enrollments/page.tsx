// src/app/(dashboard)/student/enrollments/page.tsx
'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { studentDashboard } from '@/lib/student/api';
import { toast } from 'sonner';
import { Enrollment, Course } from '@/types';
import { CheckCircle2, CircleDashed, Trophy } from 'lucide-react';

// Helper function to calculate progress percentage
const calculateProgress = (enrollment: Enrollment, course: Course) => {
  if (!course?.syllabus?.length) return 0;
  // Ensure progress is a Map and filter boolean values for completion
  const completedLessons = Array.from(enrollment.progress?.values() || []).filter(Boolean).length;
  return Math.round((completedLessons / course.syllabus.length) * 100);
};

export default function MyEnrollmentsPage() {
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchMyEnrollments = async () => {
    try {
      setLoading(true);
      const response = await studentDashboard.getMyEnrollments();
      // Ensure course object is fully populated if not already from backend
      setEnrollments(response.data);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch enrollments.');
      toast.error('Failed to load your enrollments.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyEnrollments();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-full">
        <p>Loading your enrollments...</p>
      </div>
    );
  }

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">My Learning Paths</h1>

      {enrollments.length === 0 ? (
        <div className="text-muted-foreground text-center p-8 border rounded-lg">
          <p>It looks like you haven't enrolled in any courses yet.</p>
          <Button asChild className="mt-4">
            <Link href="/courses">Start Browsing Courses</Link>
          </Button>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {enrollments.map((enrollment) => {
            const course = enrollment.course as Course; // Cast to Course type, assuming it's populated
            if (!course) return null; // Handle case where course might not be populated

            const progressPercentage = calculateProgress(enrollment, course);

            return (
              <Card key={enrollment._id}>
                <CardHeader>
                  <CardTitle>{course.title}</CardTitle>
                  <CardDescription className="flex items-center gap-2">
                    {enrollment.isCompleted ? (
                      <span className="text-green-600 flex items-center gap-1">
                        <CheckCircle2 className="h-4 w-4" /> Completed
                      </span>
                    ) : (
                      <span className="text-blue-600 flex items-center gap-1">
                        <CircleDashed className="h-4 w-4" /> In Progress
                      </span>
                    )}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-muted-foreground line-clamp-3">{course.description}</p>
                  <div className="flex items-center justify-between text-sm">
                    <span>Progress:</span>
                    <span>{progressPercentage}%</span>
                  </div>
                  <Progress value={progressPercentage} className="h-2" />
                  <div className="flex gap-2">
                    <Button asChild variant="outline" className="flex-1">
                      <Link href={`/student/enrollments/${course._id}`}>
                        {enrollment.isCompleted ? 'Review Course' : 'Continue Learning'}
                      </Link>
                    </Button>
                    {enrollment.isCompleted && (
                      <Button asChild className="flex-1">
                        <Link href={`/student/enrollments/${enrollment._id}/certificate`}>
                          <Trophy className="mr-2 h-4 w-4" /> Get Certificate
                        </Link>
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}