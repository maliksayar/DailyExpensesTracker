import { useState, useEffect, useCallback } from "react";
import { Expense, ExpenseStats, TimeFilter } from "@/types/expense";

const STORAGE_KEY = "expense-tracker-data";

export function useExpenses() {
  const [expenses, setExpenses] = useState<Expense[]>([]);

  // Load expenses from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        const data = JSON.parse(stored);
        setExpenses(data);
      } catch (error) {
        console.error("Failed to load expenses:", error);
      }
    }
  }, []);

  // Save expenses to localStorage whenever expenses change
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(expenses));
  }, [expenses]);

  const addExpense = useCallback((expense: Omit<Expense, "id">) => {
    const newExpense: Expense = {
      ...expense,
      id: crypto.randomUUID(),
    };
    setExpenses((prev) => [newExpense, ...prev]);
  }, []);

  const updateExpense = useCallback((id: string, updates: Partial<Expense>) => {
    setExpenses((prev) =>
      prev.map((expense) =>
        expense.id === id ? { ...expense, ...updates } : expense
      )
    );
  }, []);

  const deleteExpense = useCallback((id: string) => {
    setExpenses((prev) => prev.filter((expense) => expense.id !== id));
  }, []);

  const getFilteredExpenses = useCallback(
    (timeFilter: TimeFilter, categoryFilter?: string) => {
      let filtered = expenses;

      // Filter by category
      if (categoryFilter && categoryFilter !== "all") {
        filtered = filtered.filter((expense) => expense.category === categoryFilter);
      }

      // Filter by time
      const now = new Date();
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

      switch (timeFilter) {
        case "day":
          filtered = filtered.filter((expense) => {
            const expenseDate = new Date(expense.date);
            return expenseDate >= today;
          });
          break;
        case "week":
          const weekAgo = new Date(today);
          weekAgo.setDate(today.getDate() - 7);
          filtered = filtered.filter((expense) => {
            const expenseDate = new Date(expense.date);
            return expenseDate >= weekAgo;
          });
          break;
        case "month":
          const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
          filtered = filtered.filter((expense) => {
            const expenseDate = new Date(expense.date);
            return expenseDate >= monthStart;
          });
          break;
        case "all":
        default:
          // No time filtering
          break;
      }

      return filtered.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    },
    [expenses]
  );

  const getExpenseStats = useCallback(
    (timeFilter: TimeFilter, categoryFilter?: string): ExpenseStats => {
      const filteredExpenses = getFilteredExpenses(timeFilter, categoryFilter);
      const totalAmount = filteredExpenses.reduce((sum, expense) => sum + expense.amount, 0);
      
      // Calculate days for average
      let days = 1;
      if (timeFilter === "week") days = 7;
      else if (timeFilter === "month") {
        const now = new Date();
        days = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
      }

      const categoryBreakdown = filteredExpenses.reduce((acc, expense) => {
        acc[expense.category] = (acc[expense.category] || 0) + expense.amount;
        return acc;
      }, {} as Record<string, number>);

      return {
        totalAmount,
        expenseCount: filteredExpenses.length,
        averagePerDay: totalAmount / days,
        categoryBreakdown,
      };
    },
    [getFilteredExpenses]
  );

  return {
    expenses,
    addExpense,
    updateExpense,
    deleteExpense,
    getFilteredExpenses,
    getExpenseStats,
  };
}