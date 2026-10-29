import Joi from "joi";

// ------------------- Register -------------------
export const createUserSchema = Joi.object({
  name: Joi.string().trim().min(3).max(15).required().messages({
    "string.base": "Name must be a text string.",
    "string.empty": "Name cannot be empty.",
    "string.min": "Name must be at least 3 characters long.",
    "string.max": "Name cannot exceed 15 characters.",
    "any.required": "Name is required.",
  }),

  email: Joi.string().trim().lowercase().email().required().messages({
    "string.base": "Email must be a text string.",
    "string.empty": "Email cannot be empty.",
    "string.email": "Please provide a valid email address.",
    "any.required": "Email is required.",
  }),

  password: Joi.string().min(6).max(100).required().messages({
    "string.base": "Password must be a text string.",
    "string.empty": "Password cannot be empty.",
    "string.min": "Password must be at least 6 characters long.",
    "string.max": "Password cannot exceed 100 characters.",
    "any.required": "Password is required.",
  }),

  confirmPassword: Joi.string().valid(Joi.ref("password")).required().messages({
    "any.only": "Confirm password must match the password.",
    "any.required": "Confirm password is required.",
    "string.empty": "Confirm password cannot be empty.",
  }),

  avatar: Joi.string().trim().allow("").optional().messages({
    "string.base": "Avatar must be a text string.",
  }),
})
  .unknown(false);

// ------------------- Login -------------------
export const loginSchema = Joi.object({
  email: Joi.string().trim().lowercase().email().required().messages({
    "string.base": "Email must be a text string.",
    "string.empty": "Email cannot be empty.",
    "string.email": "Please provide a valid email address.",
    "any.required": "Email is required.",
  }),

  password: Joi.string().min(6).max(100).required().messages({
    "string.base": "Password must be a text string.",
    "string.empty": "Password cannot be empty.",
    "string.min": "Password must be at least 6 characters long.",
    "string.max": "Password cannot exceed 100 characters.",
    "any.required": "Password is required.",
  }),
}).unknown(false);
