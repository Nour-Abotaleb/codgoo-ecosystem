import { useParams } from "react-router-dom";
import { useMemo } from "react";

import {
  KeyIcon,
  ServerIcon,
  FileManagementIcon,
  DatabaseIcon,
  DomainsIcon,
  MemoryIcon,
  BandwidthIcon,
  DiskIcon,
  BackupIcon,
  ArrowRightIcon,
  WebsitesIcon,
  ArrowUpIcon,
  SuccessIcon,
  CalendarIcon
} from "@utilities/icons";

import manageWebsiteBg from "@assets/images/cloud/manage-website-bg.png";

import type { DashboardTokens } from "../types";
import { dashboardContent } from "../constants";
import { dashboardApps } from "../constants";

type ManageWebsiteViewProps = {
  readonly tokens: DashboardTokens;
};

const CircularProgress = ({ percentage, size = 120, isDark = false }: { percentage: number; size?: number; isDark?: boolean }) => {
  const radius = (size - 20) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percentage / 100) * circumference;
  const uniqueId = `progress-${Math.random().toString(36).substr(2, 9)}`;

  return (
    <div className="relative inline-flex items-center justify-center">
      <svg className="transform -rotate-20" width={size} height={size}>
        <defs>
          <linearGradient id={`gradient-${uniqueId}`} x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#DBD9E8" />
            <stop offset="100%" stopColor="#4E458F" />
          </linearGradient>
        </defs>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={isDark ? "rgba(249, 250, 250, 0.2)" : "#F9FAFA"}
          strokeWidth="20"
          fill="none"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={`url(#gradient-${uniqueId})`}
          strokeWidth="20"
          fill="none"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          className="transition-all duration-300"
        />
      </svg>
    </div>
  );
};

