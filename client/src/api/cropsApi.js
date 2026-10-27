import api from "../api";

export const getCrops = async () => {
  const response = await api.get("/crops");
  return response.data;
};

export const getCropDetails = async (id) => {
  const response = await api.get(`/crops/${id}`);
  return response.data;
};
