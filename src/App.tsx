
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Sidebar } from "./components/layout/Sidebar";
import HomePage from "./pages/HomePage";
import Index from "./pages/Index";
import { Reports } from "./pages/Reports";
import { Settings } from "./pages/Settings";
import NotFound from "./pages/NotFound";
import { IncomeForm } from "./components/forms/IncomeForm";
import { ExpenseForm } from "./components/forms/ExpenseForm";
import { TenantList } from "./components/tenants/TenantList";
import { LoginForm } from "./components/auth/LoginForm";
import { RegisterForm } from "./components/auth/RegisterForm";
import { TenantForm } from "./components/forms/TenantForm";

const queryClient = new QueryClient();

// Layout component for dashboard pages
const DashboardLayout = ({ children }: { children: React.ReactNode }) => (
  <div className="min-h-screen bg-gray-50">
    <Sidebar />
    <div className="md:ml-16">
      {children}
    </div>
  </div>
);

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          {/* Public pages */}
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginForm />} />
          <Route path="/register" element={<RegisterForm />} />
          
          {/* Dashboard pages with sidebar */}
          <Route path="/dashboard" element={<DashboardLayout><Index /></DashboardLayout>} />
          <Route path="/dashboard/income" element={<DashboardLayout><IncomeForm /></DashboardLayout>} />
          <Route path="/dashboard/expenses" element={<DashboardLayout><ExpenseForm /></DashboardLayout>} />
          <Route path="/dashboard/tenants" element={<DashboardLayout><TenantList /></DashboardLayout>} />
          <Route path="/dashboard/add-tenant" element={<DashboardLayout><TenantForm /></DashboardLayout>} />
          <Route path="/dashboard/reports" element={<DashboardLayout><Reports /></DashboardLayout>} />
          <Route path="/dashboard/settings" element={<DashboardLayout><Settings /></DashboardLayout>} />
          
          {/* 404 route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
