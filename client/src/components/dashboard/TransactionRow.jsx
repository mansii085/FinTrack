import { motion } from "framer-motion";
import { Trash2, Pencil, ArrowUpRight, ArrowDownRight } from "lucide-react";
import { formatCurrency, formatDate } from "../../utils/formatters";
import CategoryBadge from "../common/CategoryBadge";

const TransactionRow = ({ item, type, onEdit, onDelete, index = 0 }) => {
  const isIncome = type === "income";
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.03 }}
      className="flex items-center gap-4 py-3.5 px-2 rounded-xl hover:bg-white/[0.03] transition-colors group"
    >
      <div
        className={`w-10 h-10 rounded-full flex items-center justify-center text-lg shrink-0 ${
          isIncome ? "bg-mint/10" : "bg-rose/10"
        }`}
      >
        {item.icon || (isIncome ? "💰" : "🧾")}
      </div>

      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-ink truncate">{item.source || item.title}</p>
        <div className="flex items-center gap-2 mt-1">
          <CategoryBadge category={item.category} icon={item.icon} />
          <span className="text-xs text-ink-faint">{formatDate(item.date)}</span>
        </div>
      </div>

      <div className="flex items-center gap-3 shrink-0">
        <span className={`stat-number text-sm font-semibold flex items-center gap-1 ${isIncome ? "text-mint" : "text-rose"}`}>
          {isIncome ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
          {formatCurrency(item.amount)}
        </span>
        {(onEdit || onDelete) && (
          <div className="hidden group-hover:flex items-center gap-1">
            {onEdit && (
              <button
                onClick={() => onEdit(item)}
                className="p-1.5 rounded-lg text-ink-muted hover:text-mint hover:bg-mint/10 transition-colors"
              >
                <Pencil size={13} />
              </button>
            )}
            {onDelete && (
              <button
                onClick={() => onDelete(item)}
                className="p-1.5 rounded-lg text-ink-muted hover:text-rose hover:bg-rose/10 transition-colors"
              >
                <Trash2 size={13} />
              </button>
            )}
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default TransactionRow;
