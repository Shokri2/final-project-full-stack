import { getAllCrops, getCropById } from "../model/crops.Model.js";

export const getCrops = async (req, res) => {
  try {
    const crops = await getAllCrops();

    return res.status(200).json({
      success: true,
      count: crops.length,
      data: crops,
    });
  } catch (error) {
    console.error("GET CROPS ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to retrieve crops.",
    });
  }
};

export const getCropDetails = async (req, res) => {
  try {
    const { id } = req.params;

    if (!/^\d+$/.test(id) || Number(id) < 1) {
      return res.status(400).json({
        success: false,
        message: "Invalid crop ID.",
      });
    }

    const crop = await getCropById(Number(id));

    if (!crop) {
      return res.status(404).json({
        success: false,
        message: "Crop not found.",
      });
    }

    return res.status(200).json({
      success: true,
      data: crop,
    });
  } catch (error) {
    console.error("GET CROP DETAILS ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to retrieve crop details.",
    });
  }
};
