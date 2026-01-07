import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { GeneralServicesIcon, MasterStrokeIcon, AppFilterIcon, FilledBundleSubscriptionsIcon, ArrowRight } from "@utilities/icons";
import marketplaceBg from "@assets/images/app/marketplace-bg.svg";
import type { DashboardTokens } from "../../types";
import { MarketplaceCard, type MarketplaceItem } from "./MarketplaceCard";
import { useGetMarketplaceAppsQuery } from "@/store/api/marketplace-api";
import { fallbackMarketplaceData } from "./marketplace-fallback-data";

type MarketplaceViewProps = {
  readonly tokens: DashboardTokens;
  readonly onItemClick?: (itemId: string) => void;
};

type Category = "General" | "Master";

export const MarketplaceView = ({ tokens, onItemClick }: MarketplaceViewProps) => {
  const navigate = useNavigate();
  const [activeCategory, setActiveCategory] = useState<Category>("General");
  
  // Only fetch if user is authenticated
  const token = localStorage.getItem("auth_token");
  const { data, isLoading, isError, error } = useGetMarketplaceAppsQuery(undefined, {
    skip: !token, // Skip the query if no token
  });

  // Use API data if available, otherwise use fallback data
  const marketplaceData = useMemo(() => {
    // Check if we have valid API data
    if (data?.status && data?.services) {
      console.log("Using API data:", data);
      return data;
    }
    if (isError) {
      console.error("API Error - using fallback data:", error);
    } else if (!token) {
      console.log("No auth token - using fallback data");
    } else {
      console.log("Using fallback data. API data:", data);
    }
    return fallbackMarketplaceData;
  }, [data, isError, error, token]);

  const filteredItems = useMemo(() => {
    if (!marketplaceData?.services) return [];

    return marketplaceData.services
      .filter((app) => app.type === activeCategory)
      .map((app): MarketplaceItem => ({
        id: app.id.toString(),
        title: app.name,
        description: app.description,
        rating: app.rating.average,
        reviewCount: app.rating.reviewsCount,
        priceType: app.price.amount === 0 ? "Free" : "Paid",
        price: `${app.price.amount} ${app.price.currency}`,
        icon: app.icon.url ? (
          <img src={app.icon.url} alt={app.icon.alt || app.name} className="w-7 h-7" />
        ) : (
          <div className="w-7 h-7 bg-gray-300 rounded" />
        ),
        iconGradient: undefined,
      }));
  }, [marketplaceData, activeCategory]);

  return (
    <div className="flex flex-col gap-6">
      {/* Special Bundles Banner */}
      <div className="relative w-full">
        <img src={marketplaceBg} alt="Special Bundles" className="w-full hidden md:block md:h-36 rounded-[20px] object-cover w-full" />
        <div className="md:absolute bg-[#093F46] md:bg-transparent  rounded-[20px]  inset-0 flex flex-wrap items-center justify-between py-2 md:py-0 px-6 md:px-8">
          <div className="flex items-center gap-4 flex-1 ">
            <div className="flex-shrink-0 bg-[#3A656B] w-16 h-16 rounded-full flex items-center justify-center">
              <FilledBundleSubscriptionsIcon className="w-8 h-8 !text-white" />
            </div>
            <div className="flex flex-col gap-2">
              <h2 className="text-2xl md:text-3xl font-bold text-white">Special Bundles</h2>
              <p className="text-sm md:text-base text-[#E7E7E7] font-light">Save big with our curated product bundles</p>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-2 relative mt-8">
            <button
              type="button"
              className="flex flex-wrap items-center gap-2 px-4 py-2 md:px-6 md:py-2.5 border border-white text-white rounded-full font-regular text-sm md:text-base hover:bg-white/90 hover:text-[#0F6773] cursor-pointer transition-colors"
              onClick={() => navigate("/dashboard/marketplace/bundles")}
            >
              <span>Discover our bundle</span>
              <ArrowRight className="w-4 h-4 md:w-5 md:h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Category Tabs */}
      <div className="flex flex-wrap items-center justify-between mt-2">
        <div className="flex items-center gap-6">
          {[
            { id: "General" as Category, label: "General Services Apps", icon: GeneralServicesIcon },
            { id: "Master" as Category, label: "Business App", icon: MasterStrokeIcon },
          ].map((tab) => {
            const isActive = activeCategory === tab.id;
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveCategory(tab.id)}
                className={`relative flex flex-wrap items-center gap-2 pb-3 text-sm md:text-base font-semibold transition-colors ${
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
          className={`flex flex-wrap items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
            tokens.isDark
              ? "bg-white/10 text-white/70 hover:text-white"
              : "bg-white text-black"
          }`}
        >
          <AppFilterIcon className="h-5 w-5" />
          <span className="text-sm md:text-base font-medium">Filters</span>
        </button>
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className={`${tokens.cardBase} rounded-[20px] p-10 text-center`}>
          <p className={`text-lg ${tokens.isDark ? "text-white/70" : "text-[#718EBF]"}`}>
            Loading marketplace apps...
          </p>
        </div>
      )}

      {/* Marketplace Grid - Shows API data or fallback data */}
      {!isLoading && (
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
      )}

      {/* Empty State */}
      {!isLoading && filteredItems.length === 0 && (
        <div className={`${tokens.cardBase} rounded-[20px] p-10 text-center`}>
          <p className={`text-lg ${tokens.isDark ? "text-white/70" : "text-[#718EBF]"}`}>
            No items found matching your criteria.
          </p>
        </div>
      )}
    </div>
  );
};
