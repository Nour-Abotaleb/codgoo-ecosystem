// UI Components
export { AuthTemplate } from "./ui/AuthTemplate";
export { LoginForm } from "./ui/LoginForm";
export { RegisterForm } from "./ui/RegisterForm";

// Hooks
export { useAuth } from "./hooks";

// Store (Redux)
export {
  setCredentials,
  clearCredentials,
  setToken,
  selectToken,
  selectUser,
  selectIsAuthenticated,
  selectAuthLoading,
  selectAuthError,
  // Async thunks - track API calls in Redux DevTools
  loginUser,
  registerUser,
  logoutUser,
  refreshAuthToken,
  getCurrentUser,
} from "./store";

// API
export { authApi } from "./api";

// Types
export type {
  AuthState,
  User,
  LoginCredentials,
  RegisterData,
  AuthResponse,
} from "./types/auth.types";


