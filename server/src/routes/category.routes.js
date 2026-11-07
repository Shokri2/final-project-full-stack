import express from "express";
import {
  createCategoriesController,
  deleteCategoryById,
  getAllCategoriesController,
  getCategoryByNameController,
  updateCategoryById,
} from "../controller/categories.Controller.js";
import { validate } from "../middleware/validate.Middleware.js";
import { authenticate } from "../middleware/authenticate.Middleware.js";
import { authorize } from "../middleware/authorize.Middleware.js";
import { categorySchema } from "../validation/category.Validation.js";

const router = express.Router();

router.post(
  "/category",
  authenticate,
  authorize("admin"),
  validate(categorySchema),
  createCategoriesController,
);

router.get("/categories", getAllCategoriesController);
router.get("/category", getCategoryByNameController);

router.put(
  "/category/:id",
  authenticate,
  authorize("admin"),
  updateCategoryById,
);

router.delete(
  "/category/:id",
  authenticate,
  authorize("admin"),
  deleteCategoryById,
);

export default router;
