
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Beats from "./pages/Beats";
import Remixes from "./pages/Remixes";
import CoverArt from "./pages/CoverArt";
import About from "./pages/About";
import NotFound from "./pages/NotFound";
import CustomCursor from "./components/effects/CustomCursor";
import UIEffects from "./components/effects/UIEffects";
import ButtonEffects from "./components/effects/ButtonEffects";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <CustomCursor />
        <UIEffects />
        <ButtonEffects />
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/beats" element={<Beats />} />
          <Route path="/remixes" element={<Remixes />} />
          <Route path="/cover-art" element={<CoverArt />} />
          <Route path="/about" element={<About />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
