import { useEffect, useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { Header } from "@/components/Header";
import { PersonaAuth } from "@/components/PersonaAuth";
import { Dashboard } from "@/pages/shop/Dashboard";
import { Hangers } from "@/pages/shop/Hangers";
import Packages from "@/pages/shop/Packages";
import Scheduler from "@/pages/shop/Scheduler";
import WorkOrders from "@/pages/shop/WorkOrders";
import Kitting from "@/pages/shop/Kitting";
import QA from "@/pages/shop/QA";
import Shipping from "@/pages/shop/Shipping";
import Analytics from "@/pages/shop/Analytics";
import ProjectsIndex from "@/pages/projects/Index";
import ProjectDetail from "@/pages/projects/Detail";
import CommandCenter from "@/pages/shop/CommandCenter";
import CommandCenterReview from "@/pages/shop/command-center/Review";
import CommandCenterInventory from "@/pages/shop/command-center/Inventory";
import CommandCenterAssignment from "@/pages/shop/command-center/Assignment";
import CommandCenterExceptions from "@/pages/shop/command-center/Exceptions";
import CommandCenterProduction from "@/pages/shop/command-center/Production";
import TeamHome from "@/pages/shop/Team";
import TaskRunner from "@/pages/shop/TaskRunner";
import InventoryIndex from "@/pages/inventory/Index";
import FieldReceiving from "@/pages/field/Receiving";
import ExecutiveAnalytics from "@/pages/analytics/Executive";
import { bootstrapOnce } from "@/lib/bootstrap";
import { useDB } from "@/store/db";
import type { PersonaType } from "@/store/db";
import { Sidebar } from "@/components/layout/Sidebar";
import Omnibar from "@/components/ui/Omnibar";
import { Sun, Moon } from 'lucide-react';

const queryClient = new QueryClient();

function ThemeToggle(){
  function toggle(){
    const d = document.documentElement
    const isDark = d.classList.toggle('dark')
    localStorage.setItem('theme', isDark ? 'dark' : 'light')
  }
  
  // Initialize theme on component mount
  useEffect(() => {
    const theme = localStorage.getItem('theme')
    const systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches
    const shouldBeDark = theme === 'dark' || (!theme && systemDark)
    
    document.documentElement.classList.toggle('dark', shouldBeDark)
  }, [])
  
  return <button onClick={toggle} title="Toggle theme" className="p-2 rounded-full hover:bg-accent/10 text-muted-foreground hover:text-foreground transition-colors">
    <Sun className="w-4 h-4 hidden dark:block"/><Moon className="w-4 h-4 block dark:hidden"/>
    <span className="sr-only">Toggle theme</span>
  </button>
}

const App = () => {
  const [isLoading, setIsLoading] = useState(true);
  const { currentUser, loginAs, activeProjectId, projects } = useDB();

  useEffect(() => {
    bootstrapOnce();
    setIsLoading(false);
  }, []);

  const handleLogin = (persona: PersonaType) => {
    loginAs(persona);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading MSUITE Fab & Field...</p>
        </div>
      </div>
    );
  }

  if (!currentUser) {
    return (
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <PersonaAuth onLogin={handleLogin} />
        </TooltipProvider>
      </QueryClientProvider>
    );
  }

  const active = projects.find(p=>p.id===activeProjectId);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <div className="min-h-screen bg-background text-foreground flex">
          <Sidebar/>

          <div className="flex-1 flex flex-col">
            <header className="h-14 border-b border-border flex items-center justify-between px-4 bg-card">
              <div className="font-semibold text-card-foreground">DEWALT • Hanger Fab & Field</div>
              <div className="flex items-center gap-3">
                {active ? <span className="text-xs px-2 py-1 rounded bg-accent/10 border border-accent/20 text-accent-foreground">Scoped: {active.id}</span> : null}
                <ThemeToggle/>
              </div>
            </header>

            <main className="flex-1 p-4 bg-background">
              <Routes>
                <Route path="/" element={<Navigate to="/projects" replace />} />
                <Route path="/projects" element={<ProjectsIndex />} />
                <Route path="/projects/:projectId" element={<ProjectDetail />} />
                <Route path="/shop/dashboard" element={<Dashboard />} />
                <Route path="/shop/hangers" element={<Hangers />} />
                <Route path="/shop/packages" element={<Packages />} />
                <Route path="/shop/scheduler" element={<Scheduler />} />
                <Route path="/shop/work-orders" element={<WorkOrders />} />
                <Route path="/shop/kitting" element={<Kitting />} />
                <Route path="/shop/qa" element={<QA />} />
                <Route path="/shop/shipping" element={<Shipping />} />
                <Route path="/shop/analytics" element={<Analytics />} />
                 <Route path="/shop/command-center" element={<CommandCenter />} />
                 <Route path="/shop/command-center/review" element={<CommandCenterReview />} />
                 <Route path="/shop/command-center/inventory" element={<CommandCenterInventory />} />
                 <Route path="/shop/command-center/assignment" element={<CommandCenterAssignment />} />
                 <Route path="/shop/command-center/exceptions" element={<CommandCenterExceptions />} />
                 <Route path="/shop/command-center/production" element={<CommandCenterProduction />} />
                 <Route path="/shop/manager" element={<Navigate to="/shop/command-center" replace />} />
                <Route path="/shop/team" element={<TeamHome />} />
                <Route path="/shop/task/:assignmentId" element={<TaskRunner />} />
                <Route path="/inventory" element={<InventoryIndex />} />
                <Route path="/field/receiving" element={<FieldReceiving />} />
                <Route path="/analytics/executive" element={<ExecutiveAnalytics />} />
                <Route path="*" element={<div className="text-center text-muted-foreground">Page under construction</div>} />
              </Routes>
            </main>
          </div>

          <Omnibar/>
        </div>
      <Toaster />
      <Sonner />
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;