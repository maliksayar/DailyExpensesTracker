import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import { Plus, Save } from "lucide-react";
import { Expense, DEFAULT_CATEGORIES, EXPENSE_TYPES, PAYMENT_MODES } from "@/types/expense";

interface ExpenseFormProps {
  expense?: Expense;
  onSubmit: (expense: Omit<Expense, "id">) => void;
  onCancel?: () => void;
}

export function ExpenseForm({ expense, onSubmit, onCancel }: ExpenseFormProps) {
  const [formData, setFormData] = useState({
    title: expense?.title || "",
    amount: expense?.amount?.toString() || "",
    category: expense?.category || "",
    date: expense?.date || new Date().toISOString().split("T")[0],
    description: expense?.description || "",
    expense_type: expense?.expense_type || "",
    payment_mode: expense?.payment_mode || "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title || !formData.amount || !formData.category) {
      return;
    }

    onSubmit({
      title: formData.title,
      amount: parseFloat(formData.amount),
      category: formData.category,
      date: formData.date,
      description: formData.description,
      expense_type: formData.expense_type,
      payment_mode: formData.payment_mode,
    });

    // Reset form if not editing
    if (!expense) {
      setFormData({
        title: "",
        amount: "",
        category: "",
        date: new Date().toISOString().split("T")[0],
        description: "",
        expense_type: "",
        payment_mode: "",
      });
    }
  };

  const isEditing = !!expense;

  return (
    <Card className="expense-card animate-fade-in">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="flex items-center gap-2 mb-6">
          {isEditing ? (
            <Save className="h-5 w-5 text-primary" />
          ) : (
            <Plus className="h-5 w-5 text-primary" />
          )}
          <h2 className="text-xl font-semibold text-card-foreground">
            {isEditing ? "Edit Expense" : "Add New Expense"}
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title *</Label>
            <Input
              id="title"
              placeholder="e.g., Lunch at restaurant"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="transition-fast focus:ring-2 focus:ring-primary"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="amount">Amount ($) *</Label>
            <Input
              id="amount"
              type="number"
              step="0.01"
              min="0"
              placeholder="0.00"
              value={formData.amount}
              onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
              className="transition-fast focus:ring-2 focus:ring-primary"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="category">Category *</Label>
            <Select
              value={formData.category}
              onValueChange={(value) => setFormData({ ...formData, category: value })}
            >
              <SelectTrigger className="transition-fast focus:ring-2 focus:ring-primary">
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
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

          <div className="space-y-2">
            <Label htmlFor="expense_type">Expense Type</Label>
            <Select
              value={formData.expense_type}
              onValueChange={(value) => setFormData({ ...formData, expense_type: value })}
            >
              <SelectTrigger className="transition-fast focus:ring-2 focus:ring-primary">
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                {EXPENSE_TYPES.map((type) => (
                  <SelectItem key={type} value={type}>
                    {type}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="payment_mode">Payment Mode</Label>
            <Select
              value={formData.payment_mode}
              onValueChange={(value) => setFormData({ ...formData, payment_mode: value })}
            >
              <SelectTrigger className="transition-fast focus:ring-2 focus:ring-primary">
                <SelectValue placeholder="Select payment method" />
              </SelectTrigger>
              <SelectContent>
                {PAYMENT_MODES.map((mode) => (
                  <SelectItem key={mode} value={mode}>
                    {mode}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="date">Date *</Label>
            <Input
              id="date"
              type="date"
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              className="transition-fast focus:ring-2 focus:ring-primary"
              required
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">Notes (Optional)</Label>
          <Textarea
            id="description"
            placeholder="Additional notes about this expense..."
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            className="transition-fast focus:ring-2 focus:ring-primary resize-none"
            rows={3}
          />
        </div>

        <div className="flex gap-3 pt-4">
          <Button
            type="submit"
            className="flex-1 gradient-primary text-white hover:opacity-90 transition-fast"
          >
            {isEditing ? "Update Expense" : "Add Expense"}
          </Button>
          {onCancel && (
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              className="transition-fast"
            >
              Cancel
            </Button>
          )}
        </div>
      </form>
    </Card>
  );
}
