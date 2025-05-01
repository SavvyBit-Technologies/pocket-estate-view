
import { useState } from "react";
import { Home, DollarSign, Receipt, FileText, Users, Settings, Menu, X, List, LogOut, CreditCard, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: Home },
  { name: "Income", href: "/dashboard/income", icon: DollarSign },
  { name: "Expenses", href: "/dashboard/expenses", icon: Receipt },
  { name: "Transactions", href: "/dashboard/transactions", icon: List },
  { name: "Create Payment", href: "/dashboard/create-payment", icon: CreditCard },
  { name: "Payment Issues", href: "/dashboard/payment-issues", icon: AlertCircle },
  { name: "Reports", href: "/dashboard/reports", icon: FileText },
  { name: "Tenants", href: "/dashboard/tenants", icon: Users },
  { name: "Settings", href: "/dashboard/settings", icon: Settings },
];

export function Sidebar() {
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { logout, user } = useAuth();
  
  return (
    <>
      {/* Mobile menu toggle */}
      <div className="fixed top-4 left-4 z-50 md:hidden">
        <Button
          variant="outline"
          size="icon"
          className="bg-white shadow-md"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
        >
          {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </Button>
      </div>
      
      {/* Desktop sidebar */}
      <div className={cn(
        "hidden md:flex h-screen w-16 flex-col fixed left-0 top-0 bottom-0 bg-gray-900 text-white p-2",
        "transition-transform duration-300 ease-in-out",
      )}>
        <SidebarContent location={location} logout={logout} user={user} />
      </div>
      
      {/* Mobile sidebar */}
      <div className={cn(
        "md:hidden fixed inset-0 z-40 bg-gray-900/50 backdrop-blur-sm",
        mobileMenuOpen ? "block" : "hidden"
      )}
      onClick={() => setMobileMenuOpen(false)}
      />
      
      <div className={cn(
        "md:hidden fixed left-0 top-0 bottom-0 z-40 w-64 bg-gray-900 text-white p-4",
        "transition-transform duration-300 ease-in-out",
        mobileMenuOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <SidebarContent location={location} onItemClick={() => setMobileMenuOpen(false)} logout={logout} user={user} />
      </div>
    </>
  );
}

function SidebarContent({ 
  location, 
  onItemClick,
  logout,
  user
}: { 
  location: { pathname: string }, 
  onItemClick?: () => void,
  logout: () => void,
  user: { username: string, estate: string } | null
}) {
  return (
    <>
      <div className="flex items-center justify-center mb-8">
        <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center">
          <Home className="w-5 h-5 text-white" />
        </div>
      </div>
      
      {user && (
        <div className="hidden md:hidden mb-4 px-2">
          <div className="text-white font-medium">{user.username}</div>
          <div className="text-gray-400 text-sm">{user.estate}</div>
        </div>
      )}
      
      <nav className="flex-1 space-y-1">
        {navigation.map((item) => (
          <Link 
            key={item.name} 
            to={item.href}
            onClick={onItemClick}
            title={item.name}
          >
            <Button
              variant="ghost"
              className={cn(
                "w-full justify-center gap-2 text-gray-300 hover:text-white hover:bg-gray-800 p-2",
                location.pathname === item.href && "bg-green-600 text-white hover:bg-green-700"
              )}
            >
              <item.icon className="w-5 h-5" />
              <span className="sr-only md:not-sr-only md:hidden">{item.name}</span>
            </Button>
          </Link>
        ))}
      </nav>
      
      <div className="mt-auto pt-4 border-t border-gray-800">
        <Button 
          variant="ghost" 
          className="w-full justify-center gap-2 text-gray-300 hover:text-white hover:bg-gray-800"
          title="Logout"
          onClick={() => { 
            logout();
            if (onItemClick) onItemClick();
          }}
        >
          <LogOut className="w-5 h-5" />
          <span className="sr-only md:not-sr-only md:hidden">Logout</span>
        </Button>
      </div>
    </>
  );
}
