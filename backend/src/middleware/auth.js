import { verifyToken } from "../utils/jwt.js";

const getTokenFromRequest = (req) => {
  let token = req.cookies?.token;

  if (!token && req.headers.authorization) {
    const parts = req.headers.authorization.split(" ");
    if (parts.length === 2 && parts[0].toLowerCase() === "bearer") {
      token = parts[1];
    }
  }

  return token;
};

const authMiddleware = (req, res, next) => {
  try {
    const token = getTokenFromRequest(req);

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

export const optionalAuthMiddleware = (req, res, next) => {
  try {
    const token = getTokenFromRequest(req);

    if (!token) {
      req.user = null;
      return next();
    }

    req.user = verifyToken(token);
    return next();
  } catch (error) {
    req.user = null;
    return next();
  }
};

export default authMiddleware;
