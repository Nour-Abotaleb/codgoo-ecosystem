import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { i18n } from "@shared/config/i18n";

import {
  BillingIcon,
  DashboardIcon,
  DomainsIcon,
  DotsSwitcher,
  HostIcon,
  ServerIcon,
  WebsitesIcon,
  SettingsIcon,
  SupportIcon,
  Logout,
  CalendarIcon,
  ApplicationIcon,
  MarketplaceIcon,
  ProjectIcon,
  ProductIcon,
  CheckIcon
} from "@utilities/icons";

import cloudNavBackground from "@assets/images/cloud/nav-bg.svg";
import softwareNavBackground from "@assets/images/software/nav-bg.svg";
import appNavBackground from "@assets/images/app/nav-bg.svg";
import { dashboardAppLogos, dashboardAppLogosLight } from "../constants";
import type {
  DashboardApp,
  DashboardAppId,
  DashboardNavItem,
  DashboardTokens
} from "../types";
import { PlaceholderIcon } from "./PlaceholderIcon";
import { getDefaultDashboard, setDefaultDashboard } from "../utils/dashboardPreferences";

type DashboardSidebarProps = {
  readonly apps: readonly DashboardApp[];
  readonly activeAppId: DashboardAppId;
  readonly onSelectApp: (id: DashboardAppId) => void;
  readonly navigationItems: readonly DashboardNavItem[];
  readonly activeNavId: string;
  readonly onSelectNav: (id: string) => void;
  readonly tokens: DashboardTokens;
};

