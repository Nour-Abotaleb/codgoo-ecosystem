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
    
    // Handle nested response structure: response.data.data
    type ApiData = ApiAuthResponse['data'];
    let apiData: ApiData;
    
    if (response.data && typeof response.data === 'object') {
      // Check if it's the nested structure (status, message, data)
      if ('data' in response.data && typeof response.data.data === 'object') {
        apiData = response.data.data as unknown as ApiData;
        console.log("Using nested structure - apiData:", apiData);
      } 
      // Check if it's already the data object (direct structure)
      else if ('token' in response.data && 'client' in response.data) {
        apiData = response.data as unknown as ApiData;
        console.log("Using direct structure - apiData:", apiData);
      } else {
        console.error("Unexpected response structure:", response.data);
        throw new Error("Invalid API response structure - cannot find token or client data");
      }
    } else {
      throw new Error("Invalid API response - response.data is not an object");
    }
    
    // Validate required fields
    if (!apiData || !apiData.token) {
      console.error("Token missing in apiData:", apiData);
      throw new Error("Token not found in API response");
    }
    
    if (!apiData.client) {
      console.error("Client missing in apiData:", apiData);
      throw new Error("Client data not found in API response");
    }
    
    // Transform API response to AuthResponse format
    const user: User = {
      id: String(apiData.client.id),
      name: apiData.client.name,
      email: apiData.client.email,
      phone: apiData.client.phone || undefined,
    };

    const authResponse: AuthResponse = {
      user,
      token: apiData.token,
      refreshToken: "", // Backend doesn't provide refresh token
      expiresIn: 0, // Backend doesn't provide expiresIn
    };
    
    // Debug: Log the transformed response
    console.log("Transformed AuthResponse:", authResponse);
    console.log("Token value:", authResponse.token);
    console.log("Token length:", authResponse.token?.length);
    
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

