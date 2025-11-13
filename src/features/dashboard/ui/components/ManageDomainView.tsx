import { useParams } from "react-router-dom";
import { useMemo } from "react";

import { DomainsIcon, SettingsIcon, ProceedIcon } from "@utilities/icons";
import { ActiveIcon } from "@utilities/icons";

import type { DashboardTokens } from "../types";
import { dashboardContent } from "../constants";
import { dashboardApps } from "../constants";

type ManageDomainViewProps = {
  readonly tokens: DashboardTokens;
};

const CircularProgress = ({ percentage }: { percentage: number }) => {
  const radius = 40;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percentage / 100) * circumference;

  return (
    <div className="relative inline-flex items-center justify-center">
      <svg className="transform -rotate-90" width="100" height="100">
        <circle
          cx="50"
          cy="50"
          r={radius}
          stroke="rgba(255, 255, 255, 0.2)"
          strokeWidth="8"
          fill="none"
        />
        <circle
          cx="50"
          cy="50"
          r={radius}
          stroke="white"
          strokeWidth="8"
          fill="none"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          className="transition-all duration-300"
        />
      </svg>
      <div className="absolute text-white text-sm font-semibold">
        {percentage}%
      </div>
    </div>
  );
};

export const ManageDomainView = ({ tokens }: ManageDomainViewProps) => {
  const { domainId } = useParams<{ domainId: string }>();
  const activeAppId = dashboardApps[0].id; // Default to "cloud"
  const dataset = dashboardContent[activeAppId];

  const domain = useMemo(() => {
    if (!domainId) {
      // If no domainId in URL, use first domain
      return dataset.domains[0] || null;
    }
    const found = dataset.domains.find((d) => d.id === domainId);
    // Fallback: if not found, use first domain
    return found || dataset.domains[0] || null;
  }, [dataset.domains, domainId]);

  if (!domain || dataset.domains.length === 0) {
    return (
      <div className={`${tokens.cardBase} rounded-[32px] border border-[var(--color-card-border)] p-6 shadow-sm transition-colors lg:p-8`}>
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h1 className="mt-6 text-3xl font-semibold tracking-tight lg:text-4xl">
              Domain Not Found
            </h1>
            <p className={`mt-2 max-w-2xl text-sm leading-relaxed ${tokens.subtleText}`}>
              The domain you're looking for doesn't exist or has been removed.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Congrats Banner */}
      <div className="relative overflow-hidden rounded-[28px] bg-gradient-to-br from-[#6446F7] via-[#846DFF] to-[#A58BFF] p-6 text-white shadow-lg">
        <div className="flex flex-col gap-2">
          <h2 className="text-2xl font-semibold">Congrats!</h2>
          <p className="text-base opacity-90">
            Your domain checklist is complete
          </p>
          <p className="text-sm opacity-80">
            Your domain is ready — time to grow your brand and reach more people.
          </p>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid gap-6 lg:grid-cols-[minmax(0,2fr)_minmax(0,1.4fr)_minmax(0,1.2fr)]">
        {/* Left Column */}
        <div className="flex flex-col gap-6">
          {/* Domain Overview Card */}
          <div className="rounded-[28px] border border-[var(--color-border-divider)] bg-[var(--color-shell-bg)] p-6">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3">
                <span className={`flex h-12 w-12 items-center justify-center rounded-full ${
                  tokens.isDark
                    ? "bg-white/10"
                    : "bg-[#E6E3FF]"
                }`}>
                  <DomainsIcon 
                    className={`h-6 w-6 ${tokens.isDark ? "" : "[&_path]:fill-[#584ABC]"}`}
                  />
                </span>
                <div>
                  <p className="text-lg font-semibold text-[var(--color-page-text)]">{domain.name}</p>
                  <div className="mt-1 flex items-center gap-2">
                    <ActiveIcon className="h-4 w-4" />
                    <span className="text-sm font-medium text-emerald-400">{domain.status}</span>
                  </div>
                </div>
              </div>
              <CircularProgress percentage={75} />
            </div>
            <div className="mt-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <p className={`text-xs uppercase tracking-[0.2em] ${tokens.subtleText}`}>Expiration Date</p>
                <p className="mt-2 text-lg font-semibold text-[var(--color-page-text)]">{domain.nextDueDate}</p>
              </div>
              <div className="flex items-center gap-2 rounded-full bg-[var(--color-surface-muted)] px-4 py-2 text-xs font-medium text-[var(--color-page-text)]">
                Auto-Renewal
                <label className="relative inline-flex cursor-pointer items-center">
                  <input type="checkbox" className="peer sr-only" defaultChecked={domain.autoRenew} />
                  <span className="peer h-6 w-11 rounded-full bg-white/10 transition peer-checked:bg-[#7469C7] after:absolute after:start-[4px] after:top-1/2 after:h-4 after:w-4 after:-translate-y-1/2 after:rounded-full after:bg-white after:transition peer-checked:after:translate-x-5" />
                </label>
              </div>
            </div>
          </div>

          {/* Build Web App Card */}
          <div className="rounded-[28px] border border-[var(--color-border-divider)] bg-[var(--color-shell-bg)] p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-lg font-semibold text-[var(--color-page-text)]">Build a web app in minutes</p>
                <p className={`mt-2 text-sm ${tokens.subtleText}`}>
                  Chat with AI to create web apps, sites, or tools. Try Hostinger Horizons free for 7 days.
                </p>
              </div>
              <span className={`${tokens.buttonGhost} rounded-full px-4 py-2 text-xs font-semibold`}>New</span>
            </div>
            <div className="mt-6 flex items-end justify-between gap-6">
              <button
                type="button"
                className={`${tokens.buttonFilled} inline-flex items-center gap-2 rounded-full px-5 py-3 text-sm font-semibold`}
              >
                Try now
                <ProceedIcon className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Middle Column - Protect Your Brand */}
        <div className="flex flex-col justify-between rounded-[28px] border border-[var(--color-border-divider)] bg-[var(--color-shell-bg)] p-6">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="text-lg font-semibold text-[var(--color-page-text)]">Protect Your Brand</h3>
              <p className={`mt-1 text-xs ${tokens.subtleText}`}>Stay ahead with proactive monitoring.</p>
            </div>
            <button
              type="button"
              className={`${tokens.buttonGhost} flex h-8 w-8 items-center justify-center rounded-full`}
            >
              <SettingsIcon className="h-4 w-4" />
            </button>
          </div>
          <dl className="mt-6 flex flex-col gap-4 text-sm">
            <div className="flex items-center justify-between">
              <dt className={tokens.subtleText}>Trademark Monitoring</dt>
              <dd className="text-emerald-400">Enabled</dd>
            </div>
            <div className="flex items-center justify-between">
              <dt className={tokens.subtleText}>Domain Privacy</dt>
              <dd className="text-amber-300">Disabled</dd>
            </div>
            <div className="flex items-center justify-between">
              <dt className={tokens.subtleText}>Domain Lock</dt>
              <dd className="text-emerald-400">No Threats</dd>
            </div>
            <div className="flex items-center justify-between">
              <dt className={tokens.subtleText}>Expiry Alerts</dt>
              <dd className="text-emerald-400">Enabled</dd>
            </div>
          </dl>
          <button
            type="button"
            className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-[#8D79FF] transition hover:text-[#ABA0FF]"
          >
            Learn More About Brand Protection →
          </button>
        </div>

        {/* Right Column - DNS / Nameservers */}
        <div className="flex flex-col gap-6 rounded-[28px] border border-[var(--color-border-divider)] bg-[var(--color-shell-bg)] p-6">
          <div>
            <div className="flex items-start justify-between">
              <h3 className="text-lg font-semibold text-[var(--color-page-text)]">DNS / Nameservers</h3>
              <button
                type="button"
                className={`${tokens.buttonGhost} flex h-8 w-8 items-center justify-center rounded-full`}
              >
                <SettingsIcon className="h-4 w-4" />
              </button>
            </div>
            <p className={`mt-2 text-sm ${tokens.subtleText}`}>
              Quickly manage your DNS records and verify domain ownership.
            </p>
            <div className="mt-4 flex flex-col gap-3 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-[var(--color-page-text)]">ns1.dns-parking.com</span>
                <span className="text-emerald-400">Active</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[var(--color-page-text)]">ns2.dns-parking.com</span>
                <span className="text-emerald-400">Active</span>
              </div>
            </div>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-[var(--color-page-text)]">Contact Information</h4>
            <div className={`mt-2 text-sm ${tokens.subtleText}`}>
              <p>aml****@gmail.com</p>
              <p>Aml Atef | +20 10******</p>
            </div>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-[var(--color-page-text)]">Privacy Protection</h4>
            <div className="mt-3 flex items-center justify-between">
              <span className={`text-sm font-medium ${tokens.subtleText}`}>Status</span>
              <span className={`${tokens.buttonFilled} inline-flex items-center rounded-full px-4 py-1 text-xs font-semibold`}>
                Enabled
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
