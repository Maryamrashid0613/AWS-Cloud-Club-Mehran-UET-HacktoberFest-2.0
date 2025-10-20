import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  ShoppingBag, 
  Utensils, 
  Car, 
  Home, 
  Film, 
  Plus, 
  Trash2,
  TrendingUp,
  TrendingDown,
  Download
} from "lucide-react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { toast } from "sonner";

export interface Transaction {
  id: string;
  description: string;
  amount: number;
  category: "Food" | "Transport" | "Entertainment" | "Utilities" | "Shopping" | "Other";
  date: string;
  type: "expense" | "income";
}

interface TransactionListProps {
  transactions: Transaction[];
  onAddTransaction: () => void;
  onDeleteTransaction: (id: string) => void;
}

const categoryIcons = {
  Food: Utensils,
  Transport: Car,
  Entertainment: Film,
  Utilities: Home,
  Shopping: ShoppingBag,
  Other: TrendingDown,
};

const categoryColors = {
  Food: "bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300",
  Transport: "bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300",
  Entertainment: "bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300",
  Utilities: "bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300",
  Shopping: "bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300",
  Other: "bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300",
};

export const TransactionList = ({
  transactions,
  onAddTransaction,
  onDeleteTransaction,
}: TransactionListProps) => {
  const [filter, setFilter] = useState<string>("All");
  const categories = ["All", "Food", "Transport", "Entertainment", "Utilities", "Shopping", "Other"];

  const filteredTransactions = transactions.filter(
    (t) => filter === "All" || t.category === filter
  );

  const exportToCSV = () => {
    const headers = ["Date", "Description", "Category", "Amount", "Type"];
    const rows = filteredTransactions.map(t => [
      new Date(t.date).toLocaleDateString(),
      t.description,
      t.category,
      t.amount.toFixed(2),
      t.type
    ]);

    const csvContent = [
      headers.join(","),
      ...rows.map(row => row.join(","))
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `transactions_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
    toast.success("CSV exported successfully!");
  };

  const exportToPDF = () => {
    const doc = new jsPDF();
    
    doc.setFontSize(18);
    doc.text("FinanceQuest Transactions", 14, 20);
    doc.setFontSize(11);
    doc.text(`Generated: ${new Date().toLocaleDateString()}`, 14, 28);

    const tableData = filteredTransactions.map(t => [
      new Date(t.date).toLocaleDateString(),
      t.description,
      t.category,
      `$${t.amount.toFixed(2)}`,
      t.type.charAt(0).toUpperCase() + t.type.slice(1)
    ]);

    autoTable(doc, {
      head: [["Date", "Description", "Category", "Amount", "Type"]],
      body: tableData,
      startY: 35,
      styles: { fontSize: 9 },
      headStyles: { fillColor: [147, 51, 234] },
    });

    doc.save(`transactions_${new Date().toISOString().split('T')[0]}.pdf`);
    toast.success("PDF exported successfully!");
  };

  return (
    <Card className="p-4 sm:p-6 shadow-card">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold">Transactions</h2>
          <p className="text-sm text-muted-foreground mt-1">
            {filteredTransactions.length} transaction{filteredTransactions.length !== 1 ? "s" : ""}
          </p>
        </div>
        <div className="flex gap-2">
          <Button onClick={exportToCSV} size="sm" variant="outline" className="gap-2">
            <Download className="w-4 h-4" />
            <span className="hidden sm:inline">CSV</span>
          </Button>
          <Button onClick={exportToPDF} size="sm" variant="outline" className="gap-2">
            <Download className="w-4 h-4" />
            <span className="hidden sm:inline">PDF</span>
          </Button>
          <Button onClick={onAddTransaction} size="sm" className="gap-2">
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">Add</span>
          </Button>
        </div>
      </div>

      {/* Category Filter */}
      <div className="flex flex-wrap gap-2 mb-6">
        {categories.map((category) => (
          <Button
            key={category}
            variant={filter === category ? "default" : "outline"}
            size="sm"
            onClick={() => setFilter(category)}
            className="rounded-full"
          >
            {category}
          </Button>
        ))}
      </div>

      {/* Transaction List */}
      <div className="space-y-3">
        {filteredTransactions.length === 0 ? (
          <div className="text-center py-12">
            <TrendingDown className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">No transactions yet</p>
            <p className="text-sm text-muted-foreground mt-1">
              Add your first transaction to get started
            </p>
          </div>
        ) : (
          filteredTransactions.map((transaction) => {
            const Icon = transaction.type === "income" ? TrendingUp : categoryIcons[transaction.category];
            const isIncome = transaction.type === "income";

            return (
              <div
                key={transaction.id}
                className="flex items-center gap-3 sm:gap-4 p-3 sm:p-4 rounded-lg border bg-card hover:bg-muted/50 transition-colors group"
              >
                <div className={`p-2 sm:p-3 rounded-xl ${categoryColors[transaction.category]}`}>
                  <Icon className="w-4 h-4 sm:w-5 sm:h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium truncate text-sm sm:text-base">{transaction.description}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge variant="outline" className="text-xs">
                      {transaction.category}
                    </Badge>
                    <span className="text-xs text-muted-foreground hidden sm:inline">
                      {new Date(transaction.date).toLocaleDateString()}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-2 sm:gap-3">
                  <p
                    className={`text-base sm:text-lg font-bold ${
                      isIncome ? "text-accent" : "text-foreground"
                    }`}
                  >
                    {isIncome ? "+" : "-"}${Math.abs(transaction.amount).toFixed(2)}
                  </p>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onDeleteTransaction(transaction.id)}
                    className="opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity"
                  >
                    <Trash2 className="w-4 h-4 text-destructive" />
                  </Button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </Card>
  );
};
