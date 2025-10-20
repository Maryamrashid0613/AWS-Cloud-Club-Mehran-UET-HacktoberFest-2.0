import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Predicting Patient Hospital Readmission Risk | AI/ML Healthcare Analytics",
  description: "AI-powered 3D hospital environment for predicting 30-day patient readmission risk using Machine Learning and Claude AI. Built with Next.js, React Three Fiber, and AWS Bedrock for data science and healthcare analytics.",
  keywords: ["hospital readmission", "healthcare AI", "machine learning", "patient risk prediction", "data science", "AWS Bedrock", "Claude AI", "30-day readmission", "healthcare analytics", "3D visualization"],
  authors: [{ name: "Healthcare AI Team" }],
  openGraph: {
    title: "Predicting Patient Hospital Readmission Risk",
    description: "AI-powered hospital readmission prediction with 3D visualization",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="bg-black">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
        <Toaster 
          position="top-right"
          richColors
          closeButton
          theme="dark"
          toastOptions={{
            className: 'bg-gray-900 border-gray-700 text-white',
          }}
        />
      </body>
    </html>
  );
}
