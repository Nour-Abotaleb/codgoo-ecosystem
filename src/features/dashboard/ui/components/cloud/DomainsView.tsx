import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  DotsSwitcher,
  PendingIcon,
  ActiveIcon,
  UnpaidIcon,
  SearchIcon,
  SettingsIcon,
     plus as PlusIcon 
} from "@utilities/icons";

import type { DashboardTokens, DomainItem } from "../../types";

type DomainsViewProps = {
  readonly domains: readonly DomainItem[];
  readonly tokens: DashboardTokens;
};

type DomainTab = "all" | "auto-renew";


const renderStatusIcon = (status: DomainItem["status"]) => {
  if (status === "Active") {
    return <ActiveIcon className="h-5 w-5" />;
  }

  if (status === "Pending") {
    return <PendingIcon className="h-5 w-5" />;
  }

  if (status === "Fraud") {
    return <UnpaidIcon className="h-5 w-5" />;
  }

  return (
    <span className="flex h-2.5 w-2.5 items-center justify-center rounded-full bg-current" />
  );
};


export const DomainsView = ({ domains, tokens }: DomainsViewProps) => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<DomainTab>("all");
  const [openActionsId, setOpenActionsId] = useState<string | null>(null);
  const actionsRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const [autoRenewStatus, setAutoRenewStatus] = useState<Record<string, boolean>>(() => {
    const initialStatus: Record<string, boolean> = {};
    domains.forEach((domain) => {
      initialStatus[domain.id] = domain.autoRenew;
    });
    return initialStatus;
  });

  const [searchQuery, setSearchQuery] = useState("");

  const filteredDomains = useMemo(() => {
    let result = activeTab === "auto-renew"
      ? domains.filter((domain) => autoRenewStatus[domain.id] ?? domain.autoRenew)
      : domains;

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter((domain) =>
        domain.name.toLowerCase().includes(query)
      );
    }

    return result;
  }, [domains, activeTab, autoRenewStatus, searchQuery]);

  useEffect(() => {
    setCurrentPage(1);
  }, [activeTab, searchQuery]);

  const hasDomains = filteredDomains.length > 0;
  const totalCount = domains.length;
  const autoRenewCount = Object.values(autoRenewStatus).filter(Boolean).length;
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 20;
  const totalRecords = 100;
  const totalPages = Math.ceil(totalRecords / pageSize);

  const paginatedDomains = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    const end = start + pageSize;
    return filteredDomains.slice(start, end);
  }, [filteredDomains, currentPage, pageSize]);

  useEffect(() => {
    const newStatus: Record<string, boolean> = {};
    domains.forEach((domain) => {
      newStatus[domain.id] = autoRenewStatus[domain.id] ?? domain.autoRenew;
    });
    setAutoRenewStatus(newStatus);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [domains]);

  const actions = useMemo(
    () => [
      { id: "contact-info", label: "Change Contact Details" },
      { id: "renew", label: "Edit DNS zone" },
    ] as const,
    []
  );

  useEffect(() => {
    if (!openActionsId) {
      return;
    }

    const handleClickOutside = (event: MouseEvent) => {
      const ref = actionsRefs.current[openActionsId];
      if (ref && !ref.contains(event.target as Node)) {
        setOpenActionsId(null);
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpenActionsId(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [openActionsId]);

  const handleSelectAction = () => {
    // Handle action selection
    setOpenActionsId(null);
  };

  const handleToggleAutoRenew = (domainId: string) => {
    setAutoRenewStatus((prev) => ({
      ...prev,
      [domainId]: !prev[domainId],
    }));
  };

  const handleOpenDomainOverview = (domain: DomainItem) => {
    navigate(`/dashboard/manage-domain/${domain.id}`);
  };

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
      <div className="flex items-center gap-2">
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

  const manageButtonClass = useMemo(
    () =>
      `${tokens.buttonGhost} flex h-9 w-9 items-center justify-center rounded-full transition-colors duration-200 hover:opacity-90`,
    [tokens.buttonGhost]
  );

  const filledButtonClass = useMemo(
    () =>
      `rounded-full px-4 py-1.5 text-sm font-semibold inline-flex items-center bg-[#7469C7] text-white`,
    []
  );

  const tableHeaderClass = useMemo(
    () =>
      `text-sm uppercase font-medium ${tokens.subtleText}`,
    [tokens.subtleText]
  );

  return (
    <div className="flex flex-col gap-6">
      <div className={`${tokens.cardBase} rounded-[20px] py-4 px-6 transition-colors`}>
          <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            {/* <div>
              <h2 className={`text-2xl font-semibold md:text-3xl ${tokens.isDark ? "text-white" : "text-[#2B3674]"}`}>
                All Domains
              </h2>
            </div> */}
            
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3 text-sm font-medium">
              <button
                type="button"
                onClick={() => setActiveTab("all")}
                className={
                  activeTab === "all"
                    ? `${filledButtonClass} px-5 py-2 text-sm font-semibold`
                    : `${tokens.buttonGhost} rounded-full px-4 py-2 text-sm font-medium`
                }
              >
                All Domains ({totalCount})
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("auto-renew")}
                className={
                  activeTab === "auto-renew"
                    ? `${filledButtonClass} px-5 py-2 text-sm font-semibold`
                    : `${tokens.buttonGhost} rounded-full px-4 py-2 text-sm font-medium`
                }
              >
                Auto Renew ({autoRenewCount})
              </button>
            </div>
          </div>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <div
                className={`flex h-11 w-full items-center gap-3 rounded-full border ${tokens.divider} bg-transparent stroke px-4 text-[var(--color-search-text)] transition-colors sm:w-72`}
              >
                <SearchIcon className="h-5 w-5 text-[var(--color-search-placeholder)]" />
                <input
                  type="search"
                  placeholder="Search domains"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="flex-1 bg-transparent text-sm text-[var(--color-search-text)] placeholder:text-[var(--color-search-placeholder)] focus:outline-none"
                />
              </div>
              <button
                type="button"
                onClick={() => navigate("/dashboard/manage-nameservers")}
                className={`${filledButtonClass} gap-2 py-2.5 cursor-pointer`}
              >
             <PlusIcon className="h-4 w-4" />
                Register Domain
              </button>
            </div>
          </div>

          <div className="mt-3 overflow-x-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
            <table className="min-w-full table-auto border-separate border-spacing-y-2">
              <thead className={tokens.isDark ? "" : "bg-[#F7F6FF]"}>
                <tr className="[&>th]:border-y [&>th]:border-[var(--color-border-divider)]">
                  <th className="whitespace-nowrap py-3 pe-6 text-left">
                    <span className={tableHeaderClass}>Domain</span>
                  </th>
                  <th className="whitespace-nowrap py-3 pe-6 text-left">
                    <span className={tableHeaderClass}>Registration Date</span>
                  </th>
                  <th className="whitespace-nowrap py-3 pe-6 text-left">
                    <span className={tableHeaderClass}>Next Due Date</span>
                  </th>
                  <th className="whitespace-nowrap py-3 pe-6 text-left">
                    <span className={tableHeaderClass}>Auto Renew</span>
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
                {hasDomains ? (
                  paginatedDomains.map((domain) => {
                    return (
                      <tr
                        key={domain.id}
                        className="text-sm"
                      >
                        <td className="rounded-l-xl px-6 py-4 transition-colors">
                          <div className="flex items-center gap-3">
                            <input
                              type="checkbox"
                              className="h-4 w-4 rounded border-[var(--color-border-divider)] bg-transparent accent-[#584ABC] transition-colors"
                              aria-label={`Select ${domain.name}`}
                            />
                            <div>
                              <p className="text-base font-semibold">{domain.name}</p>
                              <p className={`text-xs ${tokens.subtleText}`}>
                                Private registration active
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 transition-colors">
                          <p className="font-medium">{domain.registrationDate}</p>
                          <p className={`mt-1 text-xs ${tokens.subtleText}`}>
                            Created via Codgoo Cloud
                          </p>
                        </td>
                        <td className="px-6 py-4 transition-colors">
                          <p className="font-medium">{domain.nextDueDate}</p>
                          <p className={`mt-1 text-xs ${tokens.subtleText}`}>
                            Renewal reminder 14 days before
                          </p>
                        </td>
                        <td className="px-6 py-4 transition-colors">
                          <span
                            className={`inline-flex items-center gap-2 rounded-full px-2 py-1 text-sm font-semibold}`}
                          >
                            
                            {(autoRenewStatus[domain.id] ?? domain.autoRenew) ? "Enabled" : "Disabled"}
                          </span>
                        </td>
                        <td className="px-6 py-4 transition-colors">
                          <span
                            className={`inline-flex items-center gap-1 text-sm font-medium ${
                              tokens.isDark ? "text-white" : "text-[#2B3674]"
                            }`}
                          >
                            {renderStatusIcon(domain.status)}
                            {domain.status}
                          </span>
                        </td>
                        <td className="rounded-r-xl px-6 py-4 transition-colors">
                          <div className="flex items-center gap-3">
                            <button
                              type="button"
                              className={manageButtonClass}
                              aria-label={`Manage ${domain.name}`}
                              onClick={() => handleOpenDomainOverview(domain)}
                            >
                              <SettingsIcon className="h-4 w-4" />
                            </button>
                            <div className="relative" ref={(el) => { actionsRefs.current[domain.id] = el; }}>
                              <button
                                type="button"
                                aria-haspopup="menu"
                                aria-expanded={openActionsId === domain.id}
                                onClick={() => setOpenActionsId(openActionsId === domain.id ? null : domain.id)}
                                className={`${tokens.buttonGhost} flex h-9 w-9 items-center cursor-pointer justify-center rounded-full transition-colors duration-200 hover:opacity-90`}
                              >
                                <DotsSwitcher className="h-4 w-4" />
                              </button>
                              {openActionsId === domain.id ? (
                                <div
                                  className={`absolute right-0 z-20 mt-2 w-56 rounded-[20px] border p-1 text-left ${
                                    tokens.isDark
                                      ? "border-white/10 bg-[#141325]"
                                      : "border-gray-200 bg-white"
                                  }`}
                                >
                                  <ul className="flex flex-col">
                                    {actions.map((action) => (
                                      <li key={action.id}>
                                        <button
                                          type="button"
                                          className={`w-full rounded-[20px] px-4 py-2 cursor-pointer text-left text-sm font-medium transition ${
                                            tokens.isDark
                                              ? "text-slate-100 hover:bg-white/10 hover:text-white"
                                              : "text-black hover:bg-gray-100 hover:text-black"
                                          }`}
                                          onClick={() => handleSelectAction()}
                                        >
                                          {action.label}
                                        </button>
                                      </li>
                                    ))}
                                    <li className="border-t border-[var(--color-border-divider)] mt-1 pt-1">
                                      <div className="flex items-center justify-between px-4 py-2">
                                        <span className={`text-sm font-medium ${
                                          tokens.isDark ? "text-slate-100" : "text-black"
                                        }`}>
                                          Auto Renew
                                        </span>
                                        <label className="relative inline-flex cursor-pointer items-center">
                                          <input
                                            type="checkbox"
                                            className="peer sr-only"
                                            checked={autoRenewStatus[domain.id] ?? domain.autoRenew}
                                            onChange={() => handleToggleAutoRenew(domain.id)}
                                          />
                                          <span className={`peer h-5 w-10 rounded-full ${tokens.isDark ? "bg-white/10" : "bg-black/30"} transition peer-checked:bg-[#7469C7] after:absolute after:start-[2px] after:top-1/2 after:h-3.5 after:w-3.5 after:-translate-y-1/2 after:rounded-full after:bg-white after:transition peer-checked:after:translate-x-5`} />
                                        </label>
                                      </div>
                                    </li>
                                  </ul>
                                </div>
                              ) : null}
                            </div>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td
                      colSpan={6}
                      className="rounded-[20px] bg-[#0F1217] px-6 py-12 text-center text-sm transition-colors"
                    >
                      <p className="text-base font-semibold">
                        No domains found yet
                      </p>
                      <p className={`mt-2 ${tokens.subtleText}`}>
                        Register a new domain to start managing DNS and renewals from this dashboard.
                      </p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {totalPages > 0 && (
            <div className="mt-8 flex flex-col items-center justify-between gap-4 border-t border-[var(--color-border-divider)] pt-4 text-xs text-[var(--color-sidebar-nav-idle-text)] transition-colors sm:flex-row">
              {renderPagination()}

              <div className="flex items-center gap-2 text-sm text-[var(--color-page-text)]">
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

