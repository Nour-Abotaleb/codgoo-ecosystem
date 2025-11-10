import { useMemo } from "react";

import {
  ActiveIcon,
  PendingIcon,
  SettingsIcon,
  DeleteIcon,
  PlusCircleIcon
} from "@utilities/icons";

import { serverServiceStatusStyles } from "../constants";
import type { DashboardTokens, ServerService } from "../types";

type ManageServerViewProps = {
  readonly service: ServerService;
  readonly tokens: DashboardTokens;
  readonly onBack: () => void;
};

export const ManageServerView = ({ service, tokens, onBack }: ManageServerViewProps) => {
  const statusClass =
    serverServiceStatusStyles[service.status] ?? "bg-slate-500/10 text-slate-300";

  const summaryItems = useMemo(
    () =>
      [
        { label: "Plan", value: service.plan },
        { label: "Created On", value: "2025-05-12" },
        { label: "Renewal Date", value: "2026-05-12" },
        { label: "Cost", value: "300 SAR / Year" },
        { label: "IP Address", value: "192.168.1.10" },
        { label: "OS", value: "Ubuntu 22.04 LTS" }
      ] as const,
    [service.plan]
  );

  const managementActions = useMemo(
    () =>
      [
        { id: "panel", label: "Login to Panel", badge: null },
        { id: "ssh", label: "SSH Access", badge: "Enabled" },
        { id: "files", label: "File Manager", badge: null },
        { id: "database", label: "Database Management", badge: null }
      ] as const,
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
      ] as const,
    []
  );

  const cardClass =
    "rounded-[24px] border border-[var(--color-card-border)] p-6 md:p-8 transition-colors";
  const elevatedSurfaceClass = `${tokens.surfaceMuted} text-[var(--color-card-text)] rounded-2xl border border-[var(--color-card-border)] p-5 transition-colors`;
  const labelClass = `text-xs uppercase tracking-[0.18em] ${tokens.subtleText}`;
  const sectionTitleClass = "text-lg font-semibold";
  const statusBadgeClass =
    "inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-sm font-medium";

  return (
    <div className="flex flex-col gap-6">
      <button
        type="button"
        className={`${tokens.buttonGhost} flex w-fit items-center gap-2 rounded-full px-4 py-2 text-sm font-medium`}
        onClick={onBack}
      >
        &larr; Back to Servers
      </button>

      <div className={`${tokens.cardBase} ${cardClass}`}>
        <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-3">
              <span className={statusBadgeClass + ` ${statusClass}`}>
                {service.status === "Pending" ? (
                  <PendingIcon className="h-4 w-4" />
                ) : (
                  <ActiveIcon className="h-4 w-4" />
                )}
                {service.status}
              </span>
              <span className={`${tokens.subtleText} text-sm`}>PHP Hosting</span>
            </div>
            <h1 className="text-3xl font-semibold md:text-4xl">{service.product}</h1>
            <p className={`${tokens.subtleText} text-sm md:text-base`}>
              Manage provisioning, access and billing details for this server instance.
            </p>
          </div>

          <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center lg:items-start">
            <button
              type="button"
              className={`${tokens.buttonFilled} inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold`}
            >
              <PlusCircleIcon className="h-4 w-4" />
              Upgrade Plan
            </button>
            <button
              type="button"
              className={`${tokens.buttonGhost} inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold`}
            >
              <SettingsIcon className="h-4 w-4" />
              Quick Actions
            </button>
          </div>
        </div>

        <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {summaryItems.map((item) => (
            <div key={item.label} className={elevatedSurfaceClass}>
              <p className={labelClass}>{item.label}</p>
              <p className="mt-2 text-base font-semibold text-[var(--color-card-text)]">
                {item.value}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {managementActions.map((action) => (
            <button
              key={action.id}
              type="button"
              className={`${tokens.buttonGhost} flex h-full flex-col justify-between gap-3 rounded-2xl px-5 py-4 text-left text-sm font-medium transition-colors`}
            >
              <span>{action.label}</span>
              {action.badge ? (
                <span className="inline-flex w-fit items-center rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-300">
                  {action.badge}
                </span>
              ) : (
                <span className={`${tokens.subtleText} text-xs`}>
                  Secure access to manage your resources
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.6fr,1fr]">
        <div className="flex flex-col gap-6">
          <div className={`${tokens.cardBase} ${cardClass}`}>
            <div className="flex items-center justify-between">
              <h2 className={sectionTitleClass}>Billing &amp; Renewal</h2>
              <span className={`${tokens.subtleText} text-xs`}>Next due {service.nextDueDate}</span>
            </div>
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <div className={elevatedSurfaceClass}>
                <p className={labelClass}>Plan</p>
                <p className="mt-2 text-base font-semibold text-[var(--color-card-text)]">
                  VPS Basic
                </p>
              </div>
              <div className={elevatedSurfaceClass}>
                <p className={labelClass}>Expiry Date</p>
                <p className="mt-2 text-base font-semibold text-[var(--color-card-text)]">
                  01 Dec 2025
                </p>
              </div>
              <div className={elevatedSurfaceClass}>
                <p className={labelClass}>Auto Renewal</p>
                <p className="mt-2 text-base font-semibold text-[var(--color-card-text)]">Enabled</p>
              </div>
              <div className={elevatedSurfaceClass}>
                <p className={labelClass}>Payment Method</p>
                <p className="mt-2 text-base font-semibold text-[var(--color-card-text)]">
                  Credit Card (**1234)
                </p>
              </div>
            </div>

            <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
              <button
                type="button"
                className={`${tokens.buttonFilled} inline-flex items-center justify-center gap-2 rounded-full px-4 py-2.5 text-sm font-semibold`}
              >
                Renew Now
              </button>
              <button
                type="button"
                className={`${tokens.buttonGhost} inline-flex items-center justify-center gap-2 rounded-full px-4 py-2.5 text-sm font-semibold`}
              >
                Change Payment Method
              </button>
            </div>
          </div>

          <div className={`${tokens.cardBase} ${cardClass}`}>
            <div className="flex items-center justify-between">
              <h2 className={sectionTitleClass}>Resource Usage</h2>
              <span className={`${tokens.subtleText} text-xs`}>Updated moments ago</span>
            </div>
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              {usageMetrics.map((metric) => (
                <div key={metric.id} className={elevatedSurfaceClass}>
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-semibold">{metric.label}</p>
                    <span className={`${tokens.subtleText} text-xs`}>
                      {metric.percent.toFixed(1)}%
                    </span>
                  </div>
                  <p className="mt-1 text-xs text-[var(--color-sidebar-nav-idle-text)]">
                    {metric.used} / {metric.total}
                  </p>
                  <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-[var(--color-progress-track)]">
                    <div
                      className="h-full rounded-full"
                      style={{
                        width: `${metric.percent}%`,
                        background: "var(--color-button-filled-bg)"
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className={`${tokens.cardBase} ${cardClass}`}>
            <div className="flex items-center justify-between">
              <h2 className={sectionTitleClass}>Website</h2>
              <button
                type="button"
                className={`${tokens.buttonGhost} inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs font-semibold`}
              >
                <PlusCircleIcon className="h-4 w-4" />
                Add Site
              </button>
            </div>
            <div className="mt-6 overflow-x-auto">
              <table className="min-w-full table-auto border-separate border-spacing-y-3 text-sm">
                <thead>
                  <tr className="text-left uppercase text-xs tracking-[0.18em]">
                    <th className="px-4 py-2">Domain Name</th>
                    <th className="px-4 py-2">Status</th>
                    <th className="px-4 py-2">Platform</th>
                    <th className="px-4 py-2">SSL</th>
                    <th className="px-4 py-2">Last Backup</th>
                    <th className="px-4 py-2 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {websiteRows.map((row) => (
                    <tr key={row.domain} className="bg-[var(--color-table-row-bg)] transition-colors">
                      <td className="rounded-l-2xl px-4 py-3 font-medium text-[var(--color-card-text)]">
                        {row.domain}
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${
                            row.status === "Active"
                              ? "bg-emerald-500/10 text-emerald-300"
                              : "bg-amber-500/10 text-amber-300"
                          }`}
                        >
                          {row.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-[var(--color-card-text)]">{row.platform}</td>
                      <td className="px-4 py-3">
                        <span
                          className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${
                            row.ssl === "Active"
                              ? "bg-emerald-500/10 text-emerald-300"
                              : "bg-rose-500/10 text-rose-300"
                          }`}
                        >
                          {row.ssl}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-[var(--color-card-text)]">{row.lastBackup}</td>
                      <td className="rounded-r-2xl px-4 py-3">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            type="button"
                            className={`${tokens.buttonGhost} flex h-9 w-9 items-center justify-center rounded-full`}
                            aria-label={`Manage ${row.domain}`}
                          >
                            <SettingsIcon className="h-4 w-4" />
                          </button>
                          <button
                            type="button"
                            className={`${tokens.buttonGhost} flex h-9 w-9 items-center justify-center rounded-full`}
                            aria-label={`Remove ${row.domain}`}
                          >
                            <DeleteIcon className="h-4 w-4" />
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

        <div className="flex flex-col gap-6">
          <div className={`${tokens.cardBase} ${cardClass}`}>
            <h2 className={sectionTitleClass}>Backup &amp; Security</h2>
            <div className="mt-6 flex flex-col gap-4">
              {backupAndSecurity.map((item) => (
                <div
                  key={item.label}
                  className="flex items-center justify-between rounded-2xl border border-[var(--color-card-border)] bg-[var(--color-section-muted)] px-5 py-4 transition-colors"
                >
                  <div>
                    <p className="text-sm font-semibold text-[var(--color-card-text)]">
                      {item.label}
                    </p>
                    {item.hint ? (
                      <p className={`${tokens.subtleText} text-xs`}>{item.hint}</p>
                    ) : null}
                  </div>
                  <span className="inline-flex items-center rounded-full bg-[var(--color-button-ghost-bg)] px-3 py-1 text-xs font-semibold text-[var(--color-button-ghost-text)]">
                    {item.value}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className={`${tokens.cardBase} ${cardClass}`}>
            <h2 className={sectionTitleClass}>Need Assistance?</h2>
            <p className={`${tokens.subtleText} mt-2 text-sm`}>
              Our support team is available 24/7 to help with migrations, upgrades, or incident
              response.
            </p>
            <div className="mt-5 flex flex-col gap-3">
              <button
                type="button"
                className={`${tokens.buttonFilled} inline-flex items-center justify-center gap-2 rounded-full px-4 py-2.5 text-sm font-semibold`}
              >
                Raise Support Ticket
              </button>
              <button
                type="button"
                className={`${tokens.buttonGhost} inline-flex items-center justify-center gap-2 rounded-full px-4 py-2.5 text-sm font-semibold`}
              >
                Start Live Chat
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

