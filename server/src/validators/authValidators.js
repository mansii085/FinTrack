import { body } from "express-validator";

export const registerValidator = [
  body("fullName").trim().notEmpty().withMessage("Full name is required").isLength({ max: 60 }),
  body("email").trim().isEmail().withMessage("A valid email is required").normalizeEmail(),
  body("password")
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters")
    .matches(/\d/)
    .withMessage("Password must contain a number")
    .matches(/[A-Z]/)
    .withMessage("Password must contain an uppercase letter"),
];

export const loginValidator = [
  body("email").trim().isEmail().withMessage("A valid email is required").normalizeEmail(),
  body("password").notEmpty().withMessage("Password is required"),
];

export const forgotPasswordValidator = [
  body("email").trim().isEmail().withMessage("A valid email is required").normalizeEmail(),
];

export const resetPasswordValidator = [
  body("password")
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters")
    .matches(/\d/)
    .withMessage("Password must contain a number"),
];
