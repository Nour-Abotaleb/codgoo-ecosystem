import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
// import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { i18n } from "@shared/config/i18n";

import { useAuth } from "@features/auth";

import {
  BillingIcon,
  DashboardIcon,
  DomainsIconSideBar,
  DotsSwitcher,
  HostIconSideBar,
  ServerIcon,
  WebsitesIcon,
  SettingsIconSideBar,
  SupportIcon,
  Logout,
  CalendarIcon,
  MarketplaceIcon,
  ProjectIcon,
  ProductIcon,
  CheckIcon,
  AppHomeIcon,
  AppApplicationsIcon,
  AppMarketplaceIcon,
  AppBillingIcon,
  AppSettingsIcon
} from "@utilities/icons";

import { dashboardAppLogos, dashboardAppLogosLight } from "../constants";
import type {
  DashboardApp,
  DashboardAppId,
  DashboardNavItem,
  DashboardTokens
} from "../types";
import { PlaceholderIcon } from "./PlaceholderIcon";
import { getDefaultDashboard } from "../utils/dashboardPreferences";

// Import logos for Electron compatibility
import logoCloud from "/logo-cloud.svg";
import logoSoftware from "/logo-software.svg";
import logoApp from "/logo-app.svg";

type DashboardSidebarProps = {
  readonly apps: readonly DashboardApp[];
  readonly activeAppId: DashboardAppId;
  readonly onSelectApp: (id: DashboardAppId) => void;
  readonly navigationItems: readonly DashboardNavItem[];
  readonly activeNavId: string;
  readonly onSelectNav: (id: string) => void;
  readonly tokens: DashboardTokens;
  readonly isOpen?: boolean;
  readonly onToggle?: () => void;
};

