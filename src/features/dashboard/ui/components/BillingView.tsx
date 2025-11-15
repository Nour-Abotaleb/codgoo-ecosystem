import { useState, useMemo } from "react";
import { SearchIcon, UnpaidIcon, PendingIcon, ActiveIcon, DeleteIcon, PayAllIcon, DownloadIcon } from "@utilities/icons";
import type { DashboardTokens } from "../types";

type BillingViewProps = {
  readonly tokens: DashboardTokens;
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

const InvoicesTable = ({ tokens }: { readonly tokens: DashboardTokens }) => {
  const [selectedInvoices, setSelectedInvoices] = useState<Set<string>>(new Set(["inv-297"]));

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

  const tableHeaderClass = `text-sm uppercase font-semibold ${tokens.subtleText}`;

  return (
    <div className="flex flex-col gap-6">
      <div className="overflow-x-auto">
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
            {invoicesData.map((invoice) => {
              const isSelected = selectedInvoices.has(invoice.id);
              return (
                <tr key={invoice.id} className="text-sm">
                  <td className="rounded-l-xl bg-[var(--color-table-row-bg)] px-6 py-4 transition-colors">
                    <div className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => toggleInvoice(invoice.id)}
                        className="h-4 w-4 rounded border-[var(--color-border-divider)] bg-transparent accent-[#584ABC] transition-colors"
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
                      <DeleteIcon className={`h-4 w-4 ${tokens.isDark ? "" : "[&_path]:fill-[#584ABC]"}`} />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="flex flex-col items-center justify-between gap-4 border-t border-[var(--color-border-divider)] pt-4 text-xs text-[var(--color-sidebar-nav-idle-text)] transition-colors sm:flex-row">
        <div className="flex items-center gap-2">
          {["«", "‹", "1", "2", "3", "…", "10", "›", "»"].map((label) => {
            const isCurrent = label === "1";
            const isEllipsis = label === "…";

            if (isEllipsis) {
              return (
                <span key={label} className="px-2 py-1 font-semibold">
                  {label}
                </span>
              );
            }

            return (
              <button
                key={label}
                type="button"
                className={`${isCurrent ? tokens.buttonFilled : tokens.buttonGhost} rounded-full px-3 py-1 text-xs font-semibold`}
              >
                {label}
              </button>
            );
          })}
        </div>

        <div className="flex items-center gap-2 text-sm text-[var(--color-page-text)]">
          <span>Showing</span>
          <select className="rounded-lg border border-[var(--color-border-divider)] bg-[var(--color-card-bg)] px-2 py-1 text-sm focus:outline-none">
            <option value="20">20</option>
            <option value="50">50</option>
            <option value="100">100</option>
          </select>
          <span>of 100</span>
        </div>
      </div>
    </div>
  );
};

const QuotesTable = ({ tokens }: { readonly tokens: DashboardTokens }) => {
  const [selectedQuotes, setSelectedQuotes] = useState<Set<string>>(new Set(["q-1"]));

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

  const tableHeaderClass = `text-sm uppercase ${tokens.subtleText}`;

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
          <thead className={tokens.isDark ? "" : "bg-[#F7F6FF]"}>
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
            {quotesData.map((quote) => {
              const isSelected = selectedQuotes.has(quote.id);
              return (
                <tr key={quote.id} className="text-sm">
                  <td className="rounded-l-xl bg-[var(--color-table-row-bg)] px-6 py-4 transition-colors">
                    <div className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => toggleQuote(quote.id)}
                        className="h-4 w-4 rounded border-[var(--color-border-divider)] bg-transparent accent-[#584ABC] transition-colors"
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
                      <DownloadIcon className={`h-4 w-4 ${tokens.isDark ? "[&_path]:fill-white" : "[&_path]:fill-[#584ABC]"}`} />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="flex flex-col items-center justify-between gap-4 border-t border-[var(--color-border-divider)] pt-4 text-xs text-[var(--color-sidebar-nav-idle-text)] transition-colors sm:flex-row">
        <div className="flex items-center gap-2">
          {["«", "‹", "1", "2", "3", "…", "10", "›", "»"].map((label) => {
            const isCurrent = label === "1";
            const isEllipsis = label === "…";

            if (isEllipsis) {
              return (
                <span key={label} className="px-2 py-1 font-semibold">
                  {label}
                </span>
              );
            }

            return (
              <button
                key={label}
                type="button"
                className={`${isCurrent ? tokens.buttonFilled : tokens.buttonGhost} rounded-full px-3 py-1 text-xs font-semibold`}
              >
                {label}
              </button>
            );
          })}
        </div>

        <div className="flex items-center gap-2 text-sm text-[var(--color-page-text)]">
          <span>Showing</span>
          <select className="rounded-lg border border-[var(--color-border-divider)] bg-[var(--color-card-bg)] px-2 py-1 text-sm focus:outline-none">
            <option value="20">20</option>
            <option value="50">50</option>
            <option value="100">100</option>
          </select>
          <span>of 100</span>
        </div>
      </div>
    </div>
  );
};

const MassPayment = ({ tokens }: { readonly tokens: DashboardTokens }) => {
  return (
    <div className={`${tokens.cardBase} rounded-[28px] border border-[var(--color-card-border)] p-8 transition-colors`}>
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
          className={`${tokens.buttonFilled} inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 text-sm font-semibold`}
        >
          Proceed to Payment
        </button>
      </div>
    </div>
  );
};

const AddFunds = ({ tokens }: { readonly tokens: DashboardTokens }) => {
  return (
    <div className={`${tokens.cardBase} rounded-[28px] border border-[var(--color-card-border)] p-8 transition-colors`}>
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
            className={`w-full rounded-xl border ${tokens.divider} bg-[var(--color-search-bg)] px-4 py-3 text-[var(--color-search-text)] placeholder:text-[var(--color-search-placeholder)] focus:outline-none focus:ring-2 focus:ring-[#7469C7]`}
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Payment Method</label>
          <select className={`w-full rounded-xl border ${tokens.divider} bg-[var(--color-search-bg)] px-4 py-3 text-[var(--color-search-text)] focus:outline-none focus:ring-2 focus:ring-[#7469C7]`}>
            <option value="">Select payment method</option>
            <option value="credit-card">Credit Card</option>
            <option value="paypal">PayPal</option>
            <option value="bank-transfer">Bank Transfer</option>
          </select>
        </div>
        <button
          type="button"
          className={`${tokens.buttonFilled} inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 text-sm font-semibold`}
        >
          Add Funds
        </button>
      </div>
    </div>
  );
};

export const BillingView = ({ tokens }: BillingViewProps) => {
  const [activeTab, setActiveTab] = useState<BillingTab>("invoices");

  const tabs = useMemo(
    () => [
      { id: "invoices" as const, label: "My Invoices" },
      { id: "quotes" as const, label: "My Quotes" },
      { id: "mass-payment" as const, label: "Mass Payment" },
      { id: "add-funds" as const, label: "Add Funds" }
    ],
    []
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case "invoices":
        return <InvoicesTable tokens={tokens} />;
      case "quotes":
        return <QuotesTable tokens={tokens} />;
      case "mass-payment":
        return <MassPayment tokens={tokens} />;
      case "add-funds":
        return <AddFunds tokens={tokens} />;
      default:
        return null;
    }
  };

  return (
    <div className={`${tokens.cardBase} rounded-[28px] border border-[var(--color-card-border)] px-6 py-4 transition-colors`}>
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
                      ? `${tokens.buttonFilled}`
                      : `${tokens.buttonGhost} hover:opacity-90`
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
                  className="flex-1 bg-transparent text-sm text-[var(--color-search-text)] placeholder:text-[var(--color-search-placeholder)] focus:outline-none"
                />
              </div>
              <button
                type="button"
                className={`${tokens.buttonFilled} inline-flex items-center gap-2 rounded-full px-4 py-2 text-base font-bold`}
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

