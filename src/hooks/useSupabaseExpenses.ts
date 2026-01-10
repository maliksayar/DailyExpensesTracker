import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/lib/supabase";
import { Expense, ExpenseStats, TimeFilter } from "@/types/expense";
import { startOfWeek, endOfWeek, format, subMonths, startOfMonth, endOfMonth } from "date-fns";

export function useSupabaseExpenses(userId?: string) {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch expenses from Supabase
  const fetchExpenses = useCallback(async () => {
    if (!userId) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('expenses')
        .select('*')
        .eq('user_id', userId)
        .order('date', { ascending: false });

      if (error) throw error;

      setExpenses(data.map(item => ({
        id: item.id,
        title: item.title,
        amount: item.amount,
        category: item.category,
        date: item.date,
        description: item.description || undefined,
        expense_type: item.expense_type || undefined,
        payment_mode: item.payment_mode || undefined,
      })));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch expenses');
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    fetchExpenses();
  }, [fetchExpenses]);

  const addExpense = useCallback(async (expense: Omit<Expense, "id">) => {
    if (!userId) return;

    try {
      const { data, error } = await supabase
        .from('expenses')
        .insert({
          user_id: userId,
          title: expense.title,
          amount: expense.amount,
          category: expense.category,
          date: expense.date,
          description: expense.description || null,
          expense_type: expense.expense_type || null,
          payment_mode: expense.payment_mode || null,
        })
        .select()
        .single();

      if (error) throw error;

      const newExpense: Expense = {
        id: data.id,
        title: data.title,
        amount: data.amount,
        category: data.category,
        date: data.date,
        description: data.description || undefined,
        expense_type: data.expense_type || undefined,
        payment_mode: data.payment_mode || undefined,
      };

      setExpenses(prev => [newExpense, ...prev]);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add expense');
    }
  }, [userId]);

  const updateExpense = useCallback(async (id: string, updates: Partial<Expense>) => {
    try {
      const { error } = await supabase
        .from('expenses')
        .update({
          title: updates.title,
          amount: updates.amount,
          category: updates.category,
          date: updates.date,
          description: updates.description || null,
          expense_type: updates.expense_type || null,
          payment_mode: updates.payment_mode || null,
        })
        .eq('id', id);

      if (error) throw error;

      setExpenses(prev =>
        prev.map(expense =>
          expense.id === id ? { ...expense, ...updates } : expense
        )
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update expense');
    }
  }, []);

  const deleteExpense = useCallback(async (id: string) => {
    try {
      const { error } = await supabase
        .from('expenses')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setExpenses(prev => prev.filter(expense => expense.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete expense');
    }
  }, []);

  const getFilteredExpenses = useCallback(
    (timeFilter: TimeFilter, categoryFilter?: string) => {
      let filtered = expenses;

      if (categoryFilter && categoryFilter !== "all") {
        filtered = filtered.filter(expense => expense.category === categoryFilter);
      }

      const now = new Date();
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

      switch (timeFilter) {
        case "day":
          filtered = filtered.filter(expense => new Date(expense.date) >= today);
          break;
        case "week":
          const weekStart = startOfWeek(now, { weekStartsOn: 1 });
          filtered = filtered.filter(expense => new Date(expense.date) >= weekStart);
          break;
        case "month":
          const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
          filtered = filtered.filter(expense => new Date(expense.date) >= monthStart);
          break;
        case "year":
          const yearStart = new Date(now.getFullYear(), 0, 1);
          filtered = filtered.filter(expense => new Date(expense.date) >= yearStart);
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

      let days = 1;
      if (timeFilter === "week") days = 7;
      else if (timeFilter === "month") {
        const now = new Date();
        days = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
      } else if (timeFilter === "year") {
        days = 365;
      }

      const categoryBreakdown = filteredExpenses.reduce((acc, expense) => {
        acc[expense.category] = (acc[expense.category] || 0) + expense.amount;
        return acc;
      }, {} as Record<string, number>);

      // Monthly data for charts (last 6 months)
      const monthlyData: { month: string; amount: number }[] = [];
      for (let i = 5; i >= 0; i--) {
        const monthDate = subMonths(new Date(), i);
        const monthStart = startOfMonth(monthDate);
        const monthEnd = endOfMonth(monthDate);
        
        const monthTotal = expenses
          .filter(e => {
            const expenseDate = new Date(e.date);
            return expenseDate >= monthStart && expenseDate <= monthEnd;
          })
          .reduce((sum, e) => sum + e.amount, 0);
        
        monthlyData.push({
          month: format(monthDate, 'MMM'),
          amount: monthTotal,
        });
      }

      // Weekly data (current week)
      const weeklyData: { day: string; amount: number }[] = [];
      const weekStart = startOfWeek(new Date(), { weekStartsOn: 1 });
      const days_of_week = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
      
      for (let i = 0; i < 7; i++) {
        const dayDate = new Date(weekStart);
        dayDate.setDate(weekStart.getDate() + i);
        const dayStr = format(dayDate, 'yyyy-MM-dd');
        
        const dayTotal = expenses
          .filter(e => e.date === dayStr)
          .reduce((sum, e) => sum + e.amount, 0);
        
        weeklyData.push({
          day: days_of_week[i],
          amount: dayTotal,
        });
      }

      return {
        totalAmount,
        expenseCount: filteredExpenses.length,
        averagePerDay: totalAmount / days,
        categoryBreakdown,
        monthlyData,
        weeklyData,
      };
    },
    [getFilteredExpenses, expenses]
  );

  return {
    expenses,
    loading,
    error,
    addExpense,
    updateExpense,
    deleteExpense,
    getFilteredExpenses,
    getExpenseStats,
    refetch: fetchExpenses,
  };
}
