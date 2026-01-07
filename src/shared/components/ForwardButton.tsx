import { useNavigate, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useEffect, useState } from "react";
import { ArrowRightIcon } from "@utilities/icons";

type ForwardButtonProps = {
  readonly className?: string;
  readonly isDark?: boolean;
  readonly onClick?: () => void;
  readonly showText?: boolean;
};

export const ForwardButton = ({ className = "", isDark = false, onClick, showText = true }: ForwardButtonProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { t, i18n } = useTranslation("common");
  const isRTL = i18n.language === "ar";
  const [canGoForward, setCanGoForward] = useState(false);

  useEffect(() => {
    // Forward is typically not available in React Router SPA
    // This is more for browser back/forward buttons
    setCanGoForward(false);
  }, [location]);

  const handleClick = () => {
    if (!canGoForward) return;
    
    if (onClick) {
      onClick();
    } else {
      navigate(1);
    }
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={!canGoForward}
      className={`group flex flex-wrap items-center gap-2 rounded-[20px] ${showText ? "px-4 py-2.5" : "p-2.5"} text-sm font-medium transition-all ${
        canGoForward ? "hover:scale-105 cursor-pointer" : "cursor-not-allowed"
      } ${
        isDark
          ? "bg-[#13181E] text-white/80 hover:bg-[#1A2028] hover:text-white"
          : "bg-[#F9FBFD] text-[#504343] hover:bg-[#EEF2F6] hover:text-[#584ABC]"
      } ${className}`}
      aria-label={t("actions.forward", "Forward")}
    >
      <ArrowRightIcon 
        className={`h-5 w-5 transition-transform ${
          canGoForward 
            ? isRTL 
              ? "rotate-180 group-hover:-translate-x-1" 
              : "group-hover:translate-x-1"
            : isRTL
            ? "rotate-180"
            : ""
        }`} 
      />
      {showText && <span>{t("actions.forward", "Forward")}</span>}
    </button>
  );
};
