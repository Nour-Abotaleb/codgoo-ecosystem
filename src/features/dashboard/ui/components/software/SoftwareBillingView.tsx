import { useMemo } from "react";
import { SearchIcon, TechIcon, BillingInvoicesIcon, PaidInvoicesIcon, UnPaidInvoicesIcon, OverdueInvoicesIcon } from "@utilities/icons";
import type { DashboardTokens } from "../../types";

type SoftwareInvoiceItem = {
  readonly id: string;
  readonly invoiceId: string;
  readonly amount: string;
  readonly projectName: string;
  readonly invoiceNo: string;
  readonly dueDate: string;
  readonly status: "Paid" | "Unpaid" | "Overdue" | "Pending";
};

const softwareInvoicesData: SoftwareInvoiceItem[] = [
  { id: "inv-1", invoiceId: "INV-02315", amount: "4,500 EGP", projectName: "GreenScape Website", invoiceNo: "invoice no: 1 Of 3", dueDate: "30 Nov 2025", status: "Overdue" },
  { id: "inv-2", invoiceId: "INV-02316", amount: "3,200 EGP", projectName: "TechFlow Dashboard", invoiceNo: "invoice no: 2 Of 3", dueDate: "15 Dec 2025", status: "Paid" },
  { id: "inv-3", invoiceId: "INV-02317", amount: "5,800 EGP", projectName: "E-Commerce Platform", invoiceNo: "invoice no: 1 Of 2", dueDate: "20 Dec 2025", status: "Pending" },
  { id: "inv-4", invoiceId: "INV-02318", amount: "2,100 EGP", projectName: "Mobile App Design", invoiceNo: "invoice no: 3 Of 3", dueDate: "10 Nov 2025", status: "Overdue" },
  { id: "inv-5", invoiceId: "INV-02319", amount: "6,300 EGP", projectName: "Cloud Migration", invoiceNo: "invoice no: 1 Of 4", dueDate: "25 Dec 2025", status: "Paid" },
  { id: "inv-6", invoiceId: "INV-02320", amount: "1,900 EGP", projectName: "API Integration", invoiceNo: "invoice no: 2 Of 2", dueDate: "5 Dec 2025", status: "Unpaid" },
  { id: "inv-7", invoiceId: "INV-02321", amount: "4,700 EGP", projectName: "Data Analytics Tool", invoiceNo: "invoice no: 1 Of 1", dueDate: "12 Dec 2025", status: "Pending" },
  { id: "inv-8", invoiceId: "INV-02322", amount: "3,500 EGP", projectName: "Security Audit", invoiceNo: "invoice no: 2 Of 4", dueDate: "18 Dec 2025", status: "Paid" },
  { id: "inv-9", invoiceId: "INV-02323", amount: "5,200 EGP", projectName: "UI/UX Redesign", invoiceNo: "invoice no: 3 Of 4", dueDate: "8 Nov 2025", status: "Overdue" },
  { id: "inv-10", invoiceId: "INV-02324", amount: "2,800 EGP", projectName: "Backend Optimization", invoiceNo: "invoice no: 4 Of 4", dueDate: "22 Dec 2025", status: "Pending" },
  { id: "inv-11", invoiceId: "INV-02325", amount: "4,000 EGP", projectName: "Content Management", invoiceNo: "invoice no: 1 Of 2", dueDate: "28 Nov 2025", status: "Overdue" },
  { id: "inv-12", invoiceId: "INV-02326", amount: "3,600 EGP", projectName: "Payment Gateway", invoiceNo: "invoice no: 2 Of 2", dueDate: "30 Dec 2025", status: "Unpaid" }
];

