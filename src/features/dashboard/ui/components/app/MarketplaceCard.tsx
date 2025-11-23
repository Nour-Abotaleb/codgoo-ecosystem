import { ArrowRight } from "@utilities/icons";
import type { DashboardTokens } from "../../types";

export type MarketplaceItem = {
  readonly id: string;
  readonly title: string;
  readonly description: string;
  readonly rating: number;
  readonly reviewCount: number;
  readonly priceType: "Free" | "Paid";
  readonly icon: React.ReactNode;
  readonly iconColor?: string;
  readonly iconGradient?: string;
};

type MarketplaceCardProps = {
  readonly item: MarketplaceItem;
  readonly tokens: DashboardTokens;
  readonly onClick?: () => void;
  readonly onLearnMore?: () => void;
};

export const MarketplaceCard = ({ item, tokens, onClick, onLearnMore }: MarketplaceCardProps) => {
  const priceTypeColors = {
    Free: { bg: "#27B43E", text: "#FFFFFF" },
    Paid: { bg: "#FF8A0E", text: "#FFFFFF" }
  };

  const colors = priceTypeColors[item.priceType];

  return (
    <div
      className={`${tokens.cardBase} rounded-2xl p-4 transition-all cursor-pointer`}
      onClick={onClick}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          {/* Price Type Badge */}
          <div className="flex items-center gap-3 mb-3">
            <span
              className="inline-flex items-center justify-center px-5 py-1 rounded-full text-sm font-light"
              style={{ backgroundColor: colors.bg, color: colors.text }}
            >
              {item.priceType}
            </span>
          </div>

          {/* Title */}
          <h3 className={`text-lg font-bold mb-2 ${tokens.isDark ? "text-white" : "text-[#2B3674]"}`}>
            {item.title}
          </h3>

          {/* Description */}
          <p className={`text-sm mb-2 ${tokens.isDark ? "text-white/70" : "text-[#718EBF]"}`}>
            {item.description}
          </p>

          {/* Rating */}
          <div className="flex items-center gap-2 mb-2">
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
            <span className={`text-sm ${tokens.isDark ? "text-white/70" : "text-[#718EBF]"}`}>
              ({item.rating}) • {item.reviewCount.toLocaleString()} reviews
            </span>
          </div>

          {/* Learn More Link */}
          <button
            type="button"
            className="flex items-center gap-1 text-sm font-medium transition-colors"
            style={{ color: tokens.isDark ? "#A3AED0" : "#B70000" }}
            onClick={(e) => {
              e.stopPropagation();
              onLearnMore?.();
            }}
          >
            <span>Learn more</span>
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>

        {/* Icon */}
        <div className="flex-shrink-0">
          <div
            className="w-16 h-16 rounded-xl flex items-center justify-center"
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
    </div>
  );
};

