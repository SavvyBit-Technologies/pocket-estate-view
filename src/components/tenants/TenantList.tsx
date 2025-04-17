
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

const tenants = [
  { id: 1, name: "John Doe", house: "A1", status: "Active", balance: "50,000" },
  { id: 2, name: "Jane Smith", house: "B2", status: "Active", balance: "0" },
  { id: 3, name: "Mike Johnson", house: "C3", status: "Pending", balance: "25,000" },
];

export function TenantList() {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>House No.</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Balance (₦)</TableHead>
            <TableHead className="text-right">Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {tenants.map((tenant) => (
            <TableRow key={tenant.id}>
              <TableCell>{tenant.name}</TableCell>
              <TableCell>{tenant.house}</TableCell>
              <TableCell>{tenant.status}</TableCell>
              <TableCell>{tenant.balance}</TableCell>
              <TableCell className="text-right">
                <Button variant="ghost" size="icon">
                  <MessageCircle className="h-5 w-5" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
