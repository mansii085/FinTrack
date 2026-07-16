import asyncHandler from "express-async-handler";
import User from "../models/User.js";
import { cloudinary } from "../config/cloudinary.js";

// @desc    Update profile details
// @route   PUT /api/v1/profile
// @access  Private
export const updateProfile = asyncHandler(async (req, res) => {
  const { fullName, currency, theme, monthlyBudget } = req.body;
  const user = await User.findById(req.user._id);

  if (fullName !== undefined) user.fullName = fullName;
  if (currency !== undefined) user.currency = currency;
  if (theme !== undefined) user.theme = theme;
  if (monthlyBudget !== undefined) user.monthlyBudget = monthlyBudget;

  await user.save();
  res.status(200).json({ success: true, message: "Profile updated", data: { user: user.toSafeObject() } });
});

// @desc    Change password
// @route   PUT /api/v1/profile/password
// @access  Private
export const changePassword = asyncHandler(async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  const user = await User.findById(req.user._id).select("+password");

  if (!(await user.comparePassword(currentPassword))) {
    res.status(401);
    throw new Error("Current password is incorrect");
  }

  user.password = newPassword;
  await user.save();
  res.status(200).json({ success: true, message: "Password changed successfully" });
});

// @desc    Upload / replace profile picture
// @route   PUT /api/v1/profile/avatar
// @access  Private
export const updateAvatar = asyncHandler(async (req, res) => {
  if (!req.file) {
    res.status(400);
    throw new Error("No image file uploaded");
  }

  const user = await User.findById(req.user._id);

  if (user.avatar?.publicId) {
    await cloudinary.uploader.destroy(user.avatar.publicId).catch(() => {});
  }

  user.avatar = { url: req.file.path, publicId: req.file.filename };
  await user.save();

  res.status(200).json({ success: true, message: "Avatar updated", data: { avatar: user.avatar } });
});
