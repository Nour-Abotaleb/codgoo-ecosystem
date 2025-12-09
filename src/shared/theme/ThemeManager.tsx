import { useEffect, useRef } from "react";
import type { ReactNode } from "react";
import { useLocation } from "react-router-dom";
import { useAppSelector } from "@store/hooks";
import { selectTheme } from "@store/theme/theme-slice";
import { getThemeColors, applyThemeColors, clearThemeColors } from "./colors";
import type { ThemeContext, DashboardAppId } from "./types";

type ThemeManagerProps = {
  readonly children: ReactNode;
  readonly context?: ThemeContext;
  readonly appId?: DashboardAppId;
};

let currentDashboardAppId: DashboardAppId | undefined;

// eslint-disable-next-line react-refresh/only-export-components
export const setDashboardAppId = (appId: DashboardAppId | undefined): void => {
  currentDashboardAppId = appId;
};

/**
 * ThemeManager - Manages theme colors based on route context
 * Automatically detects route and applies appropriate theme
 */
export const ThemeManager = ({ 
  children, 
  context: overrideContext,
  appId: propAppId
}: ThemeManagerProps) => {
  const location = useLocation();
  const theme = useAppSelector(selectTheme);
  const previousContextRef = useRef<ThemeContext | null>(null);
  
  // Auto-detect context from route if not provided
  const context: ThemeContext = overrideContext ?? (() => {
    const path = location.pathname;
    if (path.startsWith("/dashboard")) return "dashboard";
    if (path === "/login" || path === "/register") return "auth";
    if (path === "/" || path.startsWith("/home")) return "landing";
    return "default";
  })();

  // Use prop appId if provided, otherwise use the stored one for dashboard context
  const appId = propAppId ?? (context === "dashboard" ? currentDashboardAppId : undefined);

  useEffect(() => {
    // Clear previous theme colors if context changed
    if (previousContextRef.current && previousContextRef.current !== context) {
      clearThemeColors();
    }
    
    // Apply new theme colors based on context
    const colors = getThemeColors(theme, context, appId);
    applyThemeColors(colors);
    
    // Set theme data attribute
    document.documentElement.dataset.theme = theme;
    document.documentElement.dataset.themeContext = context;
    
    previousContextRef.current = context;
    
    // Cleanup: clear colors when leaving the context
    return () => {
      const currentPath = window.location.pathname;
      const shouldClear = 
        (context === "dashboard" && !currentPath.startsWith("/dashboard")) ||
        (context === "auth" && !["/login", "/register"].includes(currentPath)) ||
        (context === "landing" && currentPath !== "/" && !currentPath.startsWith("/home"));
      
      if (shouldClear) {
        clearThemeColors();
        previousContextRef.current = null;
      }
    };
  }, [theme, context, appId]);

  return <>{children}</>;
};

