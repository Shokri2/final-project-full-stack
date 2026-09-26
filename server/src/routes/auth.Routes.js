import {
  createUserController,
  loginController,
} from "../controller/auth.Controller.js";
import { loginRateLimiter } from "../middleware/authRateLimit.Middleware.js";
import { apiLimiter } from "../middleware/rateLimit.Middleware.js";
import { validate } from "../middleware/validate.Middleware.js";
import {
  createUserSchema,
  loginSchema,
} from "../validation/auth.Validation.js";
import express from "express";
const router = express.Router();

router.post("/auth/register", validate(createUserSchema), createUserController);
router.post(
  "/auth/login",
  loginRateLimiter,
  validate(loginSchema),
  loginController,
);

export default router;
