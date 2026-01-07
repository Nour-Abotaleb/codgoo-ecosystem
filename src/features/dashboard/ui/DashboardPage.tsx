import { useEffect, useMemo, useState, useCallback } from "react";
import { useMatch, useNavigate, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";

import { useAppDispatch, useAppSelector } from "@store/hooks";
import { selectTheme, toggleTheme } from "@store/theme/theme-slice";

// Import logos for Electron compatibility
import logoCloud from "/logo-cloud.svg";
import logoSoftware from "/logo-software.svg";
import logoApp from "/logo-app.svg";

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
import { ProposalsView } from "./components/software/ProposalsView";
import { TaskDetailView } from "./components/software/TaskDetailView";
import { MeetingsView } from "./components/software/MeetingsView";
import { GeneralSettingsView } from "./components/GeneralSettingsView";
import { SupportView } from "./components/SupportView";
import { ProductsView } from "./components/software/ProductsView";
import { ProductDetailsView } from "./components/software/ProductDetailsView";
import { AppDashboardOverview } from "./components/app/AppDashboardOverview";
import { ApplicationsView } from "./components/app/ApplicationsView";
import { MarketplaceView } from "./components/app/MarketplaceView";
import { MarketplaceDetailView } from "./components/app/MarketplaceDetailView";
import type { MarketplaceItem } from "./components/app/MarketplaceCard";
import { useGetMarketplaceAppsQuery } from "@/store/api/marketplace-api";
import { fallbackMarketplaceData } from "./components/app/marketplace-fallback-data";
import { BillingView } from "./components/BillingView";
import { BundleSelectionView } from "./components/app/BundleSelectionView";
import { BundleAppsView } from "./components/app/BundleAppsView";
import { WebsitesView } from "./components/cloud/WebsitesView";
import { ManageWebsiteView } from "./components/cloud/ManageWebsiteView";
import { HostView } from "./components/cloud/HostView";
import { ManageHostView } from "./components/cloud/ManageHostView";
import { OrderView } from "./components/OrderView";
import type { DashboardAppId, DashboardTokens } from "./types";
import { getDefaultDashboard, getCurrentDashboard, setCurrentDashboard } from "./utils/dashboardPreferences";
import { setDashboardAppId } from "@shared/theme";

export const DashboardPage = () => {
  const { t } = useTranslation(["dashboard", "landing"]);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useAppSelector(selectTheme);
  const isDark = theme === "dark";
  const [activeAppId, setActiveAppId] = useState<DashboardAppId>(() => {
    // First try to get the current dashboard (last active), then fall back to default
    return getCurrentDashboard() ?? getDefaultDashboard();
  });
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
  // Only fetch if user is authenticated
  const token = localStorage.getItem("auth_token");
  const { data: marketplaceApiData } = useGetMarketplaceAppsQuery(undefined, {
    skip: !token,
  });

  // Use API data if available, otherwise use fallback data
  const marketplaceData = useMemo(() => {
    if (marketplaceApiData?.status && marketplaceApiData?.services) {
      return marketplaceApiData;
    }
    return fallbackMarketplaceData;
  }, [marketplaceApiData]);

  // Transform marketplace data to MarketplaceItem format
  const marketplaceItems = useMemo((): MarketplaceItem[] => {
    if (!marketplaceData?.services) return [];

    return marketplaceData.services.map((app): MarketplaceItem => ({
      id: app.id.toString(),
      title: app.name,
      description: app.description,
      rating: app.rating?.average ?? 0,
      reviewCount: app.rating?.reviewsCount ?? 0,
      priceType: app.price?.amount === 0 ? "Free" : "Paid",
      price: `${app.price?.amount ?? 0} EGP`,
      icon: app.icon?.url ? (
        <img src={app.icon.url} alt={app.icon.alt || app.name} className="w-7 h-7" />
      ) : (
        <div className="w-7 h-7 bg-gray-300 rounded" />
      ),
      iconGradient: undefined,
    }));
  }, [marketplaceData]);

  const activeApp = useMemo(
    () => dashboardApps.find((app) => app.id === activeAppId) ?? dashboardApps[0],
    [activeAppId]
  );
  const manageMatch = useMatch("/dashboard/manage-server/:serviceId");
  const manageDomainMatch = useMatch("/dashboard/manage-domain/:domainId");
  const productDetailsMatch = useMatch("/dashboard/products/:productId");
  const manageNameserversMatch = useMatch("/dashboard/manage-nameservers");
  const manageWebsiteMatch = useMatch("/dashboard/manage-website/:websiteId");
  const manageHostMatch = useMatch("/dashboard/manage-host/:hostId");
  const projectDetailsMatch = useMatch("/dashboard/projects/:projectId");
  const proposalsMatch = useMatch("/dashboard/projects/:projectId/proposals");
  const marketplaceDetailMatch = useMatch("/dashboard/marketplace/:itemId");
  const marketplaceBundleMatch = useMatch("/dashboard/marketplace/bundles");
  const marketplaceBundleDetailMatch = useMatch("/dashboard/marketplace/bundles/:bundleId");
  const orderMatch = useMatch("/dashboard/order");
  const taskDetailMatch = useMatch("/dashboard/software/tasks/:taskId");
  const dataset = dashboardContent[activeApp.id];
  const navigationItems = dataset.navigation;
  const [activeNavId, setActiveNavId] = useState(() => navigationItems[0]?.id ?? "");
  const activeNavigationItem = navigationItems.find((item) => item.id === activeNavId);

  // Update dashboard app ID for theme system
  useEffect(() => {
    setDashboardAppId(activeApp.id);
    return () => {
      setDashboardAppId(undefined);
    };
  }, [activeApp.id]);

  // Update document title and favicon when switching apps
  useEffect(() => {
    // Update document title
    document.title = activeApp.name;

    // Update favicon
    const faviconLink = document.querySelector("link[rel='icon']") as HTMLLinkElement;
    if (faviconLink) {
      const faviconMap: Record<DashboardAppId, string> = {
        cloud: logoCloud,
        app: logoApp,
        software: logoSoftware
      };
      faviconLink.href = faviconMap[activeAppId] ?? logoCloud;
    }
  }, [activeApp.name, activeAppId]);

  // Removed automatic theme switching - preserve user's theme preference when switching apps
  // useEffect(() => {
  //   dispatch(setTheme(activeApp.theme));
  // }, [dispatch, activeApp.theme]);

  useEffect(() => {
    // Don't reset if activeNavId is "support" (it's a special route not in navigation items)
    if (activeNavId === "support") {
      return;
    }
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

    // Handle product details route
    if (path.includes("/products/") && path.split("/").length > 3) {
      if (activeNavId !== "products") {
        setActiveNavId("products");
      }
      // Products are only in software app
      if (activeAppId !== "software") {
        setActiveAppId("software");
        setCurrentDashboard("software");
      }
      return;
    }

    // Handle marketplace detail route
    if (path.includes("/marketplace/") && path.split("/").length > 3) {
      if (activeNavId !== "marketplace") {
        setActiveNavId("marketplace");
      }
      return;
    }

    // Handle task detail route
    if (path.includes("/tasks/") && path.split("/").length > 3) {
      if (activeNavId !== "projects") {
        setActiveNavId("projects");
      }
      return;
    }

    // Extract navId from path (e.g., /dashboard/domains -> domains)
    const pathParts = path.split("/").filter(Boolean);
    if (pathParts.length >= 2 && pathParts[0] === "dashboard") {
      const routeNavId = pathParts[1];
      
      // Handle support route separately (not in navigation items)
      if (routeNavId === "support") {
        if (activeNavId !== "support") {
          setActiveNavId("support");
        }
        return;
      }
      
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
      setCurrentDashboard(appId); // Save current app to localStorage
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
    cardBase: isDark ? 
      "bg-[#0F1217]  text-[var(--color-card-text)]":"bg-white  text-[var(--color-card-text)]",
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
    <div className={`dashboard flex mb-16 md:mb-0  w-full ${tokens.rootClass}`}>
        <DashboardSidebar
          apps={dashboardApps}
          activeAppId={activeApp.id}
          onSelectApp={handleSelectApp}
          navigationItems={navigationItems}
          activeNavId={activeNavId}
          onSelectNav={handleSelectNav}
          tokens={tokens}
          isOpen={sidebarOpen}
          onToggle={() => setSidebarOpen(!sidebarOpen)}
        />

        <section className={`flex min-h-screen flex-1 flex-col rounded-[20px] mx-3  md:mx-2 my-3 sm:my-6 md:my-6 overflow-hidden transition-all duration-300 ${isDark ? "bg-[#13181E]" :"bg-[#F8F8F8]"}`} >
        <div className="flex flex-col gap-4 px-2 sm:px-4 md:px-6 py-3 text-start overflow-x-hidden">
          <DashboardHeader
            tokens={tokens}
            activeApp={activeApp}
            activeNavigationLabel={orderMatch ? t("header.order") : activeNavigationItem ? t(`navigation.${activeNavigationItem.id}`) : undefined}
            onToggleTheme={handleToggleTheme}
            onCartClick={() => navigate("/dashboard/order")}
            onProfileClick={() => handleSelectNav("settings")}
            onSidebarToggle={() => setSidebarOpen(!sidebarOpen)}
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
                onNavigateToMarketplace={() => handleSelectNav("marketplace")}
                onGoToSupport={() => handleSelectNav("support")}
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
            proposalsMatch ? (
              (() => {
                const projectId = proposalsMatch.params.projectId;
                const project = {
                  id: projectId || "proj-1",
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
                  budget: "5,000 EGP",
                  tasks: { completed: 8, total: 10 },
                  type: "Mobile",
                  lastUpdate: "2 days ago"
                };
                return (
                  <ProposalsView
                    project={project}
                    tokens={tokens}
                  />
                );
              })()
            ) : projectDetailsMatch ? (
              <ProjectDetailsView
                projectId={projectDetailsMatch.params.projectId || ""}
                tokens={tokens}
                onBack={() => navigate("/dashboard/projects")}
                onManage={() => {
                  // Handle manage
                }}
              />
            ) : taskDetailMatch ? (
              <TaskDetailView
                taskId={taskDetailMatch.params.taskId || "1"}
                tokens={tokens}
                onBack={() => navigate("/dashboard/projects")}
              />
            ) : (
              <ProjectsView
                tokens={tokens}
                onAddProject={() => {
                  // Handle add project
                }}
                onViewDetails={(projectId, projectData) => {
                  navigate(`/dashboard/projects/${projectId}`, { state: { project: projectData } });
                }}
                onManage={() => {
                  // Handle manage
                }}
              />
            )
          ) : activeNavId === "billing" ? (
            <BillingView tokens={tokens} activeAppId={activeApp.id} />
          ) : activeNavId === "applications" && activeApp.id === "app" ? (
            <ApplicationsView
              tokens={tokens}
              onOpenMarketplace={() => handleSelectNav("marketplace")}
            />
          ) : activeNavId === "marketplace" && activeApp.id === "app" ? (
            marketplaceBundleDetailMatch ? (
              <BundleAppsView tokens={tokens} />
            ) : marketplaceBundleMatch ? (
              <BundleSelectionView tokens={tokens} />
            ) : marketplaceDetailMatch ? (() => {
              const itemId = marketplaceDetailMatch.params.itemId;
              // Find the base item (remove suffix like -1, -2, etc.)
              const baseId = itemId?.replace(/-\d+$/, "") || itemId;
              const selectedItem = marketplaceItems.find((item: MarketplaceItem) => item.id === baseId || item.id === itemId);
              
              if (!selectedItem) {
                return (
                  <div className={`${tokens.cardBase} rounded-[20px] p-10`}>
                    <h2 className="text-2xl font-semibold">{t("dashboard.messages.itemNotFound", { ns: "landing" })}</h2>
                    <p className={`mt-3 text-sm ${tokens.subtleText}`}>
                      {t("dashboard.messages.itemDoesNotExist", { ns: "landing" })}
                    </p>
                  </div>
                );
              }

              return (
                <MarketplaceDetailView
                  item={selectedItem}
                  tokens={tokens}
                  onBack={() => navigate("/dashboard/marketplace")}
                />
              );
            })() : (
              <MarketplaceView
                tokens={tokens}
                onItemClick={(itemId) => navigate(`/dashboard/marketplace/${itemId}`)}
              />
            )
          ) : activeNavId === "meetings" && activeApp.id === "software" ? (
            <MeetingsView tokens={tokens} />
          ) : activeNavId === "products" && activeApp.id === "software" ? (
            productDetailsMatch ? (
              <ProductDetailsView
                productId={productDetailsMatch.params.productId ?? ""}
                tokens={tokens}
                onBack={() => navigate("/dashboard/products")}
              />
            ) : (
              <ProductsView tokens={tokens} />
            )
          ) : activeNavId === "settings" ? (
            <GeneralSettingsView 
              tokens={tokens}
              primaryColor={activeApp.id === "software" ? "#071FD7" : activeApp.id === "app" ? "#0F6773" : "#584ABC"}
              buttonBackgroundColor={activeApp.id === "software" ? "#E6E9FB" : activeApp.id === "app" ? "#E7F0F1" : "#EEEDF8"}
            />
          ) : activeNavId === "support" ? (
            <SupportView 
              tokens={tokens}
              primaryColor={activeApp.id === "software" ? "#071FD7" : activeApp.id === "app" ? "#0F6773" : "#584ABC"}
            />
          ) : (
            <div className={`${tokens.cardBase} rounded-[20px] p-10`}>
              <h2 className="text-2xl font-semibold">
                {activeNavigationItem?.label ?? t("dashboard.overview.comingSoon", { ns: "landing" })}
              </h2>
              <p className={`mt-3 text-sm ${tokens.subtleText}`}>
                {t("dashboard.overview.underConstruction", { ns: "landing" })}
              </p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};



