import { Card } from "@/components/ui/card";
import { Transaction } from "./TransactionList";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";

interface SpendingChartProps {
  transactions: Transaction[];
}

const COLORS = {
  Food: "hsl(0, 0%, 20%)",
  Transport: "hsl(0, 0%, 35%)",
  Entertainment: "hsl(0, 0%, 50%)",
  Utilities: "hsl(0, 0%, 65%)",
  Shopping: "hsl(0, 0%, 80%)",
  Other: "hsl(0, 0%, 40%)",
};

export const SpendingChart = ({ transactions }: SpendingChartProps) => {
  const expenses = transactions.filter((t) => t.type === "expense");
  
  const categoryTotals = expenses.reduce((acc, transaction) => {
    acc[transaction.category] = (acc[transaction.category] || 0) + transaction.amount;
    return acc;
  }, {} as Record<string, number>);

  const data = Object.entries(categoryTotals).map(([name, value]) => ({
    name,
    value,
  }));

  if (data.length === 0) {
    return (
      <Card className="p-6 shadow-card">
        <h2 className="text-2xl font-bold mb-6">Spending Breakdown</h2>
        <div className="flex items-center justify-center h-64 text-muted-foreground">
          No spending data to display
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6 shadow-card">
      <h2 className="text-2xl font-bold mb-6">Spending Breakdown</h2>
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
            outerRadius={80}
            fill="#8884d8"
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[entry.name as keyof typeof COLORS]} />
            ))}
          </Pie>
          <Tooltip
            formatter={(value: number) => `$${value.toFixed(2)}`}
            contentStyle={{
              backgroundColor: "hsl(var(--card))",
              border: "1px solid hsl(var(--border))",
              borderRadius: "var(--radius)",
            }}
          />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </Card>
  );
};
