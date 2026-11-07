import express from "express";
import {
  getAdminDashboardController,
  getAgronomistDashboardController,
  getUserDashboardController,
} from "../controller/dashboard.Controller.js";
import { authenticate } from "../middleware/authenticate.Middleware.js";
import { authorize } from "../middleware/authorize.Middleware.js";

const router = express.Router();

router.use(authenticate);

router.get("/admin", authorize("admin"), getAdminDashboardController);
router.get("/agronomist", authorize("agronomist"), getAgronomistDashboardController);
router.get("/user", authorize("user"), getUserDashboardController);

export default router;