export const DashboardSidebar = ({
  apps,
  activeAppId,
  onSelectApp,
  navigationItems,
  activeNavId,
  onSelectNav,
  tokens
}: DashboardSidebarProps) => {
  const [isSwitcherOpen, setSwitcherOpen] = useState(false);
  const [defaultDashboard, setDefaultDashboardState] = useState<DashboardAppId>(() => getDefaultDashboard());
  const switcherRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isSwitcherOpen) {
      return undefined;
    }

    const handleClick = (event: MouseEvent) => {
      if (
        switcherRef.current &&
        event.target instanceof Node &&
        !switcherRef.current.contains(event.target)
      ) {
        setSwitcherOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [isSwitcherOpen]);

  const popoverBaseClass =
    "bg-[var(--color-popover-bg)] text-[color:var(--color-popover-text)] ring-[color:var(--color-popover-ring)]";
  const popoverActiveClass =
    "bg-[var(--color-popover-active-bg)] text-[color:var(--color-popover-active-text)]";
  const popoverIdleClass =
    "text-[color:var(--color-popover-idle-text)] hover:bg-[var(--color-popover-hover-bg)]";

  const activeLogo = tokens.isDark
    ? dashboardAppLogos[activeAppId] ?? dashboardAppLogos.cloud
    : dashboardAppLogosLight[activeAppId] ?? dashboardAppLogos[activeAppId] ?? dashboardAppLogos.cloud;
  const iconMap = {
    dashboard: DashboardIcon,
    host: HostIcon,
    server: ServerIcon,
    domains: DomainsIcon,
    websites: WebsitesIcon,
    billing: BillingIcon,
    settings: SettingsIcon,
    projects: ProjectIcon,
    products: ProductIcon,
    meetings: CalendarIcon,
    applications: ApplicationIcon,
    marketplace: MarketplaceIcon
  };

  const navActiveColorHex = activeAppId === "software" 
    ? (tokens.isDark ? "#FEFEFE" : "#071FD7")
    : activeAppId === "app"
    ? (tokens.isDark ? "#FEFEFE" : "#0F6773")
    : (tokens.isDark ? "#FEFEFE" : "#584ABC");
  const navIdleColorHex = tokens.isDark ? "#C6CCDF" : "#A3AED0";

  const navActiveColorClass = `text-[${navActiveColorHex}]`;
  const navIdleColorClass = `text-[${navIdleColorHex}]`;

  const hoverColorClass = activeAppId === "software"
    ? (tokens.isDark ? "text-[#FEFEFE]" : "text-[#071FD7]")
    : activeAppId === "app"
    ? (tokens.isDark ? "text-[#FEFEFE]" : "text-[#0F6773]")
    : (tokens.isDark ? "text-[#FEFEFE]" : "text-[#584ABC]");

  const navBackground = activeAppId === "software" 
    ? softwareNavBackground 
    : activeAppId === "app"
    ? appNavBackground
    : cloudNavBackground;

  const { t } = useTranslation("dashboard");
  const isRTL = i18n.language === "ar";

  return (
    <aside
      className={`dashboard__sidebar fixed inset-y-0 ${isRTL ? "right-0" : "left-0"} z-20 hidden min-h-screen w-64 pe-1 flex-col py-10 lg:flex ${tokens.sidebarClass}`}
    >
      <div className="relative flex justify-center gap-6 border-b border-[color:var(--color-sidebar-divider)] pb-4">
        <img 
          src={activeLogo} 
          alt={`${activeAppId} logo`} 
          className="h-10 w-auto object-contain"
          fetchPriority="high"
        />
        <div ref={switcherRef} className="relative">
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
          {isSwitcherOpen && (
            <div
              className={`absolute ${isRTL ? "right-0" : "left-0"} mt-3 w-64 rounded-xl p-2 shadow-2xl backdrop-blur ${popoverBaseClass}`}
            >
              <ul className="space-y-2">
                {apps.map((app) => {
                  // Map to correct dashboard based on label
                  const targetAppId = app.id === "cloud"
                    ? "cloud"  // "Codgoo App" -> opens cloud dashboard
                    : app.id === "app"
                    ? "software"  // "Codgoo Software" -> opens software dashboard
                    : "app";  // "Codgoo App" -> opens app dashboard
                  
                  const isActive = targetAppId === activeAppId;
                  const isDefault = targetAppId === defaultDashboard;

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
                                ? "/logo-cloud.svg"
                                : app.id === "app"
                                ? "/logo-software.svg"
                                : "/logo-app.svg"
                            }
                            alt={`${app.id} logo`}
                            className="h-6 w-auto object-contain"
                            fetchPriority="high"
                          />
                          <span className="text-sm font-medium">
                            {app.id === "cloud"
                              ? "Codgoo App"
                              : app.id === "app"
                              ? "Codgoo Software"
                              : "Codgoo App"}
                          </span>
                        </button>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setDefaultDashboard(targetAppId);
                            setDefaultDashboardState(targetAppId);
                          }}
                          className={`ml-2 flex items-center justify-center rounded-full p-1.5 transition-colors ${
                            isDefault
                              ? tokens.isDark
                                ? "bg-black text-white"
                                : "bg-black/20 text-white"
                              : tokens.isDark
                              ? "text-white/50 hover:text-white hover:bg-white/10"
                              : "text-[#718EBF] hover:text-white hover:bg-black/20"
                          }`}
                          title="Set as default dashboard"
                        >
                          <CheckIcon className={`h-4 w-4 ${isDefault ? "" : "opacity-50"}`} />
                        </button>
                      </div>
                    </li>
                  );
                })}
              </ul>
            </div>
          )}
        </div>
      </div>

      <nav className={`mt-4 flex flex-col px-2 ${activeAppId === "cloud" ? "mb-34" : activeAppId === "software" ? "mb-47" : "mb-60"}`}>
        {navigationItems.map((item) => {
          const isActive = item.id === activeNavId;
          const Icon = item.icon ? iconMap[item.icon] : undefined;

          const iconColorClass = isActive
            ? navActiveColorClass
            : `${navIdleColorClass} group-hover:${hoverColorClass}`;
          const labelColorClass = isActive
            ? `font-medium ${navActiveColorClass}`
            : `font-light ${navIdleColorClass} group-hover:${hoverColorClass}`;

          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onSelectNav(item.id)}
              aria-current={isActive ? "page" : undefined}
              className="group relative flex cursor-pointer items-center gap-2 overflow-hidden rounded-xl px-2 py-1.5 text-lg font-semibold transition-colors"
            >
              {isActive && (
                <span className="absolute inset-0">
                  <img src={navBackground} alt="" className="h-full w-full object-cover" />
                </span>
              )}
              <span className="relative flex h-10 w-10 items-center justify-center">
                {Icon ? (
                  <Icon className={`h-5 w-5 transition-colors ${iconColorClass}`} />
                ) : (
                  <PlaceholderIcon
                    label={t(`navigation.${item.id}`)}
                    isActive={isActive}
                    tokens={tokens}
                    activeClassName={`${navActiveColorClass} bg-transparent`}
                    idleClassName={`${navIdleColorClass} bg-transparent group-hover:${hoverColorClass}`}
                  />
                )}
              </span>
              <span className={`relative transition-colors ${labelColorClass}`}>
                {t(`navigation.${item.id}`)}
              </span>
            </button>
          );
        })}
      </nav>

      <div className="mt-auto flex flex-row items-center justify-between border-t border-[color:var(--color-sidebar-divider)] px-2 pt-6 pb-2">
        <button
          type="button"
          className={`group flex cursor-pointer items-center justify-center rounded-full w-11 h-11 transition-colors ${tokens.isDark ? "bg-white" : "bg-[#FEEFEE]"}`}
        >
          <Logout className={`h-5 w-5 transition-colors opacity-70 ${navIdleColorClass} group-hover:${hoverColorClass}`} />
        </button>
        <button
          type="button"
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
            Support
          </span>
        </button>
      </div>
    </aside>
  );
};


