"use client"

import Link from "next/link";
import { DashboardIcon, PersonIcon, CubeIcon, RocketIcon, BarChartIcon } from "@radix-ui/react-icons";
// import { Toaster } from 'sonner';
import { LogOut } from "lucide-react";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-gray-100 dark:bg-gray-900">
      {/* Sidebar */}
      <aside className="w-64 bg-white dark:bg-gray-800 shadow-md">
        <div className="p-6 border-b dark:border-gray-700">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">SkillBridge Admin</h1>
        </div>
        <nav className="p-4">
          <ul>
            <li className="mb-2">
              <Link href="/admin" className="flex items-center p-2 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700">
                <DashboardIcon className="mr-3 h-5 w-5" />
                Dashboard
              </Link>
            </li>
            <li className="mb-2">
              <Link href="/dashboard/admin/users" className="flex items-center p-2 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700">
                <PersonIcon className="mr-3 h-5 w-5" />
                Users
              </Link>
            </li>
            <li className="mb-2">
              <Link href="/dashboard/admin/courses" className="flex items-center p-2 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700">
                <CubeIcon className="mr-3 h-5 w-5" />
                Courses
              </Link>
            </li>
            <li className="mb-2">
              <Link href="/dashboard/admin/instructors/pending" className="flex items-center p-2 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700">
                <RocketIcon className="mr-3 h-5 w-5" />
                Pending Instructors
              </Link>
            </li>
            <li className="mb-2">
              <Link href="/dashboard/admin/courses/pending" className="flex items-center p-2 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700">
                <RocketIcon className="mr-3 h-5 w-5" /> {/* Re-using RocketIcon, you can add a different one */}
                Pending Courses
              </Link>
            </li>
            <li className="mb-2">
              <Link href="/dashboard/admin/analytics" className="flex items-center p-2 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700">
                <BarChartIcon className="mr-3 h-5 w-5" />
                Analytics
              </Link>
            </li>
                        <li className="mb-2" onClick={()=>{
                            localStorage.removeItem("token")
                            localStorage.removeItem("userRole")
                            localStorage.removeItem("isApproved")

                        }}>
              <Link href="/" className="flex items-center p-2 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700">
                <LogOut className="mr-3 h-5 w-5" />
                Logout
              </Link>
            </li>

          </ul>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8">
        {children}
      </main>
      {/* <Toaster richColors position="top-right" /> */}
    </div>
  );
}