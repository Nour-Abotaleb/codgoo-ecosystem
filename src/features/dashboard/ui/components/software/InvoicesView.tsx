import {
  BillingInvoicesIcon,
  PaidInvoicesIcon,
  UnPaidInvoicesIcon,
  OverdueInvoicesIcon,
  BankTasksIcon,
  DeleteIcon,
  BillingIcon,
} from "@utilities/icons";
import type { DashboardTokens } from "../../types";

type InvoicesViewProps = {
  readonly tokens: DashboardTokens;
};

type InvoiceStat = {
  readonly id: string;
  readonly label: string;
  readonly value: string;
  readonly icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
};

type InvoiceItem = {
  readonly id: string;
  readonly invoiceNumber: number;
  readonly amount: string;
  readonly paymentMethod: string;
  readonly createdDate: string;
  readonly dueDate: string;
  readonly status: "Paid" | "Unpaid" | "Overdue";
};

const invoiceStats: readonly InvoiceStat[] = [
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
];

const invoicesData: readonly InvoiceItem[] = [
  {
    id: "inv-1",
    invoiceNumber: 12,
    amount: "347.00$",
    paymentMethod: "Bank Transfer",
    createdDate: "5 Nov 2025",
    dueDate: "30 Nov 2025",
    status: "Paid",
  },
  {
    id: "inv-2",
    invoiceNumber: 13,
    amount: "521.50$",
    paymentMethod: "Bank Transfer",
    createdDate: "4 Nov 2025",
    dueDate: "29 Nov 2025",
    status: "Paid",
  },
  {
    id: "inv-3",
    invoiceNumber: 14,
    amount: "892.25$",
    paymentMethod: "Bank Transfer",
    createdDate: "3 Nov 2025",
    dueDate: "28 Nov 2025",
    status: "Paid",
  },
  {
    id: "inv-4",
    invoiceNumber: 15,
    amount: "234.75$",
    paymentMethod: "Bank Transfer",
    createdDate: "2 Nov 2025",
    dueDate: "27 Nov 2025",
    status: "Overdue",
  },
  {
    id: "inv-5",
    invoiceNumber: 16,
    amount: "456.00$",
    paymentMethod: "Bank Transfer",
    createdDate: "1 Nov 2025",
    dueDate: "26 Nov 2025",
    status: "Unpaid",
  },
  {
    id: "inv-6",
    invoiceNumber: 17,
    amount: "678.90$",
    paymentMethod: "Bank Transfer",
    createdDate: "31 Oct 2025",
    dueDate: "25 Nov 2025",
    status: "Unpaid",
  },
];

const getStatusBadgeStyle = (status: InvoiceItem["status"]) => {
  switch (status) {
    case "Paid":
      return "bg-green-100 text-green-800";
    case "Overdue":
      return "bg-yellow-100 text-yellow-800";
    case "Unpaid":
      return "bg-gray-100 text-gray-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

export const InvoicesView = ({ tokens }: InvoicesViewProps) => {
  const iconBaseColor = tokens.isDark ? "#FFFFFF" : "#2B3674";

  return (
    <div className="flex flex-col gap-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {invoiceStats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.id} className={`${tokens.cardBase} rounded-2xl p-6`}>
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

      {/* Invoices Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {invoicesData.map((invoice) => (
          <div
            key={invoice.id}
            className={`${tokens.cardBase} rounded-2xl border border-[var(--color-card-border)] overflow-hidden transition-colors`}
          >
            {/* Top Section with Background */}
            <div className={tokens.isDark ? "bg-[#25223866]" : "bg-[#F4F5FF]"}>
              <div className="flex flex-col gap-4 p-4">
                {/* Invoice ID */}
                <div className="flex items-center justify-between">
                  <span className={`text-base font-semibold ${tokens.isDark ? "text-white" : "text-[#2B3674]"}`}>
                    #{invoice.invoiceNumber}
                  </span>
                  <span
                    className={`inline-flex items-center justify-center px-4 py-1 rounded-full text-sm font-medium ${getStatusBadgeStyle(
                      invoice.status
                    )}`}
                  >
                    {invoice.status}
                  </span>
                </div>

                {/* Amount */}
                <span className={`text-xl font-semibold ${tokens.isDark ? "text-white" : "text-[#2B3674]"}`}>
                  {invoice.amount}
                </span>

                {/* Payment Method */}
                <div className={`flex items-center gap-2 font-medium ${tokens.isDark ? "text-white/70" : "text-[#071FD7]"}`}>
                  <BankTasksIcon className="h-4 w-4" />
                  <span className={`text-sm ${tokens.isDark ? "text-white/70" : "text-[#071FD7]/70"}`}>
                    {invoice.paymentMethod}
                  </span>
                </div>
              </div>
            </div>

            {/* Dates */}
            <div className="flex flex-col gap-2 p-4 pt-2 border-t border-dashed border-[var(--color-border-divider)]">
              <div className="flex items-center justify-between">
                <span className={`text-sm ${tokens.subtleText}`}>Created at</span>
                <span className={`text-sm font-medium ${tokens.isDark ? "text-white" : "text-[#2B3674]"}`}>
                  {invoice.createdDate}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className={`text-sm ${tokens.subtleText}`}>Due date</span>
                <span className={`text-sm font-medium ${tokens.isDark ? "text-white" : "text-[#2B3674]"}`}>
                  {invoice.dueDate}
                </span>
              </div>
            </div>

            {/* Manage Section */}
            <div className="flex items-center justify-between px-4 pb-4 pt-2">
              <span className={`text-sm ${tokens.subtleText}`}>Manage</span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  className={`p-1.5 rounded-full transition-colors ${
                    tokens.isDark ? "bg-[#071FD7]/20" : "bg-[#F4F5FF]"
                  } hover:opacity-80`}
                  aria-label={`Manage invoice ${invoice.invoiceNumber}`}
                >
                  <BillingIcon className={`h-4 w-4 ${tokens.isDark ? "text-white" : "text-[#071FD7]"}`} />
                </button>
                <button
                  type="button"
                  className="p-1.5 rounded-full transition-colors"
                  style={{ backgroundColor: "rgb(252,221,191)" }}
                  aria-label={`Delete invoice ${invoice.invoiceNumber}`}
                >
                  <DeleteIcon className="h-4 w-4" style={{ color: "#FF0000" }} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

