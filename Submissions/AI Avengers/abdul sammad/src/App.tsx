import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
<<<<<<< HEAD
import { Routes, Route, Navigate } from "react-router-dom";
import { SignIn, SignUp, SignedIn, SignedOut } from "@clerk/clerk-react";
=======
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
>>>>>>> 58fa215ceb2a7ab7bcd7c9ea7434e7ec0a3f8ff6
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import NotFound from "./pages/NotFound";

const PublicPage = () => (
  <div className="flex min-h-screen flex-col items-center justify-center">
    <SignIn routing="path" path="/sign-in" />
  </div>
);

const SignUpPage = () => (
  <div className="flex min-h-screen flex-col items-center justify-center">
    <SignUp routing="path" path="/sign-up" />
  </div>
);

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? <>{children}</> : <Navigate to="/auth" />;
};

const App = () => (
<<<<<<< HEAD
  <TooltipProvider>
    <Toaster />
    <Sonner />
    <Routes>
      <Route
        path="/"
        element={
          <>
            <SignedIn>
              <Index />
            </SignedIn>
            <SignedOut>
              <Navigate to="/sign-in" replace />
            </SignedOut>
          </>
        }
      />
      <Route path="/sign-in/*" element={<PublicPage />} />
      <Route path="/sign-up/*" element={<SignUpPage />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  </TooltipProvider>
=======
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/auth" element={<Auth />} />
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <Index />
                </ProtectedRoute>
              }
            />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
>>>>>>> 58fa215ceb2a7ab7bcd7c9ea7434e7ec0a3f8ff6
);

export default App;
