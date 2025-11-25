import { useState, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { i18n } from "@shared/config/i18n";
import { SearchIcon } from "@utilities/icons";
import type { DashboardTokens } from "../../types";
import { MarketplaceCard, type MarketplaceItem } from "./MarketplaceCard";
import marketplaceAppImage from "@assets/images/app/marketplace-app.svg";

type MarketplaceViewProps = {
  readonly tokens: DashboardTokens;
  readonly onItemClick?: (itemId: string) => void;
};

// Sample marketplace data - in a real app, this would come from an API
export const marketplaceItems: readonly MarketplaceItem[] = Array.from({ length: 9 }).map((_, i) => ({
  id: `fix-mate-${i + 1}`,
  title: "Fix Mate",
  description: "Manage your sales and track orders",
  ethAmount: "0.91 ETH",
  chartValue: "1.2K",
  image: marketplaceAppImage
}));

export const MarketplaceView = ({ tokens, onItemClick }: MarketplaceViewProps) => {
  const { t } = useTranslation("dashboard");
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const itemsPerPage = 9;
  const isRTL = i18n.language === "ar";

  const filteredItems = useMemo(() => {
    let filtered = marketplaceItems;

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
  }, [searchQuery]);

  const totalPages = Math.ceil(filteredItems.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentItems = filteredItems.slice(startIndex, endIndex);

  const renderPagination = () => {
    const pages: (number | string)[] = [];
    
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      pages.push(1);
      
      if (currentPage > 3) {
        pages.push("...");
      }
      
      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);
      
      for (let i = start; i <= end; i++) {
        if (i !== 1 && i !== totalPages) {
          pages.push(i);
        }
      }
      
      if (currentPage < totalPages - 2) {
        pages.push("...");
      }
      
      pages.push(totalPages);
    }

    return (
      <div className="flex items-center justify-center gap-2 mt-6">
        <button
          type="button"
          onClick={() => setCurrentPage(1)}
          disabled={currentPage === 1}
          className={`px-3 py-1 rounded ${tokens.isDark ? "text-white/70" : "text-[#718EBF]"} ${
            currentPage === 1 ? "opacity-50 cursor-not-allowed" : "hover:text-[#0F6773]"
          }`}
        >
          &lt;&lt;
        </button>
        <button
          type="button"
          onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
          disabled={currentPage === 1}
          className={`px-3 py-1 rounded ${tokens.isDark ? "text-white/70" : "text-[#718EBF]"} ${
            currentPage === 1 ? "opacity-50 cursor-not-allowed" : "hover:text-[#0F6773]"
          }`}
        >
          &lt;
        </button>
        
        {pages.map((page, index) => {
          if (page === "...") {
            return (
              <span key={`ellipsis-${index}`} className={`px-2 ${tokens.isDark ? "text-white/50" : "text-[#718EBF]"}`}>
                ...
              </span>
            );
          }
          
          const pageNum = page as number;
          const isActive = pageNum === currentPage;
          
          return (
            <button
              key={pageNum}
              type="button"
              onClick={() => setCurrentPage(pageNum)}
              className={`px-4 py-1 rounded ${
                isActive
                  ? "bg-[#0F6773] text-white"
                  : tokens.isDark
                  ? "text-white/70 hover:text-white"
                  : "text-[#718EBF] hover:text-[#0F6773]"
              }`}
            >
              {pageNum}
            </button>
          );
        })}
        
        <button
          type="button"
          onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
          disabled={currentPage === totalPages}
          className={`px-3 py-1 rounded ${tokens.isDark ? "text-white/70" : "text-[#718EBF]"} ${
            currentPage === totalPages ? "opacity-50 cursor-not-allowed" : "hover:text-[#0F6773]"
          }`}
        >
          &gt;
        </button>
        <button
          type="button"
          onClick={() => setCurrentPage(totalPages)}
          disabled={currentPage === totalPages}
          className={`px-3 py-1 rounded ${tokens.isDark ? "text-white/70" : "text-[#718EBF]"} ${
            currentPage === totalPages ? "opacity-50 cursor-not-allowed" : "hover:text-[#0F6773]"
          }`}
        >
          &gt;&gt;
        </button>
      </div>
    );
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Header with Search */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-start">
        {/* Search Input */}
        <div className="relative flex-1 max-w-md">
          <SearchIcon
            className={`absolute ${isRTL ? "right-3" : "left-3"} top-1/2 transform -translate-y-1/2 h-5 w-5 ${
              tokens.isDark ? "text-white/50" : "text-[#A3AED0]"
            }`}
          />
          <input
            type="text"
            placeholder={t("marketplace.searchPlaceholder")}
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
            }}
            className={`w-full ${isRTL ? "pr-10 pl-4" : "pl-10 pr-4"} py-2.5 rounded-full border transition-colors ${
              tokens.isDark
                ? "bg-[var(--color-card-bg)] border-[var(--color-card-border)] text-white placeholder-white/50"
                : "bg-white border-[#E6E9FB] text-[#2B3674] placeholder-[#A3AED0]"
            } focus:outline-none focus:ring-1 focus:ring-[#071FD7]/20`}
          />
        </div>
      </div>

      {/* Marketplace Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {currentItems.map((item) => (
          <MarketplaceCard
            key={item.id}
            item={item}
            tokens={tokens}
            onClick={() => onItemClick?.(item.id)}
            onLearnMore={() => onItemClick?.(item.id)}
          />
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && renderPagination()}

      {/* Empty State */}
      {filteredItems.length === 0 && (
        <div
          className={`${tokens.cardBase} rounded-2xl border border-[var(--color-card-border)] p-10 text-center`}
        >
          <p className={`text-lg ${tokens.isDark ? "text-white/70" : "text-[#718EBF]"}`}>
            <span className="text-start">{t("marketplace.noItemsFound")}</span>
          </p>
        </div>
      )}
    </div>
  );
};

