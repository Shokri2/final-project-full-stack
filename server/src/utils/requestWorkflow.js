export const REQUEST_STATUSES = [
  "pending",
  "assigned",
  "in_progress",
  "answered",
  "closed",
  "rejected",
  "cancelled",
];

export const REQUEST_ACTIONS = {
  assign: { from: ["pending", "assigned"], to: "assigned", roles: ["admin"] },
  start: { from: ["assigned"], to: "in_progress", roles: ["agronomist"] },
  answer: { from: ["in_progress"], to: "answered", roles: ["agronomist"] },
  reject: {
    from: ["pending", "assigned", "in_progress"],
    to: "rejected",
    roles: ["admin", "agronomist"],
  },
  cancel: { from: ["pending"], to: "cancelled", roles: ["user"] },
  close: { from: ["answered"], to: "closed", roles: ["user", "admin"] },
};

export const EDITABLE_STATUSES = ["pending"];
export const UPLOADABLE_STATUSES = ["pending", "assigned"];

export const isOwner = (request, user) => {
  return String(request.user_id) === String(user.id);
};

export const isAssignedAgronomist = (request, user) => {
  return (
    user.role === "agronomist" &&
    request.agronomist_id !== null &&
    String(request.agronomist_id) === String(user.id)
  );
};

export const canViewRequest = (request, user) => {
  return (
    user.role === "admin" ||
    isOwner(request, user) ||
    isAssignedAgronomist(request, user)
  );
};

const formatStatus = (status) => status.replace("_", " ");

export const checkTransition = (action, request, user) => {
  const rule = REQUEST_ACTIONS[action];

  if (!rule) {
    return { ok: false, status: 400, message: "Unknown action." };
  }

  if (!rule.roles.includes(user.role)) {
    return {
      ok: false,
      status: 403,
      message: "You do not have permission to perform this action.",
    };
  }

  if (user.role === "user" && !isOwner(request, user)) {
    return {
      ok: false,
      status: 403,
      message: "You can only manage your own requests.",
    };
  }

  if (user.role === "agronomist" && !isAssignedAgronomist(request, user)) {
    return {
      ok: false,
      status: 403,
      message: "This request is not assigned to you.",
    };
  }

  if (!rule.from.includes(request.status)) {
    return {
      ok: false,
      status: 409,
      message: `Cannot ${action} a request that is ${formatStatus(request.status)}.`,
    };
  }

  return { ok: true, to: rule.to };
};

export const buildStatusChanges = (action, payload, now = new Date()) => {
  const changes = { status: REQUEST_ACTIONS[action].to };

  if (action === "assign") {
    changes.agronomist_id = payload.agronomist_id;
    changes.assigned_at = now;
  }

  if (action === "answer") {
    changes.agronomist_response = payload.response;
    changes.answered_at = now;
  }

  if (action === "reject") {
    changes.rejection_reason = payload.reason;
    changes.closed_at = now;
  }

  if (action === "cancel" || action === "close") {
    changes.closed_at = now;
  }

  return changes;
};
