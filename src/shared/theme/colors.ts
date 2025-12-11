import type { ThemeMode, ThemeContext, ThemeColors, DashboardAppId } from "./types";

/**
 * Base colors that are shared across all contexts
 */
const getBaseColors = (mode: ThemeMode): ThemeColors => {
  return {
    "--color-page-bg": mode === "dark" ? "#0D0D15" : "#FFFFFF",
    "--color-page-text": mode === "dark" ? "#F4F5FF" : "#111539",
  };
};

/**
 * Dashboard-specific colors
 */
const getDashboardColors = (
  mode: ThemeMode,
  appId?: DashboardAppId
): ThemeColors => {
  const baseDashboardColors: Record<ThemeMode, ThemeColors> = {
    dark: {
      "--color-shell-bg": "#171926",
      "--color-sidebar-bg": "#0D0D15",
      "--color-sidebar-border": "#232637",
      "--color-sidebar-text": "#A3AED0",
      "--color-sidebar-divider": "rgba(148,163,255,0.18)",
      "--color-sidebar-nav-active-text": "#A3AED0",
      "--color-sidebar-nav-idle-text": "rgba(255,255,255,0.65)",
      "--color-card-bg": "#232637",
      "--color-table-row-bg": "#2E3141",
      "--color-section-muted": "rgba(29,32,48,0.85)",
      "--color-progress-track": "rgba(255,255,255,0.12)",
      "--color-card-text": "#F5F6FF",
      "--color-text-subtle": "rgba(203,213,255,0.7)",
      "--color-border-divider": "#2E3141",
      "--color-button-filled-bg": "#7469C7",
      "--color-button-filled-text": "#FFFFFF",
      "--color-button-ghost-bg": "#9A9B9C22",
      "--color-button-ghost-text": "#E2E8FF",
      "--color-surface-muted": "rgba(11,15,36,0.75)",
      "--color-icon-active": "#FFFFFF",
      "--color-icon-idle": "rgba(203,213,255,0.65)",
      "--color-icon-muted": "#FFFFFF",
      "--color-icon-surface": "rgba(255,255,255,0.12)",
      "--color-accent-secondary": "#A78BFA",
      "--color-search-bg": "#2E3141",
      "--color-search-text": "#F8FAFF",
      "--color-search-placeholder": "rgba(203,213,255,0.65)",
      "--color-popover-bg": "rgb(0, 0, 0, 0.95)",
      "--color-popover-text": "#F8FAFF",
      "--color-popover-ring": "rgba(124,77,255,0.35)",
      "--color-popover-active-bg": "rgba(124,77,255,0.14)",
      "--color-popover-active-text": "#FFFFFF",
      "--color-popover-idle-text": "rgba(229,231,255,0.85)",
      "--color-popover-hover-bg": "rgba(124,77,255,0.1)",
      "--color-switcher-icon-active": "#FFFFFF",
      "--color-switcher-icon-inactive": "rgba(229,231,255,0.7)",
      "--color-button-shadow": "0 12px 30px -10px rgba(124,77,255,0.55)",
      "--shadow-cta": "rgba(124,77,255,0.4)"
    },
    light: {
      "--color-shell-bg": "#F9FAFC",
      "--color-sidebar-bg": "#FFFFFF",
      "--color-sidebar-border": "rgba(99,102,241,0.1)",
      "--color-sidebar-text": "#111539",
      "--color-sidebar-divider": "rgba(99,102,241,0.12)",
      "--color-sidebar-nav-active-text": "#584ABC",
      "--color-sidebar-nav-idle-text": "rgba(88,74,188,0.65)",
      "--color-card-bg": "rgba(255,255,255,0.96)",
      "--color-table-row-bg": "#FFFFFF",
      "--color-section-muted": "rgba(240,242,255,0.9)",
      "--color-progress-track": "rgba(88,74,188,0.12)",
      "--color-card-text": "#111539",
      "--color-text-subtle": "rgba(30,41,109,0.6)",
      "--color-border-divider": "rgba(99,102,241,0.18)",
      "--color-button-filled-bg": "#7469C7",
      "--color-button-filled-text": "#FFFFFF",
      "--color-button-ghost-bg": "rgba(116,97,255,0.12)",
      "--color-button-ghost-text": "#4C1D95",
      "--color-surface-muted": "rgba(243,244,255,0.8)",
      "--color-icon-active": "#4C1D95",
      "--color-icon-idle": "rgba(76,29,149,0.55)",
      "--color-icon-muted": "#FFFFFF",
      "--color-icon-surface": "rgba(116,97,255,0.18)",
      "--color-accent-secondary": "#6D28D9",
      "--color-search-bg": "rgba(255,255,255,0.9)",
      "--color-search-text": "#0F172A",
      "--color-search-placeholder": "rgba(88,28,135,0.55)",
      "--color-popover-bg": "rgba(255,255,255,0.95)",
      "--color-popover-text": "#1E293B",
      "--color-popover-ring": "rgba(99,102,241,0.25)",
      "--color-popover-active-bg": "rgba(116,97,255,0.15)",
      "--color-popover-active-text": "#1E293B",
      "--color-popover-idle-text": "rgba(30,41,109,0.7)",
      "--color-popover-hover-bg": "rgba(116,97,255,0.18)",
      "--color-switcher-icon-active": "#4C1D95",
      "--color-switcher-icon-inactive": "rgba(76,29,149,0.5)",
      "--color-button-shadow": "0 18px 40px -18px rgba(94,86,255,0.45)",
      "--shadow-cta": "rgba(94,86,255,0.45)"
    }
  };

  const appSpecificCardBorders: Record<DashboardAppId, Record<ThemeMode, string>> = {
    app: {
      dark: "rgba(15,103,115,0.18)",
      light: "rgba(15,103,115,0.12)"
    },
    software: {
      dark: "rgba(64, 75, 155, 0.3)",
      light: "rgba(7,31,215,0.12)"
    },
    cloud: {
      dark: "rgba(103,114,229,0.18)",
      light: "rgba(99,102,241,0.12)"
    }
  };

  const colors: ThemeColors = {
    ...baseDashboardColors[mode]
  };

  // Add app-specific card border if appId is provided
  if (appId) {
    colors["--color-card-border"] = appSpecificCardBorders[appId][mode];
  } else {
    // Default to cloud colors
    colors["--color-card-border"] = appSpecificCardBorders.cloud[mode];
  }

  return colors;
};

