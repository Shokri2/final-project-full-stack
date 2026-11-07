import api from "../api";
import { cleanParams } from "../utils/format";

export const getActivities = (params) => api.get("/activities", { params: cleanParams(params) });

export const getActivityActions = () => api.get("/activities/actions");
