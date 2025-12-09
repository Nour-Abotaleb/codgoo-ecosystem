# Auth Feature Files Explained

This document explains what each file in the `src/features/auth/` directory does and why it exists.

## 📁 Directory Structure

```
src/features/auth/
├── api/                    # API service layer
│   ├── authApi.ts         # All auth API calls
│   └── index.ts           # Re-exports for clean imports
├── hooks/                  # React hooks
│   ├── useAuth.ts         # Main authentication hook
│   └── index.ts           # Re-exports for clean imports
├── store/                  # Redux state management
│   ├── auth-slice.ts      # Redux slice (state + actions)
│   └── index.ts           # Re-exports for clean imports
├── types/                  # TypeScript type definitions
│   └── auth.types.ts      # All auth-related types
├── ui/                     # UI components (existing)
│   ├── LoginForm.tsx
│   ├── RegisterForm.tsx
│   └── components/
└── index.ts                # Public API - main entry point
```

---

## 📄 File Descriptions

### 🔹 `types/auth.types.ts`
**Purpose:** Defines all TypeScript types for the auth feature

**Contains:**
- `User` - User object structure
- `AuthState` - Redux state shape
- `LoginCredentials` - Login form data
- `RegisterData` - Registration form data
- `AuthResponse` - API response structure

**Why:** Centralizes all type definitions in one place for consistency and easy maintenance.

**Usage:**
```typescript
import type { User, LoginCredentials } from '@/features/auth/types/auth.types';
```

---

### 🔹 `store/auth-slice.ts`
**Purpose:** Redux slice that manages authentication state

**Contains:**
- **State:** `token` and `user` 
- **Actions:** `setCredentials`, `clearCredentials`, `setToken`
- **Selectors:** `selectToken`, `selectUser`, `selectIsAuthenticated`
- **Reducer:** `authReducer` (used in main store)

**Why:** Manages global auth state (who's logged in, their token, etc.)

**Usage:**
```typescript
import { selectToken, setCredentials } from '@/features/auth/store';
```

---

### 🔹 `api/authApi.ts`
**Purpose:** Service layer for all authentication API calls

**Contains:**
- `login()` - Login with email/password
- `register()` - Register new user
- `logout()` - Logout current user
- `refreshToken()` - Refresh expired token
- `getCurrentUser()` - Get logged-in user info
- `socialAuth()` - Social login (Google, Facebook, Apple)

**Why:** Separates API logic from components. All HTTP calls in one place.

**Usage:**
```typescript
import { authApi } from '@/features/auth/api';
const data = await authApi.login({ email, password });
```

---

### 🔹 `hooks/useAuth.ts`
**Purpose:** React hook that combines Redux state + API calls

**Provides:**
- **State:** `token`, `user`, `isAuthenticated`
- **Methods:** `login()`, `register()`, `logout()`, `refreshToken()`, `getCurrentUser()`

**Why:** Simplifies component code. Components just call `useAuth()` instead of managing Redux + API separately.

**Usage:**
```typescript
import { useAuth } from '@/features/auth';
const { login, user, isAuthenticated } = useAuth();
```

---

### 🔹 `api/index.ts` & `hooks/index.ts` & `store/index.ts`
**Purpose:** Re-export files for cleaner imports

**Why:** Instead of:
```typescript
import { authApi } from '@/features/auth/api/authApi';
```

You can do:
```typescript
import { authApi } from '@/features/auth/api';
```

---

### 🔹 `index.ts` (main entry point)
**Purpose:** Public API - exports everything other features/components need

**Exports:**
- UI components (LoginForm, RegisterForm, etc.)
- Hooks (useAuth)
- Store actions/selectors
- API service (authApi)
- Types

**Why:** Single import point. Other parts of the app import from `@/features/auth` instead of knowing internal file structure.

**Usage:**
```typescript
// Everything from one import!
import { 
  useAuth, 
  authApi, 
  selectToken,
  LoginForm 
} from '@/features/auth';
```

---

## 🔄 How They Work Together

```
Component (LoginForm.tsx)
    ↓ uses
useAuth() hook
    ↓ uses
authApi.login() → API call
    ↓ dispatches
setCredentials() action
    ↓ updates
auth-slice.ts (Redux state)
    ↓ provides
token, user to components
```

**Example Flow:**
1. User fills login form
2. Component calls `useAuth().login()`
3. Hook calls `authApi.login()` (makes HTTP request)
4. Hook dispatches `setCredentials()` action
5. Redux slice updates state
6. Component re-renders with new `user` and `isAuthenticated` values

---

## 🎯 Why This Structure?

### ✅ Benefits:

1. **Separation of Concerns**
   - Types in `types/`
   - API calls in `api/`
   - State in `store/`
   - UI in `ui/`

2. **Easy to Find**
   - All auth code in one place
   - Clear file names

3. **Reusable**
   - `useAuth()` can be used in any component
   - `authApi` can be used directly if needed

4. **Maintainable**
   - Change API? Only edit `authApi.ts`
   - Change state? Only edit `auth-slice.ts`
   - Add new hook? Add to `hooks/`

5. **Testable**
   - Each layer can be tested independently
   - Mock `authApi` when testing hooks
   - Mock hooks when testing components

---

## 📝 Quick Reference

| Need | Import From |
|------|-------------|
| Use auth in component | `import { useAuth } from '@/features/auth'` |
| Make API call directly | `import { authApi } from '@/features/auth'` |
| Get token in component | `import { selectToken } from '@/features/auth'` |
| Use types | `import type { User } from '@/features/auth'` |
| Use LoginForm component | `import { LoginForm } from '@/features/auth'` |

---

## 🚀 Next Steps

When you create other features (dashboard, billing, etc.), follow the same pattern:
- `features/dashboard/api/` - Dashboard API calls
- `features/dashboard/hooks/` - Dashboard hooks
- `features/dashboard/store/` - Dashboard Redux slice
- `features/dashboard/types/` - Dashboard types
- `features/dashboard/index.ts` - Public API

This keeps your codebase organized and scalable! 🎉

