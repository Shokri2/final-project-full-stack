import Joi from "joi";
import { paginationQuery } from "../utils/pagination.js";
import { FEEDBACK_STATUSES } from "../utils/feedbackRules.js";

const ratingRule = Joi.number().integer().min(1).max(5).messages({
  "number.base": "Rating must be a number from 1 to 5.",
  "number.min": "Rating must be at least 1.",
  "number.max": "Rating cannot be more than 5.",
  "any.required": "Rating is required.",
});

const commentRule = Joi.string().trim().min(10).max(2000).messages({
  "string.empty": "Comment is required.",
  "string.min": "Comment must be at least 10 characters long.",
  "string.max": "Comment cannot exceed 2000 characters.",
  "any.required": "Comment is required.",
});

export const createFeedbackSchema = Joi.object({
  crop_id: Joi.number().integer().positive().messages({
    "number.base": "crop_id must be a number.",
  }),
  request_id: Joi.number().integer().positive().messages({
    "number.base": "request_id must be a number.",
  }),
  rating: ratingRule.required(),
  comment: commentRule.required(),
});

export const updateFeedbackSchema = Joi.object({
  rating: ratingRule,
  comment: commentRule,
})
  .min(1)
  .messages({
    "object.min": "Provide a new rating or comment.",
  });

export const publicFeedbackQuerySchema = Joi.object({
  ...paginationQuery(["created_at", "rating"], "created_at"),
  crop_id: Joi.number().integer().positive(),
  rating: Joi.number().integer().min(1).max(5),
});

export const myFeedbackQuerySchema = Joi.object({
  ...paginationQuery(["created_at", "rating"], "created_at"),
  status: Joi.string().valid(...FEEDBACK_STATUSES),
});

export const manageFeedbackQuerySchema = Joi.object({
  ...paginationQuery(["created_at", "rating", "status"], "created_at"),
  status: Joi.string().valid(...FEEDBACK_STATUSES),
  crop_id: Joi.number().integer().positive(),
  rating: Joi.number().integer().min(1).max(5),
  type: Joi.string().valid("crop", "request", "platform"),
});

export const rejectFeedbackSchema = Joi.object({
  reason: Joi.string().trim().min(5).max(500).required().messages({
    "string.empty": "Rejection reason is required.",
    "string.min": "Rejection reason must be at least 5 characters long.",
    "any.required": "Rejection reason is required.",
  }),
});

export const feedbackIdParamSchema = Joi.object({
  id: Joi.number().integer().positive().required().messages({
    "number.base": "Invalid feedback ID.",
  }),
});
