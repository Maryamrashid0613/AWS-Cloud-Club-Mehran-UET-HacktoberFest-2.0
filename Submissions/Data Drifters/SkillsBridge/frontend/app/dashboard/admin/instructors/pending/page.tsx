"use client";

import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { CheckCircledIcon, CrossCircledIcon } from "@radix-ui/react-icons";
import { getPendingInstructors, approveInstructor, rejectInstructor } from '@/lib/api';

interface Instructor {
  _id: string;
  name: string;
  email: string;
  isApproved: boolean;
  createdAt: string;
}

export default function PendingInstructorsPage() {
  const [instructors, setInstructors] = useState<Instructor[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchInstructors = async () => {
    setLoading(true);
    try {
      const data = await getPendingInstructors();
      // Filter for those not approved yet if the backend returns all instructors
      setInstructors(data.filter(inst => !inst.isApproved));
    } catch (error) {
      toast.error("Failed to load pending instructors.");
      console.error("Pending instructors fetch error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInstructors();
  }, []);

  const handleApprove = async (id: string) => {
    try {
      await approveInstructor(id);
      toast.success(`Instructor ${id} approved.`);
      setInstructors(prev => prev.filter(inst => inst._id !== id));
    } catch (error) {
      // toast.error handled in api.ts
    }
  };

  const handleReject = async (id: string) => {
    try {
      await rejectInstructor(id);
      toast.info(`Instructor ${id} rejected.`); // Using toast.info for rejection
      setInstructors(prev => prev.filter(inst => inst._id !== id));
    } catch (error) {
      // toast.error handled in api.ts
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold dark:text-white">Pending Instructor Applications</h2>

      <Card>
        <CardHeader>
          <CardTitle>Instructors Awaiting Approval</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="space-y-4">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
            </div>
          ) : instructors.length > 0 ? (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Applied On</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {instructors.map((instructor) => (
                    <TableRow key={instructor._id}>
                      <TableCell className="font-medium">{instructor.name}</TableCell>
                      <TableCell>{instructor.email}</TableCell>
                      <TableCell>{new Date(instructor.date ||instructor.createdAt ).toLocaleDateString()}</TableCell>
                      <TableCell className="text-right space-x-2">
                        <Button variant="outline" size="sm" onClick={() => handleApprove(instructor._id)}>
                          <CheckCircledIcon className="mr-2" /> Approve
                        </Button>
                        <Button variant="destructive" size="sm" onClick={() => handleReject(instructor._id)}>
                          <CrossCircledIcon className="mr-2" /> Reject
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <p className="text-muted-foreground">No pending instructor applications.</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}