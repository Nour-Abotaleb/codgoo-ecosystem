import api from "@/config/api";
import type {
  LoginCredentials,
  RegisterData,
  AuthResponse,
  User,
} from "../types/auth.types";

/**
 * Auth API service
 * Handles all authentication-related API calls
 */
export const authApi = {
  /**
   * Login user with email and password
   */
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>("/client/login", credentials);
    return response.data;
  },

  /**
   * Register a new user
   */
  register: async (userData: RegisterData): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>("/client/register", userData);
    return response.data;
  },

  /**
   * Logout current user
   */
  logout: async (): Promise<void> => {
    await api.post("/client/logout");
  },

  /**
   * Refresh authentication token
   */
  refreshToken: async (refreshToken: string): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>("/auth/refresh", {
      refreshToken,
    });
    return response.data;
  },

  /**
   * Get current authenticated user
   */
  getCurrentUser: async (): Promise<User> => {
    const response = await api.get<User>("/auth/me");
    return response.data;
  },

  /**
   * Social authentication (Google, Facebook, Apple)
   */
  socialAuth: async (
    provider: "google" | "facebook" | "apple",
    token: string,
  ): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>(`/auth/social/${provider}`, {
      token,
    });
    return response.data;
  },
};

