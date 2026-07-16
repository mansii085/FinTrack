import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { motion } from "framer-motion";
import { getAnalytics } from "../services/dashboardService";
import GlassCard from "../components/ui/GlassCard";
import TrendAreaChart from "../components/charts/TrendAreaChart";
import CategoryPieChart from "../components/charts/CategoryPieChart";
import YearlyBarChart from "../components/charts/YearlyBarChart";
import { formatCurrency } from "../utils/formatters";
import Select from "../components/ui/Select";

const RANGES = [
  { label: "Last 7 days", value: 7 },
  { label: "Last 30 days", value: 30 },
  { label: "Last 60 days", value: 60 },
  { label: "Last 90 days", value: 90 },
];

const Analytics = () => {
  const [range, setRange] = useState(30);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const { data } = await getAnalytics(range);
        setData(data.data);
      } catch (err) {
        toast.error(err.response?.data?.message || "Could not load analytics.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [range]);

  return (
    <div className="space-y-5">
      <div className="flex justify-end">
        <Select
          value={range}
          onChange={(e) => setRange(Number(e.target.value))}
          options={RANGES}
          className="max-w-[180px]"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <GlassCard className="lg:col-span-2">
          <h3 className="font-display font-semibold text-ink mb-4">Income vs Expense Trend</h3>
          {!loading && <TrendAreaChart data={data?.trend || []} />}
        </GlassCard>

        <GlassCard>
          <h3 className="font-display font-semibold text-ink mb-4">Category Breakdown</h3>
          {!loading && <CategoryPieChart data={data?.categoryPieData || []} height={230} />}
        </GlassCard>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <GlassCard className="lg:col-span-2">
          <h3 className="font-display font-semibold text-ink mb-4">Yearly Cash Flow Comparison</h3>
          {!loading && <YearlyBarChart data={data?.yearly || []} />}
        </GlassCard>

        <GlassCard>
          <h3 className="font-display font-semibold text-ink mb-4">Top Spending Categories</h3>
          <div className="space-y-3">
            {(data?.topCategories || []).map((c, i) => (
              <motion.div
                key={c.category}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
                className="flex items-center justify-between"
              >
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-white/5 flex items-center justify-center text-xs text-ink-muted">
                    {i + 1}
                  </span>
                  <span className="text-sm text-ink">{c.category}</span>
                </div>
                <span className="stat-number text-sm font-medium text-ink-muted">
                  {formatCurrency(c.amount)}
                </span>
              </motion.div>
            ))}
            {!loading && !data?.topCategories?.length && (
              <p className="text-sm text-ink-muted py-2">No spending data for this range yet.</p>
            )}
          </div>
        </GlassCard>
      </div>
    </div>
  );
};

export default Analytics;
