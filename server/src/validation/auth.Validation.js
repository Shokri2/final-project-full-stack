import Joi from "joi";

const passwordRule = Joi.string()
  .min(8)
  .max(100)
  .pattern(/^(?=.*[A-Za-z])(?=.*\d).+$/)
  .required()
  .messages({
    "string.base": "Password must be a text string.",
    "string.empty": "Password cannot be empty.",
    "string.min": "Password must be at least 8 characters long.",
    "string.max": "Password cannot exceed 100 characters.",
    "string.pattern.base": "Password must contain at least one letter and one number.",
    "any.required": "Password is required.",
  });

const emailRule = Joi.string()
  .trim()
  .lowercase()
  .email({ tlds: { allow: false } })
  .max(255)
  .required()
  .messages({
    "string.base": "Email must be a text string.",
    "string.empty": "Email cannot be empty.",
    "string.email": "Please provide a valid email address.",
    "string.max": "Email cannot exceed 255 characters.",
    "any.required": "Email is required.",
  });

export const createUserSchema = Joi.object({
  name: Joi.string().trim().min(3).max(50).required().messages({
    "string.base": "Name must be a text string.",
    "string.empty": "Name cannot be empty.",
    "string.min": "Name must be at least 3 characters long.",
    "string.max": "Name cannot exceed 50 characters.",
    "any.required": "Name is required.",
  }),

  email: emailRule,

  phone: Joi.string()
    .trim()
    .pattern(/^\+?[0-9]{7,15}$/)
    .allow("")
    .optional()
    .messages({
      "string.pattern.base": "Phone number must contain 7 to 15 digits.",
    }),

  password: passwordRule,

  confirmPassword: Joi.string().valid(Joi.ref("password")).required().messages({
    "any.only": "Confirm password must match the password.",
    "any.required": "Confirm password is required.",
    "string.empty": "Confirm password cannot be empty.",
  }),

  avatar: Joi.string().trim().allow("").optional().messages({
    "string.base": "Avatar must be a text string.",
  }),
}).unknown(false);

export const loginSchema = Joi.object({
  email: emailRule,

  password: Joi.string().min(6).max(100).required().messages({
    "string.base": "Password must be a text string.",
    "string.empty": "Password cannot be empty.",
    "string.min": "Password must be at least 6 characters long.",
    "string.max": "Password cannot exceed 100 characters.",
    "any.required": "Password is required.",
  }),
}).unknown(false);

export const verifyEmailSchema = Joi.object({
  token: Joi.string().trim().hex().length(64).required().messages({
    "string.empty": "Verification token is required.",
    "string.hex": "Verification token is invalid.",
    "string.length": "Verification token is invalid.",
    "any.required": "Verification token is required.",
  }),
}).unknown(false);

export const resendVerificationSchema = Joi.object({
  email: emailRule,
}).unknown(false);

export const changePasswordSchema = Joi.object({
  currentPassword: Joi.string().required().messages({
    "string.empty": "Current password cannot be empty.",
    "any.required": "Current password is required.",
  }),

  newPassword: passwordRule.invalid(Joi.ref("currentPassword")).messages({
    "any.invalid": "New password must be different from the current password.",
  }),

  confirmPassword: Joi.string().valid(Joi.ref("newPassword")).required().messages({
    "any.only": "Confirm password must match the new password.",
    "any.required": "Confirm password is required.",
    "string.empty": "Confirm password cannot be empty.",
  }),
}).unknown(false);
