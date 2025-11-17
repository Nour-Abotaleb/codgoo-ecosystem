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
      `${tokens.cardBase} flex items-center gap-2 rounded-full px-5 py-2 backdrop-blur`,
    [tokens.cardBase]
  );

  const searchFieldClass = tokens.isDark
    ? "bg-[var(--color-search-bg)] text-[color:var(--color-search-text)] placeholder:text-[color:var(--color-search-placeholder)]"
    : "bg-[#F4F7FE] text-[color:var(--color-search-text)] placeholder:text-[color:var(--color-search-placeholder)]";

  const primaryColor = activeApp.id === "software" 
    ? "#071FD7" 
    : activeApp.id === "app"
    ? "#0F6773"
    : "#584ABC";
  const primaryBgColor = activeApp.id === "software" 
    ? "#EEEDF8" 
    : activeApp.id === "app"
    ? "#E7F0F1"
    : "#EEEDF8";

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
        return baseClass;
      }
      return `${baseClass} hover:opacity-90`;
    }
  };

  const getIconButtonStyle = (iconId: ActiveIcon) => {
    const isActive = activeIcon === iconId;
    if (!tokens.isDark && isActive) {
      return { backgroundColor: primaryBgColor };
    }
    return {};
  };

  const getIconColorClass = (iconId: ActiveIcon) => {
    const isActive = activeIcon === iconId;
    
    if (tokens.isDark) {
      return "text-white";
    } else {
      if (isActive) {
        return "";
      }
      return "text-[#A3AED0]";
    }
  };

  const pageLabel = activeNavigationLabel ?? activeApp.name;

  return (
    <header className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
      <div>
        <h1
          className={`text-2xl font-semibold md:text-3xl ${
            tokens.isDark ? "" : ""
          }`}
          style={tokens.isDark ? {} : { color: primaryColor }}
        >
          {pageLabel}
        </h1>
      </div>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
        <div className={actionBarClass}>
          <div className={`flex h-10.5 flex-1 items-center gap-3 rounded-full px-4 ${searchFieldClass}`}>
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
            style={getIconButtonStyle("notification")}
            aria-label="Notifications"
          >
            <NotificationIcon 
              className={`h-5 w-5 ${getIconColorClass("notification")}`}
              style={!tokens.isDark && activeIcon === "notification" ? { color: primaryColor } : {}}
            />
          </button>

          <button
            type="button"
            onClick={() => {
              setActiveIcon(activeIcon === "theme" ? null : "theme");
              onToggleTheme();
            }}
            className={getIconButtonClass("theme")}
            style={getIconButtonStyle("theme")}
            aria-label="Toggle theme"
          >
            <DarkModeIcon 
              className={`h-5 w-5 ${getIconColorClass("theme")}`}
              style={!tokens.isDark && activeIcon === "theme" ? { color: primaryColor } : {}}
            />
          </button>

          <button
            type="button"
            onClick={() => {
              setActiveIcon(activeIcon === "cart" ? null : "cart");
              onCartClick?.();
            }}
            className={getIconButtonClass("cart")}
            style={getIconButtonStyle("cart")}
            aria-label="Cart"
          >
            <CartIcon 
              className={`h-5 w-5 ${getIconColorClass("cart")}`}
              style={!tokens.isDark && activeIcon === "cart" ? { color: primaryColor } : {}}
            />
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



