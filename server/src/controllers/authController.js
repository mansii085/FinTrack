import asyncHandler from "express-async-handler";
import crypto from "crypto";
import User from "../models/User.js";
import generateToken from "../utils/generateToken.js";
import { sendEmail } from "../utils/email/sendEmail.js";
import { getResetPasswordTemplate } from "../utils/email/templates/resetPasswordTemplate.js";

// @desc    Register new user
// @route   POST /api/v1/auth/register
// @access  Public
export const registerUser = asyncHandler(async (req, res) => {
  const { fullName, email, password } = req.body;

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    res.status(409);
    throw new Error("An account with this email already exists");
  }

  const user = await User.create({ fullName, email, password });

  res.status(201).json({
    success: true,
    message: "Account created successfully",
    data: {
      user: user.toSafeObject(),
      token: generateToken(user._id),
    },
  });
});

// @desc    Login user
// @route   POST /api/v1/auth/login
// @access  Public
export const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email }).select("+password");
  if (!user || !(await user.comparePassword(password))) {
    res.status(401);
    throw new Error("Invalid email or password");
  }

  res.status(200).json({
    success: true,
    message: "Logged in successfully",
    data: {
      user: user.toSafeObject(),
      token: generateToken(user._id),
    },
  });
});

// @desc    Get logged-in user profile
// @route   GET /api/v1/auth/me
// @access  Private
export const getMe = asyncHandler(async (req, res) => {
  res.status(200).json({ success: true, data: { user: req.user.toSafeObject() } });
});

// @desc    Forgot password — issues a reset token (architecture only, logs link instead of sending email)
// @route   POST /api/v1/auth/forgot-password
// @access  Public
export const forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });

  // Always respond the same way to avoid leaking which emails exist
  if (!user) {
    return res.status(200).json({
      success: true,
      message: "If that email exists, a password reset link has been sent.",
    });
  }

  const resetToken = user.createPasswordResetToken();
  await user.save({ validateBeforeSave: false });

  const resetURL = `${process.env.CLIENT_URL}/reset-password/${resetToken}`;
  const message = "Reset link sent successfully.";

  try {
    await sendEmail({
      to: user.email,
      subject: "Reset your FinTrack password",
      html: getResetPasswordTemplate(resetURL),
    });

    res.status(200).json({
      success: true,
      message,
    });
  } catch (error) {
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save({ validateBeforeSave: false });

    res.status(500);
    throw new Error("There was an error sending the email. Try again later.");
  }
});

// @desc    Reset password using token
// @route   POST /api/v1/auth/reset-password/:token
// @access  Public
export const resetPassword = asyncHandler(async (req, res) => {
  const hashedToken = crypto.createHash("sha256").update(req.params.token).digest("hex");

  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() },
  });

  if (!user) {
    res.status(400);
    throw new Error("Reset token is invalid or has expired");
  }

  user.password = req.body.password;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  await user.save();

  res.status(200).json({
    success: true,
    message: "Password reset successfully. Please log in.",
    data: { token: generateToken(user._id) },
  });
});
