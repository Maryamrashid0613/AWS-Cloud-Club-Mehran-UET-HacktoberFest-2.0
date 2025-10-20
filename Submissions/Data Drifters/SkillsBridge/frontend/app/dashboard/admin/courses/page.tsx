"use client";

import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from "@/components/ui/dialog";
import { TrashIcon, EyeOpenIcon, CubeIcon } from "@radix-ui/react-icons";
import { getAllCourses, deleteCourse } from '@/lib/api';

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
  isApproved?: boolean; // Assuming this field exists and indicates public visibility
  createdAt: string;
  syllabus: Array<{ title: string; type: string; contentUrl?: string; textContent?: string; duration: number }>;
}

export default function CoursesPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);

  const fetchCourses = async () => {
    setLoading(true);
    try {
      const data = await getAllCourses(); // This calls the public /courses endpoint
      // You might need to adjust this if your backend's /admin/courses endpoint is different
      setCourses(data);
    } catch (error) {
      toast.error("Failed to load courses.");
      console.error("Courses fetch error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  const handleDeleteCourse = async (courseId: string) => {
    try {
      await deleteCourse(courseId);
      toast.success("Course deleted successfully.");
      setCourses(prevCourses => prevCourses.filter(course => course._id !== courseId));
    } catch (error) {
      // toast.error handled in api.ts
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold dark:text-white flex items-center">
        <CubeIcon className="h-7 w-7 mr-3" /> All Courses
      </h2>

      <Card>
        <CardHeader>
          <CardTitle>All Courses on SkillBridge</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => <Skeleton key={i} className="h-10 w-full" />)}
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
                    <TableHead>Status</TableHead>
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
                      <TableCell>
                        {course.isApproved ? (
                          <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800 dark:bg-green-900 dark:text-green-200">
                            Approved
                          </span>
                        ) : (
                          <span className="inline-flex items-center rounded-full bg-yellow-100 px-2.5 py-0.5 text-xs font-medium text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200">
                            Pending
                          </span>
                        )}
                      </TableCell>
                      <TableCell className="text-right space-x-2">
                        <Button variant="ghost" size="sm" onClick={() => setSelectedCourse(course)}>
                            <EyeOpenIcon className="h-4 w-4" />
                        </Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="destructive" size="sm">
                              <TrashIcon className="h-4 w-4" />
                              <span className="sr-only">Delete course</span>
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                              <AlertDialogDescription>
                                This action cannot be undone. This will permanently delete the course "{course.title}" and all associated data.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction onClick={() => handleDeleteCourse(course._id)} className="bg-red-600 hover:bg-red-700">
                                Delete
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <p className="text-muted-foreground">No courses found.</p>
          )}
        </CardContent>
      </Card>

      {/* Course Details Dialog */}
      <Dialog open={!!selectedCourse} onOpenChange={() => setSelectedCourse(null)}>
        <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{selectedCourse?.title}</DialogTitle>
            <DialogDescription>
              Details for the course by {selectedCourse?.instructor?.name}.
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