import express from "express";
import {
  createContactController,
  getContactMessagesController,
  updateContactStatusController,
  deleteContactController,
} from "../controller/contact.Controller.js";
import { authenticate } from "../middleware/authenticate.Middleware.js";
import { authorize } from "../middleware/authorize.Middleware.js";
import { validate } from "../middleware/validate.Middleware.js";
import { sensitiveRateLimiter } from "../middleware/authRateLimit.Middleware.js";
import {
  createContactSchema,
  contactQuerySchema,
  contactStatusSchema,
  contactIdParamSchema,
} from "../validation/contact.Validation.js";

const router = express.Router();
const byId = validate(contactIdParamSchema, "params");

router.post("/", sensitiveRateLimiter, validate(createContactSchema), createContactController);

router.use(authenticate, authorize("admin"));

router.get("/", validate(contactQuerySchema, "query"), getContactMessagesController);
router.patch("/:id/status", byId, validate(contactStatusSchema), updateContactStatusController);
router.delete("/:id", byId, deleteContactController);

export default router;
