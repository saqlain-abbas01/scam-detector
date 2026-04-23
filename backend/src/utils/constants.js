// Constants for the application

const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  INTERNAL_SERVER_ERROR: 500,
};

const ERROR_MESSAGES = {
  MISSING_FIELDS: "Please provide all required fields",
  USER_EXISTS: "User with this email already exists",
  INVALID_CREDENTIALS: "Invalid email or password",
  TOKEN_REQUIRED: "Access denied. No token provided.",
  INVALID_TOKEN: "Invalid or expired token",
  USER_NOT_FOUND: "User not found",
  SERVER_ERROR: "Internal server error",
};

const SUCCESS_MESSAGES = {
  SIGNUP_SUCCESS: "User registered successfully",
  LOGIN_SUCCESS: "Login successful",
  LOGOUT_SUCCESS: "Logged out successfully",
  USER_RETRIEVED: "User retrieved successfully",
};

const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax",
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
};

export { HTTP_STATUS, ERROR_MESSAGES, SUCCESS_MESSAGES, COOKIE_OPTIONS };
