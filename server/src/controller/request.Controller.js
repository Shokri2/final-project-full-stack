import { pool } from "../config/db.js";
import {
  createRequest,
  getRequests,
  getRequestById,
  updateRequestFields,
} from "../model/request.Model.js";
import { getRequestDetails } from "../model/requestDetails.Model.js";
import { addStatusHistory } from "../model/requestStatus.Model.js";
import { addAttachments } from "../model/requestAttachment.Model.js";
import { getCropById } from "../model/crops.Model.js";
import { logActivity } from "../utils/activityLog.js";
import { buildPagination } from "../utils/pagination.js";
import { toPublicUrl } from "../utils/fileStorage.js";
import {
  canViewRequest,
  isOwner,
  EDITABLE_STATUSES,
} from "../utils/requestWorkflow.js";

export const toStoredFiles = (files = []) => {
  return files.map((file) => ({
    ...file,
    url: toPublicUrl("requests", file.filename),
  }));
};

export const createRequestController = async (req, res, next) => {
  const client = await pool.connect();

  try {
    const crop = await getCropById(req.body.crop_id);

    if (!crop) {
      return res.status(400).json({
        message: "The selected crop does not exist or is not available.",
      });
    }

    await client.query("BEGIN");

    const created = await createRequest(client, {
      ...req.body,
      user_id: req.user.id,
    });

    await addStatusHistory(client, {
      requestId: created.id,
      fromStatus: null,
      toStatus: "pending",
      changedBy: req.user.id,
      note: "Request submitted.",
    });

    await addAttachments(client, {
      requestId: created.id,
      userId: req.user.id,
      files: toStoredFiles(req.files),
    });

    await logActivity(
      {
        userId: req.user.id,
        action: "REQUEST_CREATED",
        entityType: "request",
        entityId: created.id,
        details: { title: req.body.title, crop: crop.name },
        ip: req.ip,
      },
      client,
    );

    await client.query("COMMIT");

    const request = await getRequestDetails(created.id);

    return res.status(201).json({
      message: "Your consultation request was submitted successfully.",
      request,
    });
  } catch (error) {
    await client.query("ROLLBACK").catch(() => {});
    return next(error);
  } finally {
    client.release();
  }
};

export const getRequestsController = async (req, res, next) => {
  try {
    const { requests, total } = await getRequests(req.query, req.user);

    return res.status(200).json({
      requests,
      pagination: buildPagination(req.query, total),
    });
  } catch (error) {
    return next(error);
  }
};

export const getRequestDetailsController = async (req, res, next) => {
  try {
    const request = await getRequestDetails(req.params.id);

    if (!request || !canViewRequest(request, req.user)) {
      return res.status(404).json({
        message: "Request not found.",
      });
    }

    return res.status(200).json({
      request,
    });
  } catch (error) {
    return next(error);
  }
};

export const updateRequestController = async (req, res, next) => {
  try {
    const { id } = req.params;
    const existing = await getRequestById(id);

    if (!existing || !isOwner(existing, req.user)) {
      return res.status(404).json({
        message: "Request not found.",
      });
    }

    if (!EDITABLE_STATUSES.includes(existing.status)) {
      return res.status(409).json({
        message: "Only pending requests can be edited.",
      });
    }

    if (req.body.crop_id && !(await getCropById(req.body.crop_id))) {
      return res.status(400).json({
        message: "The selected crop does not exist or is not available.",
      });
    }

    const updated = await updateRequestFields(id, req.body);

    if (!updated) {
      return res.status(409).json({
        message: "Only pending requests can be edited.",
      });
    }

    await logActivity({
      userId: req.user.id,
      action: "REQUEST_UPDATED",
      entityType: "request",
      entityId: Number(id),
      details: { fields: Object.keys(req.body) },
      ip: req.ip,
    });

    const request = await getRequestDetails(id);

    return res.status(200).json({
      message: "Request updated successfully.",
      request,
    });
  } catch (error) {
    return next(error);
  }
};
