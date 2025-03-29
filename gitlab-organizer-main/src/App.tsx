import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import { GitlabProvider } from "./contexts/GitlabContext";
import Index from "./pages/Index";
import GitConnect from "./pages/GitConnect";
import GitLabDemo from "./pages/GitLabDemo";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <GitlabProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Layout><Index /></Layout>} />
            <Route path="/git-connect" element={<Layout><GitConnect /></Layout>} />
            <Route path="/gitlab-demo" element={<Layout><GitLabDemo /></Layout>} />
            <Route path="*" element={<Layout><NotFound /></Layout>} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </GitlabProvider>
  </QueryClientProvider>
);

export default App;
