import { useMemo } from "react";

import {
  SettingsIcon,
  HostIcon,
  KeyIcon,
  WebsitesIcon,
  FileManagementIcon,
  DatabaseIcon,
  ArrowRightIcon,
  MemoryIcon,
  BandwidthIcon,
  DiskIcon,
  ActiveIcon,
  UnpaidIcon,
  PendingIcon,
  PlusCircleIcon,
  DomainsIcon,
  BackupIcon,
} from "@utilities/icons";
import type { DashboardTokens } from "../../types";

type ManageHostViewProps = {
  readonly hostId: string;
  readonly tokens: DashboardTokens;
};

export const ManageHostView = ({ hostId: _hostId, tokens }: ManageHostViewProps) => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  void _hostId;
  const statusTextClass = "text-[#73F593]";
  const statusDotClass = "bg-[#73F593]";
  
  const summaryItems = useMemo(
    () =>
      [
        { label: "Used space", value: "8 GB / 50 GB" },
        { label: "Renewal Date", value: "2026-05-12" },
        { label: "Cost", value: "300 SAR / Year" },
        { label: "Number of sites", value: "3" }
      ] as const,
    []
  );

  const managementActions = useMemo(
    () =>
      [
        { id: "panel", label: "Login to Panel", badge: null, Icon: KeyIcon },
        { id: "ssh", label: "SSH Access", badge: "Enabled", Icon: WebsitesIcon },
        { id: "files", label: "File Manager", badge: null, Icon: FileManagementIcon },
        { id: "database", label: "Database Management", badge: null, Icon: DatabaseIcon }
      ] satisfies ReadonlyArray<{
        id: string;
        label: string;
        badge: string | null;
        Icon: typeof KeyIcon;
      }>,
    []
  );

  const usageMetrics = useMemo(
    () =>
      [
        { id: "memory", label: "Memory (RAM)", used: "2.1 GB", total: "4 GB", percent: 52.5, Icon: MemoryIcon },
        { id: "cpu", label: "CPU Usage", used: "5.2 TB", total: "10 TB", percent: 52, Icon: BandwidthIcon },
        { id: "disk", label: "Disk Space", used: "150 GB", total: "200 GB", percent: 60, Icon: DiskIcon },
        { id: "databases", label: "Databases Used", used: "4 / 10", total: "15.2 GB / 50 GB", percent: 40, Icon: BackupIcon }
      ] as const,
    []
  );

  const recentTickets = useMemo(
    () =>
      [
        { id: "2412", title: "SSL issue", status: "Active" as const },
        { id: "2411", title: "Backup failed", status: "Pending" as const },
        { id: "2409", title: "Migration request", status: "Resolved" as const },
      ] as const,
    []
  );

  const websiteRows = useMemo(
    () =>
      [
        {
          domain: "mysite.com",
          status: "Active" as const,
          type: "WordPress",
          protection: "SiteLock Enabled" as const,
          storageUsed: "2.5 GB",
          sslStatus: "Active" as const
        },
        {
          domain: "blog.mysite.com",
          status: "Pending" as const,
          type: "PHP",
          protection: "No Protection" as const,
          storageUsed: "1.2 GB",
          sslStatus: "Not Installed" as const
        },
        {
          domain: "shop.mysite.com",
          status: "Active" as const,
          type: "WordPress",
          protection: "SiteLock Enabled" as const,
          storageUsed: "3.1 GB",
          sslStatus: "Active" as const
        },
        {
          domain: "api.mysite.com",
          status: "Pending" as const,
          type: "Laravel",
          protection: "SiteLock Enabled" as const,
          storageUsed: "2.1 GB",
          sslStatus: "Pending" as const
        }
      ] as const,
    []
  );

  const cardClass =
    "rounded-[20px] border border-[var(--color-card-border)] p-4 transition-colors";
  const summaryCardClass = `${tokens.isDark ? "bg-[var(--color-table-row-bg)]" : "bg-[#F4F4FF]"} text-[var(--color-card-text)] rounded-2xl p-6 transition-colors`;
  const usageCardClass =
    "rounded-[20px] border border-[var(--color-card-border)] p-6 transition-colors";
  const labelClass = `text-base font-regular text-[#718EBF]`;
  const sectionTitleClass = "text-lg md:text-xl lg:text-2xl font-semibold";
  const statusBadgeClass =
    "inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-sm font-medium";

  const renderStatusIcon = (status: "Active" | "Pending" | "Resolved" | "In Progress" | "Not Installed") => {
    if (status === "Active" || status === "Resolved") {
      return <ActiveIcon className="h-5 w-5" />;
    }
    if (status === "Pending" || status === "In Progress") {
      return <PendingIcon className="h-5 w-5" />;
    }
    return <UnpaidIcon className="h-5 w-5" />;
  };

  const getStatusColor = (status: string) => {
    if (status === "Active" || status === "Resolved") {
      return "bg-[#E2FFE9] text-[#34C759]";
    }
    if (status === "Pending") {
      return "bg-[#FFFCD4] text-[#82880E]";
    }
    if (status === "In Progress") {
      return "bg-[#EEEDF8] text-[#3E3484]";
    }
    if (status === "Not Installed") {
      return "bg-[#FFF4F4] text-red-500";
    }
    return "bg-[#F4F4FF] text-[#584ABC]";
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Host Details Header */}
      <div className={`${tokens.cardBase} ${cardClass}`}>
        <div className="mb-6 flex flex-col justify-between gap-3 md:flex-row md:items-center border-b border-dashed border-[#A3AED0] pb-6">
          <div className="flex items-center gap-2">
            <span
              className={`${tokens.buttonGhost} inline-flex h-10 w-10 items-center justify-center rounded-full`}
            >
              <HostIcon className={`h-6 w-6 ${tokens.isDark ? "" : "text-[#584ABC]"}`} />
            </span>
            <div className="flex flex-col">
              <h1 className="text-lg font-semibold md:text-2xl">Host-01</h1>
              <span className={`${tokens.subtleText} text-base !text-[#9E96D8]`}>Shared Hosting</span>
            </div>
          </div>
          <span
            className={`${statusBadgeClass} bg-[#F4FFF7] ${statusTextClass}`}
          >
            <span className={`h-2.5 w-2.5 rounded-full ${statusDotClass}`} />
            Active
          </span>
        </div>
        <div className={`${summaryCardClass} mt-6`}>
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {summaryItems.map((item) => (
              <div key={item.label} className="flex flex-col gap-1">
                <p className="text-base font-semibold text-[var(--color-card-text)]">
                  {item.value}
                </p>
                <p className={labelClass}>{item.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Management Actions */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {managementActions.map((action) => {
          const showArrow = action.badge === null;

          return (
            <button
              key={action.id}
              type="button"
              className={`${tokens.cardBase} flex h-full flex-col gap-4 rounded-2xl p-5 text-left`}
            >
              <span
                className={`${tokens.buttonGhost} inline-flex h-10 w-10 items-center justify-center rounded-full`}
              >
                <action.Icon className={`h-5 w-5 md:h-6 md:w-6 ${tokens.isDark ? "" : "[&_path]:fill-[#584ABC]"}`} />
              </span>
              <div className="flex items-center justify-between gap-3">
                <span className="text-base font-light text-[var(--color-card-text)]">
                  {action.label}
                </span>
                {action.badge ? (
                  <span className={`${tokens.buttonGhost} inline-flex items-center rounded-full px-3.5 py-1.5 text-xs font-light text-[#EEEDF8]`}>
                    {action.badge}
                  </span>
                ) : showArrow ? (
                  <span
                    className={`inline-flex h-8 w-8 items-center justify-center rounded-full`}
                  >
                    <ArrowRightIcon className={`h-4 w-4 md:h-5 md:w-5 ${tokens.isDark ? "" : "[&_path]:stroke-[#584ABC]"}`} />
                  </span>
                ) : null}
              </div>
            </button>
          );
        })}
      </div>

      <div className="grid gap-4 grid-cols-2">
        {/* Support & Maintenance */}
        <div className={`${tokens.cardBase} ${cardClass}`}>
          <div className="mb-4">
            <h2 className={sectionTitleClass}>Support & Maintenance</h2>
            <p className={`${tokens.subtleText} text-sm mt-1`}>Last response: 2h ago</p>
          </div>
          <div className="flex flex-col">
            <p className={`text-xl font-bold mb-2 ${tokens.isDark ? "text-white/60" : "text-[#2B3674]"}`}>Recent Tickets</p>
            {recentTickets.map((ticket) => (
              <div
                key={ticket.id}
                className="flex items-center justify-between rounded-2xl px-4 py-1.5"
              >
                <div className="flex items-center gap-2">
                  <span className={`h-2 w-2 rounded-full ${tokens.isDark ? "bg-white" : "bg-[#584ABC]"}`} />
                  <div>
                    <p className={`text-sm font-semibold ${tokens.isDark ? "text-[var(--color-card-text)]" : "text-[#584ABC]"}`}>
                      #{ticket.id} - {ticket.title}
                    </p>
                  </div>
                </div>
                <span className={`${statusBadgeClass} ${getStatusColor(ticket.status)}`}>
                  {ticket.status}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Resource Usage Metrics */}
        <div className="grid gap-4 grid-cols-2">
          {usageMetrics.map((metric) => {
            const MetricIcon = metric.Icon;
            return (
              <div
                key={metric.id}
                className={`${tokens.cardBase} ${usageCardClass} flex flex-col gap-4`}
              >
                <div className="flex items-center gap-4">
                  <span
                    className={`${tokens.buttonGhost} inline-flex h-10 w-10 items-center justify-center rounded-full`}
                  >
                    <MetricIcon className={`h-6 w-6 ${tokens.isDark ? "" : "[&_path]:fill-[#584ABC]"}`} />
                  </span>
                  <div className="flex flex-col gap-1">
                    <div>
                      <p className="text-sm font-medium text-[#A3AED0]">
                        {metric.label}
                      </p>
                      {metric.id !== "databases" && (
                        <span className="text-xl font-semibold text-[var(--color-card-text)]">
                          {metric.percent.toFixed(1)}%
                        </span>
                      )}
                    </div>
                    <p className={`text-xs text-[#9EB3D7]`}>
                      {metric.used} {metric.id === "databases" ? "" : `/ ${metric.total.split(" / ")[0]}`}
                    </p>
                    {metric.id === "databases" && (
                      <p className={`text-xs text-[#9EB3D7]`}>
                        {metric.total}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Linked Websites */}
      <div className={`${tokens.cardBase} ${cardClass}`}>
        <div className="flex items-center justify-between">
          <h2 className={sectionTitleClass}>Linked Websites</h2>
          <button
            type="button"
            className={`${tokens.buttonFilled} inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold`}
          >
            <PlusCircleIcon className="h-5 w-5" />
            Add New Website
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full table-auto border-separate border-spacing-y-3 text-sm">
            <thead className={tokens.isDark ? "" : "bg-[#F7F6FF]"}>
              <tr className="text-left uppercase text-sm [&>th]:border-b [&>th]:border-[var(--color-border-divider)] text-[#A3AED0] font-medium">
                <th className="px-4 py-4">Website</th>
                <th className="px-4 py-4">Status</th>
                <th className="px-4 py-4">Type</th>
                <th className="px-4 py-4">Protection</th>
                <th className="px-4 py-4">Storage Used</th>
                <th className="px-4 py-4">SSL Status</th>
                <th className="px-4 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {websiteRows.map((row) => (
                <tr key={row.domain}>
                  <td className="rounded-l-2xl px-4 font-medium text-[var(--color-card-text)]">
                    {row.domain}
                  </td>
                  <td className="px-4 py-2">
                    <span
                      className={`inline-flex items-center gap-1 text-sm font-medium ${
                        tokens.isDark ? "text-white" : "text-[#2B3674]"
                      }`}
                    >
                      {renderStatusIcon(row.status)}
                      {row.status}
                    </span>
                  </td>
                  <td className="px-4 py-2 text-[var(--color-card-text)]">{row.type}</td>
                  <td className="px-4 py-2">
                    <span
                      className={`inline-flex items-center gap-1 text-sm font-medium ${
                        tokens.isDark ? "text-white" : "text-[#2B3674]"
                      }`}
                    >
                      {row.protection === "SiteLock Enabled" ? (
                        <ActiveIcon className="h-5 w-5" />
                      ) : (
                        <PendingIcon className="h-5 w-5" />
                      )}
                      {row.protection}
                    </span>
                  </td>
                  <td className="px-4 py-2 text-[var(--color-card-text)]">{row.storageUsed}</td>
                  <td className="px-4 py-2">
                    <span
                      className={`inline-flex items-center gap-1 text-sm font-medium ${
                        tokens.isDark ? "text-white" : "text-[#2B3674]"
                      }`}
                    >
                      {renderStatusIcon(row.sslStatus)}
                      {row.sslStatus}
                    </span>
                  </td>
                  <td className="rounded-r-2xl px-4 py-2">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        type="button"
                        className={`${tokens.buttonGhost} flex h-9 w-9 items-center justify-center rounded-full`}
                        aria-label={`Manage ${row.domain}`}
                      >
                        <SettingsIcon className={`h-4 w-4 ${tokens.isDark ? "" : "text-[#584ABC]"}`} />
                      </button>
                      <button
                        type="button"
                        className={`${tokens.buttonGhost} flex h-9 w-9 items-center justify-center rounded-full`}
                        aria-label={`Refresh ${row.domain}`}
                      >
                         <BackupIcon 
                                className={`h-4 w-4 ${tokens.isDark ? "" : "[&_path]:fill-[#584ABC]"}`}
                              />
                      </button>
                      <button
                        type="button"
                        className={`${tokens.buttonGhost} flex h-9 w-9 items-center justify-center rounded-full`}
                        aria-label={`Backup ${row.domain}`}
                      >
                        <DomainsIcon className={`h-4 w-4 ${tokens.isDark ? "" : "[&_path]:fill-[#584ABC]"}`} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

