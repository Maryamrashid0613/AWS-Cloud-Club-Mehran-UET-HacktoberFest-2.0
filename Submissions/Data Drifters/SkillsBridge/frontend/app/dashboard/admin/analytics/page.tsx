"use client";

import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { getPlatformAnalytics } from '@/lib/api';
import { PersonIcon, CubeIcon, RocketIcon } from '@radix-ui/react-icons'; // Assuming these are installed

// In a real app, you'd import charting components here, e.g.:
// import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface AnalyticsData {
  totalUsers: number;
  totalInstructors: number;
  totalCourses: number;
  approvedCourses: number;
  pendingInstructors: number;
  pendingCourses: number;
  userGrowth: { date: string; users: number; }[];
  enrollmentsByCourse: { courseTitle: string; enrollments: number; }[];
  // ... more sophisticated analytics
}

export default function AnalyticsPage() {
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchAnalyticsData = async () => {
    setLoading(true);
    try {
      const data = await getPlatformAnalytics();
      // Simulate some more dummy data for charts
      const dummyAnalytics: AnalyticsData = {
        totalUsers: 2500,
        totalInstructors: 120,
        totalCourses: 300,
        approvedCourses: 280,
        pendingInstructors: 5,
        pendingCourses: 10,
        userGrowth: [
          { date: "Jan", users: 100 },
          { date: "Feb", users: 150 },
          { date: "Mar", users: 220 },
          { date: "Apr", users: 300 },
          { date: "May", users: 450 },
          { date: "Jun", users: 600 },
        ],
        enrollmentsByCourse: [
          { courseTitle: "React Fundamentals", enrollments: 150 },
          { courseTitle: "Node.js API Development", enrollments: 120 },
          { courseTitle: "Advanced CSS", enrollments: 80 },
          { courseTitle: "Database Design", enrollments: 95 },
        ],
      };
      setAnalytics({ ...dummyAnalytics, ...data });
    } catch (error) {
      toast.error("Failed to load analytics data.");
      console.error("Analytics fetch error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalyticsData();
  }, []);

  // Placeholder for a chart component
  const ChartPlaceholder = ({ title, description }: { title: string; description: string }) => (
    <Card className="h-72 flex flex-col items-center justify-center text-center text-muted-foreground">
      <CardTitle className="text-lg">{title}</CardTitle>
      <CardContent className="text-sm">{description}</CardContent>
      <Skeleton className="mt-4 h-24 w-4/5" />
    </Card>
  );

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold dark:text-white">Platform Analytics</h2>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <PersonIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {loading ? <Skeleton className="h-8 w-2/3" /> : <div className="text-2xl font-bold">{analytics?.totalUsers?.toLocaleString() || 0}</div>}
            <p className="text-xs text-muted-foreground">All registered users</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Courses</CardTitle>
            <CubeIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {loading ? <Skeleton className="h-8 w-2/3" /> : <div className="text-2xl font-bold">{analytics?.totalCourses?.toLocaleString() || 0}</div>}
            <p className="text-xs text-muted-foreground">Total courses on platform</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Approved Courses</CardTitle>
            {/* <CheckCircledIcon className="h-4 w-4 text-muted-foreground" /> */}
          </CardHeader>
          <CardContent>
            {loading ? <Skeleton className="h-8 w-2/3" /> : <div className="text-2xl font-bold">{analytics?.approvedCourses?.toLocaleString() || 0}</div>}
            <p className="text-xs text-muted-foreground">Live & visible courses</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Instructors</CardTitle>
            <RocketIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {loading ? <Skeleton className="h-8 w-2/3" /> : <div className="text-2xl font-bold">{analytics?.totalInstructors?.toLocaleString() || 0}</div>}
            <p className="text-xs text-muted-foreground">Approved instructors</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>User Growth Over Time</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <Skeleton className="h-60 w-full" />
            ) : (
              <ChartPlaceholder title="User Growth Chart" description="Integrate a charting library here (e.g., Recharts)" />
              // Example with Recharts:
              /*
              <ResponsiveContainer width="100%" height={250}>
                <LineChart data={analytics?.userGrowth}>
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="users" stroke="#8884d8" activeDot={{ r: 8 }} />
                </LineChart>
              </ResponsiveContainer>
              */
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Enrollments by Course</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <Skeleton className="h-60 w-full" />
            ) : (
              <ChartPlaceholder title="Enrollments by Course Chart" description="Integrate a charting library here (e.g., Nivo, Chart.js)" />
              // Example with a bar chart if using Recharts:
              /*
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={analytics?.enrollmentsByCourse}>
                  <XAxis dataKey="courseTitle" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="enrollments" fill="#82ca9d" />
                </BarChart>
              </ResponsiveContainer>
              */
            )}
          </CardContent>
        </Card>
      </div>

      {/* More charts/data can go here */}
    </div>
  );
}