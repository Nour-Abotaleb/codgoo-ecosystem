import { useState, useMemo, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { SearchIcon, UnpaidIcon, PendingIcon, ActiveIcon, DeleteIcon, PayAllIcon } from "@utilities/icons";
import type { DashboardTokens } from "../../types";

type HostViewProps = {
  readonly tokens: DashboardTokens;
};

type HostTab = "all" | "uninstalled";

type InvoiceItem = {
  readonly id: string;
  readonly invoiceNumber: number;
  readonly date: string;
  readonly total: string;
  readonly status: "Unpaid" | "Pending" | "Active";
};

const invoicesData: InvoiceItem[] = [
  { id: "inv-297", invoiceNumber: 297, date: "Tuesday, October 28th, 2025", total: "$19.75 USD", status: "Unpaid" },
  { id: "inv-300", invoiceNumber: 300, date: "Tuesday, October 28th, 2025", total: "$19.75 USD", status: "Unpaid" },
  { id: "inv-301", invoiceNumber: 301, date: "Tuesday, October 28th, 2025", total: "$19.75 USD", status: "Pending" },
  { id: "inv-305", invoiceNumber: 305, date: "Tuesday, October 28th, 2025", total: "$19.75 USD", status: "Active" },
  { id: "inv-306", invoiceNumber: 306, date: "Tuesday, October 28th, 2025", total: "$19.75 USD", status: "Active" },
  { id: "inv-307", invoiceNumber: 307, date: "Tuesday, October 28th, 2025", total: "$19.75 USD", status: "Pending" },
  { id: "inv-308", invoiceNumber: 308, date: "Tuesday, October 28th, 2025", total: "$19.75 USD", status: "Pending" },
  { id: "inv-309", invoiceNumber: 309, date: "Tuesday, October 28th, 2025", total: "$19.75 USD", status: "Pending" },
  { id: "inv-310", invoiceNumber: 310, date: "Tuesday, October 28th, 2025", total: "$19.75 USD", status: "Pending" },
  { id: "inv-311", invoiceNumber: 311, date: "Tuesday, October 28th, 2025", total: "$19.75 USD", status: "Active" }
];

const renderStatusIcon = (status: InvoiceItem["status"]) => {
  if (status === "Active") {
    return <ActiveIcon className="h-5 w-5" />;
  }
  if (status === "Pending") {
    return <PendingIcon className="h-5 w-5" />;
  }
  if (status === "Unpaid") {
    return <UnpaidIcon className="h-5 w-5" />;
  }
  return null;
};

export const HostView = ({ tokens }: HostViewProps) => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<HostTab>("all");
  const [selectedInvoices, setSelectedInvoices] = useState<Set<string>>(new Set(["inv-297"]));
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const pageSize = 20;
  const totalRecords = 100;
  const totalPages = Math.ceil(totalRecords / pageSize);

  const allCount = totalRecords;
  const uninstalledCount = 0;

  const filteredInvoices = useMemo(() => {
    if (!searchQuery.trim()) {
      return invoicesData;
    }
    const query = searchQuery.toLowerCase();
    return invoicesData.filter((invoice) => {
      return (
        invoice.invoiceNumber.toString().includes(query) ||
        invoice.date.toLowerCase().includes(query) ||
        invoice.total.toLowerCase().includes(query) ||
        invoice.status.toLowerCase().includes(query)
      );
    });
  }, [searchQuery]);

  const paginatedInvoices = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    const end = start + pageSize;
    return filteredInvoices.slice(start, end);
  }, [filteredInvoices, currentPage, pageSize]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);

  const toggleInvoice = (id: string) => {
    setSelectedInvoices((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const tableHeaderClass = `text-sm uppercase font-semibold ${tokens.subtleText}`;

  const renderPagination = () => {
    const pages: (number | string)[] = [];
    
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      pages.push(1);
      
      if (currentPage > 3) {
        pages.push("...");
      }
      
      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);
      
      for (let i = start; i <= end; i++) {
        if (i !== 1 && i !== totalPages) {
          pages.push(i);
        }
      }
      
      if (currentPage < totalPages - 2) {
        pages.push("...");
      }
      
      pages.push(totalPages);
    }

    return (
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => handlePageChange(1)}
          disabled={currentPage === 1}
          className={`${tokens.buttonGhost} rounded-full px-3 py-1 text-xs font-semibold disabled:opacity-50`}
        >
          ««
        </button>
        <button
          type="button"
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className={`${tokens.buttonGhost} rounded-full px-3 py-1 text-xs font-semibold disabled:opacity-50`}
        >
          «
        </button>
        {pages.map((page, index) => {
          if (page === "...") {
            return (
              <span
                key={`ellipsis-${index}`}
                className="px-2 py-1 font-semibold text-[var(--color-page-text)]"
              >
                …
              </span>
            );
          }
          const pageNum = page as number;
          const isCurrent = pageNum === currentPage;
          return (
            <button
              key={pageNum}
              type="button"
              onClick={() => handlePageChange(pageNum)}
              className={`${
                isCurrent ? tokens.buttonFilled : tokens.buttonGhost
              } rounded-full px-3 py-1 text-xs font-semibold`}
            >
              {pageNum}
            </button>
          );
        })}
        <button
          type="button"
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className={`${tokens.buttonGhost} rounded-full px-3 py-1 text-xs font-semibold disabled:opacity-50`}
        >
          »
        </button>
        <button
          type="button"
          onClick={() => handlePageChange(totalPages)}
          disabled={currentPage === totalPages}
          className={`${tokens.buttonGhost} rounded-full px-3 py-1 text-xs font-semibold disabled:opacity-50`}
        >
          »»
        </button>
      </div>
    );
  };

  return (
    <div className="flex flex-col gap-6">
      <div className={`${tokens.cardBase} rounded-[28px] py-4 px-6 transition-colors`}>
        {/* Title */}
        {/* <div className="mb-3">
          <h2 className={`text-2xl font-semibold md:text-3xl ${tokens.isDark ? "text-white" : "text-[#2B3674]"}`}>
            My Invoices
          </h2>
        </div> */}

        {/* Tabs and Actions */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4 rounded-full p-1">
            <button
              type="button"
              onClick={() => setActiveTab("all")}
              className={
                activeTab === "all"
                  ? `${tokens.buttonFilled} rounded-full px-5 py-2 text-sm font-semibold`
                  : `${tokens.buttonGhost} rounded-full px-4 py-2 text-sm font-medium tracking-[0.05em]`
              }
            >
              All ({allCount})
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("uninstalled")}
              className={
                activeTab === "uninstalled"
                  ? `${tokens.buttonFilled} rounded-full px-5 py-2 text-sm font-semibold`
                  : `${tokens.buttonGhost} rounded-full px-4 py-2 text-sm font-medium tracking-[0.05em]`
              }
            >
              Uninstalled ({uninstalledCount})
            </button>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <div
              className={`flex h-11 flex-1 items-center gap-3 rounded-full border ${tokens.divider} bg-transparent stroke px-4 text-[var(--color-search-text)] transition-colors sm:w-72`}
            >
              <SearchIcon className="h-5 w-5 text-[var(--color-search-placeholder)]" />
              <input
                type="search"
                placeholder="Search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1 bg-transparent text-sm text-[var(--color-search-text)] placeholder:text-[var(--color-search-placeholder)] focus:outline-none"
              />
            </div>
            <button
              type="button"
              className={`${tokens.buttonFilled} inline-flex items-center justify-center gap-2 rounded-full px-3 py-2 text-sm font-semibold`}
            >
              <PayAllIcon className="h-5 w-5" />
              Pay All
            </button>
          </div>
        </div>

        {/* Invoice Table */}
        <div className="mt-2 overflow-x-auto">
          <table className="min-w-full table-auto border-separate border-spacing-y-2">
            <thead className={tokens.isDark ? "" : "bg-[#F7F6FF]"}>
              <tr className="[&>th]:border-y [&>th]:border-[var(--color-border-divider)]">
                <th className="whitespace-nowrap py-3 pe-6 text-left">
                  <span className={tableHeaderClass}>#Invoice</span>
                </th>
                <th className="whitespace-nowrap py-3 pe-6 text-left">
                  <span className={tableHeaderClass}>Invoice Date</span>
                </th>
                <th className="whitespace-nowrap py-3 pe-6 text-left">
                  <span className={tableHeaderClass}>Total</span>
                </th>
                <th className="whitespace-nowrap py-3 pe-6 text-left">
                  <span className={tableHeaderClass}>Status</span>
                </th>
                <th className="whitespace-nowrap py-3 text-left">
                  <span className={tableHeaderClass}>Actions</span>
                </th>
              </tr>
            </thead>
            <tbody>
              {paginatedInvoices.map((invoice) => {
                const isSelected = selectedInvoices.has(invoice.id);
                return (
                  <tr
                    key={invoice.id}
                    className="text-sm cursor-pointer hover:opacity-80 transition-opacity"
                    onClick={(e) => {
                      // Don't navigate if clicking on checkbox or delete button
                      const target = e.target as HTMLElement;
                      if (target.closest('input[type="checkbox"]') || target.closest('button')) {
                        return;
                      }
                      navigate(`/dashboard/manage-host/${invoice.id}`);
                    }}
                  >
                    <td className="rounded-l-xl px-6 py-4 transition-colors">
                      <div className="flex items-center gap-3">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={(e) => {
                            e.stopPropagation();
                            toggleInvoice(invoice.id);
                          }}
                          onClick={(e) => e.stopPropagation()}
                          className="h-4 w-4 rounded border-[var(--color-border-divider)] bg-transparent accent-[#584ABC] transition-colors"
                          aria-label={`Select invoice ${invoice.invoiceNumber}`}
                        />
                        <span className="text-base font-semibold">{invoice.invoiceNumber}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 transition-colors">
                      <p className="font-medium">{invoice.date}</p>
                    </td>
                    <td className="px-6 py-4 transition-colors">
                      <p className="font-medium">{invoice.total}</p>
                    </td>
                    <td className="px-6 py-4 transition-colors">
                      <span
                        className={`inline-flex items-center gap-1 text-sm font-medium ${
                          tokens.isDark ? "text-white" : "text-[#2B3674]"
                        }`}
                      >
                        {renderStatusIcon(invoice.status)}
                        {invoice.status}
                      </span>
                    </td>
                    <td className="rounded-r-xl px-6 py-4 transition-colors">
                      <button
                        type="button"
                        onClick={(e) => e.stopPropagation()}
                        className={`${tokens.buttonGhost} flex h-9 w-9 items-center justify-center rounded-full`}
                        aria-label={`Delete invoice ${invoice.invoiceNumber}`}
                      >
                        <DeleteIcon className={`h-4 w-4 ${tokens.isDark ? "" : "[&_path]:fill-[#584ABC]"}`} />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="mt-8 flex flex-col items-center justify-between gap-4 border-t border-[var(--color-border-divider)] pt-4 text-xs text-[var(--color-sidebar-nav-idle-text)] transition-colors sm:flex-row">
          {renderPagination()}

          <div className="flex items-center gap-2 text-sm text-[var(--color-page-text)]">
            <span>Showing</span>
            <select className="rounded-lg border border-[var(--color-border-divider)] px-2 py-1 text-sm focus:outline-none">
              <option value="20">20</option>
              <option value="50">50</option>
              <option value="100">100</option>
            </select>
            <span>of {totalRecords}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

