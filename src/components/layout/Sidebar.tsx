
import { useState } from "react";
import { Home, DollarSign, Receipt, FileText, Users, Settings, Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Link, useLocation } from "react-router-dom";

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: Home },
  { name: "Income", href: "/dashboard/income", icon: DollarSign },
  { name: "Expenses", href: "/dashboard/expenses", icon: Receipt },
  { name: "Reports", href: "/dashboard/reports", icon: FileText },
  { name: "Tenants", href: "/dashboard/tenants", icon: Users },
  { name: "Settings", href: "/dashboard/settings", icon: Settings },
];

export function Sidebar() {
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
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
        "hidden md:flex h-screen w-64 flex-col fixed left-0 top-0 bottom-0 bg-gray-900 text-white p-4",
        "transition-transform duration-300 ease-in-out",
      )}>
        <SidebarContent location={location} />
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
        <SidebarContent location={location} onItemClick={() => setMobileMenuOpen(false)} />
      </div>
    </>
  );
}

function SidebarContent({ location, onItemClick }: { location: { pathname: string }, onItemClick?: () => void }) {
  return (
    <>
      <div className="flex items-center gap-2 mb-8">
        <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center">
          <Home className="w-5 h-5 text-white" />
        </div>
        <h1 className="text-lg font-semibold">ESTATE ACCOUNTING</h1>
      </div>
      
      <nav className="flex-1 space-y-1">
        {navigation.map((item) => (
          <Link 
            key={item.name} 
            to={item.href}
            onClick={onItemClick}
          >
            <Button
              variant="ghost"
              className={cn(
                "w-full justify-start gap-2 text-gray-300 hover:text-white hover:bg-gray-800",
                location.pathname === item.href && "bg-green-600 text-white hover:bg-green-700"
              )}
            >
              <item.icon className="w-5 h-5" />
              {item.name}
            </Button>
          </Link>
        ))}
      </nav>
      
      <div className="mt-auto pt-4 border-t border-gray-800">
        <Link to="/">
          <Button variant="ghost" className="w-full justify-start gap-2 text-gray-300 hover:text-white hover:bg-gray-800">
            <Home className="w-5 h-5" />
            Back to Home
          </Button>
        </Link>
      </div>
    </>
  );
}
