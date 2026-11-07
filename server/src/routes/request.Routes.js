import express from "express";
import {
  createRequestController,
  getRequestsController,
  getRequestDetailsController,
  updateRequestController,
} from "../controller/request.Controller.js";
import {
  changeRequestStatus,
  getEligibleAgronomistsController,
} from "../controller/requestWorkflow.Controller.js";
import {
  uploadAttachmentsController,
  deleteAttachmentController,
} from "../controller/requestAttachment.Controller.js";
import { authenticate } from "../middleware/authenticate.Middleware.js";
import { authorize } from "../middleware/authorize.Middleware.js";
import { validate } from "../middleware/validate.Middleware.js";
import {
  requestImagesUpload,
  verifyImageContent,
  removeUploadsIfFailed,
} from "../middleware/upload.Middleware.js";
import {
  createRequestSchema,
  updateRequestSchema,
  requestsQuerySchema,
  assignRequestSchema,
  answerRequestSchema,
  rejectRequestSchema,
  noteOnlySchema,
  requestIdParamSchema,
  attachmentParamsSchema,
} from "../validation/request.Validation.js";

const router = express.Router();
const byId = validate(requestIdParamSchema, "params");
const withImages = [removeUploadsIfFailed, requestImagesUpload, verifyImageContent];

router.use(authenticate);

router.get("/", validate(requestsQuerySchema, "query"), getRequestsController);

router.post(
  "/",
  authorize("user"),
  ...withImages,
  validate(createRequestSchema),
  createRequestController,
);

router.get("/:id", byId, getRequestDetailsController);

router.put(
  "/:id",
  authorize("user"),
  byId,
  validate(updateRequestSchema),
  updateRequestController,
);

router.get(
  "/:id/eligible-agronomists",
  authorize("admin"),
  byId,
  getEligibleAgronomistsController,
);

router.patch(
  "/:id/assign",
  authorize("admin"),
  byId,
  validate(assignRequestSchema),
  changeRequestStatus("assign"),
);

router.patch(
  "/:id/start",
  authorize("agronomist"),
  byId,
  validate(noteOnlySchema),
  changeRequestStatus("start"),
);

router.patch(
  "/:id/answer",
  authorize("agronomist"),
  byId,
  validate(answerRequestSchema),
  changeRequestStatus("answer"),
);

router.patch(
  "/:id/reject",
  authorize("admin", "agronomist"),
  byId,
  validate(rejectRequestSchema),
  changeRequestStatus("reject"),
);

router.patch(
  "/:id/cancel",
  authorize("user"),
  byId,
  validate(noteOnlySchema),
  changeRequestStatus("cancel"),
);

router.patch(
  "/:id/close",
  authorize("user", "admin"),
  byId,
  validate(noteOnlySchema),
  changeRequestStatus("close"),
);

router.post(
  "/:id/attachments",
  authorize("user"),
  ...withImages,
  byId,
  uploadAttachmentsController,
);

router.delete(
  "/:id/attachments/:attachmentId",
  authorize("user"),
  validate(attachmentParamsSchema, "params"),
  deleteAttachmentController,
);

export default router;
