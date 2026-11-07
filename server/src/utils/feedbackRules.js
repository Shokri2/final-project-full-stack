export const FEEDBACK_STATUSES = ["pending", "approved", "rejected"];

export const REVIEWABLE_REQUEST_STATUSES = ["answered", "closed"];

export const MODERATION_ACTIONS = {
  approve: { from: ["pending", "rejected"], to: "approved" },
  reject: { from: ["pending", "approved"], to: "rejected" },
};

export const checkModeration = (action, feedback, user) => {
  const rule = MODERATION_ACTIONS[action];

  if (String(feedback.user_id) === String(user.id)) {
    return {
      ok: false,
      status: 403,
      message: "You cannot moderate your own feedback.",
    };
  }

  if (!rule.from.includes(feedback.status)) {
    return {
      ok: false,
      status: 409,
      message: `Feedback that is already ${feedback.status} cannot be ${action === "approve" ? "approved" : "rejected"}.`,
    };
  }

  return { ok: true, to: rule.to };
};

export const agronomistFeedbackScope = (param) => {
  return `(
    EXISTS (
      SELECT 1
      FROM agronomist_specialties s
      JOIN crops scope_crop ON scope_crop.category_id = s.category_id
      WHERE s.agronomist_id = ${param} AND scope_crop.id = f.crop_id
    )
    OR EXISTS (
      SELECT 1
      FROM consultation_requests scope_request
      WHERE scope_request.id = f.request_id AND scope_request.agronomist_id = ${param}
    )
  )`;
};
