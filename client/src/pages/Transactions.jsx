import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Receipt } from "lucide-react";
import { getIncomeList } from "../services/incomeService";
import { getExpenseList } from "../services/expenseService";
import { EXPENSE_CATEGORIES, INCOME_CATEGORIES } from "../constants/categories";
import FilterBar from "../components/common/FilterBar";
import TransactionRow from "../components/dashboard/TransactionRow";
import GlassCard from "../components/ui/GlassCard";
import EmptyState from "../components/ui/EmptyState";
import { TableRowSkeleton } from "../components/ui/Skeleton";
import Select from "../components/ui/Select";

const ALL_CATEGORIES = [...INCOME_CATEGORIES, ...EXPENSE_CATEGORIES];

const Transactions = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [showFilters, setShowFilters] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [incomeRes, expenseRes] = await Promise.all([
        typeFilter === "expense" ? Promise.resolve(null) : getIncomeList({ search, category, limit: 50 }),
        typeFilter === "income" ? Promise.resolve(null) : getExpenseList({ search, category, limit: 50 }),
      ]);

      const income = incomeRes ? incomeRes.data.data.map((i) => ({ ...i, type: "income" })) : [];
      const expense = expenseRes ? expenseRes.data.data.map((e) => ({ ...e, type: "expense" })) : [];

      const combined = [...income, ...expense].sort((a, b) => new Date(b.date) - new Date(a.date));
      setItems(combined);
    } catch (err) {
      toast.error(err.response?.data?.message || "Could not load transactions.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timeout = setTimeout(fetchData, 300);
    return () => clearTimeout(timeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search, category, typeFilter]);

  return (
    <div>
      <FilterBar
        search={search}
        onSearchChange={setSearch}
        category={category}
        onCategoryChange={setCategory}
        categories={ALL_CATEGORIES}
        showFilters={showFilters}
        onToggleFilters={() => setShowFilters((s) => !s)}
      >
        <Select
          label="Transaction type"
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
          options={[
            { label: "All types", value: "" },
            { label: "Income only", value: "income" },
            { label: "Expense only", value: "expense" },
          ]}
          className="max-w-xs"
        />
      </FilterBar>

      <GlassCard>
        {loading ? (
          <div className="divide-y divide-surface-border/50">
            {Array.from({ length: 6 }).map((_, i) => (
              <TableRowSkeleton key={i} />
            ))}
          </div>
        ) : items.length ? (
          <div className="divide-y divide-surface-border/50">
            {items.map((item) => (
              <TransactionRow key={item._id} item={item} type={item.type} />
            ))}
          </div>
        ) : (
          <EmptyState
            icon={Receipt}
            title="No transactions found"
            description="Try adjusting your search or filters."
          />
        )}
      </GlassCard>
    </div>
  );
};

export default Transactions;
