import api from "../api";
import { cleanParams } from "../utils/format";

export const sendContactMessage = (data) => api.post("/contact", data);

export const getContactMessages = (params) => api.get("/contact", { params: cleanParams(params) });

export const updateContactStatus = (id, status) => api.patch(`/contact/${id}/status`, { status });

export const deleteContactMessage = (id) => api.delete(`/contact/${id}`);
