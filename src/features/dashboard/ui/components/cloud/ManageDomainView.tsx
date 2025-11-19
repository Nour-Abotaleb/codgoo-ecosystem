import { useParams } from "react-router-dom";
import { useMemo } from "react";

import { DomainsIcon, SettingsIcon, ArrowUpIcon, EditIcon, EmailIcon, PhoneIcon, BrandProtectionIcon } from "@utilities/icons";

import buildBg from "@assets/images/cloud/build-bg.png";
import domainsBg from "@assets/images/cloud/domains-bg.png";

import type { DashboardTokens } from "../../types";
import { dashboardContent } from "../../constants";
import { dashboardApps } from "../../constants";

type ManageDomainViewProps = {
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
          stroke={isDark ? "rgba(249, 250, 250, 0.2)" : "#E4E7E9"}
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
      <div className={`${tokens.cardBase} rounded-[32px] border border-[var(--color-card-border)] px-6 py-4 transition-colors`}>
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
      <div className="relative overflow-hidden rounded-[24px]">
        <img src={domainsBg} alt="" className="w-full max-h-[260px] " />
        <div className="absolute inset-0 p-6 flex items-start flex-col justify-center gap-2 text-white">
          <div className="flex items-center gap-2 text-2xl md:text-3xl lg:text-[44px]">
            <h2 className="font-semibold">Congrats!</h2>
            <p className="font-extralight">
              Your domain checklist is complete
            </p>
          </div>
          <p className="text-lg md:text-xl lg:text-3xl font-extralight text-[#F2F2F2]">
            Your domain is ready - time to grow your brand and <br /> reach more people.
          </p>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="flex flex-col gap-6">
        {/* First Row: Domain Overview with CircularProgress | Protect Your Brand */}
        <div className="grid gap-6 lg:grid-cols-[minmax(0,1.5fr)_minmax(0,2fr)]">
          {/* Domain Overview Card */}
          <div className="rounded-[28px] border border-[var(--color-border-divider)] bg-[var(--color-shell-bg)] px-6 py-4">
            <div className="flex items-center justify-between">
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
                <p className="text-lg font-semibold text-[var(--color-page-text)]">{domain.name}</p>
              </div>
              <div>
                <div className="mt-1 flex items-center gap-2 bg-[#E2FFE9] rounded-full px-4 py-1.5">
                  <span className="w-2 h-2 rounded-full bg-[#34C759]"></span>
                  <span className="text-sm font-medium text-[#34C759]">{domain.status}</span>
                </div>
              </div>
            </div>
            <div className="mt-6 flex flex-col gap-4 lg:flex-row lg:items-center">
              <CircularProgress percentage={75} size={150} isDark={tokens.isDark} />
              <div>
                <p className={`text-sm ${tokens.subtleText}`}>Expiration Date</p>
                <p className="mt-2 text-lg font-semibold text-[var(--color-page-text)]">{domain.nextDueDate}</p>
              </div>
            </div>
            <div className="flex w-fit items-center gap-2 rounded-full bg-[var(--color-surface-muted)] px-4 py-2.5 text-sm font-medium text-[var(--color-page-text)] ml-auto">
              Auto-Renewal
              <label className="relative inline-flex cursor-pointer items-center">
                <input type="checkbox" className="peer sr-only" defaultChecked={domain.autoRenew} />
                <span className="peer h-6 w-11 rounded-full bg-white/10 transition peer-checked:bg-[#7469C7] after:absolute after:start-[4px] after:top-1/2 after:h-4 after:w-4 after:-translate-y-1/2 after:rounded-full after:bg-white after:transition peer-checked:after:translate-x-5" />
              </label>
            </div>
          </div>

          {/* Protect Your Brand */}
          <div className="flex flex-col justify-between rounded-[28px] border border-[var(--color-border-divider)] bg-[var(--color-shell-bg)] p-6">
            <div className="flex items-start justify-between">
              <div>
                <h3 className={`text-lg md:text-xl font-semibold ${tokens.isDark ? "text-[var(--color-page-text)]" : "text-[#2B3674]"}`}>Protect Your Brand</h3>
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
                <dd className="bg-[#E2FFE9] text-[#34C759] inline-flex items-center rounded-full px-4 py-2 text-xs font-semibold">Enabled</dd>
              </div>
              <div className="flex items-center justify-between">
                <dt className={tokens.subtleText}>Domain Privacy</dt>
                <dd className="bg-[#FFFCD4] text-[#82880E] inline-flex items-center rounded-full px-4 py-2 text-xs font-semibold">Disabled</dd>
              </div>
              <div className="flex items-center justify-between">
                <dt className={tokens.subtleText}>Domain Lock</dt>
                <dd className="bg-[#E2FFE9] text-[#34C759] inline-flex items-center rounded-full px-4 py-2 text-xs font-semibold">No Threats</dd>
              </div>
              <div className="flex items-center justify-between">
                <dt className={tokens.subtleText}>Expiry Alerts</dt>
                <dd className="bg-[#E2FFE9] text-[#34C759] inline-flex items-center rounded-full px-4 py-2 text-xs font-semibold">Enabled</dd>
              </div>
            </dl>
            <button
              type="button"
              className="mt-6 inline-flex items-center gap-2 cursor-pointer text-sm md:text-base font-medium text-[#8D79FF] transition hover:text-[#ABA0FF]"
            >
              <BrandProtectionIcon className="h-4 w-4" />
              Learn More About Brand Protection
            </button>
          </div>
        </div>

        {/* Second Row: Build Web App | DNS / Nameservers */}
        <div className="grid gap-4 sm:grid-cols-2">
          {/* Build Web App Card */}
          <div>
            <div className="relative">
              <img src={buildBg} alt="" className="w-full max-h-[420px] object-cover rounded-[24px]" />
              <div className="absolute inset-0 p-12 flex flex-col justify-between">
                <div>
                  <div className="flex items-start justify-between">
                    <h3 className="text-lg md:text-3xl lg:text-[44px] font-regular text-[#F2F2F2]">Build a web <br /><span className="font-bold">app in minutes</span></h3>
                    {/* Badge */}
                    <span className="bg-white rounded-full px-8 py-2 text-sm font-medium text-[#3E3484]">New</span>
                  </div>
                  <p className="text-xl text-white mt-2 font-medium">Chat with AI to create web apps, sites, or tools. Try Hostinger Horizons free for 7 days.</p>
                </div>
                <div className="flex items-center cursor-pointer">
                  <button
                    type="button"
                    className={`bg-white text-[#584ABC] cursor-pointer flex items-center gap-2 rounded-full px-10 py-3 text-sm font-semibold`}
                  >
                    Try Now
                  </button>
                  <div className="w-11 h-11 bg-white rounded-full flex items-center justify-center text-center -ms-2">
                    <ArrowUpIcon className="w-6 h-6 p-1 bg-gradient-to-b from-[#8A72FC] to-[#4318FF] rounded-full" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* DNS / Nameservers */}
          <div className="flex flex-col gap-6 rounded-[28px] border border-[var(--color-border-divider)] bg-[var(--color-shell-bg)] px-6 py-4 h-full">
            <div>
              <div className="flex items-start justify-between">
                <h3 className={`text-lg md:text-xl font-semibold ${tokens.isDark ? "text-[var(--color-page-text)]" : "text-[#2B3674]"}`}>DNS / Nameservers</h3>
                <button
                  type="button"
                  className={`${tokens.buttonGhost} flex h-8 w-8 items-center justify-center rounded-full`}
                >
                  <EditIcon className="h-4 w-4" />
                </button>
              </div>
              <p className={`mt-2 text-sm ${tokens.subtleText}`}>
                Quickly manage your DNS records and verify domain ownership.
              </p>
              <div className="mt-4 flex flex-col gap-3 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-[var(--color-page-text)]">ns1.dns-parking.com</span>
                  <span className="bg-[#E2FFE9] text-[#34C759] inline-flex items-center rounded-full px-4 py-2 text-xs font-semibold">Active</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[var(--color-page-text)]">ns2.dns-parking.com</span>
                  <span className="bg-[#E2FFE9] text-[#34C759] inline-flex items-center rounded-full px-4 py-2 text-xs font-semibold">Active</span>
                </div>
              </div>
            </div>

            <div>
              <h3 className={`text-lg md:text-xl font-semibold ${tokens.isDark ? "text-[var(--color-page-text)]" : "text-[#2B3674]"}`}>Contact Information</h3>
              <div className={`mt-2 text-sm ${tokens.subtleText}`}>
                <div className="flex items-center gap-2">
                  <span className={`${tokens.buttonGhost} flex h-8 w-8 items-center justify-center rounded-full`}>
                    <EmailIcon className="h-4 w-4" />
                  </span>
                  <p>aml****@gmail.com</p>
                </div>
                <div className="flex items-center gap-2 mt-2">
                  <span className={`${tokens.buttonGhost} flex h-8 w-8 items-center justify-center rounded-full`}>
                    <PhoneIcon className="h-4 w-4" />
                  </span>
                  <p>Aml Atef | +20 10******</p>
                </div>
              </div>
            </div>

            <div>
              <h3 className={`text-lg md:text-xl font-semibold ${tokens.isDark ? "text-[var(--color-page-text)]" : "text-[#2B3674]"}`}>Privacy Protection</h3>
              <div className="mt-3 flex items-center justify-between">
                <span className={`text-sm font-medium ${tokens.subtleText}`}>Status</span>
                <span className={`bg-[#EEEDF8] text-[#362D73] inline-flex items-center rounded-full px-4 py-2 text-xs font-semibold`}>
                  Enabled
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
