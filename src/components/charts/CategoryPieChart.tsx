import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";
import { Card } from "@/components/ui/card";
import { DEFAULT_CATEGORIES } from "@/types/expense";

interface CategoryPieChartProps {
  categoryBreakdown: Record<string, number>;
}

export function CategoryPieChart({ categoryBreakdown }: CategoryPieChartProps) {
  const data = Object.entries(categoryBreakdown)
    .filter(([_, amount]) => amount > 0)
    .map(([categoryId, amount]) => {
      const category = DEFAULT_CATEGORIES.find((c) => c.id === categoryId) || DEFAULT_CATEGORIES[10];
      return {
        name: category.name,
        value: amount,
        color: category.color,
        icon: category.icon,
      };
    })
    .sort((a, b) => b.value - a.value);

  if (data.length === 0) {
    return (
      <Card className="expense-card h-[350px] flex items-center justify-center">
        <p className="text-muted-foreground">No expense data to display</p>
      </Card>
    );
  }

  const total = data.reduce((sum, item) => sum + item.value, 0);

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const item = payload[0].payload;
      const percentage = ((item.value / total) * 100).toFixed(1);
      return (
        <div className="bg-popover border border-border rounded-lg shadow-lg p-3">
          <p className="font-semibold text-popover-foreground">
            {item.icon} {item.name}
          </p>
          <p className="text-sm text-muted-foreground">
            ${item.value.toFixed(2)} ({percentage}%)
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <Card className="expense-card">
      <h3 className="text-lg font-semibold text-card-foreground mb-4">
        Spending by Category
      </h3>
      <div className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={100}
              paddingAngle={2}
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
            <Legend
              formatter={(value, entry: any) => (
                <span className="text-sm text-muted-foreground">{value}</span>
              )}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}
