import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useEffect } from "react";
import Input from "../ui/Input";
import Select from "../ui/Select";
import { EXPENSE_CATEGORIES, INCOME_CATEGORIES } from "../../constants/categories";
import { toInputDate } from "../../utils/formatters";

const buildSchema = (isIncome) =>
  z.object({
    [isIncome ? "source" : "title"]: z.string().min(1, isIncome ? "Source is required" : "Title is required"),
    amount: z.coerce.number().positive("Amount must be positive"),
    category: z.string().min(1, "Category is required"),
    date: z.string().min(1, "Date is required"),
    merchant: z.string().optional(),
    notes: z.string().optional(),
  });

const TransactionForm = ({ type = "expense", initialValues, onSubmit, submitting, submitLabel }) => {
  const isIncome = type === "income";
  const categories = isIncome ? INCOME_CATEGORIES : EXPENSE_CATEGORIES;
  const nameField = isIncome ? "source" : "title";

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(buildSchema(isIncome)),
    defaultValues: {
      [nameField]: initialValues?.[nameField] || "",
      amount: initialValues?.amount || "",
      category: initialValues?.category || categories[0].label,
      date: toInputDate(initialValues?.date),
      merchant: initialValues?.merchant || "",
      notes: initialValues?.notes || "",
    },
  });

  useEffect(() => {
    reset({
      [nameField]: initialValues?.[nameField] || "",
      amount: initialValues?.amount || "",
      category: initialValues?.category || categories[0].label,
      date: toInputDate(initialValues?.date),
      merchant: initialValues?.merchant || "",
      notes: initialValues?.notes || "",
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialValues]);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <Input
        label={isIncome ? "Income source" : "Expense title"}
        placeholder={isIncome ? "e.g. Monthly Salary" : "e.g. Grocery shopping"}
        error={errors[nameField]?.message}
        {...register(nameField)}
      />

      <div className="grid grid-cols-2 gap-4">
        <Input
          label="Amount"
          type="number"
          step="0.01"
          placeholder="0.00"
          error={errors.amount?.message}
          {...register("amount")}
        />
        <Select
          label="Category"
          options={categories.map((c) => ({ label: c.label, value: c.label, icon: c.icon }))}
          error={errors.category?.message}
          {...register("category")}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Input label="Date" type="date" error={errors.date?.message} {...register("date")} />
        {!isIncome && <Input label="Merchant (optional)" placeholder="e.g. Amazon" {...register("merchant")} />}
      </div>

      <Input label="Notes (optional)" placeholder="Add a short note" {...register("notes")} />

      <button type="submit" disabled={submitting} className="btn-primary w-full">
        {submitting ? "Saving..." : submitLabel || "Save"}
      </button>
    </form>
  );
};

export default TransactionForm;