const getStatusBadgeStyle = (status: SoftwareInvoiceItem["status"]) => {
  switch (status) {
    case "Paid":
      return "bg-[#E2FFE9] text-[#34C759]";
    case "Overdue":
      return "bg-[#FFF6D5] text-[#B48D00]";
    case "Pending":
      return "bg-[#E6E8FF] text-[#071FD7]";
    case "Unpaid":
      return "bg-[#F3F3F3] text-[#767676]";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

export const SoftwareStatisticsCards = ({ tokens }: { readonly tokens: DashboardTokens }) => {
  const iconBaseColor = tokens.isDark ? "#FFFFFF" : "#2B3674";

  const invoiceStats = useMemo(() => [
    {
      id: "all",
      label: "All",
      value: "6",
      icon: BillingInvoicesIcon,
    },
    {
      id: "paid",
      label: "Paid",
      value: "3",
      icon: PaidInvoicesIcon,
    },
    {
      id: "unpaid",
      label: "Unpaid",
      value: "2",
      icon: UnPaidInvoicesIcon,
    },
    {
      id: "overdue",
      label: "Overdue",
      value: "1",
      icon: OverdueInvoicesIcon,
    },
  ], []);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
      {invoiceStats.map((stat) => {
        const Icon = stat.icon;
        return (
          <div key={stat.id} className={`${tokens.cardBase} rounded-2xl p-6 transition-colors ${tokens.isDark ? "!bg-[#25223866]" : "!bg-white"}`}>
            <div className="flex flex-col gap-4">
              <div className="flex items-center justify-start" style={{ color: iconBaseColor }}>
                <Icon className="h-8 w-8 md:h-10 md:w-10" />
              </div>
              <div className="flex flex-col gap-2">
                <span className={`text-2xl font-semibold ${tokens.isDark ? "text-white" : "text-[#2B3674]"}`}>
                  {stat.value}
                </span>
                <span className="text-sm md:text-base text-[#A3AED0]">{stat.label}</span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export const SoftwareBillingView = ({ tokens, searchQuery, onSearchChange }: { readonly tokens: DashboardTokens; readonly searchQuery: string; readonly onSearchChange: (query: string) => void }) => {
  const filteredInvoices = useMemo(() => {
    if (!searchQuery.trim()) {
      return softwareInvoicesData;
    }
    const query = searchQuery.toLowerCase();
    return softwareInvoicesData.filter((invoice) => {
      return (
        invoice.invoiceId.toLowerCase().includes(query) ||
        invoice.projectName.toLowerCase().includes(query) ||
        invoice.amount.toLowerCase().includes(query) ||
        invoice.status.toLowerCase().includes(query)
      );
    });
  }, [searchQuery]);

  return (
    <div className="flex flex-col gap-6">
      {/* Search Bar */}
        <div className="flex items-center gap-3">
          <div
            className={`flex h-12 w-full items-center gap-3 rounded-full border ${tokens.isDark ? "border-[#2E314166]" : "border-[#DBDBDB]"} bg-[var(--color-search-bg)] px-4 text-[var(--color-search-text)] transition-colors`}
          >
          <SearchIcon className="h-5 w-5 text-[#A7A7A7]" />
          <input
            type="search"
            placeholder="Search by project name"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="flex-1 w-full bg-transparent text-sm text-[var(--color-search-text)] placeholder:text-[#A7A7A7] focus:outline-none"
          />
        </div>
      </div>

      {/* Invoices Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredInvoices.map((invoice) => (
          <div
            key={invoice.id}
            className={`${tokens.cardBase} rounded-2xl overflow-hidden transition-colors ${tokens.isDark ? "!bg-[#1E1B2E]" : "!bg-[#F4F5FF]"}`}
          >
            {/* Top Section */}
            <div className="flex flex-col gap-3 px-4 py-4">
              {/* Invoice ID */}
              <div className="flex items-center justify-between">
                <span className={`text-sm font-medium ${tokens.isDark ? "text-white" : "text-[#607DAE]"}`}>
                  #{invoice.invoiceId}
                </span>
                <span
                  className={`inline-flex items-center justify-center px-3 py-1 rounded-full text-sm font-medium ${getStatusBadgeStyle(
                    invoice.status
                  )}`}
                >
                  {invoice.status}
                </span>
              </div>

              {/* Amount */}
              <span className={`text-xl md:text-2xl font-semibold ${tokens.isDark ? "text-white" : "text-black"}`}>
                {invoice.amount}
              </span>

              {/* Project Name */}
              <div className={`flex items-center gap-1 font-semibold ${tokens.isDark ? "text-white/70" : "text-[#071FD7]"}`}>
                <TechIcon className="h-5 w-5 text-[#718EBF]" />
                <span className={`text-sm md:text-base ${tokens.isDark ? "text-white/70" : "text-[#071FD7]"}`}>
                  {invoice.projectName}
                </span>
              </div>
            </div>

            {/* Invoice Details */}
            <div className="flex flex-col gap-2 px-4 pb-4">
              <div className="flex items-center gap-5">
                <span className={`text-sm font-medium ${tokens.isDark ? "text-white/60" : "text-[#718EBF]"}`}>
                  {invoice.invoiceNo}
                </span>
                <div className="flex items-center gap-2">
                  <span className={`text-sm ${tokens.isDark ? "text-white/60" : "text-[#718EBF]"}`}>Due date:</span>
                  <span className={`text-sm font-medium ${tokens.isDark ? "text-white" : "text-black"}`}>
                    {invoice.dueDate}
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-3 pt-2">
                <button
                  type="button"
                  className={`flex-1 px-2 py-2.5 rounded-full text-sm font-medium transition-colors cursor-pointer ${
                    invoice.status === "Paid"
                      ? tokens.isDark
                        ? "bg-[#2B3FE8]/50 text-white hover:bg-[#2B3FE8]/60"
                        : "bg-[#2B3FE8]/50 text-white hover:bg-[#2B3FE8]/60"
                      : tokens.isDark
                        ? "bg-white/10 text-white/90 hover:bg-white/20"
                        : "bg-[#071FD7] text-white hover:bg-[#071FD7]/90"
                  }`}
                  aria-label={`Pay invoice ${invoice.invoiceId}`}
                >
                  Pay Now
                </button>
                <button
                  type="button"
                  className={`flex-1 px-2 py-2.5 rounded-full text-sm font-medium transition-colors cursor-pointer ${
                    invoice.status === "Paid"
                      ? tokens.isDark
                        ? "border border-white/70 text-white/70 hover:bg-white/10"
                        : "border border-[#2B3FE8] text-[#2B3FE8] hover:bg-[#2B3FE8]/90 hover:text-white"
                      : tokens.isDark
                        ? "border border-white/70 text-white/70 hover:bg-white/10"
                        : "border border-[#071FD7] text-[#071FD7] hover:bg-[#071FD7]/90 hover:text-white"
                  }`}
                  aria-label={`View invoice ${invoice.invoiceId}`}
                >
                  View Invoice
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

