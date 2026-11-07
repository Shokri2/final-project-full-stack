import Joi from "joi";
import { emailRule, passwordRule } from "./auth.Validation.js";
import { paginationQuery } from "../utils/pagination.js";

const roleRule = Joi.string().valid("user", "agronomist", "admin").messages({
  "any.only": "role must be one of: user, agronomist, admin.",
});

const specialtiesRule = Joi.array()
  .items(Joi.number().integer().positive())
  .unique()
  .max(20)
  .messages({
    "array.base": "specialties must be an array of category IDs.",
    "array.unique": "specialties cannot contain the same category twice.",
    "number.base": "Each specialty must be a category ID.",
  });

const phoneRule = Joi.string()
  .trim()
  .pattern(/^\+?[0-9]{7,15}$/)
  .messages({
    "string.pattern.base": "Phone number must contain 7 to 15 digits.",
  });

export const usersQuerySchema = Joi.object({
  ...paginationQuery(
    ["created_at", "name", "email", "role", "last_login_at"],
    "created_at",
  ),
  role: roleRule.optional(),
  is_active: Joi.boolean().optional(),
  email_verified: Joi.boolean().optional(),
});

export const createUserByAdminSchema = Joi.object({
  name: Joi.string().trim().min(3).max(50).required().messages({
    "string.empty": "Name cannot be empty.",
    "string.min": "Name must be at least 3 characters long.",
    "string.max": "Name cannot exceed 50 characters.",
    "any.required": "Name is required.",
  }),
  email: emailRule,
  phone: phoneRule.allow("").optional(),
  password: passwordRule,
  role: roleRule.required().messages({
    "any.required": "role is required.",
  }),
  specialties: specialtiesRule.when("role", {
    is: "agronomist",
    then: Joi.optional(),
    otherwise: Joi.forbidden().messages({
      "any.unknown": "specialties can only be set for agronomists.",
    }),
  }),
});

export const updateUserSchema = Joi.object({
  name: Joi.string().trim().min(3).max(50).optional().messages({
    "string.base": "Name must be a text string.",
    "string.empty": "Name cannot be empty.",
    "string.min": "Name must be at least 3 characters long.",
    "string.max": "Name cannot exceed 50 characters.",
  }),

  phone: phoneRule.optional(),

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

export const updateUserRoleSchema = Joi.object({
  role: roleRule.required().messages({
    "any.required": "role is required.",
  }),
  specialties: specialtiesRule.when("role", {
    is: "agronomist",
    then: Joi.optional(),
    otherwise: Joi.forbidden().messages({
      "any.unknown": "specialties can only be set for agronomists.",
    }),
  }),
});

export const updateSpecialtiesSchema = Joi.object({
  specialties: specialtiesRule.required().messages({
    "any.required": "specialties is required.",
  }),
});

export const userIdParamSchema = Joi.object({
  id: Joi.number().integer().positive().required().messages({
    "number.base": "User ID must be a number.",
    "number.positive": "User ID must be a positive number.",
    "any.required": "User ID is required.",
  }),
});
