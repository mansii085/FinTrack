import express from "express";
import {
  addExpense,
  getAllExpense,
  deleteExpense,
  updateExpense,
  downloadExpenseExcel,
} from "../controllers/expenseController.js";
import { protect } from "../middleware/authMiddleware.js";
import { validate } from "../middleware/validateMiddleware.js";
import { expenseValidator } from "../validators/transactionValidators.js";

const router = express.Router();
router.use(protect);

router.get("/download", downloadExpenseExcel);
router.route("/").get(getAllExpense).post(expenseValidator, validate, addExpense);
router.route("/:id").put(updateExpense).delete(deleteExpense);

export default router;
