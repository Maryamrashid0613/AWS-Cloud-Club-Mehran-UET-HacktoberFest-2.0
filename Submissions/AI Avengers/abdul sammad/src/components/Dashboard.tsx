import { motion } from 'framer-motion';
import { Card } from "@/components/ui/card";
import { TrendingUp, TrendingDown, Wallet, Target, Trophy, Zap, Download, ChevronDown } from "lucide-react";
import { useResponsive } from '../hooks/useResponsive';
import { Button } from './ui/button';
import * as Papa from 'papaparse';
import jsPDF from 'jspdf';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import CountUp from 'react-countup';
import { StatCard } from './ui/StatCard';

interface DashboardProps {
  balance: number;
  monthlySpending: number;
  budgetLimit: number;
  savingsGoal: number;
  currentSavings: number;
  level: number;
  points: number;
}

const fadeInUp = {
  initial: { y: 20, opacity: 0 },
  animate: { y: 0, opacity: 1 },
  transition: { duration: 0.5 }
};

export const Dashboard = ({
  balance,
  monthlySpending,
  budgetLimit,
  savingsGoal,
  currentSavings,
  level,
  points,
}: DashboardProps) => {
  const { isMobile } = useResponsive();
  const budgetPercentage = (monthlySpending / budgetLimit) * 100;
  const savingsPercentage = (currentSavings / savingsGoal) * 100;
  const budgetRemaining = budgetLimit - monthlySpending;
  const isOverBudget = monthlySpending > budgetLimit;

  const exportToCSV = () => {
    const data = [
      ['Date', 'Description', 'Amount'],
      ['Current Balance', '', balance],
      ['Monthly Spending', '', monthlySpending],
      ['Budget Limit', '', budgetLimit],
      ['Current Savings', '', currentSavings],
      ['Savings Goal', '', savingsGoal],
    ];
    
    const csv = Papa.unparse(data);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'financial_data.csv';
    link.click();
  };

  const exportToPDF = () => {
    const doc = new jsPDF();
    doc.text('Financial Report', 20, 20);
    doc.text(`Balance: $${balance.toLocaleString()}`, 20, 40);
    doc.text(`Monthly Spending: $${monthlySpending.toLocaleString()}`, 20, 50);
    doc.text(`Budget Limit: $${budgetLimit.toLocaleString()}`, 20, 60);
    doc.text(`Current Savings: $${currentSavings.toLocaleString()}`, 20, 70);
    doc.text(`Savings Goal: $${savingsGoal.toLocaleString()}`, 20, 80);
    doc.save('financial_report.pdf');
  };

  return (
<<<<<<< HEAD
    <div className="space-y-6 p-6">
      {/* Hero Balance Card */}
      <motion.div {...fadeInUp}>
        <Card className="relative overflow-hidden bg-gradient-to-r from-black to-zinc-700 p-8 text-white shadow-lg">
          <div className="relative z-10">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div>
                <p className="text-sm opacity-90 mb-2">Total Balance</p>
                <h1 className="text-5xl font-bold tracking-tight">
                  $<CountUp end={balance} separator="," duration={2.5} />
                </h1>
              </div>
              <div className="flex flex-col items-end gap-3">
                <motion.div 
                  className="flex items-center gap-2 bg-white/20 px-4 py-2 rounded-full backdrop-blur-sm hover:bg-white/30 transition-all"
                  whileHover={{ scale: 1.05 }}
                >
                  <Trophy className="w-5 h-5" />
                  <span className="font-semibold">Level {level}</span>
                </motion.div>
                <motion.div 
                  className="flex items-center gap-2 bg-white/20 px-4 py-2 rounded-full backdrop-blur-sm hover:bg-white/30 transition-all"
                  whileHover={{ scale: 1.05 }}
                >
                  <Zap className="w-5 h-5" />
                  <span className="font-semibold">{points} pts</span>
                </motion.div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="secondary" className="mt-2">
                      Export Data <ChevronDown className="ml-2 h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem onClick={exportToCSV}>
                      <Download className="mr-2 h-4 w-4" />
                      Export as CSV
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={exportToPDF}>
                      <Download className="mr-2 h-4 w-4" />
                      Export as PDF
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
=======
    <div className="space-y-4 sm:space-y-6">
      {/* Hero Balance Card */}
      <Card className="relative overflow-hidden bg-gradient-primary p-6 sm:p-8 text-primary-foreground shadow-elegant">
        <div className="relative z-10">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <p className="text-sm opacity-90 mb-2">Total Balance</p>
              <h1 className="text-4xl sm:text-5xl font-bold tracking-tight">${balance.toLocaleString()}</h1>
            </div>
            <div className="flex sm:flex-col items-center sm:items-end gap-2">
              <div className="flex items-center gap-2 bg-white/20 px-3 sm:px-4 py-2 rounded-full backdrop-blur-sm">
                <Trophy className="w-4 h-4 sm:w-5 sm:h-5" />
                <span className="font-semibold text-sm sm:text-base">Level {level}</span>
              </div>
              <div className="flex items-center gap-2 bg-white/20 px-3 sm:px-4 py-2 rounded-full backdrop-blur-sm">
                <Zap className="w-4 h-4 sm:w-5 sm:h-5" />
                <span className="font-semibold text-sm sm:text-base">{points} pts</span>
>>>>>>> 58fa215ceb2a7ab7bcd7c9ea7434e7ec0a3f8ff6
              </div>
            </div>
          </div>
          <div className="absolute -right-8 -bottom-8 w-48 h-48 bg-white/10 rounded-full blur-3xl" />
          <div className="absolute -left-8 -top-8 w-48 h-48 bg-white/10 rounded-full blur-3xl" />
        </Card>
      </motion.div>

      {/* Stats Grid */}
<<<<<<< HEAD
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <StatCard
          title="Monthly Spending"
          value={monthlySpending}
          icon={Wallet}
          prefix="$"
          trend={{
            value: budgetRemaining,
            label: isOverBudget
              ? `$${Math.abs(budgetRemaining).toLocaleString()} over budget`
              : `$${budgetRemaining.toLocaleString()} remaining`,
            isPositive: !isOverBudget
          }}
          progress={{
            value: monthlySpending,
            max: budgetLimit,
            color: isOverBudget ? "bg-zinc-900" : "bg-zinc-700"
          }}
        />

        <StatCard
          title="Savings Goal"
          value={currentSavings}
          icon={Target}
          prefix="$"
          delay={0.2}
          progress={{
            value: currentSavings,
            max: savingsGoal,
            color: "bg-zinc-700"
          }}
        />

        <StatCard
          title="Achievements"
          value={points}
          icon={Trophy}
          suffix=" pts"
          delay={0.3}
          trend={{
            value: level,
            label: `Level ${level}`,
            isPositive: true
          }}
        />
=======
      <div className="grid gap-4 sm:gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {/* Monthly Spending */}
        <Card className="p-4 sm:p-6 shadow-card hover:shadow-elegant transition-all duration-300">
          <div className="flex items-start justify-between">
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Monthly Spending</p>
              <p className="text-2xl sm:text-3xl font-bold">${monthlySpending.toLocaleString()}</p>
              <div className="flex items-center gap-2 text-sm">
                {isOverBudget ? (
                  <>
                    <TrendingUp className="w-4 h-4 text-destructive" />
                    <span className="text-destructive font-medium">
                      ${Math.abs(budgetRemaining).toLocaleString()} over budget
                    </span>
                  </>
                ) : (
                  <>
                    <TrendingDown className="w-4 h-4 text-accent" />
                    <span className="text-accent font-medium">
                      ${budgetRemaining.toLocaleString()} remaining
                    </span>
                  </>
                )}
              </div>
            </div>
            <div className="p-3 bg-muted rounded-xl">
              <Wallet className="w-6 h-6 text-primary" />
            </div>
          </div>
          <div className="mt-4">
            <div className="h-2 bg-muted rounded-full overflow-hidden">
              <div
                className={`h-full transition-all duration-500 ${
                  isOverBudget ? "bg-destructive" : "bg-primary"
                }`}
                style={{ width: `${Math.min(budgetPercentage, 100)}%` }}
              />
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              {budgetPercentage.toFixed(0)}% of ${budgetLimit.toLocaleString()} budget
            </p>
          </div>
        </Card>

        {/* Savings Goal */}
        <Card className="p-4 sm:p-6 shadow-card hover:shadow-elegant transition-all duration-300">
          <div className="flex items-start justify-between">
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Savings Goal</p>
              <p className="text-2xl sm:text-3xl font-bold">${currentSavings.toLocaleString()}</p>
              <p className="text-sm text-muted-foreground">
                of ${savingsGoal.toLocaleString()} goal
              </p>
            </div>
            <div className="p-3 bg-accent/10 rounded-xl">
              <Target className="w-6 h-6 text-accent" />
            </div>
          </div>
          <div className="mt-4">
            <div className="h-2 bg-muted rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-accent transition-all duration-500"
                style={{ width: `${Math.min(savingsPercentage, 100)}%` }}
              />
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              {savingsPercentage.toFixed(0)}% complete
            </p>
          </div>
        </Card>

        {/* Financial Health Score */}
        <Card className="p-4 sm:p-6 shadow-card hover:shadow-elegant transition-all duration-300 sm:col-span-2 lg:col-span-1">
          <div className="flex items-start justify-between">
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Health Score</p>
              <p className="text-2xl sm:text-3xl font-bold">
                {Math.max(0, 100 - Math.round(budgetPercentage / 2))}
              </p>
              <p className="text-sm font-medium text-accent">Excellent</p>
            </div>
            <div className="relative w-16 h-16">
              <svg className="w-16 h-16 transform -rotate-90">
                <circle
                  cx="32"
                  cy="32"
                  r="28"
                  stroke="currentColor"
                  strokeWidth="6"
                  fill="transparent"
                  className="text-muted"
                />
                <circle
                  cx="32"
                  cy="32"
                  r="28"
                  stroke="currentColor"
                  strokeWidth="6"
                  fill="transparent"
                  strokeDasharray={`${2 * Math.PI * 28}`}
                  strokeDashoffset={`${2 * Math.PI * 28 * (1 - (100 - budgetPercentage / 2) / 100)}`}
                  className="text-primary transition-all duration-500"
                  strokeLinecap="round"
                />
              </svg>
            </div>
          </div>
        </Card>
>>>>>>> 58fa215ceb2a7ab7bcd7c9ea7434e7ec0a3f8ff6
      </div>
    </div>
  );
};