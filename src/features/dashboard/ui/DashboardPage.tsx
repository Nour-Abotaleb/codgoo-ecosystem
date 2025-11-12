import { useEffect, useMemo, useState, useCallback } from "react";
import { useMatch, useNavigate, useLocation } from "react-router-dom";

import { useAppDispatch, useAppSelector } from "@store/hooks";
import { selectTheme, setTheme, toggleTheme } from "@store/theme/theme-slice";

import {
  dashboardApps,
  dashboardContent,
  serverServices
} from "./constants";
import { DashboardHeader } from "./components/DashboardHeader";
import { DashboardSidebar } from "./components/DashboardSidebar";
import { ServerServicesView } from "./components/ServerServicesView";
import { ManageServerView } from "./components/ManageServerView";
import { DomainsView } from "./components/DomainsView";
import { DashboardOverview } from "./components/DashboardOverview";
import { BillingView } from "./components/BillingView";
import type { DashboardAppId, DashboardTokens } from "./types";

export const DashboardPage = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useAppSelector(selectTheme);
  const isDark = theme === "dark";
  const [activeAppId, setActiveAppId] = useState<DashboardAppId>(dashboardApps[0].id);

  const activeApp = useMemo(
    () => dashboardApps.find((app) => app.id === activeAppId) ?? dashboardApps[0],
    [activeAppId]
  );
  const manageMatch = useMatch("/dashboard/manage-server/:serviceId");
  const dataset = dashboardContent[activeApp.id];
  const navigationItems = dataset.navigation;
  const [activeNavId, setActiveNavId] = useState(() => navigationItems[0]?.id ?? "");
  const activeNavigationItem = navigationItems.find((item) => item.id === activeNavId);
  const themeVariables = useMemo(
    () => ({
      dark: {
        "--color-page-bg": "#0D0D15",
        "--color-page-text": "#F4F5FF",
        "--color-shell-bg": "#171926",
        "--color-sidebar-bg": "#0D0D15",
        "--color-sidebar-border": "#232637",
        "--color-sidebar-text": "#A3AED0",
        "--color-sidebar-divider": "rgba(148,163,255,0.18)",
        "--color-sidebar-nav-active-text": "#A3AED0",
        "--color-sidebar-nav-idle-text": "rgba(255,255,255,0.65)",
        "--color-card-bg": "#232637",
        "--color-card-border": "rgba(103,114,229,0.18)",
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
        "--color-popover-bg": "rgba(12,15,38,0.95)",
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
        "--color-page-bg": "#FFFFFF",
        "--color-page-text": "#111539",
        "--color-shell-bg": "#F9FAFC",
        "--color-sidebar-bg": "#FFFFFF",
        "--color-sidebar-border": "rgba(99,102,241,0.1)",
        "--color-sidebar-text": "#111539",
        "--color-sidebar-divider": "rgba(99,102,241,0.12)",
        "--color-sidebar-nav-active-text": "#584ABC",
        "--color-sidebar-nav-idle-text": "rgba(88,74,188,0.65)",
        "--color-card-bg": "rgba(255,255,255,0.96)",
        "--color-card-border": "rgba(99,102,241,0.12)",
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
    }),
    []
  );

  useEffect(() => {
    const root = document.documentElement;
    const palette = themeVariables[theme] ?? themeVariables.dark;
    Object.entries(palette).forEach(([token, value]) => {
      root.style.setProperty(token, value);
    });
    root.dataset.theme = theme;
  }, [theme, themeVariables]);

  useEffect(() => {
    dispatch(setTheme(activeApp.theme));
  }, [dispatch, activeApp.theme]);

  useEffect(() => {
    if (!navigationItems.some((item) => item.id === activeNavId)) {
      setActiveNavId(navigationItems[0]?.id ?? "");
    }
  }, [navigationItems, activeNavId]);

  useEffect(() => {
    if (manageMatch && activeNavId !== "server") {
      setActiveNavId("server");
    }
  }, [manageMatch, activeNavId]);

  // Sync activeNavId with current route
  useEffect(() => {
    const path = location.pathname;
    
    // Handle manage-server route
    if (path.includes("/manage-server/")) {
      if (activeNavId !== "server") {
        setActiveNavId("server");
      }
      return;
    }

    // Extract navId from path (e.g., /dashboard/domains -> domains)
    const pathParts = path.split("/").filter(Boolean);
    if (pathParts.length >= 2 && pathParts[0] === "dashboard") {
      const routeNavId = pathParts[1];
      // Check if this route corresponds to a valid nav item
      const matchingNavItem = navigationItems.find((item) => item.id === routeNavId);
      if (matchingNavItem && activeNavId !== routeNavId) {
        setActiveNavId(routeNavId);
      } else if (pathParts.length === 1 || (pathParts.length === 2 && routeNavId === "dashboard")) {
        // Default to first nav item if at /dashboard or /dashboard/dashboard
        if (activeNavId !== navigationItems[0]?.id) {
          setActiveNavId(navigationItems[0]?.id ?? "");
        }
      }
    }
  }, [location.pathname, navigationItems, activeNavId]);

  const handleToggleTheme = () => {
    dispatch(toggleTheme());
  };

  const handleSelectNav = useCallback(
    (navId: string) => {
      setActiveNavId(navId);
      // Navigate to the appropriate route
      if (navId === "dashboard") {
        navigate("/dashboard");
      } else {
        navigate(`/dashboard/${navId}`);
      }
    },
    [navigate]
  );

  const handleSelectApp = useCallback(
    (appId: DashboardAppId) => {
      setActiveAppId(appId);
      navigate("/dashboard");
    },
    [navigate]
  );

  const handleOpenService = useCallback(
    (serviceId: string) => {
      navigate(`/dashboard/manage-server/${serviceId}`);
    },
    [navigate]
  );

  const handleReturnToServices = useCallback(() => {
    navigate("/dashboard");
  }, [navigate]);

  const selectedService = useMemo(
    () => serverServices.find((service) => service.id === manageMatch?.params?.serviceId),
    [manageMatch?.params?.serviceId]
  );

  const tokens: DashboardTokens = {
    isDark,
    rootClass:
      "bg-[var(--color-page-bg)] text-[var(--color-page-text)] transition-colors duration-300",
    sidebarClass:
      "bg-[var(--color-sidebar-bg)] border-[var(--color-sidebar-border)] text-[var(--color-sidebar-text)]",
    cardBase:
      "bg-[var(--color-card-bg)] text-[var(--color-card-text)]",
    sidebarNavActiveText: "text-[var(--color-sidebar-nav-active-text)]",
    sidebarNavIdleText:
      "text-[var(--color-sidebar-nav-idle-text)] hover:text-[var(--color-sidebar-nav-active-text)]",
    subtleText: isDark ? "text-white/70" : "text-[var(--color-page-text)]/65",
    divider: "border-[var(--color-border-divider)]",
    buttonFilled:
      "bg-[var(--color-button-filled-bg)] text-[var(--color-button-filled-text)]",
    buttonGhost:
      "bg-[var(--color-button-ghost-bg)] text-[var(--color-button-ghost-text)]",
    surfaceMuted: "bg-[var(--color-surface-muted)]",
    iconActive: "text-[var(--color-icon-active)]",
    iconIdle: "text-[var(--color-icon-idle)]",
    chipClass:
      "inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-medium"
  };

  return (
    <div className={`dashboard flex w-full ${tokens.rootClass}`}>
      <DashboardSidebar
        apps={dashboardApps}
        activeAppId={activeApp.id}
        onSelectApp={handleSelectApp}
        navigationItems={navigationItems}
        activeNavId={activeNavId}
        onSelectNav={handleSelectNav}
        tokens={tokens}
      />

      <section className="flex min-h-screen flex-1 flex-col lg:ms-64 bg-[var(--color-shell-bg)] rounded-[32px] m-6 transition-colors duration-300">
        <div className="flex flex-col gap-8 px-6 py-6">
          <DashboardHeader
            tokens={tokens}
            activeApp={activeApp}
            activeNavigationLabel={activeNavigationItem?.label}
            onToggleTheme={handleToggleTheme}
          />
          {activeNavId === "dashboard" ? (
            <DashboardOverview
              dataset={dataset}
              tokens={tokens}
              onManageDomain={() => handleSelectNav("domains")}
            />
          ) : activeNavId === "server" ? (
            manageMatch && selectedService ? (
              <ManageServerView
                service={selectedService}
                tokens={tokens}
                onBack={handleReturnToServices}
              />
            ) : (
              <ServerServicesView
                services={serverServices}
                tokens={tokens}
                onOpenService={handleOpenService}
              />
            )
          ) : activeNavId === "domains" ? (
            <DomainsView domains={dataset.domains} tokens={tokens} />
          ) : activeNavId === "billing" ? (
            <BillingView tokens={tokens} />
          ) : (
            <div className={`${tokens.cardBase} rounded-3xl p-10`}>
              <h2 className="text-2xl font-semibold">
                {activeNavigationItem?.label ?? "Coming Soon"}
              </h2>
              <p className={`mt-3 text-sm ${tokens.subtleText}`}>
                This section is under construction. Switch to the Servers tab to explore the available screen.
              </p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};


