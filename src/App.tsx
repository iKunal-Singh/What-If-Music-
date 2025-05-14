
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/context/AuthContext";
import { useEffect } from "react";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import Beats from "./pages/Beats";
import Remixes from "./pages/Remixes";
import CoverArt from "./pages/CoverArt";
import About from "./pages/About";
import NotFound from "./pages/NotFound";
import UIEffects from "./components/effects/UIEffects";
import ButtonEffects from "./components/effects/ButtonEffects";

const queryClient = new QueryClient();

// Initialize theme based on local storage or system preference
const initializeTheme = () => {
  // Check for user preference in localStorage
  const userTheme = localStorage.getItem("theme");
  const root = window.document.documentElement;
  
  if (userTheme === "dark") {
    root.classList.add("dark");
  } else if (userTheme === "light") {
    root.classList.add("light");
  } else {
    // Use system preference as default if no user preference
    const systemPreference = window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light";
    root.classList.add(systemPreference);
  }
};

const App = () => {
  // Initialize theme on first render
  useEffect(() => {
    initializeTheme();
  }, []);
  
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <AuthProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <UIEffects />
            <ButtonEffects />
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/auth" element={<Auth />} />
              <Route path="/beats" element={<Beats />} />
              <Route path="/remixes" element={<Remixes />} />
              <Route path="/cover-art" element={<CoverArt />} />
              <Route path="/about" element={<About />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </AuthProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
