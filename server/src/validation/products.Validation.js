import Joi from "joi";

const productFields = {
  name: Joi.string().trim().min(3).max(100).messages({
    "string.base": "Product name must be a string.",
    "string.empty": "Product name cannot be empty.",
    "string.min": "Product name must be at least 3 characters long.",
    "string.max": "Product name cannot exceed 100 characters.",
    "any.required": "Product name is required.",
  }),

  description: Joi.string().trim().max(200).allow("").messages({
    "string.base": "Description must be a string.",
    "string.max": "Description cannot exceed 200 characters.",
  }),

  price: Joi.number().integer().min(0).messages({
    "number.base": "Price must be a number.",
    "number.integer": "Price must be an integer.",
    "number.min": "Price cannot be negative.",
    "any.required": "Price is required.",
  }),

  stock: Joi.number().integer().min(0).messages({
    "number.base": "Stock must be a number.",
    "number.integer": "Stock must be an integer.",
    "number.min": "Stock cannot be negative.",
    "any.required": "Stock is required.",
  }),

  image: Joi.string().trim().max(200).allow("").messages({
    "string.base": "Image must be a string.",
    "string.max": "Image cannot exceed 200 characters.",
  }),

  catid: Joi.number().integer().positive().messages({
    "number.base": "Category ID must be a number.",
    "number.integer": "Category ID must be an integer.",
    "number.positive": "Category ID must be positive.",
    "any.required": "Category ID is required.",
  }),
};

export const productSchema = Joi.object(productFields)
  .fork(["name", "price", "stock", "catid"], (schema) => schema.required())
  .unknown(false)
  .required();

export const productUpdateSchema = Joi.object(productFields)
  .min(1)
  .unknown(false)
  .required();
