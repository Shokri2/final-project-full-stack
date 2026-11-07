import api from "../api";
import { cleanParams } from "../utils/format";

export const getPublicFeedback = (params) =>
  api.get("/feedback/public", { params: cleanParams(params) });

export const getMyFeedback = (params) => api.get("/feedback/mine", { params: cleanParams(params) });

export const getManagedFeedback = (params) => api.get("/feedback", { params: cleanParams(params) });

export const getFeedback = (id) => api.get(`/feedback/${id}`);

export const createFeedback = (data) => api.post("/feedback", data);

export const updateFeedback = (id, data) => api.put(`/feedback/${id}`, data);

export const deleteFeedback = (id) => api.delete(`/feedback/${id}`);

export const approveFeedback = (id) => api.patch(`/feedback/${id}/approve`);

export const rejectFeedback = (id, reason) => api.patch(`/feedback/${id}/reject`, { reason });
