import axios, {
  type AxiosResponse,
  type AxiosError,
  type InternalAxiosRequestConfig,
} from "axios";

import { store } from "@/store/store";
import { clearCredentials, selectToken } from "@/features/auth/store/auth-slice";

// Vite environment variable: must start with VITE_
const api = axios.create({
  baseURL:
    import.meta.env.VITE_API_URL || "https://back.codgoo.com/codgoo/public/api",
  headers: {
    "Content-Type": "application/json",
  },
});

// Add token from Redux state if exists
api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const state = store.getState();
  const token = selectToken(state);
  if (config.headers) {
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    } else {
      // Remove Authorization header if no token
      delete config.headers.Authorization;
    }
    // Add Accept-Language header with current language from localStorage
    const language = localStorage.getItem("locale") || "en";
    config.headers["Accept-Language"] = language;
  }
  return config;
});

// Response interceptor to handle authentication errors
api.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error: AxiosError) => {
    // Only handle 401 errors for specific endpoints that should redirect to login
    // Exclude attendance endpoints from automatic redirect
    const shouldRedirectToLogin =
      error.config?.url?.includes("/auth/") ||
      error.config?.url?.includes("/client/") ||
      error.config?.url?.includes("/profile") ||
      error.config?.url?.includes("/teachers/profile");

    const isAttendanceEndpoint =
      error.config?.url?.includes("/teachers/attend/") ||
      error.config?.url?.includes("/teachers/daily-attendance") ||
      error.config?.url?.includes("/teachers/daily-departure");

    if (
      error.response?.status === 401 &&
      shouldRedirectToLogin &&
      !isAttendanceEndpoint
    ) {
      // Clear token from Redux state and redirect to login
      store.dispatch(clearCredentials());
      delete api.defaults.headers.common["Authorization"];
      window.location.href = "/login";
    }

    // For other 401 errors (like attendance), just reject the promise
    return Promise.reject(error);
  },
);

export default api;
