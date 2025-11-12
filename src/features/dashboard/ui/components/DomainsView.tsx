import { useEffect, useMemo, useRef, useState } from "react";
import type { KeyboardEvent as ReactKeyboardEvent } from "react";
import { CartIcon, DomainsIcon, ProceedIcon } from "@utilities/icons";

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

type DomainPanel = "domains-table" | "manage-nameservers" | "nameserver-checkout" | "domain-overview";

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

type NameserverOption = {
  readonly id: string;
  readonly domain: string;
  readonly price: string;
  readonly priceValue: number;
  readonly available: boolean;
  readonly ctaLabel: string;
};

type ManageNameserversPanelProps = {
  readonly tokens: DashboardTokens;
  readonly onBack: () => void;
  readonly onOpenCheckout: (option: NameserverOption) => void;
};

type ManageDomainOverviewPanelProps = {
  readonly tokens: DashboardTokens;
  readonly domain: DomainItem;
  readonly onBack: () => void;
};

const manageNameserversData = {
  searchTerm: "mywebsite.com",
  tld: ".com",
  results: [
    {
      id: "primary-available",
      domain: "mywebsite.com",
      price: "45 SAR / year",
      priceValue: 45,
      available: true,
      ctaLabel: "Add To Cart"
    },
    {
      id: "primary-unavailable",
      domain: "mywebsite.com",
      price: "45 SAR / year",
      priceValue: 45,
      available: false,
      ctaLabel: "Add To Cart"
    }
  ] as const,
  suggestions: [
    {
      id: "suggestion-online",
      domain: "mywebsiteonline.com",
      price: "45 SAR / year",
      priceValue: 45,
      available: true,
      ctaLabel: "Add To Cart"
    },
    {
      id: "suggestion-co",
      domain: "mywebsite.co",
      price: "45 SAR / year",
      priceValue: 45,
      available: true,
      ctaLabel: "Add To Cart"
    }
  ] as const
};

const AvailabilityBadge = ({ 
  available, 
  tokens 
}: { 
  readonly available: boolean;
  readonly tokens: DashboardTokens;
}) => (
  <span
    className={`inline-flex items-center gap-1 text-sm font-medium ${
      tokens.isDark ? "text-white" : "text-[#2B3674]"
    }`}
  >
    {available ? (
      <ActiveIcon className="h-5 w-5" />
    ) : (
      <UnpaidIcon className="h-5 w-5" />
    )}
    {available ? "Available" : "Not Available"}
  </span>
);

type NameserverCheckoutPanelProps = {
  readonly tokens: DashboardTokens;
  readonly option: NameserverOption;
  readonly onBack: () => void;
};

type NameserverAddOn = {
  readonly id: string;
  readonly label: string;
  readonly price: number;
  readonly defaultSelected: boolean;
};

const nameserverAddOns: readonly NameserverAddOn[] = [
  { id: "privacy", label: "Domain Privacy Protection", price: 10, defaultSelected: true },
  { id: "email", label: "Professional Email", price: 15, defaultSelected: false },
  { id: "security", label: "SiteLock / SSL Certificate", price: 20, defaultSelected: false },
  { id: "backup", label: "Daily Backup", price: 8, defaultSelected: false }
] as const;

