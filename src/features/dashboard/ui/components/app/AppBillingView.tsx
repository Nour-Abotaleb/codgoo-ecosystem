import { useMemo, useState } from "react";
import type { DashboardTokens } from "../../types";
import {
  AppBillingIcon,
  AppPaidIcon,
  AppUnpaidIcon,
  AppOverdueIcon,
  BundleSubscriptionsIcon,
  MasterStrokeIcon,
  FilledBundleSubscriptionsIcon,
  MasterIcon,
} from "@utilities/icons";

type AppSubscription = {
  readonly id: string;
  readonly invoiceCode: string;
  readonly amount: string;
  readonly currency: string;
  readonly planName: string;
  readonly status: "closed" | "active" | "pending";
  readonly dueDate: string;
  readonly meta?: string;
};

type AppBillingTab = "bundle" | "master";

const statsConfig = [
  { id: "all", label: "All", value: "6", icon: AppBillingIcon },
  { id: "paid", label: "Paid", value: "3", icon: AppPaidIcon },
  { id: "unpaid", label: "Unpaid", value: "2", icon: AppUnpaidIcon },
  { id: "overdue", label: "Overdue", value: "1", icon: AppOverdueIcon },
] as const;

const bundleSubscriptions: AppSubscription[] = [
  {
    id: "bundle-1",
    invoiceCode: "INV-2025-001234",
    amount: "500",
    currency: "EGP",
    planName: "Professional Bundle",
    status: "closed",
    dueDate: "30 Nov 2025",
    meta: "started 1 Of 3",
  },
  {
    id: "bundle-2",
    invoiceCode: "INV-2025-001235",
    amount: "600",
    currency: "EGP",
    planName: "Builder App",
    status: "closed",
    dueDate: "05 Dec 2025",
    meta: "started 1 Of 2",
  },
];

const masterSubscriptions: AppSubscription[] = [
  {
    id: "master-1",
    invoiceCode: "INV-2025-001244",
    amount: "500",
    currency: "EGP",
    planName: "Builder App",
    status: "closed",
    dueDate: "30 Nov 2025",
  },
  {
    id: "master-2",
    invoiceCode: "INV-2025-001245",
    amount: "520",
    currency: "EGP",
    planName: "Builder App",
    status: "closed",
    dueDate: "12 Dec 2025",
  },
  {
    id: "master-3",
    invoiceCode: "INV-2025-001246",
    amount: "540",
    currency: "EGP",
    planName: "Builder App",
    status: "closed",
    dueDate: "20 Dec 2025",
  },
];

const statusBadgeClass = (status: AppSubscription["status"]) => {
  switch (status) {
    case "closed":
      return "bg-[#E2FFE9] text-[#34C759]";
    case "active":
      return "bg-[#E6E8FF] text-[#071FD7]";
    case "pending":
      return "bg-[#FFF6D5] text-[#B48D00]";
    default:
      return "bg-gray-100 text-gray-700";
  }
};

