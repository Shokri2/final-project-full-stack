import express from "express";
import { getCrops, getCropDetails } from "../controller/crops.Controller.js";

const router = express.Router();

router.get("/", getCrops);
router.get("/:id", getCropDetails);

export default router;