export const DashboardSidebar = ({
  apps,
  activeAppId,
  onSelectApp,
  navigationItems,
  activeNavId,
  onSelectNav,
  tokens,
  isOpen = false,
  onToggle
}: DashboardSidebarProps) => {
  // const navigate = useNavigate();
  const { logout } = useAuth();
  const [isSwitcherOpen, setSwitcherOpen] = useState(false);
  const [_defaultDashboard, setDefaultDashboardState] = useState<DashboardAppId>(() => getDefaultDashboard());
  const switcherRef = useRef<HTMLDivElement>(null);
  const popoverRef = useRef<HTMLDivElement>(null);
  const [popoverPosition, setPopoverPosition] = useState({ top: 0, left: 0 });
  const { t } = useTranslation(["dashboard", "landing"]);
  const isRTL = i18n.language === "ar";

  // Sync with localStorage when switcher opens and calculate popover position
  useEffect(() => {
    if (isSwitcherOpen) {
      const currentDefault = getDefaultDashboard();
      setDefaultDashboardState(currentDefault);
      
      // Calculate popover position based on button position
      if (switcherRef.current) {
        const rect = switcherRef.current.getBoundingClientRect();
        setPopoverPosition({
          top: rect.bottom + 12, // 12px = mt-3 equivalent
          left: isRTL ? rect.right - 256 : rect.left // 256px = w-64 equivalent
        });
      }
    }
  }, [isSwitcherOpen, isRTL]);

  useEffect(() => {
    if (!isSwitcherOpen) {
      return undefined;
    }

    const handleClick = (event: MouseEvent) => {
      if (
        event.target instanceof Node &&
        switcherRef.current &&
        !switcherRef.current.contains(event.target) &&
        popoverRef.current &&
        !popoverRef.current.contains(event.target)
      ) {
        setSwitcherOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [isSwitcherOpen]);

  const popoverBaseClass =
    "bg-[var(--color-popover-bg)]  text-[color:var(--color-popover-text)] ring-[color:var(--color-popover-ring)]";
  const popoverActiveClass =
    "bg-[var(--color-popover-active-bg)] text-[color:var(--color-popover-active-text)]";
  const popoverIdleClass =
    "text-[color:var(--color-popover-idle-text)] hover:bg-[var(--color-popover-hover-bg)]";

  const activeLogo = tokens.isDark
    ? dashboardAppLogos[activeAppId] ?? dashboardAppLogos.cloud
    : dashboardAppLogosLight[activeAppId] ?? dashboardAppLogos[activeAppId] ?? dashboardAppLogos.cloud;
  
  // Use App-specific icons when activeAppId is "app"
  const iconMap = activeAppId === "app" ? {
    dashboard: AppHomeIcon,
    host: HostIconSideBar,
    server: ServerIcon,
    domains: DomainsIconSideBar,
    websites: WebsitesIcon,
    billing: AppBillingIcon,
    settings: AppSettingsIcon,
    projects: ProjectIcon,
    products: ProductIcon,
    meetings: CalendarIcon,
    applications: AppApplicationsIcon,
    marketplace: AppMarketplaceIcon
  } : {
    dashboard: DashboardIcon,
    host: HostIconSideBar,
    server: ServerIcon,
    domains: DomainsIconSideBar,
    websites: WebsitesIcon,
    billing: BillingIcon,
    settings: SettingsIconSideBar,
    projects: ProjectIcon,
    products: ProductIcon,
    meetings: CalendarIcon,
    marketplace: MarketplaceIcon
  };

  const navActiveColorHex = tokens.isDark 
    ? "#FFFFFF" 
    : activeAppId === "software" 
    ? "#071FD7" 
    : activeAppId === "app"
    ? "#0F6773"
    : "#584ABC";
  const navIdleColorHex = tokens.isDark ? "#FFFFFF" : "#504343";

  const navActiveColorClass = `text-[${navActiveColorHex}]`;
  const navIdleColorClass = `text-[${navIdleColorHex}]`;

  const hoverColorClass = tokens.isDark ? "text-[#FFFFFF]" : "text-[#504343]";

  // const navBackground = activeAppId === "software" 
  //   ? softwareNavBackground 
  //   : activeAppId === "app"
  //   ? appNavBackground
  //   : cloudNavBackground;

  return (
    <>
      {/* Overlay for mobile when sidebar is open */}
      <div
        className={`fixed inset-0 z-[9998] bg-black/50 transition-opacity duration-300 xl:hidden ${
          isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        onClick={onToggle}
      />

      {/* Sidebar */}
      <aside
        className={`dashboard__sidebar hidden lg:flex fixed inset-y-0 md:ps-4 ${isRTL ? "right-0" : "left-0"} z-[9999] h-screen w-64 pe-1 flex-col pt-6 transition-transform duration-300 ${tokens.sidebarClass} ${
          isOpen ? "translate-x-0" : isRTL ? "translate-x-full" : "-translate-x-full"
        } lg:translate-x-0 lg:relative lg:inset-auto lg:z-auto`}
        style={{
          display: isOpen ? "flex" : "none",
        }}
      >
        <style>{`
          @media (min-width: 1024px) {
            .dashboard__sidebar {
              display: flex !important;
              position: relative !important;
              inset: auto !important;
              z-index: auto !important;
            }
          }
        `}</style>
        
        {/* Top Section: Logo and Items */}
        <div className="flex-1 flex flex-col overflow-y-auto">
      <div className={`relative flex justify-center gap-6 mx-2 rounded-[20px] p-4 hidden xl:flex ${
                tokens.isDark ? 'bg-transparent' : 'bg-[#F9FBFD]'
              }`}>
        <img 
          src={activeLogo} 
          alt={`${activeAppId} logo`} 
          className="h-10 w-auto object-contain"
          fetchPriority="high"
        />
        <div ref={switcherRef} className="relative z-[99999]">
          <button
            type="button"
            aria-haspopup="true"
            aria-expanded={isSwitcherOpen}
            onClick={() => setSwitcherOpen((prev) => !prev)}
            className={`mt-1 inline-flex md:mt-2 ${
              tokens.isDark
                ? activeAppId === "app"
                  ? "text-[color:var(--color-switcher-icon-active)]"
                  : "text-[color:var(--color-switcher-icon-inactive)]"
                : ""
            }`}
            style={!tokens.isDark ? { 
              color: activeAppId === "software" 
                ? "#071FD7" 
                : activeAppId === "app"
                ? "#0F6773"
                : "#584ABC" 
            } : {}}
          >
            <DotsSwitcher className="h-6 w-6 cursor-pointer" />
          </button>
          {isSwitcherOpen && createPortal(
            <div
              ref={popoverRef}
              className={`fixed z-[99999] w-64 rounded-xl p-2 shadow-xl backdrop-blur ${popoverBaseClass}`}
              style={{
                top: `${popoverPosition.top}px`,
                [isRTL ? "left" : "left"]: `${popoverPosition.left}px`
              }}
            >
              <ul className="space-y-2">
                {apps.map((app) => {
                  // Use the app.id directly as targetAppId since they should match DashboardAppId
                  const targetAppId = app.id;
                  
                  const isActive = targetAppId === activeAppId;
                  // Show check icon for currently active dashboard instead of default
                  const isDefault = isActive;

                  return (
                    <li key={app.id}>
                      <div className={`flex w-full items-center rounded-xl px-3 py-2.5 transition ${
                        isActive ? popoverActiveClass : popoverIdleClass
                      }`}>
                        <button
                          type="button"
                          onClick={() => {
                            onSelectApp(targetAppId);
                            setSwitcherOpen(false);
                          }}
                          className="flex flex-1 items-center gap-2 cursor-pointer"
                        >
                          <img
                            src={
                              app.id === "cloud"
                                ? logoCloud
                                : app.id === "software"
                                ? logoSoftware
                                : logoApp
                            }
                            alt={`${app.id} logo`}
                            className="h-6 w-auto object-contain"
                            fetchPriority="high"
                          />
                          <span className="text-sm font-medium">
                            {t(`dashboard.apps.${app.id}`, { ns: "landing" })}
                          </span>
                        </button>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            // Switch to this dashboard
                            onSelectApp(targetAppId);
                            setSwitcherOpen(false);
                          }}
                          className={`ml-2 flex items-center justify-center rounded-full p-1.5 transition-all ${
                            isDefault
                              ? "bg-black text-white scale-100"
                              : tokens.isDark
                              ? "text-white/30 hover:text-white hover:bg-white/10 scale-90"
                              : "text-gray-400 hover:text-white hover:bg-black/20 scale-90"
                          }`}
                          title={isDefault ? t("dashboard.overview.currentDashboard", { ns: "landing" }) : t("dashboard.overview.switchToDashboard", { ns: "landing" })}
                        >
                          <CheckIcon className={`h-4 w-4 transition-opacity ${isDefault ? "opacity-100" : "opacity-40"}`} />
                        </button>
                      </div>
                    </li>
                  );
                })}
              </ul>
            </div>,
            document.body
          )}
        </div>
      </div>

      {/* Mobile: Horizontal slider for app switcher */}
      <div className="xl:hidden flex flex-wrap items-center justify-between gap-3 mx-2 rounded-[20px]">
        <button
          type="button"
          onClick={() => {
            const currentIndex = apps.findIndex(app => app.id === activeAppId);
            const prevIndex = currentIndex === 0 ? apps.length - 1 : currentIndex - 1;
            onSelectApp(apps[prevIndex].id as DashboardAppId);
          }}
          className={`flex-shrink-0 flex items-center justify-center w-10 h-10 rounded-full transition-all ${
            tokens.isDark ? 'bg-[#1F2937] hover:bg-[#374151]' : 'bg-[#F0F4F8] hover:bg-[#E0E8F0]'
          }`}
          aria-label="Previous app"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        <div className="flex-1 flex items-center justify-center">
          <img
            src={activeLogo}
            alt={`${activeAppId} logo`}
            className="h-12 w-auto object-contain"
            fetchPriority="high"
          />
        </div>

        <button
          type="button"
          onClick={() => {
            const currentIndex = apps.findIndex(app => app.id === activeAppId);
            const nextIndex = currentIndex === apps.length - 1 ? 0 : currentIndex + 1;
            onSelectApp(apps[nextIndex].id as DashboardAppId);
          }}
          className={`flex-shrink-0 flex items-center justify-center w-10 h-10 rounded-full transition-all ${
            tokens.isDark ? 'bg-[#1F2937] hover:bg-[#374151]' : 'bg-[#F0F4F8] hover:bg-[#E0E8F0]'
          }`}
          aria-label="Next app"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
<div className=" border-b border-[color:var(--color-sidebar-divider)] border-b-[1.58px] py-2 mx-2"></div>

      <nav className={`mt-4 grid grid-cols-2 gap-3 px-2 flex-1 content-start ${activeAppId === "cloud" ? "mb-0" : activeAppId === "software" ? "mb-0" : "mb-0"}`}>
        {navigationItems.map((item, index) => {
          const isActive = item.id === activeNavId;
          const Icon = item.icon ? iconMap[item.icon] : undefined;

          // Determine border color based on activeAppId
          const getBorderColor = () => {
            if (!isActive) return {};
            
            if (tokens.isDark) {
              return {
                border: activeAppId === "software" 
                  ? "1.05px solid #071FD7" 
                  : activeAppId === "app"
                  ? "1.05px solid #0F6773"
                  : "1.05px solid #7469C7"
              };
            } else {
              return {
                border: activeAppId === "software" 
                  ? "1.05px solid #071FD7" 
                  : activeAppId === "app"
                  ? "1.05px solid #0F6773"
                  : "1.05px solid #584ABC"
              };
            }
          };

          const iconColorClass = isActive
            ? navActiveColorClass
            : `${navIdleColorClass} group-hover:${hoverColorClass}`;
          const isFirstItem = index === 0;
          const isArabic = i18n.language === "ar";
          const labelColorClass = isActive
            ? `font-medium ${navActiveColorClass} ${isArabic && isFirstItem ? "text-[14px]" : ""}`
            : `font-light ${navIdleColorClass} group-hover:${hoverColorClass} ${isArabic && isFirstItem ? "text-sm" : ""}`;

          return (
            <button
              key={item.id}
              type="button"
              onClick={() => {
                onSelectNav(item.id);
                // Close sidebar on mobile after selection
                if (isOpen && onToggle) {
                  onToggle();
                }
              }}
              aria-current={isActive ? "page" : undefined}
              className={`group relative flex flex-col cursor-pointer items-center justify-center overflow-hidden rounded-[20px] px-4 py-4 text-lg font-semibold transition-[border] duration-200 ease-in-out ${
                tokens.isDark ? 'bg-[#13181E]' : 'bg-[#F9FBFD]'
              }`}
              style={getBorderColor()}
            >
              <span className="relative flex h-10 w-10 items-center justify-center">
                {Icon ? (
                  <Icon className={`h-6 w-6 transition-colors duration-200 ease-in-out ${iconColorClass}`} />
                ) : (
                  <PlaceholderIcon
                    label={t(`dashboard.navigation.${item.id}`, { ns: "landing", defaultValue: item.label })}
                    isActive={isActive}
                    tokens={tokens}
                    activeClassName={`${navActiveColorClass} bg-transparent`}
                    idleClassName={`${navIdleColorClass} bg-transparent group-hover:${hoverColorClass}`}
                  />
                )}
              </span>
              <span className={`relative transition-colors duration-200 ease-in-out text-center ${labelColorClass}`}>
                {t(`dashboard.navigation.${item.id}`, { ns: "landing", defaultValue: item.label })}
              </span>
            </button>
          );
        })}
      </nav>
        </div>

        {/* Bottom Section: Logout and Support */}
        <div className="flex flex-row items-center justify-between px-2 pb-4 flex-shrink-0">
          <button
            type="button"
            onClick={async () => {
              try {
                await logout();
              } catch (error) {
                console.error("Logout failed:", error);
              } finally {
                // Always clear and redirect, even if logout API fails
                // Use window.location for a hard redirect to clear everything
                window.location.href = "/login";
              }
            }}
            className={`group flex cursor-pointer items-center justify-center rounded-full w-11 h-11 transition-colors ${tokens.isDark ? "bg-white" : "bg-[#FEEFEE]"}`}
          >
            <Logout className={`h-5 w-5 transition-colors opacity-70 ${navIdleColorClass} group-hover:${hoverColorClass}`} />
          </button>
          <button
            type="button"
            onClick={() => onSelectNav("support")}
            className="group flex px-12 cursor-pointer items-center justify-center gap-1 rounded-full py-2.5 text-base font-semibold transition-colors"
            style={{ 
              backgroundColor: activeAppId === "software" 
                ? "#071FD7" 
                : activeAppId === "app"
                ? "#0F6773"
                : "#7469C7"
            }}
          >
            <span className="relative flex items-center justify-center">
              <SupportIcon className="h-5 w-5 transition-colors text-white" />
            </span>
            <span className="relative transition-colors font-light text-white">
              {t("dashboard.overview.support", { ns: "landing" })}
            </span>
          </button>
        </div>
      </aside>
    </>
  );
};


