import Joi from "joi";

export const updateUserSchema = Joi.object({
  name: Joi.string().trim().min(3).max(50).optional().messages({
    "string.base": "Name must be a text string.",
    "string.empty": "Name cannot be empty.",
    "string.min": "Name must be at least 3 characters long.",
    "string.max": "Name cannot exceed 50 characters.",
  }),

  phone: Joi.string()
    .trim()
    .pattern(/^\+?[0-9]{7,15}$/)
    .optional()
    .messages({
      "string.pattern.base": "Phone number must contain 7 to 15 digits.",
    }),

  avatar: Joi.string().trim().uri().optional().messages({
    "string.uri": "Avatar must be a valid URL.",
  }),
})
  .min(1)
  .messages({
    "object.min": "Provide at least one field to update.",
  });

export const updateUserStatusSchema = Joi.object({
  is_active: Joi.boolean().required().messages({
    "boolean.base": "is_active must be true or false.",
    "any.required": "is_active is required.",
  }),
});

export const userIdParamSchema = Joi.object({
  id: Joi.number().integer().positive().required().messages({
    "number.base": "User ID must be a number.",
    "number.positive": "User ID must be a positive number.",
    "any.required": "User ID is required.",
  }),
});
