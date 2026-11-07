import { rateLimit } from "express-rate-limit";

const skipInTests = () => process.env.NODE_ENV === "test";

export const loginRateLimiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  limit: 10,
  standardHeaders: "draft-7",
  legacyHeaders: false,
  skip: skipInTests,
  message: {
    success: false,
    message: "Too many login attempts. Please try again later.",
    error: "RATE_LIMIT_ERROR",
  },
});

export const sensitiveRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 20,
  standardHeaders: "draft-7",
  legacyHeaders: false,
  skip: skipInTests,
  message: {
    success: false,
    message: "Too many requests. Please try again later.",
    error: "RATE_LIMIT_ERROR",
  },
});
