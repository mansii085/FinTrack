import express from "express";
import { updateProfile, changePassword, updateAvatar } from "../controllers/profileController.js";
import { protect } from "../middleware/authMiddleware.js";
import upload from "../middleware/uploadMiddleware.js";

const router = express.Router();
router.use(protect);

router.put("/", updateProfile);
router.put("/password", changePassword);
router.put("/avatar", upload.single("avatar"), updateAvatar);

export default router;
