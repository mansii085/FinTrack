import { body } from "express-validator";

export const incomeValidator = [
  body("source").trim().notEmpty().withMessage("Source is required"),
  body("amount").isFloat({ min: 0.01 }).withMessage("Amount must be a positive number"),
  body("date").optional().isISO8601().withMessage("Date must be valid"),
  body("category")
    .optional()
    .isIn(["Salary", "Freelancing", "Investments", "Business", "Gift", "Other"]),
];

export const expenseValidator = [
  body("title").trim().notEmpty().withMessage("Title is required"),
  body("amount").isFloat({ min: 0.01 }).withMessage("Amount must be a positive number"),
  body("date").optional().isISO8601().withMessage("Date must be valid"),
  body("category")
    .optional()
    .isIn([
      "Food",
      "Travel",
      "Shopping",
      "Entertainment",
      "Education",
      "Medical",
      "Subscriptions",
      "Bills",
      "Others",
    ]),
];

export const budgetValidator = [
  body("category").notEmpty().withMessage("Category is required"),
  body("limit").isFloat({ min: 0 }).withMessage("Limit must be a positive number"),
  body("month")
    .matches(/^\d{4}-\d{2}$/)
    .withMessage("Month must be in YYYY-MM format"),
];

export const goalValidator = [
  body("title").trim().notEmpty().withMessage("Title is required"),
  body("targetAmount").isFloat({ min: 1 }).withMessage("Target amount must be positive"),
  body("deadline").isISO8601().withMessage("Deadline must be a valid date"),
];
