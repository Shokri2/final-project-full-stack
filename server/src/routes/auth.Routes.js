import express from "express";
import {
  createUserController,
  verifyEmailController,
  resendVerificationController,
  loginController,
  refreshTokenController,
  logoutController,
  getCurrentUserController,
} from "../controller/auth.Controller.js";
import {
  loginRateLimiter,
  sensitiveRateLimiter,
} from "../middleware/authRateLimit.Middleware.js";
import { validate } from "../middleware/validate.Middleware.js";
import { authenticate } from "../middleware/authenticate.Middleware.js";
import { csrfProtection } from "../middleware/csrf.Middleware.js";
import {
  createUserSchema,
  loginSchema,
  verifyEmailSchema,
  resendVerificationSchema,
} from "../validation/auth.Validation.js";

const router = express.Router();

router.post(
  "/auth/register",
  sensitiveRateLimiter,
  validate(createUserSchema),
  createUserController,
);

router.post(
  "/auth/verify-email",
  sensitiveRateLimiter,
  validate(verifyEmailSchema),
  verifyEmailController,
);

router.post(
  "/auth/resend-verification",
  sensitiveRateLimiter,
  validate(resendVerificationSchema),
  resendVerificationController,
);

router.post(
  "/auth/login",
  loginRateLimiter,
  validate(loginSchema),
  loginController,
);

router.post(
  "/auth/refresh",
  sensitiveRateLimiter,
  csrfProtection,
  refreshTokenController,
);

router.post("/auth/logout", csrfProtection, logoutController);

router.get("/auth/me", authenticate, getCurrentUserController);

export default router;
