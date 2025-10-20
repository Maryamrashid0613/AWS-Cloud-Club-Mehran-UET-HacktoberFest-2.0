"use client"

// src/app/(dashboard)/student/layout.tsx
import { ReactNode } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { BookOpen, GraduationCap, Home, LogOut, Menu, Package2, Trophy } from 'lucide-react'; // Added icons for student

export default function StudentDashboardLayout({ children }: { children: ReactNode }) {
  return (
    <div className="grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
      {/* Sidebar */}
      <div className="hidden border-r bg-muted/40 md:block">
        <div className="flex h-full max-h-screen flex-col gap-2">
          <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
            <Link href="/student" className="flex items-center gap-2 font-semibold">
              <GraduationCap className="h-6 w-6" />
              <span className="">SkillBridge Student</span>
            </Link>
          </div>
          <div className="flex-1">
            <nav className="grid items-start px-2 text-sm font-medium lg:px-4">
              <Link
                href="/student"
                className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary"
              >
                <Home className="h-4 w-4" />
                Dashboard
              </Link>
              <Link
                href="/dashboard/student/enrollments"
                className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary"
              >
                <BookOpen className="h-4 w-4" />
                My Enrollments
              </Link>
              <Link
                href="/courses" // Link to public courses page
                className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary"
              >
                <Package2 className="h-4 w-4" />
                Browse Courses
              </Link>


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

              {/* Add more links like Profile/Settings if needed */}
            </nav>
          </div>
        </div>
      </div>
      {/* Main Content */}
      <div className="flex flex-col">
        <header className="flex h-14 items-center gap-4 border-b bg-muted/40 px-4 lg:h-[60px] lg:px-6">
          <Sheet>
            <SheetTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                className="shrink-0 md:hidden"
              >
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle navigation menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="flex flex-col">
              <nav className="grid gap-2 text-lg font-medium">
                <Link
                  href="#"
                  className="flex items-center gap-2 text-lg font-semibold"
                >
                  <GraduationCap className="h-6 w-6" />
                  <span className="sr-only">SkillBridge</span>
                </Link>
                <Link
                  href="/dashboard/student"
                  className="mx-[-0.65rem] flex items-center gap-4 rounded-xl px-3 py-2 text-muted-foreground hover:text-foreground"
                >
                  <Home className="h-5 w-5" />
                  Dashboard
                </Link>
                <Link
                  href="/student/enrollments"
                  className="mx-[-0.65rem] flex items-center gap-4 rounded-xl px-3 py-2 text-muted-foreground hover:text-foreground"
                >
                  <BookOpen className="h-5 w-5" />
                  My Enrollments
                </Link>
                <Link
                  href="/courses"
                  className="mx-[-0.65rem] flex items-center gap-4 rounded-xl px-3 py-2 text-muted-foreground hover:text-foreground"
                >
                  <Package2 className="h-5 w-5" />
                  Browse Courses
                </Link>


                
                                                    
                            <Link href="/"
                             onClick={()=>{
                                          localStorage.removeItem("token")
                                          localStorage.removeItem("userRole")
                                          localStorage.removeItem("isApproved")
              
                                      }}
                            className="flex items-center p-2 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700">
                              <LogOut className="mr-3 h-5 w-5" />
                              Logout
                            </Link>

                
              </nav>
            </SheetContent>
          </Sheet>
          {/* User/Auth related components can go here (e.g., profile dropdown) */}
          <div className="w-full flex-1">
            {/* Search or other header elements */}
          </div>
          {/* User dropdown menu or profile info */}
        </header>
        <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
          {children}
        </main>
      </div>
    </div>
  );
}