export const AppBillingView = ({ tokens }: { readonly tokens: DashboardTokens }) => {
  const [activeTab, setActiveTab] = useState<AppBillingTab>("bundle");
  const isDark = tokens.isDark;

  const subscriptions = useMemo(() => {
    return activeTab === "bundle" ? bundleSubscriptions : masterSubscriptions;
  }, [activeTab]);

  return (
    <div className="flex flex-col gap-6">
      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statsConfig.map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.id}
              className={`${tokens.cardBase} rounded-2xl p-6 transition-colors ${isDark ? "!bg-[#1F2733]" : "!bg-white"}`}
            >
              <div className="flex flex-col items-start gap-3">
                <div className="">
                  <Icon className="h-10 w-10" />
                </div>
                <div className="flex flex-col mt-6">
                  <span className={`text-2xl font-semibold ${isDark ? "text-white" : "text-[#2B3674]"}`}>{stat.value}</span>
                  <span className={`text-lg mt-2 ${isDark ? "text-white/60" : "text-[#A3AED0]"}`}>{stat.label}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Tabs */}
      <div className={`${tokens.cardBase} rounded-[28px] p-6 transition-colors ${isDark ? "!bg-[#0F1620]" : "!bg-white"}`}>
        <div className="flex flex-col gap-4">
          <div className="flex flex-wrap items-center gap-6">
            {[
              { id: "bundle" as AppBillingTab, label: "Bundle Subscriptions", icon: BundleSubscriptionsIcon },
              { id: "master" as AppBillingTab, label: "Master Subscriptions", icon: MasterStrokeIcon },
            ].map((tab) => {
              const isActive = activeTab === tab.id;
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id)}
                  className={`relative flex items-center gap-2 pb-2 text-sm md:text-base font-semibold transition-colors ${
                    isActive
                      ? isDark ? "text-white/70" : "text-black"
                      : isDark
                        ? "text-white/60"
                        : "text-black"
                  }`}
                >
                  <Icon className="h-5 w-5" />
                  {tab.label}
                  {isActive ? <span className="absolute inset-x-0 -bottom-[2px] h-0.5 rounded-full bg-[#0E8F9C]" /> : null}
                </button>
              );
            })}
          </div>

          {/* Subscriptions Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
            {subscriptions.map((sub) => (
              <div
                key={sub.id}
                className={`rounded-2xl overflow-hidden transition-colors ${isDark ? "!bg-[#1F2733]" : "!bg-[#E7F0F1]"}`}
              >
                <div className="flex flex-col gap-3 px-4 py-4">
                  <div className="flex items-center justify-between">
                    <span className={`text-sm font-medium ${isDark ? "text-white/80" : "text-[#4B6470]"}`}>{sub.invoiceCode}</span>
                    <span className={`px-4 py-1.5 rounded-full text-sm font-medium ${statusBadgeClass(sub.status)}`}>
                      {sub.status}
                    </span>
                  </div>

                  <div className="flex items-end gap-1">
                    <span className={`text-2xl font-semibold leading-none ${isDark ? "text-white" : "text-[#0B6E75]"}`}>{sub.amount}</span>
                    <span className={`text-xs font-semibold mb-[2px] ${isDark ? "text-white/70" : "text-[#4B6470]"}`}>{sub.currency}</span>
                  </div>

                  <div className="flex items-center gap-2 text-sm font-semibold">
                    {sub.planName === "Professional Bundle" ? (
                      <FilledBundleSubscriptionsIcon className={`h-4 w-4 ${isDark ? "text-white/80" : "text-[#0E8F9C]"}`} />
                    ) : (
                      <MasterIcon className={`h-4 w-4 ${isDark ? "text-white/80" : "text-[#0E8F9C]"}`} />
                    )}
                    <span className={isDark ? "text-white" : "text-[#0E8F9C]"}>{sub.planName}</span>
                  </div>

                  <div className="flex items-center justify-between text-xs text-[#7A8A92]">
                    <span className={isDark ? "text-white/60" : "text-[#7A8A92]"}>{sub.meta ?? "bundle"}</span>
                    <span className={isDark ? "text-white/60" : "text-[#7A8A92]"}>Due date: {sub.dueDate}</span>
                  </div>
                </div>

                <div className="flex items-center gap-3 px-4 pb-4">
                  <button
                    type="button"
                    className="flex-1 rounded-full bg-[#0F6773] px-3 py-2 text-sm font-medium text-white transition-colors hover:bg-[#0c7b85]"
                  >
                    View Apps
                  </button>
                  <button
                    type="button"
                    className={`flex-1 rounded-full border px-3 py-2 text-sm font-medium transition-colors ${
                      isDark
                        ? "border-white/30 text-white/80 hover:bg-white/10"
                        : "border-[#0F6773] text-[#0F6773] hover:bg-[#0F6773] hover:text-white"
                    }`}
                  >
                    View Invoice
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

