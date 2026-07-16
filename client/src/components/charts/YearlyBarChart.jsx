import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { formatCurrency } from "../../utils/formatters";

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="glass-panel bg-surface-elevated px-3.5 py-2.5 text-xs border border-surface-border space-y-1">
      <p className="text-ink-muted mb-1">{label}</p>
      {payload.map((p) => (
        <p key={p.dataKey} style={{ color: p.color }}>
          {p.name}: {formatCurrency(p.value)}
        </p>
      ))}
    </div>
  );
};

const YearlyBarChart = ({ data = [], height = 280 }) => (
  <ResponsiveContainer width="100%" height={height}>
    <BarChart data={data} margin={{ top: 10, right: 10, left: -10, bottom: 0 }} barGap={4}>
      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" vertical={false} />
      <XAxis dataKey="month" tick={{ fill: "#5B6376", fontSize: 11 }} axisLine={false} tickLine={false} />
      <YAxis tick={{ fill: "#5B6376", fontSize: 11 }} axisLine={false} tickLine={false} width={50} />
      <Tooltip content={<CustomTooltip />} cursor={{ fill: "rgba(255,255,255,0.03)" }} />
      <Bar dataKey="income" name="Income" fill="#34E5A8" radius={[4, 4, 0, 0]} maxBarSize={14} />
      <Bar dataKey="expense" name="Expense" fill="#818CF8" radius={[4, 4, 0, 0]} maxBarSize={14} />
    </BarChart>
  </ResponsiveContainer>
);

export default YearlyBarChart;
