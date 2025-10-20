import { useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { SavingsTracker } from "@/components/features/SavingsTracker";

export default function Savings() {
  const [goals, setGoals] = useState([]);
  const [totalSavings, setTotalSavings] = useState(0);
  const [monthlyIncome, setMonthlyIncome] = useState(0);
  const [monthlyExpenses, setMonthlyExpenses] = useState(0);

  const handleAddGoal = () => {
    // TODO: Implement add goal dialog
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Savings</h1>
          <p className="text-muted-foreground">
            Track your savings progress and manage your financial goals.
          </p>
        </div>
        <SavingsTracker
          goals={goals}
          totalSavings={totalSavings}
          monthlyIncome={monthlyIncome}
          monthlyExpenses={monthlyExpenses}
          onAddGoal={handleAddGoal}
        />
      </div>
    </DashboardLayout>
  );
}