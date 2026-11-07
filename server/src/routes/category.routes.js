import express from "express";
import {
  createCategoriesController,
  deleteCategoryById,
  getAllCategoriesController,
  getCategoryByNameController,
  getCategoryDetailsController,
  updateCategoryById,
} from "../controller/categories.Controller.js";
import { validate } from "../middleware/validate.Middleware.js";
import { authenticate } from "../middleware/authenticate.Middleware.js";
import { authorize } from "../middleware/authorize.Middleware.js";
import {
  categorySchema,
  categoryUpdateSchema,
  categoriesQuerySchema,
  categoryIdParamSchema,
} from "../validation/category.Validation.js";

const router = express.Router();

router.post(
  "/category",
  authenticate,
  authorize("admin"),
  validate(categorySchema),
  createCategoriesController,
);

router.get(
  "/categories",
  validate(categoriesQuerySchema, "query"),
  getAllCategoriesController,
);

router.get("/category", getCategoryByNameController);

router.get(
  "/category/:id",
  validate(categoryIdParamSchema, "params"),
  getCategoryDetailsController,
);

router.put(
  "/category/:id",
  authenticate,
  authorize("admin"),
  validate(categoryIdParamSchema, "params"),
  validate(categoryUpdateSchema),
  updateCategoryById,
);

router.delete(
  "/category/:id",
  authenticate,
  authorize("admin"),
  validate(categoryIdParamSchema, "params"),
  deleteCategoryById,
);

export default router;
