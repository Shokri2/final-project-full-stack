import Joi from "joi";
import { paginationQuery } from "../utils/pagination.js";

const text = (field, max) =>
  Joi.string().trim().max(max).allow("", null).messages({
    "string.base": `${field} must be a string.`,
    "string.max": `${field} cannot exceed ${max} characters.`,
  });

const temperature = (field) =>
  Joi.number().min(-50).max(60).allow(null).messages({
    "number.base": `${field} must be a number.`,
    "number.min": `${field} cannot be below -50.`,
    "number.max": `${field} cannot be above 60.`,
  });

const growthStageSchema = Joi.object({
  name: Joi.string().trim().min(2).max(100).required().messages({
    "any.required": "Each growth stage needs a name.",
    "string.empty": "Each growth stage needs a name.",
  }),
  name_ar: Joi.string().trim().min(2).max(100).required().messages({
    "any.required": "Each growth stage needs an Arabic name.",
    "string.empty": "Each growth stage needs an Arabic name.",
  }),
  duration_days: Joi.number().integer().min(1).max(1000).allow(null).messages({
    "number.base": "Stage duration must be a number of days.",
    "number.min": "Stage duration must be at least 1 day.",
  }),
  tips: text("Stage tips", 2000),
});

const cropFields = {
  category_id: Joi.number().integer().positive().messages({
    "number.base": "category_id must be a number.",
    "any.required": "category_id is required.",
  }),
  name: Joi.string().trim().min(2).max(100).messages({
    "string.empty": "Crop name cannot be empty.",
    "string.max": "Crop name cannot exceed 100 characters.",
    "any.required": "English crop name is required.",
  }),
  name_ar: Joi.string().trim().min(2).max(100).messages({
    "string.empty": "Arabic crop name cannot be empty.",
    "string.max": "Arabic crop name cannot exceed 100 characters.",
    "any.required": "Arabic crop name is required.",
  }),
  image: text("Image", 500),
  description: text("Description", 5000),
  water_needs: text("Water needs", 500),
  temperature_min: temperature("temperature_min"),
  temperature_max: temperature("temperature_max"),
  sunlight: text("Sunlight", 100),
  soil_type: text("Soil type", 150),
  growth_duration_days: Joi.number().integer().min(1).max(2000).allow(null).messages({
    "number.base": "growth_duration_days must be a number.",
    "number.integer": "growth_duration_days must be a whole number.",
    "number.min": "growth_duration_days must be a positive integer.",
  }),
  is_active: Joi.boolean().messages({
    "boolean.base": "is_active must be true or false.",
  }),
  growth_stages: Joi.array().items(growthStageSchema).max(20).messages({
    "array.base": "growth_stages must be an array.",
    "array.max": "A crop cannot have more than 20 growth stages.",
  }),
};

const temperatureOrder = (value, helpers) => {
  if (
    value.temperature_min != null &&
    value.temperature_max != null &&
    value.temperature_min > value.temperature_max
  ) {
    return helpers.message("Minimum temperature cannot exceed maximum temperature.");
  }

  return value;
};

export const createCropSchema = Joi.object({
  ...cropFields,
  category_id: cropFields.category_id.required(),
  name: cropFields.name.required(),
  name_ar: cropFields.name_ar.required(),
}).custom(temperatureOrder);

export const updateCropSchema = Joi.object(cropFields)
  .min(1)
  .custom(temperatureOrder)
  .messages({
    "object.min": "Provide at least one valid crop field to update.",
  });

export const cropStatusSchema = Joi.object({
  is_active: Joi.boolean().required().messages({
    "boolean.base": "is_active must be true or false.",
    "any.required": "is_active is required.",
  }),
});

const cropsQueryFields = {
  ...paginationQuery(
    ["name", "created_at", "growth_duration_days", "temperature_min", "rating"],
    "name",
    12,
  ),
  order: Joi.string().lowercase().valid("asc", "desc").default("asc"),
  category_id: Joi.number().integer().positive().messages({
    "number.base": "category_id must be a number.",
  }),
  sunlight: Joi.string().trim().max(100),
  max_growth_days: Joi.number().integer().min(1).messages({
    "number.base": "max_growth_days must be a number.",
  }),
};

export const cropsQuerySchema = Joi.object(cropsQueryFields);

export const adminCropsQuerySchema = Joi.object({
  ...cropsQueryFields,
  sort: Joi.string()
    .valid("name", "created_at", "growth_duration_days", "temperature_min", "rating", "requests_count")
    .default("name"),
  is_active: Joi.boolean(),
});

export const cropIdParamSchema = Joi.object({
  id: Joi.number().integer().positive().required().messages({
    "number.base": "Invalid crop ID.",
    "number.positive": "Invalid crop ID.",
    "any.required": "Crop ID is required.",
  }),
});
