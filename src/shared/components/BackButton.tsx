import { useNavigate, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useEffect, useState } from "react";
import { ArrowLeftIcon } from "@utilities/icons";
import { useTabNavigation } from "@shared/contexts/TabNavigationContext";

type BackButtonProps = {
  readonly className?: string;
  readonly isDark?: boolean;
  readonly onClick?: () => void;
  readonly showText?: boolean;
};

export const BackButton = ({ className = "", isDark = false, onClick, showText = true }: BackButtonProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { t, i18n } = useTranslation("common");
  const isRTL = i18n.language === "ar";
  const [canGoBack, setCanGoBack] = useState(true);
  const { tabHistory, goToPreviousTab } = useTabNavigation();

  useEffect(() => {
    // Check if we can go back in history
    setCanGoBack(window.history.length > 1);
  }, [location]);

  const handleClick = () => {
    if (!canGoBack && tabHistory.length <= 1) return;
    
    if (onClick) {
      onClick();
    } else {
      // First, try to navigate back through tabs
      const didNavigateTab = goToPreviousTab();
      
      // If no tab navigation happened, navigate back in history
      if (!didNavigateTab) {
        navigate(-1);
      }
    }
  };

  const hasBackAction = canGoBack || tabHistory.length > 1;

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={!hasBackAction}
      className={`group flex flex-wrap items-center gap-2 rounded-[20px] ${showText ? "px-4 py-2.5" : "p-2.5"} text-sm font-medium transition-all ${
        hasBackAction ? "hover:scale-105 cursor-pointer" : "cursor-not-allowed"
      } ${
        isDark
          ? "bg-[#0F1217] text-white/80 hover:bg-[#1A2028] hover:text-white"
          : "bg-[#F9FBFD] text-[#504343] hover:bg-[#EEF2F6] hover:text-[#584ABC]"
      } ${className}`}
      aria-label={t("actions.back")}
    >
      <ArrowLeftIcon 
        className={`h-5 w-5 transition-transform ${
          hasBackAction 
            ? isRTL 
              ? "rotate-180 group-hover:translate-x-1" 
              : "group-hover:-translate-x-1"
            : isRTL
            ? "rotate-180"
            : ""
        }`} 
      />
      {showText && <span>{t("actions.back")}</span>}
    </button>
  );
};
