// src/app/(dashboard)/instructor/courses/create/page.tsx
// import CourseForm from '@';
import CourseForm from '@/components/dashboard/CourseFrom';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

export default function CreateCoursePage() {
  return (
    <div className="max-w-3xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle>Create New Course</CardTitle>
        </CardHeader>
        <CardContent>
          <CourseForm />
        </CardContent>
      </Card>
    </div>
  );
}