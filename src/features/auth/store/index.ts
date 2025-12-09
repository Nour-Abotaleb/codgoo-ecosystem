export {
  setCredentials,
  clearCredentials,
  setToken,
  selectToken,
  selectUser,
  selectIsAuthenticated,
  selectAuthLoading,
  selectAuthError,
  authReducer,
  // Async thunks - these show API calls in Redux DevTools!
  loginUser,
  registerUser,
  logoutUser,
  refreshAuthToken,
  getCurrentUser,
} from "./auth-slice";
export type { AuthState } from "../types/auth.types";

