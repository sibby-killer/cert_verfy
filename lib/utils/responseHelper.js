/**
 * Standardized API Response Helpers
 */

export const success = (res, data, statusCode = 200) => {
  return res.status(statusCode).json({ success: true, data });
};

export const error = (res, message, statusCode = 400) => {
  return res.status(statusCode).json({ success: false, error: message });
};

export const unauthorized = (res) => {
  return res.status(401).json({ success: false, error: "Unauthorized" });
};

export const forbidden = (res) => {
  return res.status(403).json({ success: false, error: "Forbidden. You do not have permission to perform this action." });
};

export const notFound = (res, item = "Record") => {
  return res.status(404).json({ success: false, error: `${item} not found` });
};

export const tooManyRequests = (res) => {
  return res.status(429).json({ success: false, error: "Too many requests. Please wait before trying again." });
};

export default {
  success,
  error,
  unauthorized,
  forbidden,
  notFound,
  tooManyRequests
};