/**
 * Auth-specific colors
 * Note: Auth colors are static and don't vary by theme mode
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const getAuthColors = (_mode: ThemeMode): ThemeColors => {
  return {
    "--color-auth-border": "#e2e8f0",
    "--color-auth-placeholder": "#94a3b8",
    "--color-auth-helper": "#475569",
    "--color-link": "#6366f1",
    "--color-nav-link": "#584ABC"
  };
};

/**
 * Landing-specific colors
 */
const getLandingColors = (mode: ThemeMode): ThemeColors => {
  return {
    "--color-landing-bg": mode === "dark" ? "#0f172a" : "#ffffff",
    "--color-landing-text": mode === "dark" ? "#f1f5f9" : "#1e293b",
    "--color-landing-accent": "#6366f1"
  };
};

/**
 * Default/fallback colors
 */
const getDefaultColors = (mode: ThemeMode): ThemeColors => {
  return {
    "--color-default-bg": mode === "dark" ? "#0f172a" : "#ffffff",
    "--color-default-text": mode === "dark" ? "#f1f5f9" : "#1e293b"
  };
};

/**
 * Get theme colors for a specific context
 */
export const getThemeColors = (
  mode: ThemeMode,
  context: ThemeContext,
  appId?: DashboardAppId
): ThemeColors => {
  const baseColors = getBaseColors(mode);
  
  switch (context) {
    case "dashboard":
      return {
        ...baseColors,
        ...getDashboardColors(mode, appId)
      };
    case "auth":
      return {
        ...baseColors,
        ...getAuthColors(mode)
      };
    case "landing":
      return {
        ...baseColors,
        ...getLandingColors(mode)
      };
    case "default":
    default:
      return {
        ...baseColors,
        ...getDefaultColors(mode)
      };
  }
};

/**
 * Applies theme colors to the document root
 */
export const applyThemeColors = (colors: ThemeColors): void => {
  const root = document.documentElement;
  Object.entries(colors).forEach(([token, value]) => {
    root.style.setProperty(token, value);
  });
};

/**
 * Clears all theme colors from the document root
 * Only clears dynamic colors, preserves static CSS variables from index.css
 */
export const clearThemeColors = (): void => {
  const root = document.documentElement;
  
  // List of all dynamic theme variables that should be cleared
  const dynamicVariables = [
    // Base colors
    "--color-page-bg",
    "--color-page-text",
    // Dashboard colors
    "--color-shell-bg",
    "--color-sidebar-bg",
    "--color-sidebar-border",
    "--color-sidebar-text",
    "--color-sidebar-divider",
    "--color-sidebar-nav-active-text",
    "--color-sidebar-nav-idle-text",
    "--color-card-bg",
    "--color-card-border",
    "--color-card-text",
    "--color-table-row-bg",
    "--color-section-muted",
    "--color-progress-track",
    "--color-text-subtle",
    "--color-border-divider",
    "--color-button-filled-bg",
    "--color-button-filled-text",
    "--color-button-ghost-bg",
    "--color-button-ghost-text",
    "--color-surface-muted",
    "--color-icon-active",
    "--color-icon-idle",
    "--color-icon-muted",
    "--color-icon-surface",
    "--color-accent-secondary",
    "--color-search-bg",
    "--color-search-text",
    "--color-search-placeholder",
    "--color-popover-bg",
    "--color-popover-text",
    "--color-popover-ring",
    "--color-popover-active-bg",
    "--color-popover-active-text",
    "--color-popover-idle-text",
    "--color-popover-hover-bg",
    "--color-switcher-icon-active",
    "--color-switcher-icon-inactive",
    "--color-button-shadow",
    "--shadow-cta",
    // Landing colors
    "--color-landing-bg",
    "--color-landing-text",
    "--color-landing-accent",
    // Default colors
    "--color-default-bg",
    "--color-default-text"
  ];
  
  // Remove all dynamic theme variables
  dynamicVariables.forEach((variable) => {
    root.style.removeProperty(variable);
  });
};

