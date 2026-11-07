import {
  createContactMessage,
  getContactMessages,
  updateContactStatus,
  deleteContactMessage,
} from "../model/contact.Model.js";
import { logActivity } from "../utils/activityLog.js";
import { buildPagination } from "../utils/pagination.js";

export const createContactController = async (req, res, next) => {
  try {
    const contact = await createContactMessage(req.body);

    return res.status(201).json({
      message: "Thank you for contacting us. We will get back to you soon.",
      contact,
    });
  } catch (error) {
    return next(error);
  }
};

export const getContactMessagesController = async (req, res, next) => {
  try {
    const { messages, total } = await getContactMessages(req.query);

    return res.status(200).json({
      messages,
      pagination: buildPagination(req.query, total),
    });
  } catch (error) {
    return next(error);
  }
};

export const updateContactStatusController = async (req, res, next) => {
  try {
    const contact = await updateContactStatus(req.params.id, req.body.status);

    if (!contact) {
      return res.status(404).json({ message: "Message not found." });
    }

    await logActivity({
      userId: req.user.id,
      action: "CONTACT_MESSAGE_UPDATED",
      entityType: "contact",
      entityId: contact.id,
      details: { status: contact.status },
      ip: req.ip,
    });

    return res.status(200).json({
      message: "Message updated successfully.",
      contact,
    });
  } catch (error) {
    return next(error);
  }
};

export const deleteContactController = async (req, res, next) => {
  try {
    const deleted = await deleteContactMessage(req.params.id);

    if (!deleted) {
      return res.status(404).json({ message: "Message not found." });
    }

    await logActivity({
      userId: req.user.id,
      action: "CONTACT_MESSAGE_DELETED",
      entityType: "contact",
      entityId: Number(req.params.id),
      ip: req.ip,
    });

    return res.status(200).json({
      message: "Message deleted successfully.",
    });
  } catch (error) {
    return next(error);
  }
};
