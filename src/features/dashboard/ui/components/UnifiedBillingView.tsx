import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import type { DashboardTokens, DashboardAppId } from "../types";
import {
  AppBillingIcon,
  AppPaidIcon,
  AppUnpaidIcon,
  AppOverdueIcon,
  FilledBundleSubscriptionsIcon,
  MasterIcon,
} from "@utilities/icons";

type Subscription = {
  readonly id: string;
  readonly invoiceCode: string;
  readonly amount: string;
  readonly currency: string;
  readonly planName: string;
  readonly status: "closed" | "active" | "pending";
  readonly dueDate: string;
  readonly meta?: string;
};

// Stats config will be created inside component to use translation

const bundleSubscriptions: Subscription[] = [
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

const masterSubscriptions: Subscription[] = [
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

const statusBadgeClass = (status: Subscription["status"]) => {
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

const getAppColors = (activeAppId: DashboardAppId) => {
  if (activeAppId === "app") {
    return {
      primary: "#0F6773",
      cardBg: "#E7F0F1",
      cardBgDark: "#0F1217",
      textPrimary: "#0B6E75",
      iconColor: "#0E8F9C",
      buttonBg: "#0F6773",
      buttonHover: "#0c7b85",
    };
  } else if (activeAppId === "software") {
    return {
      primary: "#071FD7",
      cardBg: "#E6E9FB",
      cardBgDark: "#0F1217",
      textPrimary: "#071FD7",
      iconColor: "#071FD7",
      buttonBg: "#071FD7",
      buttonHover: "#0518b0",
    };
  } else {
    // cloud
    return {
      primary: "#584ABC",
      cardBg: "#EEEDF8",
      cardBgDark: "#0F1217",
      textPrimary: "#584ABC",
      iconColor: "#584ABC",
      buttonBg: "#584ABC",
      buttonHover: "#4a3d9e",
    };
  }
};

type UnifiedBillingViewProps = {
  readonly tokens: DashboardTokens;
  readonly activeAppId: DashboardAppId;
};

export const UnifiedBillingView = ({ tokens, activeAppId }: UnifiedBillingViewProps) => {
  const { t } = useTranslation("landing");
  const isDark = tokens.isDark;
  const colors = getAppColors(activeAppId);

  // Stats config with translations
  const statsConfig = [
    { id: "all", label: t("dashboard.overview.all"), value: "6", icon: AppBillingIcon },
    { id: "paid", label: t("dashboard.status.paid"), value: "3", icon: AppPaidIcon },
    { id: "unpaid", label: t("dashboard.status.unpaid"), value: "2", icon: AppUnpaidIcon },
    { id: "overdue", label: t("dashboard.status.overdue"), value: "1", icon: AppOverdueIcon },
  ] as const;

  // Combine all subscriptions
  const allSubscriptions = useMemo(() => {
    return [...bundleSubscriptions, ...masterSubscriptions];
  }, []);

  return (
    <div className="flex flex-col gap-6">
      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statsConfig.map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.id}
              className={`${tokens.cardBase} rounded-[20px] p-6 transition-colors ${isDark ? "!bg-[0F1217]" : ""}`}
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

      {/* All Subscriptions Grid */}
      <div className={`${tokens.cardBase} rounded-[20px]  transition-colors ${isDark ? "bg-transparent" : "!bg-white"}`}>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {allSubscriptions.map((sub) => (
            <div
              key={sub.id}
              className={`rounded-[20px] overflow-hidden transition-colors ${isDark ? `!bg-[${colors.cardBgDark}]` : `!bg-[${colors.cardBg}]`}`}
              style={{ backgroundColor: isDark ? colors.cardBgDark : colors.cardBg }}
            >
              <div className="flex flex-col gap-3 px-4 py-4">
                <div className="flex flex-wrap items-center justify-between">
                  <span className={`text-sm font-medium ${isDark ? "text-white/80" : "text-[#4B6470]"}`}>{sub.invoiceCode}</span>
                  <span className={`px-4 py-1.5 rounded-full text-sm font-medium ${statusBadgeClass(sub.status)}`}>
                    {sub.status === "closed" ? t("dashboard.billing.closed") : sub.status === "active" ? t("dashboard.billing.active") : t("dashboard.billing.pending")}
                  </span>
                </div>

                <div className="flex items-end gap-1">
                  <span className={`text-2xl font-semibold leading-none ${isDark ? "text-white" : ""}`} style={{ color: isDark ? "white" : colors.textPrimary }}>
                    {sub.amount}
                  </span>
                  <span className={`text-xs font-semibold mb-[2px] ${isDark ? "text-white/70" : "text-[#4B6470]"}`}>{sub.currency}</span>
                </div>

                <div className="flex flex-wrap items-center gap-2 text-sm font-semibold">
                  {sub.planName === "Professional Bundle" ? (
                    <FilledBundleSubscriptionsIcon className={`h-4 w-4`} style={{ color: isDark ? "rgba(255,255,255,0.8)" : colors.iconColor }} />
                  ) : (
                    <MasterIcon className={`h-4 w-4`} style={{ color: isDark ? "rgba(255,255,255,0.8)" : colors.iconColor }} />
                  )}
                  <span style={{ color: isDark ? "white" : colors.iconColor }}>{sub.planName}</span>
                </div>

                <div className="flex flex-wrap items-center justify-between text-xs text-[#7A8A92]">
                  <span className={isDark ? "text-white/60" : "text-[#7A8A92]"}>{sub.meta ?? t("dashboard.billing.bundle")}</span>
                  <span className={isDark ? "text-white/60" : "text-[#7A8A92]"}>{t("dashboard.invoice.dueDate")}: {sub.dueDate}</span>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-3 px-4 pb-4">
                <button
                  type="button"
                  className="flex-1 rounded-full px-3 py-2 text-sm font-medium text-white transition-colors"
                  style={{ backgroundColor: colors.buttonBg }}
                  onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = colors.buttonHover)}
                  onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = colors.buttonBg)}
                >
                  {t("dashboard.billing.viewApps")}
                </button>
                <button
                  type="button"
                  className={`flex-1 rounded-full border px-3 py-2 text-sm font-medium transition-colors ${
                    isDark
                      ? "border-white/30 text-white/80 hover:bg-white/10"
                      : ""
                  }`}
                  style={!isDark ? { borderColor: colors.primary, color: colors.primary } : {}}
                  onMouseEnter={(e) => {
                    if (!isDark) {
                      e.currentTarget.style.backgroundColor = colors.primary;
                      e.currentTarget.style.color = "white";
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isDark) {
                      e.currentTarget.style.backgroundColor = "transparent";
                      e.currentTarget.style.color = colors.primary;
                    }
                  }}
                >
                  {t("dashboard.invoice.viewInvoice")}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
