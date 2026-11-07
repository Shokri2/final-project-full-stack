import api from "../api";
import { cleanParams } from "../utils/format";

export const getUsers = (params) => api.get("/users/Users", { params: cleanParams(params) });

export const getUser = (id) => api.get(`/users/getUser/${id}`);

export const createUser = (data) => api.post("/users/createUser", data);

export const updateUser = (id, data) => api.put(`/users/updateUser/${id}`, data);

export const changePassword = (data) => api.put("/users/changePassword", data);

export const updateUserStatus = (id, isActive) =>
  api.patch(`/users/updateStatus/${id}/status`, { is_active: isActive });

export const updateUserRole = (id, data) => api.patch(`/users/updateRole/${id}/role`, data);

export const updateSpecialties = (id, specialties) =>
  api.put(`/users/updateSpecialties/${id}`, { specialties });

export const deleteUser = (id) => api.delete(`/users/deleteUser/${id}`);
