# Feature-Based Architecture Guide

## ✅ Recommended Structure: Feature-First Organization

**Yes, it's better to organize hooks, store slices, and services by feature** for maintainability, scalability, and team collaboration.

## 📁 Ideal Feature Structure

Each feature should be self-contained with its own:

```
features/
└── auth/
    ├── api/              # Feature-specific API calls
    │   ├── authApi.ts
    │   └── index.ts
    ├── hooks/             # Feature-specific hooks
    │   ├── useAuth.ts
    │   ├── useLogin.ts
    │   └── index.ts
    ├── store/             # Feature-specific Redux slice
    │   ├── auth-slice.ts
    │   └── index.ts
    ├── ui/                # UI components
    │   ├── LoginForm.tsx
    │   └── RegisterForm.tsx
    ├── types/             # Feature-specific types
    │   └── auth.types.ts
    ├── utils/             # Feature-specific utilities
    │   └── auth.utils.ts
    └── index.ts           # Public API exports
```

## 🎯 Benefits

### 1. **Better Organization**
- All related code lives together
- Easy to find and understand feature logic
- Clear boundaries between features

### 2. **Scalability**
- Features can grow independently
- Easy to add/remove features
- Less cognitive load

### 3. **Team Collaboration**
- Multiple developers can work on different features
- Fewer merge conflicts
- Clear ownership

### 4. **Maintainability**
- Changes are localized to one feature
- Easier to test features in isolation
- Better code reusability

## 📋 What Goes Where?

### ✅ Feature-Specific (Inside Feature Folder)
- **Store slices** - Feature state management
- **Hooks** - Feature-specific logic hooks
- **Services/API** - Feature API calls
- **Types** - Feature-specific TypeScript types
- **Utils** - Feature-specific utilities
- **Components** - Feature UI components

### 🌐 Shared/Global (Outside Features)
- **Shared components** - Used across multiple features
- **Global store slices** - App-wide state (theme, auth)
- **Core services** - Base API client, utilities
- **Shared hooks** - Generic hooks (useAppDispatch, useAppSelector)
- **Config** - App configuration

## 🔄 Migration Strategy

### Current Structure
```
store/
  ├── auth/
  │   └── auth-slice.ts
  └── theme/
      └── theme-slice.ts
```

### Recommended Structure
```
features/
  └── auth/
      ├── store/
      │   └── auth-slice.ts
      └── ...

store/
  └── theme/          # Global app state
      └── theme-slice.ts
```

## 💡 Example: Auth Feature

### `features/auth/store/auth-slice.ts`
```typescript
import { createSlice } from "@reduxjs/toolkit";
import type { RootState } from "@/store/store";

type AuthState = {
  token: string | null;
  user: User | null;
};

const initialState: AuthState = {
  token: null,
  user: null,
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials(state, action) {
      state.token = action.payload.token;
      state.user = action.payload.user;
    },
    clearCredentials(state) {
      state.token = null;
      state.user = null;
    },
  },
});

export const { setCredentials, clearCredentials } = authSlice.actions;
export const authReducer = authSlice.reducer;
export const selectToken = (state: RootState) => state.auth.token;
```

### `features/auth/api/authApi.ts`
```typescript
import api from "@/config/api";

export const authApi = {
  login: async (email: string, password: string) => {
    const response = await api.post("/auth/login", {
      email,
      password,
    });
    return response.data;
  },
  
  register: async (userData: RegisterData) => {
    const response = await api.post("/auth/register", userData);
    return response.data;
  },
  
  logout: async () => {
    await api.post("/auth/logout");
  },
};
```

### `features/auth/hooks/useAuth.ts`
```typescript
import { useAppDispatch, useAppSelector } from "@/store";
import { selectToken, selectUser, clearCredentials } from "../store/auth-slice";
import { authApi } from "../api/authApi";

export const useAuth = () => {
  const dispatch = useAppDispatch();
  const token = useAppSelector(selectToken);
  const user = useAppSelector(selectUser);
  
  const login = async (email: string, password: string) => {
    const data = await authApi.login(email, password);
    dispatch(setCredentials(data));
  };
  
  const logout = async () => {
    await authApi.logout();
    dispatch(clearCredentials());
  };
  
  return {
    token,
    user,
    isAuthenticated: !!token,
    login,
    logout,
  };
};
```

### `features/auth/index.ts`
```typescript
// Public API - only export what other features need
export { LoginForm, RegisterForm } from "./ui";
export { useAuth } from "./hooks";
export { selectToken, selectUser } from "./store/auth-slice";
export type { AuthState } from "./store/auth-slice";
```

## 🏗️ Store Organization

### Central Store (`src/store/store.ts`)
```typescript
import { configureStore } from "@reduxjs/toolkit";
import { authReducer } from "@/features/auth/store/auth-slice";
import { dashboardReducer } from "@/features/dashboard/store/dashboard-slice";
import { themeReducer } from "./theme/theme-slice"; // Global

export const store = configureStore({
  reducer: {
    auth: authReducer,
    dashboard: dashboardReducer,
    theme: themeReducer, // Global app state
  },
});
```

## 🎨 When to Keep Things Centralized

### Keep in `store/` (Global)
- **Theme** - App-wide theme state
- **App config** - Global app settings
- **Navigation** - Global navigation state

### Keep in `shared/`
- **Components** - Used by 3+ features
- **Hooks** - Generic hooks (useAppDispatch, useAppSelector)
- **Utils** - Cross-cutting utilities
- **Types** - Shared TypeScript types

### Keep in `services/`
- **API client** - Base axios instance
- **Core services** - Authentication service, etc.

## 📊 Comparison

| Aspect | Feature-Based | Centralized |
|--------|---------------|-------------|
| **Scalability** | ✅ Excellent | ❌ Poor (grows messy) |
| **Maintainability** | ✅ Easy to find | ❌ Hard to navigate |
| **Team Work** | ✅ Few conflicts | ❌ Many conflicts |
| **Testing** | ✅ Isolated | ❌ Coupled |
| **Onboarding** | ✅ Clear structure | ❌ Hard to understand |

## 🚀 Best Practices

1. **One feature = One folder** - Keep everything related together
2. **Public API via index.ts** - Only export what's needed
3. **Feature boundaries** - Features shouldn't directly import from other features
4. **Shared code** - Move to `shared/` when used by 3+ features
5. **Store slices** - One slice per feature domain
6. **Hooks** - Feature-specific hooks in feature folder
7. **Services** - Feature API calls in feature folder

## 📝 Summary

**Yes, organize by feature!** It makes your codebase:
- More maintainable
- Easier to scale
- Better for teams
- Simpler to test
- Clearer to understand

Keep only truly global concerns (theme, app config) in the root `store/` folder.

