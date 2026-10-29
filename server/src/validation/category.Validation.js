import Joi from "joi";

export const categorySchema = Joi.object({
  name: Joi.string().trim().min(3).max(100).required().messages({
    "string.base": "Category name must be a string.",
    "string.empty": "Category name is required.",
    "string.min": "Category name must be at least 3 characters long.",
    "string.max": "Category name cannot exceed 100 characters.",
    "any.required": "Category name is required.",
  }),

  description: Joi.string().trim().max(200).allow("").optional().messages({
    "string.base": "Category description must be a string.",
    "string.max": "Category description cannot exceed 200 characters.",
  }),
});
