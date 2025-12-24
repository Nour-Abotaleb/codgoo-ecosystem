import { useMemo, useState } from "react";
import {
  GridPreviewIcon,
  MenuPreviewIcon,
  MarketplaceIcon,
  GeneralServicesIcon,
  MasterStrokeIcon,
} from "@utilities/icons";
import { useGetApplicationsQuery } from "@/store/api/marketplace-api";
import type { DashboardTokens } from "../../types";

type AppCategory = "General" | "Master";

export const ApplicationsView = ({
  tokens,
  onOpenMarketplace,
}: { readonly tokens: DashboardTokens; readonly onOpenMarketplace?: () => void }) => {
  const [activeTab, setActiveTab] = useState<AppCategory>("General");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const isDark = tokens.isDark;

  const { data: applicationsData, isLoading } = useGetApplicationsQuery();

  const items = useMemo(() => {
    if (!applicationsData?.data) return [];
    return applicationsData.data.filter((app) => app.type === activeTab);
  }, [applicationsData, activeTab]);

  const getIconGradient = (index: number) => {
    const gradients = [
      "linear-gradient(135deg, #F3AC55 0%, #F6DD59 100%)",
      "linear-gradient(135deg, #B555F3 0%, #F355B5 100%)",
      "linear-gradient(135deg, #55F3AC 0%, #59F6DD 100%)",
      "linear-gradient(135deg, #F355B5 0%, #F3AC55 100%)",
    ];
    return gradients[index % gradients.length];
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex flex-col gap-4">
        {/* Tabs with Preview Icons */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-6">
            {[
              { id: "General" as AppCategory, label: "General Services Apps", icon: GeneralServicesIcon },
              { id: "Master" as AppCategory, label: "Master Apps", icon: MasterStrokeIcon },
            ].map((tab) => {
              const isActive = activeTab === tab.id;
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id)}
                  className={`relative flex items-center gap-2 pb-3 text-sm md:text-base font-semibold transition-colors ${
                      isActive
                      ? isDark ? "text-white/70" : "text-black"
                      : isDark
                        ? "text-white/60"
                        : "text-black"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {tab.label}
                  {isActive ? <span className="absolute inset-x-0 -bottom-[1px] h-0.5 rounded-full bg-[#0F6773]" /> : null}
                </button>
              );
            })}
          </div>
          <div className={`flex items-center gap-2 rounded-lg p-1 ${tokens.isDark ? "bg-white/10" : "bg-[#E9F5F4]"}`}>
            <button
              type="button"
              onClick={() => setViewMode("grid")}
              className={`flex h-11 w-11 items-center justify-center rounded-lg transition-colors ${
                viewMode === "grid"
                  ? tokens.isDark
                    ? "bg-black/40 text-[#0F6773]"
                    : "bg-white text-[#0F6773]"
                  : tokens.isDark
                    ? "bg-transparent text-white/60"
                    : "bg-transparent text-[#1A3341]"
              }`}
            >
              <GridPreviewIcon className="h-6 w-6" />
            </button>
            <button
              type="button"
              onClick={() => setViewMode("list")}
              className={`flex h-11 w-11 items-center justify-center rounded-lg transition-colors ${
                viewMode === "list"
                  ? tokens.isDark
                    ? "bg-black/40 text-[#0F6773]"
                    : "bg-white text-[#0F6773]"
                  : tokens.isDark
                    ? "bg-transparent text-white/60"
                    : "bg-transparent text-[#1A3341]"
              }`}
            >
              <MenuPreviewIcon className="h-6 w-6" />
            </button>
          </div>
        </div>

        {/* Section Title */}
        <div className="flex items-center gap-2">
          <span className={`text-lg font-semibold ${tokens.isDark ? "text-white" : "text-[#1A3341]"}`}>
            Professional Bundle
          </span>
          <span className={`text-sm ${tokens.isDark ? "text-white/60" : "text-[#6E7D87]"}`}>
            ({items.length} Apps)
          </span>
        </div>
      </div>

      {/* Cards / Empty state */}
      {isLoading ? (
        <div className={`${tokens.cardBase} rounded-2xl p-10 text-center`}>
          <p className={`text-lg ${tokens.isDark ? "text-white/70" : "text-[#5F5F5F]"}`}>
            Loading applications...
          </p>
        </div>
      ) : items.length === 0 ? (
        <div className={`${tokens.cardBase} rounded-2xl p-10 text-center`}>
          <div className="mx-auto flex items-center justify-center text-[#9DC1C6]">
            <MarketplaceIcon className="h-18 w-18" />
          </div>
          <p className={`mt-6 text-lg md:text-2xl font-bold ${tokens.isDark ? "text-white" : "text-black"}`}>
            You don&apos;t have any apps yet
          </p>
          <p className={`mt-1 text-base md:text-lg ${tokens.isDark ? "text-white/70" : "text-[#5F5F5F]"}`}>
            Start shopping and adding apps
          </p>
          <div className="mt-6 flex justify-center">
            <button
              type="button"
              onClick={onOpenMarketplace}
              className="rounded-full bg-[#0F6773] font-medium px-8 py-2.5 text-sm md:text-base text-white transition-colors hover:bg-[#0d5661]"
            >
              Marketplace
            </button>
          </div>
        </div>
      ) : (
        <div
          className={`grid gap-4 ${
            viewMode === "grid"
              ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
              : "grid-cols-1"
          }`}
        >
          {items.map((item, index) => (
            <div
              key={item.id}
              className={`rounded-2xl ${tokens.isDark ? "bg-[#0F1217]" : "bg-white"} p-4`}
            >
              <div className="flex items-center justify-between gap-4">
                <div className="flex flex-col flex-1 min-w-0">
                  <span className={`text-base md:text-xl font-semibold ${tokens.isDark ? "text-white" : "text-black"}`}>
                    {item.name}
                  </span>
                  <p className={`text-sm leading-snug ${tokens.isDark ? "text-white/70" : "text-[#5F5F5F]"}`}>
                    {item.description}
                  </p>
                </div>
                <div
                  className="h-14 w-14 rounded-full flex items-center justify-center flex-shrink-0"
                  style={{ background: getIconGradient(index) }}
                >
                  {item.icon.url ? (
                    <img src={item.icon.url} alt={item.icon.alt || item.name} className="h-7 w-7" />
                  ) : (
                    <div className="h-7 w-7 bg-white/20 rounded-full" />
                  )}
                </div>
              </div>

              <div className="mt-3 flex flex-wrap items-center justify-between text-sm">
                <span className={`text-[15px] font-medium ${tokens.isDark ? "text-white" : "text-[#1A3341]"}`}>
                  {item.price.amount} {item.price.currency}
                </span>
                <div className="flex items-center gap-2">
                  <div className="flex items-center">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <span
                        key={i}
                        className="text-lg md:text-xl"
                        style={{ color: i < Math.floor(item.rating.average) ? "#F8C56B" : "#E0E0E0" }}
                      >
                        ★
                      </span>
                    ))}
                  </div>
                  <span className={`text-sm ${tokens.isDark ? "text-white/70" : "text-black"}`}>
                    ({item.rating.average}) • {item.reviewsCount.toLocaleString()} reviews
                  </span>
                </div>
              </div>

              <div className="mt-2 flex items-center justify-start gap-3">
                <button
                  type="button"
                  onClick={() => window.open(item.launchUrl, '_blank')}
                  className="rounded-full bg-[#0F6773] px-8 py-2 text-sm text-white transition-colors hover:bg-[#0d5661] cursor-pointer"
                >
                  Login
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

