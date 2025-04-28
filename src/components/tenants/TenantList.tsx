
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
import { useQuery } from "@tanstack/react-query";
import { apiService } from "@/services/api";
import { useState } from "react";

interface Tenant {
  tenant_id: number;
  full_name: string;
  house_number: string;
  email?: string;
  phone?: string;
  status?: string;
  balance?: string;
}

export function TenantList() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  
  const { data, isLoading, error } = useQuery({
    queryKey: ["tenants"],
    queryFn: apiService.fetchTenants,
  });

  const tenants: Tenant[] = data?.tenants || [];
  
  // Filter tenants based on search query
  const filteredTenants = tenants.filter(tenant => 
    tenant.full_name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    tenant.house_number.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  return (
    <div className="p-6">
      <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold">Tenants</h1>
        <div className="flex gap-2 w-full md:w-auto">
          <div className="relative flex-1 md:w-64">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Search tenants..." 
              className="pl-8" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Link to="/dashboard/add-tenant">
            <Button className="gap-2">
              <UserPlus className="h-4 w-4" />
              Add Tenant
            </Button>
          </Link>
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
        </div>
      ) : error ? (
        <Card>
          <CardContent className="p-6">
            <div className="text-center text-red-500">
              Failed to load tenants. Please try again.
            </div>
          </CardContent>
        </Card>
      ) : filteredTenants.length === 0 ? (
        <Card>
          <CardContent className="p-6">
            <div className="text-center text-muted-foreground">
              {searchQuery ? "No tenants match your search." : "No tenants found. Add your first tenant!"}
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredTenants.map((tenant) => (
            <Card key={tenant.tenant_id} className="relative overflow-hidden">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-4">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${tenant.full_name}`} />
                      <AvatarFallback>{tenant.full_name[0]}</AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="font-semibold">{tenant.full_name}</h3>
                      <div className="flex items-center text-sm text-muted-foreground">
                        <Home className="mr-1 h-3 w-3" />
                        {tenant.house_number}
                      </div>
                    </div>
                  </div>
                  <Badge
                    variant="outline"
                    className="absolute top-4 right-4"
                  >
                    Active
                  </Badge>
                </div>
                
                {tenant.email && (
                  <div className="mt-4 flex items-center text-sm">
                    <Mail className="mr-2 h-4 w-4 text-muted-foreground" />
                    {tenant.email}
                  </div>
                )}
                
                {tenant.phone && (
                  <div className="flex items-center text-sm">
                    <Phone className="mr-2 h-4 w-4 text-muted-foreground" />
                    {tenant.phone}
                  </div>
                )}
                
                <div className="mt-4 flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Balance</p>
                    <p className="font-semibold">₦{tenant.balance || "0"}</p>
                  </div>
                  <Button variant="ghost" size="icon">
                    <MessageCircle className="h-5 w-5" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
