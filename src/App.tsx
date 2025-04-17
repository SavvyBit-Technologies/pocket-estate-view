
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Sidebar } from "./components/layout/Sidebar";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import { IncomeForm } from "./components/forms/IncomeForm";
import { ExpenseForm } from "./components/forms/ExpenseForm";
import { TenantList } from "./components/tenants/TenantList";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <div className="min-h-screen bg-gray-50">
          <Sidebar />
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/income" element={<IncomeForm />} />
            <Route path="/expenses" element={<ExpenseForm />} />
            <Route path="/tenants" element={<TenantList />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </div>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
