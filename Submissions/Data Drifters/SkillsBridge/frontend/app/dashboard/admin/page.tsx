"use client";

import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton"; // You might need to install this via shadcn-ui add skeleton
import { CheckCircledIcon, CrossCircledIcon } from "@radix-ui/react-icons";

// Dummy API calls (replace with actual fetch requests)
const fetchAnalytics = async () => {
  return new Promise(resolve => setTimeout(() => resolve({
    totalUsers: 1500,
    pendingInstructors: 12,
    pendingCourses: 5,
    // Add more analytics data here
  }), 1000));
};

const fetchPendingInstructors = async () => {
  return new Promise(resolve => setTimeout(() => resolve([
    { id: '1', name: 'John Doe', email: 'john@example.com', dateJoined: '2023-10-26' },
    { id: '2', name: 'Jane Smith', email: 'jane@example.com', dateJoined: '2023-10-25' },
  ]), 800));
};

const fetchPendingCourses = async () => {
    return new Promise(resolve => setTimeout(() => resolve([
      { id: 'c1', title: 'Introduction to Web Dev', instructor: 'Alice Brown', dateCreated: '2023-10-20' },
      { id: 'c2', title: 'Data Science Basics', instructor: 'Bob Green', dateCreated: '2023-10-18' },
    ]), 1200));
  };


export default function AdminDashboardPage() {
  const [analytics, setAnalytics] = useState<any>(null);
  const [pendingInstructors, setPendingInstructors] = useState<any[]>([]);
  const [pendingCourses, setPendingCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const [analyticsData, instructorsData, coursesData] = await Promise.all([
          fetchAnalytics(),
          fetchPendingInstructors(),
          fetchPendingCourses(),
        ]);
        setAnalytics(analyticsData);
        setPendingInstructors(instructorsData as any[]);
        setPendingCourses(coursesData as any[]);
      } catch (error) {
        toast.error("Failed to load dashboard data.");
        console.error("Dashboard data fetch error:", error);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const handleApproveInstructor = (id: string) => {
    // Call your backend API to approve instructor
    toast.success(`Instructor ${id} approved successfully!`);
    setPendingInstructors(prev => prev.filter(inst => inst.id !== id));
  };

  const handleRejectInstructor = (id: string) => {
    // Call your backend API to reject instructor
    toast.error(`Instructor ${id} rejected.`);
    setPendingInstructors(prev => prev.filter(inst => inst.id !== id));
  };

  const handleApproveCourse = (id: string) => {
    // Call your backend API to approve course
    toast.success(`Course ${id} approved successfully!`);
    setPendingCourses(prev => prev.filter(course => course.id !== id));
  };

  const handleRejectCourse = (id: string) => {
    // Call your backend API to reject course
    toast.error(`Course ${id} rejected.`);
    setPendingCourses(prev => prev.filter(course => course.id !== id));
  };

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold dark:text-white">Admin Dashboard</h2>

      {/* Analytics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            {/* <PersonIcon className="h-4 w-4 text-muted-foreground" /> */}
          </CardHeader>
          <CardContent>
            {loading ? <Skeleton className="h-8 w-2/3" /> : <div className="text-2xl font-bold">{analytics?.totalUsers.toLocaleString()}</div>}
            <p className="text-xs text-muted-foreground">+20.1% from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Instructors</CardTitle>
            {/* <RocketIcon className="h-4 w-4 text-muted-foreground" /> */}
          </CardHeader>
          <CardContent>
            {loading ? <Skeleton className="h-8 w-1/3" /> : <div className="text-2xl font-bold">{analytics?.pendingInstructors}</div>}
            <p className="text-xs text-muted-foreground">Needs review</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Courses</CardTitle>
            {/* <CubeIcon className="h-4 w-4 text-muted-foreground" /> */}
          </CardHeader>
          <CardContent>
            {loading ? <Skeleton className="h-8 w-1/3" /> : <div className="text-2xl font-bold">{analytics?.pendingCourses}</div>}
            <p className="text-xs text-muted-foreground">Awaiting approval</p>
          </CardContent>
        </Card>
      </div>

      {/* Pending Instructors Section */}
      <Card>
        <CardHeader>
          <CardTitle>Pending Instructor Applications</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="space-y-4">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
            </div>
          ) : pendingInstructors.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-800">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-400">Name</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-400">Email</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-400">Date Joined</th>
                    <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-400">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200 dark:bg-gray-900 dark:divide-gray-700">
                  {pendingInstructors.map((instructor) => (
                    <tr key={instructor.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">{instructor.name}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{instructor.email}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{instructor.dateJoined}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                        <Button variant="outline" size="sm" onClick={() => handleApproveInstructor(instructor.id)}>
                          <CheckCircledIcon className="mr-2" /> Approve
                        </Button>
                        <Button variant="destructive" size="sm" onClick={() => handleRejectInstructor(instructor.id)}>
                          <CrossCircledIcon className="mr-2" /> Reject
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-muted-foreground">No pending instructor applications.</p>
          )}
        </CardContent>
      </Card>

       {/* Pending Courses Section */}
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
          ) : pendingCourses.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-800">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-400">Title</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-400">Instructor</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-400">Date Created</th>
                    <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-400">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200 dark:bg-gray-900 dark:divide-gray-700">
                  {pendingCourses.map((course) => (
                    <tr key={course.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">{course.title}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{course.instructor}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{course.dateCreated}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                        <Button variant="outline" size="sm" onClick={() => handleApproveCourse(course.id)}>
                            <CheckCircledIcon className="mr-2" /> Approve
                        </Button>
                        <Button variant="destructive" size="sm" onClick={() => handleRejectCourse(course.id)}>
                            <CrossCircledIcon className="mr-2" /> Reject
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-muted-foreground">No courses awaiting review.</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}