import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Wallet, TrendingUp, TrendingDown, PiggyBank, Plus, ArrowDownCircle, ArrowUpCircle } from "lucide-react";
import { getDashboardData, getInsights, getAnalytics } from "../services/dashboardService";
import { addIncome } from "../services/incomeService";
import { addExpense } from "../services/expenseService";
import BalancePulse from "../components/dashboard/BalancePulse";
import StatCard from "../components/dashboard/StatCard";
import TransactionRow from "../components/dashboard/TransactionRow";
import InsightsList from "../components/dashboard/InsightsList";
import CategoryPieChart from "../components/charts/CategoryPieChart";
import GlassCard from "../components/ui/GlassCard";
import Modal from "../components/ui/Modal";
import TransactionForm from "../components/forms/TransactionForm";
import EmptyState from "../components/ui/EmptyState";
import { CardSkeleton } from "../components/ui/Skeleton";
import { Receipt } from "lucide-react";

const Dashboard = () => {
  const [summary, setSummary] = useState(null);
  const [insights, setInsights] = useState([]);
  const [healthScore, setHealthScore] = useState(null);
  const [categoryData, setCategoryData] = useState([]);
  const [balanceTrend, setBalanceTrend] = useState([]);
  const [loading, setLoading] = useState(true);
  const [quickAddType, setQuickAddType] = useState(null); // "income" | "expense" | null
  const [submitting, setSubmitting] = useState(false);

  const loadAll = async () => {
    setLoading(true);
    try {
      const [dashRes, insightsRes, analyticsRes] = await Promise.all([
        getDashboardData(),
        getInsights(),
        getAnalytics(30),
      ]);
      const dashData = dashRes.data.data;
      setSummary(dashData);
      setInsights(insightsRes.data.data.insights);
      setHealthScore(insightsRes.data.data.healthScore);
      setCategoryData(analyticsRes.data.data.categoryPieData);

      // Build a real cumulative-balance sparkline from the last 30 days,
      // zero-filling days with no transactions so the line stays flat
      // when nothing happened and only moves on days with real activity.
      const RANGE_DAYS = 30;
      const trend = analyticsRes.data.data.trend || [];
      const byDate = Object.fromEntries(trend.map((t) => [t.date, t]));

      const netOverRange = trend.reduce((a, t) => a + (t.income - t.expense), 0);
      let running = (dashData.totalBalance || 0) - netOverRange;

      const today = new Date();
      const dailyBalances = [running]; // starting point, RANGE_DAYS ago
      for (let i = RANGE_DAYS - 1; i >= 0; i--) {
        const d = new Date(today);
        d.setDate(d.getDate() - i);
        const key = d.toISOString().slice(0, 10);
        const day = byDate[key];
        if (day) running += day.income - day.expense;
        dailyBalances.push(running);
      }
      setBalanceTrend(dailyBalances);
    } catch (err) {
      toast.error(err.response?.data?.message || "Could not load dashboard data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAll();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleQuickAdd = async (values) => {
    setSubmitting(true);
    try {
      const payload = { ...values, amount: Number(values.amount) };
      if (quickAddType === "income") await addIncome(payload);
      else await addExpense(payload);
      toast.success(`${quickAddType === "income" ? "Income" : "Expense"} added`);
      setQuickAddType(null);
      loadAll();
    } catch (err) {
      toast.error(err.response?.data?.message || "Could not save transaction.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-5">
        <div className="h-40 rounded-xl2 bg-white/5 animate-pulse" />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <CardSkeleton key={i} />
          ))}
        </div>
      </div>
    );
  }

  // Real balance history when we have at least a couple of days of data;
  // otherwise fall back to a flat baseline (no fake up/down movement).
  const sparkline = balanceTrend.length >= 2 ? balanceTrend : [summary?.totalBalance || 0, summary?.totalBalance || 0];

  return (
    <div className="space-y-6">
      {/* Quick add buttons */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-ink-muted">Here's your financial overview.</p>
        <div className="flex gap-2">
          <button onClick={() => setQuickAddType("income")} className="btn-secondary">
            <ArrowUpCircle size={15} className="text-mint" /> Add Income
          </button>
          <button onClick={() => setQuickAddType("expense")} className="btn-primary">
            <ArrowDownCircle size={15} /> Add Expense
          </button>
        </div>
      </div>

      {/* Signature balance card */}
      <BalancePulse
        balance={summary?.totalBalance || 0}
        trendPositive={(summary?.savings || 0) >= 0}
        sparkline={sparkline}
      />

      {/* Stat grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard label="Monthly Income" value={summary?.monthlyIncome} icon={TrendingUp} accent="mint" delay={0.05} />
        <StatCard label="Monthly Expense" value={summary?.monthlyExpense} icon={TrendingDown} accent="rose" delay={0.1} />
        <StatCard label="Savings" value={summary?.savings} icon={PiggyBank} accent="indigo" delay={0.15} />
        <StatCard label="Expense Ratio" value={summary?.expenseRatio} icon={Wallet} accent="amber" isPercent delay={0.2} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Recent transactions */}
        <GlassCard className="lg:col-span-2" delay={0.1}>
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-display font-semibold text-ink">Recent Transactions</h3>
            <Plus size={16} className="text-ink-faint" />
          </div>
          {summary?.recentTransactions?.length ? (
            <div className="divide-y divide-surface-border/50">
              {summary.recentTransactions.map((t) => (
                <TransactionRow key={t._id} item={t} type={t.type} />
              ))}
            </div>
          ) : (
            <EmptyState
              icon={Receipt}
              title="No transactions yet"
              description="Add your first income or expense to see it here."
            />
          )}
        </GlassCard>

        {/* Category breakdown */}
        <GlassCard delay={0.15}>
          <h3 className="font-display font-semibold text-ink mb-3">Spending by Category</h3>
          <CategoryPieChart data={categoryData} height={230} />
        </GlassCard>
      </div>

      {/* Smart insights */}
      <GlassCard delay={0.2}>
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-display font-semibold text-ink">Smart Finance Insights</h3>
          {healthScore !== null && (
            <span className="pill bg-amber/10 text-amber">Health Score: {healthScore}/100</span>
          )}
        </div>
        <InsightsList insights={insights} />
      </GlassCard>

      {/* Quick add modal */}
      <Modal
        isOpen={!!quickAddType}
        onClose={() => setQuickAddType(null)}
        title={quickAddType === "income" ? "Add Income" : "Add Expense"}
      >
        {quickAddType && (
          <TransactionForm type={quickAddType} onSubmit={handleQuickAdd} submitting={submitting} />
        )}
      </Modal>
    </div>
  );
};

export default Dashboard;
