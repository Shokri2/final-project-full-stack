import {
  getAllCrops,
  getCropById,
  createCrop as createCropModel,
  updateCrop as updateCropModel,
  deleteCrop as deleteCropModel,
  updateCropStatus,
} from "../model/crops.Model.js";
import { getCategoryById } from "../model/categories.Model.js";
import { logActivity } from "../utils/activityLog.js";
import { buildPagination } from "../utils/pagination.js";

const categoryExists = async (categoryId) => {
  const categories = await getCategoryById({ id: categoryId });
  return categories.length > 0;
};

const listCrops = (includeInactive) => {
  return async (req, res, next) => {
    try {
      const { crops, total } = await getAllCrops(req.query, { includeInactive });

      return res.status(200).json({
        success: true,
        count: crops.length,
        data: crops,
        pagination: buildPagination(req.query, total),
      });
    } catch (error) {
      return next(error);
    }
  };
};

const cropDetails = (includeInactive) => {
  return async (req, res, next) => {
    try {
      const crop = await getCropById(req.params.id, { includeInactive });

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
};

export const getCrops = listCrops(false);
export const getAllCropsForAdmin = listCrops(true);
export const getCropDetails = cropDetails(false);
export const getCropDetailsForAdmin = cropDetails(true);

export const createCrop = async (req, res, next) => {
  try {
    if (!(await categoryExists(req.body.category_id))) {
      return res.status(400).json({
        success: false,
        message: "Selected category does not exist.",
      });
    }

    const cropId = await createCropModel(req.body, req.user.id);
    const crop = await getCropById(cropId, { includeInactive: true });

    await logActivity({
      userId: req.user.id,
      action: "CROP_CREATED",
      entityType: "crop",
      entityId: cropId,
      details: { name: crop.name },
      ip: req.ip,
    });

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

    if (req.body.category_id && !(await categoryExists(req.body.category_id))) {
      return res.status(400).json({
        success: false,
        message: "Selected category does not exist.",
      });
    }

    const current = await getCropById(id, { includeInactive: true });

    if (!current) {
      return res.status(404).json({
        success: false,
        message: "Crop not found.",
      });
    }

    const tempMin = req.body.temperature_min !== undefined ? req.body.temperature_min : current.temperature_min;
    const tempMax = req.body.temperature_max !== undefined ? req.body.temperature_max : current.temperature_max;

    if (tempMin != null && tempMax != null && Number(tempMin) > Number(tempMax)) {
      return res.status(400).json({
        success: false,
        message: "Minimum temperature cannot exceed maximum temperature.",
      });
    }

    await updateCropModel(id, req.body, req.user.id);

    const crop = await getCropById(id, { includeInactive: true });

    await logActivity({
      userId: req.user.id,
      action: "CROP_UPDATED",
      entityType: "crop",
      entityId: Number(id),
      details: { fields: Object.keys(req.body) },
      ip: req.ip,
    });

    return res.status(200).json({
      success: true,
      message: "Crop updated successfully.",
      data: crop,
    });
  } catch (error) {
    return next(error);
  }
};

export const updateCropStatusController = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { is_active } = req.body;

    const crop = await updateCropStatus(id, is_active, req.user.id);

    if (!crop) {
      return res.status(404).json({
        success: false,
        message: "Crop not found.",
      });
    }

    await logActivity({
      userId: req.user.id,
      action: is_active ? "CROP_ACTIVATED" : "CROP_DEACTIVATED",
      entityType: "crop",
      entityId: crop.id,
      details: { name: crop.name },
      ip: req.ip,
    });

    return res.status(200).json({
      success: true,
      message: is_active ? "Crop activated successfully." : "Crop deactivated successfully.",
      data: crop,
    });
  } catch (error) {
    return next(error);
  }
};

export const deleteCrop = async (req, res, next) => {
  try {
    const { id } = req.params;

    const result = await deleteCropModel(id);

    if (result.reason === "NOT_FOUND") {
      return res.status(404).json({
        success: false,
        message: "Crop not found.",
      });
    }

    if (result.reason === "HAS_REQUESTS") {
      return res.status(409).json({
        success: false,
        message: `This crop has ${result.requestsCount} consultation request(s). Deactivate it instead of deleting it.`,
      });
    }

    await logActivity({
      userId: req.user.id,
      action: "CROP_DELETED",
      entityType: "crop",
      entityId: Number(id),
      details: { name: result.name },
      ip: req.ip,
    });

    return res.status(200).json({
      success: true,
      message: "Crop deleted successfully.",
    });
  } catch (error) {
    return next(error);
  }
};
