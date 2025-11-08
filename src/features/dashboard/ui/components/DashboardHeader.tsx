import { useMemo } from "react";

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
  readonly subtitle?: string;
  readonly onToggleTheme: () => void;
};

export const DashboardHeader = ({
  tokens,
  activeApp,
  subtitle,
  onToggleTheme
}: DashboardHeaderProps) => {
  const actionBarClass = useMemo(
    () =>
      `${tokens.cardBase} flex items-center gap-1 rounded-full px-5 py-2 backdrop-blur`,
    [tokens.cardBase]
  );

  const searchFieldClass = useMemo(
    () =>
      tokens.isDark
        ? "bg-white/8 text-white placeholder:text-[#6B73A0]"
        : "bg-white/60 text-[#22274a] placeholder:text-[#727aa5]",
    [tokens.isDark]
  );

  const iconButtonClass = useMemo(
    () =>
      `${tokens.buttonGhost} flex h-10 w-10 items-center justify-center rounded-full`,
    [tokens.buttonGhost]
  );

  return (
    <header className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
      <div>
        <p
          className={`text-xs font-semibold uppercase tracking-[0.35em] ${tokens.subtleText}`}
        >
          Pages / Dashboard
        </p>
        <h1 className="mt-3 text-3xl font-semibold md:text-4xl">{activeApp.name}</h1>
        {subtitle && (
          <p className={`mt-2 text-sm ${tokens.subtleText}`}>
            {subtitle}
          </p>
        )}
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
            className={iconButtonClass}
            aria-label="Notifications"
          >
            <NotificationIcon className="h-5 w-5" />
          </button>

          <button
            type="button"
            onClick={onToggleTheme}
            className={iconButtonClass}
            aria-label="Toggle theme"
          >
            <DarkModeIcon className="h-5 w-5" />
          </button>

          <button
            type="button"
            className={iconButtonClass}
            aria-label="Cart"
          >
            <CartIcon className="h-5 w-5" />
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



