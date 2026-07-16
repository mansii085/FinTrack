import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { formatCurrency, formatDateShort } from "../../utils/formatters";
import EmptyState from "../ui/EmptyState";
import { TrendingUp } from "lucide-react";

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="glass-panel bg-surface-elevated px-3.5 py-2.5 text-xs border border-surface-border space-y-1">
      <p className="text-ink-muted mb-1">{formatDateShort(label)}</p>
      {payload.map((p) => (
        <p key={p.dataKey} style={{ color: p.color }}>
          {p.name}: {formatCurrency(p.value)}
        </p>
      ))}
    </div>
  );
};

const TrendAreaChart = ({ data = [], height = 280 }) => {
  if (!data.length) {
    return (
      <EmptyState
        icon={TrendingUp}
        title="No transactions yet"
        description="Your income and expense trend will appear here once you add transactions."
      />
    );
  }

  return (
    <ResponsiveContainer width="100%" height={height}>
      <AreaChart data={data} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
        <defs>
          <linearGradient id="incomeGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#34E5A8" stopOpacity={0.35} />
            <stop offset="100%" stopColor="#34E5A8" stopOpacity={0} />
          </linearGradient>
          <linearGradient id="expenseGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#FB7185" stopOpacity={0.3} />
            <stop offset="100%" stopColor="#FB7185" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" vertical={false} />
        <XAxis
          dataKey="date"
          tickFormatter={formatDateShort}
          tick={{ fill: "#5B6376", fontSize: 11 }}
          axisLine={false}
          tickLine={false}
        />
        <YAxis tick={{ fill: "#5B6376", fontSize: 11 }} axisLine={false} tickLine={false} width={50} />
        <Tooltip content={<CustomTooltip />} />
        <Area
          type="monotone"
          dataKey="income"
          name="Income"
          stroke="#34E5A8"
          strokeWidth={2}
          fill="url(#incomeGrad)"
        />
        <Area
          type="monotone"
          dataKey="expense"
          name="Expense"
          stroke="#FB7185"
          strokeWidth={2}
          fill="url(#expenseGrad)"
        />
      </AreaChart>
    </ResponsiveContainer>
  );
};

export default TrendAreaChart;
