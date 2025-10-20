import { useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { AnalyticsDashboard } from "@/components/features/AnalyticsDashboard";

export default function Analytics() {
  const [dateRange, setDateRange] = useState<"week" | "month" | "year">("month");
  const [transactions, setTransactions] = useState([]);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Analytics</h1>
          <p className="text-muted-foreground">
            Gain insights into your spending patterns and financial trends.
          </p>
        </div>
        <AnalyticsDashboard
          transactions={transactions}
          dateRange={dateRange}
          onDateRangeChange={setDateRange}
        />
      </div>
    </DashboardLayout>
  );
}