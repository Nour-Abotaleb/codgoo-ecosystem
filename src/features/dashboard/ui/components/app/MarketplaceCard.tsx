import { ArrowUpIcon, AppTagIcon, MarketplaceWalletIcon, MarketplaceChartIcon } from "@utilities/icons";
import type { DashboardTokens } from "../../types";
import marketplaceAppImage from "@assets/images/app/marketplace-app.svg";

export type MarketplaceItem = {
  readonly id: string;
  readonly title: string;
  readonly description: string;
  readonly ethAmount?: string;
  readonly chartValue?: string;
  readonly image?: string;
};

type MarketplaceCardProps = {
  readonly item: MarketplaceItem;
  readonly tokens: DashboardTokens;
  readonly onClick?: () => void;
  readonly onLearnMore?: () => void;
};

export const MarketplaceCard = ({ item, tokens, onClick, onLearnMore }: MarketplaceCardProps) => {
  return (
    <div
      className={`${tokens.cardBase} rounded-2xl overflow-hidden transition-all cursor-pointer flex flex-col relative`}
      onClick={onClick}
    >
      {/* Top Image Section */}
      <div className="relative w-full h-48 bg-gradient-to-br from-purple-100 to-purple-200">
        <img
          src={item.image || marketplaceAppImage}
          alt={item.title}
          className="w-full h-full object-cover"
        />
        {/* Tag Icon */}
        <div className="absolute top-3 right-3">
          <div className="w-8 h-8 rounded-full bg-white/90 flex items-center justify-center">
            <AppTagIcon className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="p-4 flex flex-col gap-3 pb-16">
        {/* Placeholder Circle */}
        <div className="w-20 h-20 rounded-full bg-[#E7F0F1] flex items-center justify-center mx-auto -mt-10 mb-2 border-4 border-white">
          {/* Empty circle placeholder */}
        </div>

        {/* Title */}
        <h3 className={`text-lg font-bold text-center ${tokens.isDark ? "text-white" : "text-[#2B3674]"}`}>
          {item.title}
        </h3>

        {/* Description */}
        <p className={`text-sm text-center ${tokens.isDark ? "text-white/70" : "text-[#718EBF]"}`}>
          {item.description}
        </p>

        {/* Metrics */}
        <div className="flex items-center justify-center gap-4 mt-2">
          {item.ethAmount && (
            <div className="flex items-center gap-1.5">
              <MarketplaceWalletIcon className="w-4 h-4" />
              <span className={`text-sm font-medium ${tokens.isDark ? "text-white" : "text-[#2B3674]"}`}>
                {item.ethAmount}
              </span>
            </div>
          )}
          {item.chartValue && (
            <div className="flex items-center gap-1.5">
              <MarketplaceChartIcon className="w-4 h-4" />
              <span className={`text-sm font-medium ${tokens.isDark ? "text-white" : "text-[#2B3674]"}`}>
                {item.chartValue}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Action Icon - Bottom Right */}
      <div className="absolute bottom-4 right-4">
        <div 
          className="w-10 h-10 rounded-full bg-[#0F6773] flex items-center justify-center cursor-pointer hover:bg-[#0d5a65] transition-colors"
          onClick={(e) => {
            e.stopPropagation();
            onLearnMore?.();
          }}
        >
          <ArrowUpIcon className="w-5 h-5 text-white" />
        </div>
      </div>
    </div>
  );
};

