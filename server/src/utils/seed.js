import dotenv from "dotenv";
dotenv.config();
import connectDB from "../config/db.js";
import User from "../models/User.js";
import Income from "../models/Income.js";
import Expense from "../models/Expense.js";
import Budget from "../models/Budget.js";
import SavingsGoal from "../models/SavingsGoal.js";

const monthKey = (d = new Date()) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
const randomDate = (daysBack) => {
  const d = new Date();
  d.setDate(d.getDate() - Math.floor(Math.random() * daysBack));
  return d;
};

const run = async () => {
  await connectDB();

  const email = "demo@fintrack.app";
  await User.deleteOne({ email });

  const user = await User.create({
    fullName: "Demo User",
    email,
    password: "Demo@1234",
  });

  console.log(`👤 Created demo user: ${email} / Demo@1234`);

  const incomeSources = [
    { source: "Monthly Salary", category: "Salary", amount: 85000 },
    { source: "Freelance Project", category: "Freelancing", amount: 15000 },
    { source: "Stock Dividends", category: "Investments", amount: 3200 },
  ];

  const expenseItems = [
    { title: "Grocery shopping", category: "Food", amount: 2400, merchant: "BigBasket" },
    { title: "Swiggy order", category: "Food", amount: 650, merchant: "Swiggy" },
    { title: "Uber rides", category: "Travel", amount: 1200, merchant: "Uber" },
    { title: "Flight ticket", category: "Travel", amount: 8500, merchant: "MakeMyTrip" },
    { title: "Amazon shopping", category: "Shopping", amount: 3200, merchant: "Amazon" },
    { title: "Netflix subscription", category: "Subscriptions", amount: 649, merchant: "Netflix" },
    { title: "Spotify subscription", category: "Subscriptions", amount: 119, merchant: "Spotify" },
    { title: "Movie night", category: "Entertainment", amount: 800, merchant: "PVR" },
    { title: "Online course", category: "Education", amount: 1999, merchant: "Udemy" },
    { title: "Doctor visit", category: "Medical", amount: 1200, merchant: "Apollo" },
    { title: "Electricity bill", category: "Bills", amount: 2100, merchant: "State Electricity Board" },
    { title: "Internet bill", category: "Bills", amount: 999, merchant: "Jio Fiber" },
  ];

  const incomeDocs = [];
  const expenseDocs = [];

  for (let m = 0; m < 3; m++) {
    incomeSources.forEach((inc) => {
      const d = new Date();
      d.setMonth(d.getMonth() - m);
      d.setDate(1 + Math.floor(Math.random() * 5));
      incomeDocs.push({ user: user._id, ...inc, date: d });
    });

    expenseItems.forEach((exp) => {
      const d = new Date();
      d.setMonth(d.getMonth() - m);
      d.setDate(1 + Math.floor(Math.random() * 27));
      const variance = 0.8 + Math.random() * 0.5;
      expenseDocs.push({
        user: user._id,
        ...exp,
        amount: Math.round(exp.amount * variance),
        date: d,
      });
    });
  }

  await Income.insertMany(incomeDocs);
  await Expense.insertMany(expenseDocs);
  console.log(`💰 Seeded ${incomeDocs.length} income records`);
  console.log(`🧾 Seeded ${expenseDocs.length} expense records`);

  await Budget.insertMany([
    { user: user._id, category: "Food", limit: 8000, month: monthKey() },
    { user: user._id, category: "Shopping", limit: 5000, month: monthKey() },
    { user: user._id, category: "Overall", limit: 40000, month: monthKey() },
  ]);
  console.log("📊 Seeded budgets");

  await SavingsGoal.insertMany([
    {
      user: user._id,
      title: "Emergency Fund",
      targetAmount: 100000,
      savedAmount: 42000,
      deadline: new Date(new Date().setMonth(new Date().getMonth() + 6)),
      icon: "🛡️",
    },
    {
      user: user._id,
      title: "Goa Trip",
      targetAmount: 30000,
      savedAmount: 30000,
      deadline: new Date(new Date().setMonth(new Date().getMonth() + 1)),
      icon: "🏖️",
      isCompleted: true,
    },
    {
      user: user._id,
      title: "New Laptop",
      targetAmount: 90000,
      savedAmount: 15000,
      deadline: new Date(new Date().setMonth(new Date().getMonth() + 4)),
      icon: "💻",
    },
  ]);
  console.log("🎯 Seeded savings goals");

  console.log("✅ Seed complete");
  process.exit(0);
};

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
