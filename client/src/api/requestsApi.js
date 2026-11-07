import api from "../api";
import { cleanParams } from "../utils/format";

export const getRequests = (params) => api.get("/requests", { params: cleanParams(params) });

export const getRequest = (id) => api.get(`/requests/${id}`);

export const createRequest = (formData) => api.post("/requests", formData);

export const updateRequest = (id, data) => api.put(`/requests/${id}`, data);

export const getEligibleAgronomists = (id) => api.get(`/requests/${id}/eligible-agronomists`);

export const changeRequestStatus = (id, action, data = {}) =>
  api.patch(`/requests/${id}/${action}`, data);

export const uploadRequestImages = (id, formData) =>
  api.post(`/requests/${id}/attachments`, formData);

export const deleteRequestImage = (id, attachmentId) =>
  api.delete(`/requests/${id}/attachments/${attachmentId}`);
