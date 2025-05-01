
import { BarChart, LineChart, PieChart, Bar, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Pie } from "recharts";
import { SummaryCard } from "@/components/dashboard/SummaryCard";
import { WhatsAppButton } from "@/components/dashboard/WhatsAppButton";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { apiService } from "@/services/api";
import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

const Dashboard = () => {
  const { user } = useAuth();
  const [currentMonth, setCurrentMonth] = useState<number>(new Date().getMonth() + 1);
  const [currentYear, setCurrentYear] = useState<number>(new Date().getFullYear());
  
  // Fetch monthly summary data
  const { data: summaryData, isLoading: loadingSummary } = useQuery({
    queryKey: ["monthly-summary", currentMonth, currentYear],
    queryFn: () => apiService.fetchMonthlySummary(currentMonth, currentYear),
    retry: 1,
  });
  
  // Fetch outstanding payments
  const { data: outstandingPayments } = useQuery({
    queryKey: ["outstanding-payments"],
    queryFn: apiService.fetchOutstandingPayments,
    retry: 1,
  });

  // Fetch transactions history for charts
  const { data: expenses } = useQuery({
    queryKey: ["expenses"],
    queryFn: apiService.fetchExpenses,
    retry: 1,
  });
  
  const { data: payments } = useQuery({
    queryKey: ["payments"],
    queryFn: apiService.fetchPayments,
    retry: 1,
  });

  // Prepare chart data based on API responses
  const monthlyData = [];
  const currentDate = new Date();
  
  // Generate monthly data for the last 6 months
  for (let i = 5; i >= 0; i--) {
    const date = new Date();
    date.setMonth(currentDate.getMonth() - i);
    const monthName = date.toLocaleString('default', { month: 'short' });
    
    // Sum payments and expenses for this month
    const monthExpenses = expenses?.filter((expense: any) => {
      const expenseDate = new Date(expense.date_spent);
      return expenseDate.getMonth() === date.getMonth() && 
             expenseDate.getFullYear() === date.getFullYear();
    }).reduce((sum: number, expense: any) => sum + parseFloat(expense.amount), 0) || 0;
    
    const monthPayments = payments?.filter((payment: any) => {
      const paymentDate = new Date(payment.date);
      return paymentDate.getMonth() === date.getMonth() && 
             paymentDate.getFullYear() === date.getFullYear();
    }).reduce((sum: number, payment: any) => sum + parseFloat(payment.amount), 0) || 0;
    
    monthlyData.push({
      month: monthName,
      income: monthPayments,
      expenses: monthExpenses
    });
  }

  // Prepare pie chart data for payment categories
  const categoriesMap: Record<string, number> = {};
  
  if (payments) {
    payments.forEach((payment: any) => {
      if (!categoriesMap[payment.category]) {
        categoriesMap[payment.category] = 0;
      }
      categoriesMap[payment.category] += parseFloat(payment.amount);
    });
  }
  
  const pieData = Object.keys(categoriesMap).map(name => ({
    name,
    value: categoriesMap[name]
  }));

  // Debug the data
  useEffect(() => {
    console.log("Summary Data:", summaryData);
    console.log("Outstanding Payments:", outstandingPayments);
  }, [summaryData, outstandingPayments]);

  return (
    <div className="space-y-6 p-6">
      {/* Welcome message */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome back, {user?.username}! {user?.estate && `Managing ${user.estate}`}
          </p>
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input 
            placeholder="Search transactions, tenants..." 
            className="pl-10 w-full md:w-[300px] bg-background"
          />
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <SummaryCard 
          title="Total Income" 
          amount={summaryData?.total_payments?.toLocaleString() || "0"} 
          className="bg-green-50"
        />
        <SummaryCard 
          title="Total Expenses" 
          amount={summaryData?.total_expenses?.toLocaleString() || "0"} 
          className="bg-red-50"
        />
        <SummaryCard 
          title="Net Balance" 
          amount={(
            (summaryData?.total_payments || 0) - (summaryData?.total_expenses || 0)
          ).toLocaleString()} 
          className="bg-blue-50"
        />
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="p-4 shadow-sm">
          <h3 className="font-semibold mb-4 text-lg">Monthly Income & Expenses</h3>
          <div className="h-[300px]">
            {loadingSummary ? (
              <div className="flex justify-center items-center h-full">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={monthlyData}
                  margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip formatter={(value) => `₦${value.toLocaleString()}`} />
                  <Legend />
                  <Bar dataKey="income" name="Income" fill="#4ade80" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="expenses" name="Expenses" fill="#f87171" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </Card>

        <Card className="p-4 shadow-sm">
          <h3 className="font-semibold mb-4 text-lg">Revenue Breakdown</h3>
          <div className="h-[300px]">
            {loadingSummary ? (
              <div className="flex justify-center items-center h-full">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
              </div>
            ) : pieData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => `₦${value.toLocaleString()}`} />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex justify-center items-center h-full text-muted-foreground">
                No payment data available
              </div>
            )}
          </div>
        </Card>
      </div>

      {/* Outstanding payments section */}
      {outstandingPayments && outstandingPayments.length > 0 && (
        <Card className="p-4 shadow-sm">
          <h3 className="font-semibold mb-4 text-lg">Outstanding Payments</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead>
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tenant
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Amount Due
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {outstandingPayments.map((payment: any, index: number) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      {payment.tenant_name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-right font-bold text-red-600">
                      ₦{payment.amount_due.toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      <WhatsAppButton />
    </div>
  );
};

export default Dashboard;
