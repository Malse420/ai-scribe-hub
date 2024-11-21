import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AIAssistantProvider } from "@/contexts/AIAssistantContext";
import Sidebar from "./components/Layout/Sidebar";
import Header from "./components/Layout/Header";
import Index from "./pages/Index";
import ChatInterface from "./components/Chat/ChatInterface";
import DevPanel from "./components/DevTools/DevPanel";
import SettingsPage from "./components/Settings/SettingsPage";
import { WorkflowList } from "./components/Workflows/WorkflowList";
import { AnalyticsDashboard } from "./components/Analytics/AnalyticsDashboard";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AIAssistantProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <div className="min-h-screen">
            <Sidebar />
            <div className="ml-64">
              <Header />
              <main className="pt-16">
                <Routes>
                  <Route path="/" element={<Index />} />
                  <Route path="/chat" element={<ChatInterface />} />
                  <Route path="/devtools" element={<DevPanel />} />
                  <Route path="/settings" element={<SettingsPage />} />
                  <Route path="/workflows" element={<WorkflowList />} />
                  <Route path="/analytics" element={<AnalyticsDashboard />} />
                </Routes>
              </main>
            </div>
          </div>
        </BrowserRouter>
      </TooltipProvider>
    </AIAssistantProvider>
  </QueryClientProvider>
);

export default App;