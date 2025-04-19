import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MessageCircle, Search, UserPlus, Phone, Mail, Home } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

const tenants = [
  { 
    id: 1, 
    name: "John Doe", 
    house: "A1", 
    status: "Active", 
    balance: "50,000",
    email: "john@example.com",
    phone: "+234 800 123 4567",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=John"
  },
  { 
    id: 2, 
    name: "Jane Smith", 
    house: "B2", 
    status: "Active", 
    balance: "0",
    email: "jane@example.com",
    phone: "+234 800 123 4568",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Jane"
  },
  { 
    id: 3, 
    name: "Mike Johnson", 
    house: "C3", 
    status: "Pending", 
    balance: "25,000",
    email: "mike@example.com",
    phone: "+234 800 123 4569",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Mike"
  },
];

export function TenantList() {
  const navigate = useNavigate();
  
  return (
    <div className="p-6">
      <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold">Tenants</h1>
        <div className="flex gap-2 w-full md:w-auto">
          <div className="relative flex-1 md:w-64">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search tenants..." className="pl-8" />
          </div>
          <Link to="/dashboard/add-tenant">
            <Button className="gap-2">
              <UserPlus className="h-4 w-4" />
              Add Tenant
            </Button>
          </Link>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {tenants.map((tenant) => (
          <Card key={tenant.id} className="relative overflow-hidden">
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-4">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={tenant.avatar} />
                    <AvatarFallback>{tenant.name[0]}</AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-semibold">{tenant.name}</h3>
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Home className="mr-1 h-3 w-3" />
                      {tenant.house}
                    </div>
                  </div>
                </div>
                <Badge
                  variant={tenant.status === "Active" ? "success" : "warning"}
                  className="absolute top-4 right-4"
                >
                  {tenant.status}
                </Badge>
              </div>
              
              <div className="mt-4 space-y-2">
                <div className="flex items-center text-sm">
                  <Mail className="mr-2 h-4 w-4 text-muted-foreground" />
                  {tenant.email}
                </div>
                <div className="flex items-center text-sm">
                  <Phone className="mr-2 h-4 w-4 text-muted-foreground" />
                  {tenant.phone}
                </div>
                <div className="mt-4 flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Balance</p>
                    <p className="font-semibold">₦{tenant.balance}</p>
                  </div>
                  <Button variant="ghost" size="icon">
                    <MessageCircle className="h-5 w-5" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
