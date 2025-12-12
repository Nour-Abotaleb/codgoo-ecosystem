import { useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import type { DashboardTokens } from "../../types";
import { marketplaceItems } from "./MarketplaceView";
import { MarketplaceCard } from "./MarketplaceCard";

const bundleLookup = {
  starter: { title: "Starter Bundle", price: "300 EGP", limit: 3 },
  professional: { title: "Professional Bundle", price: "500 EGP", limit: 6 },
  enterprise: { title: "Enterprise Bundle", price: "1000 EGP", limit: 10 }
} as const;

type BundleAppsViewProps = {
  readonly tokens: DashboardTokens;
};

export const BundleAppsView = ({ tokens }: BundleAppsViewProps) => {
  const navigate = useNavigate();
  const { bundleId } = useParams<{ bundleId: string }>();

  const bundle = useMemo(() => {
    if (!bundleId) return null;
    return bundleLookup[bundleId as keyof typeof bundleLookup] ?? null;
  }, [bundleId]);

  const heading = bundle?.title ?? "Bundle";
  const price = bundle?.price ?? "";
  const limit = bundle?.limit ?? 0;

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div className="flex flex-col gap-1">
            <h1 className={`text-2xl font-semibold ${tokens.isDark ? "text-white" : "text-[#142133]"}`}>
              Build Your Custom Bundle
            </h1>
            <p className={`text-sm ${tokens.subtleText}`}>
              Choose applications and complete your {heading}
            </p>
          </div>
          <button
            type="button"
            onClick={() => navigate("/dashboard/marketplace/bundles")}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              tokens.isDark ? "bg-white/10 text-white hover:bg-white/20" : "bg-white text-[#0F6773] shadow"
            }`}
          >
            Change Bundle
          </button>
        </div>
        <div className={`${tokens.cardBase} rounded-2xl p-4 flex items-center justify-between flex-wrap gap-3`}>
          <div className="flex items-center gap-3 text-sm">
            <span className="px-3 py-1 rounded-full bg-[#EBFBFB] text-[#208483] text-xs font-medium">
              Step 2: Choose Your Applications
            </span>
            {limit > 0 ? (
              <span className={tokens.subtleText}>Select {limit} applications to complete your bundle</span>
            ) : null}
          </div>
          <div className="flex flex-col items-end text-right">
            {price ? <span className="text-lg font-semibold">{price}</span> : null}
            <span className={`text-xs ${tokens.subtleText}`}>Fixed Price</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {marketplaceItems.map((item) => (
          <MarketplaceCard
            key={item.id}
            item={item}
            tokens={tokens}
            onClick={() => navigate(`/dashboard/marketplace/${item.id}`)}
            onLearnMore={() => navigate(`/dashboard/marketplace/${item.id}`)}
          />
        ))}
      </div>
    </div>
  );
};

