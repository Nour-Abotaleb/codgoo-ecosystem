import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import type { RootState } from "@/store/store";
import type { AuthState, User, LoginCredentials, RegisterData } from "../types/auth.types";
import { authApi } from "../api/authApi";

const initialState: AuthState = {
  token: null,
  user: null,
  loading: false,
  error: null,
};

// Async thunks - these will show in Redux DevTools with endpoint info
export const loginUser = createAsyncThunk(
  "auth/login",
  async (credentials: LoginCredentials, { rejectWithValue }) => {
    try {
      const response = await authApi.login(credentials);
      return response;
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : "An error occurred";
      const errorData = (error as { response?: { data?: unknown } })?.response?.data;
      return rejectWithValue(errorData || errorMessage);
    }
  }
);

export const registerUser = createAsyncThunk(
  "auth/register",
  async (userData: RegisterData, { rejectWithValue }) => {
    try {
      const response = await authApi.register(userData);
      return response;
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : "An error occurred";
      const errorData = (error as { response?: { data?: unknown } })?.response?.data;
      return rejectWithValue(errorData || errorMessage);
    }
  }
);

export const logoutUser = createAsyncThunk(
  "auth/logout",
  async (_, { rejectWithValue }) => {
    try {
      await authApi.logout();
      return null;
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : "An error occurred";
      const errorData = (error as { response?: { data?: unknown } })?.response?.data;
      return rejectWithValue(errorData || errorMessage);
    }
  }
);

export const refreshAuthToken = createAsyncThunk(
  "auth/refreshToken",
  async (refreshToken: string, { rejectWithValue }) => {
    try {
      const response = await authApi.refreshToken(refreshToken);
      return response;
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : "An error occurred";
      const errorData = (error as { response?: { data?: unknown } })?.response?.data;
      return rejectWithValue(errorData || errorMessage);
    }
  }
);

export const getCurrentUser = createAsyncThunk(
  "auth/getCurrentUser",
  async (_, { rejectWithValue }) => {
    try {
      const user = await authApi.getCurrentUser();
      return user;
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : "An error occurred";
      const errorData = (error as { response?: { data?: unknown } })?.response?.data;
      return rejectWithValue(errorData || errorMessage);
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials(
      state,
      action: {
        payload: {
          readonly token: string;
          readonly user: User;
        };
      },
    ) {
      state.token = action.payload.token;
      state.user = action.payload.user;
      state.error = null;
    },
    clearCredentials(state) {
      state.token = null;
      state.user = null;
      state.error = null;
      state.loading = false;
    },
    setToken(state, action: { payload: string | null }) {
      state.token = action.payload;
    },
  },
  extraReducers: (builder) => {
    // Login
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.token = action.payload.token;
        state.user = action.payload.user;
        state.error = null;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string | null;
      });

    // Register
    builder
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        state.token = action.payload.token;
        state.user = action.payload.user;
        state.error = null;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string | null;
      });

    // Logout
    builder
      .addCase(logoutUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.token = null;
        state.user = null;
        state.loading = false;
        state.error = null;
      })
      .addCase(logoutUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string | null;
      });

    // Refresh Token
    builder
      .addCase(refreshAuthToken.pending, (state) => {
        state.loading = true;
      })
      .addCase(refreshAuthToken.fulfilled, (state, action) => {
        state.loading = false;
        state.token = action.payload.token;
        state.user = action.payload.user;
        state.error = null;
      })
      .addCase(refreshAuthToken.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string | null;
      });

    // Get Current User
    builder
      .addCase(getCurrentUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(getCurrentUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.error = null;
      })
      .addCase(getCurrentUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string | null;
      });
  },
});

export const { setCredentials, clearCredentials, setToken } =
  authSlice.actions;
export const authReducer = authSlice.reducer;

// Selectors
export const selectToken = (state: RootState) => state.auth.token;
export const selectUser = (state: RootState) => state.auth.user;
export const selectIsAuthenticated = (state: RootState) =>
  !!state.auth.token;
export const selectAuthLoading = (state: RootState) => state.auth.loading;
export const selectAuthError = (state: RootState) => state.auth.error;

