import { useMemo, useState } from "react";
import { useNavigate, useMatch } from "react-router-dom";
import toast from "react-hot-toast";
import type { DashboardTokens } from "../../types";
import { MarketplaceCard, type MarketplaceItem } from "./MarketplaceCard";
import { CheckoutView } from "./CheckoutView";
import { AppFilterIcon, ArrowRight } from "@utilities/icons";
import stars from "@assets/images/app/app-stars.svg";
import { useGetMarketplaceAppsQuery, useGetMarketplacePackagesQuery, useBuildBundleMutation } from "@/store/api/marketplace-api";
import { fallbackMarketplaceData } from "./marketplace-fallback-data";

type BundleAppsViewProps = {
  readonly tokens: DashboardTokens;
};

export const BundleAppsView = ({ tokens }: BundleAppsViewProps) => {
  const navigate = useNavigate();
  const match = useMatch("/dashboard/marketplace/bundles/:bundleId");
  const bundleId = match?.params?.bundleId;
  const [selectedAppIds, setSelectedAppIds] = useState<Set<string>>(new Set());
  const [showCheckout, setShowCheckout] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { data } = useGetMarketplaceAppsQuery();
  const { data: packagesData } = useGetMarketplacePackagesQuery();
  const [buildBundle] = useBuildBundleMutation();
  
  // Use API data if available, otherwise use fallback data
  const marketplaceData = useMemo(() => {
    if (data?.data && data.data.length > 0) {
      return data;
    }
    return fallbackMarketplaceData;
  }, [data]);

  // Transform marketplace data to MarketplaceItem format - Filter only General type
  const marketplaceItems = useMemo((): MarketplaceItem[] => {
    if (!marketplaceData?.data) return [];

    return marketplaceData.data
      .filter((app) => app.type === "General") // Only show General type apps
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
  }, [marketplaceData]);
  
  const selectedCount = selectedAppIds.size;

  // Get bundle details from API or fallback
  const bundleData = useMemo(() => {
    if (!bundleId) {
      return { title: "Professional Bundle", price: "500 EGP", limit: 6 };
    }

    // Try to find from API data
    if (packagesData?.data) {
      const found = packagesData.data.find(pkg => pkg.id.toString() === bundleId);
      if (found) {
        return {
          title: found.name,
          price: `${found.price.amount} ${found.price.currency}`,
          limit: found.apps_count
        };
      }
    }

    // Fallback to static lookup
    const bundleLookup = {
      "1": { title: "Starter Bundle", price: "300 EGP", limit: 1 },
      "2": { title: "Professional Bundle", price: "500 EGP", limit: 3 },
      "3": { title: "Enterprise Bundle", price: "1000 EGP", limit: 6 }
    } as const;

    return bundleLookup[bundleId as keyof typeof bundleLookup] || { title: "Professional Bundle", price: "500 EGP", limit: 6 };
  }, [bundleId, packagesData]);

  const heading = bundleData.title;
  const price = bundleData.price;
  const limit = bundleData.limit;

  const remaining = limit - selectedCount;
  const progressPercentage = limit > 0 ? (selectedCount / limit) * 100 : 0;
  const isComplete = selectedCount >= limit;

  const handleToggleSelection = (itemId: string) => {
    setSelectedAppIds(prev => {
      const newSet = new Set(prev);
      if (newSet.has(itemId)) {
        newSet.delete(itemId);
      } else {
        // Only allow selection if under limit
        if (newSet.size < limit) {
          newSet.add(itemId);
        }
      }
      return newSet;
    });
  };

  // Calculate original price from selected items
  const originalPrice = useMemo(() => {
    if (selectedAppIds.size === 0) return 0;
    return Array.from(selectedAppIds).reduce((total, itemId) => {
      const item = marketplaceItems.find(i => i.id === itemId);
      if (item?.price) {
        // Extract price number from "135 EGP" format
        const priceNum = parseInt(item.price.replace(" EGP", "").replace(/,/g, ""), 10);
        return total + (isNaN(priceNum) ? 0 : priceNum);
      }
      return total;
    }, 0);
  }, [selectedAppIds]);

  const bundlePrice = useMemo(() => {
    const priceStr = price.replace(" EGP", "").replace(/,/g, "");
    return parseInt(priceStr, 10);
  }, [price]);

  const savings = originalPrice - bundlePrice;
  const savingsPercentage = originalPrice > 0 ? Math.round((savings / originalPrice) * 100) : 0;

  const handlePurchaseBundle = async () => {
    if (!bundleId) {
      toast.error("Invalid bundle ID");
      return;
    }

    try {
      setIsSubmitting(true);
      
      // Get customer ID from localStorage
      const authUser = localStorage.getItem("auth_user");
      if (!authUser) {
        toast.error("Please login to continue");
        navigate("/login");
        return;
      }

      const user = JSON.parse(authUser);
      const customerId = parseInt(user.id, 10);

      if (isNaN(customerId)) {
        toast.error("Invalid user ID");
        return;
      }

      // Convert selected app IDs to numbers (can be empty array)
      const applicationIds = Array.from(selectedAppIds).map(id => parseInt(id, 10));

      // Build the request payload
      const payload = {
        bundleId: parseInt(bundleId, 10),
        customer: {
          id: customerId,
        },
        applications: applicationIds,
      };

      // Call the API
      const response = await buildBundle(payload).unwrap();

      if (response.status) {
        // Save bundle subscription to localStorage
        if (response.data?.bundleId) {
          try {
            const newSubscription = {
              id: response.data.id,
              bundle_package_id: response.data.bundleId,
              bundle_name: heading,
              status: response.data.status || "pending",
              expires_at: null,
              applications: []
            };

            const subscriptionsStr = localStorage.getItem("auth_subscriptions");
            let subscriptions = [];
            
            if (subscriptionsStr) {
              subscriptions = JSON.parse(subscriptionsStr);
              if (!Array.isArray(subscriptions)) {
                subscriptions = [];
              }
            }

            // Add new subscription
            subscriptions.push(newSubscription);
            localStorage.setItem("auth_subscriptions", JSON.stringify(subscriptions));
          } catch (error) {
            console.error("Error saving subscription to localStorage:", error);
          }
        }
        toast.success("Bundle subscription successful!");
        setShowCheckout(true);
      } else {
        toast.error(response.message || "Failed to subscribe to bundle");
        setShowCheckout(true);
      }
    } catch (error: any) {
      console.error("Bundle subscription error:", error);
      toast.error(error?.data?.message || "An error occurred while subscribing to the bundle");
      setShowCheckout(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Show checkout if enabled
  if (showCheckout) {
    return (
      <CheckoutView
        tokens={tokens}
        bundleTitle={heading}
        bundlePrice={price}
        selectedAppIds={selectedAppIds}
        bundleId={bundleId}
        onBack={() => setShowCheckout(false)}
      />
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {/* Bundle Details */}
      <div className={`flex flex-col gap-2 ${tokens.isDark ? "bg-[#1F2733]" : "bg-white"} rounded-[20px] p-4`}>
        <div className="flex items-center gap-3">
          <div className={`flex items-center gap-2 cursor-pointer ${tokens.isDark ? "bg-[#2a2a2a] text-[#34D8D6]" : "bg-[#E7F0F1] text-[#0F6773]"} rounded-full p-2 w-12 h-12 justify-center`} onClick={() => navigate("/dashboard/marketplace/bundles")}>
            <ArrowRight className="w-4 h-4 md:w-5 md:h-5 rotate-180" />
          </div>
          <div className="flex flex-col gap-1">
            <h1 className={`text-2xl font-bold ${tokens.isDark ? "text-white" : "text-[#142133]"}`}>
              Build Your Custom Bundle
            </h1>
            <p className={`text-sm md:text-base ${tokens.subtleText}`}>
              Choose applications and complete your {heading}
            </p>
          </div>
        </div>
        <div className={`${tokens.isDark ? "bg-[#2a2a2a]" : "bg-[#FAFAFA]"} rounded-[20px] p-6 mt-4`}>
          <div className="flex items-start justify-between gap-4 mb-2">
            <div className="flex flex-col gap-2 flex-1">
              <span className={`px-3 py-1 rounded-full ${tokens.isDark ? "bg-[#1a3a3a] text-[#34D8D6]" : "bg-[#EBFBFB] text-[#208483]"} text-sm font-medium flex items-center gap-1 w-fit`}>
                <img src={stars} alt="stars" className="" />
                Step 2: Choose Your Applications
              </span>
              <h2 className={`text-2xl font-medium ${tokens.isDark ? "text-white" : "text-black"}`}>
                {heading}
              </h2>
              <p className={`text-sm md:text-lg ${tokens.isDark ? "text-gray-400" : "text-[#5F5F5F]"}`}>
                Select {limit} applications to complete your bundle
              </p>
            </div>
            <div className="flex flex-col items-end text-right flex-shrink-0">
              <span className={`text-3xl font-semibold ${tokens.isDark ? "text-white" : "text-[#142133]"}`}>{price}</span>
              <span className={`text-lg ${tokens.isDark ? "text-gray-400" : "text-[#5F5F5F]"}`}>Fixed Price</span>
            </div>
          </div>
          <div className="flex items-center justify-between mb-2">
            <p className={`text-sm md:text-base ${tokens.isDark ? "text-gray-400" : "text-[#5F5F5F]"}`}>
              {selectedCount} of {limit} applications selected
            </p>
            <span className={`text-sm font-medium ${tokens.isDark ? "text-[#34D8D6]" : "text-[#208483]"} flex-shrink-0`}>
              {remaining >= 0 ? remaining : 0} remaining
            </span>
          </div>
          <div className="flex items-center gap-3">
            <div className={`flex-1 h-6 ${tokens.isDark ? "bg-[#1a1a1a]" : "bg-[#E9ECEA]"} rounded-full overflow-hidden`}>
              <div 
                className="h-full bg-gradient-to-r from-[#3B838D] to-[#0F6773] transition-all rounded-full duration-300"
                style={{ width: `${progressPercentage}%` }}
              />
            </div>
          </div>
        </div>
          {/* Pricing Breakdown - Show when all apps are selected */}
          {isComplete && (
            <div className="mt-4 mb-3 grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Original Price Card */}
              <div className={`${tokens.isDark ? "bg-[#2a2a2a]" : "bg-[#FAFAFA]"} rounded-[20px] p-6`}>
                <p className={`text-sm md:text-base mb-1 ${tokens.isDark ? "text-gray-400" : "text-[#5F5F5F]"}`}>Original Price</p>
                <p className={`text-xl md:text-2xl ${tokens.isDark ? "text-white" : "text-[#142133]"}`}>
                  {originalPrice.toLocaleString()} EGP
                </p>
              </div>

              {/* Bundle Price Card */}
              <div className={`${tokens.isDark ? "bg-[#2a2a2a]" : "bg-[#FAFAFA]"} rounded-[20px] p-6`}>
                <p className={`text-sm md:text-base mb-1 ${tokens.isDark ? "text-gray-400" : "text-[#5F5F5F]"}`}>Bundle Price</p>
                <p className={`text-xl md:text-2xl ${tokens.isDark ? "text-[#34D8D6]" : "text-[#34D8D6]"}`}>
                  {bundlePrice.toLocaleString()} EGP
                </p>
              </div>  

              {/* You Save Card */}
              <div className={`${tokens.isDark ? "bg-[#1a3a1a66] text-[#4ade80]" : "bg-[#E5F9E9] text-[#228C3D]"} rounded-[20px] p-6`}>
                <p className={`text-sm md:text-base mb-1 ${tokens.isDark ? "text-[#4ade80]" : "text-[#228C3D]"}`}>You Save</p>
                <p className={`text-xl md:text-2xl ${tokens.isDark ? "text-[#4ade80]" : "text-[#228C3D]"}`}>
                  {savings.toLocaleString()} EGP <span className="text-sm font-light">({savingsPercentage}%)</span>
                </p>
              </div>
            </div>
          )}
      </div>

      {/* Apps Section Title */}
      <div className="flex items-center justify-between">
        <h2 className={`text-xl md:text-2xl font-semibold ${tokens.isDark ? "text-white" : "text-[#142133]"}`}>
          General Services Apps
        </h2>
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

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {marketplaceItems.map((item) => {
          const isSelected = selectedAppIds.has(item.id);
          return (
            <MarketplaceCard
              key={item.id}
              item={item}
              tokens={tokens}
              isSelected={isSelected}
              isSelectable={selectedCount < limit || isSelected}
              onSelect={() => handleToggleSelection(item.id)}
              onLearnMore={(e) => {
                e.stopPropagation();
                navigate(`/dashboard/marketplace/${item.id}`);
              }}
            />
          );
        })}
      </div>

      {/* Purchase Popup - Always visible */}
      <div className={`sticky bottom-2 ${tokens.isDark ? "bg-[#1a1a1a] border-gray-700" : "bg-[#E5F2F4]"} p-6 z-50 mt-6 rounded-[20px]`}>
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex flex-col gap-1">
              <h3 className={`text-xl font-medium ${tokens.isDark ? "text-white" : "text-black"}`}>
                {selectedCount > 0 ? "Ready to Complete Your Bundle?" : "Select Apps to Get Started"}
              </h3>
              <p className={`text-sm md:text-lg ${tokens.isDark ? "text-gray-400" : "text-[#5F5F5F]"}`}>
                {selectedCount === 0 ? (
                  <>Choose up to {limit} applications for your {heading}</>
                ) : isComplete ? (
                  <>You'll save <span className="text-[#228C3D]">{savings} EGP ({savingsPercentage}%)</span> with this bundle</>
                ) : (
                  <>You've selected {selectedCount} of {limit} applications</>
                )}
              </p>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex flex-col items-end">
                <span className={`text-sm md:text-base ${tokens.isDark ? "text-gray-400" : "text-[#5F5F5F]"}`}>Total Price</span>
                <span className={`text-2xl font-medium ${tokens.isDark ? "text-white" : "text-black"}`}>{price}</span>
              </div>
            </div>
          </div>
          <button
            type="button"
            className="px-8 py-2.5 mt-8 w-full bg-[#0F6773] text-white rounded-full text-base md:text-lg hover:bg-[#0d5a65] transition-colors disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-[#0F6773]"
            onClick={handlePurchaseBundle}
            disabled={isSubmitting}
          >
            {isSubmitting ? "Processing..." : "Purchase Bundle Now"}
          </button>
        </div>
      </div>
  );
};

