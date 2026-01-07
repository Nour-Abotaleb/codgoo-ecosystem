import { useState, useMemo, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import {
  ActiveIcon,
  DeleteIcon,
  SettingsIcon,
  PendingIcon,
  SearchIcon,
   plus as PlusIcon 
} from "@utilities/icons";

import type {
  DashboardTokens,
  ServerService
} from "../../types";

type ServerServicesViewProps = {
  readonly services: readonly ServerService[];
  readonly tokens: DashboardTokens;
  readonly onOpenService?: (serviceId: string) => void;
};

type ServerTab = "all" | "uninstalled";

export const ServerServicesView = ({
  services,
  tokens,
  onOpenService
}: ServerServicesViewProps) => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<ServerTab>("all");

  const [searchQuery, setSearchQuery] = useState("");

  const filteredServices = useMemo(() => {
    let result = activeTab === "uninstalled"
      ? services.filter((service) => service.status === "Pending")
      : services;

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter((service) =>
        service.product.toLowerCase().includes(query) ||
        service.plan.toLowerCase().includes(query) ||
        service.pricing.toLowerCase().includes(query) ||
        service.status.toLowerCase().includes(query)
      );
    }

    return result;
  }, [services, activeTab, searchQuery]);

  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 20;
  const totalRecords = 100;
  const totalPages = Math.ceil(totalRecords / pageSize);

  const paginatedServices = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    const end = start + pageSize;
    return filteredServices.slice(start, end);
  }, [filteredServices, currentPage, pageSize]);

  useEffect(() => {
    setCurrentPage(1);
  }, [activeTab, searchQuery]);

  const allCount = services.length;
  const uninstalledCount = services.filter((service) => service.status === "Pending").length;

  const manageButtonClass = useMemo(
    () =>
      `${tokens.buttonGhost} flex h-10 w-10 items-center justify-center cursor-pointer rounded-full transition-colors duration-200 hover:opacity-90`,
    [tokens.buttonGhost]
  );

  const tableHeaderClass = useMemo(
    () =>
      `text-sm tracking-widest uppercase ${tokens.subtleText}`,
    [tokens.subtleText]
  );

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

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
      <div className="flex flex-wrap items-center gap-2">
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
      <div className={`${tokens.cardBase} rounded-[20px] py-4 px-6 transition-colors`}>
        {/* <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className={`text-2xl font-semibold md:text-3xl ${tokens.isDark ? "text-white" : "text-[#2B3674]"}`}>All Servers</h2>
          </div>
        </div> */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4 rounded-full p-1">
            <button
              type="button"
              onClick={() => setActiveTab("all")}
              className={
                activeTab === "all"
                  ? `${tokens.buttonFilled} rounded-full px-5 py-2 text-sm font-semibold`
                  : `${tokens.buttonGhost} rounded-full px-4 py-2 text-sm font-medium tracking-[0.05em]`
              }
            >
              All ({allCount})
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("uninstalled")}
              className={
                activeTab === "uninstalled"
                  ? `${tokens.buttonFilled} rounded-full px-5 py-2 text-sm font-semibold`
                  : `${tokens.buttonGhost} rounded-full px-4 py-2 text-sm font-medium tracking-[0.05em]`
              }
            >
              Uninstalled ({uninstalledCount})
            </button>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <div
              className={`flex h-11 w-full items-center gap-3 rounded-full px-4 sm:w-68 border ${tokens.divider} bg-transparent stroke text-[var(--color-search-text)] transition-colors`}
            >
              <SearchIcon className="w-5 text-[var(--color-search-placeholder)]" />
              <input
                type="search"
                placeholder="Search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1 bg-transparent text-sm text-[var(--color-search-text)] placeholder:text-[var(--color-search-placeholder)] focus:outline-none"
              />
            </div>
            <button
              type="button"
              onClick={() => navigate("/dashboard/order")}
              className={`${tokens.buttonFilled} inline-flex items-center justify-center gap-1 cursor-pointer rounded-full px-3 py-2 text-sm font-semibold`}
            >
                   <PlusIcon className="h-4 w-4" />

              Order New Server
            </button>
          </div>
        </div>

        <div className="mt-2 overflow-x-auto">
          <table className="min-w-full table-auto border-separate border-spacing-y-2">
            <thead className={tokens.isDark ? "" : "bg-[#F7F6FF]"}>
              <tr className="[&>th]:border-y [&>th]:border-[var(--color-border-divider)]">
                <th className="whitespace-nowrap py-3 pe-6 text-left">
                  <span className={tableHeaderClass}>Product/Server</span>
                </th>
                <th className="whitespace-nowrap py-3 pe-6 text-left">
                  <span className={tableHeaderClass}>Pricing</span>
                </th>
                <th className="whitespace-nowrap py-3 pe-6 text-left">
                  <span className={tableHeaderClass}>Next Due Date</span>
                </th>
                <th className="whitespace-nowrap py-3 pe-6 text-left">
                  <span className={tableHeaderClass}>Status</span>
                </th>
                <th className="whitespace-nowrap py-3 text-left">
                  <span className={tableHeaderClass}>Manage</span>
                </th>
              </tr>
            </thead>
            <tbody>
              {paginatedServices.map((service) => {
                return (
                  <tr key={service.id} className="text-sm">
                    <td className={`whitespace-nowrap px-6 py-3 pe-6 rounded-l-xl  transition-colors ${tokens.isDark ? "bg-[#0F1217]" : ""}`}>
                      <div className="flex flex-wrap items-center gap-3">
                        <input
                          type="checkbox"
                          className="h-4 w-4 rounded border-[var(--color-border-divider)] bg-transparent accent-[#584ABC] text-black transition-colors"
                          aria-label={`Select ${service.product}`}
                        />
                        <div className="flex gap-1 font-medium">
                          <p className="">{service.product}</p>
                          <p className={`text-sm ${tokens.subtleText}`}>
                            {service.plan}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="whitespace-nowrap px-6 py-3 pe-6  transition-colors">
                      <div>
                        <p className="font-medium">{service.pricing}</p>
                        <p className={`mt-1 text-sm ${tokens.subtleText}`}>
                          {service.billingCycle}
                        </p>
                      </div>
                    </td>
                    <td className="whitespace-nowrap px-6 py-3 pe-6  transition-colors">
                      <p className="font-medium">{service.nextDueDate}</p>
                    </td>
                    <td className="whitespace-nowrap px-6 py-3 pe-6 transition-colors">
                      <span
                        className={`inline-flex items-center gap-1 text-sm font-medium ${
                          tokens.isDark ? "text-white" : "text-[#2B3674]"
                        }`}
                      >
                        {service.status === "Pending" ? <PendingIcon className="h-5 w-5" /> : <ActiveIcon className="h-5 w-5" />}
                        {service.status}
                      </span>
                    </td>
                    <td className="whitespace-nowrap px-6 py-3 rounded-r-xl  transition-colors">
                      <div className="flex flex-wrap items-center gap-3">
                        <button
                          type="button"
                          className={manageButtonClass}
                          aria-label={`Manage ${service.product}`}
                          onClick={() => onOpenService?.(service.id)}
                        >
                          <SettingsIcon className="h-4 w-4" />
                        </button>
                        <button
                          type="button"
                          className={manageButtonClass}
                          aria-label={`Server actions for ${service.product}`}
                        >
                          <DeleteIcon className={`h-4 w-4 ${tokens.isDark ? "" : "[&_path]:fill-[#584ABC]"}`} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {totalPages > 0 && (
          <div className="mt-6 flex flex-col items-center justify-between gap-4 border-t border-[var(--color-border-divider)] pt-4 text-xs text-[var(--color-sidebar-nav-idle-text)] transition-colors sm:flex-row">
            {renderPagination()}

            <div className="flex flex-wrap items-center gap-2 text-sm text-[var(--color-page-text)]">
              <span>Showing</span>
              <select className="rounded-lg border border-[var(--color-border-divider)] px-2 py-1 text-sm focus:outline-none">
                <option value="20">20</option>
                <option value="50">50</option>
                <option value="100">100</option>
              </select>
              <span>of {totalRecords}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

