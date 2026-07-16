import asyncHandler from "express-async-handler";
import Income from "../models/Income.js";

const CATEGORY_ICONS = {
  Salary: "💼",
  Freelancing: "💻",
  Investments: "📈",
  Business: "🏢",
  Gift: "🎁",
  Other: "💰",
};

// @desc    Add income
// @route   POST /api/v1/income
// @access  Private
export const addIncome = asyncHandler(async (req, res) => {
  const { source, amount, date, category, notes } = req.body;

  const income = await Income.create({
    user: req.user._id,
    source,
    amount,
    date: date || Date.now(),
    category: category || "Other",
    notes,
    icon: CATEGORY_ICONS[category] || "💰",
  });

  res.status(201).json({ success: true, message: "Income added", data: income });
});

// @desc    Get all income (with pagination/filter/search/sort)
// @route   GET /api/v1/income
// @access  Private
export const getAllIncome = asyncHandler(async (req, res) => {
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

  if (search) query.source = { $regex: search, $options: "i" };
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
    Income.find(query)
      .sort({ [sortBy]: sortOrder === "asc" ? 1 : -1 })
      .skip((pageNum - 1) * limitNum)
      .limit(limitNum),
    Income.countDocuments(query),
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

// @desc    Delete income
// @route   DELETE /api/v1/income/:id
// @access  Private
export const deleteIncome = asyncHandler(async (req, res) => {
  const income = await Income.findOneAndDelete({ _id: req.params.id, user: req.user._id });
  if (!income) {
    res.status(404);
    throw new Error("Income record not found");
  }
  res.status(200).json({ success: true, message: "Income deleted" });
});

// @desc    Update income
// @route   PUT /api/v1/income/:id
// @access  Private
export const updateIncome = asyncHandler(async (req, res) => {
  const income = await Income.findOne({ _id: req.params.id, user: req.user._id });
  if (!income) {
    res.status(404);
    throw new Error("Income record not found");
  }

  const { source, amount, date, category, notes } = req.body;
  if (source !== undefined) income.source = source;
  if (amount !== undefined) income.amount = amount;
  if (date !== undefined) income.date = date;
  if (category !== undefined) {
    income.category = category;
    income.icon = CATEGORY_ICONS[category] || "💰";
  }
  if (notes !== undefined) income.notes = notes;

  await income.save();
  res.status(200).json({ success: true, message: "Income updated", data: income });
});

// @desc    Download income as Excel
// @route   GET /api/v1/income/download
// @access  Private
export const downloadIncomeExcel = asyncHandler(async (req, res) => {
  const XLSX = await import("xlsx");
  const income = await Income.find({ user: req.user._id }).sort({ date: -1 });

  const data = income.map((i) => ({
    Source: i.source,
    Category: i.category,
    Amount: i.amount,
    Date: new Date(i.date).toLocaleDateString(),
    Notes: i.notes || "",
  }));

  const worksheet = XLSX.utils.json_to_sheet(data);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Income");

  const buffer = XLSX.write(workbook, { type: "buffer", bookType: "xlsx" });

  res.setHeader("Content-Disposition", "attachment; filename=income_report.xlsx");
  res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
  res.send(buffer);
});
