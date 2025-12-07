import { useState } from "react";
import type { DashboardTokens } from "../../types";
import type { ProjectCardData } from "./ProjectCard";

type ProposalsViewProps = {
  readonly tokens: DashboardTokens;
  readonly project: ProjectCardData;
};

type ProposalItem = {
  readonly id: string;
  readonly number: number;
  readonly item: string;
  readonly description: string;
  readonly qty: number;
  readonly rate: number;
  readonly tax: number;
  readonly amount: number;
};

type SummaryTab = "summary" | "discussion";

const proposalItems: readonly ProposalItem[] = [
  {
    id: "1",
    number: 1,
    item: "Web Design",
    description: "Enim amet quas ducimus commodi reprehenderit et. Et non numquam aut optio",
    qty: 1,
    rate: 5400.0,
    tax: 0,
    amount: 5400.0
  },
  {
    id: "2",
    number: 2,
    item: "Consultant Services",
    description: "Dolor laboriosam suscipit eius consequatur. Aliquid unde sit dolorem velit magnam quos et.",
    qty: 1,
    rate: 500.0,
    tax: 0,
    amount: 500.0
  }
];

const subTotal = proposalItems.reduce((sum, item) => sum + item.amount, 0);
const total = subTotal;

export const ProposalsView = ({ tokens, project: _project }: ProposalsViewProps) => {
  const [activeSummaryTab, setActiveSummaryTab] = useState<SummaryTab>("summary");

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2
    }).format(amount);
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Project Header */}
      <div className={`${tokens.cardBase} rounded-2xl p-6`}>
        <div className="flex items-start justify-between">
          <div className="flex flex-col gap-2">
            <h1 className={`text-2xl md:text-3xl font-bold ${tokens.isDark ? "text-white" : "text-black"}`}>
              # PRO-000002
            </h1>
            <h2 className={`text-xl md:text-2xl font-semibold ${tokens.isDark ? "text-white/70" : "text-black/70"}`}>
              Web Design Proposal
            </h2>
          </div>
          <button
            type="button"
            className={`flex items-center gap-2 px-8 py-2 rounded-full font-medium transition-colors ${
              tokens.isDark
                ? "border border-[#071FD7] text-[#071FD7]"
                : "border border-[#071FD7] text-[#071FD7]"
            }`}
          >
            <span>Download</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          {/* Itemized Services Table */}
          <div className={`${tokens.cardBase} rounded-2xl overflow-hidden`}>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className={`border-b ${tokens.isDark ? "border-white/20" : "border-[#E6E6E6]"}`}>
                    <th className={`text-left py-4 px-6 text-sm font-semibold ${tokens.subtleText}`}>#</th>
                    <th className={`text-left py-4 px-6 text-sm font-semibold ${tokens.subtleText}`}>ITEM</th>
                    <th className={`text-center py-4 px-6 text-sm font-semibold ${tokens.subtleText}`}>Qty</th>
                    <th className={`text-right py-4 px-6 text-sm font-semibold ${tokens.subtleText}`}>RATE</th>
                    <th className={`text-right py-4 px-6 text-sm font-semibold ${tokens.subtleText}`}>TAX</th>
                    <th className={`text-right py-4 px-6 text-sm font-semibold ${tokens.subtleText}`}>AMOUNT</th>
                  </tr>
                </thead>
                <tbody>
                  {proposalItems.map((item) => (
                    <tr
                      key={item.id}
                      className={`border-b ${tokens.isDark ? "border-white/10" : "border-[#E6E6E6]/50"}`}
                    >
                      <td className={`py-4 px-6 ${tokens.isDark ? "text-white" : "text-black"}`}>{item.number}</td>
                      <td className="py-4 px-6">
                        <div className="flex flex-col gap-1">
                          <span className={`font-medium ${tokens.isDark ? "text-white" : "text-black"}`}>
                            {item.item}
                          </span>
                          <span className={`text-sm ${tokens.isDark ? "text-white/60" : "text-black/60"}`}>
                            {item.description}
                          </span>
                        </div>
                      </td>
                      <td className={`text-center py-4 px-6 ${tokens.isDark ? "text-white" : "text-black"}`}>
                        {item.qty}
                      </td>
                      <td className={`text-right py-4 px-6 ${tokens.isDark ? "text-white" : "text-black"}`}>
                        {formatCurrency(item.rate)}
                      </td>
                      <td className={`text-right py-4 px-6 ${tokens.isDark ? "text-white" : "text-black"}`}>
                        {item.tax}%
                      </td>
                      <td className={`text-right py-4 px-6 font-semibold ${tokens.isDark ? "text-white" : "text-black"}`}>
                        {formatCurrency(item.amount)}
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr>
                    <td colSpan={5} className={`py-4 px-6 text-right font-semibold ${tokens.subtleText}`}>
                      Sub Total
                    </td>
                    <td className={`py-4 px-6 text-right font-semibold ${tokens.isDark ? "text-white" : "text-black"}`}>
                      {formatCurrency(subTotal)}
                    </td>
                  </tr>
                  <tr>
                    <td colSpan={5} className={`py-4 px-6 text-right font-semibold ${tokens.subtleText}`}>
                      Total
                    </td>
                    <td className={`py-4 px-6 text-right font-semibold text-lg ${tokens.isDark ? "text-white" : "text-black"}`}>
                      {formatCurrency(total)}
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>

          {/* Descriptive Sections */}
          <div className={`${tokens.cardBase} rounded-2xl p-6 flex flex-col gap-6`}>
            <div className="flex flex-col gap-3">
              <h3 className={`text-lg md:text-xl font-semibold ${tokens.isDark ? "text-white" : "text-black"}`}>
                Lorem Ipsum is simply
              </h3>
              <p className={`text-sm md:text-base leading-relaxed ${tokens.isDark ? "text-white/70" : "text-black/70"}`}>
                Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged.
              </p>
            </div>

            <div className="flex flex-col gap-3">
              <h3 className={`text-lg md:text-xl font-semibold ${tokens.isDark ? "text-white" : "text-black"}`}>
                What we do?
              </h3>
              <p className={`text-sm md:text-base leading-relaxed ${tokens.isDark ? "text-white/70" : "text-black/70"}`}>
                It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using 'Content here, content here', making it look like readable English.
              </p>
            </div>
          </div>
        </div>

        {/* Right Panel - Summary/Discussion */}
        <div className="flex flex-col gap-6">
          <div className={`${tokens.cardBase} rounded-2xl overflow-hidden flex flex-col`}>
            {/* Tabs */}
            <div className="flex border-b border-[#E6E6E6]">
              <button
                type="button"
                onClick={() => setActiveSummaryTab("summary")}
                className={`flex-1 py-3 px-4 text-sm font-medium transition-colors ${
                  activeSummaryTab === "summary"
                    ? tokens.isDark
                      ? "text-white border-b-2 border-white"
                      : "text-[#111111] border-b-2 border-[#071FD7]"
                    : tokens.subtleText
                }`}
              >
                Summary
              </button>
              <button
                type="button"
                onClick={() => setActiveSummaryTab("discussion")}
                className={`flex-1 py-3 px-4 text-sm font-medium transition-colors ${
                  activeSummaryTab === "discussion"
                    ? tokens.isDark
                      ? "text-white border-b-2 border-white"
                      : "text-[#111111] border-b-2 border-[#071FD7]"
                    : tokens.subtleText
                }`}
              >
                Discussion
              </button>
            </div>

            {/* Tab Content */}
            <div className="p-6">
              {activeSummaryTab === "summary" ? (
                <div className="flex flex-col gap-6">
                  {/* TechNova Solutions */}
                  <div className="flex flex-col gap-3">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-[#E6E9FB] flex items-center justify-center">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M3 21H21" stroke="#071FD7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          <path d="M5 21V7L13 2L21 7V21" stroke="#071FD7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          <path d="M9 9V21" stroke="#071FD7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          <path d="M15 9V21" stroke="#071FD7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </div>
                      <div className="flex flex-col">
                        <span className={`font-semibold ${tokens.isDark ? "text-white" : "text-black"}`}>
                          TechNova Solutions
                        </span>
                        <span className={`text-sm ${tokens.isDark ? "text-white/70" : "text-black/70"}`}>
                          15th Street - Business District, New Cairo, Egypt
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Proposal Information */}
                  <div className="flex flex-col gap-3">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-[#E6E9FB] flex items-center justify-center">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="#071FD7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          <path d="M12 16V12" stroke="#071FD7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          <path d="M12 8H12.01" stroke="#071FD7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </div>
                      <span className={`font-semibold ${tokens.isDark ? "text-white" : "text-black"}`}>
                        Proposal Information
                      </span>
                    </div>
                  </div>

                  {/* Client */}
                  <div className="flex flex-col gap-3">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-[#E6E9FB] flex items-center justify-center">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M20 21V19C20 17.9391 19.5786 16.9217 18.8284 16.1716C18.0783 15.4214 17.0609 15 16 15H8C6.93913 15 5.92172 15.4214 5.17157 16.1716C4.42143 16.9217 4 17.9391 4 19V21" stroke="#071FD7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          <path d="M12 11C14.2091 11 16 9.20914 16 7C16 4.79086 14.2091 3 12 3C9.79086 3 8 4.79086 8 7C8 9.20914 9.79086 11 12 11Z" stroke="#071FD7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </div>
                      <div className="flex flex-col">
                        <span className={`font-semibold ${tokens.isDark ? "text-white" : "text-black"}`}>
                          Client
                        </span>
                        <span className={`text-sm ${tokens.isDark ? "text-white/70" : "text-black/70"}`}>
                          El Nile General Trading Co.
                        </span>
                        <span className={`text-sm ${tokens.isDark ? "text-white/70" : "text-black/70"}`}>
                          Building 20 - 3rd Floor, El Gomhoureya Street - Downtown, Cairo - Egypt
                        </span>
                      </div>
                    </div>
                    <div className="flex flex-col gap-2 pl-12">
                      <div className="flex items-center gap-2">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M22 16.92V19.92C22 20.52 21.52 21 20.92 21H3.08C2.48 21 2 20.52 2 19.92V16.92C2 16.32 2.48 15.84 3.08 15.84H20.92C21.52 15.84 22 16.32 22 16.92Z" fill="#071FD7"/>
                          <path d="M12 11C14.2091 11 16 9.20914 16 7C16 4.79086 14.2091 3 12 3C9.79086 3 8 4.79086 8 7C8 9.20914 9.79086 11 12 11Z" fill="#071FD7"/>
                        </svg>
                        <span className={`text-sm ${tokens.isDark ? "text-white/70" : "text-[#071FD7]"}`}>
                          +20 10 8877 5544
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M4 4H20C21.1 4 22 4.9 22 6V18C22 19.1 21.1 20 20 20H4C2.9 20 2 19.1 2 18V6C2 4.9 2.9 4 4 4Z" stroke="#071FD7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          <path d="M22 6L12 13L2 6" stroke="#071FD7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                        <span className={`text-sm ${tokens.isDark ? "text-white/70" : "text-[#071FD7]"}`}>
                          info@elnile.com
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className={`text-center py-8 ${tokens.subtleText}`}>
                  Discussion content coming soon...
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

