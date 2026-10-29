import express from "express";

import {
  getCrops,
  getCropDetails,
  createCrop,
  updateCrop,
  deleteCrop,
} from "../controller/crops.Controller.js";

import { authenticate } from "../middleware/authenticate.Middleware.js";
import { authorize } from "../middleware/authorize.Middleware.js";

const router = express.Router();

router.get("/", getCrops);
router.get("/:id", getCropDetails);

router.post("/", authenticate, authorize("admin"), createCrop);
router.put("/:id", authenticate, authorize("admin"), updateCrop);
router.delete("/:id", authenticate, authorize("admin"), deleteCrop);

export default router;
