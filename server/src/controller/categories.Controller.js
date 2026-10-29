import {
  createCategories,
  getAllCategories,
  getCategoryByName,
  getCategoryById,
  deleteCategory,
  updateCategory,
} from "../model/categories.Model.js";

export const createCategoriesController = async (req, res) => {
  try {
    const { name, description } = req.body;
    const created_by = req.user.id;

    const categories = await getCategoryByName(name);

    if (categories.length !== 0) {
      return res.status(400).json({
        message: "Category name already exists.",
      });
    }

    const created = await createCategories({
      name,
      description,
      created_by,
    });

    if (!created) {
      return res.status(400).json({
        message: "Failed to create category.",
      });
    }

    return res.status(201).json({
      message: "Category created successfully.",
      category: created,
    });
  } catch (error) {
    console.error("CREATE CATEGORY ERROR:", error);

    return res.status(500).json({
      message: "Internal server error.",
    });
  }
};

export const getAllCategoriesController = async (req, res) => {
  try {
    const categories = await getAllCategories();

    return res.status(200).json({
      message:
        categories.length === 0
          ? "No categories found."
          : "Categories retrieved successfully.",
      categories,
    });
  } catch (error) {
    console.error("GET CATEGORIES ERROR:", error);

    return res.status(500).json({
      message: "Internal server error.",
    });
  }
};

export const getCategoryByNameController = async (req, res) => {
  try {
    const name =
      typeof req.query.name === "string"
        ? req.query.name.trim()
        : typeof req.body?.name === "string"
          ? req.body.name.trim()
          : "";

    if (!name) {
      const categories = await getAllCategories();

      return res.status(200).json({
        message: "Categories retrieved successfully.",
        categories,
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
    console.error("GET CATEGORY BY NAME ERROR:", error);

    return res.status(500).json({
      message: "Internal server error.",
    });
  }
};

export const deleteCategoryById = async (req, res) => {
  try {
    const { id } = req.params;

    const deleted = await deleteCategory(id);

    if (deleted.length === 0) {
      return res.status(404).json({
        message: "Category not found.",
      });
    }

    return res.status(200).json({
      message: "Category deleted successfully.",
      category: deleted[0],
    });
  } catch (error) {
    console.error("DELETE CATEGORY ERROR:", error);

    return res.status(500).json({
      message: "Internal server error.",
    });
  }
};

export const updateCategoryById = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    const { name, description } = req.body;

    const existingCategories = await getCategoryById({ id });

    if (existingCategories.length === 0) {
      return res.status(404).json({
        message: "Category not found.",
      });
    }

    const existingCategory = existingCategories[0];

    const newName =
      typeof name === "string" && name.trim()
        ? name.trim()
        : existingCategory.name;

    const newDescription =
      description !== undefined ? description : existingCategory.description;

    const categoriesWithSameName = await getCategoryByName(newName);

    const duplicate = categoriesWithSameName.some(
      (category) => String(category.id) !== String(id),
    );

    if (duplicate) {
      return res.status(400).json({
        message: "Category name already exists.",
      });
    }

    const updated = await updateCategory(id, userId, newName, newDescription);

    if (updated.length === 0) {
      return res.status(404).json({
        message: "Category not found.",
      });
    }

    return res.status(200).json({
      message: "Category updated successfully.",
      category: updated[0],
    });
  } catch (error) {
    console.error("UPDATE CATEGORY ERROR:", error);

    return res.status(500).json({
      message: "Internal server error.",
    });
  }
};
