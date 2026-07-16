import asyncHandler from "express-async-handler";
import Budget from "../models/Budget.js";
import Expense from "../models/Expense.js";
import { groupByCategory } from "../utils/insightsEngine.js";

const monthKey = (d = new Date()) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;

// @desc    Create or update a budget for a category+month
// @route   POST /api/v1/budget
// @access  Private
export const upsertBudget = asyncHandler(async (req, res) => {
  const { category, limit, month } = req.body;
  const targetMonth = month || monthKey();

  const budget = await Budget.findOneAndUpdate(
    { user: req.user._id, category, month: targetMonth },
    { limit },
    { new: true, upsert: true, runValidators: true, setDefaultsOnInsert: true }
  );

  res.status(200).json({ success: true, message: "Budget saved", data: budget });
});

// @desc    Get budgets with progress for a given month
// @route   GET /api/v1/budget?month=YYYY-MM
// @access  Private
export const getBudgets = asyncHandler(async (req, res) => {
  const targetMonth = req.query.month || monthKey();
  const [budgets, expenses] = await Promise.all([
    Budget.find({ user: req.user._id, month: targetMonth }),
    Expense.find({
      user: req.user._id,
      date: {
        $gte: new Date(`${targetMonth}-01T00:00:00`),
        $lte: new Date(new Date(`${targetMonth}-01`).getFullYear(), new Date(`${targetMonth}-01`).getMonth() + 1, 0, 23, 59, 59),
      },
    }),
  ]);

  const byCategory = groupByCategory(expenses);
  const totalSpent = Object.values(byCategory).reduce((a, v) => a + v, 0);

  const withProgress = budgets.map((b) => {
    const spent = b.category === "Overall" ? totalSpent : byCategory[b.category] || 0;
    return {
      ...b.toObject(),
      spent,
      remaining: Math.max(0, b.limit - spent),
      percentUsed: b.limit > 0 ? Math.round((spent / b.limit) * 100) : 0,
      isExceeded: spent > b.limit,
    };
  });

  res.status(200).json({ success: true, data: withProgress });
});

// @desc    Delete a budget
// @route   DELETE /api/v1/budget/:id
// @access  Private
export const deleteBudget = asyncHandler(async (req, res) => {
  const budget = await Budget.findOneAndDelete({ _id: req.params.id, user: req.user._id });
  if (!budget) {
    res.status(404);
    throw new Error("Budget not found");
  }
  res.status(200).json({ success: true, message: "Budget deleted" });
});
