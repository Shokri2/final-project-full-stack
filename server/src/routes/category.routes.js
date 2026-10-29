import express from "express";
import {
  createCategoriesController,
  deleteCategoryById,
  getAllCategoriesController,
  getCategoryByNameController,
  updateCategoryById,
} from "../controller/categories.Controller.js";
import { validate } from "../middleware/validate.Middleware.js";
import { protect, authorizeRoles } from "../middleware/protect.Middleware.js";
import { categorySchema } from "../validation/category.Validation.js";

const router = express.Router();

router.post(
  "/category",
  protect,
  authorizeRoles("admin"),
  validate(categorySchema),
  createCategoriesController,
);

router.get("/categories", getAllCategoriesController);
router.get("/category", getCategoryByNameController);

router.put(
  "/category/:id",
  protect,
  authorizeRoles("admin"),
  updateCategoryById,
);

router.delete(
  "/category/:id",
  protect,
  authorizeRoles("admin"),
  deleteCategoryById,
);

export default router;
