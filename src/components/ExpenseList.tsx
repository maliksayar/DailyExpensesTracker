import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Edit2, Trash2, Calendar } from "lucide-react";
import { Expense, TimeFilter, DEFAULT_CATEGORIES } from "@/types/expense";

interface ExpenseListProps {
  expenses: Expense[];
  onEdit: (expense: Expense) => void;
  onDelete: (id: string) => void;
  timeFilter: TimeFilter;
  onTimeFilterChange: (filter: TimeFilter) => void;
  categoryFilter: string;
  onCategoryFilterChange: (category: string) => void;
}

export function ExpenseList({
  expenses,
  onEdit,
  onDelete,
  timeFilter,
  onTimeFilterChange,
  categoryFilter,
  onCategoryFilterChange,
}: ExpenseListProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
    });
  };

  const getCategoryInfo = (categoryId: string) => {
    return DEFAULT_CATEGORIES.find((cat) => cat.id === categoryId) || DEFAULT_CATEGORIES[7];
  };

  return (
    <div className="space-y-6">
      {/* Filters */}
      <Card className="expense-card">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <label className="text-sm font-medium text-muted-foreground mb-2 block">
              Time Period
            </label>
            <Select value={timeFilter} onValueChange={onTimeFilterChange}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="day">Today</SelectItem>
                <SelectItem value="week">This Week</SelectItem>
                <SelectItem value="month">This Month</SelectItem>
                <SelectItem value="year">This Year</SelectItem>
                <SelectItem value="all">All Time</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex-1">
            <label className="text-sm font-medium text-muted-foreground mb-2 block">
              Category
            </label>
            <Select value={categoryFilter} onValueChange={onCategoryFilterChange}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {DEFAULT_CATEGORIES.map((category) => (
                  <SelectItem key={category.id} value={category.id}>
                    <div className="flex items-center gap-2">
                      <span>{category.icon}</span>
                      <span>{category.name}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </Card>

      {/* Expense List */}
      <div className="space-y-3">
        {expenses.length === 0 ? (
          <Card className="expense-card text-center py-12">
            <div className="text-muted-foreground">
              <Calendar className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p className="text-lg font-medium">No expenses found</p>
              <p className="text-sm">Add your first expense to get started!</p>
            </div>
          </Card>
        ) : (
          expenses.map((expense) => {
            const category = getCategoryInfo(expense.category);
            return (
              <Card
                key={expense.id}
                className="expense-card hover:shadow-medium animate-slide-up group"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4 flex-1">
                    <div className="flex items-center gap-3">
                      <div className="text-2xl">{category.icon}</div>
                      <div>
                        <h3 className="font-semibold text-card-foreground group-hover:text-primary transition-fast">
                          {expense.title}
                        </h3>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge variant="secondary" className="text-xs">
                            {category.name}
                          </Badge>
                          <span className="text-sm text-muted-foreground">
                            {formatDate(expense.date)}
                          </span>
                        </div>
                        {expense.description && (
                          <p className="text-sm text-muted-foreground mt-1 line-clamp-1">
                            {expense.description}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <div className="text-xl font-bold text-destructive">
                        ${expense.amount.toFixed(2)}
                      </div>
                    </div>

                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-fast">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => onEdit(expense)}
                        className="h-8 w-8 p-0 hover:bg-primary/10 hover:text-primary"
                      >
                        <Edit2 className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => onDelete(expense.id)}
                        className="h-8 w-8 p-0 hover:bg-destructive/10 hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>
            );
          })
        )}
      </div>
    </div>
  );
}