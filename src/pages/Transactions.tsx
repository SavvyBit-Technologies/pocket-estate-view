
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
import { useQuery } from "@tanstack/react-query";
import { apiService } from "@/services/api";
import { useState } from "react";

interface Payment {
  id: number;
  tenant: number;
  amount: string;
  category: string;
  description: string;
  date: string;
  tenant_name?: string;
}

interface Expense {
  id: number;
  category: string;
  description: string;
  amount: string;
  date_spent: string;
}

type Transaction = {
  id: number;
  amount: string;
  category: string;
  description: string;
  type: "Income" | "Expense";
  date: string; // Common date field for sorting
  tenant_name?: string;
}

export function Transactions() {
  const [searchQuery, setSearchQuery] = useState("");

  const { data: payments, isLoading: isLoadingPayments } = useQuery({
    queryKey: ["payments"],
    queryFn: apiService.fetchPayments,
  });

  const { data: expenses, isLoading: isLoadingExpenses } = useQuery({
    queryKey: ["expenses"],
    queryFn: apiService.fetchExpenses,
  });

  const { data: tenants } = useQuery({
    queryKey: ["tenants"],
    queryFn: apiService.fetchTenants,
  });

  const { data: summary } = useQuery({
    queryKey: ["monthly-summary"],
    queryFn: () => apiService.fetchMonthlySummary(),
  });

  // Combine and prepare transactions data
  const transactions: Transaction[] = [];

  if (payments) {
    payments.forEach((payment: Payment) => {
      // Find tenant name if available
      const tenant = tenants?.tenants?.find((t: any) => t.tenant_id === payment.tenant);
      transactions.push({
        id: payment.id,
        amount: payment.amount,
        category: payment.category,
        description: payment.description,
        type: "Income",
        date: payment.date,
        tenant_name: tenant?.full_name || `Tenant #${payment.tenant}`,
      });
    });
  }

  if (expenses) {
    expenses.forEach((expense: Expense) => {
      transactions.push({
        id: expense.id,
        amount: expense.amount,
        category: expense.category,
        description: expense.description,
        type: "Expense",
        date: expense.date_spent,
      });
    });
  }

  // Sort by date (newest first)
  transactions.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  // Filter based on search query
  const filteredTransactions = transactions.filter(transaction => 
    transaction.description.toLowerCase().includes(searchQuery.toLowerCase()) || 
    transaction.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
    transaction.tenant_name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const isLoading = isLoadingPayments || isLoadingExpenses;

  return (
    <div className="p-6">
      <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold">Transaction History</h1>
        <div className="relative w-full md:w-64">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input 
            placeholder="Search transactions..." 
            className="pl-10 w-full"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
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
              <div className="text-2xl font-bold text-green-600">₦{summary?.total_payments || 0}</div>
              <p className="text-xs text-muted-foreground flex items-center">
                <ChevronUp className="h-4 w-4 text-green-500" />
                {summary?.month} {summary?.year}
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Expenses</CardTitle>
              <DollarSign className="h-4 w-4 text-red-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">₦{summary?.total_expenses || 0}</div>
              <p className="text-xs text-muted-foreground flex items-center">
                <ChevronDown className="h-4 w-4 text-red-500" />
                {summary?.month} {summary?.year}
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      <Card>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
            </div>
          ) : filteredTransactions.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              {searchQuery ? "No transactions match your search." : "No transactions found."}
            </div>
          ) : (
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
                {filteredTransactions.map((transaction, index) => (
                  <TableRow key={`${transaction.type}-${transaction.id}-${index}`}>
                    <TableCell>{new Date(transaction.date).toLocaleDateString()}</TableCell>
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
                      {transaction.type === 'Income' ? '+' : '-'}₦{
                        parseFloat(transaction.amount).toLocaleString()
                      }
                    </TableCell>
                    <TableCell>
                      <span className="inline-flex items-center rounded-full px-2 py-1 text-xs font-medium bg-blue-50 text-blue-700">
                        Completed
                      </span>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
