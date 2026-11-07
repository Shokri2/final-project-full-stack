import Joi from "joi";
import { paginationQuery } from "../utils/pagination.js";
import { REQUEST_STATUSES } from "../utils/requestWorkflow.js";

const requestFields = {
  crop_id: Joi.number().integer().positive().messages({
    "number.base": "Please choose a crop.",
    "any.required": "Please choose a crop.",
  }),
  title: Joi.string().trim().min(5).max(150).messages({
    "string.empty": "Title is required.",
    "string.min": "Title must be at least 5 characters long.",
    "string.max": "Title cannot exceed 150 characters.",
    "any.required": "Title is required.",
  }),
  description: Joi.string().trim().min(20).max(5000).messages({
    "string.empty": "Description is required.",
    "string.min": "Please describe the problem in at least 20 characters.",
    "string.max": "Description cannot exceed 5000 characters.",
    "any.required": "Description is required.",
  }),
  farm_location: Joi.string().trim().max(200).allow("").messages({
    "string.max": "Farm location cannot exceed 200 characters.",
  }),
  field_area_m2: Joi.number().positive().max(100000000).allow(null, "").empty("").messages({
    "number.base": "Field area must be a number.",
    "number.positive": "Field area must be greater than zero.",
  }),
  priority: Joi.string().valid("low", "medium", "high").messages({
    "any.only": "Priority must be low, medium or high.",
  }),
};

export const createRequestSchema = Joi.object({
  ...requestFields,
  crop_id: requestFields.crop_id.required(),
  title: requestFields.title.required(),
  description: requestFields.description.required(),
  priority: requestFields.priority.default("medium"),
});

export const updateRequestSchema = Joi.object(requestFields)
  .min(1)
  .messages({
    "object.min": "Provide at least one field to update.",
  });

const statusList = Joi.string()
  .trim()
  .custom((value, helpers) => {
    const statuses = value.split(",").map((status) => status.trim()).filter(Boolean);
    const invalid = statuses.find((status) => !REQUEST_STATUSES.includes(status));

    if (invalid) {
      return helpers.message(`Invalid status "${invalid}".`);
    }

    return statuses;
  });

export const requestsQuerySchema = Joi.object({
  ...paginationQuery(["created_at", "updated_at", "priority", "status"], "created_at"),
  status: statusList,
  priority: Joi.string().valid("low", "medium", "high"),
  crop_id: Joi.number().integer().positive(),
  agronomist_id: Joi.number().integer().positive(),
  from: Joi.date().iso(),
  to: Joi.date().iso().min(Joi.ref("from")).messages({
    "date.min": "to must be after from.",
  }),
});

const noteRule = Joi.string().trim().max(1000).allow("").messages({
  "string.max": "Note cannot exceed 1000 characters.",
});

export const assignRequestSchema = Joi.object({
  agronomist_id: Joi.number().integer().positive().required().messages({
    "number.base": "Please choose an agronomist.",
    "any.required": "Please choose an agronomist.",
  }),
  note: noteRule,
});

export const answerRequestSchema = Joi.object({
  response: Joi.string().trim().min(20).max(10000).required().messages({
    "string.empty": "Response is required.",
    "string.min": "The response must be at least 20 characters long.",
    "any.required": "Response is required.",
  }),
  note: noteRule,
});

export const rejectRequestSchema = Joi.object({
  reason: Joi.string().trim().min(10).max(1000).required().messages({
    "string.empty": "Rejection reason is required.",
    "string.min": "Rejection reason must be at least 10 characters long.",
    "any.required": "Rejection reason is required.",
  }),
});

export const noteOnlySchema = Joi.object({
  note: noteRule,
});

export const requestIdParamSchema = Joi.object({
  id: Joi.number().integer().positive().required().messages({
    "number.base": "Invalid request ID.",
    "any.required": "Request ID is required.",
  }),
});

export const attachmentParamsSchema = Joi.object({
  id: Joi.number().integer().positive().required(),
  attachmentId: Joi.number().integer().positive().required(),
});
