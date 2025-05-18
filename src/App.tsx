import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { HashRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/context/AuthContext";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import Beats from "./pages/Beats";
import Remixes from "./pages/Remixes";
import CoverArt from "./pages/CoverArt";
import About from "./pages/About";
import NotFound from "./pages/NotFound";
import Dashboard from "./pages/Dashboard";
import UIEffects from "./components/effects/UIEffects";
import ButtonEffects from "./components/effects/ButtonEffects";
import { PageLayout } from "./components/layout/PageLayout";

// Create a more robust RequireAuth component
const RequireAuth = ({ children }: { children: JSX.Element }) => {
  // Use localStorage to check if a session exists as a first quick check
  const storedSession = localStorage.getItem('sb-rjucdyyuowpebzbuixcu-auth-token');
  
  // If we don't have a session stored, redirect to auth
  if (!storedSession) {
    console.log("No session in localStorage, redirecting to auth");
    return <Navigate to="/auth" replace />;
  }
  
  // Otherwise render the protected content
  return children;
};

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <Toaster />
        <Sonner />
        {/* Using HashRouter to avoid security errors in iframe environment */}
        <HashRouter>
          <UIEffects />
          <ButtonEffects />
          <Routes>
            {/* Public routes with layout */}
            <Route path="/" element={<PageLayout><Index /></PageLayout>} />
            <Route path="/beats" element={<PageLayout><Beats /></PageLayout>} />
            <Route path="/remixes" element={<PageLayout><Remixes /></PageLayout>} />
            <Route path="/cover-art" element={<PageLayout><CoverArt /></PageLayout>} />
            <Route path="/about" element={<PageLayout><About /></PageLayout>} />
            
            {/* Auth routes */}
            <Route path="/auth" element={<Auth />} />
            
            {/* Protected routes (no layout needed, they have their own) */}
            <Route 
              path="/dashboard" 
              element={
                <RequireAuth>
                  <Dashboard />
                </RequireAuth>
              } 
            />
            
            {/* 404 route */}
            <Route path="*" element={<PageLayout><NotFound /></PageLayout>} />
          </Routes>
        </HashRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
