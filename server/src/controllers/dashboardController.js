import asyncHandler from "express-async-handler";
import Income from "../models/Income.js";
import Expense from "../models/Expense.js";
import Budget from "../models/Budget.js";
import SavingsGoal from "../models/SavingsGoal.js";
import { generateInsights, groupByCategory, calculateFinancialHealthScore } from "../utils/insightsEngine.js";

const startOfMonth = (d = new Date()) => new Date(d.getFullYear(), d.getMonth(), 1);
const endOfMonth = (d = new Date()) => new Date(d.getFullYear(), d.getMonth() + 1, 0, 23, 59, 59);
const monthKey = (d = new Date()) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;

// @desc    Dashboard summary — balance, monthly income/expense, savings, recent transactions
// @route   GET /api/v1/dashboard
// @access  Private
export const getDashboardData = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const now = new Date();
  const monthStart = startOfMonth(now);
  const monthEnd = endOfMonth(now);

  const [allIncome, allExpense] = await Promise.all([
    Income.find({ user: userId }),
    Expense.find({ user: userId }),
  ]);

  const totalIncome = allIncome.reduce((a, i) => a + i.amount, 0);
  const totalExpense = allExpense.reduce((a, e) => a + e.amount, 0);
  const balance = totalIncome - totalExpense;

  const monthlyIncome = allIncome
    .filter((i) => i.date >= monthStart && i.date <= monthEnd)
    .reduce((a, i) => a + i.amount, 0);
  const monthlyExpense = allExpense
    .filter((e) => e.date >= monthStart && e.date <= monthEnd)
    .reduce((a, e) => a + e.amount, 0);

  const savings = monthlyIncome - monthlyExpense;
  const expenseRatio = monthlyIncome > 0 ? Math.round((monthlyExpense / monthlyIncome) * 100) : 0;

  const last30Days = new Date();
  last30Days.setDate(last30Days.getDate() - 30);

  const recentIncome = [...allIncome]
    .sort((a, b) => b.date - a.date)
    .slice(0, 5)
    .map((i) => ({ ...i.toObject(), type: "income" }));
  const recentExpense = [...allExpense]
    .sort((a, b) => b.date - a.date)
    .slice(0, 5)
    .map((e) => ({ ...e.toObject(), type: "expense" }));

  const recentTransactions = [...recentIncome, ...recentExpense]
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 8);

  res.status(200).json({
    success: true,
    data: {
      totalBalance: balance,
      totalIncome,
      totalExpense,
      monthlyIncome,
      monthlyExpense,
      savings,
      expenseRatio,
      recentTransactions,
      last30DaysIncomeCount: allIncome.filter((i) => i.date >= last30Days).length,
      last30DaysExpenseCount: allExpense.filter((e) => e.date >= last30Days).length,
    },
  });
});

// @desc    Analytics: trends over last N days, category breakdown, yearly comparison
// @route   GET /api/v1/dashboard/analytics
// @access  Private
export const getAnalytics = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const range = Number(req.query.range) || 30;

  const since = new Date();
  since.setDate(since.getDate() - range);

  const [incomeInRange, expenseInRange, allExpense, allIncome] = await Promise.all([
    Income.find({ user: userId, date: { $gte: since } }).sort({ date: 1 }),
    Expense.find({ user: userId, date: { $gte: since } }).sort({ date: 1 }),
    Expense.find({ user: userId }),
    Income.find({ user: userId }),
  ]);

  // Category-wise pie data
  const categoryBreakdown = groupByCategory(expenseInRange);
  const categoryPieData = Object.entries(categoryBreakdown).map(([name, value]) => ({ name, value }));

  // Daily trend (income vs expense)
  const trendMap = {};
  incomeInRange.forEach((i) => {
    const key = new Date(i.date).toISOString().slice(0, 10);
    trendMap[key] = trendMap[key] || { date: key, income: 0, expense: 0 };
    trendMap[key].income += i.amount;
  });
  expenseInRange.forEach((e) => {
    const key = new Date(e.date).toISOString().slice(0, 10);
    trendMap[key] = trendMap[key] || { date: key, income: 0, expense: 0 };
    trendMap[key].expense += e.amount;
  });
  const trend = Object.values(trendMap).sort((a, b) => new Date(a.date) - new Date(b.date));

  // Top spending categories
  const topCategories = Object.entries(categoryBreakdown)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([category, amount]) => ({ category, amount }));

  // Yearly comparison (last 12 months, income vs expense)
  const yearly = [];
  for (let i = 11; i >= 0; i--) {
    const d = new Date();
    d.setMonth(d.getMonth() - i);
    const mStart = startOfMonth(d);
    const mEnd = endOfMonth(d);
    yearly.push({
      month: d.toLocaleString("default", { month: "short", year: "2-digit" }),
      income: allIncome.filter((x) => x.date >= mStart && x.date <= mEnd).reduce((a, x) => a + x.amount, 0),
      expense: allExpense.filter((x) => x.date >= mStart && x.date <= mEnd).reduce((a, x) => a + x.amount, 0),
    });
  }

  res.status(200).json({
    success: true,
    data: { categoryPieData, trend, topCategories, yearly },
  });
});

// @desc    Smart finance insights
// @route   GET /api/v1/dashboard/insights
// @access  Private
export const getInsights = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const now = new Date();
  const prevMonthDate = new Date(now.getFullYear(), now.getMonth() - 1, 1);

  const currentStart = startOfMonth(now);
  const currentEnd = endOfMonth(now);
  const prevStart = startOfMonth(prevMonthDate);
  const prevEnd = endOfMonth(prevMonthDate);

  const [currentExpenses, previousExpenses, currentIncome, previousIncome, goals, budgets] = await Promise.all([
    Expense.find({ user: userId, date: { $gte: currentStart, $lte: currentEnd } }),
    Expense.find({ user: userId, date: { $gte: prevStart, $lte: prevEnd } }),
    Income.find({ user: userId, date: { $gte: currentStart, $lte: currentEnd } }),
    Income.find({ user: userId, date: { $gte: prevStart, $lte: prevEnd } }),
    SavingsGoal.find({ user: userId, isCompleted: true }),
    Budget.find({ user: userId, month: monthKey(now) }),
  ]);

  const insights = generateInsights({ currentExpenses, previousExpenses, currentIncome, previousIncome });

  // Budget breach detection
  let budgetBreaches = 0;
  const currentByCategory = groupByCategory(currentExpenses);
  budgets.forEach((b) => {
    const spent = b.category === "Overall"
      ? Object.values(currentByCategory).reduce((a, v) => a + v, 0)
      : currentByCategory[b.category] || 0;
    if (spent > b.limit) {
      budgetBreaches += 1;
      insights.unshift({
        type: "warning",
        message: `You've exceeded your ${b.category} budget of ₹${b.limit.toLocaleString("en-IN")} this month.`,
      });
    }
  });

  const totalIncome = currentIncome.reduce((a, i) => a + i.amount, 0);
  const totalExpense = currentExpenses.reduce((a, e) => a + e.amount, 0);
  const healthScore = calculateFinancialHealthScore({
    income: totalIncome,
    expense: totalExpense,
    savingsGoalsCompleted: goals.length,
    budgetBreaches,
  });

  res.status(200).json({ success: true, data: { insights, healthScore } });
});
