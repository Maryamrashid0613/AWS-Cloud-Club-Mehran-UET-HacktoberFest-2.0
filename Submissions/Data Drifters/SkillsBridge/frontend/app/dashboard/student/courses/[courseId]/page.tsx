// src/app/(dashboard)/student/enrollments/[courseId]/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { studentDashboard, studentActions, courses } from '@/lib/student/api';
import { toast } from 'sonner';
import { Enrollment, Course, SyllabusItem, Review } from '@/types';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Checkbox } from '@/components/ui/checkbox';
import { Separator } from '@/components/ui/separator';
import { BookOpen, CheckCircle2, PlayCircle, FileText, FileDown, Star, MessageSquare, Trophy } from 'lucide-react';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Badge } from '@/components/ui/badge';
import { Rating } from 'react-simple-star-rating'; // You'll need to install this or create a custom one
import Link from 'next/link';
import ReviewForm from '@/components/dashboard/ReviewForm';
// import ReviewForm from '@/components/dashboard/ReviewForm'; // New component

// Install react-simple-star-rating: npm install react-simple-star-rating
// Or use your own star rating component. For now, I'll assume you install it.

export const dynamic = 'force-dynamic'; // Ensure dynamic rendering

// Helper function to calculate progress percentage
const calculateProgress = (enrollment: Enrollment, course: Course) => {
  if (!course?.syllabus?.length) return 0;
  const completedLessons = Array.from(enrollment.progress?.values() || []).filter(Boolean).length;
  return Math.round((completedLessons / course.syllabus.length) * 100);
};

