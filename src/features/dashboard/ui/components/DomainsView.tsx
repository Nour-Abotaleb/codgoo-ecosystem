import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  DotsSwitcher,
  BackupIcon,
  PendingIcon,
  ActiveIcon,
  UnpaidIcon,
  SearchIcon,
  SettingsIcon,
} from "@utilities/icons";

import type { DashboardTokens, DomainItem } from "../types";

type DomainsViewProps = {
  readonly domains: readonly DomainItem[];
  readonly tokens: DashboardTokens;
};


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
  const hasDomains = domains.length > 0;
  const totalCount = domains.length;
  const pageSize = hasDomains ? Math.min(20, totalCount) : 0;
  const totalRecords = hasDomains ? Math.max(100, totalCount) : 0;
  const [isActionsOpen, setIsActionsOpen] = useState(false);
  const actionsRef = useRef<HTMLDivElement>(null);

  const actions = useMemo(
    () => [
      { id: "contact-info", label: "Edit Contact Information" },
      { id: "renew", label: "Renew Domains" },
      { id: "auto-renewal", label: "Auto Renewal Status" },
      { id: "lock-status", label: "Registrar Lock Status" }
    ] as const,
    []
  );

  useEffect(() => {
    if (!isActionsOpen) {
      return;
    }

    const handleClickOutside = (event: MouseEvent) => {
      if (!actionsRef.current?.contains(event.target as Node)) {
        setIsActionsOpen(false);
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsActionsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [isActionsOpen]);

  const handleSelectAction = (_actionId: (typeof actions)[number]["id"]) => {
    // Handle action selection
    setIsActionsOpen(false);
  };

  const handleOpenDomainOverview = (domain: DomainItem) => {
    navigate(`/dashboard/manage-domain/${domain.id}`);
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
      <div className={`${tokens.cardBase} rounded-[28px] border border-[var(--color-card-border)] py-4 px-6 transition-colors`}>
          <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <div>
              <h2 className="text-3xl font-semibold md:text-4xl">
                All Domains
              </h2>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <div
                className={`flex h-11 w-full items-center gap-3 rounded-full border ${tokens.divider} bg-[var(--color-search-bg)] px-4 text-[var(--color-search-text)] transition-colors sm:w-72`}
              >
                <SearchIcon className="h-5 w-5 text-[var(--color-search-placeholder)]" />
                <input
                  type="search"
                  placeholder="Search domains"
                  className="flex-1 bg-transparent text-sm text-[var(--color-search-text)] placeholder:text-[var(--color-search-placeholder)] focus:outline-none"
                />
              </div>
              <button
                type="button"
                onClick={() => navigate("/dashboard/manage-nameservers")}
                className={`${filledButtonClass} gap-2 py-2`}
              >
                <span className="inline-flex h-6 w-6 items-center justify-center text-sm rounded-full bg-white text-[#584ABC]">
                  +
                </span>
                Register Domain
              </button>
              <div className="relative" ref={actionsRef}>
                <button
                  type="button"
                  aria-haspopup="menu"
                  aria-expanded={isActionsOpen}
                  onClick={() => setIsActionsOpen((prev) => !prev)}
                  className={`${tokens.buttonGhost} flex h-10 w-10 items-center justify-center rounded-full transition-colors duration-200 hover:opacity-90`}
                >
                  <DotsSwitcher className="h-4 w-4" />
                </button>
                {isActionsOpen ? (
                  <div
                    className={`absolute right-0 z-20 mt-3 w-56 rounded-2xl border p-1 text-left shadow-xl ${
                      tokens.isDark
                        ? "border-white/10 bg-white/10"
                        : "border-gray-200 bg-white"
                    }`}
                  >
                    <ul className="flex flex-col">
                      {actions.map((action) => (
                        <li key={action.id}>
                          <button
                            type="button"
                            className={`w-full rounded-xl px-4 py-2 text-left text-sm font-medium transition ${
                              tokens.isDark
                                ? "text-slate-100 hover:bg-white/10 hover:text-white"
                                : "text-black hover:bg-gray-100 hover:text-black"
                            }`}
                            onClick={() => handleSelectAction(action.id)}
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
          </div>

          <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3 text-sm font-medium">
              <button
                type="button"
                className={`${filledButtonClass} px-5 py-2 text-sm font-semibold`}
              >
                All Domains ({totalCount})
              </button>
              <button
                type="button"
                className={`${tokens.buttonGhost} rounded-full px-4 py-2 text-sm font-medium`}
              >
                Auto Renew ({domains.filter((domain) => domain.autoRenew).length})
              </button>
            </div>

            <div className={`flex items-center gap-3 text-xs ${tokens.subtleText}`}>
              <span>Auto Renew</span>
              <label className="relative inline-flex cursor-pointer items-center">
                <input type="checkbox" className="peer sr-only" defaultChecked />
                <span className="peer h-6 w-11 rounded-full bg-white/10 transition peer-checked:bg-[#7469C7] after:absolute after:start-[4px] after:top-1/2 after:h-4 after:w-4 after:-translate-y-1/2 after:rounded-full after:bg-white after:transition peer-checked:after:translate-x-5" />
              </label>
            </div>
          </div>

          <div className="mt-3 overflow-x-auto">
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
                  domains.map((domain) => {
                    return (
                      <tr
                        key={domain.id}
                        className="text-sm"
                      >
                        <td className="rounded-l-xl bg-[var(--color-table-row-bg)] px-6 py-4 transition-colors">
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
                        <td className="bg-[var(--color-table-row-bg)] px-6 py-4 transition-colors">
                          <p className="font-medium">{domain.registrationDate}</p>
                          <p className={`mt-1 text-xs ${tokens.subtleText}`}>
                            Created via Codgoo Cloud
                          </p>
                        </td>
                        <td className="bg-[var(--color-table-row-bg)] px-6 py-4 transition-colors">
                          <p className="font-medium">{domain.nextDueDate}</p>
                          <p className={`mt-1 text-xs ${tokens.subtleText}`}>
                            Renewal reminder 14 days before
                          </p>
                        </td>
                        <td className="bg-[var(--color-table-row-bg)] px-6 py-4 transition-colors">
                          <span
                            className={`inline-flex items-center gap-2 rounded-full px-2 py-1 text-sm font-semibold}`}
                          >
                            
                            {domain.autoRenew ? "Enabled" : "Disabled"}
                          </span>
                        </td>
                        <td className="bg-[var(--color-table-row-bg)] px-6 py-4 transition-colors">
                          <span
                            className={`inline-flex items-center gap-1 text-sm font-medium ${
                              tokens.isDark ? "text-white" : "text-[#2B3674]"
                            }`}
                          >
                            {renderStatusIcon(domain.status)}
                            {domain.status}
                          </span>
                        </td>
                        <td className="rounded-r-xl bg-[var(--color-table-row-bg)] px-6 py-4 transition-colors">
                          <div className="flex items-center gap-3">
                            <button
                              type="button"
                              className={manageButtonClass}
                              aria-label={`Manage ${domain.name}`}
                          onClick={() => handleOpenDomainOverview(domain)}
                            >
                              <SettingsIcon className="h-4 w-4" />
                            </button>
                            <button
                              type="button"
                              className={manageButtonClass}
                              aria-label={`More actions for ${domain.name}`}
                            >
                              <BackupIcon 
                                className={`h-4 w-4 ${tokens.isDark ? "" : "[&_path]:fill-[#584ABC]"}`}
                              />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td
                      colSpan={6}
                      className="rounded-xl bg-[var(--color-table-row-bg)] px-6 py-12 text-center text-sm transition-colors"
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

          <div className="mt-8 flex flex-col items-center justify-between gap-4 border-t border-[var(--color-border-divider)] pt-4 text-xs text-[var(--color-sidebar-nav-idle-text)] transition-colors sm:flex-row">
            <div className="flex items-center gap-2">
              {["«", "1", "2", "3", "…", "10", "»"].map((label) => {
                const isCurrent = label === "1";
                const isEllipsis = label === "…";

                if (isEllipsis) {
                  return (
                    <span
                      key={label}
                      className="px-2 py-1 font-semibold"
                    >
                      {label}
                    </span>
                  );
                }

                return (
                  <button
                    key={label}
                    type="button"
                    className={`${isCurrent ? tokens.buttonFilled : tokens.buttonGhost} rounded-full px-3 py-1 text-xs font-semibold`}
                  >
                    {label}
                  </button>
                );
              })}
            </div>

            <p className="text-sm text-[var(--color-page-text)]">
              Showing {pageSize} of {totalRecords}
            </p>
          </div>
        </div>
    </div>
  );
};

