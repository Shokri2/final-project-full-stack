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
import { protect, authorizeRoles } from "../middleware/protect.Middleware.js";

import {
  productSchema,
  productUpdateSchema,
} from "../validation/products.Validation.js";

const router = express.Router();

router.post(
  "/product",
  protect,
  authorizeRoles("admin"),
  validate(productSchema),
  createProductController,
);

router.get("/products", getAllProductsController);
router.get("/product/:id", getProductByIdController);

router.put(
  "/product/:id",
  protect,
  authorizeRoles("admin"),
  validate(productUpdateSchema),
  updateProductController,
);

router.delete(
  "/product/:id",
  protect,
  authorizeRoles("admin"),
  deleteProductById,
);

router.patch(
  "/product/:id/status",
  protect,
  authorizeRoles("admin"),
  updateProductStatusController,
);

export default router;
