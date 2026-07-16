import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { motion } from "framer-motion";
import { PiggyBank, Plus, Trash2, AlertTriangle } from "lucide-react";
import { getBudgets, saveBudget, deleteBudget } from "../services/miscService";
import { EXPENSE_CATEGORIES } from "../constants/categories";
import GlassCard from "../components/ui/GlassCard";
import Modal from "../components/ui/Modal";
import ConfirmDialog from "../components/ui/ConfirmDialog";
import EmptyState from "../components/ui/EmptyState";
import Input from "../components/ui/Input";
import Select from "../components/ui/Select";
import { formatCurrency } from "../utils/formatters";

const monthKey = () => {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
};

const BUDGET_CATEGORY_OPTIONS = [{ label: "Overall", icon: "📊" }, ...EXPENSE_CATEGORIES];

const Budget = () => {
  const [budgets, setBudgets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formOpen, setFormOpen] = useState(false);
  const [deleting, setDeleting] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({ category: "Overall", limit: "" });

  const fetchData = async () => {
    setLoading(true);
    try {
      const { data } = await getBudgets(monthKey());
      setBudgets(data.data);
    } catch (err) {
      toast.error(err.response?.data?.message || "Could not load budgets.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.limit || Number(form.limit) <= 0) {
      toast.error("Enter a valid budget limit.");
      return;
    }
    setSubmitting(true);
    try {
      await saveBudget({ category: form.category, limit: Number(form.limit), month: monthKey() });
      toast.success("Budget saved");
      setFormOpen(false);
      setForm({ category: "Overall", limit: "" });
      fetchData();
    } catch (err) {
      toast.error(err.response?.data?.message || "Could not save budget.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    setSubmitting(true);
    try {
      await deleteBudget(deleting._id);
      toast.success("Budget removed");
      setDeleting(null);
      fetchData();
    } catch (err) {
      toast.error(err.response?.data?.message || "Could not delete budget.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-5">
        <p className="text-sm text-ink-muted">Set spending limits and track how you're doing this month.</p>
        <button onClick={() => setFormOpen(true)} className="btn-primary">
          <Plus size={15} /> New Budget
        </button>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="glass-card p-5 h-32 animate-pulse" />
          ))}
        </div>
      ) : budgets.length ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {budgets.map((b, i) => {
            const meta = BUDGET_CATEGORY_OPTIONS.find((c) => c.label === b.category);
            return (
              <motion.div
                key={b._id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="glass-card p-5"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2.5">
                    <span className="text-xl">{meta?.icon || "📊"}</span>
                    <div>
                      <p className="font-medium text-ink text-sm">{b.category}</p>
                      <p className="text-xs text-ink-faint">Monthly limit</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setDeleting(b)}
                    className="p-1.5 rounded-lg text-ink-muted hover:text-rose hover:bg-rose/10 transition-colors"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>

                <div className="flex items-baseline justify-between mb-2">
                  <span className="stat-number text-lg font-semibold text-ink">
                    {formatCurrency(b.spent)}
                  </span>
                  <span className="text-xs text-ink-muted">of {formatCurrency(b.limit)}</span>
                </div>

                <div className="h-2 rounded-full bg-white/5 overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${Math.min(100, b.percentUsed)}%` }}
                    transition={{ duration: 0.6 }}
                    className={`h-full rounded-full ${b.isExceeded ? "bg-rose" : b.percentUsed > 80 ? "bg-amber" : "bg-mint"}`}
                  />
                </div>

                {b.isExceeded ? (
                  <p className="flex items-center gap-1.5 text-xs text-rose mt-2.5">
                    <AlertTriangle size={12} /> Budget exceeded by {formatCurrency(b.spent - b.limit)}
                  </p>
                ) : (
                  <p className="text-xs text-ink-faint mt-2.5">
                    {formatCurrency(b.remaining)} remaining · {b.percentUsed}% used
                  </p>
                )}
              </motion.div>
            );
          })}
        </div>
      ) : (
        <GlassCard>
          <EmptyState
            icon={PiggyBank}
            title="No budgets set for this month"
            description="Create a category or overall budget to keep your spending in check."
            action={
              <button onClick={() => setFormOpen(true)} className="btn-primary">
                <Plus size={15} /> Create Budget
              </button>
            }
          />
        </GlassCard>
      )}

      <Modal isOpen={formOpen} onClose={() => setFormOpen(false)} title="New Budget">
        <form onSubmit={handleSubmit} className="space-y-4">
          <Select
            label="Category"
            value={form.category}
            onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}
            options={BUDGET_CATEGORY_OPTIONS.map((c) => ({ label: c.label, value: c.label, icon: c.icon }))}
          />
          <Input
            label="Monthly limit"
            type="number"
            placeholder="e.g. 10000"
            value={form.limit}
            onChange={(e) => setForm((f) => ({ ...f, limit: e.target.value }))}
          />
          <button type="submit" disabled={submitting} className="btn-primary w-full">
            {submitting ? "Saving..." : "Save Budget"}
          </button>
        </form>
      </Modal>

      <ConfirmDialog
        isOpen={!!deleting}
        onClose={() => setDeleting(null)}
        onConfirm={handleDelete}
        loading={submitting}
        title="Remove this budget?"
        description={`Your ${deleting?.category} budget for this month will be removed.`}
      />
    </div>
  );
};

export default Budget;
