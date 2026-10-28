import axios from "axios";
import { useAuthStore } from "../stores/authStore";

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? "http://localhost:3000",
  timeout: 8000,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use(
  (config) => {
    const token = useAuthStore.getState().token;

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    } else {
      delete config.headers.Authorization;
    }

    return config;
  },
  (error: unknown) => Promise.reject(error),
);

api.interceptors.response.use(
  (response) => response,
  (error: unknown) => {
    if (!axios.isAxiosError(error)) {
      return Promise.reject(error);
    }

    const url = String(error.config?.url ?? "");
    const esLogin = url.includes("/auth/login");

    if (error.response?.status === 401 && !esLogin) {
      useAuthStore.getState().logout();

      // Remove the legacy token from the previous implementation.
      localStorage.removeItem("token");

      if (window.location.pathname !== "/login") {
        window.location.replace("/login");
      }
    }

    return Promise.reject(error);
  },
);
