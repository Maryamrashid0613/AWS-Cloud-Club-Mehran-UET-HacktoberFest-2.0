export interface UserGoals {
  monthlyBudgetLimit: number;
  savingsGoal: number;
  categories: {
    [key: string]: number; // Category-specific budget limits
  };
}

export interface UserPoints {
  total: number;
  level: number;
  history: {
    points: number;
    reason: string;
    date: string;
  }[];
}

// Point calculation rules
export const POINT_RULES = {
  TRANSACTION_ADDED: 5, // Base points for tracking a transaction
  UNDER_BUDGET: 20, // Stay under category budget
  SAVINGS_MILESTONE: 50, // Reach a savings milestone
  STREAK_BONUS: 10, // Daily tracking streak
  FIRST_TRANSACTION: 25, // First transaction of the day
  COMPLETE_PROFILE: 100, // One-time bonus for completing profile
} as const;

// Level thresholds
export const LEVEL_THRESHOLDS = [
  0, // Level 1
  100, // Level 2
  250, // Level 3
  500, // Level 4
  1000, // Level 5
  2000, // Level 6
  3500, // Level 7
  5000, // Level 8
  7500, // Level 9
  10000, // Level 10
];