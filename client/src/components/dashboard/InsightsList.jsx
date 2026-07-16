import { motion } from "framer-motion";
import { TrendingUp, TrendingDown, Info, Gauge } from "lucide-react";

const ICONS = {
  positive: { Icon: TrendingUp, cls: "text-mint bg-mint/10" },
  warning: { Icon: TrendingDown, cls: "text-rose bg-rose/10" },
  info: { Icon: Info, cls: "text-indigo bg-indigo/10" },
  score: { Icon: Gauge, cls: "text-amber bg-amber/10" },
};

const InsightsList = ({ insights = [] }) => {
  if (!insights.length) {
    return <p className="text-sm text-ink-muted py-4">Add a few transactions and we'll surface insights here.</p>;
  }

  return (
    <div className="space-y-2">
      {insights.map((insight, i) => {
        const conf = ICONS[insight.type] || ICONS.info;
        return (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: i * 0.05 }}
            className="flex items-start gap-3 p-3 rounded-xl bg-white/[0.02] border border-surface-border/60"
          >
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${conf.cls}`}>
              <conf.Icon size={15} />
            </div>
            <p className="text-sm text-ink-muted leading-relaxed pt-1">{insight.message}</p>
          </motion.div>
        );
      })}
    </div>
  );
};

export default InsightsList;
