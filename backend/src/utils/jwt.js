import jwt from "jsonwebtoken";

const generateToken = (userId, email) => {
  if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET environment variable is not set");
  }

  return jwt.sign({ userId, email }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || "7d",
  });
};

const verifyToken = (token) => {
  if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET environment variable is not set");
  }

  try {
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch (error) {
    throw new Error(`Invalid token: ${error.message}`);
  }
};

const decodeToken = (token) => {
  try {
    return jwt.decode(token);
  } catch (error) {
    return null;
  }
};

export { generateToken, verifyToken, decodeToken };
