import {
  getAllCrops,
  getCropById,
  createCrop as createCropModel,
  updateCrop as updateCropModel,
  deleteCrop as deleteCropModel,
} from "../model/crops.Model.js";

const validId = (id) => /^\d+$/.test(id) && Number(id) > 0;

const allowedFields = [
  "category_id",
  "is_active",
  "name",
  "name_ar",
  "image",
  "description",
  "water_needs",
  "temperature_min",
  "temperature_max",
  "sunlight",
  "soil_type",
  "growth_duration_days",
];

const numericFields = [
  "category_id",
  "temperature_min",
  "temperature_max",
  "growth_duration_days",
];

const validateCropBody = (body, isCreate = false) => {
  if (!body || typeof body !== "object" || Array.isArray(body)) {
    return "Request body must be an object.";
  }

  if (isCreate && (!body.name?.trim() || !body.name_ar?.trim())) {
    return "English and Arabic crop names are required.";
  }

  if (isCreate && !body.category_id) {
    return "category_id is required.";
  }

  if (body.is_active !== undefined && typeof body.is_active !== "boolean") {
    return "is_active must be true or false.";
  }

  for (const field of ["name", "name_ar"]) {
    if (
      body[field] !== undefined &&
      (typeof body[field] !== "string" || !body[field].trim())
    ) {
      return `${field} must be a non-empty string.`;
    }
  }

  for (const field of numericFields) {
    if (body[field] !== undefined && body[field] !== null) {
      const value = Number(body[field]);

      if (!Number.isFinite(value)) {
        return `${field} must be a valid number.`;
      }

      if (
        field === "growth_duration_days" &&
        (!Number.isInteger(value) || value < 1)
      ) {
        return "growth_duration_days must be a positive integer.";
      }
    }
  }

  for (const field of allowedFields) {
    if (
      body[field] !== undefined &&
      body[field] !== null &&
      !numericFields.includes(field) &&
      field !== "is_active" &&
      typeof body[field] !== "string"
    ) {
      return `${field} must be a string or null.`;
    }
  }

  if (
    body.temperature_min != null &&
    body.temperature_max != null &&
    Number(body.temperature_min) > Number(body.temperature_max)
  ) {
    return "Minimum temperature cannot exceed maximum temperature.";
  }

  return null;
};

export const getCrops = async (req, res, next) => {
  try {
    const crops = await getAllCrops();

    return res.status(200).json({
      success: true,
      count: crops.length,
      data: crops,
    });
  } catch (error) {
    return next(error);
  }
};

export const getCropDetails = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!validId(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid crop ID.",
      });
    }

    const crop = await getCropById(Number(id));

    if (!crop) {
      return res.status(404).json({
        success: false,
        message: "Crop not found.",
      });
    }

    return res.status(200).json({
      success: true,
      data: crop,
    });
  } catch (error) {
    return next(error);
  }
};

export const createCrop = async (req, res, next) => {
  try {
    const errorMessage = validateCropBody(req.body, true);

    if (errorMessage) {
      return res.status(400).json({
        success: false,
        message: errorMessage,
      });
    }

    const cropData = Object.fromEntries(
      Object.entries(req.body).filter(([key]) => allowedFields.includes(key)),
    );

    const crop = await createCropModel(cropData);

    return res.status(201).json({
      success: true,
      message: "Crop created successfully.",
      data: crop,
    });
  } catch (error) {
    return next(error);
  }
};

export const updateCrop = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!validId(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid crop ID.",
      });
    }

    const cropData = Object.fromEntries(
      Object.entries(req.body ?? {}).filter(([key]) =>
        allowedFields.includes(key),
      ),
    );

    if (Object.keys(cropData).length === 0) {
      return res.status(400).json({
        success: false,
        message: "Provide at least one valid crop field to update.",
      });
    }

    const errorMessage = validateCropBody(cropData);

    if (errorMessage) {
      return res.status(400).json({
        success: false,
        message: errorMessage,
      });
    }

    const crop = await updateCropModel(Number(id), cropData);

    if (!crop) {
      return res.status(404).json({
        success: false,
        message: "Crop not found.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Crop updated successfully.",
      data: crop,
    });
  } catch (error) {
    return next(error);
  }
};

export const deleteCrop = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!validId(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid crop ID.",
      });
    }

    const deleted = await deleteCropModel(Number(id));

    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: "Crop not found.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Crop deleted successfully.",
    });
  } catch (error) {
    return next(error);
  }
};
