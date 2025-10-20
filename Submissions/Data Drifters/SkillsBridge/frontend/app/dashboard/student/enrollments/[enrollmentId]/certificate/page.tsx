// src/app/(dashboard)/student/enrollments/[enrollmentId]/certificate/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { studentDashboard } from '@/lib/student/api';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { Download, Printer } from 'lucide-react';
import Link from 'next/link';

export const dynamic = 'force-dynamic'; // Ensure dynamic rendering

export default function CertificatePage({ params }: { params: { enrollmentId: string } }) {
  const { enrollmentId } = params;
  const router = useRouter();
  const [certificateUrl, setCertificateUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCertificate = async () => {
      if (!enrollmentId) return;

      try {
        setLoading(true);
        const response = await studentDashboard.generateCertificate(enrollmentId);
        const blob = new Blob([response.data], { type: response.headers['content-type'] });
        const url = URL.createObjectURL(blob);
        setCertificateUrl(url);
        toast.success('Certificate generated successfully!');
      } catch (err: any) {
        setError(err.response?.data?.message || 'Failed to generate certificate.');
        toast.error('Failed to generate certificate. Please try again.');
        router.push('/student/enrollments'); // Redirect if certificate generation fails
      } finally {
        setLoading(false);
      }
    };

    fetchCertificate();

    // Clean up the object URL when the component unmounts
    return () => {
      if (certificateUrl) {
        URL.revokeObjectURL(certificateUrl);
      }
    };
  }, [enrollmentId]); // Dependency array includes enrollmentId

  const handlePrint = () => {
    if (certificateUrl) {
      const printWindow = window.open(certificateUrl, '_blank');
      if (printWindow) {
        printWindow.onload = () => {
          printWindow.print();
        };
      } else {
        toast.error('Could not open print window. Please check your browser settings.');
      }
    } else {
      toast.error('Certificate not available for printing.');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-full">
        <p>Generating your certificate...</p>
      </div>
    );
  }

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  if (!certificateUrl) {
    return (
      <Card className="max-w-xl mx-auto text-center p-8">
        <CardHeader>
          <CardTitle>Certificate Not Available</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">We could not retrieve your certificate. It might not be available or the course is not yet marked as completed.</p>
          <Button asChild className="mt-4">
            <Link href="/student/enrollments">Back to My Enrollments</Link>
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card className="max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl">Your Course Completion Certificate!</CardTitle>
          <CardDescription>Congratulations on completing your course!</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="border p-2 rounded-lg bg-gray-50 dark:bg-gray-900 flex justify-center items-center">
            {/* Display the certificate image (if it's an image) or a PDF embed/link */}
            {/* For a PDF, you might use an iframe or just rely on the download link */}
            <iframe
              src={certificateUrl}
              width="100%"
              height="600px"
              className="border-none"
              title="Course Certificate"
            >
              Your browser does not support iframes. You can <a href={certificateUrl} download>download the certificate</a>.
            </iframe>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild>
              <a href={certificateUrl} download="SkillBridge_Certificate.pdf">
                <Download className="mr-2 h-4 w-4" /> Download Certificate
              </a>
            </Button>
            <Button variant="outline" onClick={handlePrint}>
              <Printer className="mr-2 h-4 w-4" /> Print Certificate
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}