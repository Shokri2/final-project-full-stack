import { pool } from "../config/db.js";
import { getRequestForUpdate, getRequestById } from "../model/request.Model.js";
import { getRequestDetails } from "../model/requestDetails.Model.js";
import {
  addAttachments,
  countAttachments,
  getAttachment,
  deleteAttachment,
} from "../model/requestAttachment.Model.js";
import { MAX_IMAGES_PER_REQUEST } from "../middleware/upload.Middleware.js";
import { logActivity } from "../utils/activityLog.js";
import { removeFile, toStoragePath } from "../utils/fileStorage.js";
import { isOwner, UPLOADABLE_STATUSES } from "../utils/requestWorkflow.js";
import { toStoredFiles } from "./request.Controller.js";

export const uploadAttachmentsController = async (req, res, next) => {
  if (!req.files || req.files.length === 0) {
    return res.status(400).json({
      message: "Please choose at least one image to upload.",
    });
  }

  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    const request = await getRequestForUpdate(client, req.params.id);

    if (!request || !isOwner(request, req.user)) {
      await client.query("ROLLBACK");
      return res.status(404).json({ message: "Request not found." });
    }

    if (!UPLOADABLE_STATUSES.includes(request.status)) {
      await client.query("ROLLBACK");
      return res.status(409).json({
        message: "Images can only be added before the agronomist starts working on the request.",
      });
    }

    const existing = await countAttachments(client, request.id);

    if (existing + req.files.length > MAX_IMAGES_PER_REQUEST) {
      await client.query("ROLLBACK");
      return res.status(400).json({
        message: `A request can have at most ${MAX_IMAGES_PER_REQUEST} images. It already has ${existing}.`,
      });
    }

    await addAttachments(client, {
      requestId: request.id,
      userId: req.user.id,
      files: toStoredFiles(req.files),
    });

    await logActivity(
      {
        userId: req.user.id,
        action: "REQUEST_ATTACHMENTS_ADDED",
        entityType: "request",
        entityId: request.id,
        details: { count: req.files.length },
        ip: req.ip,
      },
      client,
    );

    await client.query("COMMIT");

    const updated = await getRequestDetails(request.id);

    return res.status(201).json({
      message: "Images uploaded successfully.",
      request: updated,
    });
  } catch (error) {
    await client.query("ROLLBACK").catch(() => {});
    return next(error);
  } finally {
    client.release();
  }
};

export const deleteAttachmentController = async (req, res, next) => {
  try {
    const { id, attachmentId } = req.params;
    const request = await getRequestById(id);

    if (!request || !isOwner(request, req.user)) {
      return res.status(404).json({ message: "Request not found." });
    }

    if (!UPLOADABLE_STATUSES.includes(request.status)) {
      return res.status(409).json({
        message: "Images can no longer be removed from this request.",
      });
    }

    const attachment = await getAttachment(id, attachmentId);

    if (!attachment) {
      return res.status(404).json({ message: "Image not found." });
    }

    await deleteAttachment(attachment.id);
    await removeFile(toStoragePath(attachment.file_url));

    await logActivity({
      userId: req.user.id,
      action: "REQUEST_ATTACHMENT_DELETED",
      entityType: "request",
      entityId: Number(id),
      ip: req.ip,
    });

    return res.status(200).json({
      message: "Image removed successfully.",
    });
  } catch (error) {
    return next(error);
  }
};
