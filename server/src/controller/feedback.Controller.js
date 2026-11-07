import {
  createFeedback,
  findFeedbackById,
  findActiveFeedbackForTarget,
  updateOwnFeedback,
  deleteFeedback,
  getRatingSummary,
} from "../model/feedback.Model.js";
import { getPublicFeedback, getUserFeedback } from "../model/feedbackList.Model.js";
import { getRequestById } from "../model/request.Model.js";
import { getCropById } from "../model/crops.Model.js";
import { logActivity } from "../utils/activityLog.js";
import { buildPagination } from "../utils/pagination.js";
import { REVIEWABLE_REQUEST_STATUSES } from "../utils/feedbackRules.js";

const resolveTarget = async (body, user) => {
  if (body.request_id) {
    const request = await getRequestById(body.request_id);

    if (!request || String(request.user_id) !== String(user.id)) {
      return { error: [404, "Request not found."] };
    }

    if (!REVIEWABLE_REQUEST_STATUSES.includes(request.status)) {
      return { error: [409, "You can review a consultation once the agronomist has answered it."] };
    }

    if (body.crop_id && String(body.crop_id) !== String(request.crop_id)) {
      return { error: [400, "crop_id does not match the request's crop."] };
    }

    return { cropId: request.crop_id, requestId: request.id };
  }

  if (body.crop_id) {
    const crop = await getCropById(body.crop_id);

    if (!crop) {
      return { error: [400, "The selected crop does not exist."] };
    }

    return { cropId: crop.id, requestId: null };
  }

  return { cropId: null, requestId: null };
};

export const createFeedbackController = async (req, res, next) => {
  try {
    const target = await resolveTarget(req.body, req.user);

    if (target.error) {
      const [status, message] = target.error;
      return res.status(status).json({ message });
    }

    const existing = await findActiveFeedbackForTarget(req.user.id, target);

    if (existing) {
      return res.status(409).json({
        message:
          existing.status === "pending"
            ? "You already have feedback waiting for review on this item."
            : "You have already reviewed this item.",
      });
    }

    const id = await createFeedback({
      user_id: req.user.id,
      crop_id: target.cropId,
      request_id: target.requestId,
      rating: req.body.rating,
      comment: req.body.comment,
    });

    await logActivity({
      userId: req.user.id,
      action: "FEEDBACK_SUBMITTED",
      entityType: "feedback",
      entityId: id,
      details: { rating: req.body.rating, crop_id: target.cropId, request_id: target.requestId },
      ip: req.ip,
    });

    const feedback = await findFeedbackById(id);

    return res.status(201).json({
      message: "Thank you! Your feedback will appear publicly after it is reviewed.",
      feedback,
    });
  } catch (error) {
    return next(error);
  }
};

export const getPublicFeedbackController = async (req, res, next) => {
  try {
    const { feedback, total } = await getPublicFeedback(req.query);

    const response = {
      feedback,
      pagination: buildPagination(req.query, total),
    };

    if (req.query.crop_id) {
      response.summary = await getRatingSummary(req.query.crop_id);
    }

    return res.status(200).json(response);
  } catch (error) {
    return next(error);
  }
};

export const getMyFeedbackController = async (req, res, next) => {
  try {
    const { feedback, total } = await getUserFeedback(req.user.id, req.query);

    return res.status(200).json({
      feedback,
      pagination: buildPagination(req.query, total),
    });
  } catch (error) {
    return next(error);
  }
};

const findOwnFeedback = async (id, user) => {
  const feedback = await findFeedbackById(id);

  if (!feedback || String(feedback.user_id) !== String(user.id)) {
    return null;
  }

  return feedback;
};

export const updateFeedbackController = async (req, res, next) => {
  try {
    const feedback = await findOwnFeedback(req.params.id, req.user);

    if (!feedback) {
      return res.status(404).json({ message: "Feedback not found." });
    }

    const updated = await updateOwnFeedback(feedback.id, req.body);

    if (!updated) {
      return res.status(409).json({
        message: "Only feedback that is still waiting for review can be edited.",
      });
    }

    return res.status(200).json({
      message: "Feedback updated successfully.",
      feedback: await findFeedbackById(feedback.id),
    });
  } catch (error) {
    return next(error);
  }
};

export const deleteFeedbackController = async (req, res, next) => {
  try {
    const feedback = await findFeedbackById(req.params.id);
    const isAdmin = req.user.role === "admin";
    const isOwner = feedback && String(feedback.user_id) === String(req.user.id);

    if (!feedback || (!isAdmin && !isOwner)) {
      return res.status(404).json({ message: "Feedback not found." });
    }

    if (!isAdmin && feedback.status !== "pending") {
      return res.status(409).json({
        message: "Only feedback that is still waiting for review can be deleted.",
      });
    }

    await deleteFeedback(feedback.id);

    await logActivity({
      userId: req.user.id,
      action: "FEEDBACK_DELETED",
      entityType: "feedback",
      entityId: feedback.id,
      ip: req.ip,
    });

    return res.status(200).json({
      message: "Feedback deleted successfully.",
    });
  } catch (error) {
    return next(error);
  }
};