export const ManageWebsiteView = ({ tokens }: ManageWebsiteViewProps) => {
  const { websiteId } = useParams<{ websiteId: string }>();
  const activeAppId = dashboardApps[0].id;
  const dataset = dashboardContent[activeAppId];

  const website = useMemo(() => {
    if (!websiteId) {
      return dataset.sites[0] || null;
    }
    const found = dataset.sites.find((s) => s.id === websiteId);
    return found || dataset.sites[0] || null;
  }, [dataset.sites, websiteId]);

  const summaryItems = useMemo(
    () =>
      [
        { label: "CMS", value: "WordPress 6.4" },
        { label: "SSL", value: "Active" },
        { label: "Created", value: "15 Feb 2024" },
        { label: "Renewal", value: "15 Feb 2026" },
        { label: "Path", value: `/public_html/${website?.id ?? ""}` },
        { label: "Health Score", value: "95% Excellent" }
      ] as const,
    [website?.id]
  );

  const managementActions = useMemo(
    () =>
      [
        { id: "domain", label: "Domain", badge: null, Icon: KeyIcon },
        { id: "hosting", label: "Hosting", badge: "Enabled", Icon: ServerIcon },
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
        { id: "bandwidth", label: "Bandwidth", used: "5.2 TB", total: "10 TB", percent: 52, Icon: BandwidthIcon },
        { id: "disk", label: "Disk Space", used: "150 GB", total: "200 GB", percent: 60, Icon: DiskIcon },
        { id: "backup", label: "Backup Space", used: "15.2 GB", total: "50 GB", percent: 30.4, Icon: BackupIcon }
      ] as const,
    []
  );

  if (!website || dataset.sites.length === 0) {
    return (
      <div className={`${tokens.cardBase} rounded-[32px] border border-[var(--color-card-border)] p-6 shadow-sm transition-colors lg:p-8`}>
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h1 className="mt-6 text-3xl font-semibold tracking-tight lg:text-4xl">
              Website Not Found
            </h1>
            <p className={`mt-2 max-w-2xl text-sm leading-relaxed ${tokens.subtleText}`}>
              The website you're looking for doesn't exist or has been removed.
            </p>
          </div>
        </div>
      </div>
    );
  }

  const statusTextClass = "text-[#73F593]";
  const statusDotClass = "bg-[#73F593]";

  const cardClass =
    "rounded-[24px] border border-[var(--color-card-border)] p-4 transition-colors";
  const summaryCardClass = `${tokens.isDark ? "bg-[var(--color-table-row-bg)]" : "bg-[#F4F4FF]"} text-[var(--color-card-text)] rounded-2xl p-6 transition-colors`;
  const usageCardClass =
    "rounded-[24px] border border-[var(--color-card-border)] p-6 transition-colors";
  const labelClass = `text-base font-regular text-[#718EBF]`;
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
      {/* Website Details Header */}
      <div className={`${tokens.cardBase} ${cardClass}`}>
        <div className="mb-6 flex flex-col justify-between gap-3 md:flex-row md:items-center border-b border-dashed border-[#A3AED0] pb-6">
          <div className="flex items-center gap-2">
            <span
              className={`${tokens.buttonGhost} inline-flex h-10 w-10 items-center justify-center rounded-full`}
            >
              <WebsitesIcon className={`h-6 w-6 ${tokens.isDark ? "" : "text-[#584ABC]"}`} />
            </span>
            <div className="flex flex-col">
              <h1 className="text-lg font-semibold md:text-2xl">{website.name}</h1>
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
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-6">
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

      {/* PageSpeed Insights and Resource Usage */}
      <div className="grid gap-4 lg:grid-cols-2">
        {/* PageSpeed Insights */}
        <div className={`${tokens.cardBase} rounded-[28px] border border-[var(--color-card-border)] px-6 py-4`}>
          <div className="flex items-center gap-3 mb-6">
            <span className={`flex h-10 w-10 items-center justify-center rounded-full ${
              tokens.isDark ? "bg-white/10" : "bg-[#E6E3FF]"
            }`}>
              <DomainsIcon className={`h-5 w-5 ${tokens.isDark ? "" : "[&_path]:fill-[#584ABC]"}`} />
            </span>
            <h3 className={`text-2xl font-semibold ${tokens.isDark ? "text-white" : "text-[#2B3674]"}`}>PageSpeed Insights</h3>
          </div>
          <div className="flex items-center gap-6 relative">
            <CircularProgress percentage={78} size={150} isDark={tokens.isDark} />
            <div className="flex-1 flex flex-col justify-between">
              <div>
                <p className={`text-xl font-semibold ${tokens.isDark ? "text-white" : "text-[#2B3674]"}`}>Desktop Device</p>
                <div className="flex items-center gap-2 mt-2">
                  <span className={`flex h-6 w-6 items-center justify-center rounded-full ${
                    tokens.isDark ? "bg-white/10" : "bg-[#E6E3FF]"
                  }`}>
                    <CalendarIcon className={`h-4 w-4 ${tokens.isDark ? "text-white" : "text-[#584ABC]"}`} />
                  </span>
                  <p className={`text-sm ${tokens.isDark ? "text-white/70" : "text-[#584ABC]"}`}>Last Scan On 2025-10-20</p>
                </div>
              </div>
            </div>
          </div>
          <div className="flex justify-end mt-1">
            <button
              type="button"
              className={`text-base font-semibold ${tokens.isDark ? "text-white" : "text-[#584ABC]"}`}
            >
              Run Speed Test
            </button>
          </div>
        </div>

        {/* Resource Usage Metrics Grid */}
        <div className="grid gap-4 grid-cols-2">
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
                      <p className="text-sm font-medium text-[#A3AED0]">
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

      {/* Hosting Resources Usage and Website Status */}
      <div className="grid gap-4 sm:grid-cols-[1fr_1.8fr]">
        {/* Hosting Resources Usage */}
        <div>
          <div className="relative">
            <img src={manageWebsiteBg} alt="" className="" />
            <div className="absolute inset-0 p-10 flex flex-col justify-between">
              <div>
                <h3 className="text-lg md:text-3xl lg:text-[44px] font-regular text-[#7469C7]">Hosting <span className="font-bold">resources <br /> usage</span></h3>
              </div>
              <div className="space-y-1 w-[100%] m-auto">
                <p className="text-sm text-[#584ABC]">57% of total resources used</p>
                <div className="relative h-6.5 overflow-hidden rounded-full bg-[#EEEDF8]">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-[#584ABC] to-[#3A336C] transition-all duration-300"
                    style={{ width: "57%" }}
                  />
                </div>
              </div>
              <div className="flex items-center justify-end cursor-pointer">
              <button
                type="button"
                className={`bg-white text-[#584ABC] cursor-pointer flex items-center gap-2 rounded-full px-8 py-2.5 text-sm font-semibold`}
              >
                See details
              </button>
              <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-center -ms-2">
                 <ArrowUpIcon className="w-6 h-6 p-1 bg-gradient-to-b from-[#8A72FC] to-[#4318FF] rounded-full" />
              </div>
              </div>
            </div>
          </div>
        </div>

        {/* Website Status */}
        <div className={`${tokens.cardBase} rounded-[28px] border border-[var(--color-card-border)] p-6 flex items-center justify-center min-h-full`}>
          <div className="flex flex-col items-center justify-center gap-4 text-center">
            <div className="flex h-16 w-16 lg:h-18 lg:w-18 items-center justify-center">
              <SuccessIcon className="" />
            </div>
            <div>
              <h3 className={`text-lg md:text-2xl lg:text-[32px] font-semibold ${tokens.isDark ? "text-white" : "text-[#2B3674]"}`}>Your website is running smoothly</h3>
              <p className={`mt-1 text-sm md:text-base lg:text-lg ${tokens.subtleText}`}>No issues were found</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
