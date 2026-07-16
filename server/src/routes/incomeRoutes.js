import express from "express";
import {
  addIncome,
  getAllIncome,
  deleteIncome,
  updateIncome,
  downloadIncomeExcel,
} from "../controllers/incomeController.js";
import { protect } from "../middleware/authMiddleware.js";
import { validate } from "../middleware/validateMiddleware.js";
import { incomeValidator } from "../validators/transactionValidators.js";

const router = express.Router();
router.use(protect);

router.get("/download", downloadIncomeExcel);
router.route("/").get(getAllIncome).post(incomeValidator, validate, addIncome);
router.route("/:id").put(updateIncome).delete(deleteIncome);

export default router;
