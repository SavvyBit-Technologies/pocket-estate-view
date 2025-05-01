
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { FileSpreadsheet, Download, FileDown, PieChart as PieChartIcon, BarChart as BarChartIcon } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { useQuery } from "@tanstack/react-query";
import { apiService } from "@/services/api";
import { useAuth } from "@/context/AuthContext";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ChartContainer, ChartTooltipContent, ChartTooltip } from "@/components/ui/chart";

// Custom colors for charts
const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884d8", "#82ca9d"];

export function Reports() {
  const { isAuthenticated } = useAuth();
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [category, setCategory] = useState<string>("all");
  const [reportType, setReportType] = useState<string>("overview");

  // Fetch total summary data for overall financial metrics
  const { data: totalSummaryData, isLoading: loadingTotalSummary } = useQuery({
    queryKey: ["total-summary"],
    queryFn: () => apiService.fetchTotalSummary(),
    retry: 1,
    enabled: isAuthenticated
  });

  // Fetch payments data
  const { data: payments, isLoading: loadingPayments } = useQuery({
    queryKey: ["payments"],
    queryFn: apiService.fetchPayments,
    retry: 1,
    enabled: isAuthenticated
  });

  // Fetch expenses data
  const { data: expenses, isLoading: loadingExpenses } = useQuery({
    queryKey: ["expenses"],
    queryFn: apiService.fetchExpenses,
    retry: 1,
    enabled: isAuthenticated
  });

  // Fetch outstanding payments
  const { data: outstandingPayments, isLoading: loadingOutstanding } = useQuery({
    queryKey: ["outstanding-payments"],
    queryFn: apiService.fetchOutstandingPayments,
    retry: 1,
    enabled: isAuthenticated
  });

  // Process financial data for analysis
  const financialAnalysis = () => {
    if (!totalSummaryData) return null;
    
    const totalIncome = parseFloat(totalSummaryData.total_payments || "0");
    const totalExpenses = parseFloat(totalSummaryData.total_expenses || "0");
    const netProfit = totalIncome - totalExpenses;
    const profitMargin = totalIncome > 0 ? (netProfit / totalIncome) * 100 : 0;
    
    const outstandingAmount = outstandingPayments?.reduce(
      (sum, payment) => sum + parseFloat(payment.amount_due || "0"), 0
    ) || 0;
    
    return {
      totalIncome,
      totalExpenses,
      netProfit,
      profitMargin: profitMargin.toFixed(2),
      outstandingAmount
    };
  };

  // Prepare monthly trend data
  const prepareTrendData = () => {
    if (!payments || !expenses) return [];
    
    // Map to store aggregated data by month
    const monthlyData = new Map();
    
    // Process payments
    payments.forEach((payment: any) => {
      const paymentDate = new Date(payment.date);
      const monthYear = `${paymentDate.toLocaleString('default', { month: 'short' })} ${paymentDate.getFullYear()}`;
      
      if (!monthlyData.has(monthYear)) {
        monthlyData.set(monthYear, { month: monthYear, income: 0, expenses: 0, timestamp: paymentDate.getTime() });
      }
      
      const currentData = monthlyData.get(monthYear);
      currentData.income += parseFloat(payment.amount);
      monthlyData.set(monthYear, currentData);
    });
    
    // Process expenses
    expenses.forEach((expense: any) => {
      const expenseDate = new Date(expense.date_spent);
      const monthYear = `${expenseDate.toLocaleString('default', { month: 'short' })} ${expenseDate.getFullYear()}`;
      
      if (!monthlyData.has(monthYear)) {
        monthlyData.set(monthYear, { month: monthYear, income: 0, expenses: 0, timestamp: expenseDate.getTime() });
      }
      
      const currentData = monthlyData.get(monthYear);
      currentData.expenses += parseFloat(expense.amount);
      monthlyData.set(monthYear, currentData);
    });
    
    // Convert map to array and sort by date
    return Array.from(monthlyData.values())
      .sort((a, b) => a.timestamp - b.timestamp)
      .map(item => ({
        month: item.month,
        income: item.income,
        expenses: item.expenses,
        profit: item.income - item.expenses
      }));
  };

  // Prepare category distribution data
  const prepareCategoryData = () => {
    if (!payments) return [];
    
    const categories: Record<string, number> = {};
    
    payments.forEach((payment: any) => {
      const category = payment.category || "Uncategorized";
      if (!categories[category]) {
        categories[category] = 0;
      }
      categories[category] += parseFloat(payment.amount);
    });
    
    return Object.keys(categories).map(name => ({
      name,
      value: categories[name]
    }));
  };

  // Prepare expense category data
  const prepareExpenseCategoryData = () => {
    if (!expenses) return [];
    
    const categories: Record<string, number> = {};
    
    expenses.forEach((expense: any) => {
      const category = expense.category || "Uncategorized";
      if (!categories[category]) {
        categories[category] = 0;
      }
      categories[category] += parseFloat(expense.amount);
    });
    
    return Object.keys(categories).map(name => ({
      name,
      value: categories[name]
    }));
  };

  const trendData = prepareTrendData();
  const categoryData = prepareCategoryData();
  const expenseCategoryData = prepareExpenseCategoryData();
  const analysis = financialAnalysis();

  const handleExport = (format: 'excel' | 'csv') => {
    toast.success(`Preparing ${format.toUpperCase()} financial report export`);
  };

  return (
    <div className="space-y-6 p-6">
      <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
        <h1 className="text-2xl font-semibold">Financial Reports & Analytics</h1>
        <div className="flex gap-2">
          <Button onClick={() => handleExport('excel')} variant="outline">
            <FileSpreadsheet className="mr-2 h-4 w-4" />
            Export to Excel
          </Button>
          <Button onClick={() => handleExport('csv')} variant="outline">
            <FileDown className="mr-2 h-4 w-4" />
            Export CSV
          </Button>
        </div>
      </div>

      {/* Financial Summary Cards */}
      {analysis && (
        <div className="grid gap-4 md:grid-cols-4">
          <Card className="bg-green-50">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Income</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">₦{analysis.totalIncome.toLocaleString()}</div>
            </CardContent>
          </Card>
          <Card className="bg-red-50">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Expenses</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">₦{analysis.totalExpenses.toLocaleString()}</div>
            </CardContent>
          </Card>
          <Card className={`${analysis.netProfit >= 0 ? 'bg-blue-50' : 'bg-amber-50'}`}>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Net Profit/Loss</CardTitle>
            </CardHeader>
            <CardContent>
              <div className={`text-2xl font-bold ${analysis.netProfit >= 0 ? 'text-blue-700' : 'text-amber-700'}`}>
                ₦{analysis.netProfit.toLocaleString()}
              </div>
            </CardContent>
          </Card>
          <Card className="bg-purple-50">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Outstanding Payments</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-700">
                ₦{analysis.outstandingAmount.toLocaleString()}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Report Filters</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Report Type</label>
              <Select value={reportType} onValueChange={setReportType}>
                <SelectTrigger>
                  <SelectValue placeholder="Select report type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="overview">Financial Overview</SelectItem>
                  <SelectItem value="income">Income Analysis</SelectItem>
                  <SelectItem value="expense">Expense Analysis</SelectItem>
                  <SelectItem value="profit">Profit & Loss</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Select Date Range</label>
              <Calendar
                mode="single"
                selected={date}
                onSelect={setDate}
                className="rounded-md border"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Category</label>
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="rent">Rent</SelectItem>
                  <SelectItem value="utilities">Utilities</SelectItem>
                  <SelectItem value="maintenance">Maintenance</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle>Profit & Loss Analysis</CardTitle>
            <PieChartIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {loadingTotalSummary ? (
              <div className="flex justify-center items-center h-[300px]">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
              </div>
            ) : analysis ? (
              <div className="space-y-4">
                <div className="text-center">
                  <div className="text-lg font-medium">Profit Margin</div>
                  <div className={`text-3xl font-bold ${parseFloat(analysis.profitMargin) >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {analysis.profitMargin}%
                  </div>
                </div>
                <div className="h-[220px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={[
                          { name: "Revenue", value: analysis.totalIncome },
                          { name: "Expenses", value: analysis.totalExpenses }
                        ]}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {[0, 1].map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={index === 0 ? "#4ade80" : "#f87171"} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => `₦${value.toLocaleString()}`} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>
            ) : (
              <div className="text-center p-8 text-muted-foreground">
                No financial data available
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle>Monthly Trends</CardTitle>
            <BarChartIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {loadingPayments || loadingExpenses ? (
              <div className="flex justify-center items-center h-[300px]">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
              </div>
            ) : trendData.length > 0 ? (
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={trendData}
                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip formatter={(value) => `₦${value.toLocaleString()}`} />
                    <Legend />
                    <Line type="monotone" dataKey="income" stroke="#4ade80" strokeWidth={2} name="Income" />
                    <Line type="monotone" dataKey="expenses" stroke="#f87171" strokeWidth={2} name="Expenses" />
                    <Line type="monotone" dataKey="profit" stroke="#3b82f6" strokeWidth={2} name="Profit" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <div className="text-center p-8 text-muted-foreground">
                No trend data available
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle>Revenue Sources</CardTitle>
            <PieChartIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {loadingPayments ? (
              <div className="flex justify-center items-center h-[300px]">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
              </div>
            ) : categoryData.length > 0 ? (
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={categoryData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {categoryData.map((_, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => `₦${value.toLocaleString()}`} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <div className="text-center p-8 text-muted-foreground">
                No revenue category data available
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Detailed Financial Report</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Category</TableHead>
                <TableHead>Description</TableHead>
                <TableHead className="text-right">Amount (₦)</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {reportType === 'income' && payments && payments.map((payment: any, i: number) => (
                <TableRow key={i}>
                  <TableCell className="font-medium">{payment.category || "Uncategorized"}</TableCell>
                  <TableCell>{payment.description || "No description"}</TableCell>
                  <TableCell className="text-right text-green-600 font-medium">
                    {parseFloat(payment.amount).toLocaleString()}
                  </TableCell>
                </TableRow>
              ))}
              {reportType === 'expense' && expenses && expenses.map((expense: any, i: number) => (
                <TableRow key={i}>
                  <TableCell className="font-medium">{expense.category || "Uncategorized"}</TableCell>
                  <TableCell>{expense.description || "No description"}</TableCell>
                  <TableCell className="text-right text-red-600 font-medium">
                    {parseFloat(expense.amount).toLocaleString()}
                  </TableCell>
                </TableRow>
              ))}
              {(reportType === 'overview' || reportType === 'profit') && (
                <>
                  <TableRow>
                    <TableCell className="font-medium">Total Income</TableCell>
                    <TableCell>All income sources combined</TableCell>
                    <TableCell className="text-right text-green-600 font-bold">
                      {analysis?.totalIncome.toLocaleString() || "0"}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Total Expenses</TableCell>
                    <TableCell>All expenses combined</TableCell>
                    <TableCell className="text-right text-red-600 font-bold">
                      {analysis?.totalExpenses.toLocaleString() || "0"}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Net Profit/Loss</TableCell>
                    <TableCell>Total income minus total expenses</TableCell>
                    <TableCell className={`text-right font-bold ${(analysis?.netProfit || 0) >= 0 ? 'text-blue-600' : 'text-amber-600'}`}>
                      {analysis?.netProfit.toLocaleString() || "0"}
                    </TableCell>
                  </TableRow>
                </>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}

export default Reports;
