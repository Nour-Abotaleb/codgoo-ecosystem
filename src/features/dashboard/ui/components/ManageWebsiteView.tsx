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
  ArrowRightIcon
} from "@utilities/icons";

import type { DashboardTokens } from "../types";
import { dashboardContent } from "../constants";
import { dashboardApps } from "../constants";

type ManageWebsiteViewProps = {
  readonly tokens: DashboardTokens;
};

const CircularProgress = ({ percentage, size = 120 }: { percentage: number; size?: number }) => {
  const radius = (size - 20) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percentage / 100) * circumference;

  return (
    <div className="relative inline-flex items-center justify-center">
      <svg className="transform -rotate-90" width={size} height={size}>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="rgba(116, 105, 199, 0.2)"
          strokeWidth="10"
          fill="none"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="#7469C7"
          strokeWidth="10"
          fill="none"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          className="transition-all duration-300"
        />
      </svg>
      <div className="absolute text-[var(--color-page-text)] text-lg font-semibold">
        {percentage}%
      </div>
    </div>
  );
};

const ResourceUsageCard = ({
  icon: Icon,
  label,
  percentage,
  used,
  total,
  tokens
}: {
  readonly icon: typeof MemoryIcon;
  readonly label: string;
  readonly percentage: number;
  readonly used: string;
  readonly total: string;
  readonly tokens: DashboardTokens;
}) => {
  return (
    <div className="rounded-[24px] border border-[var(--color-border-divider)] bg-[var(--color-card-bg)] p-6">
      <div className="flex items-center gap-3">
        <span className={`flex h-12 w-12 items-center justify-center rounded-full ${
          tokens.isDark ? "bg-white/10" : "bg-[#E6E3FF]"
        }`}>
          <Icon className={`h-6 w-6 ${tokens.isDark ? "" : "[&_path]:fill-[#584ABC]"}`} />
        </span>
        <div className="flex-1">
          <p className="text-sm font-medium text-[var(--color-page-text)]">{label}</p>
          <p className={`mt-1 text-xs ${tokens.subtleText}`}>{used} / {total}</p>
        </div>
        <div className="text-right">
          <p className="text-lg font-semibold text-[var(--color-page-text)]">{percentage}%</p>
        </div>
      </div>
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

  const managementTools = [
    { id: "domain", label: "Domain", icon: KeyIcon, badge: null },
    { id: "hosting", label: "Hosting", icon: ServerIcon, badge: "Enabled" },
    { id: "file-manager", label: "File Manager", icon: FileManagementIcon, badge: null },
    { id: "database", label: "Database Management", icon: DatabaseIcon, badge: null }
  ] as const;

  return (
    <div className="flex flex-col gap-6">
      {/* Website Overview Card */}
      <div className={`${tokens.cardBase} rounded-[28px] border border-[var(--color-card-border)] p-6`}>
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-2xl font-semibold text-[var(--color-page-text)]">{website.name}</h1>
              <div className="flex items-center gap-2">
                <span className="flex h-3 w-3 items-center justify-center rounded-full bg-emerald-400" />
                <span className="text-sm font-medium text-emerald-400">Active</span>
              </div>
            </div>
            <p className={`text-sm ${tokens.subtleText} mb-6`}>Shared Hosting</p>
            
            <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
              <div>
                <p className={`text-xs ${tokens.subtleText}`}>CMS</p>
                <p className="mt-1 text-sm font-semibold text-[var(--color-page-text)]">WordPress 6.4</p>
              </div>
              <div>
                <p className={`text-xs ${tokens.subtleText}`}>SSL</p>
                <p className="mt-1 text-sm font-semibold text-emerald-400">Active</p>
              </div>
              <div>
                <p className={`text-xs ${tokens.subtleText}`}>Created</p>
                <p className="mt-1 text-sm font-semibold text-[var(--color-page-text)]">15 Feb 2024</p>
              </div>
              <div>
                <p className={`text-xs ${tokens.subtleText}`}>Renewal</p>
                <p className="mt-1 text-sm font-semibold text-[var(--color-page-text)]">15 Feb 2026</p>
              </div>
              <div>
                <p className={`text-xs ${tokens.subtleText}`}>Path</p>
                <p className="mt-1 text-sm font-semibold text-[var(--color-page-text)]">/public_html/{website.id}</p>
              </div>
              <div>
                <p className={`text-xs ${tokens.subtleText}`}>Health Score</p>
                <p className="mt-1 text-sm font-semibold text-emerald-400">95% Excellent</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Management Tools */}
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        {managementTools.map((tool) => {
          const Icon = tool.icon;
          return (
            <div
              key={tool.id}
              className="rounded-[24px] border border-[var(--color-border-divider)] bg-[var(--color-card-bg)] p-6 cursor-pointer transition-colors hover:border-[#7469C7]"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className={`flex h-12 w-12 items-center justify-center rounded-full ${
                    tokens.isDark ? "bg-white/10" : "bg-[#E6E3FF]"
                  }`}>
                    <Icon className={`h-6 w-6 ${tokens.isDark ? "" : "[&_path]:fill-[#584ABC]"}`} />
                  </span>
                  <div>
                    <p className="text-sm font-semibold text-[var(--color-page-text)]">{tool.label}</p>
                    {tool.badge && (
                      <span className={`${tokens.buttonFilled} mt-1 inline-flex items-center rounded-full px-2 py-0.5 text-xs font-semibold`}>
                        {tool.badge}
                      </span>
                    )}
                  </div>
                </div>
                <ArrowRightIcon className={`h-5 w-5 ${tokens.subtleText}`} />
              </div>
            </div>
          );
        })}
      </div>

      {/* PageSpeed Insights and Resource Usage */}
      <div className="grid gap-6 lg:grid-cols-[minmax(0,1.5fr)_minmax(0,2fr)]">
        {/* PageSpeed Insights */}
        <div className={`${tokens.cardBase} rounded-[28px] border border-[var(--color-card-border)] p-6`}>
          <div className="flex items-center gap-3 mb-6">
            <span className={`flex h-10 w-10 items-center justify-center rounded-full ${
              tokens.isDark ? "bg-white/10" : "bg-[#E6E3FF]"
            }`}>
              <DomainsIcon className={`h-5 w-5 ${tokens.isDark ? "" : "[&_path]:fill-[#584ABC]"}`} />
            </span>
            <h3 className="text-lg font-semibold text-[var(--color-page-text)]">PageSpeed Insights</h3>
          </div>
          <div className="flex flex-col items-center gap-4">
            <CircularProgress percentage={78} />
            <div className="text-center">
              <p className="text-sm font-medium text-[var(--color-page-text)]">Desktop Device</p>
              <p className={`mt-2 text-xs ${tokens.subtleText}`}>Last Scan On 2025-10-20</p>
            </div>
            <button
              type="button"
              className={`${tokens.buttonFilled} mt-4 rounded-full px-6 py-2 text-sm font-semibold`}
            >
              Run Speed Test
            </button>
          </div>
        </div>

        {/* Resource Usage Grid */}
        <div className="grid grid-cols-2 gap-4">
          <ResourceUsageCard
            icon={MemoryIcon}
            label="Memory (RAM)"
            percentage={52.5}
            used="2.1 GB"
            total="4 GB"
            tokens={tokens}
          />
          <ResourceUsageCard
            icon={BandwidthIcon}
            label="Bandwidth"
            percentage={52}
            used="5.2 TB"
            total="10 TB"
            tokens={tokens}
          />
          <ResourceUsageCard
            icon={DiskIcon}
            label="Disk Space"
            percentage={60}
            used="150 GB"
            total="200 GB"
            tokens={tokens}
          />
          <ResourceUsageCard
            icon={BackupIcon}
            label="Backup Space"
            percentage={30.4}
            used="15.2 GB"
            total="50 GB"
            tokens={tokens}
          />
        </div>
      </div>

      {/* Hosting Resources Usage */}
      <div className={`${tokens.cardBase} rounded-[28px] border border-[var(--color-card-border)] p-6`}>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-semibold text-[var(--color-page-text)]">Hosting resources usage</h3>
            <p className={`mt-1 text-sm ${tokens.subtleText}`}>57% of total resources used</p>
          </div>
          <button
            type="button"
            className={`${tokens.buttonGhost} inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold`}
          >
            See details
            <ArrowRightIcon className="h-4 w-4" />
          </button>
        </div>
        <div className="relative h-3 w-full overflow-hidden rounded-full bg-[var(--color-surface-muted)]">
          <div
            className="h-full rounded-full bg-[#7469C7] transition-all duration-300"
            style={{ width: "57%" }}
          />
        </div>
      </div>

      {/* Website Status */}
      <div className={`${tokens.cardBase} rounded-[28px] border border-[var(--color-card-border)] p-6`}>
        <div className="flex items-center gap-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/10">
            <svg className="h-8 w-8 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-[var(--color-page-text)]">Your website is running smoothly</h3>
            <p className={`mt-1 text-sm ${tokens.subtleText}`}>No issues were found</p>
          </div>
        </div>
      </div>
    </div>
  );
};

