import { Link, NavLink } from "react-router-dom";
import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/clerk-react";
import { Button } from "../ui/button";
import { cn } from "@/lib/utils";

export const Header = () => {
  const navLinks = [
    { label: "Dashboard", to: "/" },
    { label: "Transactions", to: "/transactions" },
    { label: "Analytics", to: "/analytics" },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-zinc-200 bg-white dark:border-zinc-800 dark:bg-black">
      <div className="container flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-6">
          <Link to="/" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-black dark:bg-white">
              <span className="text-xl font-bold text-white dark:text-black">F</span>
            </div>
            <span className="hidden text-xl font-bold text-foreground sm:block">FinanceQuest</span>
          </Link>

          <nav className="hidden items-center gap-1 md:flex">
            {navLinks.map((item) => (
              <Button key={item.to} variant="ghost" asChild className="px-3">
                <NavLink
                  to={item.to}
                  className={({ isActive }) =>
                    cn(
                      "rounded-md px-2 py-1 text-sm text-foreground/70 hover:bg-muted hover:text-foreground",
                      isActive && "bg-muted text-foreground"
                    )
                  }
                >
                  {item.label}
                </NavLink>
              </Button>
            ))}
          </nav>
        </div>

        <div className="flex items-center gap-3">
          <SignedOut>
            <SignInButton mode="modal">
              <Button variant="outline" className="px-4">Sign in</Button>
            </SignInButton>
          </SignedOut>
          <SignedIn>
            <UserButton afterSignOutUrl="/sign-in" />
          </SignedIn>
        </div>
      </div>
    </header>
  );
};