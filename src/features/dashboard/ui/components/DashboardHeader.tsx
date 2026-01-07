import { useState, useMemo, useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import { i18n } from "@shared/config/i18n";
import { BackButton } from "@shared/components";
import { useFullscreen } from "@shared/hooks/useFullscreen";

import userAvatar from "@assets/images/user.png";
import {
  CartIcon,
  DarkModeIcon,
  NotificationIcon,
  SearchIcon,
  LanguageIcon,
  FullscreenIcon,
  ExitFullscreenIcon
} from "@utilities/icons";

import type { DashboardApp, DashboardTokens } from "../types";

type DashboardHeaderProps = {
  readonly tokens: DashboardTokens;
  readonly activeApp: DashboardApp;
  readonly activeNavigationLabel?: string;
  readonly subtitle?: string;
  readonly onToggleTheme: () => void;
  readonly onCartClick?: () => void;
  readonly onProfileClick?: () => void;
  readonly onMenuClick?: () => void;
  readonly onSidebarToggle?: () => void;
};

type ActiveIcon = "notification" | "theme" | "cart" | "language" | "fullscreen" | null;

export const DashboardHeader = ({
  tokens,
  activeApp,
  activeNavigationLabel,
  onToggleTheme,
  onCartClick,
  onProfileClick,
  onSidebarToggle
}: DashboardHeaderProps) => {
  const { i18n: i18nInstance, t } = useTranslation("dashboard");
  const [activeIcon, setActiveIcon] = useState<ActiveIcon>(null);
  const prevPageLabelRef = useRef<string>("");
  const isRTL = i18n.language === "ar";
  const { isFullscreen, toggleFullscreen } = useFullscreen();
  const actionBarClass = useMemo(
    () =>
      `${tokens.cardBase} flex items-center flex-wrap gap-2  px-5 py-2 backdrop-blur`,
    [tokens.cardBase]
  );

  const searchFieldClass = tokens.isDark
    ? "bg-transparent stroke text-[color:var(--color-search-text)] placeholder:text-[color:var(--color-search-placeholder)]"
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

  const pageLabel = activeNavigationLabel ?? t(`apps.${activeApp.id}`);

  useEffect(() => {
    prevPageLabelRef.current = pageLabel;
  }, [pageLabel]);

  const handleLanguageToggle = () => {
    const currentLang = i18nInstance.resolvedLanguage ?? "en";
    const newLang = currentLang === "en" ? "ar" : "en";
    void i18nInstance.changeLanguage(newLang);
  };

  return (
    <>
      <header className="relative flex flex-col gap-6 md:flex-row md:items-center md:justify-between  md:pb-0">
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={onSidebarToggle}
            className="lg:hidden 2xl:hidden flex h-9 w-9 items-center justify-center rounded-full transition-colors duration-200 hover:opacity-80"
            aria-label="Toggle Sidebar"
          >
            <svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
              <g clipPath="url(#clip0_3078_62707)">
                <path d="M5.33332 8.88867C4.35554 8.88867 3.55554 9.68867 3.55554 10.6664C3.55554 11.6442 4.35554 12.4442 5.33332 12.4442C6.3111 12.4442 7.1111 11.6442 7.1111 10.6664C7.1111 9.68867 6.3111 8.88867 5.33332 8.88867ZM16 8.88867C15.0222 8.88867 14.2222 9.68867 14.2222 10.6664C14.2222 11.6442 15.0222 12.4442 16 12.4442C16.9778 12.4442 17.7778 11.6442 17.7778 10.6664C17.7778 9.68867 16.9778 8.88867 16 8.88867ZM10.6667 8.88867C9.68888 8.88867 8.88888 9.68867 8.88888 10.6664C8.88888 11.6442 9.68888 12.4442 10.6667 12.4442C11.6444 12.4442 12.4444 11.6442 12.4444 10.6664C12.4444 9.68867 11.6444 8.88867 10.6667 8.88867Z" fill="currentColor"/>
              </g>
              <defs>
                <clipPath id="clip0_3078_62707">
                  <rect width="21.3333" height="21.3333" rx="10.6667" fill="white"/>
                </clipPath>
              </defs>
            </svg>
          </button>
          
          <BackButton isDark={tokens.isDark} showText={false} />
          
          <div className="relative min-w-[200px]">
            <h1
              key={pageLabel}
              className={`text-2xl font-semibold md:text-3xl ${
                isRTL 
                  ? "animate-slide-in-right" 
                  : "animate-slide-in-left"
              }`}
              style={tokens.isDark ? {} : { color: primaryColor }}
            >
              {pageLabel}
            </h1>
          </div>
        </div>

        <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
          {/* Mobile: Search bar only */}
          <div className={`md:hidden rounded-full ${actionBarClass}`}>
            <div className={`flex h-10.5 flex-1 items-center gap-3 rounded-full ${isRTL ? "pr-4 pl-4" : "px-4"} ${searchFieldClass}`}>
              <SearchIcon className={`h-4 w-4 opacity-70 ${isRTL ? "order-2" : ""}`} />
              <input
                type="search"
                placeholder={t("header.search")}
                className={`flex-1 bg-transparent text-sm focus:outline-none ${isRTL ? "text-end" : "text-start"}`}
              />
            </div>
          </div>

          {/* Desktop: Search + Icons */}
          <div className={`hidden md:flex rounded-full ${actionBarClass}`}>
            <div className={`flex h-10.5 flex-1 items-center gap-3 rounded-full ${isRTL ? "pr-4 pl-4" : "px-4"} ${searchFieldClass}`}>
              <SearchIcon className={`h-4 w-4 opacity-70 ${isRTL ? "order-2" : ""}`} />
              <input
                type="search"
                placeholder={t("header.search")}
                className={`flex-1 bg-transparent text-sm focus:outline-none ${isRTL ? "text-end" : "text-start"}`}
              />
            </div>

            <button
              type="button"
              onClick={() => setActiveIcon(activeIcon === "notification" ? null : "notification")}
              className={getIconButtonClass("notification")}
              style={getIconButtonStyle("notification") as React.CSSProperties}
              aria-label={t("header.notifications")}
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
              style={getIconButtonStyle("theme") as React.CSSProperties}
              aria-label={t("header.toggleTheme")}
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
              style={getIconButtonStyle("cart") as React.CSSProperties}
              aria-label={t("header.cart")}
            >
              <CartIcon 
                className={`h-5 w-5 ${getIconColorClass("cart")}`}
                style={!tokens.isDark && activeIcon === "cart" ? { color: primaryColor } : {}}
              />
            </button>

            <button
              type="button"
              onClick={handleLanguageToggle}
              className={getIconButtonClass("language")}
              style={getIconButtonStyle("language") as React.CSSProperties}
              aria-label="Toggle Language"
            >
              <LanguageIcon 
                className={`h-5 w-5 ${getIconColorClass("language")}`}
                style={!tokens.isDark && activeIcon === "language" ? { color: primaryColor } : {}}
              />
            </button>

            <button
              type="button"
              onClick={() => {
                setActiveIcon(activeIcon === "fullscreen" ? null : "fullscreen");
                toggleFullscreen();
              }}
              className={getIconButtonClass("fullscreen")}
              style={getIconButtonStyle("fullscreen") as React.CSSProperties}
              aria-label={isFullscreen ? "Exit Fullscreen" : "Enter Fullscreen"}
            >
              {isFullscreen ? (
                <ExitFullscreenIcon 
                  className={`h-5 w-5 ${getIconColorClass("fullscreen")}`}
                  style={!tokens.isDark && activeIcon === "fullscreen" ? { color: primaryColor } : {}}
                />
              ) : (
                <FullscreenIcon 
                  className={`h-5 w-5 ${getIconColorClass("fullscreen")}`}
                  style={!tokens.isDark && activeIcon === "fullscreen" ? { color: primaryColor } : {}}
                />
              )}
            </button>

            <button
              type="button"
              onClick={onProfileClick}
              className="flex h-10 w-10 items-center justify-center rounded-full overflow-hidden hover:opacity-80 transition-opacity cursor-pointer"
              aria-label="Profile Settings"
            >
              <img
                src={userAvatar}
                alt="User avatar"
                className="h-full w-full rounded-full object-cover"
              />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile: Fixed bottom icons bar */}
      <div className={`md:hidden fixed bottom-0 left-0 right-0 z-30  ${actionBarClass} flex flex-wrap items-center justify-between gap-4 border-t-1 border-t-white px-5 py-3`}>
        <button
          type="button"
          onClick={() => setActiveIcon(activeIcon === "notification" ? null : "notification")}
          className={getIconButtonClass("notification")}
          style={getIconButtonStyle("notification") as React.CSSProperties}
          aria-label={t("header.notifications")}
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
          style={getIconButtonStyle("theme") as React.CSSProperties}
          aria-label={t("header.toggleTheme")}
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
          style={getIconButtonStyle("cart") as React.CSSProperties}
          aria-label={t("header.cart")}
        >
          <CartIcon 
            className={`h-5 w-5 ${getIconColorClass("cart")}`}
            style={!tokens.isDark && activeIcon === "cart" ? { color: primaryColor } : {}}
          />
        </button>

        <button
          type="button"
          onClick={onProfileClick}
          className="flex h-10 w-10 items-center justify-center rounded-full overflow-hidden hover:opacity-80 transition-opacity cursor-pointer"
          aria-label="Profile Settings"
        >
          <img
            src={userAvatar}
            alt="User avatar"
            className="h-full w-full rounded-full object-cover"
          />
        </button>
      </div>
    </>
  );
};
