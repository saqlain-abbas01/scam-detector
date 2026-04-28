import "dotenv/config.js";
import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import connectDB from "./src/config/db.js";
import authRoutes from "./src/routes/auth.js";
import analyzeRoutes from "./src/routes/analyze.js";
import { ensureScamEmbeddings } from "./src/ai/storeScams.js";

const app = express();
const PORT = process.env.PORT || 3000;
const allowedOrigins = [
  process.env.CLIENT_URL,
  "https://scam-detector-rho.vercel.app",
  "http://localhost:5173",
].filter(Boolean);

// Initialize server
const startServer = async () => {
  try {
    // Connect to MongoDB
    await connectDB();
    await ensureScamEmbeddings();

    // Middleware
    app.use(express.json({ limit: "10mb" }));
    app.use(express.urlencoded({ limit: "10mb", extended: true }));
    app.use(cookieParser());
    app.use(
      cors({
        origin: (origin, callback) => {
          if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
            return;
          }

          callback(new Error("Not allowed by CORS"));
        },
        credentials: true,
      }),
    );

    // Health check route
    app.get("/", (req, res) => {
      res.json({ message: "🚀 Scam Detector API is running" });
    });

    app.get("/health", (req, res) => {
      res.json({ status: "ok", timestamp: new Date().toISOString() });
    });

    // API Routes
    app.use("/api/auth", authRoutes);
    app.use("/api/analyze", analyzeRoutes);

    // 404 handler
    app.use((req, res) => {
      res.status(404).json({
        success: false,
        message: "Route not found",
      });
    });

    // Error handling middleware (must be last)
    app.use((err, req, res, next) => {
      console.error("Error:", err);
      const statusCode = err.statusCode || err.status || 500;
      const message = err.message || "Internal Server Error";

      res.status(statusCode).json({
        success: false,
        message: message,
      });
    });

    // Start server
    app.listen(PORT, () => {
      console.log(`✅ Server running on http://localhost:${PORT}`);
      console.log(`📝 Environment: ${process.env.NODE_ENV || "development"}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
};

startServer();
