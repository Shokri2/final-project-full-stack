import express from "express";
import {
  createFeedbackController,
  getPublicFeedbackController,
  getMyFeedbackController,
  updateFeedbackController,
  deleteFeedbackController,
} from "../controller/feedback.Controller.js";
import {
  getManagedFeedbackController,
  getFeedbackDetailsController,
  moderateFeedback,
} from "../controller/feedbackModeration.Controller.js";
import { authenticate } from "../middleware/authenticate.Middleware.js";
import { authorize } from "../middleware/authorize.Middleware.js";
import { validate } from "../middleware/validate.Middleware.js";
import {
  createFeedbackSchema,
  updateFeedbackSchema,
  publicFeedbackQuerySchema,
  myFeedbackQuerySchema,
  manageFeedbackQuerySchema,
  rejectFeedbackSchema,
  feedbackIdParamSchema,
} from "../validation/feedback.Validation.js";

const router = express.Router();
const byId = validate(feedbackIdParamSchema, "params");

router.get("/public", validate(publicFeedbackQuerySchema, "query"), getPublicFeedbackController);

router.use(authenticate);

router.post("/", authorize("user"), validate(createFeedbackSchema), createFeedbackController);

router.get("/mine", authorize("user"), validate(myFeedbackQuerySchema, "query"), getMyFeedbackController);

router.get(
  "/",
  authorize("admin", "agronomist"),
  validate(manageFeedbackQuerySchema, "query"),
  getManagedFeedbackController,
);

router.get("/:id", byId, getFeedbackDetailsController);

router.put("/:id", authorize("user"), byId, validate(updateFeedbackSchema), updateFeedbackController);

router.delete("/:id", authorize("user", "admin"), byId, deleteFeedbackController);

router.patch(
  "/:id/approve",
  authorize("admin", "agronomist"),
  byId,
  moderateFeedback("approve"),
);

router.patch(
  "/:id/reject",
  authorize("admin", "agronomist"),
  byId,
  validate(rejectFeedbackSchema),
  moderateFeedback("reject"),
);

export default router;
