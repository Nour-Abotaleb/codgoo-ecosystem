import { useState } from "react";
import { DiamondIcon, ArrowRight } from "@utilities/icons";
import type { DashboardTokens } from "../types";

type OrderViewProps = {
  readonly tokens: DashboardTokens;
};

type ServiceTab = "domains" | "web-hosting" | "vps-hosting" | "dedicated-servers" | "reseller-hosting" | "ssl-certificates" | "website-builder";

type PackageFeature = {
  readonly label: string;
};

type Package = {
  readonly id: string;
  readonly title: string;
  readonly price: string;
  readonly features: PackageFeature[];
};

const packages: Package[] = [
  {
    id: "basic",
    title: "Basic",
    price: "$4.99 USD / Monthly",
    features: [
      { label: "1 Website" },
      { label: "10 GB Storage" },
      { label: "Unlimited Bandwidth" },
      { label: "Free Domain Included" },
      { label: "10 Email Accounts" },
      { label: "10 Databases" }
    ]
  },
  {
    id: "plus",
    title: "Plus",
    price: "$5.23 USD / Monthly",
    features: [
      { label: "10 Website" },
      { label: "25 GB Storage" },
      { label: "Unlimited Bandwidth" },
      { label: "Free Domain Included" },
      { label: "20 Email Accounts" },
      { label: "20 Databases" }
    ]
  },
  {
    id: "pro",
    title: "Pro",
    price: "$6.23 USD / Monthly",
    features: [
      { label: "Unlimited Website" },
      { label: "100 GB Storage" },
      { label: "Unlimited Bandwidth" },
      { label: "Free Domain Included" },
      { label: "50 Email Accounts" },
      { label: "50 Databases" }
    ]
  },
  {
    id: "enterprise",
    title: "Enterprise",
    price: "$6.23 USD / Monthly",
    features: [
      { label: "Unlimited Website" },
      { label: "Unlimited Storage" },
      { label: "Unlimited Bandwidth" },
      { label: "Free Domain Included" },
      { label: "Unlimited Email Accounts" },
      { label: "75 Databases" }
    ]
  }
];

const serviceTabs: { id: ServiceTab; label: string }[] = [
  { id: "domains", label: "Domains" },
  { id: "web-hosting", label: "Web Hosting" },
  { id: "vps-hosting", label: "VPS Hosting" },
  { id: "dedicated-servers", label: "Dedicated Servers" },
  { id: "reseller-hosting", label: "Reseller Hosting" },
  { id: "ssl-certificates", label: "SSL Certificates" },
  { id: "website-builder", label: "Website Builder" }
];

export const OrderView = ({ tokens }: OrderViewProps) => {
  const [activeTab, setActiveTab] = useState<ServiceTab>("domains");

  const tabButtonClass = (tabId: ServiceTab) => {
    const baseClass = "px-4 py-2 text-sm font-medium transition-colors rounded-lg";
    if (activeTab === tabId) {
      return `${baseClass} ${tokens.isDark ? "bg-[#584ABC] text-white" : "bg-[#584ABC] text-white"}`;
    }
    return `${baseClass} ${tokens.isDark ? tokens.subtleText : "text-[#2B3674]"} hover:${tokens.isDark ? "text-white" : "text-[#584ABC]"}`;
  };

  const cardClass = `${tokens.isDark ? tokens.cardBase : "bg-white"} border ${tokens.isDark ? "border-[var(--color-border-divider)]" : "border-[#EEEDF8]"} rounded-[20px] p-6 flex flex-col gap-4`;

  return (
    <div className="flex flex-col gap-4">
      <div className={`${tokens.isDark ? tokens.cardBase : "bg-white"} rounded-2xl p-4`}>
        <div className="flex flex-wrap items-center gap-0">
          {serviceTabs.map((tab, index) => (
            <div key={tab.id} className="flex items-center">
              {index > 0 && (
                <span className={`h-6 w-px mx-2 ${tokens.isDark ? "bg-[var(--color-border-divider)]" : "bg-[#EEEDF8]"}`} />
              )}
              <button
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={tabButtonClass(tab.id)}
              >
                {tab.label}
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-6">
        <h2 className="text-2xl font-bold">Choose Package</h2>

        <div className={`${tokens.isDark ? tokens.cardBase : "bg-white"} rounded-2xl p-6`}>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
            {packages.map((pkg) => (
              <div key={pkg.id} className={cardClass}>
              <div className="flex items-center gap-2">
                <div className={`flex items-center justify-center rounded-full p-2 ${tokens.isDark ? "bg-[var(--color-icon-surface)]" : "bg-[#EEEDF8]"}`}>
                  <DiamondIcon 
                    className={`h-6 w-6 ${tokens.isDark ? "[&_path]:fill-white" : "[&_path]:fill-[#584ABC]"}`}
                  />
                </div>
                <h3 className="text-xl font-semibold">{pkg.title}</h3>
              </div>

              <div className="flex flex-col gap-2">
                <p className={`text-lg font-medium ${tokens.isDark ? "text-white" : "text-[#584ABC]"}`}>
                  {pkg.price}
                </p>
              </div>

              <ul className="flex flex-col gap-2 flex-1">
                {pkg.features.map((feature, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <span className={`h-0.5 w-0.5 rounded-full flex items-center justify-center ${tokens.isDark ? "bg-white/10" : "bg-[#584ABC]"}`}>
                    </span>
                     <li key={index} className={`text-sm md:text-base font-regular ${tokens.subtleText}`}>
                       {feature.label}
                     </li>
                  </div>
                ))}
              </ul>

              <div className="flex flex-col gap-3 mt-auto">
                <button
                  type="button"
                  className={`flex items-center gap-2 text-sm font-bold ${tokens.isDark ? "text-white" : "text-[#584ABC]"} hover:opacity-80 transition-opacity`}
                >
                  View All
                  <ArrowRight
                    className="h-4 w-4 md:h-5 md:w-5" 
                    style={{ stroke: tokens.isDark ? "white" : "#584ABC" }}
                  />
                </button>
                <button
                  type="button"
                  className={`${tokens.buttonFilled} !bg-[#584ABC] rounded-[16px] px-6 py-3 font-medium transition-opacity hover:opacity-90`}
                >
                  Order Now
                </button>
              </div>
            </div>
          ))}
          </div>
        </div>
      </div>
    </div>
  );
};

