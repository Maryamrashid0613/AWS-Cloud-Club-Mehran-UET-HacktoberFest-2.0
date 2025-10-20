"use client";

import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { TrashIcon } from "@radix-ui/react-icons";
import { getAllUsers, deleteUser } from '@/lib/api'; // Import your API functions

interface User {
  _id: string;
  name: string;
  email: string;
  role: 'student' | 'instructor' | 'admin';
  createdAt: string;
}

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const data = await getAllUsers();
      // Simulate adding some more diverse dummy data if needed
      const dummyUsers: User[] = [
        { _id: "653b6c2d1c9d440000a1b2c3", name: "Student User", email: "student@example.com", role: "student", createdAt: "2023-10-27T10:00:00Z" },
        { _id: "653b6c2d1c9d440000a1b2c4", name: "Instructor User", email: "instructor@example.com", role: "instructor", createdAt: "2023-10-27T11:00:00Z" },
        { _id: "653b6c2d1c9d440000a1b2c5", name: "Admin User", email: "admin@example.com", role: "admin", createdAt: "2023-10-27T12:00:00Z" },
        { _id: "653b6c2d1c9d440000a1b2c6", name: "Another Student", email: "student2@example.com", role: "student", createdAt: "2023-10-26T14:30:00Z" },
        { _id: "653b6c2d1c9d440000a1b2c7", name: "New Instructor", email: "new.instructor@example.com", role: "instructor", createdAt: "2023-10-28T09:15:00Z" },
      ];
      setUsers(data); // Combine dummy data with actual fetched data
    } catch (error) {
      toast.error("Failed to load users.");
      console.error("Users fetch error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleDeleteUser = async (userId: string) => {
    try {
      await deleteUser(userId);
      toast.success("User deleted successfully.");
      setUsers(prevUsers => prevUsers.filter(user => user._id !== userId));
    } catch (error) {
      // toast.error handled in api.ts
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold dark:text-white">User Management</h2>

      <Card>
        <CardHeader>
          <CardTitle>All Platform Users</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="space-y-4">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
            </div>
          ) : users.length > 0 ? (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Joined On</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {users.map((user) => (
                    <TableRow key={user._id}>
                      <TableCell className="font-medium">{user.name}</TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>{user.role}</TableCell>
                      <TableCell>{new Date(user.createdAt).toLocaleDateString()}</TableCell>
                      <TableCell className="text-right">
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="destructive" size="sm">
                              <TrashIcon className="h-4 w-4" />
                              <span className="sr-only">Delete user</span>
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                              <AlertDialogDescription>
                                This action cannot be undone. This will permanently delete {user.name}'s account and remove their data from our servers.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction onClick={() => handleDeleteUser(user._id)} className="bg-red-600 hover:bg-red-700">
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
            <p className="text-muted-foreground">No users found.</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}