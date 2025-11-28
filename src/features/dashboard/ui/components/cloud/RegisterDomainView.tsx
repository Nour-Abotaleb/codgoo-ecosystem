import { useState, useMemo } from "react";
import type { KeyboardEvent as ReactKeyboardEvent } from "react";
import { useNavigate, useLocation } from "react-router-dom";

import { CartIcon, DomainsIcon, ProceedIcon } from "@utilities/icons";
import {
  ActiveIcon,
  UnpaidIcon,
  SearchIcon,
} from "@utilities/icons";

import type { DashboardTokens } from "../../types";

type NameserverOption = {
  readonly id: string;
  readonly domain: string;
  readonly price: string;
  readonly priceValue: number;
  readonly available: boolean;
  readonly ctaLabel: string;
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

type RegisterDomainViewProps = {
  readonly tokens: DashboardTokens;
};

const ManageNameserverCheckoutPanel = ({
  tokens,
  option,
}: {
  readonly tokens: DashboardTokens;
  readonly option: NameserverOption;
  readonly onBack: () => void;
}) => {
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
    <div className={`${tokens.cardBase} rounded-[32px] px-6 py-4`}>
      <div>
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between border-b border-dashed border-[var(--color-border-divider)] pb-6">
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

const ManageNameserversSearchPanel = ({
  tokens,
  onBack: _onBack,
  onOpenCheckout
}: {
  readonly tokens: DashboardTokens;
  readonly onBack: () => void;
  readonly onOpenCheckout: (option: NameserverOption) => void;
}) => {
  void _onBack;
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
    <div className={`${tokens.cardBase} rounded-[28px] px-6 py-2 transition-colors`}>
      <div className="mt-4 flex flex-col gap-3 md:flex-row md:items-center md:gap-4">
        <div className={`flex h-12 flex-1 items-center gap-3 rounded-full border ${tokens.divider} bg-[var(--color-search-bg)] px-4 text-[var(--color-search-text)] transition-colors`}>
          <SearchIcon className="h-5 w-5 text-[var(--color-search-placeholder)]" />
          <input
            type="search"
            defaultValue={manageNameserversData.searchTerm}
            placeholder="Search Domain"
            className="flex-1 bg-transparent text-sm text-[var(--color-search-text)] placeholder:text-[var(--color-search-placeholder)] focus:outline-none"
          />
        </div>
        {/* Domain TLD */}
        <div className="flex h-12 w-64 items-center gap-2 rounded-full border border-[var(--color-border-divider)] bg-[var(--color-card-bg)] px-4 text-sm transition-colors">
          <select
            defaultValue={manageNameserversData.tld}
            className="w-full bg-transparent text-sm text-[var(--color-page-text)] focus:outline-none"
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

      <div className="mt-6 flex flex-col gap-6">
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

export const RegisterDomainView = ({ tokens }: RegisterDomainViewProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const selectedOption = location.state?.selectedOption as NameserverOption | undefined;

  const handleBack = () => {
    navigate("/dashboard/domains");
  };

  const handleBackFromCheckout = () => {
    navigate("/dashboard/manage-nameservers", { replace: true });
  };

  const handleOpenCheckout = (option: NameserverOption) => {
    navigate("/dashboard/manage-nameservers", {
      state: { selectedOption: option }
    });
  };

  if (selectedOption) {
    return (
      <ManageNameserverCheckoutPanel
        tokens={tokens}
        option={selectedOption}
        onBack={handleBackFromCheckout}
      />
    );
  }

  return (
    <ManageNameserversSearchPanel
      tokens={tokens}
      onBack={handleBack}
      onOpenCheckout={handleOpenCheckout}
    />
  );
};

