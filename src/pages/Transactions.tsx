
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChevronDown, ChevronUp, DollarSign, Search } from "lucide-react";
import { Input } from "@/components/ui/input";

// Sample data - in a real app this would come from your backend
const transactions = [
  {
    id: 1,
    date: "2024-04-19",
    type: "Income",
    description: "Rent Payment - Unit 101",
    amount: 2500,
    category: "Rent",
    status: "Completed",
  },
  {
    id: 2,
    date: "2024-04-18",
    type: "Expense",
    description: "Building Maintenance",
    amount: -850,
    category: "Maintenance",
    status: "Completed",
  },
  // Add more transactions...
];

export function Transactions() {
  return (
    <div className="p-6">
      <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold">Transaction History</h1>
        <div className="relative w-full md:w-64">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input 
            placeholder="Search transactions..." 
            className="pl-10 w-full"
          />
        </div>
      </div>

      <div className="grid gap-6 mb-6">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Income</CardTitle>
              <DollarSign className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">$12,500</div>
              <p className="text-xs text-muted-foreground flex items-center">
                <ChevronUp className="h-4 w-4 text-green-500" />
                +15% from last month
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Expenses</CardTitle>
              <DollarSign className="h-4 w-4 text-red-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">$4,200</div>
              <p className="text-xs text-muted-foreground flex items-center">
                <ChevronDown className="h-4 w-4 text-red-500" />
                +8% from last month
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Type</TableHead>
                <TableHead className="text-right">Amount</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {transactions.map((transaction) => (
                <TableRow key={transaction.id}>
                  <TableCell>{transaction.date}</TableCell>
                  <TableCell>{transaction.description}</TableCell>
                  <TableCell>{transaction.category}</TableCell>
                  <TableCell>
                    <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
                      transaction.type === 'Income' 
                        ? 'bg-green-50 text-green-700' 
                        : 'bg-red-50 text-red-700'
                    }`}>
                      {transaction.type}
                    </span>
                  </TableCell>
                  <TableCell className={`text-right font-medium ${
                    transaction.type === 'Income' 
                      ? 'text-green-600' 
                      : 'text-red-600'
                  }`}>
                    {transaction.type === 'Income' ? '+' : ''}{transaction.amount.toLocaleString('en-US', {
                      style: 'currency',
                      currency: 'USD'
                    })}
                  </TableCell>
                  <TableCell>
                    <span className="inline-flex items-center rounded-full px-2 py-1 text-xs font-medium bg-blue-50 text-blue-700">
                      {transaction.status}
                    </span>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
