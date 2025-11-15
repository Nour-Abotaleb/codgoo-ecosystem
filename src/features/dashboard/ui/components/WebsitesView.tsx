import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

import { TechIcon, DotsSwitcher, ArrowUpIcon } from "@utilities/icons";

import type { DashboardTokens, SiteItem } from "../types";

type WebsitesViewProps = {
  readonly sites: readonly SiteItem[];
  readonly tokens: DashboardTokens;
};

const WebsiteCard = ({
  site,
  tokens,
  onMenuToggle,
  isMenuOpen
}: {
  readonly site: SiteItem;
  readonly tokens: DashboardTokens;
  readonly onMenuToggle: () => void;
  readonly isMenuOpen: boolean;
}) => {
  const navigate = useNavigate();
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isMenuOpen) return;

    const handleClickOutside = (event: MouseEvent) => {
      if (!menuRef.current?.contains(event.target as Node)) {
        onMenuToggle();
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onMenuToggle();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [isMenuOpen, onMenuToggle]);

  const menuActions = [
    { id: "favorites", label: "Add to favorites" },
    { id: "tag", label: "Add tag" },
    { id: "change-domain", label: "Change Domain" },
    { id: "details", label: "Website Details" },
    { id: "delete", label: "Delete" }
  ] as const;

  return (
    <div className={`relative rounded-[24px] px-6 py-4 transition-colors hover:border-[#7469C7] ${tokens.isDark ? "bg-[#F4F4FF11]" : "bg-[#F4F4FF]"}`}>

      {/* Domain Name */}
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-[var(--color-page-text)]">
          {site.name}
        </h3>
        {/* Kebab Menu */}
        <div className="relative" ref={menuRef}>
          <button
            type="button"
            onClick={onMenuToggle}
            className={`flex h-8 w-8 items-center justify-center rounded-full transition-colors duration-200 hover:opacity-90 ${tokens.isDark ? "text-white/70 hover:text-white" : "text-[#584ABC] hover:text-[#7469C7]"}`}
            aria-label={`Menu for ${site.name}`}
          >
            <DotsSwitcher className="h-6 w-6" />
          </button>
          {isMenuOpen ? (
            <div
              className={`absolute right-0 top-full z-20 w-56 rounded-2xl border p-1 text-left shadow-xl ${
                tokens.isDark
                  ? "border-white/10 bg-[#141325]"
                  : "border-gray-200 bg-white"
              }`}
            >
              <ul className="flex flex-col">
                {menuActions.map((action) => (
                  <li key={action.id}>
                    <button
                      type="button"
                      className={`w-full rounded-xl px-4 py-2 text-left text-sm font-medium transition ${
                        tokens.isDark
                          ? "text-slate-100 hover:bg-white/10 hover:text-white"
                          : "text-black hover:bg-gray-100 hover:text-black"
                      }`}
                    >
                      {action.label}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
        </div>
      </div>

      {/* Technology Type */}
      <div className="mb-6 flex items-center gap-2">
        <TechIcon 
          className={`h-4 w-4 ${tokens.isDark ? "" : "[&_path]:fill-[#584ABC]"}`}
        />
        <span className={`text-sm font-semibold ${tokens.subtleText} ${tokens.isDark ? "text-white/70" : "!text-[#3E3484]"}`}>{site.type}</span>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center justify-end cursor-pointer w-full pt-4 pb-2" onClick={() => navigate(`/dashboard/manage-website/${site.id}`)}>
        <button
          type="button"
          className={`${tokens.isDark ? "bg-white/20 hover:bg-white/10 text-white" : "bg-white hover:bg-gray-100"} transition text-[#584ABC] w-[90%] flex justify-center cursor-pointer flex items-center gap-2 rounded-full px-8 py-3 text-sm md:text-base font-semibold`}
        >
          Dashboard
        </button>
        <div className={`w-11 h-11 bg-white rounded-full flex items-center justify-center text-center -ms-2 transition ${tokens.isDark ? "bg-white/20 hover:bg-white/10 text-white" : "bg-white hover:bg-gray-100"}`}>
            <ArrowUpIcon className="w-6 h-6 p-1 bg-gradient-to-b from-[#8A72FC] to-[#4318FF] rounded-full" />
        </div>
        </div>
      </div>
  );
};

export const WebsitesView = ({ sites, tokens }: WebsitesViewProps) => {
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const hasSites = sites.length > 0;
  const totalCount = sites.length;
  const pageSize = 12; // 3 columns x 4 rows
  const totalPages = Math.ceil(totalCount / pageSize);
  const [currentPage, setCurrentPage] = useState(1);

  const paginatedSites = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    const end = start + pageSize;
    return sites.slice(start, end);
  }, [sites, currentPage, pageSize]);

  const filledButtonClass = useMemo(
    () =>
      `rounded-full px-4 py-1.5 text-sm font-semibold inline-flex items-center bg-[#7469C7] text-white`,
    []
  );

  const handleToggleMenu = (siteId: string) => {
    setOpenMenuId(openMenuId === siteId ? null : siteId);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    setOpenMenuId(null); // Close any open menus when changing pages
  };

  const renderPagination = () => {
    const pages: (number | string)[] = [];
    
    if (totalPages <= 7) {
      // Show all pages if 7 or fewer
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Show first page
      pages.push(1);
      
      if (currentPage > 3) {
        pages.push("...");
      }
      
      // Show pages around current page
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
      
      // Show last page
      pages.push(totalPages);
    }

    return (
      <div className="flex items-center justify-center gap-2">
        <button
          type="button"
          onClick={() => handlePageChange(1)}
          disabled={currentPage === 1}
          className={`${tokens.buttonGhost} rounded-full px-3 py-1 text-xs font-semibold disabled:opacity-50`}
        >
          ««
        </button>
        <button
          type="button"
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className={`${tokens.buttonGhost} rounded-full px-3 py-1 text-xs font-semibold disabled:opacity-50`}
        >
          «
        </button>
        {pages.map((page, index) => {
          if (page === "...") {
            return (
              <span
                key={`ellipsis-${index}`}
                className="px-2 py-1 font-semibold text-[var(--color-page-text)]"
              >
                …
              </span>
            );
          }
          const pageNum = page as number;
          const isCurrent = pageNum === currentPage;
          return (
            <button
              key={pageNum}
              type="button"
              onClick={() => handlePageChange(pageNum)}
              className={`${
                isCurrent ? tokens.buttonFilled : tokens.buttonGhost
              } rounded-full px-3 py-1 text-xs font-semibold`}
            >
              {pageNum}
            </button>
          );
        })}
        <button
          type="button"
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className={`${tokens.buttonGhost} rounded-full px-3 py-1 text-xs font-semibold disabled:opacity-50`}
        >
          »
        </button>
        <button
          type="button"
          onClick={() => handlePageChange(totalPages)}
          disabled={currentPage === totalPages}
          className={`${tokens.buttonGhost} rounded-full px-3 py-1 text-xs font-semibold disabled:opacity-50`}
        >
          »»
        </button>
      </div>
    );
  };

  return (
    <div className="flex flex-col gap-6">
      <div className={`${tokens.cardBase} rounded-[28px] border border-[var(--color-card-border)] py-4 px-6 transition-colors`}>
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div>
            <h2 className={`text-2xl font-semibold md:text-3xl ${tokens.isDark ? "text-white" : "text-[#2B3674]"}`}>
              Managed Sites
            </h2>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <button
              type="button"
              className={`${filledButtonClass} gap-2 py-2`}
            >
              <span className="inline-flex h-6 w-6 items-center justify-center text-sm rounded-full bg-white text-[#584ABC]">
                +
              </span>
              Add New Website
            </button>
          </div>
        </div>

        {/* Website Cards Grid */}
        {hasSites ? (
          <>
            <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {paginatedSites.map((site) => (
                <WebsiteCard
                  key={site.id}
                  site={site}
                  tokens={tokens}
                  onMenuToggle={() => handleToggleMenu(site.id)}
                  isMenuOpen={openMenuId === site.id}
                />
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-8 flex justify-center">
                {renderPagination()}
              </div>
            )}
          </>
        ) : (
          <div className="mt-8 rounded-xl bg-[var(--color-table-row-bg)] px-6 py-12 text-center text-sm transition-colors">
            <p className="text-base font-semibold">
              No websites found yet
            </p>
            <p className={`mt-2 ${tokens.subtleText}`}>
              Add a new website to start managing your sites from this dashboard.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

