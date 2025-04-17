
import { BarChart, LineChart, PieChart } from "recharts";
import { SummaryCard } from "@/components/dashboard/SummaryCard";
import { WhatsAppButton } from "@/components/dashboard/WhatsAppButton";
import { Card } from "@/components/ui/card";

// Sample data for charts
const monthlyData = [
  { month: "Jan", income: 70000, expenses: 0 },
  { month: "Feb", income: 55000, expenses: 0 },
  { month: "Mar", income: 75000, expenses: 0 },
  { month: "Apr", income: 68000, expenses: 52000 },
  { month: "May", income: 90000, expenses: 0 },
  { month: "Jun", income: 85000, expenses: 60000 },
  { month: "Aug", income: 82000, expenses: 0 },
];

const Dashboard = () => {
  return (
    <div className="p-6 md:ml-64 space-y-6">
      <div className="grid gap-4 md:grid-cols-3">
        <SummaryCard 
          title="Total Income" 
          amount="234,000" 
          className="bg-green-50"
        />
        <SummaryCard 
          title="Total Expenses" 
          amount="120,000" 
          className="bg-red-50"
        />
        <SummaryCard 
          title="Net Balance" 
          amount="114,000" 
          className="bg-blue-50"
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card className="p-4">
          <h3 className="font-semibold mb-4">Monthly Income and Expenses</h3>
          <div className="h-[300px]">
            <BarChart width={500} height={300} data={monthlyData}>
              {/* Chart implementation */}
            </BarChart>
          </div>
        </Card>

        <Card className="p-4">
          <h3 className="font-semibold mb-4">Dues Breakdown</h3>
          <div className="h-[300px]">
            <PieChart width={500} height={300}>
              {/* Chart implementation */}
            </PieChart>
          </div>
        </Card>
      </div>

      <WhatsAppButton />
    </div>
  );
};

export default Dashboard;
