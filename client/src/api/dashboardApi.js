import api from "../api";

export const getDashboard = (role) => api.get(`/dashboard/${role}`);
