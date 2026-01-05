import { ProfessionalBundlesIcon, EnterpriseBundlesIcon, FilledBundleSubscriptionsIcon, VerifiedIcon } from "@utilities/icons";
import { useNavigate } from "react-router-dom";
import type { DashboardTokens } from "../../types";
import { useGetMarketplacePackagesQuery } from "@/store/api/marketplace-api";
import { useMemo } from "react";

type BundleCard = {
  readonly id: string;
  readonly title: string;
  readonly price: string;
  readonly description: string;
  readonly badge?: string;
  readonly perks: readonly string[];
  readonly savings: string;
  readonly savingsNote: string;
  readonly actionLabel: string;
};

const topGradients = [
  "bg-gradient-to-br from-[#043F45] to-[#25A9A6]",
  "bg-gradient-to-br from-[#00353C] to-[#2BBBB6]",
  "bg-gradient-to-br from-[#07494E] to-[#29B6B1]"
];

const actionColors = ["#4CA8B5", "#0B595D", "#0C6187"];
const actionColorsDark = ["white", "white", "white"];
const checkBgColors = ["#67C6D266", "#28B2AE66", "#419EC966"];

type BundleSelectionViewProps = {
  readonly tokens: DashboardTokens;
};

export const BundleSelectionView = ({ tokens }: BundleSelectionViewProps) => {
  const navigate = useNavigate();
  const { data, isLoading } = useGetMarketplacePackagesQuery();

  // Transform API data to match BundleCard format
  const bundleCards = useMemo((): readonly BundleCard[] => {
    if (!data?.data) return [];

    return data.data.map((pkg): BundleCard => {
      // Parse JSON strings
      const features = JSON.parse(pkg.features) as string[];
      const badges = JSON.parse(pkg.badges) as string[];

      // Get the monthly price as default display price
      const monthlyPrice = pkg.prices.find(p => p.name === "monthly");
      const displayPrice = monthlyPrice?.amount ?? pkg.prices[0]?.amount ?? 0;
      const currency = monthlyPrice?.currency ?? pkg.prices[0]?.currency ?? "EGP";

      return {
        id: pkg.id.toString(),
        title: pkg.name,
        price: `${displayPrice} ${currency}`,
        description: pkg.tagline,
        badge: badges.length > 0 ? badges[0] : undefined,
        perks: features,
        savings: `${pkg.savings.percentage}%`,
        savingsNote: pkg.savings.text,
        actionLabel: "Select This Bundle"
      };
    });
  }, [data]);
  return (
    <div className="flex flex-col gap-8">
      <div className="flex items-center gap-3">
        <div className="flex flex-col gap-2 flex-1">
          <h1 className={`text-2xl font-bold ${tokens.isDark ? "text-white" : "text-[#142133]"}`}>
            Build Your Custom Bundle
          </h1>
          <p className={`text-sm md:text-base ${tokens.subtleText}`}>
            Choose applications and save big with our bundle packages
          </p>
        </div>
      </div>

      <div className="flex flex-col gap-2 items-center">
        <div className="flex items-center gap-2 text-xs md:text-sm text-[#208483] bg-[#EBFBFB] px-8 py-2.5 rounded-full">
            <FilledBundleSubscriptionsIcon className="h-5 w-5 text-[#208483]" />
          Step 1: Choose Your Bundle
        </div>
        <div className={`text-base md:text-lg font-bold ${tokens.isDark ? "text-white" : "text-black"}`}>
          Select a Bundle Package
        </div>
        <p className={`text-sm ${tokens.subtleText}`}>
          Pick the bundle that best fits your needs
        </p>
      </div>

      {/* Loading State - Skeleton Cards */}
      {isLoading && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className={`${tokens.cardBase} rounded-[20px] overflow-hidden flex flex-col animate-pulse`}>
              {/* Header Skeleton */}
              <div className={`p-4 ${tokens.isDark ? "bg-[#2a3a3a]" : "bg-gradient-to-br from-[#043F45]/20 to-[#25A9A6]/20"}`}>
                <div className="flex items-center gap-3">
                  <div className={`h-14 w-14 rounded-full ${tokens.isDark ? "bg-[#3a4a4a]" : "bg-[#386B70]/30"}`} />
                </div>
                <div className="flex flex-col mt-3 gap-2">
                  <div className={`h-5 w-32 rounded ${tokens.isDark ? "bg-[#3a4a4a]" : "bg-[#386B70]/20"}`} />
                  <div className={`h-4 w-48 rounded ${tokens.isDark ? "bg-[#3a4a4a]" : "bg-[#386B70]/15"}`} />
                </div>
                <div className={`mt-3 h-8 w-24 rounded ${tokens.isDark ? "bg-[#3a4a4a]" : "bg-[#386B70]/20"}`} />
              </div>

              {/* Features Skeleton */}
              <div className={`p-4 flex-1 ${tokens.isDark ? "bg-[#1a2a2a]" : "bg-[#FAFAFA]"}`}>
                <div className="space-y-3">
                  {[1, 2, 3, 4].map((j) => (
                    <div key={j} className="flex items-center gap-2">
                      <div className={`h-6 w-6 rounded-full ${tokens.isDark ? "bg-[#2a3a3a]" : "bg-[#67C6D2]/30"}`} />
                      <div className={`h-4 rounded ${tokens.isDark ? "bg-[#2a3a3a]" : "bg-gray-200"}`} style={{ width: `${60 + j * 10}%` }} />
                    </div>
                  ))}
                </div>
              </div>

              {/* Savings Skeleton */}
              <div className={`px-4 pb-4 ${tokens.isDark ? "bg-[#1a2a2a]" : "bg-[#FAFAFA]"}`}>
                <div className={`rounded-[20px] px-4 py-3 ${tokens.isDark ? "bg-[#2a3a3a]" : "bg-[#EBFBFB]/50"}`}>
                  <div className={`h-4 w-32 rounded mb-2 ${tokens.isDark ? "bg-[#3a4a4a]" : "bg-[#208483]/20"}`} />
                  <div className={`h-5 w-40 rounded ${tokens.isDark ? "bg-[#3a4a4a]" : "bg-[#208483]/15"}`} />
                </div>
              </div>

              {/* Button Skeleton */}
              <div className={`px-4 pb-5 ${tokens.isDark ? "bg-[#1a2a2a]" : "bg-[#FAFAFA]"}`}>
                <div className={`h-12 w-full rounded-full ${tokens.isDark ? "bg-[#2a3a3a]" : "bg-[#4CA8B5]/30"}`} />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Bundles Grid */}
      {!isLoading && bundleCards.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {bundleCards.map((bundle, idx) => (
          <div key={bundle.id} className={`${tokens.cardBase} rounded-[20px] bg-[#FAFAFA] overflow-hidden flex flex-col`}>
            <div className={`relative p-4 text-white ${topGradients[idx % topGradients.length]}`}>
              {bundle.badge ? (
                <span className="absolute top-3 right-3 bg-white text-[#208483] text-xs font-medium px-3 py-1.5 rounded-full">
                  {bundle.badge}
                </span>
              ) : null}
              <div className="flex items-center gap-3">
                <div className="h-14 w-14 rounded-full bg-[#386B70] flex items-center justify-center">
                  {idx % 3 === 0 ? (
                    <FilledBundleSubscriptionsIcon className="h-7 w-7 text-white" />
                  ) : idx % 3 === 1 ? (
                    <ProfessionalBundlesIcon className="h-7 w-7 text-white" />
                  ) : (
                    <EnterpriseBundlesIcon className="h-7 w-7 text-white" />
                  )}
                </div>
              </div>
                <div className="flex flex-col mt-2">
                    <span className="text-lg md:text-xl font-semibold">{bundle.title}</span>
                    <span className="text-sm md:text-base font-light">{bundle.description}</span>
                </div>
              <div className="mt-2 text-3xl font-semibold">{bundle.price}</div>
            </div>

            <div className="p-4 flex-1">
              <ul className="space-y-3 text-sm">
                {bundle.perks.map((perk) => (
                  <li key={perk} className="flex items-start gap-2">
                    <span
                      className="mt-0.5 h-6 w-6 rounded-full flex items-center justify-center"
                      style={{ backgroundColor: checkBgColors[idx % checkBgColors.length] }}
                    >
                      <VerifiedIcon 
                        className="h-3 w-3" 
                        style={{ color: tokens.isDark ? actionColorsDark[idx % actionColorsDark.length] : actionColors[idx % actionColors.length] }} 
                      />
                    </span>
                    <span className={`${tokens.isDark ? "text-black" : "text-[#142133]"}`}>{perk}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="px-4 pb-4">
              <div className="bg-[#EBFBFB] text-[#249796] rounded-[20px] px-4 py-3 text-sm font-medium flex flex-col items-start gap-2 justify-between">
                <div className="flex items-center gap-2">
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M3.67063 12.9386L7.44563 16.7136C8.99563 18.2636 11.5123 18.2636 13.0706 16.7136L16.729 13.0553C18.279 11.5053 18.279 8.98864 16.729 7.43031L12.9456 3.66364C12.154 2.87197 11.0623 2.44697 9.94563 2.50531L5.77896 2.70531C4.1123 2.78031 2.7873 4.10531 2.70396 5.76364L2.50396 9.93031C2.45396 11.0553 2.87896 12.147 3.67063 12.9386Z" stroke="#208483" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M8.11263 10.1882C9.26322 10.1882 10.196 9.25541 10.196 8.10482C10.196 6.95422 9.26322 6.02148 8.11263 6.02148C6.96204 6.02148 6.0293 6.95422 6.0293 8.10482C6.0293 9.25541 6.96204 10.1882 8.11263 10.1882Z" stroke="#208483" strokeWidth="1.5" strokeLinecap="round"/>
                        <path d="M11.0293 14.3548L14.3626 11.0215" stroke="#208483" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    <span className="text-sm font-medium text-black">Estimated Savings</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-medium text-base md:text-lg">{bundle.savings}</span>
                  <span className="text-sm font-light">{bundle.savingsNote}</span>
                </div>
              </div>
            </div>

            <div className="px-4 pb-5">
              <button
                type="button"
                className="w-full rounded-full text-white text-sm font-regular py-3 transition-colors cursor-pointer"
                style={{ backgroundColor: actionColors[idx % actionColors.length] }}
                onClick={() => navigate(`/dashboard/marketplace/bundles/${bundle.id}`)}
              >
                {bundle.actionLabel}
              </button>
            </div>
          </div>
        ))}
      </div>
      )}

      {/* Empty State */}
      {!isLoading && bundleCards.length === 0 && (
        <div className={`${tokens.cardBase} rounded-[20px] p-10 text-center`}>
          <p className={`text-lg ${tokens.isDark ? "text-white/70" : "text-[#718EBF]"}`}>
            No bundles available at the moment.
          </p>
        </div>
      )}
    </div>
  );
};



