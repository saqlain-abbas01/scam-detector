import { verifyToken } from "../utils/jwt.js";

const authMiddleware = (req, res, next) => {
  try {
    // Get token from cookies or Authorization header
    let token = req.cookies?.token;

    if (!token && req.headers.authorization) {
      const parts = req.headers.authorization.split(" ");
      if (parts.length === 2 && parts[0].toLowerCase() === "bearer") {
        token = parts[1];
      }
    }

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Access denied. No token provided.",
      });
    }

    // Verify token
    const decoded = verifyToken(token);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(403).json({
      success: false,
      message: error.message || "Invalid token",
    });
  }
};

export default authMiddleware;
