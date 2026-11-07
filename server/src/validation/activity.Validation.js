import Joi from "joi";
import { paginationQuery } from "../utils/pagination.js";

export const activitiesQuerySchema = Joi.object({
  ...paginationQuery(["created_at"], "created_at", 20),
  action: Joi.string().trim().uppercase().max(50),
  entity_type: Joi.string().trim().lowercase().valid("user", "category", "crop", "request", "feedback", "contact"),
  user_id: Joi.number().integer().positive(),
  from: Joi.date().iso().messages({
    "date.format": "from must be a date like 2026-11-01.",
  }),
  to: Joi.date().iso().min(Joi.ref("from")).messages({
    "date.format": "to must be a date like 2026-11-30.",
    "date.min": "to must be after from.",
  }),
});
