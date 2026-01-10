import { Card } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ExpenseStats, TimeFilter, DEFAULT_CATEGORIES } from "@/types/expense";
import { TrendingUp, TrendingDown, DollarSign, Calendar, PieChart } from "lucide-react";
import { CategoryPieChart } from "./charts/CategoryPieChart";
import { MonthlyLineChart } from "./charts/MonthlyLineChart";
import { WeeklyBarChart } from "./charts/WeeklyBarChart";

interface ExpenseDashboardProps {
  stats: ExpenseStats;
  timeFilter: TimeFilter;
  onTimeFilterChange: (filter: TimeFilter) => void;
}

export function ExpenseDashboard({ stats, timeFilter, onTimeFilterChange }: ExpenseDashboardProps) {
  const getTimeLabel = (filter: TimeFilter) => {
    switch (filter) {
      case "day": return "Today";
      case "week": return "This Week";
      case "month": return "This Month";
      case "year": return "This Year";
      case "all": return "All Time";
      default: return "Total";
    }
  };

  const sortedCategories = Object.entries(stats.categoryBreakdown)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5);

  const getCategoryInfo = (categoryId: string) => {
    return DEFAULT_CATEGORIES.find((cat) => cat.id === categoryId) || DEFAULT_CATEGORIES[10];
  };

  return (
    <div className="space-y-6">
      {/* Time Filter */}
      <Card className="expense-card">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-primary" />
            <span className="font-medium text-card-foreground">View Period</span>
          </div>
          <Select value={timeFilter} onValueChange={onTimeFilterChange}>
            <SelectTrigger className="w-40">
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
      </Card>

      {/* Main Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="stat-card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Total Spent {getTimeLabel(timeFilter)}
              </p>
              <p className="text-3xl font-bold text-destructive">
                ${stats.totalAmount.toFixed(2)}
              </p>
            </div>
            <div className="p-3 bg-destructive/10 rounded-xl">
              <DollarSign className="h-6 w-6 text-destructive" />
            </div>
          </div>
        </Card>

        <Card className="stat-card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Total Expenses
              </p>
              <p className="text-3xl font-bold text-card-foreground">
                {stats.expenseCount}
              </p>
            </div>
            <div className="p-3 bg-primary/10 rounded-xl">
              <PieChart className="h-6 w-6 text-primary" />
            </div>
          </div>
        </Card>

        <Card className="stat-card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Daily Average
              </p>
              <p className="text-3xl font-bold text-card-foreground">
                ${stats.averagePerDay.toFixed(2)}
              </p>
            </div>
            <div className="p-3 bg-accent/10 rounded-xl">
              <TrendingUp className="h-6 w-6 text-accent" />
            </div>
          </div>
        </Card>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <CategoryPieChart categoryBreakdown={stats.categoryBreakdown} />
        <MonthlyLineChart data={stats.monthlyData || []} />
      </div>

      <WeeklyBarChart data={stats.weeklyData || []} />

      {/* Category Breakdown */}
      {sortedCategories.length > 0 && (
        <Card className="expense-card">
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-card-foreground mb-2">
              Top Spending Categories
            </h3>
            <p className="text-sm text-muted-foreground">
              Your highest expense categories {getTimeLabel(timeFilter).toLowerCase()}
            </p>
          </div>

          <div className="space-y-4">
            {sortedCategories.map(([categoryId, amount]) => {
              const category = getCategoryInfo(categoryId);
              const percentage = stats.totalAmount > 0 ? (amount / stats.totalAmount) * 100 : 0;
              
              return (
                <div key={categoryId} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="text-lg">{category.icon}</span>
                      <span className="font-medium text-card-foreground">
                        {category.name}
                      </span>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold text-destructive">
                        ${amount.toFixed(2)}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {percentage.toFixed(1)}%
                      </div>
                    </div>
                  </div>
                  
                  <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-500 ease-out"
                      style={{ 
                        width: `${percentage}%`,
                        backgroundColor: category.color
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          {Object.keys(stats.categoryBreakdown).length > 5 && (
            <div className="mt-4 pt-4 border-t border-border">
              <p className="text-sm text-muted-foreground text-center">
                +{Object.keys(stats.categoryBreakdown).length - 5} more categories
              </p>
            </div>
          )}
        </Card>
      )}

      {/* Quick Insights */}
      {stats.expenseCount > 0 && (
        <Card className="expense-card bg-gradient-to-br from-primary/5 to-accent/5 border-primary/20">
          <div className="flex items-start gap-3">
            <div className="p-2 bg-primary/10 rounded-lg mt-1">
              <TrendingDown className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h4 className="font-semibold text-card-foreground mb-1">
                Spending Insights
              </h4>
              <div className="space-y-1 text-sm text-muted-foreground">
                <p>
                  You've made <strong className="text-card-foreground">{stats.expenseCount}</strong> expense{stats.expenseCount !== 1 ? 's' : ''} {getTimeLabel(timeFilter).toLowerCase()}
                </p>
                {sortedCategories[0] && (
                  <p>
                    Most spending in <strong className="text-card-foreground">
                      {getCategoryInfo(sortedCategories[0][0]).name}
                    </strong> (${sortedCategories[0][1].toFixed(2)})
                  </p>
                )}
                <p>
                  Average expense: <strong className="text-card-foreground">
                    ${stats.expenseCount > 0 ? (stats.totalAmount / stats.expenseCount).toFixed(2) : '0.00'}
                  </strong>
                </p>
              </div>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
}
