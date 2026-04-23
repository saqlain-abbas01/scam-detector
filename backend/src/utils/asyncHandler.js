/**
 * Wrapper for async route handlers to catch errors
 * Automatically passes errors to the error handling middleware
 */
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

export default asyncHandler;
