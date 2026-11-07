import { pool } from "../config/db.js";
import { getRequestForUpdate, getRequestById } from "../model/request.Model.js";
import { getRequestDetails } from "../model/requestDetails.Model.js";
import {
  applyStatusChanges,
  addStatusHistory,
} from "../model/requestStatus.Model.js";
import {
  getEligibleAgronomists,
  isEligibleAgronomist,
} from "../model/agronomist.Model.js";
import { logActivity } from "../utils/activityLog.js";
import {
  canViewRequest,
  checkTransition,
  buildStatusChanges,
} from "../utils/requestWorkflow.js";

const successMessages = {
  assign: "Request assigned to the agronomist.",
  start: "You started working on this request.",
  answer: "Your answer was sent to the farmer.",
  reject: "Request rejected.",
  cancel: "Request cancelled.",
  close: "Request closed.",
};

const historyNote = (action, body, request) => {
  if (action === "reject") {
    return body.reason;
  }

  if (action === "assign" && request.agronomist_id) {
    return body.note || "Request reassigned to another agronomist.";
  }

  return body.note || null;
};

const validateAssignment = async (client, request, agronomistId) => {
  if (String(request.agronomist_id) === String(agronomistId)) {
    return "The request is already assigned to this agronomist.";
  }

  const eligible = await isEligibleAgronomist(client, agronomistId, request.category_id);

  if (!eligible) {
    return "The selected agronomist is not an active specialist for this crop's category.";
  }

  return null;
};

export const changeRequestStatus = (action) => {
  return async (req, res, next) => {
    const client = await pool.connect();

    try {
      await client.query("BEGIN");

      const request = await getRequestForUpdate(client, req.params.id);

      if (!request || !canViewRequest(request, req.user)) {
        await client.query("ROLLBACK");
        return res.status(404).json({ message: "Request not found." });
      }

      const transition = checkTransition(action, request, req.user);

      if (!transition.ok) {
        await client.query("ROLLBACK");
        return res.status(transition.status).json({ message: transition.message });
      }

      if (action === "assign") {
        const assignmentError = await validateAssignment(client, request, req.body.agronomist_id);

        if (assignmentError) {
          await client.query("ROLLBACK");
          return res.status(400).json({ message: assignmentError });
        }
      }

      await applyStatusChanges(client, request.id, buildStatusChanges(action, req.body));

      await addStatusHistory(client, {
        requestId: request.id,
        fromStatus: request.status,
        toStatus: transition.to,
        changedBy: req.user.id,
        note: historyNote(action, req.body, request),
      });

      await logActivity(
        {
          userId: req.user.id,
          action: `REQUEST_${action.toUpperCase()}`,
          entityType: "request",
          entityId: request.id,
          details: {
            from: request.status,
            to: transition.to,
            ...(action === "assign" ? { agronomist_id: req.body.agronomist_id } : {}),
          },
          ip: req.ip,
        },
        client,
      );

      await client.query("COMMIT");

      const updated = await getRequestDetails(request.id);

      return res.status(200).json({
        message: successMessages[action],
        request: updated,
      });
    } catch (error) {
      await client.query("ROLLBACK").catch(() => {});
      return next(error);
    } finally {
      client.release();
    }
  };
};

export const getEligibleAgronomistsController = async (req, res, next) => {
  try {
    const request = await getRequestById(req.params.id);

    if (!request) {
      return res.status(404).json({ message: "Request not found." });
    }

    const details = await getRequestDetails(req.params.id);
    const agronomists = await getEligibleAgronomists(details.crop.category_id);

    return res.status(200).json({
      agronomists,
    });
  } catch (error) {
    return next(error);
  }
};
