import { useMemo } from "react";

import {
  ActiveIcon,
  DeleteIcon,
  SettingsIcon,
  PendingIcon,
  PlusCircleIcon,
  SearchIcon,
} from "@utilities/icons";

import type {
  DashboardTokens,
  ServerService,
  ServerServiceStatus
} from "../types";

type ServerServicesViewProps = {
  readonly services: readonly ServerService[];
  readonly statusStyles: Record<ServerServiceStatus, string>;
  readonly tokens: DashboardTokens;
};

export const ServerServicesView = ({
  services,
  statusStyles,
  tokens
}: ServerServicesViewProps) => {
  const allCount = services.length;
  const uninstalledCount = 0;

  const manageButtonClass = useMemo(
    () =>
      `${tokens.buttonGhost} flex h-10 w-10 items-center justify-center rounded-full`,
    [tokens.buttonGhost]
  );

  const tableHeaderClass = useMemo(
    () =>
      `text-sm tracking-widest ${tokens.subtleText}`,
    [tokens.subtleText]
  );

  return (
    <div className="flex flex-col gap-6">
      <div className={`${tokens.cardBase} rounded-[20px] p-6`}>
        <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-3xl font-semibold md:text-4xl">All Servers</h2>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <div
              className={`${tokens.cardBase} flex h-12 w-full items-center gap-3 rounded-full px-4 sm:w-68 border border-[#2E3141]`}
            >
              <SearchIcon className="text-[#B0B0B0] w-5" />
              <input
                type="search"
                placeholder="Search"
                className="flex-1 bg-transparent text-[#C6C6C6] text-sm focus:outline-none"
              />
            </div>
            <button
              type="button"
              className={`inline-flex items-center justify-center gap-1 rounded-full px-3 py-2.5 text-sm md:text-base font-semibold bg-[#7469C7] text-white`}
            >
              <PlusCircleIcon className="h-4 w-4 md:h-5 md:w-5" />
              Order New Server
            </button>
          </div>
        </div>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mt-6">
          <div className="flex items-center gap-6 rounded-full p-1">
            <button
              type="button"
              className={`rounded-full px-5 py-2 text-sm font-semibold bg-[#7469C7] text-white`}
            >
              All ({allCount})
            </button>
            <button
              type="button"
              className="rounded-full px-4 py-2 text-sm font-medium text-white tracking-[0.05em]"
            >
              Uninstalled ({uninstalledCount})
            </button>
          </div>
        </div>

        <div className="mt-6 overflow-x-auto">
          <table className="min-w-full table-auto border-separate border-spacing-y-2">
            <thead>
              <tr className="[&>th]:border-y [&>th]:border-[color:var(--color-border-divider)]">
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
              {services.map((service) => {
                const statusClass =
                  statusStyles[service.status] ?? "bg-slate-500/10 text-slate-300";

                return (
                  <tr key={service.id} className="text-sm">
                    <td className="whitespace-nowrap px-6 py-3 pe-6 bg-[#2E3141] rounded-l-xl">
                      <div className="flex items-center gap-3">
                        <input
                          type="checkbox"
                          className="h-4 w-4 rounded border-[color:var(--color-border-divider)] bg-transparent accent-[#584ABC] text-gray-500"
                          aria-label={`Select ${service.product}`}
                        />
                        <div className="flex gap-1 font-medium">
                          <p className="">{service.product}</p>
                          <p className={`text-sm text-white ${tokens.subtleText}`}>
                            {service.plan}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="whitespace-nowrap px-6 py-3 pe-6 bg-[#2E3141]">
                      <div>
                        <p className="font-medium">{service.pricing}</p>
                        <p className={`mt-1 text-sm text-white ${tokens.subtleText}`}>
                          {service.billingCycle}
                        </p>
                      </div>
                    </td>
                    <td className="whitespace-nowrap px-6 py-3 pe-6 bg-[#2E3141]">
                      <p className="font-medium">{service.nextDueDate}</p>
                    </td>
                    <td className="whitespace-nowrap px-6 py-3 pe-6 bg-[#2E3141]">
                      <span
                        className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-sm font-light ${statusClass}`}
                      >
                        {service.status === "Pending" ? <PendingIcon className="h-5 w-5" /> : <ActiveIcon className="h-5 w-5" />}
                        {service.status}
                      </span>
                    </td>
                    <td className="whitespace-nowrap px-6 py-3 bg-[#2E3141] rounded-r-xl">
                      <div className="flex items-center gap-3">
                        <button
                          type="button"
                          className={manageButtonClass}
                          aria-label={`Manage ${service.product}`}
                        >
                          <SettingsIcon className="h-4 w-4" />
                        </button>
                        <button
                          type="button"
                          className={manageButtonClass}
                          aria-label={`Server actions for ${service.product}`}
                        >
                          <DeleteIcon className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <div className="mt-6 flex flex-col items-center justify-between gap-4 border-t border-[color:var(--color-border-divider)] pt-4 text-xs text-[color:var(--color-sidebar-nav-idle-text)] sm:flex-row">
          <div className="flex items-center gap-2">
            <button type="button" className={`${tokens.buttonGhost} rounded-full px-3 py-1 text-xs font-semibold`}>
              &laquo;
            </button>
            <button type="button" className={`${tokens.buttonFilled} rounded-full px-3 py-1 text-xs font-semibold`}>
              1
            </button>
            <button type="button" className={`${tokens.buttonGhost} rounded-full px-3 py-1 text-xs font-semibold`}>
              2
            </button>
            <button type="button" className={`${tokens.buttonGhost} rounded-full px-3 py-1 text-xs font-semibold`}>
              3
            </button>
            <button type="button" className={`${tokens.buttonGhost} rounded-full px-3 py-1 text-xs font-semibold`}>
              &raquo;
            </button>
          </div>

          <p>Showing {Math.min(20, allCount)} of {allCount}</p>
        </div>
      </div>
    </div>
  );
};

