import { Card } from "../ui/card";
import { Button } from "../ui/button";
import { Trophy, Target, TrendingUp } from "lucide-react";
import { Progress } from "../ui/progress";

interface Goal {
  id: string;
  title: string;
  targetAmount: number;
  currentAmount: number;
  deadline: string;
  category: string;
}

interface SavingsTrackerProps {
  goals: Goal[];
  totalSavings: number;
  monthlyIncome: number;
  monthlyExpenses: number;
  onAddGoal: () => void;
}

export function SavingsTracker({
  goals,
  totalSavings,
  monthlyIncome,
  monthlyExpenses,
  onAddGoal,
}: SavingsTrackerProps) {
  const savingsRate = ((monthlyIncome - monthlyExpenses) / monthlyIncome) * 100;

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="p-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-zinc-100 rounded-full dark:bg-zinc-800">
              <TrendingUp className="h-6 w-6 text-zinc-700 dark:text-zinc-300" />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Total Savings</p>
              <h3 className="text-2xl font-bold">${totalSavings.toLocaleString()}</h3>
            </div>
          </div>
        </Card>
        <Card className="p-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-zinc-100 rounded-full dark:bg-zinc-800">
              <Target className="h-6 w-6 text-zinc-700 dark:text-zinc-300" />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Monthly Goal Progress</p>
              <div className="mt-2">
                <Progress value={savingsRate} />
                <p className="mt-1 text-sm text-muted-foreground">{savingsRate.toFixed(1)}% of income</p>
              </div>
            </div>
          </div>
        </Card>
        <Card className="p-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-zinc-100 rounded-full dark:bg-zinc-800">
              <Trophy className="h-6 w-6 text-zinc-700 dark:text-zinc-300" />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Goals Achieved</p>
              <h3 className="text-2xl font-bold">{goals.filter(g => g.currentAmount >= g.targetAmount).length}</h3>
            </div>
          </div>
        </Card>
      </div>

      {/* Active Goals */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold">Savings Goals</h2>
          <Button onClick={onAddGoal}>Add Goal</Button>
        </div>
        <div className="space-y-6">
          {goals.map((goal) => (
            <div key={goal.id} className="space-y-2">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium">{goal.title}</h3>
                  <p className="text-sm text-muted-foreground">Due {new Date(goal.deadline).toLocaleDateString()}</p>
                </div>
                <p className="text-sm font-medium">
                  ${goal.currentAmount.toLocaleString()} / ${goal.targetAmount.toLocaleString()}
                </p>
              </div>
              <Progress value={(goal.currentAmount / goal.targetAmount) * 100} />
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}