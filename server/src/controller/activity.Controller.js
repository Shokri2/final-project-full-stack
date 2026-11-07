import { getActivities, getActivityActions } from "../model/activity.Model.js";
import { buildPagination } from "../utils/pagination.js";

export const getActivitiesController = async (req, res, next) => {
  try {
    const { activities, total } = await getActivities(req.query);

    return res.status(200).json({
      activities,
      pagination: buildPagination(req.query, total),
    });
  } catch (error) {
    return next(error);
  }
};

export const getActivityActionsController = async (req, res, next) => {
  try {
    const actions = await getActivityActions();

    return res.status(200).json({
      actions,
    });
  } catch (error) {
    return next(error);
  }
};
