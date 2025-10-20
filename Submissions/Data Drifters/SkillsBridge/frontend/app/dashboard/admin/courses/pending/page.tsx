"use client";

import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { CheckCircledIcon, CrossCircledIcon, EyeOpenIcon } from "@radix-ui/react-icons";
import { getPendingCourses, approveCourse, rejectCourse } from '@/lib/api';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from "@/components/ui/dialog";

interface Course {
  _id: string;
  title: string;
  description: string;
  instructor: {
    _id: string;
    name: string;
  };
  category: string;
  difficulty: string;
  isApproved: boolean; // Assuming your backend has this field
  createdAt: string;
  syllabus: Array<{ title: string; type: string; contentUrl?: string; textContent?: string; duration: number }>;
}

export default function PendingCoursesPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);

  const fetchCourses = async () => {
    setLoading(true);
    try {
      const data = await getPendingCourses();
      // Filter for courses that are explicitly not approved yet
      setCourses(data.filter(course => !course.isApproved));
    } catch (error) {
      toast.error("Failed to load pending courses.");
      console.error("Pending courses fetch error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  const handleApprove = async (id: string) => {
    try {
      await approveCourse(id);
      toast.success(`Course "${id}" approved.`);
      setCourses(prev => prev.filter(course => course._id !== id));
    } catch (error) {
      // toast.error handled in api.ts
    }
  };

  const handleReject = async (id: string) => {
    try {
      await rejectCourse(id);
      toast.info(`Course "${id}" rejected.`);
      setCourses(prev => prev.filter(course => course._id !== id));
    } catch (error) {
      // toast.error handled in api.ts
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold dark:text-white">Pending Course Approvals</h2>

      <Card>
        <CardHeader>
          <CardTitle>Courses Awaiting Review</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="space-y-4">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
            </div>
          ) : courses.length > 0 ? (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Title</TableHead>
                    <TableHead>Instructor</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Difficulty</TableHead>
                    <TableHead>Created On</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {courses.map((course) => (
                    <TableRow key={course._id}>
                      <TableCell className="font-medium">{course.title}</TableCell>
                      <TableCell>{course.instructor?.name || 'N/A'}</TableCell>
                      <TableCell>{course.category}</TableCell>
                      <TableCell>{course.difficulty}</TableCell>
                      <TableCell>{new Date(course.createdAt).toLocaleDateString()}</TableCell>
                      <TableCell className="text-right space-x-2">
                         <Button variant="ghost" size="sm" onClick={() => setSelectedCourse(course)}>
                            <EyeOpenIcon className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => handleApprove(course._id)}>
                          <CheckCircledIcon className="mr-2" /> Approve
                        </Button>
                        <Button variant="destructive" size="sm" onClick={() => handleReject(course._id)}>
                          <CrossCircledIcon className="mr-2" /> Reject
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <p className="text-muted-foreground">No courses awaiting review.</p>
          )}
        </CardContent>
      </Card>

      {/* Course Details Dialog */}
      <Dialog open={!!selectedCourse} onOpenChange={() => setSelectedCourse(null)}>
        <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{selectedCourse?.title}</DialogTitle>
            <DialogDescription>
              Details for the course submitted by {selectedCourse?.instructor?.name}.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div>
              <h4 className="font-semibold mb-2">Description:</h4>
              <p className="text-sm text-muted-foreground">{selectedCourse?.description}</p>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Category:</h4>
              <p className="text-sm text-muted-foreground">{selectedCourse?.category}</p>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Difficulty:</h4>
              <p className="text-sm text-muted-foreground">{selectedCourse?.difficulty}</p>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Syllabus:</h4>
              {selectedCourse?.syllabus && selectedCourse.syllabus.length > 0 ? (
                <ul className="list-disc pl-5 space-y-1">
                  {selectedCourse.syllabus.map((lesson, index) => (
                    <li key={index} className="text-sm text-muted-foreground">
                      <strong>{lesson.title}</strong> ({lesson.type}, {lesson.duration} mins)
                      {lesson.contentUrl && <span className="ml-2 text-blue-500 hover:underline"><a href={lesson.contentUrl} target="_blank" rel="noopener noreferrer">Link</a></span>}
                      {lesson.textContent && <p className="text-xs italic mt-0.5">{lesson.textContent.substring(0, 100)}...</p>}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-muted-foreground">No syllabus provided.</p>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}