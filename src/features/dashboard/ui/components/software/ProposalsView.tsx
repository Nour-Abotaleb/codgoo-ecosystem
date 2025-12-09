import { useState } from "react";
import { useNavigate } from "react-router-dom";
import type { DashboardTokens } from "../../types";
import type { ProjectCardData } from "./ProjectCard";
import { ClientIcon, EmailIcon, PhoneIcon, ProposalInfoIcon, TechNovaIcon, OverviewIcon, TasksIcon, ProjectInvoiceIcon, AttachmentsIcon } from "@/utilities/icons";

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
type TabId = "overview" | "tasks" | "invoices" | "attachments";

const tabs: readonly { id: TabId; label: string; icon: React.ComponentType<React.SVGProps<SVGSVGElement>> }[] = [
  { id: "overview", label: "OverView", icon: OverviewIcon },
  { id: "tasks", label: "Tasks", icon: TasksIcon },
  { id: "invoices", label: "Invoices", icon: ProjectInvoiceIcon },
  { id: "attachments", label: "Attachments", icon: AttachmentsIcon }
];

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

export const ProposalsView = ({ tokens, project }: ProposalsViewProps) => {
  const navigate = useNavigate();
  const [activeSummaryTab, setActiveSummaryTab] = useState<SummaryTab>("summary");

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2
    }).format(amount);
  };

  const handleTabClick = (tabId: TabId) => {
    navigate(`/dashboard/projects/${project.id}?tab=${tabId}`);
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Tabs Navigation */}
      <div className="flex gap-16 overflow-x-auto">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = tab.id === "overview";
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => handleTabClick(tab.id)}
              className={`pb-2 px-1 flex items-center gap-2 text-sm md:text-base font-medium transition-colors whitespace-nowrap cursor-pointer ${
                isActive
                  ? tokens.isDark
                    ? "text-white border-b-3 border-white"
                    : "text-[#111111] border-b-3 border-[#071FD7]"
                  : tokens.subtleText
              }`}
            >
              <Icon className="h-5 w-5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      <div className={`${tokens.cardBase} rounded-2xl p-6 flex flex-col gap-6`}>
      {/* Project Header */}
      <div className="flex items-start justify-between">
        <div className="flex flex-col gap-2">
          <h1 className={`text-2xl md:text-3xl font-bold ${tokens.isDark ? "text-white" : "text-black"}`}>
            # PRO-000002
          </h1>
          <h2 className={`text-base font-regular ${tokens.isDark ? "text-white/70" : "text-[#718EBF]"}`}>
            Web Design Proposal
          </h2>
        </div>
        <button
          type="button"
          className={`flex items-center gap-2 px-8 py-2 rounded-full font-medium transition-colors cursor-pointer ${
            tokens.isDark
              ? "border border-white/70 text-white/90"
              : "border border-[#071FD7] text-[#071FD7]"
          }`}
        >
          <span>Download</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Main Content */}
        <div className="lg:col-span-2 flex flex-col gap-4">
          {/* Itemized Services Table */}
          <div className="overflow-hidden">
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
                      <td className={`py-4 px-6 ${tokens.isDark ? "text-white" : "text-[#2B3674]"}`}>{item.number}</td>
                      <td className="py-4 px-6">
                        <div className="flex flex-col gap-1">
                          <span className={`font-semibold ${tokens.isDark ? "text-white" : "text-[#2B3674]"}`}>
                            {item.item}
                          </span>
                          <span className={`text-sm ${tokens.isDark ? "text-white/60" : "text-[#2B3674]"}`}>
                            {item.description}
                          </span>
                        </div>
                      </td>
                      <td className={`text-center font-semibold py-4 px-6 ${tokens.isDark ? "text-white" : "text-[#2B3674]"}`}>
                        {item.qty}
                      </td>
                      <td className={`text-center font-semibold py-4 px-6 ${tokens.isDark ? "text-white" : "text-[#2B3674]"}`}>
                        {formatCurrency(item.rate)}
                      </td>
                      <td className={`text-center font-semibold py-4 px-6 ${tokens.isDark ? "text-white" : "text-[#2B3674]"}`}>
                        {item.tax}%
                      </td>
                      <td className={`text-right py-4 px-6 font-semibold ${tokens.isDark ? "text-white" : "text-[#2B3674]"}`}>
                        {formatCurrency(item.amount)}
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr>
                    <td colSpan={5} className={`py-4 px-6 text-right font-semibold ${tokens.subtleText} ${tokens.isDark ? "!text-white" : "!text-[#2B3674]"}`}>
                      Sub Total
                    </td>
                    <td className={`py-4 px-6 text-right font-semibold ${tokens.isDark ? "text-white" : "text-[#2B3674]"}`}>
                      {formatCurrency(subTotal)}
                    </td>
                  </tr>
                  <tr>
                    <td colSpan={5} className={`py-4 px-6 text-right font-semibold ${tokens.subtleText} ${tokens.isDark ? "!text-white" : "!text-[#2B3674]"}`}>
                      Total
                    </td>
                    <td className={`py-4 px-6 text-right font-semibold text-lg ${tokens.isDark ? "text-white" : "text-[#2B3674]"}`}>
                      {formatCurrency(total)}
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>

          {/* Descriptive Sections */}
          <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-3">
              <h3 className={`text-lg md:text-xl font-bold ${tokens.isDark ? "text-white" : "text-black"}`}>
                Lorem Ipsum is simply
              </h3>
              <p className={`text-sm md:text-base leading-relaxed ${tokens.isDark ? "text-white/70" : "text-black/70"}`}>
                Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged.
              </p>
            </div>

            <div className="flex flex-col gap-3">
              <h3 className={`text-lg md:text-xl font-bold ${tokens.isDark ? "text-white" : "text-black"}`}>
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
          <div className={`${tokens.isDark ? "!bg-[var(--color-search-bg)]" : "!bg-[#FFFEF7]"} rounded-2xl overflow-hidden flex flex-col`}>
            {/* Tabs */}
            <div className="flex border-b border-[#E6E6E6]">
              <button
                type="button"
                onClick={() => setActiveSummaryTab("summary")}
                className={`flex-1 py-3 px-4 text-sm md:text-base font-medium transition-colors ${
                  activeSummaryTab === "summary"
                    ? tokens.isDark
                      ? "text-white border-b-3 border-white"
                      : "text-[#111111] border-b-3 border-[#071FD7]"
                    : tokens.subtleText
                }`}
              >
                Summary
              </button>
              <button
                type="button"
                onClick={() => setActiveSummaryTab("discussion")}
                className={`flex-1 py-3 px-4 text-sm md:text-base font-medium transition-colors ${
                  activeSummaryTab === "discussion"
                    ? tokens.isDark
                      ? "text-white border-b-3 border-white"
                      : "text-[#111111] border-b-3 border-[#071FD7]"
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
                    <div className="flex flex-col gap-2">
                      <div className="flex items-center gap-2">
                        <TechNovaIcon className={`w-5 h-5 ${tokens.isDark ? "text-white" : "text-[#071FD7]"}`} />
                        <span className={`font-semibold ${tokens.isDark ? "text-white" : "text-black"}`}>
                          TechNova Solutions
                        </span>
                      </div>
                        <p className={`text-sm ${tokens.isDark ? "text-white/70" : "text-[#68696D]"}`}>
                          15th Street - Business District, <br />New Cairo, <br />Egypt
                        </p>
                    </div>
                  </div>

                  {/* Proposal Information */}
                  <div className="flex flex-col gap-3">
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-2">
                        <ProposalInfoIcon className={`w-auto ${tokens.isDark ? "text-white" : "text-[#071FD7]"}`} />
                      <span className={`font-semibold ${tokens.isDark ? "text-white" : "text-black"}`}>
                        Proposal Information
                      </span>
                      </div>
                    </div>
                  </div>

                  {/* Client */}
                  <div className="flex flex-col gap-3">
                    <div className="flex items-center gap-3">
                      <div className="flex flex-col">
                      <div className="flex items-center gap-2">
                        <ClientIcon className="w-4 h-4" />
                        <span className={`font-semibold ${tokens.isDark ? "text-white" : "text-black"}`}>
                          Client
                        </span>
                      </div>
                        <span className={`text-sm ${tokens.isDark ? "text-white/70" : "text-[#68696D]"}`}>
                          El Nile General Trading Co.
                        </span>
                        <span className={`text-sm ${tokens.isDark ? "text-white/70" : "text-[#68696D]"}`}>
                          Building 20 - 3rd Floor, El Gomhoureya Street - Downtown, Cairo - Egypt
                        </span>
                      </div>
                    </div>
                    <div className="flex flex-col gap-2">
                      <div className="flex items-center gap-2">
                       <PhoneIcon className={`w-4 h-4 ${tokens.isDark ? "text-white/70" : "text-[#071FD7]"}`} />
                        <span className={`text-sm ${tokens.isDark ? "text-white/70" : "text-[#071FD7]"}`}>
                          +20 10 8877 5544
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <EmailIcon className={`w-4 h-4 ${tokens.isDark ? "text-white/70" : "text-[#071FD7]"}`} />
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
    </div>
  );
};

