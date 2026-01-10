export interface Expense {
  id: string;
  title: string;
  amount: number;
  category: string;
  date: string;
  description?: string;
  expense_type?: string;
  payment_mode?: string;
}

export interface ExpenseCategory {
  id: string;
  name: string;
  icon: string;
  color: string;
}

export const DEFAULT_CATEGORIES: ExpenseCategory[] = [
  { id: "food", name: "Food & Dining", icon: "🍽️", color: "hsl(25 95% 53%)" },
  { id: "transport", name: "Transportation", icon: "🚗", color: "hsl(217 91% 60%)" },
  { id: "shopping", name: "Shopping", icon: "🛍️", color: "hsl(270 95% 75%)" },
  { id: "entertainment", name: "Entertainment", icon: "🎬", color: "hsl(340 82% 52%)" },
  { id: "health", name: "Healthcare", icon: "🏥", color: "hsl(142 76% 36%)" },
  { id: "bills", name: "Bills & Utilities", icon: "⚡", color: "hsl(45 93% 47%)" },
  { id: "education", name: "Education", icon: "📚", color: "hsl(188 78% 41%)" },
  { id: "rent", name: "Rent & Housing", icon: "🏠", color: "hsl(200 70% 50%)" },
  { id: "travel", name: "Travel", icon: "✈️", color: "hsl(280 60% 55%)" },
  { id: "medical", name: "Medical", icon: "💊", color: "hsl(0 70% 50%)" },
  { id: "other", name: "Other", icon: "📦", color: "hsl(215 20% 65%)" },
];

export const EXPENSE_TYPES = [
  "Food",
  "Travel", 
  "Rent",
  "Shopping",
  "Medical",
  "Entertainment",
  "Education",
  "Bills",
  "Transportation",
  "Other",
] as const;

export const PAYMENT_MODES = [
  "Cash",
  "Card",
  "UPI",
  "Bank Transfer",
  "Wallet",
] as const;

export type ExpenseType = typeof EXPENSE_TYPES[number];
export type PaymentMode = typeof PAYMENT_MODES[number];

export type TimeFilter = "day" | "week" | "month" | "year" | "all";

export interface ExpenseStats {
  totalAmount: number;
  expenseCount: number;
  averagePerDay: number;
  categoryBreakdown: Record<string, number>;
  monthlyData?: { month: string; amount: number }[];
  weeklyData?: { day: string; amount: number }[];
}
