import api from "@/config/api";
import type {
  LoginCredentials,
  RegisterData,
  AuthResponse,
  User,
} from "../types/auth.types";

/**
 * Actual API response structure from backend
 */
type ApiAuthResponse = {
  readonly status: boolean;
  readonly message: string;
  readonly data: {
    readonly client: {
      readonly id: number;
      readonly username: string;
      readonly name: string;
      readonly email: string;
      readonly phone: string | null;
      readonly photo: string | null;
      readonly company_name: string | null;
      readonly website: string | null;
      readonly address: string | null;
      readonly city: string | null;
      readonly country: string | null;
      readonly created_at: string;
      readonly updated_at: string;
      readonly deleted_at: string | null;
    };
    readonly token: string;
    readonly token_type: string;
  };
};

/**
 * Auth API service
 * Handles all authentication-related API calls
 */
export const authApi = {
  /**
   * Login user with email and password
   */
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    const response = await api.post<ApiAuthResponse>("/client/login", credentials);
    
    // Debug: Log the full response structure
    console.log("Full axios response:", response);
    console.log("Response data:", response.data);
    console.log("Response data type:", typeof response.data);
    
    // Handle the actual API response structure which includes subscriptions at root level
    const apiResponse = response.data as any;
    
    // Validate required fields
    if (!apiResponse || !apiResponse.token) {
      console.error("Token missing in response:", apiResponse);
      throw new Error("Token not found in API response");
    }
    
    if (!apiResponse.client) {
      console.error("Client missing in response:", apiResponse);
      throw new Error("Client data not found in API response");
    }
    
    // Transform API response to AuthResponse format
    const user: User = {
      id: String(apiResponse.client.id),
      name: apiResponse.client.name,
      email: apiResponse.client.email,
      phone: apiResponse.client.phone || undefined,
    };

    const authResponse: AuthResponse = {
      user,
      token: apiResponse.token,
      refreshToken: "", // Backend doesn't provide refresh token
      expiresIn: apiResponse.expires_in || 0,
      subscriptions: apiResponse.subscriptions || [],
    };
    
    // Debug: Log the transformed response
    console.log("Transformed AuthResponse:", authResponse);
    console.log("Token value:", authResponse.token);
    console.log("Subscriptions:", authResponse.subscriptions);
    
    return authResponse;
  },

  /**
   * Register a new user
   */
  register: async (userData: RegisterData): Promise<AuthResponse> => {
    const response = await api.post<ApiAuthResponse>("/client/register", userData);
    const apiData = response.data.data;
    
    // Transform API response to AuthResponse format
    const user: User = {
      id: String(apiData.client.id),
      name: apiData.client.name,
      email: apiData.client.email,
      phone: apiData.client.phone || undefined,
    };

    return {
      user,
      token: apiData.token,
      refreshToken: "", // Backend doesn't provide refresh token
      expiresIn: 0, // Backend doesn't provide expiresIn
    };
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

