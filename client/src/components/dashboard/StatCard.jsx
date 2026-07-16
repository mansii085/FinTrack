import { motion } from "framer-motion";
import { useCountUp } from "../../hooks/useCountUp";
import { formatCurrency } from "../../utils/formatters";

const StatCard = ({ label, value, currency = "INR", icon: Icon, accent = "mint", suffix, delay = 0, isPercent = false }) => {
  const animated = useCountUp(value, 800);
  const accentClasses = {
    mint: "bg-mint/10 text-mint",
    indigo: "bg-indigo/10 text-indigo",
    rose: "bg-rose/10 text-rose",
    amber: "bg-amber/10 text-amber",
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay }}
      whileHover={{ y: -3 }}
      className="glass-card p-5"
    >
      <div className="flex items-center justify-between mb-3">
        <p className="text-xs font-medium tracking-wide text-ink-muted uppercase">{label}</p>
        {Icon && (
          <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${accentClasses[accent]}`}>
            <Icon size={15} />
          </div>
        )}
      </div>
      <p className="stat-number text-2xl font-semibold text-ink">
        {isPercent ? `${animated}%` : formatCurrency(animated, currency)}
        {suffix && <span className="text-sm text-ink-muted ml-1 font-body">{suffix}</span>}
      </p>
    </motion.div>
  );
};

export default StatCard;
