import { getAdminDashboard } from "../model/adminDashboard.Model.js";
import { getAgronomistDashboard } from "../model/agronomistDashboard.Model.js";
import { getUserDashboard } from "../model/userDashboard.Model.js";

export const getAdminDashboardController = async (req, res, next) => {
  try {
    const dashboard = await getAdminDashboard();

    return res.status(200).json({ dashboard });
  } catch (error) {
    return next(error);
  }
};

export const getAgronomistDashboardController = async (req, res, next) => {
  try {
    const dashboard = await getAgronomistDashboard(req.user.id);

    return res.status(200).json({ dashboard });
  } catch (error) {
    return next(error);
  }
};

export const getUserDashboardController = async (req, res, next) => {
  try {
    const dashboard = await getUserDashboard(req.user.id);

    return res.status(200).json({ dashboard });
  } catch (error) {
    return next(error);
  }
};