const ManageNameserverCheckoutPanel = ({
  tokens,
  option
}: NameserverCheckoutPanelProps) => {
  const [selectedAddOns, setSelectedAddOns] = useState<Record<string, boolean>>(() =>
    nameserverAddOns.reduce<Record<string, boolean>>((acc, addOn) => {
      acc[addOn.id] = addOn.defaultSelected;
      return acc;
    }, {})
  );

  const subtotalAddOns = useMemo(
    () =>
      nameserverAddOns.reduce((sum, addOn) => {
        return selectedAddOns[addOn.id] ? sum + addOn.price : sum;
      }, 0),
    [selectedAddOns]
  );

  const total = option.priceValue + subtotalAddOns;

  const toggleAddOn = (id: string) => {
    setSelectedAddOns((prev) => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const formatPrice = (value: number) => `${value} SAR`;

  return (
    <div className={`${tokens.cardBase} rounded-[32px] border border-[var(--color-card-border)] lg:p-8`}>
      {/* <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
        <div>
          <button type="button" onClick={onBack} className={`${tokens.buttonGhost} inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold`}>
            ← Back to Search
          </button>
        </div>
      </div> */}

      <div className="">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between border-b border-dashed border-[var(--color-border-divider)] pb-10">
          <div className="flex items-center gap-4">
            <span className={`flex h-10 w-10 items-center justify-center rounded-full ${
              tokens.isDark
                ? "bg-white/10"
                : "bg-[#E6E3FF]"
            }`}>
              <DomainsIcon 
                className={`h-5 w-5 ${tokens.isDark ? "" : "[&_path]:fill-[#584ABC]"}`}
              />
            </span>
            <div>
              <h3 className="text-xl font-semibold text-[var(--color-page-text)]">{option.domain}</h3>
              <p className={`text-sm ${tokens.subtleText}`}>Duration: 1 Year</p>
            </div>
          </div>
          <div className="bg-[#EEEDF8] text-[#362D73] inline-flex rounded-full px-5 py-2 text-sm font-semibold">
            {formatPrice(option.priceValue)} / Year
          </div>
        </div>

        <div className="mt-8">
          <h4 className="text-base font-semibold text-[var(--color-page-text)]">Add-ons</h4>
          <div className="mt-4 flex flex-col">
            {nameserverAddOns.map((addOn) => (
              <label
                key={addOn.id}
                className="flex cursor-pointer items-center justify-between gap-2 px-4 py-3 transition-colors hover:border-[var(--color-sidebar-border)]"
              >
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={!!selectedAddOns[addOn.id]}
                    onChange={() => toggleAddOn(addOn.id)}
                    className="h-4 w-4 rounded border-[var(--color-border-divider)] accent-[#584ABC]"
                  />
                  <span className="text-base font-medium text-[var(--color-page-text)]">
                    {addOn.label}
                  </span>
                </div>
                <span className="text-base font-semibold text-[#584ABC]">+{formatPrice(addOn.price)}</span>
              </label>
            ))}
          </div>
        </div>

        <div className="mt-8 border-t border-dashed border-[var(--color-border-divider)] pt-6">
          <div className={`flex flex-col gap-3 text-base ${
            tokens.isDark ? "text-[var(--color-page-text)]" : "text-[#A3AED0]"
          }`}>
            <div className="flex items-center justify-between">
              <span>Base Domain</span>
              <span>
                <span className={tokens.isDark ? "" : "text-[#3E3484]"}>
                  {option.priceValue}
                </span>
                {" SAR"}
              </span>
            </div>
            {nameserverAddOns.map((addOn) =>
              selectedAddOns[addOn.id] ? (
                <div key={addOn.id} className="flex items-center justify-between text-sm">
                  <span>{addOn.label}</span>
                  <span>
                    +
                    <span className={tokens.isDark ? "" : "text-[#3E3484]"}>
                      {addOn.price}
                    </span>
                    {" SAR"}
                  </span>
                </div>
              ) : null
            )}
            <div className={`flex items-center justify-between text-base font-semibold ${
              tokens.isDark ? "text-[var(--color-page-text)]" : "text-[#A3AED0]"
            }`}>
              <span>Total</span>
              <span>
                <span className={tokens.isDark ? "" : "text-[#3E3484]"}>
                  {total}
                </span>
                {" SAR"}
              </span>
            </div>
          </div>
        </div>

        <div className="mt-8 flex justify-end">
          <button
            type="button"
            className={`${tokens.buttonFilled} inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-semibold`}
          >
            <ProceedIcon className="h-5 w-5" />
            Proceed To Checkout
          </button>
        </div>
      </div>
    </div>
  );
};

const ManageDomainOverviewPanel = ({
  tokens,
  domain: _domain, // eslint-disable-line @typescript-eslint/no-unused-vars
  onBack
}: ManageDomainOverviewPanelProps) => {
  return (
    <div className={`${tokens.cardBase} rounded-[32px] border border-[var(--color-card-border)] p-6 shadow-sm transition-colors lg:p-8`}>
      <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <button
            type="button"
            onClick={onBack}
            className={`${tokens.buttonGhost} inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold`}
          >
            ← Back to Domains
          </button>
          <h1 className="mt-6 text-3xl font-semibold tracking-tight lg:text-4xl">
            Manage Domain
          </h1>
          <p className={`mt-2 max-w-2xl text-sm leading-relaxed ${tokens.subtleText}`}>
            Congrats! Your domain checklist is complete. Your domain is ready — time to grow your brand and reach more people.
          </p>
        </div>
      </div>

      {/* <div className="mt-8 grid gap-6 lg:grid-cols-[minmax(0,2fr)_minmax(0,1.4fr)_minmax(0,1.2fr)]">
        <div className="flex flex-col gap-6">
          <div className="relative overflow-hidden rounded-[28px] bg-gradient-to-br from-[#6446F7] via-[#846DFF] to-[#A58BFF] p-6 text-white shadow-lg">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-sm font-medium opacity-85">Domain</p>
                <p className="mt-1 text-2xl font-semibold">{domain.name}</p>
              </div>
              <span className={`${statusChipClass} inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-semibold`}>
                {domain.status}
              </span>
            </div>
            <div className="mt-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.2em] opacity-80">Expiration Date</p>
                <p className="mt-2 text-lg font-semibold">2026-02-09</p>
              </div>
              <div className="flex items-center gap-2 rounded-full bg-white/15 px-4 py-2 text-xs font-medium">
                Auto-Renewal
                <span className="inline-flex h-6 w-10 items-center rounded-full bg-[#6F5DFE]">
                  <span className="ms-auto me-1 block h-4 w-4 rounded-full bg-white" />
                </span>
              </div>
            </div>
            <div className="mt-6 flex justify-center">
              <img
                src={domainsBg}
                alt="Domains illustration"
                className="w-full max-w-[260px] translate-y-6 drop-shadow-xl"
              />
            </div>
          </div>

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
              </button>
              <img
                src={domainsBg}
                alt="Domains promotion"
                className="w-32 drop-shadow-lg"
              />
            </div>
          </div>
        </div>

        <div className="flex flex-col justify-between rounded-[28px] border border-[var(--color-border-divider)] bg-[var(--color-shell-bg)] p-6">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="text-lg font-semibold text-[var(--color-page-text)]">Protect Your Brand</h3>
              <p className={`mt-1 text-xs ${tokens.subtleText}`}>Stay ahead with proactive monitoring.</p>
            </div>
            <button
              type="button"
              className={`${tokens.buttonGhost} rounded-full px-4 py-1 text-xs font-semibold`}
            >
              Manage
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

        <div className="flex flex-col gap-6 rounded-[28px] border border-[var(--color-border-divider)] bg-[var(--color-shell-bg)] p-6">
          <div>
            <h3 className="text-lg font-semibold text-[var(--color-page-text)]">DNS / Nameservers</h3>
            <p className={`mt-2 text-sm ${tokens.subtleText}`}>
              Quickly manage your DNS records and verify domain ownership.
            </p>
            <div className="mt-4 flex flex-col gap-3 text-sm">
              <div className="flex items-center justify-between">
                <span>ns1.dns-parking.com</span>
                <span className="text-emerald-400">Active</span>
              </div>
              <div className="flex items-center justify-between">
                <span>ns2.dns-parking.com</span>
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
      </div> */}
    </div>
  );
};

const ManageNameserversPanel = ({
  tokens,
  onBack,
  onOpenCheckout
}: ManageNameserversPanelProps) => {
  const sections = [
    {
      id: "primary",
      title: "Results",
      items: manageNameserversData.results
    },
    {
      id: "suggestions",
      title: "Suggestions",
      items: manageNameserversData.suggestions
    }
  ] as const;

  return (
    <div className={`${tokens.cardBase} rounded-[28px] border border-[var(--color-card-border)] p-6 shadow-sm transition-colors`}>
      <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
        <button
          type="button"
          onClick={onBack}
          className={`${tokens.buttonGhost} inline-flex items-center gap-2 rounded-full px-4 py-2.5 text-sm font-semibold`}
        >
          ← Back to Domains
        </button>
      </div>

      <div className="mt-8 flex flex-col gap-3 md:flex-row md:items-center md:gap-4">
        <div className={`flex h-12 flex-1 items-center gap-3 rounded-full border ${tokens.divider} bg-[var(--color-search-bg)] px-4 text-[var(--color-search-text)] transition-colors`}>
          <SearchIcon className="h-5 w-5 text-[var(--color-search-placeholder)]" />
          <input
            type="search"
            defaultValue={manageNameserversData.searchTerm}
            placeholder="Search Domain"
            className="flex-1 bg-transparent text-sm text-[var(--color-search-text)] placeholder:text-[var(--color-search-placeholder)] focus:outline-none"
          />
        </div>
        <div className="flex h-12 items-center gap-2 rounded-full border border-[var(--color-border-divider)] bg-[var(--color-card-bg)] px-4 text-sm transition-colors">
          <select
            defaultValue={manageNameserversData.tld}
            className="bg-transparent text-sm text-[var(--color-page-text)] focus:outline-none"
          >
            <option value=".com">.com</option>
            <option value=".net">.net</option>
            <option value=".org">.org</option>
          </select>
        </div>
        <button
          type="button"
          className={`${tokens.buttonFilled} h-12 rounded-full px-6 text-sm font-semibold`}
        >
          Check Availability
        </button>
      </div>

      <div className="mt-10 flex flex-col gap-6">
        {sections.map((section) => (
          <div key={section.id} className="flex flex-col gap-4">
            {section.id === "suggestions" ? (
              <h3 className="text-base font-semibold text-[var(--color-page-text)]">
                Suggestions
              </h3>
            ) : null}
            <div className="flex flex-col gap-4">
              {section.items.map((item, index) => {
                const alreadyTaken = !item.available && index === 1;
                const isDisabled = !item.available;

                const handleSelect = () => {
                  if (isDisabled) {
                    return;
                  }
                  onOpenCheckout(item);
                };

                const handleKeyDown = (event: ReactKeyboardEvent<HTMLDivElement>) => {
                  if (event.key === "Enter" || event.key === " ") {
                    event.preventDefault();
                    handleSelect();
                  }
                };

                return (
                  <div
                    key={item.id}
                    role="button"
                    tabIndex={isDisabled ? -1 : 0}
                    onClick={handleSelect}
                    onKeyDown={handleKeyDown}
                    className={`flex flex-col gap-4 rounded-[24px] border border-[var(--color-border-divider)] bg-[var(--color-shell-bg)] px-6 py-5 transition-colors md:flex-row md:items-center md:justify-between ${isDisabled ? "cursor-not-allowed opacity-70" : "cursor-pointer hover:border-[#7469C7]"}`}
                    aria-disabled={isDisabled}
                  >
                    <div className="flex flex-col gap-2">
                      <div className="flex items-center gap-3">
                        <span className={`flex h-10 w-10 items-center justify-center rounded-full ${
                          tokens.isDark
                            ? "bg-white/10"
                            : "bg-[#E6E3FF]"
                        }`}>
                          <DomainsIcon 
                            className={`h-5 w-5 ${tokens.isDark ? "" : "[&_path]:fill-[#584ABC]"}`}
                          />
                        </span>
                        <div>
                          <p className="text-lg font-semibold text-[var(--color-page-text)]">
                            {item.domain}
                          </p>
                          <p
                            className={`text-sm font-medium ${
                              alreadyTaken ? "text-rose-400" : "text-[var(--color-page-text)]"
                            }`}
                          >
                            {alreadyTaken ? "Already Taken" : `Price: ${item.price}`}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col items-end gap-10">
                      <AvailabilityBadge available={item.available} tokens={tokens} />
                      {item.available ? (
                        <button
                          type="button"
                          className={`${tokens.buttonFilled} inline-flex items-center gap-2 rounded-full px-5 py-2 text-sm font-light`}
                          onClick={(event) => {
                            event.stopPropagation();
                            onOpenCheckout(item);
                          }}
                        >
                          <CartIcon className="h-5 w-5" />
                          {item.ctaLabel}
                        </button>
                      ) : null}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export const DomainsView = ({ domains, tokens }: DomainsViewProps) => {
  const hasDomains = domains.length > 0;
  const totalCount = domains.length;
  const pageSize = hasDomains ? Math.min(20, totalCount) : 0;
  const totalRecords = hasDomains ? Math.max(100, totalCount) : 0;
  const [isActionsOpen, setIsActionsOpen] = useState(false);
  const actionsRef = useRef<HTMLDivElement>(null);
  const [activePanel, setActivePanel] = useState<DomainPanel>("domains-table");
  const [selectedNameserverOption, setSelectedNameserverOption] = useState<NameserverOption | null>(null);
  const [selectedDomain, setSelectedDomain] = useState<DomainItem | null>(null);

  const actions = useMemo(
    () => [
      { id: "nameservers", label: "Manage Nameservers" },
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

  const handleSelectAction = (actionId: (typeof actions)[number]["id"]) => {
    if (actionId === "nameservers") {
      setActivePanel("manage-nameservers");
    }
    setIsActionsOpen(false);
  };

  const handleReturnToDomains = () => {
    setActivePanel("domains-table");
  };

  const handleOpenNameserverCheckout = (option: NameserverOption) => {
    setSelectedNameserverOption(option);
    setActivePanel("nameserver-checkout");
  };

  const handleBackFromCheckout = () => {
    setActivePanel("manage-nameservers");
  };

  const handleOpenDomainOverview = (domain: DomainItem) => {
    setSelectedDomain(domain);
    setActivePanel("domain-overview");
  };

  const handleBackFromOverview = () => {
    setActivePanel("domains-table");
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
      {activePanel === "nameserver-checkout" && selectedNameserverOption ? (
        <ManageNameserverCheckoutPanel tokens={tokens} option={selectedNameserverOption} onBack={handleBackFromCheckout} />
      ) : activePanel === "domain-overview" && selectedDomain ? (
        <ManageDomainOverviewPanel tokens={tokens} domain={selectedDomain} onBack={handleBackFromOverview} />
      ) : activePanel === "manage-nameservers" ? (
        <ManageNameserversPanel tokens={tokens} onBack={handleReturnToDomains} onOpenCheckout={handleOpenNameserverCheckout} />
      ) : (
        <div className={`${tokens.cardBase} rounded-[28px] border border-[var(--color-card-border)] p-6 shadow-sm transition-colors`}>
          <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <div>
              <h2 className="mt-2 text-3xl font-semibold md:text-4xl">
                All Domains
              </h2>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <div
                className={`flex h-12 w-full items-center gap-3 rounded-full border ${tokens.divider} bg-[var(--color-search-bg)] px-4 text-[var(--color-search-text)] transition-colors sm:w-72`}
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
                className={`${filledButtonClass} gap-2`}
              >
                <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-white text-[#584ABC]">
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

          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3 text-sm font-medium">
              <button
                type="button"
                className={filledButtonClass}
              >
                All Domains ({totalCount})
              </button>
              <button
                type="button"
                className={`${tokens.buttonGhost} rounded-full px-4 py-1.5 text-sm font-medium`}
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

          <div className="mt-6 overflow-x-auto">
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
      )}
    </div>
  );
};

