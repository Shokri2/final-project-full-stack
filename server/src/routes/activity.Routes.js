import express from "express";
import {
  getActivitiesController,
  getActivityActionsController,
} from "../controller/activity.Controller.js";
import { authenticate } from "../middleware/authenticate.Middleware.js";
import { authorize } from "../middleware/authorize.Middleware.js";
import { validate } from "../middleware/validate.Middleware.js";
import { activitiesQuerySchema } from "../validation/activity.Validation.js";

const router = express.Router();

router.get(
  "/",
  authenticate,
  authorize("admin"),
  validate(activitiesQuerySchema, "query"),
  getActivitiesController,
);

router.get(
  "/actions",
  authenticate,
  authorize("admin"),
  getActivityActionsController,
);

export default router;
