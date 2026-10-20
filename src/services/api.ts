import axios from "axios";

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? "http://localhost:3000",
  timeout: 8000,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error),
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const url = String(error.config?.url ?? "");
    const esLogin = url.includes("/auth/login");

    if (
      error.response?.status === 401 &&
      !esLogin &&
      window.location.pathname !== "/login"
    ) {
      localStorage.removeItem("token");
      window.location.assign("/login");
    }

    return Promise.reject(error);
  },
);
