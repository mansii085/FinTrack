import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { motion } from "framer-motion";
import { Target, Plus, Trash2, CheckCircle2, Wallet } from "lucide-react";
import { getGoals, createGoal, updateGoal, deleteGoal } from "../services/miscService";
import GlassCard from "../components/ui/GlassCard";
import Modal from "../components/ui/Modal";
import ConfirmDialog from "../components/ui/ConfirmDialog";
import EmptyState from "../components/ui/EmptyState";
import Input from "../components/ui/Input";
import { formatCurrency, formatDate, toInputDate } from "../utils/formatters";

const ICONS = ["🎯", "🛡️", "🏖️", "💻", "🚗", "🏠", "🎓", "💍", "👶", "✈️"];

const Goals = () => {
  const [goals, setGoals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formOpen, setFormOpen] = useState(false);
  const [contributeTarget, setContributeTarget] = useState(null);
  const [deleting, setDeleting] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [contributionAmount, setContributionAmount] = useState("");
  const [form, setForm] = useState({ title: "", targetAmount: "", deadline: toInputDate(), icon: "🎯" });

  const fetchData = async () => {
    setLoading(true);
    try {
      const { data } = await getGoals();
      setGoals(data.data);
    } catch (err) {
      toast.error(err.response?.data?.message || "Could not load savings goals.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!form.title || !form.targetAmount) {
      toast.error("Please fill in all required fields.");
      return;
    }
    setSubmitting(true);
    try {
      await createGoal({ ...form, targetAmount: Number(form.targetAmount) });
      toast.success("Savings goal created");
      setFormOpen(false);
      setForm({ title: "", targetAmount: "", deadline: toInputDate(), icon: "🎯" });
      fetchData();
    } catch (err) {
      toast.error(err.response?.data?.message || "Could not create goal.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleContribute = async (e) => {
    e.preventDefault();
    const amount = Number(contributionAmount);
    if (!amount || amount <= 0) {
      toast.error("Enter a valid amount.");
      return;
    }
    setSubmitting(true);
    try {
      const newSaved = contributeTarget.savedAmount + amount;
      const { data } = await updateGoal(contributeTarget._id, { savedAmount: newSaved });
      if (data.data.isCompleted) toast.success("🎉 Goal achieved! Congratulations!");
      else toast.success("Contribution added");
      setContributeTarget(null);
      setContributionAmount("");
      fetchData();
    } catch (err) {
      toast.error(err.response?.data?.message || "Could not update goal.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    setSubmitting(true);
    try {
      await deleteGoal(deleting._id);
      toast.success("Goal deleted");
      setDeleting(null);
      fetchData();
    } catch (err) {
      toast.error(err.response?.data?.message || "Could not delete goal.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-5">
        <p className="text-sm text-ink-muted">Set targets and watch your savings grow.</p>
        <button onClick={() => setFormOpen(true)} className="btn-primary">
          <Plus size={15} /> New Goal
        </button>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="glass-card p-5 h-44 animate-pulse" />
          ))}
        </div>
      ) : goals.length ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {goals.map((g, i) => (
            <motion.div
              key={g._id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="glass-card p-5 relative overflow-hidden"
            >
              {g.isCompleted && (
                <span className="absolute top-4 right-4 pill bg-mint/10 text-mint">
                  <CheckCircle2 size={12} /> Achieved
                </span>
              )}
              <div className="flex items-center gap-3 mb-4">
                <span className="text-2xl">{g.icon}</span>
                <div>
                  <p className="font-medium text-ink">{g.title}</p>
                  <p className="text-xs text-ink-faint">Target: {formatDate(g.deadline)}</p>
                </div>
              </div>

              <div className="flex items-baseline justify-between mb-2">
                <span className="stat-number text-lg font-semibold text-ink">
                  {formatCurrency(g.savedAmount)}
                </span>
                <span className="text-xs text-ink-muted">of {formatCurrency(g.targetAmount)}</span>
              </div>

              <div className="h-2 rounded-full bg-white/5 overflow-hidden mb-1">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${g.progress}%` }}
                  transition={{ duration: 0.6 }}
                  className="h-full rounded-full bg-gradient-to-r from-mint to-indigo"
                />
              </div>
              <p className="text-xs text-ink-faint mb-4">{g.progress}% complete</p>

              <div className="flex items-center gap-2">
                {!g.isCompleted && (
                  <button onClick={() => setContributeTarget(g)} className="btn-secondary flex-1">
                    <Wallet size={13} /> Add Funds
                  </button>
                )}
                <button
                  onClick={() => setDeleting(g)}
                  className="p-2 rounded-xl border border-surface-border text-ink-muted hover:text-rose hover:bg-rose/10 transition-colors"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      ) : (
        <GlassCard>
          <EmptyState
            icon={Target}
            title="No savings goals yet"
            description="Create your first goal — an emergency fund, a trip, or a big purchase."
            action={
              <button onClick={() => setFormOpen(true)} className="btn-primary">
                <Plus size={15} /> Create Goal
              </button>
            }
          />
        </GlassCard>
      )}

      <Modal isOpen={formOpen} onClose={() => setFormOpen(false)} title="New Savings Goal">
        <form onSubmit={handleCreate} className="space-y-4">
          <Input
            label="Goal title"
            placeholder="e.g. Emergency Fund"
            value={form.title}
            onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
          />
          <Input
            label="Target amount"
            type="number"
            placeholder="e.g. 100000"
            value={form.targetAmount}
            onChange={(e) => setForm((f) => ({ ...f, targetAmount: e.target.value }))}
          />
          <Input
            label="Deadline"
            type="date"
            value={form.deadline}
            onChange={(e) => setForm((f) => ({ ...f, deadline: e.target.value }))}
          />
          <div>
            <label className="label-text">Icon</label>
            <div className="flex flex-wrap gap-2">
              {ICONS.map((icon) => (
                <button
                  type="button"
                  key={icon}
                  onClick={() => setForm((f) => ({ ...f, icon }))}
                  className={`w-9 h-9 rounded-lg flex items-center justify-center text-lg border transition-colors ${
                    form.icon === icon ? "border-mint bg-mint/10" : "border-surface-border hover:bg-white/5"
                  }`}
                >
                  {icon}
                </button>
              ))}
            </div>
          </div>
          <button type="submit" disabled={submitting} className="btn-primary w-full">
            {submitting ? "Creating..." : "Create Goal"}
          </button>
        </form>
      </Modal>

      <Modal isOpen={!!contributeTarget} onClose={() => setContributeTarget(null)} title="Add Funds">
        <form onSubmit={handleContribute} className="space-y-4">
          <p className="text-sm text-ink-muted">
            Contributing towards <span className="text-ink font-medium">{contributeTarget?.title}</span>
          </p>
          <Input
            label="Amount"
            type="number"
            placeholder="e.g. 5000"
            value={contributionAmount}
            onChange={(e) => setContributionAmount(e.target.value)}
          />
          <button type="submit" disabled={submitting} className="btn-primary w-full">
            {submitting ? "Adding..." : "Add Funds"}
          </button>
        </form>
      </Modal>

      <ConfirmDialog
        isOpen={!!deleting}
        onClose={() => setDeleting(null)}
        onConfirm={handleDelete}
        loading={submitting}
        title="Delete this goal?"
        description={`"${deleting?.title}" and its progress will be permanently removed.`}
      />
    </div>
  );
};

export default Goals;
