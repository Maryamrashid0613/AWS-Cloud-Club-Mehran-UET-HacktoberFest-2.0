import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  WalletCards,
  PiggyBank,
  BarChart3,
  Target,
  Settings,
  Trophy,
} from "lucide-react";
import { ScrollArea } from "../ui/scroll-area";
import { Button } from "../ui/button";
import { UserButton } from "@clerk/clerk-react";

const sidebarLinks = [
  {
    title: "Dashboard",
    icon: LayoutDashboard,
    href: "/",
  },
  {
    title: "Transactions",
    icon: WalletCards,
    href: "/transactions",
  },
  {
    title: "Savings",
    icon: PiggyBank,
    href: "/savings",
  },
  {
    title: "Analytics",
    icon: BarChart3,
    href: "/analytics",
  },
  {
    title: "Goals",
    icon: Target,
    href: "/goals",
  },
  {
    title: "Achievements",
    icon: Trophy,
    href: "/achievements",
  },
  {
    title: "Settings",
    icon: Settings,
    href: "/settings",
  },
];

export function Sidebar() {
  const location = useLocation();

  return (
    <div className="flex h-full flex-col gap-2">
      <div className="flex h-16 items-center border-b border-zinc-200 dark:border-zinc-800 px-6">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-black dark:bg-white flex items-center justify-center">
            <span className="text-white dark:text-black font-bold text-xl">F</span>
          </div>
          <span className="text-xl font-semibold text-black dark:text-white">FinanceQuest</span>
        </div>
      </div>
      <ScrollArea className="flex-1 px-3">
        <div className="space-y-1 py-2">
          {sidebarLinks.map((link) => (
            <Button
              key={link.href}
              variant={location.pathname === link.href ? "secondary" : "ghost"}
              className={cn(
                "w-full justify-start gap-2",
                location.pathname === link.href && "bg-accent"
              )}
              asChild
            >
              <Link to={link.href}>
                <link.icon className="h-5 w-5" />
                {link.title}
              </Link>
            </Button>
          ))}
        </div>
      </ScrollArea>
      <div className="border-t p-4">
        <div className="flex items-center justify-between">
          <UserButton afterSignOutUrl="/sign-in" />
          <div className="flex flex-col items-end">
            <span className="text-sm font-medium">Pro Plan</span>
            <span className="text-xs text-muted-foreground">Yearly</span>
          </div>
        </div>
      </div>
    </div>
  )};