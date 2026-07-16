import asyncHandler from "express-async-handler";
import Expense from "../models/Expense.js";

const CATEGORY_ICONS = {
  Food: "🍔",
  Travel: "✈️",
  Shopping: "🛍️",
  Entertainment: "🎬",
  Education: "📚",
  Medical: "💊",
  Subscriptions: "🔁",
  Bills: "🧾",
  Others: "📦",
};

// @desc    Add expense
// @route   POST /api/v1/expense
// @access  Private
export const addExpense = asyncHandler(async (req, res) => {
  const { title, amount, date, category, merchant, notes } = req.body;

  const expense = await Expense.create({
    user: req.user._id,
    title,
    amount,
    date: date || Date.now(),
    category: category || "Others",
    merchant,
    notes,
    icon: CATEGORY_ICONS[category] || "📦",
  });

  res.status(201).json({ success: true, message: "Expense added", data: expense });
});

// @desc    Get all expenses (with pagination/filter/search/sort)
// @route   GET /api/v1/expense
// @access  Private
export const getAllExpense = asyncHandler(async (req, res) => {
  const {
    page = 1,
    limit = 10,
    search = "",
    category,
    startDate,
    endDate,
    minAmount,
    maxAmount,
    sortBy = "date",
    sortOrder = "desc",
  } = req.query;

  const query = { user: req.user._id };

  if (search) query.title = { $regex: search, $options: "i" };
  if (category) query.category = category;
  if (startDate || endDate) {
    query.date = {};
    if (startDate) query.date.$gte = new Date(startDate);
    if (endDate) query.date.$lte = new Date(endDate);
  }
  if (minAmount || maxAmount) {
    query.amount = {};
    if (minAmount) query.amount.$gte = Number(minAmount);
    if (maxAmount) query.amount.$lte = Number(maxAmount);
  }

  const pageNum = Math.max(1, Number(page));
  const limitNum = Math.max(1, Number(limit));

  const [items, total] = await Promise.all([
    Expense.find(query)
      .sort({ [sortBy]: sortOrder === "asc" ? 1 : -1 })
      .skip((pageNum - 1) * limitNum)
      .limit(limitNum),
    Expense.countDocuments(query),
  ]);

  res.status(200).json({
    success: true,
    data: items,
    pagination: {
      total,
      page: pageNum,
      pages: Math.ceil(total / limitNum),
      limit: limitNum,
    },
  });
});

// @desc    Delete expense
// @route   DELETE /api/v1/expense/:id
// @access  Private
export const deleteExpense = asyncHandler(async (req, res) => {
  const expense = await Expense.findOneAndDelete({ _id: req.params.id, user: req.user._id });
  if (!expense) {
    res.status(404);
    throw new Error("Expense record not found");
  }
  res.status(200).json({ success: true, message: "Expense deleted" });
});

// @desc    Update expense
// @route   PUT /api/v1/expense/:id
// @access  Private
export const updateExpense = asyncHandler(async (req, res) => {
  const expense = await Expense.findOne({ _id: req.params.id, user: req.user._id });
  if (!expense) {
    res.status(404);
    throw new Error("Expense record not found");
  }

  const { title, amount, date, category, merchant, notes } = req.body;
  if (title !== undefined) expense.title = title;
  if (amount !== undefined) expense.amount = amount;
  if (date !== undefined) expense.date = date;
  if (category !== undefined) {
    expense.category = category;
    expense.icon = CATEGORY_ICONS[category] || "📦";
  }
  if (merchant !== undefined) expense.merchant = merchant;
  if (notes !== undefined) expense.notes = notes;

  await expense.save();
  res.status(200).json({ success: true, message: "Expense updated", data: expense });
});

// @desc    Download expense as Excel
// @route   GET /api/v1/expense/download
// @access  Private
export const downloadExpenseExcel = asyncHandler(async (req, res) => {
  const XLSX = await import("xlsx");
  const expenses = await Expense.find({ user: req.user._id }).sort({ date: -1 });

  const data = expenses.map((e) => ({
    Title: e.title,
    Category: e.category,
    Amount: e.amount,
    Merchant: e.merchant || "",
    Date: new Date(e.date).toLocaleDateString(),
    Notes: e.notes || "",
  }));

  const worksheet = XLSX.utils.json_to_sheet(data);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Expenses");

  const buffer = XLSX.write(workbook, { type: "buffer", bookType: "xlsx" });

  res.setHeader("Content-Disposition", "attachment; filename=expense_report.xlsx");
  res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
  res.send(buffer);
});
