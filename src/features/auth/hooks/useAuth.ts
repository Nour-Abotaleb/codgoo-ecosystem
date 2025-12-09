import { useAppDispatch, useAppSelector } from "@/store";
import {
  selectToken,
  selectUser,
  selectIsAuthenticated,
  selectAuthLoading,
  selectAuthError,
  loginUser,
  registerUser,
  logoutUser,
  refreshAuthToken,
  getCurrentUser,
} from "../store/auth-slice";
import type { LoginCredentials, RegisterData } from "../types/auth.types";

/**
 * Main auth hook
 * Provides authentication state and methods
 * Now uses Redux async thunks - all API calls will show in Redux DevTools!
 */
export const useAuth = () => {
  const dispatch = useAppDispatch();
  const token = useAppSelector(selectToken);
  const user = useAppSelector(selectUser);
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const loading = useAppSelector(selectAuthLoading);
  const error = useAppSelector(selectAuthError);

  const login = async (credentials: LoginCredentials) => {
    const result = await dispatch(loginUser(credentials));
    if (loginUser.fulfilled.match(result)) {
      return result.payload;
    }
    throw result.payload;
  };

  const register = async (userData: RegisterData) => {
    const result = await dispatch(registerUser(userData));
    if (registerUser.fulfilled.match(result)) {
      return result.payload;
    }
    throw result.payload;
  };

  const logout = async () => {
    await dispatch(logoutUser());
  };

  const refreshToken = async (refreshTokenValue: string) => {
    const result = await dispatch(refreshAuthToken(refreshTokenValue));
    if (refreshAuthToken.fulfilled.match(result)) {
      return result.payload;
    }
    throw result.payload;
  };

  const fetchCurrentUser = async () => {
    const result = await dispatch(getCurrentUser());
    if (getCurrentUser.fulfilled.match(result)) {
      return result.payload;
    }
    throw result.payload;
  };

  return {
    // State
    token,
    user,
    isAuthenticated,
    loading,
    error,
    // Methods
    login,
    register,
    logout,
    refreshToken,
    getCurrentUser: fetchCurrentUser,
  };
};

