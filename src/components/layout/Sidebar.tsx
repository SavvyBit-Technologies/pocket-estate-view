
import { Home, DollarSign, Receipt, FileText, Users, Settings } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Link, useLocation } from "react-router-dom";

const navigation = [
  { name: "Dashboard", href: "/", icon: Home },
  { name: "Income", href: "/income", icon: DollarSign },
  { name: "Expenses", href: "/expenses", icon: Receipt },
  { name: "Reports", href: "/reports", icon: FileText },
  { name: "Tenants", href: "/tenants", icon: Users },
  { name: "Settings", href: "/settings", icon: Settings },
];

export function Sidebar() {
  const location = useLocation();
  
  return (
    <div className="hidden md:flex h-screen w-64 flex-col fixed left-0 top-0 bottom-0 bg-gray-900 text-white p-4">
      <div className="flex items-center gap-2 mb-8">
        <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center">
          <Home className="w-5 h-5 text-white" />
        </div>
        <h1 className="text-lg font-semibold">ESTATE ACCOUNTING</h1>
      </div>
      
      <nav className="flex-1 space-y-1">
        {navigation.map((item) => (
          <Link key={item.name} to={item.href}>
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
    </div>
  );
}
