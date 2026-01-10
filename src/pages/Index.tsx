import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PlusCircle, BarChart3, List, Wallet, LogOut, Loader2 } from "lucide-react";
import { useSupabaseExpenses } from "@/hooks/useSupabaseExpenses";
import { ExpenseForm } from "@/components/ExpenseForm";
import { ExpenseList } from "@/components/ExpenseList";
import { ExpenseDashboard } from "@/components/ExpenseDashboard";
import { ThemeToggle } from "@/components/ThemeToggle";
import { TimeFilter, Expense } from "@/types/expense";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

const Index = () => {
  const { user, signOut } = useAuth();
  const { toast } = useToast();

  const {
    expenses,
    loading,
    addExpense,
    updateExpense,
    deleteExpense,
    getFilteredExpenses,
    getExpenseStats,
  } = useSupabaseExpenses(user?.id);

  const [timeFilter, setTimeFilter] = useState<TimeFilter>("month");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null);
  const [activeTab, setActiveTab] = useState("dashboard");

  const filteredExpenses = getFilteredExpenses(timeFilter, categoryFilter);
  const stats = getExpenseStats(timeFilter, categoryFilter);

  const handleAddExpense = async (expense: Omit<Expense, "id">) => {
    await addExpense(expense);
    setActiveTab("expenses");
    toast({
      title: "Expense added",
      description: "Your expense has been saved.",
    });
  };

  const handleUpdateExpense = async (expense: Omit<Expense, "id">) => {
    if (editingExpense) {
      await updateExpense(editingExpense.id, expense);
      setEditingExpense(null);
      setActiveTab("expenses");
      toast({
        title: "Expense updated",
        description: "Your expense has been updated.",
      });
    }
  };

  const handleDeleteExpense = async (id: string) => {
    await deleteExpense(id);
    toast({
      title: "Expense deleted",
      description: "Your expense has been removed.",
    });
  };

  const handleEditExpense = (expense: Expense) => {
    setEditingExpense(expense);
    setActiveTab("add");
  };

  const handleCancelEdit = () => {
    setEditingExpense(null);
    setActiveTab("dashboard");
  };

  const handleSignOut = async () => {
    await signOut();
    toast({
      title: "Signed out",
      description: "You have been signed out successfully.",
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border/50 bg-card/50 backdrop-blur supports-[backdrop-filter]:bg-card/50">
        <div className="container mx-auto px-4 py-4">

          {/* Top row */}
          <div className="flex items-center justify-between">
            {/* Logo + Title */}
            <div className="flex items-center gap-3">
              <div className="p-2 gradient-primary rounded-xl">
                <Wallet className="h-5 w-5 text-white" />
              </div>
              <div>
                <h1 className="text-lg sm:text-2xl font-bold text-foreground">
                  Expense Tracker
                </h1>
                <p className="text-xs sm:text-sm text-muted-foreground">
                  {user?.email}
                </p>
              </div>
            </div>

            {/* Desktop actions */}
            <div className="hidden sm:flex items-center gap-3">
              <ThemeToggle />

              <Button
                onClick={() => {
                  setEditingExpense(null);
                  setActiveTab("add");
                }}
                className="gradient-primary"
              >
                <PlusCircle className="h-4 w-4 mr-2" />
                Add Expense
              </Button>

              <Button variant="outline" onClick={handleSignOut}>
                <LogOut className="h-4 w-4 mr-2" />
                Sign Out
              </Button>
            </div>
          </div>

          {/* Mobile action row */}
          <div className="mt-4 flex sm:hidden items-center justify-between gap-3">
            <ThemeToggle />

            <Button
              onClick={() => {
                setEditingExpense(null);
                setActiveTab("add");
              }}
              className="gradient-primary h-9 px-3"
            >
              <PlusCircle className="h-4 w-4" />
            </Button>

            <Button
              variant="outline"
              onClick={handleSignOut}
              className="h-9 px-3"
            >
              <LogOut className="h-4 w-4" />
            </Button>
          </div>

        </div>
      </div>


      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-8">
            <TabsTrigger value="dashboard" className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              Dashboard
            </TabsTrigger>
            <TabsTrigger value="expenses" className="flex items-center gap-2">
              <List className="h-4 w-4" />
              Expenses
            </TabsTrigger>
            <TabsTrigger value="add" className="flex items-center gap-2">
              <PlusCircle className="h-4 w-4" />
              {editingExpense ? "Edit" : "Add"} Expense
            </TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard" className="animate-fade-in">
            <ExpenseDashboard
              stats={stats}
              timeFilter={timeFilter}
              onTimeFilterChange={setTimeFilter}
            />
          </TabsContent>

          <TabsContent value="expenses" className="animate-fade-in">
            <ExpenseList
              expenses={filteredExpenses}
              onEdit={handleEditExpense}
              onDelete={handleDeleteExpense}
              timeFilter={timeFilter}
              onTimeFilterChange={setTimeFilter}
              categoryFilter={categoryFilter}
              onCategoryFilterChange={setCategoryFilter}
            />
          </TabsContent>

          <TabsContent value="add" className="animate-fade-in">
            <div className="max-w-2xl mx-auto">
              <ExpenseForm
                expense={editingExpense || undefined}
                onSubmit={editingExpense ? handleUpdateExpense : handleAddExpense}
                onCancel={editingExpense ? handleCancelEdit : undefined}
              />
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Index;
