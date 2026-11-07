import Joi from "joi";
import { emailRule } from "./auth.Validation.js";
import { paginationQuery } from "../utils/pagination.js";

export const CONTACT_STATUSES = ["new", "read", "archived"];

export const createContactSchema = Joi.object({
  name: Joi.string().trim().min(2).max(100).required().messages({
    "string.empty": "Name is required.",
    "string.min": "Name must be at least 2 characters long.",
    "any.required": "Name is required.",
  }),
  email: emailRule,
  subject: Joi.string().trim().min(3).max(150).required().messages({
    "string.empty": "Subject is required.",
    "string.min": "Subject must be at least 3 characters long.",
    "any.required": "Subject is required.",
  }),
  message: Joi.string().trim().min(10).max(5000).required().messages({
    "string.empty": "Message is required.",
    "string.min": "Message must be at least 10 characters long.",
    "any.required": "Message is required.",
  }),
});

export const contactQuerySchema = Joi.object({
  ...paginationQuery(["created_at"], "created_at"),
  status: Joi.string().valid(...CONTACT_STATUSES),
});

export const contactStatusSchema = Joi.object({
  status: Joi.string()
    .valid(...CONTACT_STATUSES)
    .required()
    .messages({
      "any.only": "Status must be new, read or archived.",
      "any.required": "Status is required.",
    }),
});

export const contactIdParamSchema = Joi.object({
  id: Joi.number().integer().positive().required(),
});
