
import { BarChart, LineChart, PieChart, Bar, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Pie } from "recharts";
import { SummaryCard } from "@/components/dashboard/SummaryCard";
import { WhatsAppButton } from "@/components/dashboard/WhatsAppButton";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

// Sample data for charts
const monthlyData = [
  { month: "Jan", income: 70000, expenses: 40000 },
  { month: "Feb", income: 55000, expenses: 35000 },
  { month: "Mar", income: 75000, expenses: 42000 },
  { month: "Apr", income: 68000, expenses: 52000 },
  { month: "May", income: 90000, expenses: 48000 },
  { month: "Jun", income: 85000, expenses: 60000 },
  { month: "Jul", income: 79000, expenses: 45000 },
  { month: "Aug", income: 82000, expenses: 51000 },
];

const pieData = [
  { name: "Rent", value: 65 },
  { name: "Utilities", value: 15 },
  { name: "Security", value: 10 },
  { name: "Other", value: 10 },
];

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

const Dashboard = () => {
  return (
    <div className="space-y-6 p-6">
      {/* Search Bar */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Dashboard</h1>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input 
            placeholder="Search transactions, tenants..." 
            className="pl-10 w-full md:w-[300px] bg-background"
          />
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <SummaryCard 
          title="Total Income" 
          amount="534,000" 
          className="bg-green-50"
        />
        <SummaryCard 
          title="Total Expenses" 
          amount="320,000" 
          className="bg-red-50"
        />
        <SummaryCard 
          title="Net Balance" 
          amount="214,000" 
          className="bg-blue-50"
        />
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="p-4 shadow-sm">
          <h3 className="font-semibold mb-4 text-lg">Monthly Income & Expenses</h3>
          <div className="h-[300px]">
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
          </div>
        </Card>

        <Card className="p-4 shadow-sm">
          <h3 className="font-semibold mb-4 text-lg">Dues Breakdown</h3>
          <div className="h-[300px]">
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
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      <WhatsAppButton />
    </div>
  );
};

export default Dashboard;
