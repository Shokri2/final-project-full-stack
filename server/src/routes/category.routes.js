import {
  createCategoriesController,
  deleteCategoryById,
  getAllCategoriesController,
  getCategoryByNameController,
  updateCategoryById,
} from "../controller/categories.Controller.js";
import { loginRateLimiter } from "../middleware/authRateLimit.Middleware.js";
import { apiLimiter } from "../middleware/rateLimit.Middleware.js";
import { validate } from "../middleware/validate.Middleware.js";
import { protect } from "../middleware/protect.Middleware.js";
import express from "express";
import { categorySchema } from "../validation/category.Validation.js";

const router = express.Router();

router.post("/category", validate(categorySchema), createCategoriesController);
router.get("/categories", getAllCategoriesController);
router.get("/category", getCategoryByNameController);
router.put("/category/:id", protect, updateCategoryById);
router.delete("/category/:id", protect, deleteCategoryById);

export default router;
