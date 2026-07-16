

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";
import { EXPENSE_CATEGORIES } from "../../constants/categories";
import { formatCurrency } from "../../utils/formatters";
import EmptyState from "../ui/EmptyState";
import { PieChart as PieIcon } from "lucide-react";

const getColor = (name) => EXPENSE_CATEGORIES.find((c) => c.label === name)?.color || "#8A93A6";

const CustomTooltip = ({ active, payload }) => {
  if (!active || !payload?.length) return null;
  const item = payload[0];
  return (
    <div className="glass-panel bg-surface-elevated px-3 py-2 text-xs border border-surface-border">
      <p className="text-ink font-medium">{item.name}</p>
      <p className="text-ink-muted">{formatCurrency(item.value)}</p>
    </div>
  );
};

const CategoryPieChart = ({ data = [], height = 260 }) => {
  if (!data.length) {
    return <EmptyState icon={PieIcon} title="No expense data" description="Add expenses to see the category breakdown." />;
  }

  // Build the legend payload explicitly so each dot's color is locked to
  // the same getColor(name) mapping used by the slices — regardless of
  // data order or how many categories are present.
  const legendPayload = data.map((entry) => ({
    value: entry.name,
    type: "circle",
    color: getColor(entry.name),
  }));

  return (
    <ResponsiveContainer width="100%" height={height}>
      <PieChart>
        <Pie
          data={data}
          dataKey="value"
          nameKey="name"
          innerRadius="60%"
          outerRadius="85%"
          paddingAngle={3}
          strokeWidth={0}
        >
          {data.map((entry) => (
            <Cell key={entry.name} fill={getColor(entry.name)} />
          ))}
        </Pie>
        <Tooltip content={<CustomTooltip />} />
        <Legend
          verticalAlign="bottom"
          height={36}
          iconType="circle"
          iconSize={8}
          payload={legendPayload}
          wrapperStyle={{ fontSize: "11px", color: "#8A93A6" }}
        />
      </PieChart>
    </ResponsiveContainer>
  );
};

export default CategoryPieChart;
