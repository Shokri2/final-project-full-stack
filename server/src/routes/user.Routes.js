import express from "express";
import {
  getUsers,
  getUser,
  deleteUser,
  updateUserController,
  updateUserStatusController,
} from "../controller/user.Controller.js";
import { protect } from "../middleware/protect.Middleware.js";
const router = express.Router();

router.get("/Users", protect, getUsers);

router.get("/getUser/:id", protect, getUser);

router.put("/updateUser/:id", protect, updateUserController);

router.delete("/deleteUser/:id", protect, deleteUser);

router.patch("/updateStatus/:id/status", protect, updateUserStatusController);

export default router;
