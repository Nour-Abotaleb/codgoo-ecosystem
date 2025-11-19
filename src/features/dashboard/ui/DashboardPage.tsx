import { useEffect, useMemo, useState, useCallback } from "react";
import { useMatch, useNavigate, useLocation } from "react-router-dom";

import { useAppDispatch, useAppSelector } from "@store/hooks";
import { selectTheme, toggleTheme } from "@store/theme/theme-slice";

import {
  dashboardApps,
  dashboardContent,
  serverServices
} from "./constants";
import { DashboardHeader } from "./components/DashboardHeader";
import { DashboardSidebar } from "./components/DashboardSidebar";
import { ServerServicesView } from "./components/cloud/ServerServicesView";
import { ManageServerView } from "./components/cloud/ManageServerView";
import { DomainsView } from "./components/cloud/DomainsView";
import { ManageDomainView } from "./components/cloud/ManageDomainView";
import { RegisterDomainView } from "./components/cloud/RegisterDomainView";
import { DashboardOverview } from "./components/cloud/DashboardOverview";
import { SoftwareDashboardOverview } from "./components/software/SoftwareDashboardOverview";
import { ProjectsView } from "./components/software/ProjectsView";
import { ProjectDetailsView } from "./components/software/ProjectDetailsView";
import { AppDashboardOverview } from "./components/app/AppDashboardOverview";
import { BillingView } from "./components/BillingView";
import { WebsitesView } from "./components/cloud/WebsitesView";
import { ManageWebsiteView } from "./components/cloud/ManageWebsiteView";
import { HostView } from "./components/cloud/HostView";
import { ManageHostView } from "./components/cloud/ManageHostView";
import { OrderView } from "./components/OrderView";
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
  const manageDomainMatch = useMatch("/dashboard/manage-domain/:domainId");
  const manageNameserversMatch = useMatch("/dashboard/manage-nameservers");
  const manageWebsiteMatch = useMatch("/dashboard/manage-website/:websiteId");
  const manageHostMatch = useMatch("/dashboard/manage-host/:hostId");
  const projectDetailsMatch = useMatch("/dashboard/projects/:projectId");
  const orderMatch = useMatch("/dashboard/order");
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
        "--color-card-border": activeApp.id === "app" ? "rgba(15,103,115,0.18)" : activeApp.id === "software" ? "rgba(64, 75, 155, 0.3)" : "rgba(103,114,229,0.18)",
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
        "--color-card-border": activeApp.id === "app" ? "rgba(15,103,115,0.12)" : activeApp.id === "software" ? "rgba(7,31,215,0.12)" : "rgba(99,102,241,0.12)",
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
    [activeApp.id, isDark]
  );

  useEffect(() => {
    const root = document.documentElement;
    const palette = themeVariables[theme] ?? themeVariables.dark;
    Object.entries(palette).forEach(([token, value]) => {
      root.style.setProperty(token, value);
    });
    root.dataset.theme = theme;
  }, [theme, themeVariables]);

  // Update document title and favicon when switching apps
  useEffect(() => {
    // Update document title
    document.title = activeApp.name;

    // Update favicon
    const faviconLink = document.querySelector("link[rel='icon']") as HTMLLinkElement;
    if (faviconLink) {
      const faviconMap: Record<DashboardAppId, string> = {
        cloud: "/logo-cloud.svg",
        app: "/logo-app.svg",
        software: "/logo-software.svg"
      };
      faviconLink.href = faviconMap[activeAppId] ?? "/logo-cloud.svg";
    }
  }, [activeApp.name, activeAppId]);

  // Removed automatic theme switching - preserve user's theme preference when switching apps
  // useEffect(() => {
  //   dispatch(setTheme(activeApp.theme));
  // }, [dispatch, activeApp.theme]);

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

  useEffect(() => {
    if (manageDomainMatch && activeNavId !== "domains") {
      setActiveNavId("domains");
    }
  }, [manageDomainMatch, activeNavId]);

  useEffect(() => {
    if (manageNameserversMatch && activeNavId !== "domains") {
      setActiveNavId("domains");
    }
  }, [manageNameserversMatch, activeNavId]);

  useEffect(() => {
    if (manageWebsiteMatch && activeNavId !== "websites") {
      setActiveNavId("websites");
    }
  }, [manageWebsiteMatch, activeNavId]);

  // Sync activeNavId with current route
  useEffect(() => {
    const path = location.pathname;
    
    // Handle order route - don't change activeNavId
    if (path.includes("/order")) {
      return;
    }
    
    // Handle manage-server route
    if (path.includes("/manage-server/")) {
      if (activeNavId !== "server") {
        setActiveNavId("server");
      }
      return;
    }

    // Handle manage-domain route
    if (path.includes("/manage-domain/")) {
      if (activeNavId !== "domains") {
        setActiveNavId("domains");
      }
      return;
    }

    // Handle manage-nameservers route
    if (path.includes("/manage-nameservers")) {
      if (activeNavId !== "domains") {
        setActiveNavId("domains");
      }
      return;
    }

    // Handle manage-website route
    if (path.includes("/manage-website/")) {
      if (activeNavId !== "websites") {
        setActiveNavId("websites");
      }
      return;
    }

    // Handle manage-host route
    if (path.includes("/manage-host/")) {
      if (activeNavId !== "host") {
        setActiveNavId("host");
      }
      return;
    }

    // Handle project details route
    if (path.includes("/projects/") && path.split("/").length > 3) {
      if (activeNavId !== "projects") {
        setActiveNavId("projects");
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
        <div className="flex flex-col gap-4 px-6 py-3">
          <DashboardHeader
            tokens={tokens}
            activeApp={activeApp}
            activeNavigationLabel={orderMatch ? "Order" : activeNavigationItem?.label}
            onToggleTheme={handleToggleTheme}
            onCartClick={() => navigate("/dashboard/order")}
          />
          {orderMatch ? (
            <OrderView tokens={tokens} />
          ) : activeNavId === "dashboard" ? (
            activeApp.id === "software" && dataset.softwareData ? (
              <SoftwareDashboardOverview
                data={dataset.softwareData}
                hero={dataset.hero}
                tokens={tokens}
              />
            ) : activeApp.id === "app" && dataset.appData ? (
              <AppDashboardOverview
                data={dataset.appData}
                hero={dataset.hero}
                tokens={tokens}
              />
            ) : (
              <DashboardOverview
                dataset={dataset}
                tokens={tokens}
                onManageDomain={() => handleSelectNav("domains")}
              />
            )
          ) : activeNavId === "host" ? (
            manageHostMatch ? (
              <ManageHostView hostId={manageHostMatch.params.hostId ?? ""} tokens={tokens} />
            ) : (
              <HostView tokens={tokens} />
            )
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
            manageDomainMatch ? (
              <ManageDomainView tokens={tokens} />
            ) : manageNameserversMatch ? (
              <RegisterDomainView tokens={tokens} />
            ) : (
              <DomainsView domains={dataset.domains} tokens={tokens} />
            )
          ) : activeNavId === "websites" ? (
            manageWebsiteMatch ? (
              <ManageWebsiteView tokens={tokens} />
            ) : (
              <WebsitesView sites={dataset.sites} tokens={tokens} />
            )
          ) : activeNavId === "projects" && activeApp.id === "software" ? (
            projectDetailsMatch ? (
              (() => {
                // Find project from default projects or get from data source
                const defaultProjects = [
                  {
                    id: "proj-1",
                    name: "FixMate App",
                    description:
                      "Updated app interface, changed order and appointment tracking system, improved customer satisfaction",
                    status: "Active" as const,
                    team: [
                      { id: "1", name: "John Doe" },
                      { id: "2", name: "Jane Smith" },
                      { id: "3", name: "Bob Wilson" }
                    ],
                    startDate: "15 Oct 2023",
                    deadline: "20 Nov 2023",
                    budget: "$5,000",
                    tasks: { completed: 8, total: 10 },
                    type: "Mobile",
                    lastUpdate: "2 days ago"
                  },
                  {
                    id: "proj-2",
                    name: "FixMate App",
                    description:
                      "Updated app interface, changed order and appointment tracking system, improved customer satisfaction",
                    status: "Active" as const,
                    team: [
                      { id: "1", name: "John Doe" },
                      { id: "2", name: "Jane Smith" },
                      { id: "3", name: "Bob Wilson" }
                    ],
                    startDate: "15 Oct 2023",
                    deadline: "20 Nov 2023",
                    budget: "$5,000",
                    tasks: { completed: 8, total: 10 },
                    type: "Mobile",
                    lastUpdate: "2 days ago"
                  },
                  {
                    id: "proj-3",
                    name: "FixMate App",
                    description:
                      "Updated app interface, changed order and appointment tracking system, improved customer satisfaction",
                    status: "Active" as const,
                    team: [
                      { id: "1", name: "John Doe" },
                      { id: "2", name: "Jane Smith" },
                      { id: "3", name: "Bob Wilson" }
                    ],
                    startDate: "15 Oct 2023",
                    deadline: "20 Nov 2023",
                    budget: "$5,000",
                    tasks: { completed: 8, total: 10 },
                    type: "Mobile",
                    lastUpdate: "2 days ago"
                  }
                ];
                const projectId = projectDetailsMatch.params.projectId;
                const project = defaultProjects.find((p) => p.id === projectId) ?? defaultProjects[0];
                return (
                  <ProjectDetailsView
                    project={project}
                    tokens={tokens}
                    onBack={() => navigate("/dashboard/projects")}
                    onManage={(id) => {
                      // Handle manage
                    }}
                  />
                );
              })()
            ) : (
              <ProjectsView
                tokens={tokens}
                onAddProject={() => {
                  // Handle add project
                }}
                onViewDetails={(projectId) => {
                  navigate(`/dashboard/projects/${projectId}`);
                }}
                onManage={(projectId) => {
                  // Handle manage
                }}
              />
            )
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


