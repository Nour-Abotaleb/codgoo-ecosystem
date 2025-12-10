import { useState, useMemo } from "react";
import { SearchIcon, SnapChatIcon, RedditIcon, PrintIcon } from "@utilities/icons";
import type { DashboardTokens } from "../../types";
import { MarketplaceCard, type MarketplaceItem } from "./MarketplaceCard";

type MarketplaceViewProps = {
  readonly tokens: DashboardTokens;
  readonly onItemClick?: (itemId: string) => void;
};

type Category = "All" | "Music" | "Collections" | "Sports";

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
  const [activeCategory, setActiveCategory] = useState<Category>("All");
  const [searchQuery, setSearchQuery] = useState("");

  const categories: readonly Category[] = ["All", "Music", "Collections", "Sports"];

  const filteredItems = useMemo(() => {
    let filtered = marketplaceItems;

    // Filter by category
    if (activeCategory !== "All") {
      // In a real app, items would have category metadata
      // For now, we'll just return all items (no filtering needed)
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (item) =>
          item.title.toLowerCase().includes(query) ||
          item.description.toLowerCase().includes(query)
      );
    }

    return filtered;
  }, [activeCategory, searchQuery]);

  return (
    <div className="flex flex-col gap-6">
      {/* Category Tabs */}
      <div className="flex items-center gap-2 flex-wrap">
        {categories.map((category) => (
          <button
            key={category}
            type="button"
            onClick={() => setActiveCategory(category)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              activeCategory === category
                ? tokens.isDark
                  ? "bg-[#0F6773] text-white"
                  : "bg-[#0F6773] text-white"
                : tokens.isDark
                ? "bg-[var(--color-card-bg)] text-white/70 hover:text-white"
                : "bg-white text-[#718EBF] hover:text-[#2B3674]"
            }`}
          >
            {category}
          </button>
        ))}
      </div>

      {/* Marketplace Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredItems.map((item) => (
          <MarketplaceCard
            key={item.id}
            item={item}
            tokens={tokens}
            onClick={() => onItemClick?.(item.id)}
            onLearnMore={() => onItemClick?.(item.id)}
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
