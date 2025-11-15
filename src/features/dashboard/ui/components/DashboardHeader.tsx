import { useState, useMemo } from "react";

import userAvatar from "@assets/images/user.png";
import {
  CartIcon,
  DarkModeIcon,
  NotificationIcon,
  SearchIcon
} from "@utilities/icons";

import type { DashboardApp, DashboardTokens } from "../types";

type DashboardHeaderProps = {
  readonly tokens: DashboardTokens;
  readonly activeApp: DashboardApp;
  readonly activeNavigationLabel?: string;
  readonly subtitle?: string;
  readonly onToggleTheme: () => void;
  readonly onCartClick?: () => void;
};

type ActiveIcon = "notification" | "theme" | "cart" | null;

export const DashboardHeader = ({
  tokens,
  activeApp,
  activeNavigationLabel,
  // subtitle,
  onToggleTheme,
  onCartClick
}: DashboardHeaderProps) => {
  const [activeIcon, setActiveIcon] = useState<ActiveIcon>(null);
  const actionBarClass = useMemo(
    () =>
      `${tokens.cardBase} flex items-center gap-3 rounded-full px-5 py-2 backdrop-blur`,
    [tokens.cardBase]
  );

  const searchFieldClass = tokens.isDark
    ? "bg-[var(--color-search-bg)] text-[color:var(--color-search-text)] placeholder:text-[color:var(--color-search-placeholder)]"
    : "bg-[#F4F7FE] text-[color:var(--color-search-text)] placeholder:text-[color:var(--color-search-placeholder)]";

  const getIconButtonClass = (iconId: ActiveIcon) => {
    const isActive = activeIcon === iconId;
    const baseClass = "flex h-9 w-9 items-center justify-center rounded-full transition-colors duration-200";
    
    if (tokens.isDark) {
      if (isActive) {
        return `${baseClass} bg-[var(--color-icon-surface)] text-white`;
      }
      return `${baseClass} hover:opacity-80`;
    } else {
      if (isActive) {
        return `${baseClass} bg-[#EEEDF8]`;
      }
      return `${baseClass} hover:opacity-90`;
    }
  };

  const getIconColorClass = () => {
    if (tokens.isDark) {
      return "text-white";
    } else {
      return "text-[#584ABC]";
    }
  };

  const pageLabel = activeNavigationLabel ?? activeApp.name;

  return (
    <header className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
      <div>
        <h1
          className={`text-3xl font-semibold md:text-4xl ${
            tokens.isDark ? "" : "text-[#584ABC]"
          }`}
        >
          {pageLabel}
        </h1>
      </div>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
        <div className={actionBarClass}>
          <div className={`flex h-11 flex-1 items-center gap-3 rounded-full px-4 ${searchFieldClass}`}>
            <SearchIcon className="h-4 w-4 opacity-70" />
            <input
              type="search"
              placeholder="Search"
              className="flex-1 bg-transparent text-sm focus:outline-none"
            />
          </div>

          <button
            type="button"
            onClick={() => setActiveIcon(activeIcon === "notification" ? null : "notification")}
            className={getIconButtonClass("notification")}
            aria-label="Notifications"
          >
            <NotificationIcon className={`h-5 w-5 ${getIconColorClass()}`} />
          </button>

          <button
            type="button"
            onClick={() => {
              setActiveIcon(activeIcon === "theme" ? null : "theme");
              onToggleTheme();
            }}
            className={getIconButtonClass("theme")}
            aria-label="Toggle theme"
          >
            <DarkModeIcon className={`h-5 w-5 ${getIconColorClass()}`} />
          </button>

          <button
            type="button"
            onClick={() => {
              setActiveIcon(activeIcon === "cart" ? null : "cart");
              onCartClick?.();
            }}
            className={getIconButtonClass("cart")}
            aria-label="Cart"
          >
            <CartIcon className={`h-5 w-5 ${getIconColorClass()}`} />
          </button>

          <img
            src={userAvatar}
            alt="User avatar"
            className="h-10 w-10 rounded-full object-cover"
          />
        </div>
      </div>
    </header>
  );
};



