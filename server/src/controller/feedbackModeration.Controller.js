import { findFeedbackById, setFeedbackStatus } from "../model/feedback.Model.js";
import {
  getManagedFeedback,
  isFeedbackInAgronomistScope,
} from "../model/feedbackList.Model.js";
import { logActivity } from "../utils/activityLog.js";
import { buildPagination } from "../utils/pagination.js";
import { checkModeration } from "../utils/feedbackRules.js";

const canAccess = async (feedback, user) => {
  if (user.role === "admin") {
    return true;
  }

  return isFeedbackInAgronomistScope(feedback.id, user.id);
};

export const getManagedFeedbackController = async (req, res, next) => {
  try {
    const { feedback, total } = await getManagedFeedback(req.query, req.user);

    return res.status(200).json({
      feedback,
      pagination: buildPagination(req.query, total),
    });
  } catch (error) {
    return next(error);
  }
};

export const getFeedbackDetailsController = async (req, res, next) => {
  try {
    const feedback = await findFeedbackById(req.params.id);

    const isOwner = feedback && String(feedback.user_id) === String(req.user.id);

    if (!feedback || (!isOwner && !(await canAccess(feedback, req.user)))) {
      return res.status(404).json({ message: "Feedback not found." });
    }

    return res.status(200).json({
      feedback,
    });
  } catch (error) {
    return next(error);
  }
};

export const moderateFeedback = (action) => {
  return async (req, res, next) => {
    try {
      const feedback = await findFeedbackById(req.params.id);

      if (!feedback || !(await canAccess(feedback, req.user))) {
        return res.status(404).json({ message: "Feedback not found." });
      }

      const decision = checkModeration(action, feedback, req.user);

      if (!decision.ok) {
        return res.status(decision.status).json({ message: decision.message });
      }

      await setFeedbackStatus(feedback.id, {
        status: decision.to,
        reviewerId: req.user.id,
        reason: req.body?.reason,
      });

      await logActivity({
        userId: req.user.id,
        action: action === "approve" ? "FEEDBACK_APPROVED" : "FEEDBACK_REJECTED",
        entityType: "feedback",
        entityId: feedback.id,
        details: { from: feedback.status, to: decision.to },
        ip: req.ip,
      });

      return res.status(200).json({
        message: action === "approve" ? "Feedback approved and now visible publicly." : "Feedback rejected.",
        feedback: await findFeedbackById(feedback.id),
      });
    } catch (error) {
      return next(error);
    }
  };
};
