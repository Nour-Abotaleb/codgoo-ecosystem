import { useState, useMemo, useEffect } from "react";
import { SearchIcon, UnpaidIcon, PendingIcon, ActiveIcon, DeleteIcon, PayAllIcon, DownloadIcon } from "@utilities/icons";
import type { DashboardTokens, DashboardAppId } from "../types";
import { SoftwareStatisticsCards, SoftwareBillingView } from "./software/SoftwareBillingView";
import { AppBillingView } from "./app/AppBillingView";

type BillingViewProps = {
  readonly tokens: DashboardTokens;
  readonly activeAppId: DashboardAppId;
};

type BillingTab = "invoices" | "quotes" | "mass-payment" | "add-funds";

type InvoiceItem = {
  readonly id: string;
  readonly invoiceNumber: number;
  readonly date: string;
  readonly total: string;
  readonly status: "Unpaid" | "Pending" | "Active";
};

type QuoteItem = {
  readonly id: string;
  readonly quoteNumber: number;
  readonly subject: string;
  readonly dateCreated: string;
  readonly validUntil: string;
  readonly stage: "Accepted" | "Pending" | "Draft";
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

const quotesData: QuoteItem[] = [
  { id: "q-1", quoteNumber: 1, subject: "Quotes Testing", dateCreated: "Sunday, September 4th, 2022", validUntil: "Sunday, September 4th, 2022", stage: "Accepted" },
  { id: "q-2", quoteNumber: 2, subject: "Quotes Testing", dateCreated: "Sunday, September 4th, 2022", validUntil: "Sunday, September 4th, 2022", stage: "Accepted" },
  { id: "q-3", quoteNumber: 3, subject: "Quotes Testing", dateCreated: "Sunday, September 4th, 2022", validUntil: "Sunday, September 4th, 2022", stage: "Accepted" },
  { id: "q-4", quoteNumber: 4, subject: "Quotes Testing", dateCreated: "Sunday, September 4th, 2022", validUntil: "Sunday, September 4th, 2022", stage: "Accepted" },
  { id: "q-5", quoteNumber: 5, subject: "Quotes Testing", dateCreated: "Sunday, September 4th, 2022", validUntil: "Sunday, September 4th, 2022", stage: "Accepted" },
  { id: "q-6", quoteNumber: 6, subject: "Quotes Testing", dateCreated: "Sunday, September 4th, 2022", validUntil: "Sunday, September 4th, 2022", stage: "Accepted" },
  { id: "q-7", quoteNumber: 7, subject: "Quotes Testing", dateCreated: "Sunday, September 4th, 2022", validUntil: "Sunday, September 4th, 2022", stage: "Accepted" },
  { id: "q-8", quoteNumber: 8, subject: "Quotes Testing", dateCreated: "Sunday, September 4th, 2022", validUntil: "Sunday, September 4th, 2022", stage: "Accepted" },
  { id: "q-9", quoteNumber: 9, subject: "Quotes Testing", dateCreated: "Sunday, September 4th, 2022", validUntil: "Sunday, September 4th, 2022", stage: "Accepted" },
  { id: "q-10", quoteNumber: 10, subject: "Quotes Testing", dateCreated: "Sunday, September 4th, 2022", validUntil: "Sunday, September 4th, 2022", stage: "Accepted" }
];

const renderStatusIcon = (status: InvoiceItem["status"] | QuoteItem["stage"]) => {
  if (status === "Active" || status === "Accepted") {
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

const getAppColors = (activeAppId: DashboardAppId, isDark: boolean) => {
  if (activeAppId === "app") {
    return {
      primary: "#0F6773",
      lightBg: isDark ? "" : "#E6F4F5",
      lighterAccent: "#1A8A9A",
      iconFill: isDark ? "white" : "#0F6773",
      buttonFilled: "bg-[#0F6773] text-white",
      buttonGhost: isDark ? "bg-[#9A9B9C22] text-[#E2E8FF]" : "bg-[#0F67731F] text-[#0F6773]"
    };
  } else if (activeAppId === "software") {
    return {
      primary: "#071FD7",
      lightBg: isDark ? "" : "#E6E8FF",
      lighterAccent: "#2B3FE8",
      iconFill: isDark ? "white" : "#071FD7",
      buttonFilled: "bg-[#071FD7] text-white",
      buttonGhost: isDark ? "bg-[#9A9B9C22] text-[#E2E8FF]" : "bg-[#071FD71F] text-[#071FD7]"
    };
  } else {
    // cloud
    return {
      primary: "#584ABC",
      lightBg: isDark ? "" : "#F7F6FF",
      lighterAccent: "#7469C7",
      iconFill: isDark ? "white" : "#584ABC",
      buttonFilled: "bg-[var(--color-button-filled-bg)] text-[var(--color-button-filled-text)]",
      buttonGhost: "bg-[var(--color-button-ghost-bg)] text-[var(--color-button-ghost-text)]"
    };
  }
};

const InvoicesTable = ({ tokens, searchQuery, activeAppId }: { readonly tokens: DashboardTokens; readonly searchQuery: string; readonly activeAppId: DashboardAppId }) => {
  const appColors = getAppColors(activeAppId, tokens.isDark);
  const [selectedInvoices, setSelectedInvoices] = useState<Set<string>>(new Set(["inv-297"]));
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 20;
  const totalRecords = 100;
  const totalPages = Math.ceil(totalRecords / pageSize);

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
          className={`${appColors.buttonGhost} rounded-full px-3 py-1 text-xs font-semibold disabled:opacity-50`}
        >
          ««
        </button>
        <button
          type="button"
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className={`${appColors.buttonGhost} rounded-full px-3 py-1 text-xs font-semibold disabled:opacity-50`}
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
                isCurrent ? appColors.buttonFilled : appColors.buttonGhost
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
          className={`${appColors.buttonGhost} rounded-full px-3 py-1 text-xs font-semibold disabled:opacity-50`}
        >
          »
        </button>
        <button
          type="button"
          onClick={() => handlePageChange(totalPages)}
          disabled={currentPage === totalPages}
          className={`${appColors.buttonGhost} rounded-full px-3 py-1 text-xs font-semibold disabled:opacity-50`}
        >
          »»
        </button>
      </div>
    );
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="overflow-x-auto">
        <table className="min-w-full table-auto border-separate border-spacing-y-2">
          <thead className={tokens.isDark ? "" : appColors.lightBg}>
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
                <tr key={invoice.id} className="text-sm">
                  <td className="rounded-l-xl bg-[var(--color-table-row-bg)] px-6 py-4 transition-colors">
                    <div className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => toggleInvoice(invoice.id)}
                        className={`h-4 w-4 rounded border-[var(--color-border-divider)] bg-transparent transition-colors`}
                        style={{ accentColor: appColors.primary }}
                        aria-label={`Select invoice ${invoice.invoiceNumber}`}
                      />
                      <span className="text-base font-semibold">{invoice.invoiceNumber}</span>
                    </div>
                  </td>
                  <td className="bg-[var(--color-table-row-bg)] px-6 py-4 transition-colors">
                    <p className="font-medium">{invoice.date}</p>
                  </td>
                  <td className="bg-[var(--color-table-row-bg)] px-6 py-4 transition-colors">
                    <p className="font-medium">{invoice.total}</p>
                  </td>
                  <td className="bg-[var(--color-table-row-bg)] px-6 py-4 transition-colors">
                    <span
                      className={`inline-flex items-center gap-1 text-sm font-medium ${
                        tokens.isDark ? "text-white" : "text-[#2B3674]"
                      }`}
                    >
                      {renderStatusIcon(invoice.status)}
                      {invoice.status}
                    </span>
                  </td>
                  <td className="rounded-r-xl bg-[var(--color-table-row-bg)] px-6 py-4 transition-colors">
                    <button
                      type="button"
                      className={`${tokens.buttonGhost} flex h-9 w-9 items-center justify-center rounded-full`}
                      aria-label={`Delete invoice ${invoice.invoiceNumber}`}
                    >
                      <DeleteIcon 
                        className={`h-4 w-4 ${
                          tokens.isDark 
                            ? "" 
                            : activeAppId === "app" 
                              ? "[&_path]:fill-[#0F6773]" 
                              : activeAppId === "software"
                                ? "[&_path]:fill-[#071FD7]"
                                : "[&_path]:fill-[#584ABC]"
                        }`}
                      />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {totalPages > 0 && (
        <div className="flex flex-col items-center justify-between gap-4 border-t border-[var(--color-border-divider)] pt-4 text-xs text-[var(--color-sidebar-nav-idle-text)] transition-colors sm:flex-row">
          {renderPagination()}

          <div className="flex items-center gap-2 text-sm text-[var(--color-page-text)]">
            <span>Showing</span>
            <select className="rounded-lg border border-[var(--color-border-divider)] bg-[var(--color-card-bg)] px-2 py-1 text-sm focus:outline-none">
              <option value="20">20</option>
              <option value="50">50</option>
              <option value="100">100</option>
            </select>
            <span>of {totalRecords}</span>
          </div>
        </div>
      )}
    </div>
  );
};

