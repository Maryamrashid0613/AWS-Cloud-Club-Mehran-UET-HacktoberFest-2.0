import { Transaction } from "@/components/TransactionList";
import { POINT_RULES, LEVEL_THRESHOLDS, UserGoals, UserPoints } from "./types";

export class PointsService {
  static calculateLevel(points: number): number {
    return LEVEL_THRESHOLDS.findIndex((threshold) => points < threshold) || LEVEL_THRESHOLDS.length;
  }

  static async awardPoints(
    userId: string,
    transaction: Transaction,
    currentGoals: UserGoals,
    currentPoints: UserPoints
  ): Promise<number> {
    let pointsEarned = POINT_RULES.TRANSACTION_ADDED;
    const reasons: string[] = ["Transaction tracked"];

    // Check if it's the first transaction of the day
    const isFirstToday = await this.isFirstTransactionOfDay(userId);
    if (isFirstToday) {
      pointsEarned += POINT_RULES.FIRST_TRANSACTION;
      reasons.push("First transaction of the day");
    }

    // Check if under budget for category
    if (transaction.type === "expense") {
      const categoryTotal = await this.getCategoryTotal(userId, transaction.category);
      const categoryBudget = currentGoals.categories[transaction.category];
      if (categoryBudget && (categoryTotal + transaction.amount) <= categoryBudget) {
        pointsEarned += POINT_RULES.UNDER_BUDGET;
        reasons.push("Stayed under category budget");
      }
    }

    // Check savings milestone
    if (transaction.type === "income") {
      const currentSavings = await this.getCurrentSavings(userId);
      const savingsGoal = currentGoals.savingsGoal;
      if (savingsGoal > 0) {
        const oldProgress = (currentSavings / savingsGoal) * 100;
        const newProgress = ((currentSavings + transaction.amount) / savingsGoal) * 100;
        if (Math.floor(newProgress / 25) > Math.floor(oldProgress / 25)) {
          pointsEarned += POINT_RULES.SAVINGS_MILESTONE;
          reasons.push("Reached savings milestone");
        }
      }
    }

    // Update points in database
    await this.updateUserPoints(userId, pointsEarned, reasons.join(", "));

    return pointsEarned;
  }

  // These methods would interact with your Firebase database
  private static async isFirstTransactionOfDay(userId: string): Promise<boolean> {
    // TODO: Implement with Firebase
    return true;
  }

  private static async getCategoryTotal(userId: string, category: string): Promise<number> {
    // TODO: Implement with Firebase
    return 0;
  }

  private static async getCurrentSavings(userId: string): Promise<number> {
    // TODO: Implement with Firebase
    return 0;
  }

  private static async updateUserPoints(userId: string, points: number, reason: string): Promise<void> {
    // TODO: Implement with Firebase
  }
}

export class GoalsService {
  static async updateGoals(userId: string, goals: UserGoals): Promise<void> {
    // TODO: Implement with Firebase
  }

  static async checkGoalAchievement(
    userId: string,
    transaction: Transaction,
    currentGoals: UserGoals
  ): Promise<{
    achieved: boolean;
    type: string;
    message: string;
  }> {
    // Monthly budget check
    if (transaction.type === "expense") {
      const monthlyTotal = await this.getMonthlyTotal(userId);
      if (monthlyTotal <= currentGoals.monthlyBudgetLimit) {
        return {
          achieved: true,
          type: "budget",
          message: "You're staying within your monthly budget!"
        };
      }
    }

    // Savings goal check
    if (transaction.type === "income") {
      const currentSavings = await this.getCurrentSavings(userId);
      const progress = (currentSavings / currentGoals.savingsGoal) * 100;
      if (progress >= 100) {
        return {
          achieved: true,
          type: "savings",
          message: "Congratulations! You've reached your savings goal!"
        };
      }
    }

    return {
      achieved: false,
      type: "",
      message: ""
    };
  }

  private static async getMonthlyTotal(userId: string): Promise<number> {
    // TODO: Implement with Firebase
    return 0;
  }

  private static async getCurrentSavings(userId: string): Promise<number> {
    // TODO: Implement with Firebase
    return 0;
  }
}