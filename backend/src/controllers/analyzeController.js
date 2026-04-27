import { scamPrompt } from "../ai/prompt.js";
import { callHuggingFace } from "../ai/hfservice.js";
import { findSimilarScams } from "../ai/storeScams.js";
import Message from "../models/Message.js";

const mapHistoryItem = (item) => ({
  id: item._id,
  message: item.message,
  result: item.aiResponse,
  createdAt: item.createdAt,
});

const escapeRegExp = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

const parseAiResponse = (rawResponse) => {
  if (rawResponse && typeof rawResponse === "object") {
    return rawResponse;
  }

  if (typeof rawResponse !== "string") {
    return null;
  }

  const cleaned = rawResponse
    .replace(/^```json\s*/i, "")
    .replace(/^```\s*/i, "")
    .replace(/```$/i, "")
    .trim();

  try {
    return JSON.parse(cleaned);
  } catch {
    return null;
  }
};

const normalizeAiResponse = (parsedResponse) => {
  const risk = ["Low", "Medium", "High"].includes(parsedResponse?.risk)
    ? parsedResponse.risk
    : "Unknown";

  const confidence =
    typeof parsedResponse?.confidence === "number"
      ? Math.max(0, Math.min(1, parsedResponse.confidence))
      : 0;

  const reasons = Array.isArray(parsedResponse?.reasons)
    ? parsedResponse.reasons.filter((item) => typeof item === "string")
    : [];

  const suggestion =
    typeof parsedResponse?.suggestion === "string"
      ? parsedResponse.suggestion
      : "";

  return {
    risk,
    confidence,
    reasons,
    suggestion,
  };
};

const analyzeMessage = async (req, res) => {
  try {
    const { message } = req.body || {};

    if (!message || typeof message !== "string" || !message.trim()) {
      return res.status(400).json({
        success: false,
        message: "'message' is required and must be a non-empty string.",
      });
    }

    const similarMessages = await findSimilarScams(message, 3);
    const examples =
      similarMessages.length > 0
        ? similarMessages
            .map(
              (item, index) =>
                `${index + 1}. ${item.text} (label: ${item.label}, score: ${item.score.toFixed(3)})`,
            )
            .join("\n")
        : "No close matches found in vector database.";
    console.log("Similar messages found:", examples);
    const formattedPrompt = await scamPrompt.format({
      message: message.trim(),
      examples,
    });
    console.log("Formatted prompt for AI:", formattedPrompt);
    const rawResponse = await callHuggingFace(formattedPrompt);
    console.log("Raw AI response:", rawResponse);
    const parsedResponse = parseAiResponse(rawResponse);
    const aiResponse = normalizeAiResponse(parsedResponse);

    const savedMessage = await Message.create({
      user: req.user?.userId || null,
      message: message.trim(),
      aiResponse,
      rawResponse:
        typeof rawResponse === "string"
          ? rawResponse
          : JSON.stringify(rawResponse || {}),
    });

    return res.status(200).json({
      success: true,
      data: aiResponse,
      recordId: savedMessage._id,
      isLoggedIn: Boolean(req.user?.userId),
    });
  } catch (err) {
    const statusCode = err.statusCode || err.status || 500;
    return res.status(statusCode).json({
      success: false,
      message: err.message || "Failed to analyze message.",
      details: err.details || null,
    });
  }
};

const getUserHistory = async (req, res) => {
  try {
    const userId = req.user?.userId;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const history = await Message.find({ user: userId })
      .sort({ createdAt: -1 })
      .select("message aiResponse createdAt");

    return res.status(200).json({
      success: true,
      data: history.map(mapHistoryItem),
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message || "Failed to fetch history.",
    });
  }
};

const searchUserHistory = async (req, res) => {
  try {
    const userId = req.user?.userId;
    const query = String(req.query.q || "").trim();

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    if (!query) {
      return res.status(200).json({
        success: true,
        data: [],
      });
    }

    const regex = new RegExp(escapeRegExp(query), "i");
    const history = await Message.find({
      user: userId,
      message: { $regex: regex },
    })
      .sort({ createdAt: -1 })
      .select("message aiResponse createdAt");

    return res.status(200).json({
      success: true,
      data: history.map(mapHistoryItem),
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message || "Failed to search history.",
    });
  }
};

const deleteUserHistoryMessage = async (req, res) => {
  try {
    const userId = req.user?.userId;
    const { id } = req.params;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const deleted = await Message.findOneAndDelete({ _id: id, user: userId });

    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: "Message not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Message deleted successfully",
      data: {
        id: deleted._id,
      },
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message || "Failed to delete message.",
    });
  }
};

export {
  analyzeMessage,
  getUserHistory,
  searchUserHistory,
  deleteUserHistoryMessage,
};