export default function EnrolledCourseDetailPage({ params }: { params: { courseId: string } }) {
  const { courseId } = params;
  const router = useRouter();
  const [enrollment, setEnrollment] = useState<Enrollment | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isReviewFormOpen, setIsReviewFormOpen] = useState(false);

  const fetchDetailedEnrollment = async () => {
    try {
      setLoading(true);
      const response = await studentDashboard.getDetailedEnrollment(courseId);
      setEnrollment(response.data);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch enrollment details.');
      toast.error('Failed to load course details. You might not be enrolled.');
      router.push('/student/enrollments'); // Redirect if not found or not enrolled
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (courseId) {
      fetchDetailedEnrollment();
    }
  }, [courseId]);

  const handleToggleLessonCompletion = async (syllabusItemId: string, isCompleted: boolean) => {
    if (!enrollment || !enrollment._id) return; // Ensure enrollment is loaded

    try {
      if (isCompleted) {
        // If it's already completed, this action effectively unmarks it (backend handles toggle)
        // Or you might design backend to only mark as complete. For now, we'll send it.
        await studentActions.updateCourseProgress(
          (enrollment.course as Course)._id,
          syllabusItemId
        );
        toast.info('Lesson progress updated.');
      } else {
        await studentActions.updateCourseProgress(
          (enrollment.course as Course)._id,
          syllabusItemId
        );
        toast.success('Lesson marked as complete!');
      }
      fetchDetailedEnrollment(); // Refresh data to show updated progress
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to update lesson progress.');
    }
  };

  const handleReviewSubmitted = () => {
    setIsReviewFormOpen(false);
    toast.success("Thank you for your review!");
    fetchDetailedEnrollment(); // Re-fetch enrollment to potentially show new review
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-full">
        <p>Loading enrolled course...</p>
      </div>
    );
  }

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  if (!enrollment || !enrollment.course) {
    return <div className="text-muted-foreground">Enrollment or course data not found.</div>;
  }

  const course = enrollment.course as Course;
  const progressPercentage = calculateProgress(enrollment, course);
  const progressMap = enrollment.progress || new Map<string, boolean>();

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="h-6 w-6" /> {course.title}
          </CardTitle>
          <CardDescription>
            <span className="font-medium">{course.category}</span> | Difficulty: {course.difficulty}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p>{course.description}</p>
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Your Progress:</h3>
            <span>{progressPercentage}% Complete</span>
          </div>
          <Progress value={progressPercentage} className="h-2" />

          {enrollment.isCompleted && (
            <div className="flex items-center justify-between p-4 bg-green-50 border border-green-200 rounded-md">
              <span className="flex items-center gap-2 text-green-700 font-medium">
                <CheckCircle2 className="h-5 w-5" /> Course Completed!
              </span>
              <Button asChild>
                <Link href={`/student/enrollments/${enrollment._id}/certificate`}>
                  <Trophy className="mr-2 h-4 w-4" /> Get Certificate
                </Link>
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      <h2 className="text-2xl font-bold mt-8 mb-4">Course Syllabus</h2>
      <div className="space-y-4">
        {course.syllabus.map((item, index) => {
          const isLessonCompleted = progressMap.get(item._id || '') === true;
          const contentUrl = item.contentUrl || '#'; // Fallback for links
          const isDownloadable = item.type === 'pdf' && item.contentUrl; // Only PDF for now

          return (
            <Collapsible key={item._id || index} className="border rounded-md">
              <CollapsibleTrigger className="flex items-center justify-between w-full p-4 hover:bg-muted">
                <div className="flex items-center gap-3">
                  <Checkbox
                    id={`lesson-${item._id}`}
                    checked={isLessonCompleted}
                    onCheckedChange={(checked) =>
                      handleToggleLessonCompletion(item._id!, typeof checked === 'boolean' ? checked : isLessonCompleted)
                    }
                    className="h-5 w-5"
                    aria-label={`Mark lesson "${item.title}" as complete`}
                  />
                  <span className="font-medium text-left">{index + 1}. {item.title}</span>
                  <Badge variant="secondary" className="ml-2 capitalize">{item.type}</Badge>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <span>{item.duration} min</span>
                  <BookOpen className="h-4 w-4" />
                </div>
              </CollapsibleTrigger>
              <CollapsibleContent className="border-t p-4 space-y-4 bg-secondary/50">
                {item.type === 'text' && (
                  <div className="prose prose-sm max-w-none">
                    <p>{item.textContent}</p>
                  </div>
                )}
                {(item.type === 'video' || item.type === 'pdf') && (
                  <div className="flex flex-col gap-2">
                    <Button asChild variant="default">
                      <a href={contentUrl} target="_blank" rel="noopener noreferrer">
                        {item.type === 'video' ? (
                          <> <PlayCircle className="mr-2 h-4 w-4" /> Watch Video </>
                        ) : (
                          <> <FileText className="mr-2 h-4 w-4" /> View PDF </>
                        )}
                      </a>
                    </Button>
                    {isDownloadable && (
                       <Button asChild variant="outline">
                           <a href={contentUrl} download target="_blank" rel="noopener noreferrer">
                               <FileDown className="mr-2 h-4 w-4" /> Download PDF
                           </a>
                       </Button>
                    )}
                  </div>
                )}
                {/* Add more content types as needed */}
              </CollapsibleContent>
            </Collapsible>
          );
        })}
      </div>

      <Separator className="my-8" />

      <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
        <MessageSquare className="h-6 w-6" /> Reviews
      </h2>
      <div className="space-y-4">
        {course.averageRating > 0 && (
          <div className="flex items-center gap-2 text-lg">
            <Rating initialValue={course.averageRating} readonly size={24} allowFraction />
            <span className="font-semibold">{course.averageRating.toFixed(1)}</span>
            <span className="text-muted-foreground">({course.numReviews} reviews)</span>
          </div>
        )}

        {/* Display existing reviews (if any) */}
        {course.reviews && course.reviews.length > 0 ? (
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
        ) : (
          <p className="text-muted-foreground">No reviews yet. Be the first to review this course!</p>
        )}

        {enrollment.isCompleted && (
          <>
            <Button onClick={() => setIsReviewFormOpen(!isReviewFormOpen)}>
              {isReviewFormOpen ? 'Cancel Review' : 'Add Your Review'}
            </Button>
            {isReviewFormOpen && (
              <ReviewForm
                courseId={course._id}
                onReviewSubmitted={handleReviewSubmitted}
                onCancel={() => setIsReviewFormOpen(false)}
              />
            )}
          </>
        )}
         {!enrollment.isCompleted && (
            <p className="text-muted-foreground text-sm">You can add a review once you've completed the course.</p>
        )}
      </div>
    </div>
  );
}