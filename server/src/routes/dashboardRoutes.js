import express from "express";
import { getDashboardData, getAnalytics, getInsights } from "../controllers/dashboardController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();
router.use(protect);

router.get("/", getDashboardData);
router.get("/analytics", getAnalytics);
router.get("/insights", getInsights);

export default router;
