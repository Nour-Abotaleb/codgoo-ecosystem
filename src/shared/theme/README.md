# Unified Theme System

## Overview

The unified theme system provides centralized theme management across all features (Dashboard, Auth, Landing) with automatic context detection and color cleanup.

## Architecture

### Components

1. **`types.ts`** - TypeScript types for theme system
2. **`colors.ts`** - Color definitions and theme color generators
3. **`ThemeManager.tsx`** - React component that manages theme application
4. **`index.ts`** - Public API exports

## How It Works

### Automatic Context Detection

The `ThemeManager` automatically detects the current route and applies the appropriate theme:

- **Dashboard** (`/dashboard/*`) - Applies dashboard-specific colors
- **Auth** (`/login`, `/register`) - Applies auth-specific colors  
- **Landing** (`/`, `/home/*`) - Applies landing-specific colors
- **Default** - Applies fallback colors

### Theme Contexts

Each context has its own color palette:

#### Dashboard Context
- Full color system with app-specific variations (cloud, app, software)
- Includes sidebar, cards, buttons, popovers, etc.
- App-specific card borders based on active app

#### Auth Context
- Minimal color set for authentication pages
- `--color-auth-border`, `--color-auth-placeholder`, `--color-auth-helper`
- `--color-link`, `--color-nav-link`

#### Landing Context
- Landing page specific colors
- `--color-landing-bg`, `--color-landing-text`, `--color-landing-accent`

### Dashboard App ID Management

For dashboard context, the active app ID (cloud/app/software) is managed via:

```typescript
import { setDashboardAppId } from "@shared/theme";

// In DashboardPage component
useEffect(() => {
  setDashboardAppId(activeApp.id);
  return () => {
    setDashboardAppId(undefined);
  };
}, [activeApp.id]);
```

This allows the theme system to apply app-specific colors (like card borders) dynamically.

## Usage

### In AppLayout (Automatic)

The `ThemeManager` is already integrated in `AppLayout.tsx` and automatically handles all routes:

```tsx
<ThemeManager>
  {/* Your app content */}
</ThemeManager>
```

### Manual Context Override

If needed, you can override the auto-detected context:

```tsx
<ThemeManager context="dashboard" appId="cloud">
  {/* Dashboard content */}
</ThemeManager>
```

## Color Cleanup

The system automatically:
- Clears previous theme colors when switching contexts
- Preserves static CSS variables from `index.css` (like `--color-auth-*`)
- Prevents color conflicts between features

## Benefits

1. **Unified System** - Single source of truth for all theme colors
2. **Automatic Cleanup** - No color conflicts when navigating between features
3. **Type Safety** - Full TypeScript support
4. **Context Aware** - Automatically applies correct theme based on route
5. **Maintainable** - All colors in one place, easy to update

## Migration Notes

- Old dashboard theme colors in `DashboardPage.tsx` have been moved to `shared/theme/colors.ts`
- Dashboard-specific theme utilities in `features/dashboard/ui/theme/` can be removed (now using shared system)
- Auth colors in `index.css` are preserved and merged with dynamic theme colors

