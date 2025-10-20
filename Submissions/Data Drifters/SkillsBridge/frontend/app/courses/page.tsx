// src/app/courses/page.tsx
'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { courses as apiCourses, studentActions } from '@/lib/student/api'; // Alias to avoid conflict
import { toast } from 'sonner';
import { Course } from '@/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, Star } from 'lucide-react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Rating } from 'react-simple-star-rating';

export const dynamic = 'force-dynamic';

export default function PublicCoursesPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [difficultyFilter, setDifficultyFilter] = useState('');

  const searchParams = useSearchParams();
  const router = useRouter();

  const fetchCourses = async () => {
    try {
      setLoading(true);
      const params = {
        search: searchParams.get('search') || '',
        category: searchParams.get('category') || '',
        difficulty: searchParams.get('difficulty') || '',
      };
      const response = await apiCourses.getAllCourses(params);
      setCourses(response.data);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch courses.');
      toast.error('Failed to load courses.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setSearchQuery(searchParams.get('search') || '');
    setCategoryFilter(searchParams.get('category') || '');
    setDifficultyFilter(searchParams.get('difficulty') || '');
    fetchCourses();
  }, [searchParams]); // Re-fetch when URL search params change

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (searchQuery) params.set('search', searchQuery);
    if (categoryFilter) params.set('category', categoryFilter);
    if (difficultyFilter) params.set('difficulty', difficultyFilter);
    router.push(`/courses?${params.toString()}`);
  };

  const handleClearFilters = () => {
    setSearchQuery('');
    setCategoryFilter('');
    setDifficultyFilter('');
    router.push('/courses');
  };

  const handleEnroll = async (courseId: string) => {
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
        <p>Loading available courses...</p>
      </div>
    );
  }

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  return (
    <div className="space-y-6 container mx-auto py-8">
      <h1 className="text-4xl font-extrabold text-center mb-8">Explore SkillBridge Courses</h1>

      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Input
            placeholder="Search courses..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === 'Enter') handleSearch();
            }}
            className="pr-10"
          />
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-0 top-0 h-full px-3"
            onClick={handleSearch}
          >
            <Search className="h-4 w-4" />
          </Button>
        </div>

        <Select value={categoryFilter} onValueChange={(value) => setCategoryFilter(value)}>
          <SelectTrigger className="w-full md:w-[180px]">
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            <SelectItem value="Programming">Programming</SelectItem>
            <SelectItem value="Design">Design</SelectItem>
            <SelectItem value="Business">Business</SelectItem>
            <SelectItem value="Marketing">Marketing</SelectItem>
            <SelectItem value="Data Science">Data Science</SelectItem>
          </SelectContent>
        </Select>

        <Select value={difficultyFilter} onValueChange={(value) => setDifficultyFilter(value)}>
          <SelectTrigger className="w-full md:w-[180px]">
            <SelectValue placeholder="Difficulty" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Difficulties</SelectItem>
            <SelectItem value="Beginner">Beginner</SelectItem>
            <SelectItem value="Intermediate">Intermediate</SelectItem>
            <SelectItem value="Advanced">Advanced</SelectItem>
          </SelectContent>
        </Select>

        <Button onClick={handleSearch}>Apply Filters</Button>
        {(searchQuery || categoryFilter || difficultyFilter) && (
          <Button variant="outline" onClick={handleClearFilters}>Clear Filters</Button>
        )}
      </div>

      {courses.length === 0 ? (
        <p className="text-muted-foreground text-center p-8 border rounded-lg">
          No courses found matching your criteria.
        </p>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {courses.map((course) => (
            <Card key={course._id} className="flex flex-col justify-between">
              <CardHeader>
                <CardTitle className="line-clamp-2">{course.title}</CardTitle>
                <CardDescription>
                  {course.category} | {course.difficulty} | {course.duration} hours
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground line-clamp-3">{course.description}</p>
                {course.numReviews > 0 && (
                  <div className="flex items-center gap-1 text-sm">
                    <Rating initialValue={course.averageRating} readonly size={16} allowFraction />
                    <span>{course.averageRating.toFixed(1)}</span>
                    <span className="text-muted-foreground">({course.numReviews})</span>
                  </div>
                )}
                <div className="flex flex-col gap-2">
                  <Button asChild className="w-full">
                    <Link href={`/courses/${course._id}`}>View Details</Link>
                  </Button>
                  <Button variant="secondary" className="w-full" onClick={() => handleEnroll(course._id)}>
                    Enroll Now
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}