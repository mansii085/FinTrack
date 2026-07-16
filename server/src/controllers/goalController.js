import asyncHandler from "express-async-handler";
import SavingsGoal from "../models/SavingsGoal.js";

// @desc    Create savings goal
// @route   POST /api/v1/goals
// @access  Private
export const createGoal = asyncHandler(async (req, res) => {
  const { title, targetAmount, deadline, icon } = req.body;
  const goal = await SavingsGoal.create({
    user: req.user._id,
    title,
    targetAmount,
    deadline,
    icon: icon || "🎯",
  });
  res.status(201).json({ success: true, message: "Goal created", data: goal });
});

// @desc    Get all goals
// @route   GET /api/v1/goals
// @access  Private
export const getGoals = asyncHandler(async (req, res) => {
  const goals = await SavingsGoal.find({ user: req.user._id }).sort({ createdAt: -1 });
  res.status(200).json({ success: true, data: goals });
});

// @desc    Update goal (contribute savings / edit)
// @route   PUT /api/v1/goals/:id
// @access  Private
export const updateGoal = asyncHandler(async (req, res) => {
  const goal = await SavingsGoal.findOne({ _id: req.params.id, user: req.user._id });
  if (!goal) {
    res.status(404);
    throw new Error("Goal not found");
  }

  const { title, targetAmount, savedAmount, deadline, icon } = req.body;
  if (title !== undefined) goal.title = title;
  if (targetAmount !== undefined) goal.targetAmount = targetAmount;
  if (savedAmount !== undefined) goal.savedAmount = savedAmount;
  if (deadline !== undefined) goal.deadline = deadline;
  if (icon !== undefined) goal.icon = icon;

  if (goal.savedAmount >= goal.targetAmount) {
    goal.isCompleted = true;
  }

  await goal.save();
  res.status(200).json({ success: true, message: "Goal updated", data: goal });
});

// @desc    Delete goal
// @route   DELETE /api/v1/goals/:id
// @access  Private
export const deleteGoal = asyncHandler(async (req, res) => {
  const goal = await SavingsGoal.findOneAndDelete({ _id: req.params.id, user: req.user._id });
  if (!goal) {
    res.status(404);
    throw new Error("Goal not found");
  }
  res.status(200).json({ success: true, message: "Goal deleted" });
});
