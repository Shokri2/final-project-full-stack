import express from "express";
import {
  createProductController,
  getAllProductsController,
  getProductByIdController,
  updateProductController,
  deleteProductById,
  updateProductStatusController,
} from "../controller/products.Controller.js";
import { validate } from "../middleware/validate.Middleware.js";
import { protect } from "../middleware/protect.Middleware.js";
import { productSchema } from "../validation/products.Validation.js";
const router = express.Router();
router.post(
  "/product",
  protect,
  validate(productSchema),
  createProductController,
);
router.get("/products", getAllProductsController);
router.get("/product/:id", getProductByIdController);
router.put(
  "/product/:id",
  protect,
  validate(productSchema),
  updateProductController,
);
router.delete("/product/:id", protect, deleteProductById);
router.patch("/product/:id/status", protect, updateProductStatusController);

export default router;
