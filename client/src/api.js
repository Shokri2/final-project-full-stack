import axios from "axios";

export const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000/api";

export const SERVER_URL = API_URL.replace(/\/api\/?$/, "");

export const assetUrl = (path) => {
  if (!path) {
    return "";
  }

  return /^https?:\/\//.test(path) || !path.startsWith("/uploads") ? path : `${SERVER_URL}${path}`;
};

export const SESSION_EXPIRED_EVENT = "auth:session-expired";

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
    "X-Requested-With": "XMLHttpRequest",
  },
});

const refreshApi = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
    "X-Requested-With": "XMLHttpRequest",
  },
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("accessToken");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    if (config.data instanceof FormData) {
      delete config.headers["Content-Type"];
    }

    return config;
  },
  (error) => Promise.reject(error),
);

let refreshPromise = null;

export const refreshAccessToken = () => {
  if (!refreshPromise) {
    refreshPromise = refreshApi
      .post("/auth/refresh")
      .then((response) => {
        const newAccessToken = response.data.accessTokens;

        if (!newAccessToken) {
          throw new Error("No access token returned from refresh.");
        }

        localStorage.setItem("accessToken", newAccessToken);

        return newAccessToken;
      })
      .finally(() => {
        refreshPromise = null;
      });
  }

  return refreshPromise;
};

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (!originalRequest || error.response?.status !== 401) {
      return Promise.reject(error);
    }

    if (originalRequest._retry) {
      return Promise.reject(error);
    }

    const requestUrl = originalRequest.url || "";

    if (
      requestUrl.includes("/auth/login") ||
      requestUrl.includes("/auth/register") ||
      requestUrl.includes("/auth/refresh")
    ) {
      return Promise.reject(error);
    }

    originalRequest._retry = true;

    try {
      const newAccessToken = await refreshAccessToken();

      originalRequest.headers = originalRequest.headers || {};
      originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

      return api(originalRequest);
    } catch (refreshError) {
      const hadSession = Boolean(localStorage.getItem("accessToken"));

      localStorage.removeItem("accessToken");
      localStorage.removeItem("currentUser");

      if (hadSession) {
        window.dispatchEvent(new Event(SESSION_EXPIRED_EVENT));
      }

      return Promise.reject(refreshError);
    }
  },
);

export default api;
