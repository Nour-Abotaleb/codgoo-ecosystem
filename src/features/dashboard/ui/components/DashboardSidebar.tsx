import { useEffect, useRef, useState } from "react";

import {
  BillingIcon,
  DashboardIcon,
  DomainsIcon,
  DotsSwitcher,
  HostIcon,
  ServerIcon,
  WebsitesIcon
} from "@utilities/icons";

import navBackground from "@assets/images/cloud/nav-bg.svg";
import { dashboardAppLogos } from "../constants";
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
  readonly tokens: DashboardTokens;
};

export const DashboardSidebar = ({
  apps,
  activeAppId,
  onSelectApp,
  navigationItems,
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

  const popoverBaseClass = tokens.isDark
    ? "bg-[#10122b] text-white ring-white/10"
    : "bg-white/95 text-[#0f1035] ring-[#d8d6ff]";
  const popoverActiveClass = tokens.isDark
    ? "bg-white/10 text-white"
    : "bg-[#ede8ff] text-[#2f276c]";
  const popoverIdleClass = tokens.isDark
    ? "text-white/70 hover:bg-white/5"
    : "text-[#56608f] hover:bg-[#f7f4ff]";
  const getInitials = (name: string) =>
    name
      .split(" ")
      .filter(Boolean)
      .map((part) => part[0]?.toUpperCase() ?? "")
      .join("")
      .slice(0, 2) || name.slice(0, 2).toUpperCase();

  const activeLogo = dashboardAppLogos[activeAppId] ?? dashboardAppLogos.cloud;
  const iconMap = {
    dashboard: DashboardIcon,
    host: HostIcon,
    server: ServerIcon,
    domains: DomainsIcon,
    websites: WebsitesIcon,
    billing: BillingIcon
  };

  return (
    <aside
      className={`dashboard__sidebar fixed inset-y-0 left-0 z-20 hidden min-h-screen w-72 flex-col border-r py-14 lg:flex ${tokens.sidebarClass}`}
    >
      <div className="relative flex justify-center gap-6 border-b border-[#232637] pb-4">
        <img src={activeLogo} alt={`${activeAppId} logo`} className="h-10 md:h-auto w-auto" />
        <div ref={switcherRef} className="relative">
          <button
            type="button"
            aria-haspopup="true"
            aria-expanded={isSwitcherOpen}
            onClick={() => setSwitcherOpen((prev) => !prev)}
              className={`mt-1 md:mt-2 inline-flex ${activeAppId === "app" ? "text-black" : "text-white/80"}`}
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

      <nav className="mt-12 flex flex-col px-4">
        {navigationItems.map((item, index) => {
          const isActive = index === 0;
          const Icon = item.icon ? iconMap[item.icon] : undefined;

          return (
            <button
              key={item.id}
              type="button"
              className={`relative flex items-center gap-4 overflow-hidden rounded-xl px-4 py-3 text-lg font-semibold text-white transition ${
                isActive ? "" : "opacity-85 hover:opacity-100"
              }`}
            >
              {isActive && (
                <span className="absolute inset-0">
                  <img src={navBackground} alt="" className="h-full w-full" />
                </span>
              )}
              <span className="relative flex h-10 w-10 items-center justify-center">
                {Icon ? (
                  <Icon className="h-5 w-5" />
                ) : (
                  <PlaceholderIcon label={item.label} isActive={isActive} tokens={tokens} />
                )}
              </span>
              <span className="relative">{item.label}</span>
            </button>
          );
        })}
      </nav>
    </aside>
  );
};


