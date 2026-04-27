import express from "express";
import asyncHandler from "../utils/asyncHandler.js";
import {
  analyzeMessage,
  deleteUserHistoryMessage,
  getUserHistory,
  searchUserHistory,
} from "../controllers/analyzeController.js";
import authMiddleware, { optionalAuthMiddleware } from "../middleware/auth.js";

const router = express.Router();

router.post("/", optionalAuthMiddleware, asyncHandler(analyzeMessage));
router.get("/history", authMiddleware, asyncHandler(getUserHistory));
router.get("/history/search", authMiddleware, asyncHandler(searchUserHistory));
router.delete(
  "/history/:id",
  authMiddleware,
  asyncHandler(deleteUserHistoryMessage),
);

export default router;
