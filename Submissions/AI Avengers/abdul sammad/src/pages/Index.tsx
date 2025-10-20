import { useState, useEffect } from "react";
import { Dashboard } from "@/components/Dashboard";
import { TransactionList, Transaction } from "@/components/TransactionList";
import { AddTransactionDialog } from "@/components/AddTransactionDialog";
import { SpendingChart } from "@/components/SpendingChart";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const Index = () => {
<<<<<<< HEAD
  
  const navigate = useNavigate();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
=======
  const { user, logout } = useAuth();
  const [transactions, setTransactions] = useState<Transaction[]>([
    {
      id: "1",
      description: "Grocery Shopping",
      amount: 85.50,
      category: "Food",
      date: new Date().toISOString(),
      type: "expense",
    },
    {
      id: "2",
      description: "Uber Ride",
      amount: 25.00,
      category: "Transport",
      date: new Date(Date.now() - 86400000).toISOString(),
      type: "expense",
    },
    {
      id: "3",
      description: "Netflix Subscription",
      amount: 15.99,
      category: "Entertainment",
      date: new Date(Date.now() - 172800000).toISOString(),
      type: "expense",
    },
    {
      id: "4",
      description: "Salary",
      amount: 3500.00,
      category: "Other",
      date: new Date(Date.now() - 259200000).toISOString(),
      type: "income",
    },
  ]);
>>>>>>> 58fa215ceb2a7ab7bcd7c9ea7434e7ec0a3f8ff6
  const [dialogOpen, setDialogOpen] = useState(false);

  // Load user's transactions from localStorage
  useEffect(() => {
    if (user) {
      const storedTransactions = localStorage.getItem(`transactions_${user.id}`);
      if (storedTransactions) {
        setTransactions(JSON.parse(storedTransactions));
      }
    }
  }, [user]);

  // Save transactions to localStorage whenever they change
  useEffect(() => {
    if (user && transactions.length > 0) {
      localStorage.setItem(`transactions_${user.id}`, JSON.stringify(transactions));
    }
  }, [transactions, user]);

  // Calculate financial metrics
  const balance = transactions.reduce((acc, t) => {
    return t.type === "income" ? acc + t.amount : acc - t.amount;
  }, 0);

  const monthlySpending = transactions
    .filter((t) => t.type === "expense")
    .reduce((acc, t) => acc + t.amount, 0);

  const budgetLimit = 0;
  const savingsGoal = 0;
  const currentSavings = 0;
  const level = 1;
  const points = 0;

  const handleAddTransaction = (transaction: Omit<Transaction, "id">) => {
    const newTransaction = {
      ...transaction,
      id: Date.now().toString(),
    };
    setTransactions([newTransaction, ...transactions]);
    
    // Gamification feedback
    const pointsEarned = transaction.type === "expense" && transaction.amount < 50 ? 10 : 5;
    toast.success(`Transaction added! +${pointsEarned} points earned`, {
      description: transaction.type === "expense" 
        ? "Great job tracking your expenses!"
        : "Income recorded successfully!",
    });
  };

  const handleDeleteTransaction = (id: string) => {
    setTransactions(transactions.filter((t) => t.id !== id));
    toast.info("Transaction deleted");
  };

 

  return (
    <div className="min-h-screen bg-gradient-bg">
      <div className="container mx-auto px-4 py-4 sm:py-8 max-w-7xl">
        {/* Header */}
<<<<<<< HEAD
        <header className="mb-8 bg-gradient-to-r from-black to-zinc-800 dark:from-zinc-900 dark:to-black rounded-lg p-8 shadow-lg">
          <h1 className="text-4xl font-bold text-white">
            FinanceQuest
          </h1>
          <p className="text-zinc-400 mt-2 text-lg">
            Level up your finances, conquer your goals
          </p>
          <div className="mt-6 flex gap-4">
            <Button variant="secondary" size="lg" className="bg-white text-black hover:bg-zinc-100 dark:bg-zinc-800 dark:text-white dark:hover:bg-zinc-700">
              Start Your Journey
            </Button>
            <Button variant="outline" size="lg" className="border-white/20 text-black hover:bg-white/10 dark:border-zinc-700 dark:text-white">
              Learn More
            </Button>
          </div>
=======
        <header className="mb-6 sm:mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-primary bg-clip-text text-transparent">
              FinanceQuest
            </h1>
            <p className="text-muted-foreground mt-2">
              Welcome back, {user?.name}!
            </p>
          </div>
          <Button onClick={logout} variant="outline" size="sm" className="gap-2 self-start sm:self-auto">
            <LogOut className="h-4 w-4" />
            Logout
          </Button>
>>>>>>> 58fa215ceb2a7ab7bcd7c9ea7434e7ec0a3f8ff6
        </header>

        {/* Dashboard */}
        <div className="space-y-6 animate-slide-up">
          <Dashboard
            balance={balance}
            monthlySpending={monthlySpending}
            budgetLimit={budgetLimit}
            savingsGoal={savingsGoal}
            currentSavings={currentSavings}
            level={level}
            points={points}
          />

          {/* Content Grid */}
          <div className="grid gap-6 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <TransactionList
                transactions={transactions}
                onAddTransaction={() => setDialogOpen(true)}
                onDeleteTransaction={handleDeleteTransaction}
              />
            </div>
            <div>
              <SpendingChart transactions={transactions} />
            </div>
          </div>
        </div>

        {/* Add Transaction Dialog */}
        <AddTransactionDialog
          open={dialogOpen}
          onOpenChange={setDialogOpen}
          onAddTransaction={handleAddTransaction}
        />
      </div>
    </div>
  );
};

export default Index;
