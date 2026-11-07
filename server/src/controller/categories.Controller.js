import {
  createCategories,
  getAllCategories,
  getCategoryByName,
  getCategoryById,
  getCategoryDetails,
  deleteCategory,
  updateCategory,
} from "../model/categories.Model.js";
import { logActivity } from "../utils/activityLog.js";
import { buildPagination } from "../utils/pagination.js";

export const createCategoriesController = async (req, res, next) => {
  try {
    const { name, description, image } = req.body;
    const created_by = req.user.id;

    const categories = await getCategoryByName(name);

    if (categories.length !== 0) {
      return res.status(409).json({
        message: "Category name already exists.",
      });
    }

    const created = await createCategories({
      name,
      description: description || null,
      image: image || null,
      created_by,
    });

    if (!created) {
      return res.status(400).json({
        message: "Failed to create category.",
      });
    }

    await logActivity({
      userId: req.user.id,
      action: "CATEGORY_CREATED",
      entityType: "category",
      entityId: created.id,
      details: { name: created.name },
      ip: req.ip,
    });

    return res.status(201).json({
      message: "Category created successfully.",
      category: created,
    });
  } catch (error) {
    return next(error);
  }
};

export const getAllCategoriesController = async (req, res, next) => {
  try {
    const { categories, total } = await getAllCategories(req.query);

    return res.status(200).json({
      message:
        categories.length === 0
          ? "No categories found."
          : "Categories retrieved successfully.",
      categories,
      pagination: buildPagination(req.query, total),
    });
  } catch (error) {
    return next(error);
  }
};

export const getCategoryByNameController = async (req, res, next) => {
  try {
    const name = typeof req.query.name === "string" ? req.query.name.trim() : "";

    if (!name) {
      return res.status(400).json({
        message: "Category name is required.",
      });
    }

    const categories = await getCategoryByName(name);

    if (categories.length === 0) {
      return res.status(404).json({
        message: "Category not found.",
      });
    }

    return res.status(200).json({
      message: "Category retrieved successfully.",
      categories,
    });
  } catch (error) {
    return next(error);
  }
};

export const getCategoryDetailsController = async (req, res, next) => {
  try {
    const category = await getCategoryDetails(req.params.id);

    if (!category) {
      return res.status(404).json({
        message: "Category not found.",
      });
    }

    return res.status(200).json({
      message: "Category retrieved successfully.",
      category,
    });
  } catch (error) {
    return next(error);
  }
};

export const deleteCategoryById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const details = await getCategoryDetails(id);

    if (!details) {
      return res.status(404).json({
        message: "Category not found.",
      });
    }

    if (details.crops.length > 0) {
      return res.status(409).json({
        message: `This category still has ${details.crops.length} crop(s). Move or delete them first.`,
      });
    }

    const deleted = await deleteCategory(id);

    await logActivity({
      userId: req.user.id,
      action: "CATEGORY_DELETED",
      entityType: "category",
      entityId: Number(id),
      details: { name: details.name },
      ip: req.ip,
    });

    return res.status(200).json({
      message: "Category deleted successfully.",
      category: deleted[0],
    });
  } catch (error) {
    return next(error);
  }
};

export const updateCategoryById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    const { name, description, image } = req.body;

    const existingCategories = await getCategoryById({ id });

    if (existingCategories.length === 0) {
      return res.status(404).json({
        message: "Category not found.",
      });
    }

    const existingCategory = existingCategories[0];

    const newName = name ?? existingCategory.name;

    const newDescription =
      description !== undefined ? description || null : existingCategory.description;

    const newImage = image !== undefined ? image || null : existingCategory.image;

    const categoriesWithSameName = await getCategoryByName(newName);

    const duplicate = categoriesWithSameName.some(
      (category) => String(category.id) !== String(id),
    );

    if (duplicate) {
      return res.status(409).json({
        message: "Category name already exists.",
      });
    }

    const updated = await updateCategory(
      id,
      userId,
      newName,
      newDescription,
      newImage,
    );

    await logActivity({
      userId: req.user.id,
      action: "CATEGORY_UPDATED",
      entityType: "category",
      entityId: Number(id),
      details: { name: newName },
      ip: req.ip,
    });

    return res.status(200).json({
      message: "Category updated successfully.",
      category: updated[0],
    });
  } catch (error) {
    return next(error);
  }
};
