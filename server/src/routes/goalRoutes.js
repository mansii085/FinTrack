import express from "express";
import { createGoal, getGoals, updateGoal, deleteGoal } from "../controllers/goalController.js";
import { protect } from "../middleware/authMiddleware.js";
import { validate } from "../middleware/validateMiddleware.js";
import { goalValidator } from "../validators/transactionValidators.js";

const router = express.Router();
router.use(protect);

router.route("/").get(getGoals).post(goalValidator, validate, createGoal);
router.route("/:id").put(updateGoal).delete(deleteGoal);

export default router;
