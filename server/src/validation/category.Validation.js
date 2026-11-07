import Joi from "joi";
import { paginationQuery } from "../utils/pagination.js";

const nameRule = Joi.string().trim().min(3).max(100).messages({
  "string.base": "Category name must be a string.",
  "string.empty": "Category name is required.",
  "string.min": "Category name must be at least 3 characters long.",
  "string.max": "Category name cannot exceed 100 characters.",
  "any.required": "Category name is required.",
});

const descriptionRule = Joi.string().trim().max(500).allow("", null).messages({
  "string.base": "Category description must be a string.",
  "string.max": "Category description cannot exceed 500 characters.",
});

const imageRule = Joi.string().trim().max(500).allow("", null).messages({
  "string.base": "Category image must be a string.",
  "string.max": "Category image cannot exceed 500 characters.",
});

export const categorySchema = Joi.object({
  name: nameRule.required(),
  description: descriptionRule.optional(),
  image: imageRule.optional(),
});

export const categoryUpdateSchema = Joi.object({
  name: nameRule.optional(),
  description: descriptionRule.optional(),
  image: imageRule.optional(),
})
  .min(1)
  .messages({
    "object.min": "Provide at least one field to update.",
  });

export const categoriesQuerySchema = Joi.object({
  ...paginationQuery(["name", "created_at", "crops_count"], "name", 20),
  order: Joi.string().lowercase().valid("asc", "desc").default("asc"),
});

export const categoryIdParamSchema = Joi.object({
  id: Joi.number().integer().positive().required().messages({
    "number.base": "Category ID must be a number.",
    "number.positive": "Category ID must be a positive number.",
    "any.required": "Category ID is required.",
  }),
});
