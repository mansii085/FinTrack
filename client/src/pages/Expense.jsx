import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { ArrowDownCircle } from "lucide-react";
import { getExpenseList, addExpense, updateExpense, deleteExpense, downloadExpense } from "../services/expenseService";
import { EXPENSE_CATEGORIES } from "../constants/categories";
import FilterBar from "../components/common/FilterBar";
import Pagination from "../components/common/Pagination";
import TransactionRow from "../components/dashboard/TransactionRow";
import GlassCard from "../components/ui/GlassCard";
import Modal from "../components/ui/Modal";
import ConfirmDialog from "../components/ui/ConfirmDialog";
import TransactionForm from "../components/forms/TransactionForm";
import EmptyState from "../components/ui/EmptyState";
import { TableRowSkeleton } from "../components/ui/Skeleton";
import Input from "../components/ui/Input";

const Expense = () => {
  const [items, setItems] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, pages: 1, total: 0 });
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [dateRange, setDateRange] = useState({ startDate: "", endDate: "" });
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [deleting, setDeleting] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const fetchData = async (page = 1) => {
    setLoading(true);
    try {
      const { data } = await getExpenseList({
        page,
        limit: 10,
        search,
        category,
        ...dateRange,
      });
      setItems(data.data);
      setPagination(data.pagination);
    } catch (err) {
      toast.error(err.response?.data?.message || "Could not load expenses.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timeout = setTimeout(() => fetchData(1), 300);
    return () => clearTimeout(timeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search, category, dateRange]);

  const handleSubmit = async (values) => {
    setSubmitting(true);
    try {
      const payload = { ...values, amount: Number(values.amount) };
      if (editing) {
        await updateExpense(editing._id, payload);
        toast.success("Expense updated");
      } else {
        await addExpense(payload);
        toast.success("Expense added");
      }
      setFormOpen(false);
      setEditing(null);
      fetchData(pagination.page);
    } catch (err) {
      toast.error(err.response?.data?.message || "Could not save expense.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    setSubmitting(true);
    try {
      await deleteExpense(deleting._id);
      toast.success("Expense deleted");
      setDeleting(null);
      fetchData(pagination.page);
    } catch (err) {
      toast.error(err.response?.data?.message || "Could not delete expense.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDownload = async () => {
    try {
      const res = await downloadExpense();
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "expense_report.xlsx");
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch {
      toast.error("Could not export expense data.");
    }
  };

  return (
    <div>
      <FilterBar
        search={search}
        onSearchChange={setSearch}
        category={category}
        onCategoryChange={setCategory}
        categories={EXPENSE_CATEGORIES}
        showFilters={showFilters}
        onToggleFilters={() => setShowFilters((s) => !s)}
        onDownload={handleDownload}
        onAddNew={() => {
          setEditing(null);
          setFormOpen(true);
        }}
        addLabel="Add Expense"
      >
        <div className="grid grid-cols-2 gap-4">
          <Input
            label="From date"
            type="date"
            value={dateRange.startDate}
            onChange={(e) => setDateRange((d) => ({ ...d, startDate: e.target.value }))}
          />
          <Input
            label="To date"
            type="date"
            value={dateRange.endDate}
            onChange={(e) => setDateRange((d) => ({ ...d, endDate: e.target.value }))}
          />
        </div>
      </FilterBar>

      <GlassCard>
        {loading ? (
          <div className="divide-y divide-surface-border/50">
            {Array.from({ length: 5 }).map((_, i) => (
              <TableRowSkeleton key={i} />
            ))}
          </div>
        ) : items.length ? (
          <>
            <div className="divide-y divide-surface-border/50">
              {items.map((item) => (
                <TransactionRow
                  key={item._id}
                  item={item}
                  type="expense"
                  onEdit={() => {
                    setEditing(item);
                    setFormOpen(true);
                  }}
                  onDelete={() => setDeleting(item)}
                />
              ))}
            </div>
            <Pagination page={pagination.page} pages={pagination.pages} onChange={fetchData} />
          </>
        ) : (
          <EmptyState
            icon={ArrowDownCircle}
            title="No expenses recorded"
            description="Start tracking your spending across categories."
          />
        )}
      </GlassCard>

      <Modal
        isOpen={formOpen}
        onClose={() => {
          setFormOpen(false);
          setEditing(null);
        }}
        title={editing ? "Edit Expense" : "Add Expense"}
      >
        <TransactionForm
          type="expense"
          initialValues={editing}
          onSubmit={handleSubmit}
          submitting={submitting}
          submitLabel={editing ? "Update Expense" : "Add Expense"}
        />
      </Modal>

      <ConfirmDialog
        isOpen={!!deleting}
        onClose={() => setDeleting(null)}
        onConfirm={handleDelete}
        loading={submitting}
        title="Delete expense record?"
        description={`This will permanently remove "${deleting?.title}" from your records.`}
      />
    </div>
  );
};

export default Expense;
