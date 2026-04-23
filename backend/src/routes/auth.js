import express from "express";
import authMiddleware from "../middleware/auth.js";
import {
  signup,
  login,
  logout,
  getCurrentUser,
} from "../controllers/authController.js";
import asyncHandler from "../utils/asyncHandler.js";

const router = express.Router();

// Public routes
router.post("/signup", asyncHandler(signup));
router.post("/login", asyncHandler(login));

// Private routes
router.post("/logout", authMiddleware, asyncHandler(logout));
router.get("/me", authMiddleware, asyncHandler(getCurrentUser));

export default router;
