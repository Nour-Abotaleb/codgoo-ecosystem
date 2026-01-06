import { useMemo } from "react";
import toast from "react-hot-toast";
import {
  BillingInvoicesIcon,
  PaidInvoicesIcon,
  UnPaidInvoicesIcon,
  OverdueInvoicesIcon,
  BankTasksIcon,
} from "@utilities/icons";
import type { DashboardTokens } from "../../types";
import { useGetProjectInvoicesQuery } from "@features/dashboard/api/dashboard-api";

type InvoicesViewProps = {
  readonly tokens: DashboardTokens;
  readonly projectId: string;
};

type InvoiceItem = {
  readonly id: string;
  readonly invoiceNumber: number;
  readonly amount: string;
  readonly paymentMethod: string;
  readonly createdDate: string;
  readonly dueDate: string;
  readonly status: "Paid" | "Unpaid" | "Overdue";
  readonly projectName?: string;
  readonly clientName?: string;
};

const getStatusBadgeStyle = (status: InvoiceItem["status"]) => {
  switch (status) {
    case "Paid":
      return "bg-[#E2FFE9] text-[#34C759]";
    case "Overdue":
      return "bg-[#FFF6D5] text-[#B48D00]";
    case "Unpaid":
      return "bg-[#F3F3F3] text-[#767676]";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

export const InvoicesView = ({ tokens, projectId }: InvoicesViewProps) => {
  const iconBaseColor = tokens.isDark ? "#FFFFFF" : "#2B3674";
  
  // Fetch invoices from API
  const projectIdNum = parseInt(projectId, 10);
  const { data: apiData, isLoading } = useGetProjectInvoicesQuery(projectIdNum);

  // Handle view invoice PDF with proper authentication
  const handleViewInvoice = async (invoiceId: string) => {
    const baseUrl = import.meta.env.VITE_API_URL || "https://back.codgoo.com/codgoo/public/api";
    const token = localStorage.getItem("auth_token");
    
    if (!token) {
      toast.error("No authentication token found");
      return;
    }

    try {
      // Fetch PDF with authentication headers
      const response = await fetch(`${baseUrl}/client/view-invoice/${invoiceId}?format=pdf`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/pdf',
          'API-Password': 'Nf:upZTg^7A?Hj'
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch invoice PDF');
      }

      // Get the PDF blob
      const blob = await response.blob();
      
      // Create a URL for the blob
      const blobUrl = window.URL.createObjectURL(blob);
      
      // Open in new tab
      window.open(blobUrl, '_blank');
      
      // Clean up the blob URL after a delay
      setTimeout(() => window.URL.revokeObjectURL(blobUrl), 100);
    } catch (error: any) {
      console.error('Error viewing invoice:', error);
      toast.error(error?.message || 'Failed to load invoice. Please try again.');
    }
  };

  // Transform API data with N/A fallbacks
  const invoicesData = useMemo(() => {
    if (apiData?.data) {
      return apiData.data.map((invoice: any): InvoiceItem => {
        // Map API status to valid status type
        const mapStatus = (status: string): "Paid" | "Unpaid" | "Overdue" => {
          const statusLower = status.toLowerCase();
          if (statusLower === "paid") return "Paid";
          if (statusLower === "overdue") return "Overdue";
          return "Unpaid";
        };

        return {
          id: String(invoice.id),
          invoiceNumber: invoice.id || 0,
          amount: invoice.amount ? `${invoice.amount} EGP` : "N/A",
          paymentMethod: invoice.payment_method || "N/A",
          createdDate: invoice.created_at || "N/A",
          dueDate: invoice.due_date || "N/A",
          status: mapStatus(invoice.status || "unpaid"),
          projectName: invoice.project_name || "N/A",
          clientName: invoice.client_name || "N/A"
        };
      });
    }
    return [];
  }, [apiData]);

  // Calculate invoice stats from API data
  const invoiceStats = useMemo(() => {
    const total = invoicesData.length;
    const paid = invoicesData.filter(inv => inv.status === "Paid").length;
    const unpaid = invoicesData.filter(inv => inv.status === "Unpaid").length;
    const overdue = invoicesData.filter(inv => inv.status === "Overdue").length;

    return [
      {
        id: "all",
        label: "All",
        value: String(total),
        icon: BillingInvoicesIcon,
      },
      {
        id: "paid",
        label: "Paid",
        value: String(paid),
        icon: PaidInvoicesIcon,
      },
      {
        id: "unpaid",
        label: "Unpaid",
        value: String(unpaid),
        icon: UnPaidInvoicesIcon,
      },
      {
        id: "overdue",
        label: "Overdue",
        value: String(overdue),
        icon: OverdueInvoicesIcon,
      },
    ];
  }, [invoicesData]);

  return (
    <div className="flex flex-col gap-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {invoiceStats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.id} className={`${tokens.cardBase} rounded-[20px] p-6`}>
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
      {isLoading ? (
        <div className="text-center py-12">
          <p className={tokens.isDark ? "text-white/50" : "text-[#A3AED0]"}>Loading invoices...</p>
        </div>
      ) : invoicesData.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {invoicesData.map((invoice) => (
          <div
            key={invoice.id}
            className={`${tokens.cardBase} rounded-[20px] overflow-hidden transition-colors ${tokens.isDark ? "bg-[#0F1217]" : "!bg-[#F4F5FF]"}`}
          >
            {/* Top Section */}
            <div className="flex flex-col gap-1 px-4 py-2">
                {/* Invoice ID */}
                <div className="flex items-center justify-between">
                  <span className={`text-base font-semibold ${tokens.isDark ? "text-white" : "text-[#607DAE]"}`}>
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
                <span className={`text-xl md:text-2xl font-semibold ${tokens.isDark ? "text-white" : "text-black"}`}>
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

            {/* Dates */}
            <div className="flex flex-col gap-3 px-4">
              <div className="flex items-center gap-4 pb-4">
                <div className="flex items-center gap-2">
                  <span className={`text-sm ${tokens.isDark ? "text-white" : "text-[#718EBF]"}`}>Created at:</span>
                  <span className={`text-sm font-medium ${tokens.isDark ? "text-white" : "text-[#071FD7]"}`}>
                    {invoice.createdDate}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`text-sm text-[#718EBF]`}>Due date:</span>
                  <span className={`text-sm font-medium ${tokens.isDark ? "text-white" : "text-[#071FD7]"}`}>
                    {invoice.dueDate}
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-3 pb-4">
                <button
                  type="button"
                  className={`flex-1 px-2 py-2.5 rounded-full text-sm font-medium transition-colors cursor-pointer ${
                    tokens.isDark
                      ? "bg-white/10 text-white/90 hover:bg-white/20"
                      : "bg-[#071FD7] text-white hover:bg-[#071FD7]/90"
                  }`}
                  aria-label={`Pay invoice ${invoice.invoiceNumber}`}
                >
                  Pay Now
                </button>
                <button
                  type="button"
                  onClick={() => handleViewInvoice(invoice.id)}
                  className={`flex-1 px-2 py-2.5 rounded-full text-sm font-medium transition-colors cursor-pointer ${
                    tokens.isDark
                      ? "border border-white/70 text-white/70 hover:bg-white/10"
                      : "border border-[#071FD7] text-[#071FD7] hover:bg-[#071FD7]/90 hover:text-white"
                  }`}
                  aria-label={`View invoice ${invoice.invoiceNumber}`}
                >
                  View Invoice
                </button>
              </div>
            </div>

          </div>
        ))}
      </div>
      ) : (
        <div className="text-center py-12">
          <p className={tokens.isDark ? "text-white/50" : "text-[#A3AED0]"}>No invoices found</p>
        </div>
      )}
    </div>
  );
};

