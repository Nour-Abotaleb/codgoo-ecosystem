import { useEffect, useRef, useState } from "react";

import {
  BillingIcon,
  DashboardIcon,
  DomainsIcon,
  DotsSwitcher,
  HostIcon,
  ServerIcon,
  WebsitesIcon,
  SettingsIcon
} from "@utilities/icons";

import navBackground from "@assets/images/cloud/nav-bg.svg";
import { dashboardAppLogos, dashboardAppLogosLight } from "../constants";
import type {
  DashboardApp,
  DashboardAppId,
  DashboardNavItem,
  DashboardTokens
} from "../types";
import { PlaceholderIcon } from "./PlaceholderIcon";

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
  const getInitials = (name: string) =>
    name
      .split(" ")
      .filter(Boolean)
      .map((part) => part[0]?.toUpperCase() ?? "")
      .join("")
      .slice(0, 2) || name.slice(0, 2).toUpperCase();

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
    settings: SettingsIcon
  };

  const navActiveColorHex = tokens.isDark ? "#FEFEFE" : "#584ABC";
  const navIdleColorHex = tokens.isDark ? "#C6CCDF" : "#A3AED0";

  const navActiveColorClass = `text-[${navActiveColorHex}]`;
  const navIdleColorClass = `text-[${navIdleColorHex}]`;

  return (
    <aside
      className={`dashboard__sidebar fixed inset-y-0 left-0 z-20 hidden min-h-screen w-64 pe-1 flex-col py-14 lg:flex ${tokens.sidebarClass}`}
    >
      <div className="relative flex justify-center gap-6 border-b border-[color:var(--color-sidebar-divider)] pb-4">
        <img src={activeLogo} alt={`${activeAppId} logo`} className="h-10 md:h-auto w-auto" />
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
                : "text-[#584ABC]"
            }`}
          >
            <DotsSwitcher className="h-6 w-6 cursor-pointer" />
          </button>
          {isSwitcherOpen && (
            <div
              className={`absolute left-0 mt-3 w-64 rounded-xl p-2 shadow-2xl ring-1 backdrop-blur ${popoverBaseClass}`}
            >
              <ul className="space-y-1">
                {apps.map((app) => {
                  const isActive = app.id === activeAppId;

                  return (
                    <li key={app.id}>
                      <button
                        type="button"
                        onClick={() => {
                          onSelectApp(app.id);
                          setSwitcherOpen(false);
                        }}
                        className={`flex w-full items-center gap-3 rounded-2xl px-3 py-3 text-left transition ${
                          isActive ? popoverActiveClass : popoverIdleClass
                        }`}
                      >
                        <div
                          className={`flex h-9 w-9 items-center justify-center rounded-2xl ${tokens.surfaceMuted}`}
                        >
                          <span className="text-xs font-semibold uppercase tracking-wide">
                            {getInitials(app.name)}
                          </span>
                        </div>
                        <span className="text-sm font-semibold">{app.name}</span>
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>
          )}
        </div>
      </div>

      <nav className="mt-12 flex flex-col px-2">
        {navigationItems.map((item) => {
          const isActive = item.id === activeNavId;
          const Icon = item.icon ? iconMap[item.icon] : undefined;

          const hoverColorClass = tokens.isDark ? "text-[#FEFEFE]" : "text-[#584ABC]";
          const iconColorClass = isActive
            ? navActiveColorClass
            : `${navIdleColorClass} group-hover:${hoverColorClass}`;
          const labelColorClass = isActive
            ? `font-bold ${navActiveColorClass}`
            : `font-light ${navIdleColorClass} group-hover:${hoverColorClass}`;

          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onSelectNav(item.id)}
              aria-current={isActive ? "page" : undefined}
              className="group relative flex cursor-pointer items-center gap-2 overflow-hidden rounded-xl px-2 py-3 text-lg font-semibold transition-colors"
            >
              {isActive && (
                <span className="absolute inset-0">
                  <img src={navBackground} alt="" className="h-full w-full" />
                </span>
              )}
              <span className="relative flex h-10 w-10 items-center justify-center">
                {Icon ? (
                  <Icon className={`h-5 w-5 transition-colors ${iconColorClass}`} />
                ) : (
                  <PlaceholderIcon
                    label={item.label}
                    isActive={isActive}
                    tokens={tokens}
                    activeClassName={`${navActiveColorClass} bg-transparent`}
                    idleClassName={`${navIdleColorClass} bg-transparent group-hover:${hoverColorClass}`}
                  />
                )}
              </span>
              <span className={`relative transition-colors ${labelColorClass}`}>
                {item.label}
              </span>
            </button>
          );
        })}
      </nav>
    </aside>
  );
};


