import express from "express";
import {
  getUsers,
  getUser,
  deleteUser,
  updateUserController,
  updateUserStatusController,
  changePasswordController,
} from "../controller/user.Controller.js";
import { authenticate } from "../middleware/authenticate.Middleware.js";
import { authorize } from "../middleware/authorize.Middleware.js";
import { validate } from "../middleware/validate.Middleware.js";
import { sensitiveRateLimiter } from "../middleware/authRateLimit.Middleware.js";
import { changePasswordSchema } from "../validation/auth.Validation.js";
import {
  updateUserSchema,
  updateUserStatusSchema,
  userIdParamSchema,
} from "../validation/user.Validation.js";

const router = express.Router();

router.get("/Users", authenticate, authorize("admin"), getUsers);

router.get(
  "/getUser/:id",
  authenticate,
  validate(userIdParamSchema, "params"),
  getUser,
);

router.put(
  "/updateUser/:id",
  authenticate,
  validate(userIdParamSchema, "params"),
  validate(updateUserSchema),
  updateUserController,
);

router.put(
  "/changePassword",
  authenticate,
  sensitiveRateLimiter,
  validate(changePasswordSchema),
  changePasswordController,
);

router.delete(
  "/deleteUser/:id",
  authenticate,
  authorize("admin"),
  validate(userIdParamSchema, "params"),
  deleteUser,
);

router.patch(
  "/updateStatus/:id/status",
  authenticate,
  authorize("admin"),
  validate(userIdParamSchema, "params"),
  validate(updateUserStatusSchema),
  updateUserStatusController,
);

export default router;
