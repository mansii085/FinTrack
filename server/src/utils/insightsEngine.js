/**
 * Insights Engine
 * Generates human-readable financial insights purely from the user's own
 * income/expense data using deterministic statistics — no external AI calls.
 */

const DAY_NAMES = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

const sum = (arr) => arr.reduce((acc, n) => acc + n, 0);

export function groupByCategory(expenses) {
  const map = {};
  for (const e of expenses) {
    map[e.category] = (map[e.category] || 0) + e.amount;
  }
  return map;
}

export function generateInsights({ currentExpenses, previousExpenses, currentIncome, previousIncome }) {
  const insights = [];

  const currentTotal = sum(currentExpenses.map((e) => e.amount));
  const previousTotal = sum(previousExpenses.map((e) => e.amount));
  const currentIncomeTotal = sum(currentIncome.map((i) => i.amount));
  const previousIncomeTotal = sum(previousIncome.map((i) => i.amount));

  // 1. Category-wise month-over-month comparison
  const currentByCategory = groupByCategory(currentExpenses);
  const previousByCategory = groupByCategory(previousExpenses);

  Object.entries(currentByCategory).forEach(([category, amount]) => {
    const prevAmount = previousByCategory[category] || 0;
    if (prevAmount > 0) {
      const changePct = Math.round(((amount - prevAmount) / prevAmount) * 100);
      if (Math.abs(changePct) >= 20) {
        insights.push({
          type: changePct > 0 ? "warning" : "positive",
          message: `You spent ${Math.abs(changePct)}% ${changePct > 0 ? "more" : "less"} on ${category} this month compared to last month.`,
        });
      }
    } else if (amount > 0) {
      insights.push({
        type: "info",
        message: `New spending category this month: ${category} (₹${amount.toLocaleString("en-IN")}).`,
      });
    }
  });

  // 2. Highest spending day of week
  if (currentExpenses.length > 0) {
    const dayTotals = new Array(7).fill(0);
    currentExpenses.forEach((e) => {
      const day = new Date(e.date).getDay();
      dayTotals[day] += e.amount;
    });
    const maxDay = dayTotals.indexOf(Math.max(...dayTotals));
    if (dayTotals[maxDay] > 0) {
      insights.push({
        type: "info",
        message: `Your highest spending day of the week is ${DAY_NAMES[maxDay]}.`,
      });
    }
  }

  // 3. Average daily spending
  if (currentExpenses.length > 0) {
    const now = new Date();
    const daysElapsed = now.getDate();
    const avgDaily = currentTotal / Math.max(daysElapsed, 1);
    insights.push({
      type: "info",
      message: `Your average daily spending this month is ₹${avgDaily.toFixed(0).toLocaleString("en-IN")}.`,
    });
  }

  // 4. Most expensive category
  const sortedCategories = Object.entries(currentByCategory).sort((a, b) => b[1] - a[1]);
  if (sortedCategories.length > 0) {
    const [topCategory, topAmount] = sortedCategories[0];
    insights.push({
      type: "info",
      message: `${topCategory} is your top spending category this month at ₹${topAmount.toLocaleString("en-IN")}.`,
    });
  }

  // 5. Top merchant
  const merchantTotals = {};
  currentExpenses.forEach((e) => {
    if (e.merchant) merchantTotals[e.merchant] = (merchantTotals[e.merchant] || 0) + e.amount;
  });
  const sortedMerchants = Object.entries(merchantTotals).sort((a, b) => b[1] - a[1]);
  if (sortedMerchants.length > 0) {
    insights.push({
      type: "info",
      message: `Your top merchant this month is ${sortedMerchants[0][0]}.`,
    });
  }

  // 6. Savings trend
  const currentSavings = currentIncomeTotal - currentTotal;
  const previousSavings = previousIncomeTotal - previousTotal;
  if (previousIncomeTotal > 0 || previousTotal > 0) {
    if (currentSavings > previousSavings) {
      insights.push({
        type: "positive",
        message: `You're saving more than last month. Keep it up!`,
      });
    } else if (currentSavings < previousSavings) {
      insights.push({
        type: "warning",
        message: `You're saving less than last month. Consider reviewing your expenses.`,
      });
    }
  }

  // 7. Financial health score (0-100), based on savings rate, budget adherence, expense volatility
  const savingsRate = currentIncomeTotal > 0 ? currentSavings / currentIncomeTotal : 0;
  let healthScore = 50 + savingsRate * 100;
  healthScore = Math.max(0, Math.min(100, Math.round(healthScore)));
  insights.push({
    type: "score",
    message: `Your Financial Health Score is ${healthScore}/100.`,
    score: healthScore,
  });

  return insights;
}

export function calculateFinancialHealthScore({ income, expense, savingsGoalsCompleted = 0, budgetBreaches = 0 }) {
  const savingsRate = income > 0 ? (income - expense) / income : 0;
  let score = 50;
  score += savingsRate * 40; // reward saving
  score += savingsGoalsCompleted * 3;
  score -= budgetBreaches * 5;
  return Math.max(0, Math.min(100, Math.round(score)));
}
