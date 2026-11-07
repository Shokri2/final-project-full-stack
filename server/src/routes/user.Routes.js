import express from "express";
import {
  getUser,
  updateUserController,
  changePasswordController,
} from "../controller/user.Controller.js";
import {
  getUsers,
  createUserController,
  deleteUser,
  updateUserStatusController,
  updateUserRoleController,
  updateSpecialtiesController,
} from "../controller/userAdmin.Controller.js";
import { authenticate } from "../middleware/authenticate.Middleware.js";
import { authorize } from "../middleware/authorize.Middleware.js";
import { validate } from "../middleware/validate.Middleware.js";
import { sensitiveRateLimiter } from "../middleware/authRateLimit.Middleware.js";
import { changePasswordSchema } from "../validation/auth.Validation.js";
import {
  usersQuerySchema,
  createUserByAdminSchema,
  updateUserSchema,
  updateUserStatusSchema,
  updateUserRoleSchema,
  updateSpecialtiesSchema,
  userIdParamSchema,
} from "../validation/user.Validation.js";

const router = express.Router();

router.get(
  "/Users",
  authenticate,
  authorize("admin"),
  validate(usersQuerySchema, "query"),
  getUsers,
);

router.post(
  "/createUser",
  authenticate,
  authorize("admin"),
  validate(createUserByAdminSchema),
  createUserController,
);

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

router.patch(
  "/updateRole/:id/role",
  authenticate,
  authorize("admin"),
  validate(userIdParamSchema, "params"),
  validate(updateUserRoleSchema),
  updateUserRoleController,
);

router.put(
  "/updateSpecialties/:id",
  authenticate,
  authorize("admin"),
  validate(userIdParamSchema, "params"),
  validate(updateSpecialtiesSchema),
  updateSpecialtiesController,
);

export default router;
