import express from "express";
import { upsertBudget, getBudgets, deleteBudget } from "../controllers/budgetController.js";
import { protect } from "../middleware/authMiddleware.js";
import { validate } from "../middleware/validateMiddleware.js";
import { budgetValidator } from "../validators/transactionValidators.js";

const router = express.Router();
router.use(protect);

router.route("/").get(getBudgets).post(budgetValidator, validate, upsertBudget);
router.delete("/:id", deleteBudget);

export default router;
