import express from "express";
import {
  getUsers,
  getUser,
  deleteUser,
  updateUserController,
  updateUserStatusController,
} from "../controller/user.Controller.js";

import { protect, authorizeRoles } from "../middleware/protect.Middleware.js";

const router = express.Router();

// All users: admins only
router.get("/Users", protect, authorizeRoles("admin"), getUsers);

// A user can view their own profile; admins can view any profile
router.get("/getUser/:id", protect, getUser);

// A user can update their own profile; admins can update any profile
router.put("/updateUser/:id", protect, updateUserController);

// Delete users: admins only
router.delete("/deleteUser/:id", protect, authorizeRoles("admin"), deleteUser);

// Change user status: admins only
router.patch(
  "/updateStatus/:id/status",
  protect,
  authorizeRoles("admin"),
  updateUserStatusController,
);

export default router;