const QuotesTable = ({ tokens, searchQuery, activeAppId }: { readonly tokens: DashboardTokens; readonly searchQuery: string; readonly activeAppId: DashboardAppId }) => {
  const appColors = getAppColors(activeAppId, tokens.isDark);
  const [selectedQuotes, setSelectedQuotes] = useState<Set<string>>(new Set(["q-1"]));
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 20;
  const totalRecords = 100;
  const totalPages = Math.ceil(totalRecords / pageSize);

  const filteredQuotes = useMemo(() => {
    if (!searchQuery.trim()) {
      return quotesData;
    }
    const query = searchQuery.toLowerCase();
    return quotesData.filter((quote) => {
      return (
        quote.quoteNumber.toString().includes(query) ||
        quote.subject.toLowerCase().includes(query) ||
        quote.dateCreated.toLowerCase().includes(query) ||
        quote.validUntil.toLowerCase().includes(query) ||
        quote.stage.toLowerCase().includes(query)
      );
    });
  }, [searchQuery]);

  const paginatedQuotes = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    const end = start + pageSize;
    return filteredQuotes.slice(start, end);
  }, [filteredQuotes, currentPage, pageSize]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);

  const toggleQuote = (id: string) => {
    setSelectedQuotes((prev) => {
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

  const tableHeaderClass = `text-sm uppercase ${tokens.subtleText}`;

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
          className={`${appColors.buttonGhost} rounded-full px-3 py-1 text-xs font-semibold disabled:opacity-50`}
        >
          ««
        </button>
        <button
          type="button"
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className={`${appColors.buttonGhost} rounded-full px-3 py-1 text-xs font-semibold disabled:opacity-50`}
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
                isCurrent ? appColors.buttonFilled : appColors.buttonGhost
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
          className={`${appColors.buttonGhost} rounded-full px-3 py-1 text-xs font-semibold disabled:opacity-50`}
        >
          »
        </button>
        <button
          type="button"
          onClick={() => handlePageChange(totalPages)}
          disabled={currentPage === totalPages}
          className={`${appColors.buttonGhost} rounded-full px-3 py-1 text-xs font-semibold disabled:opacity-50`}
        >
          »»
        </button>
      </div>
    );
  };

  return (
    <div className="flex flex-col gap-6">
      {/* <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div
          className={`flex h-12 flex-1 items-center gap-3 rounded-full border ${tokens.divider} bg-[var(--color-search-bg)] px-4 text-[var(--color-search-text)] transition-colors sm:max-w-xs`}
        >
          <SearchIcon className="h-5 w-5 text-[var(--color-search-placeholder)]" />
          <input
            type="search"
            placeholder="Search"
            className="flex-1 bg-transparent text-sm text-[var(--color-search-text)] placeholder:text-[var(--color-search-placeholder)] focus:outline-none"
          />
        </div>
      </div> */}
      <div className="overflow-x-auto">
        <table className="min-w-full table-auto border-separate border-spacing-y-2">
          <thead className={tokens.isDark ? "" : appColors.lightBg}>
            <tr className="[&>th]:border-y [&>th]:border-[var(--color-border-divider)]">
              <th className="whitespace-nowrap py-3 pe-6 text-left">
                <span className={tableHeaderClass}>#Quote</span>
              </th>
              <th className="whitespace-nowrap py-3 pe-6 text-left">
                <span className={tableHeaderClass}>Subject</span>
              </th>
              <th className="whitespace-nowrap py-3 pe-6 text-left">
                <span className={tableHeaderClass}>Date Created</span>
              </th>
              <th className="whitespace-nowrap py-3 pe-6 text-left">
                <span className={tableHeaderClass}>Valid Until</span>
              </th>
              <th className="whitespace-nowrap py-3 pe-6 text-left">
                <span className={tableHeaderClass}>Stage</span>
              </th>
              <th className="whitespace-nowrap py-3 text-left">
                <span className={tableHeaderClass}>Actions</span>
              </th>
            </tr>
          </thead>
          <tbody>
            {paginatedQuotes.map((quote) => {
              const isSelected = selectedQuotes.has(quote.id);
              return (
                <tr key={quote.id} className="text-sm">
                  <td className="rounded-l-xl bg-[var(--color-table-row-bg)] px-6 py-4 transition-colors">
                    <div className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => toggleQuote(quote.id)}
                        className={`h-4 w-4 rounded border-[var(--color-border-divider)] bg-transparent transition-colors`}
                        style={{ accentColor: appColors.primary }}
                        aria-label={`Select quote ${quote.quoteNumber}`}
                      />
                      <span className="text-base font-semibold">{quote.quoteNumber}</span>
                    </div>
                  </td>
                  <td className="bg-[var(--color-table-row-bg)] px-6 py-4 transition-colors">
                    <p className="font-medium">{quote.subject}</p>
                  </td>
                  <td className="bg-[var(--color-table-row-bg)] px-6 py-4 transition-colors">
                    <p className="font-medium">{quote.dateCreated}</p>
                  </td>
                  <td className="bg-[var(--color-table-row-bg)] px-6 py-4 transition-colors">
                    <p className="font-medium">{quote.validUntil}</p>
                  </td>
                  <td className="bg-[var(--color-table-row-bg)] px-6 py-4 transition-colors">
                    <span
                      className={`inline-flex items-center gap-1 text-sm font-medium ${
                        tokens.isDark ? "text-white" : "text-[#2B3674]"
                      }`}
                    >
                      {renderStatusIcon(quote.stage)}
                      {quote.stage}
                    </span>
                  </td>
                  <td className="rounded-r-xl bg-[var(--color-table-row-bg)] px-6 py-4 transition-colors">
                    <button
                      type="button"
                      className={`${tokens.buttonGhost} flex h-9 w-9 items-center justify-center rounded-full`}
                      aria-label={`Download quote ${quote.quoteNumber}`}
                    >
                      <DownloadIcon 
                        className={`h-4 w-4 ${
                          tokens.isDark 
                            ? "[&_path]:fill-white" 
                            : activeAppId === "app" 
                              ? "[&_path]:fill-[#0F6773]" 
                              : activeAppId === "software"
                                ? "[&_path]:fill-[#071FD7]"
                                : "[&_path]:fill-[#584ABC]"
                        }`}
                      />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {totalPages > 0 && (
        <div className="flex flex-col items-center justify-between gap-4 border-t border-[var(--color-border-divider)] pt-4 text-xs text-[var(--color-sidebar-nav-idle-text)] transition-colors sm:flex-row">
          {renderPagination()}

          <div className="flex items-center gap-2 text-sm text-[var(--color-page-text)]">
            <span>Showing</span>
            <select className="rounded-lg border border-[var(--color-border-divider)] bg-[var(--color-card-bg)] px-2 py-1 text-sm focus:outline-none">
              <option value="20">20</option>
              <option value="50">50</option>
              <option value="100">100</option>
            </select>
            <span>of {totalRecords}</span>
          </div>
        </div>
      )}
    </div>
  );
};

const MassPayment = ({ tokens, activeAppId }: { readonly tokens: DashboardTokens; readonly activeAppId: DashboardAppId }) => {
  const appColors = getAppColors(activeAppId, tokens.isDark);
  return (
    <div className={`${tokens.cardBase} rounded-[28px] p-8 transition-colors`}>
      <h3 className="text-2xl font-semibold mb-4">Mass Payment</h3>
      <p className={`text-sm ${tokens.subtleText} mb-6`}>
        Pay multiple invoices at once using this feature. Select the invoices you want to pay and proceed with a single payment.
      </p>
      <div className="flex flex-col gap-4">
        <div className="rounded-2xl border border-[var(--color-border-divider)] bg-[var(--color-shell-bg)] p-6">
          <h4 className="text-lg font-semibold mb-4">Selected Invoices</h4>
          <p className={`text-sm ${tokens.subtleText}`}>No invoices selected. Go to "My Invoices" tab to select invoices for mass payment.</p>
        </div>
        <button
          type="button"
          className={`${appColors.buttonFilled} inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 text-sm font-semibold`}
        >
          Proceed to Payment
        </button>
      </div>
    </div>
  );
};

const AddFunds = ({ tokens, activeAppId }: { readonly tokens: DashboardTokens; readonly activeAppId: DashboardAppId }) => {
  const appColors = getAppColors(activeAppId, tokens.isDark);
  return (
    <div className={`${tokens.cardBase} rounded-[28px] p-8 transition-colors`}>
      <h3 className="text-2xl font-semibold mb-4">Add Funds</h3>
      <p className={`text-sm ${tokens.subtleText} mb-6`}>
        Add funds to your account balance to pay for invoices automatically or use for future purchases.
      </p>
      <div className="flex flex-col gap-6">
        <div>
          <label className="block text-sm font-medium mb-2">Amount</label>
          <input
            type="number"
            placeholder="Enter amount"
            className={`w-full rounded-xl border ${tokens.divider} bg-[var(--color-search-bg)] px-4 py-3 text-[var(--color-search-text)] placeholder:text-[var(--color-search-placeholder)] focus:outline-none`}
            style={{ 
              "--tw-ring-color": appColors.lighterAccent,
            } as React.CSSProperties & { "--tw-ring-color": string }}
            onFocus={(e) => {
              e.currentTarget.style.boxShadow = `0 0 0 2px ${appColors.lighterAccent}`;
            }}
            onBlur={(e) => {
              e.currentTarget.style.boxShadow = "";
            }}
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Payment Method</label>
          <select className={`w-full rounded-xl border ${tokens.divider} bg-[var(--color-search-bg)] px-4 py-3 text-[var(--color-search-text)] focus:outline-none`}
            style={{ 
              "--tw-ring-color": appColors.lighterAccent,
            } as React.CSSProperties & { "--tw-ring-color": string }}
            onFocus={(e) => {
              e.currentTarget.style.boxShadow = `0 0 0 2px ${appColors.lighterAccent}`;
            }}
            onBlur={(e) => {
              e.currentTarget.style.boxShadow = "";
            }}>
            <option value="">Select payment method</option>
            <option value="credit-card">Credit Card</option>
            <option value="paypal">PayPal</option>
            <option value="bank-transfer">Bank Transfer</option>
          </select>
        </div>
        <button
          type="button"
          className={`${appColors.buttonFilled} inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 text-sm font-semibold`}
        >
          Add Funds
        </button>
      </div>
    </div>
  );
};

export const BillingView = ({ tokens, activeAppId }: BillingViewProps) => {
  const appColors = getAppColors(activeAppId, tokens.isDark);
  const [activeTab, setActiveTab] = useState<BillingTab>("invoices");
  const [searchQuery, setSearchQuery] = useState("");

  const tabs = useMemo(
    () => [
      { id: "invoices" as const, label: "My Invoices" },
      { id: "quotes" as const, label: "My Quotes" },
      { id: "mass-payment" as const, label: "Mass Payment" },
      { id: "add-funds" as const, label: "Add Funds" }
    ],
    []
  );

  useEffect(() => {
    setSearchQuery("");
  }, [activeTab]);

  const renderTabContent = () => {
    switch (activeTab) {
      case "invoices":
        return <InvoicesTable tokens={tokens} searchQuery={searchQuery} activeAppId={activeAppId} />;
      case "quotes":
        return <QuotesTable tokens={tokens} searchQuery={searchQuery} activeAppId={activeAppId} />;
      case "mass-payment":
        return <MassPayment tokens={tokens} activeAppId={activeAppId} />;
      case "add-funds":
        return <AddFunds tokens={tokens} activeAppId={activeAppId} />;
      default:
        return null;
    }
  };

  // For software, show the card-based billing view directly without tabs
  if (activeAppId === "software") {
    return (
      <>
        <SoftwareStatisticsCards tokens={tokens} />
        <div className={`${tokens.cardBase} rounded-[28px] p-6 transition-colors`}>
          <SoftwareBillingView tokens={tokens} searchQuery={searchQuery} onSearchChange={setSearchQuery} />
        </div>
      </>
    );
  }

  // For app, show the dedicated billing experience with tabs and updated styling
  if (activeAppId === "app") {
    return (
      <AppBillingView tokens={tokens} />
    );
  }

  // For cloud and app, show the tabbed interface
  return (
    <div className={`${tokens.cardBase} rounded-[28px] px-6 py-4 transition-colors`}>
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          {/* <h2 className={`text-2xl font-semibold md:text-3xl ${tokens.isDark ? "text-white" : "text-[#2B3674]"}`}>
            {tabs.find((tab) => tab.id === activeTab)?.label ?? "Billing"}
          </h2> */}
          
          <div className="flex flex-wrap items-center gap-2">
            {tabs.map((tab) => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id)}
                  className={`rounded-full px-4 py-2 text-sm font-semibold transition-colors ${
                    isActive
                      ? appColors.buttonFilled
                      : `${appColors.buttonGhost} hover:opacity-90`
                  }`}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3">
              <div
                className={`flex h-11 flex-1 items-center gap-3 rounded-full border ${tokens.divider} bg-[var(--color-search-bg)] px-4 text-[var(--color-search-text)] transition-colors sm:max-w-xs`}
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
                className={`${appColors.buttonFilled} inline-flex items-center gap-2 rounded-full px-4 py-2 text-base font-bold`}
              >
                <PayAllIcon className="h-6 w-6" />
                Pay All
              </button>
            </div>
          </div>
        </div>
        <div className="">{renderTabContent()}</div>
      </div>
    </div>
  );
};

