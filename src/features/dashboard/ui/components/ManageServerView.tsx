import { useMemo } from "react";

import {
  SettingsIcon,
  DeleteIcon,
  ServerIcon,
  KeyIcon,
  WebsitesIcon,
  FileManagementIcon,
  DatabaseIcon,
  ArrowRightIcon,
  PlanIcon,
  ExpiryDateIcon,
  BackupIcon,
  ChangePaymentMethodIcon,
  PaymentMethodIcon,
  BandwidthIcon,
  DiskIcon,
  MemoryIcon,
  ActiveIcon,
  UnpaidIcon,
  DomainsIcon,
} from "@utilities/icons";
import type { DashboardTokens, ServerService } from "../types";

type ManageServerViewProps = {
  readonly service: ServerService;
  readonly tokens: DashboardTokens;
  readonly onBack: () => void;
};

export const ManageServerView = ({ service, tokens }: ManageServerViewProps) => {
  const isPending = service.status === "Pending";
  const statusTextClass = isPending ? "text-amber-500" : "text-[#73F593]";
  const statusDotClass = isPending ? "bg-amber-400" : "bg-[#73F593]";
  const summaryItems = useMemo(
    () =>
      [
        { label: "Created On", value: "2025-05-12" },
        { label: "Renewal Date", value: "2026-05-12" },
        { label: "Cost", value: "300 SAR / Year" },
        { label: "IP Address", value: "192.168.1.10" },
        { label: "OS", value: "192.168.1.10" }
      ] as const,
    []
  );

  const billingDetails = useMemo(
    () =>
      [
        { label: "Plan", value: "VPS Basic", Icon: PlanIcon },
        { label: "Expiry Date", value: "01 Dec 2025", Icon: ExpiryDateIcon },
        { label: "Auto Renewal", value: "Enabled", Icon: BackupIcon },
        { label: "Payment Method", value: "Credit Card (**1234)", Icon: PaymentMethodIcon }
      ] satisfies ReadonlyArray<{
        label: string;
        value: string;
        Icon: typeof PlanIcon;
      }>,
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
        { id: "memory", label: "Memory (RAM)", used: "2.1 GB", total: "4 GB", percent: 52.5 },
        { id: "bandwidth", label: "Bandwidth", used: "5.2 TB", total: "10 TB", percent: 52 },
        { id: "disk", label: "Disk Space", used: "150 GB", total: "200 GB", percent: 60 },
        { id: "backup", label: "Backup Space", used: "15.2 GB", total: "50 GB", percent: 30.4 }
      ] as const,
    []
  );

  const websiteRows = useMemo(
    () =>
      [
        {
          domain: "example.com",
          status: "Active",
          platform: "WordPress",
          ssl: "Active",
          lastBackup: "01 Nov 2025"
        },
        {
          domain: "mysite.net",
          status: "Suspended",
          platform: "Joomla",
          ssl: "Inactive",
          lastBackup: "28 Oct 2025"
        },
        {
          domain: "shoponline.org",
          status: "Active",
          platform: "Custom",
          ssl: "Active",
          lastBackup: "30 Oct 2025"
        },
        {
          domain: "blogworld.io",
          status: "Active",
          platform: "WordPress",
          ssl: "Active",
          lastBackup: "02 Nov 2025"
        }
      ] as const,
    []
  );

  const backupAndSecurity = useMemo(
    () =>
      [
        { label: "Backup Settings", value: "Daily", hint: "Expires: 12 Jan 2026" },
        { label: "SSL Certificate", value: "Active" },
        { label: "Security Scan", value: "No Threats" },
        { label: "Firewall", value: "Enabled" }
      ] satisfies ReadonlyArray<{ label: string; value: string; hint?: string }>,
    []
  );

  const cardClass =
    "rounded-[24px] border border-[var(--color-card-border)] p-4 transition-colors";
  const summaryCardClass = `${tokens.isDark ? "bg-[var(--color-table-row-bg)]" : "bg-[#F4F4FF]"} text-[var(--color-card-text)] rounded-2xl p-6 transition-colors`;
  const usageCardClass =
    "rounded-[24px] border border-[var(--color-card-border)] p-6 transition-colors";
  const labelClass = `text-base ${tokens.subtleText}`;
  const sectionTitleClass = "text-lg md:text-xl lg:text-2xl font-semibold";
  const statusBadgeClass =
    "inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-sm font-medium";
  const usageMetricIcons: Record<string, typeof ServerIcon> = {
    memory: MemoryIcon,
    bandwidth: BandwidthIcon,
    disk: DiskIcon,
    backup: BackupIcon
  };

  return (
    <div className="flex flex-col gap-6">
      {/* <button
        type="button"
        className={`${tokens.buttonGhost} flex w-fit items-center gap-2 rounded-full px-4 py-2 text-sm font-medium`}
        onClick={onBack}
      >
        &larr; Back to Servers
      </button> */}

      <div className={`${tokens.cardBase} ${cardClass}`}>
        <div className="mb-6 flex flex-col justify-between gap-3 md:flex-row md:items-center border-b border-dashed border-[#A3AED0] pb-6">
          <div className="flex items-center gap-2">
            <span
              className={`${tokens.buttonGhost} inline-flex h-10 w-10 items-center justify-center rounded-full`}
            >
              <ServerIcon className={`h-6 w-6 ${tokens.isDark ? "" : "text-[#584ABC]"}`} />
            </span>
            <div className="flex flex-col">
              <h1 className="text-lg font-semibold md:text-2xl">{service.product}</h1>
              <span className={`${tokens.subtleText} text-sm`}>PHP Hosting</span>
            </div>
          </div>
          <span
            className={`${statusBadgeClass} bg-[#F4FFF7] ${statusTextClass}`}
          >
            <span className={`h-2.5 w-2.5 rounded-full ${statusDotClass}`} />
            {service.status}
          </span>
        </div>
        <div className={`${summaryCardClass} mt-8`}>
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
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

      <div className="mt-2 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
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
      {/* Billing & Renewal */}
      <div className="grid gap-6">
        <div className="grid gap-4 xl:grid-cols-2">
          <div className={`${tokens.cardBase} ${cardClass}`}>
            <div className="flex items-center justify-between">
              <h2 className={sectionTitleClass}>Billing &amp; Renewal</h2>
            </div>
            <div className="grid grid-cols-1">
              {billingDetails.map(({ label, value, Icon }) => (
                <div
                  key={label}
                  className="flex items-center justify-between rounded-2xl px-5 py-2"
                >
                  <div className="flex items-center gap-1">
                    <span
                      className={`${tokens.buttonGhost} inline-flex h-6 w-6 items-center justify-center rounded-full`}
                    >
                      <Icon className={`h-4 w-4 ${tokens.isDark ? "" : "[&_path]:fill-[#584ABC]"}`} />
                    </span>
                    <div className="flex items-center justify-between">
                      <p className={labelClass}>{label}</p>
                    </div>
                  </div>
                    <p className="text-base font-semibold text-[var(--color-card-text)]">
                      {value}
                    </p>
                </div>
              ))}
            </div>
            <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
              <button
                type="button"
                className={`${tokens.buttonFilled} inline-flex items-center justify-center gap-2 rounded-full px-4 py-2.5 text-base`}
              >
                <BackupIcon className="h-5 w-5" />
                Renew Now
              </button>
              <button
                type="button"
                className={`inline-flex items-center justify-center gap-2 rounded-full px-4 py-2.5 text-base text-[#9E96D8]`}
              >
                <ChangePaymentMethodIcon className={`h-5 w-5 ${tokens.isDark ? "" : "[&_path]:fill-[#584ABC]"}`} />
                Change Payment Method
              </button>
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {usageMetrics.map((metric) => {
              const MetricIcon = usageMetricIcons[metric.id] ?? ServerIcon;
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
                        <p className="text-sm font-light text-[#9EB3D7]">
                          {metric.label}
                        </p>
                        <span className="text-xl font-semibold text-[var(--color-card-text)]">
                          {metric.percent.toFixed(1)}%
                        </span>
                      </div>
                      <p className={`text-xs text-[#9EB3D7]`}>
                        {metric.used} / {metric.total}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        {/* Website */}
        <div className="grid items-stretch gap-4 grid-cols-1 lg:grid-cols-[2.4fr_1fr]">
          <div className="flex flex-col">
            <div className={`${tokens.cardBase} ${cardClass} h-full`}>
              <div className="flex items-center justify-between">
                <h2 className={sectionTitleClass}>Website</h2>
                {/* <button
                  type="button"
                  className={`${tokens.buttonGhost} inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs font-semibold`}
                >
                  <PlusCircleIcon className="h-4 w-4" />
                  Add Site
                </button> */}
              </div>
              <div className="mt-2 overflow-x-auto">
                <table className="min-w-full table-auto border-separate border-spacing-y-3 text-sm">
                  <thead className={tokens.isDark ? "" : "bg-[#F7F6FF]"}>
                    <tr className="text-left uppercase text-xs [&>th]:border-b [&>th]:border-[var(--color-border-divider)]">
                      <th className="px-4 py-4">Domain Name</th>
                      <th className="px-4 py-4">Status</th>
                      <th className="px-4 py-4">Platform</th>
                      <th className="px-4 py-4">SSL</th>
                      <th className="px-4 py-4">Last Backup</th>
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
                            {row.status === "Active" ? (
                              <ActiveIcon className="h-5 w-5" />
                            ) : (
                              <UnpaidIcon className="h-5 w-5" />
                            )}
                            {row.status}
                          </span>
                        </td>
                        <td className="px-4 py-2 text-[var(--color-card-text)]">{row.platform}</td>
                        <td className="px-4 py-2">
                          <span
                            className={`inline-flex items-center gap-1 text-sm font-medium ${
                              tokens.isDark ? "text-white" : "text-[#2B3674]"
                            }`}
                          >
                            {row.ssl === "Active" ? (
                              <ActiveIcon className="h-5 w-5" />
                            ) : (
                              <UnpaidIcon className="h-5 w-5" />
                            )}
                            {row.ssl}
                          </span>
                        </td>
                        <td className="px-4 py-2 text-[var(--color-card-text)]">{row.lastBackup}</td>
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
                              aria-label={`Remove ${row.domain}`}
                            >
                              <DeleteIcon className={`h-4 w-4 ${tokens.isDark ? "" : "[&_path]:fill-[#584ABC]"}`} />
                            </button>
                            <button
                              type="button"
                              className={`${tokens.buttonGhost} flex h-9 w-9 items-center justify-center rounded-full`}
                              aria-label={`Domain settings for ${row.domain}`}
                            >
                              <DomainsIcon className={`h-4 w-4 ${tokens.isDark ? "" : "text-[#584ABC]"}`} />
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
          {/* Backup & Security */}
          <div className="flex flex-col">
            <div className={`${tokens.cardBase} ${cardClass} h-full`}>
              <h2 className={sectionTitleClass}>Backup &amp; Security</h2>
              <div className="mt-6 flex flex-col gap-4">
                {backupAndSecurity.map((item) => (
                  <div
                    key={item.label}
                    className="flex items-center justify-between rounded-2xl px-5 py-4 transition-colors"
                  >
                    <div>
                      <p className="text-sm font-medium text-[var(--color-card-text)]">
                        {item.label}
                      </p>
                      {item.hint ? (
                        <p className="text-[#A3AED0] text-sm">{item.hint}</p>
                      ) : null}
                    </div>
                    <span className={`inline-flex items-center rounded-full bg-[var(--color-button-ghost-bg)] px-3.5 py-2 text-sm font-light ${tokens.isDark ? "text-[#EEEDF8]" : "text-[#362D73]"}`}>
                      {item.value}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

