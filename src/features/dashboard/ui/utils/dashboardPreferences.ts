import type { DashboardAppId } from "../types";

const DEFAULT_DASHBOARD_KEY = "dashboard:default";
const CURRENT_DASHBOARD_KEY = "dashboard:current";

export const getDefaultDashboard = (): DashboardAppId => {
  try {
    const stored = localStorage.getItem(DEFAULT_DASHBOARD_KEY);
    if (stored && (stored === "cloud" || stored === "app" || stored === "software")) {
      return stored as DashboardAppId;
    }
  } catch (error) {
    console.error("Error reading default dashboard preference:", error);
  }
  return "cloud"; // Default to cloud dashboard
};

export const setDefaultDashboard = (appId: DashboardAppId): void => {
  try {
    localStorage.setItem(DEFAULT_DASHBOARD_KEY, appId);
  } catch (error) {
    console.error("Error saving default dashboard preference:", error);
  }
};

export const getCurrentDashboard = (): DashboardAppId | null => {
  try {
    const stored = localStorage.getItem(CURRENT_DASHBOARD_KEY);
    if (stored && (stored === "cloud" || stored === "app" || stored === "software")) {
      return stored as DashboardAppId;
    }
  } catch (error) {
    console.error("Error reading current dashboard:", error);
  }
  return null;
};

export const setCurrentDashboard = (appId: DashboardAppId): void => {
  try {
    localStorage.setItem(CURRENT_DASHBOARD_KEY, appId);
  } catch (error) {
    console.error("Error saving current dashboard:", error);
  }
};

