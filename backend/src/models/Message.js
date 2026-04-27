import mongoose from "mongoose";

const aiResponseSchema = new mongoose.Schema(
  {
    risk: {
      type: String,
      enum: ["Low", "Medium", "High", "Unknown"],
      default: "Unknown",
    },
    confidence: {
      type: Number,
      min: 0,
      max: 1,
      default: 0,
    },
    reasons: {
      type: [String],
      default: [],
    },
    suggestion: {
      type: String,
      default: "",
    },
  },
  { _id: false },
);

const messageSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    message: {
      type: String,
      required: [true, "Message text is required"],
      trim: true,
    },
    aiResponse: {
      type: aiResponseSchema,
      required: true,
    },
    rawResponse: {
      type: String,
      default: "",
    },
  },
  { timestamps: true },
);

export default mongoose.model("Message", messageSchema);
