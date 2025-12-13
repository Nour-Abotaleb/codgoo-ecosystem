import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { SnapChatIcon, RedditIcon, PrintIcon, GeneralServicesIcon, MasterStrokeIcon, AppFilterIcon, FilledBundleSubscriptionsIcon, ArrowRight } from "@utilities/icons";
import marketplaceBg from "@assets/images/app/marketplace-bg.svg";
import type { DashboardTokens } from "../../types";
import { MarketplaceCard, type MarketplaceItem } from "./MarketplaceCard";

type MarketplaceViewProps = {
  readonly tokens: DashboardTokens;
  readonly onItemClick?: (itemId: string) => void;
};

type Category = "general" | "master";

// Sample marketplace data - in a real app, this would come from an API
// eslint-disable-next-line react-refresh/only-export-components
export const marketplaceItems: readonly MarketplaceItem[] = [
  {
    id: "snapchat-ads",
    title: "Snapchat Ads",
    description: "Create and manage Snapchat advertising campaigns with advanced targeting options.",
    rating: 4.9,
    reviewCount: 1234,
    priceType: "Free",
    price: "135 EGP",
    icon: <SnapChatIcon className="w-7 h-7" />,
    iconGradient: "linear-gradient(to left, #DC4BAF, #AB55F3)"
  },
  {
    id: "ai-product-writer",
    title: "AI Product Writer",
    description: "Connect your store with Snapchat advertising platform for better reach",
    rating: 4.8,
    reviewCount: 856,
    priceType: "Paid",
    price: "135 EGP",
    icon: <RedditIcon className="w-7 h-7" />,
    iconGradient: "linear-gradient(to right,  #4B4DDC, #55C6F3)"
  },
  {
    id: "print-on-demand",
    title: "Print on Demand",
    description: "Generate compelling product descriptions using advanced AI technology",
    rating: 4.7,
    reviewCount: 2341,
    priceType: "Free",
    price: "135 EGP",
    icon: <PrintIcon className="w-7 h-7" />,
    iconGradient: "linear-gradient(to right, #F3AC55, #F9E560)"
  },
  // Duplicate items for demonstration
  ...Array.from({ length: 9 }).map((_, i) => {
    const baseItems = [
      {
        id: "snapchat-ads",
        title: "Snapchat Ads",
        description: "Create and manage Snapchat advertising campaigns with advanced targeting options.",
        rating: 4.9,
        reviewCount: 1234,
        priceType: "Free" as const,
        price: "135 EGP",
        iconGradient: "linear-gradient(to left, #DC4BAF, #AB55F3)"
      },
      {
        id: "ai-product-writer",
        title: "AI Product Writer",
        description: "Generate compelling product descriptions and marketing copy using AI technology.",
        rating: 4.8,
        reviewCount: 856,
        priceType: "Paid" as const,
        price: "135 EGP",
        iconGradient: "linear-gradient(to right, #55C6F3, #4B4DDC)"
      },
      {
        id: "print-on-demand",
        title: "Print on Demand",
        description: "Create custom products with print-on-demand services for your business.",
        rating: 4.7,
        reviewCount: 2341,
        priceType: "Free" as const,
        price: "135 EGP",
        iconGradient: "linear-gradient(to right, #F9E560, #F3AC55)"
      }
    ];
    const item = baseItems[i % 3];
    return {
      ...item,
      id: `${item.id}-${i + 1}`,
      icon: item.id === "snapchat-ads" ? (
        <SnapChatIcon className="w-7 h-7" />
      ) : item.id === "ai-product-writer" ? (
        <RedditIcon className="w-7 h-7" />
      ) : (
        <PrintIcon className="w-7 h-7" />
      )
    };
  })
];

export const MarketplaceView = ({ tokens, onItemClick }: MarketplaceViewProps) => {
  const navigate = useNavigate();
  const [activeCategory, setActiveCategory] = useState<Category>("general");

  const filteredItems = useMemo(() => {
    return marketplaceItems;
  }, [activeCategory]);

  return (
    <div className="flex flex-col gap-6">
      {/* Special Bundles Banner */}
      <div className="relative w-full">
        <img src={marketplaceBg} alt="Special Bundles" className="w-full" />
        <div className="absolute inset-0 flex items-center justify-between p-6 md:p-8">
          <div className="flex items-center gap-4 flex-1">
            <div className="flex-shrink-0 bg-[#3A656B] w-16 h-16 rounded-full flex items-center justify-center">
              <FilledBundleSubscriptionsIcon className="w-8 h-8 text-white" />
            </div>
            <div className="flex flex-col gap-2">
              <h2 className="text-2xl md:text-3xl font-bold text-white">Special Bundles</h2>
              <p className="text-sm md:text-base text-[#E7E7E7] font-light">Save big with our curated product bundles</p>
            </div>
          </div>
          <div className="flex items-center gap-2 relative mt-8">
            <button
              type="button"
              className="flex items-center gap-2 px-4 py-2 md:px-6 md:py-2.5 border border-white text-white rounded-full font-regular text-sm md:text-base hover:bg-white/90 hover:text-[#0F6773] cursor-pointer transition-colors"
              onClick={() => navigate("/dashboard/marketplace/bundles")}
            >
              <span>Discover our bundle</span>
              <ArrowRight className="w-4 h-4 md:w-5 md:h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Category Tabs */}
      <div className="flex items-center justify-between mt-2">
        <div className="flex items-center gap-6">
          {[
            { id: "general" as Category, label: "General Services Apps", icon: GeneralServicesIcon },
            { id: "master" as Category, label: "Master Apps", icon: MasterStrokeIcon },
          ].map((tab) => {
            const isActive = activeCategory === tab.id;
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveCategory(tab.id)}
                className={`relative flex items-center gap-2 pb-3 text-sm md:text-base font-semibold transition-colors ${
                  isActive
                    ? tokens.isDark ? "text-white/70" : "text-black"
                    : tokens.isDark
                    ? "text-white/60"
                    : "text-black"
                }`}
              >
                <Icon className="h-4 w-4" />
                {tab.label}
                {isActive ? (
                  <span className="absolute inset-x-0 -bottom-[1px] h-[3px] rounded-full bg-[#0F6773]" />
                ) : null}
              </button>
            );
          })}
        </div>
        <button
          type="button"
          className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
            tokens.isDark
              ? "bg-white/10 text-white/70 hover:text-white"
              : "bg-white text-black"
          }`}
        >
          <AppFilterIcon className="h-5 w-5" />
          <span className="text-sm md:text-base font-medium">Filters</span>
        </button>
      </div>

      {/* Marketplace Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredItems.map((item) => (
          <MarketplaceCard
            key={item.id}
            item={item}
            tokens={tokens}
            onClick={() => onItemClick?.(item.id)}
            onLearnMore={(e) => {
              e.stopPropagation();
              onItemClick?.(item.id);
            }}
          />
        ))}
      </div>

      {/* Empty State */}
      {filteredItems.length === 0 && (
        <div
          className={`${tokens.cardBase} rounded-2xl p-10 text-center`}
        >
          <p className={`text-lg ${tokens.isDark ? "text-white/70" : "text-[#718EBF]"}`}>
            No items found matching your criteria.
          </p>
        </div>
      )}
    </div>
  );
};
