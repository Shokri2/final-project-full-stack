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

router.get("/Users", protect, authorizeRoles("admin"), getUsers);

router.get("/getUser/:id", protect, getUser);

router.put("/updateUser/:id", protect, updateUserController);

router.delete("/deleteUser/:id", protect, authorizeRoles("admin"), deleteUser);

router.patch(
  "/updateStatus/:id/status",
  protect,
  authorizeRoles("admin"),
  updateUserStatusController,
);

export default router;
