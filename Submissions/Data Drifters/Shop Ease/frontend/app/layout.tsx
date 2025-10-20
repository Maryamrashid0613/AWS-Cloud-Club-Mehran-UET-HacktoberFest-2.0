import type React from "react"
import type { Metadata } from "next"
import { GeistSans } from "geist/font/sans"
import { Playfair_Display } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import { Suspense } from "react"
import "./globals.css"
import "./theme.css"
import { AuthProvider } from "@/contexts/AuthContext"
import { Toaster } from "sonner" // ✅ correct import

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
})

export const metadata: Metadata = {
  title: "Shop Ease - Your Ultimate Inventory Solution",
  description: "Created By Saim Malik",
  generator: "",
  icons: {
    icon: "/images/logo.png",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${GeistSans.variable} ${playfair.variable}`}>

      <body className="font-sans antialiased">
        <Toaster richColors position="top-right" />
            <AuthProvider>{children}</AuthProvider>
        {/* <Suspense fallback={null}>{children}</Suspense>
        <Analytics /> */}
      </body>
    </html>
  )
}
