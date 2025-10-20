// src/app/courses/[courseId]/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { courses as apiCourses, studentActions } from '@/lib/student/api';
import { toast } from 'sonner';
import { Course, SyllabusItem, Review } from '@/types';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { BookOpen, CheckCircle2, PlayCircle, FileText, Star, MessageSquare } from 'lucide-react';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Badge } from '@/components/ui/badge';
import { Rating } from 'react-simple-star-rating';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export default function PublicCourseDetailPage({ params }: { params: { courseId: string } }) {
  const { courseId } = params;
  const router = useRouter();
  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        setLoading(true);
        const response = await apiCourses.getCourseById(courseId);
        setCourse(response.data);
      } catch (err: any) {
        setError(err.response?.data?.message || 'Failed to fetch course details.');
        toast.error('Failed to load course details.');
        router.push('/courses'); // Redirect if course not found
      } finally {
        setLoading(false);
      }
    };

    if (courseId) {
      fetchCourse();
    }
  }, [courseId, router]);

  const handleEnroll = async () => {
    try {
      await studentActions.enrollInCourse(courseId);
      toast.success('Successfully enrolled in the course!');
      router.push(`/student/enrollments/${courseId}`); // Redirect to enrolled course details
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to enroll in course. You might already be enrolled or need to log in.');
    }
  };


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
    <div className="space-y-6 container mx-auto py-8">
      <Card>
        <CardHeader>
          <CardTitle className="text-3xl flex items-center gap-2">
            <BookOpen className="h-8 w-8" /> {course.title}
          </CardTitle>
          <CardDescription className="text-lg">
            <span className="font-medium">{course.category}</span> | Difficulty: {course.difficulty} | {course.duration} hours
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-md">{course.description}</p>
          {course.numReviews > 0 && (
            <div className="flex items-center gap-2 text-lg">
              <Rating initialValue={course.averageRating} readonly size={24} allowFraction />
              <span className="font-semibold">{course.averageRating.toFixed(1)}</span>
              <span className="text-muted-foreground">({course.numReviews} reviews)</span>
            </div>
          )}
          <Button onClick={handleEnroll} className="w-full sm:w-auto">
            Enroll Now
          </Button>
        </CardContent>
      </Card>

      <Separator className="my-8" />

      <h2 className="text-2xl font-bold mt-8 mb-4">Course Syllabus</h2>
      <div className="space-y-4">
        {course.syllabus.map((item, index) => (
          <Collapsible key={item._id || index} className="border rounded-md">
            <CollapsibleTrigger className="flex items-center justify-between w-full p-4 hover:bg-muted">
              <div className="flex items-center gap-3">
                <span className="font-medium text-left">{index + 1}. {item.title}</span>
                <Badge variant="secondary" className="ml-2 capitalize">{item.type}</Badge>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <span>{item.duration} min</span>
                <BookOpen className="h-4 w-4" />
              </div>
            </CollapsibleTrigger>
            <CollapsibleContent className="border-t p-4 space-y-2 bg-secondary/50">
              {item.type === 'text' && (
                <div className="prose prose-sm max-w-none">
                  <p>{item.textContent}</p>
                </div>
              )}
              {(item.type === 'video' || item.type === 'pdf') && (
                <p className="text-muted-foreground text-sm">
                  Content link: <a href={item.contentUrl} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">{item.contentUrl}</a>
                </p>
              )}
              <p className="text-xs text-muted-foreground">
                Enroll to access full lesson content and track progress.
              </p>
            </CollapsibleContent>
          </Collapsible>
        ))}
      </div>

      <Separator className="my-8" />

      <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
        <MessageSquare className="h-6 w-6" /> Student Reviews
      </h2>
      <div className="space-y-4">
        {course.numReviews === 0 ? (
          <p className="text-muted-foreground">No reviews yet.</p>
        ) : (
          <div className="grid gap-4">
            {course.reviews.map((review) => (
              <Card key={review._id} className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Star className="h-4 w-4 text-yellow-500" />
                  <span className="font-semibold">{review.rating}</span>
                  <span className="text-sm text-muted-foreground">- {typeof review.user === 'object' ? review.user.name : 'Anonymous'}</span>
                </div>
                <p className="text-sm">{review.comment}</p>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}