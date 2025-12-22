import { ProfessionalBundlesIcon, EnterpriseBundlesIcon, FilledBundleSubscriptionsIcon, VerifiedIcon } from "@utilities/icons";
import { useNavigate } from "react-router-dom";
import type { DashboardTokens } from "../../types";

type BundleCard = {
  readonly id: string;
  readonly title: string;
  readonly price: string;
  readonly description: string;
  readonly badge?: string;
  readonly perks: readonly string[];
  readonly savings: string;
  readonly savingsNote: string;
  readonly actionLabel: string;
};

// eslint-disable-next-line react-refresh/only-export-components
export const bundleCards: readonly BundleCard[] = [
  {
    id: "starter",
    title: "Starter Bundle",
    price: "300",
    description: "Perfect for getting started",
    perks: ["Choose 3 Applications", "Lifetime Updates", "Basic Support", "Single Developer License"],
    savings: "29%",
    savingsNote: "Save up to 100",
    actionLabel: "Select This Bundle"
  },
  {
    id: "professional",
    title: "Professional Bundle",
    price: "500",
    description: "Perfect for getting started",
    badge: "Most Popular",
    perks: [
      "Choose 6 Applications",
      "Lifetime Updates",
      "Priority Support",
      "Team License (5 developers)",
      "Free Future Updates"
    ],
    savings: "40%",
    savingsNote: "Save up to 340",
    actionLabel: "Select This Bundle"
  },
  {
    id: "enterprise",
    title: "Enterprise Bundle",
    price: "1000",
    description: "Perfect for getting started",
    badge: "Best Value",
    perks: [
      "Choose 10 Applications",
      "Lifetime Updates",
      "Premium Support",
      "Unlimited Team License",
      "Free Future Updates",
      "Custom Integrations",
      "Dedicated Account Manager"
    ],
    savings: "29%",
    savingsNote: "Save up to 120",
    actionLabel: "Select This Bundle"
  }
];

const topGradients = [
  "bg-gradient-to-br from-[#043F45] to-[#25A9A6]",
  "bg-gradient-to-br from-[#00353C] to-[#2BBBB6]",
  "bg-gradient-to-br from-[#07494E] to-[#29B6B1]"
];

const actionColors = ["#4CA8B5", "#0B595D", "#0C6187"];
const actionColorsDark = ["white", "white", "white"];
const checkBgColors = ["#67C6D266", "#28B2AE66", "#419EC966"];

type BundleSelectionViewProps = {
  readonly tokens: DashboardTokens;
};

export const BundleSelectionView = ({ tokens }: BundleSelectionViewProps) => {
  const navigate = useNavigate();
  return (
    <div className="flex flex-col gap-8">
      <div className="flex items-center gap-3">
        <div className="flex flex-col gap-2 flex-1">
          <h1 className={`text-2xl font-bold ${tokens.isDark ? "text-white" : "text-[#142133]"}`}>
            Build Your Custom Bundle
          </h1>
          <p className={`text-sm md:text-base ${tokens.subtleText}`}>
            Choose applications and save big with our bundle packages
          </p>
        </div>
      </div>

      <div className="flex flex-col gap-2 items-center">
        <div className="flex items-center gap-2 text-xs md:text-sm text-[#208483] bg-[#EBFBFB] px-8 py-2.5 rounded-full">
            <FilledBundleSubscriptionsIcon className="h-5 w-5 text-[#208483]" />
          Step 1: Choose Your Bundle
        </div>
        <div className={`text-base md:text-lg font-bold ${tokens.isDark ? "text-white" : "text-black"}`}>
          Select a Bundle Package
        </div>
        <p className={`text-sm ${tokens.subtleText}`}>Pick the bundle that best fits your needs</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {bundleCards.map((bundle, idx) => (
          <div key={bundle.id} className={`${tokens.cardBase} rounded-2xl bg-[#FAFAFA] overflow-hidden flex flex-col`}>
            <div className={`relative p-4 text-white ${topGradients[idx]}`}>
              {bundle.badge ? (
                <span className="absolute top-3 right-3 bg-white text-[#208483] text-xs font-medium px-3 py-1.5 rounded-full">
                  {bundle.badge}
                </span>
              ) : null}
              <div className="flex items-center gap-3">
                <div className="h-14 w-14 rounded-full bg-[#386B70] flex items-center justify-center">
                  {idx === 0 ? (
                    <FilledBundleSubscriptionsIcon className="h-7 w-7 text-white" />
                  ) : idx === 1 ? (
                    <ProfessionalBundlesIcon className="h-7 w-7 text-white" />
                  ) : (
                    <EnterpriseBundlesIcon className="h-7 w-7 text-white" />
                  )}
                </div>
              </div>
                <div className="flex flex-col mt-2">
                    <span className="text-lg md:text-xl font-semibold">{bundle.title}</span>
                    <span className="text-sm md:text-base font-light">{bundle.description}</span>
                </div>
              <div className="mt-2 text-3xl font-semibold">{bundle.price} <span className="text-base font-light">EGP</span></div>
            </div>

            <div className="p-4 flex-1">
              <ul className="space-y-3 text-sm">
                {bundle.perks.map((perk) => (
                  <li key={perk} className="flex items-start gap-2">
                    <span
                      className="mt-0.5 h-6 w-6 rounded-full flex items-center justify-center"
                      style={{ backgroundColor: checkBgColors[idx] }}
                    >
                      <VerifiedIcon 
                        className="h-3 w-3" 
                        style={{ color: tokens.isDark ? actionColorsDark[idx] : actionColors[idx] }} 
                      />
                    </span>
                    <span className={`${tokens.isDark ? "text-white" : "text-[#142133]"}`}>{perk}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="px-4 pb-4">
              <div className="bg-[#EBFBFB] text-[#249796] rounded-2xl px-4 py-3 text-sm font-medium flex flex-col items-start gap-2 justify-between">
                <div className="flex items-center gap-2">
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M3.67063 12.9386L7.44563 16.7136C8.99563 18.2636 11.5123 18.2636 13.0706 16.7136L16.729 13.0553C18.279 11.5053 18.279 8.98864 16.729 7.43031L12.9456 3.66364C12.154 2.87197 11.0623 2.44697 9.94563 2.50531L5.77896 2.70531C4.1123 2.78031 2.7873 4.10531 2.70396 5.76364L2.50396 9.93031C2.45396 11.0553 2.87896 12.147 3.67063 12.9386Z" stroke="#208483" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                        <path d="M8.11263 10.1882C9.26322 10.1882 10.196 9.25541 10.196 8.10482C10.196 6.95422 9.26322 6.02148 8.11263 6.02148C6.96204 6.02148 6.0293 6.95422 6.0293 8.10482C6.0293 9.25541 6.96204 10.1882 8.11263 10.1882Z" stroke="#208483" stroke-width="1.5" stroke-linecap="round"/>
                        <path d="M11.0293 14.3548L14.3626 11.0215" stroke="#208483" stroke-width="1.5" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                    <span className="text-sm font-medium text-black">Estimated Savings</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-medium text-base md:text-lg">{bundle.savings}</span>
                  <span className="text-sm font-light">{bundle.savingsNote}</span>
                </div>
              </div>
            </div>

            <div className="px-4 pb-5">
              <button
                type="button"
                className="w-full rounded-full text-white text-sm font-regular py-3 transition-colors cursor-pointer"
                style={{ backgroundColor: actionColors[idx] }}
                onClick={() => navigate(`/dashboard/marketplace/bundles/${bundle.id}`)}
              >
                {bundle.actionLabel}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

