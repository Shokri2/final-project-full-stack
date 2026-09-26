import Joi from "joi";

export const productSchema = Joi.object({
  name: Joi.string().trim().min(3).max(100).required().messages({
    "string.base": "the name should be string",
    "string.empty": "you should enter your product name",
    "string.min": "name must be more than 3 letters",
    "string.max": "name should be less than 100 letters",
    "any.required": "product name is required",
  }),

  description: Joi.string().trim().max(200).allow("").messages({
    "string.base": "the description should be string",
    "string.max": "description should be less than 200 letters",
  }),

  price: Joi.number().integer().min(0).required().messages({
    "number.base": "price should be a number",
    "number.integer": "price should be an integer",
    "number.min": "price cannot be negative",
    "any.required": "price is required",
  }),

  stock: Joi.number().integer().min(0).required().messages({
    "number.base": "stock should be a number",
    "number.integer": "stock should be an integer",
    "number.min": "stock cannot be negative",
    "any.required": "stock is required",
  }),

  image: Joi.string().trim().max(200).allow("").messages({
    "string.base": "image should be string",
    "string.max": "image should be less than 200 characters",
  }),

  catid: Joi.number().integer().required().messages({
    "number.base": "category id should be a number",
    "number.integer": "category id should be an integer",
    "any.required": "category id is required",
  }),
});
