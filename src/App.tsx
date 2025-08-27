import { useEffect, useState } from "react";
import { Routes, Route, BrowserRouter } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { Header } from "@/components/Header";
import { Dashboard } from "@/pages/shop/Dashboard";
import { Hangers } from "@/pages/shop/Hangers";
import Packages from "@/pages/shop/Packages";
import Scheduler from "@/pages/shop/Scheduler";
import WorkOrders from "@/pages/shop/WorkOrders";
import Kitting from "@/pages/shop/Kitting";
import QA from "@/pages/shop/QA";
import Shipping from "@/pages/shop/Shipping";
import Analytics from "@/pages/shop/Analytics";
import { bootstrapOnce } from "@/lib/bootstrap";

const queryClient = new QueryClient();

const App = () => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    bootstrapOnce().finally(() => setIsLoading(false));
  }, []);

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

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <BrowserRouter>
          <SidebarProvider>
          <div className="min-h-screen flex w-full bg-background">
            <AppSidebar />
            <div className="flex-1 flex flex-col">
              <Header />
              <main className="flex-1 p-6">
                <Routes>
                  <Route path="/" element={<Dashboard />} />
                  <Route path="/shop/dashboard" element={<Dashboard />} />
                  <Route path="/shop/hangers" element={<Hangers />} />
                  <Route path="/shop/packages" element={<Packages />} />
                  <Route path="/shop/scheduler" element={<Scheduler />} />
                  <Route path="/shop/work-orders" element={<WorkOrders />} />
                  <Route path="/shop/kitting" element={<Kitting />} />
                  <Route path="/shop/qa" element={<QA />} />
                  <Route path="/shop/shipping" element={<Shipping />} />
                  <Route path="/shop/analytics" element={<Analytics />} />
                  <Route path="*" element={<div className="text-center text-muted-foreground">Page under construction</div>} />
                </Routes>
              </main>
            </div>
          </div>
        </SidebarProvider>
        </BrowserRouter>
        <Toaster />
        <Sonner />
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;