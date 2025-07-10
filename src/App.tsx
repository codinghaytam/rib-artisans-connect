
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import SupabaseStatusProvider from "@/contexts/SupabaseStatusProvider";
import Index from "./pages/Index";
import Contact from "./pages/Contact";
import Artisans from "./pages/Artisans";
import ArtisanProfile from "./pages/ArtisanProfile";
import Categories from "./pages/Categories";
import BecomeArtisan from "./pages/BecomeArtisan";
import Profile from "./pages/Profile";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <SupabaseStatusProvider>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/artisans" element={<Artisans />} />
              <Route path="/artisan/:id" element={<ArtisanProfile />} />
              <Route path="/categories" element={<Categories />} />
              <Route path="/become-artisan" element={<BecomeArtisan />} />
              <Route path="/profile" element={<Profile />} />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </AuthProvider>
    </SupabaseStatusProvider>
  </QueryClientProvider>
);

export default App;
