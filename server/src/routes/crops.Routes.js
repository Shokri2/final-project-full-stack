import express from "express";
import {
  getCrops,
  getCropDetails,
  getAllCropsForAdmin,
  getCropDetailsForAdmin,
  createCrop,
  updateCrop,
  updateCropStatusController,
  deleteCrop,
} from "../controller/crops.Controller.js";
import { authenticate } from "../middleware/authenticate.Middleware.js";
import { authorize } from "../middleware/authorize.Middleware.js";
import { validate } from "../middleware/validate.Middleware.js";
import {
  cropsQuerySchema,
  adminCropsQuerySchema,
  createCropSchema,
  updateCropSchema,
  cropStatusSchema,
  cropIdParamSchema,
} from "../validation/crops.Validation.js";

const router = express.Router();

router.get("/", validate(cropsQuerySchema, "query"), getCrops);

router.get(
  "/manage",
  authenticate,
  authorize("admin"),
  validate(adminCropsQuerySchema, "query"),
  getAllCropsForAdmin,
);

router.get(
  "/manage/:id",
  authenticate,
  authorize("admin"),
  validate(cropIdParamSchema, "params"),
  getCropDetailsForAdmin,
);

router.get("/:id", validate(cropIdParamSchema, "params"), getCropDetails);

router.post(
  "/",
  authenticate,
  authorize("admin"),
  validate(createCropSchema),
  createCrop,
);

router.put(
  "/:id",
  authenticate,
  authorize("admin"),
  validate(cropIdParamSchema, "params"),
  validate(updateCropSchema),
  updateCrop,
);

router.patch(
  "/:id/status",
  authenticate,
  authorize("admin"),
  validate(cropIdParamSchema, "params"),
  validate(cropStatusSchema),
  updateCropStatusController,
);

router.delete(
  "/:id",
  authenticate,
  authorize("admin"),
  validate(cropIdParamSchema, "params"),
  deleteCrop,
);

export default router;
