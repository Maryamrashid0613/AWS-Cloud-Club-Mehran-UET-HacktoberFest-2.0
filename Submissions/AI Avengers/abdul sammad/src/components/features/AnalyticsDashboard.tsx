import { Card } from "../ui/card";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { Transaction } from "../TransactionList";

interface AnalyticsDashboardProps {
  transactions: Transaction[];
  dateRange: "week" | "month" | "year";
  onDateRangeChange: (range: "week" | "month" | "year") => void;
}

const COLORS = ["#6366f1", "#8b5cf6", "#d946ef", "#f43f5e", "#f59e0b", "#10b981"];

export function AnalyticsDashboard({
  transactions,
  dateRange,
  onDateRangeChange,
}: AnalyticsDashboardProps) {
  // Process transaction data for charts
  const spendingByCategory = transactions
    .filter((t) => t.type === "expense")
    .reduce((acc, t) => {
      acc[t.category] = (acc[t.category] || 0) + t.amount;
      return acc;
    }, {} as Record<string, number>);

  const pieData = Object.entries(spendingByCategory).map(([name, value]) => ({
    name,
    value,
  }));

  const dailyTotals = transactions.reduce((acc, t) => {
    const date = new Date(t.date).toLocaleDateString();
    if (t.type === "expense") {
      acc[date] = (acc[date] || 0) - t.amount;
    } else {
      acc[date] = (acc[date] || 0) + t.amount;
    }
    return acc;
  }, {} as Record<string, number>);

  const lineData = Object.entries(dailyTotals).map(([date, amount]) => ({
    date,
    amount,
  }));

  return (
    <div className="space-y-6">
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="spending">Spending</TabsTrigger>
          <TabsTrigger value="trends">Trends</TabsTrigger>
        </TabsList>
        <TabsContent value="overview" className="space-y-4">
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-6">Cash Flow</h2>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={lineData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Line
                    type="monotone"
                    dataKey="amount"
                    stroke="#8b5cf6"
                    strokeWidth={2}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </TabsContent>
        <TabsContent value="spending" className="space-y-4">
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-6">Spending by Category</h2>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) =>
                      `${name} ${(percent * 100).toFixed(0)}%`
                    }
                  >
                    {pieData.map((entry, index) => (
                      <Cell
                        key={entry.name}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}