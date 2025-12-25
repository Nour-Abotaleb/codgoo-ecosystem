import { i18n } from "@shared/config/i18n";
import { ArrowRight, VerifiedIcon } from "@utilities/icons";
import type { DashboardTokens } from "../../types";

export type MarketplaceItem = {
  readonly id: string;
  readonly title: string;
  readonly description: string;
  readonly rating: number;
  readonly reviewCount: number;
  readonly priceType: "Free" | "Paid";
  readonly price?: string;
  readonly icon: React.ReactNode;
  readonly iconColor?: string;
  readonly iconGradient?: string;
};

type MarketplaceCardProps = {
  readonly item: MarketplaceItem;
  readonly tokens: DashboardTokens;
  readonly onClick?: () => void;
  readonly onLearnMore?: (e: React.MouseEvent) => void;
  readonly isSelected?: boolean;
  readonly isSelectable?: boolean;
  readonly onSelect?: () => void;
};

export const MarketplaceCard = ({ 
  item, 
  tokens, 
  onClick, 
  onLearnMore,
  isSelected = false,
  isSelectable = true,
  onSelect
}: MarketplaceCardProps) => {
  const isRTL = i18n.language === "ar";
  const isSelectionMode = !!onSelect; // Only in selection mode when onSelect is provided

  const handleCardClick = () => {
    if (isSelectionMode) {
      // In selection mode (BundleAppsView), toggle selection
      if (onSelect && isSelectable) {
        onSelect();
      }
    } else {
      // In normal mode (MarketplaceView), navigate
      if (onClick) {
        onClick();
      }
    }
  };

  return (
    <div
      className={`${tokens.cardBase} rounded-[20px] p-4 transition-all flex flex-col relative ${
        isSelectionMode
          ? isSelected 
            ? "border-2 border-[#0F6773] cursor-pointer" 
            : isSelectable 
              ? "border-2 border-transparent hover:border-[#0F6773]/30 cursor-pointer" 
              : "border-2 border-transparent opacity-60 cursor-not-allowed"
          : "cursor-pointer" // Normal mode - no special border styling
      }`}
      onClick={handleCardClick}
    >
      {/* Selection Indicator - Only show in selection mode */}
      {isSelectionMode && isSelected && (
        <div className="absolute bottom-5 right-3 w-6 h-6 bg-[#0F6773] rounded-full flex items-center justify-center">
          <VerifiedIcon className="h-3 w-5 text-white" />
        </div>
      )}
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          {/* Price Type Badge */}
          {/* <div className="flex items-center gap-3 mb-3">
            <span
              className="inline-flex items-center justify-center px-5 py-1 rounded-full text-sm font-light"
              style={{ backgroundColor: colors.bg, color: colors.text }}
            >
              {item.priceType}
            </span>
          </div> */}

          {/* Title */}
          <h3 className={`text-lg font-bold mb-2 ${tokens.isDark ? "text-white" : "text-black"}`}>
            {item.title}
          </h3>

          {/* Description */}
          <p className={`text-sm mb-2 ${tokens.isDark ? "text-white/70" : "text-[#5F5F5F]"}`}>
            {item.description}
          </p>
        </div>

        {/* Icon */}
        <div className="flex-shrink-0">
          <div
            className="w-14 h-14 rounded-full flex items-center justify-center"
            style={
              item.iconGradient
                ? { background: item.iconGradient }
                : { backgroundColor: item.iconColor || "#E7F0F1" }
            }
          >
            {item.icon}
          </div>
        </div>
      </div>

      {/* Price and Rating */}
      <div className="mt-2 flex items-center justify-between text-sm w-full">
        <span className={`text-[15px] font-medium ${tokens.isDark ? "text-white" : "text-[#1A3341]"}`}>
          {item.price || ""}
        </span>
        <div className="flex items-center gap-2 flex-shrink-0">
          <div className="flex items-center">
            {Array.from({ length: 5 }).map((_, i) => (
              <span
                key={i}
                className="text-lg md:text-xl"
                style={{ color: i < Math.floor(item.rating) ? "#F8C56B" : "#E0E0E0" }}
              >
                ★
              </span>
            ))}
          </div>
          <span className={`text-sm ${tokens.isDark ? "text-white/70" : "text-black"}`}>
            ({item.rating}) • {item.reviewCount.toLocaleString()} reviews
          </span>
        </div>
      </div>

      {/* Learn More Link */}
      <div className="flex justify-start mt-2">
        <button
          type="button"
          className="flex items-center gap-1 text-sm font-medium transition-colors text-white py-2.5 px-4 rounded-full bg-[#0F6773] cursor-pointer hover:bg-[#0d5a65]"
          onClick={(e) => {
            e.stopPropagation();
            if (onLearnMore) {
              onLearnMore(e);
            }
          }}
        >
          <span>Learn more</span>
          <ArrowRight className={`h-4 w-4 ${isRTL ? "rotate-180" : ""}`} />
        </button>
      </div>
    </div>
  );
};
