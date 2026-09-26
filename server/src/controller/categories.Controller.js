import {
  createCategories,
  getAllCategories,
  getCategoryByName,
  deleteCategory,
  updateCategory,
} from "../model/categories.Model.js";

export const createCategoriesController = async (req, res) => {
  try {
    const { name, description } = req.body;
    const created_by = 8;
    // req.user.id || 1
    const categories = await getCategoryByName({ name });

    if (categories.length !== 0) {
      return res.status(400).json({
        message: "category name already exist",
      });
    }
    const created = await createCategories({
      name,
      description,
      created_by,
    });

    if (!created) {
      return res.status(400).json({
        message: "something went wrong!",
      });
    }

    return res.status(201).json({
      message: "created successfully",
      category: created,
    });
  } catch (error) {
    console.log("error", error);

    return res.status(500).json({
      message: "internal server error",
    });
  }
};

export const getAllCategoriesController = async (req, res) => {
  try {
    const categories = await getAllCategories();

    if (categories.length === 0) {
      return res.status(200).json({
        message: "no categories yet in db",
        categories: [],
      });
    }

    return res.status(200).json({
      message: "gets successfully",
      categories,
    });
  } catch (error) {
    console.log("error", error);

    return res.status(500).json({
      message: "internal server error",
    });
  }
};
export const getCategoryByNameController = async (req, res) => {
  try {
    const { name } = req.body;
    if (!name) {
      const categories = await getAllCategories();
      return res
        .status(200)
        .json({ message: "gets  successfully", categories });
    }

    const categories = await getCategoryByName({ name });
    if (categories.length === 0) {
      return res.status(404).json({ message: "not found" });
    }
    return res
      .status(200)
      .json({ message: "gets all successfully", categories });
  } catch (error) {
    console.log("error", error);

    return res.status(500).json({
      message: "internal server error",
    });
  }
};

export const deleteCategoryById = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await deleteCategory(id);
    if (!deleted) {
      return res.status(400).json({ message: "something went wrong!" });
    }
    return res.status(200).json({ message: "deleted successfully" });
  } catch (error) {
    console.log("error", error);
    return res.status(500).json({ message: "internal server error" });
  }
};

export const updateCategoryById = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    const { name, description } = req.body;
    const categories = await getCategoryByName(name );

    if (categories.length !== 0) {
      return res.status(400).json({ message: "category name already exist" });
    }
    const theCategory = await getCategoryById(id);
    if (theCategory.length === 0) {
      return res.status(404).json({ message: "not found!" });
    }
    const newCategory = {
      name: name || theCategory.name,
      description: description || theCategory.description,

    };
    const updated = await updateCategory(
      id,
      userId,
      newCategory.name,
      newCategory.description,
      new Date()
    );
    return res
      .status(200)
      .json({ message: "updated successfully", category: updated });
  } catch (error) {
    console.log("CREATE CATEGORY ERROR:", error);

    return res.status(500).json({
      message: "internal server error",
      error: error.message,
    });
  }
};
