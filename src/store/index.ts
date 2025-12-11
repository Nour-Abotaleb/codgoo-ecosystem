export { store } from "./store";
export type { AppDispatch, RootState } from "./store";
export { useAppDispatch, useAppSelector } from "./hooks";
export { ThemeProvider } from "./theme/ThemeProvider";
export { useTheme } from "./theme/use-theme";

// Re-export auth feature for convenience (can also import directly from @/features/auth)
export {
  setCredentials,
  clearCredentials,
  setToken,
  selectToken,
  selectUser,
  selectIsAuthenticated,
} from "@/features/auth/store/auth-slice";
export { useAuth } from "@/features/auth/hooks";
export { authApi } from "@/features/auth/api";
export type {
  AuthState,
  User,
  LoginCredentials,
  RegisterData,
  AuthResponse,
} from "@/features/auth/types/auth.types";

