import api from "../api";
import { cleanParams } from "../utils/format";

export const getCrops = async (params = {}) => {
  const response = await api.get("/crops", { params: cleanParams(params) });
  return response.data;
};

export const getCropDetails = async (id) => {
  const response = await api.get(`/crops/${id}`);
  return response.data;
};

export const getManagedCrops = (params) => api.get("/crops/manage", { params: cleanParams(params) });

export const getManagedCrop = (id) => api.get(`/crops/manage/${id}`);

export const createCrop = (data) => api.post("/crops", data);

export const updateCrop = (id, data) => api.put(`/crops/${id}`, data);

export const updateCropStatus = (id, isActive) =>
  api.patch(`/crops/${id}/status`, { is_active: isActive });

export const deleteCrop = (id) => api.delete(`/crops/${id}`);
