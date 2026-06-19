import rateLimit from "express-rate-limit";

/**
 * General API rate limiter: 100 requests per 15 minutes per IP.
 */
export const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: "Too many requests. Please try again later.",
    code: "RATE_LIMIT_EXCEEDED",
  },
});

/**
 * Strict rate limiter for AI endpoints: 20 requests per minute per IP.
 * Prevents abuse of expensive Gemini API calls.
 */
export const aiLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: "Too many AI requests. Please wait a moment and try again.",
    code: "AI_RATE_LIMIT_EXCEEDED",
  },
});

/**
 * Strict rate limiter for upload endpoint: 10 uploads per 5 minutes per IP.
 */
export const uploadLimiter = rateLimit({
  windowMs: 5 * 60 * 1000, // 5 minutes
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: "Too many upload requests. Please wait and try again.",
    code: "UPLOAD_RATE_LIMIT_EXCEEDED",
  },
});
