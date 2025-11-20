import { useState } from "react";
import {
  OverviewIcon,
  TasksIcon,
  ProjectInvoiceIcon,
  AttachmentsIcon,
  ProposalsIcon,
  AllProjectsIcon,
  CompletedIcon,
  DayLeftIcon,
  CalendarIcon,
  ActivityTasksIcon
} from "@utilities/icons";
import { ProjectCard, type ProjectCardData } from "./ProjectCard";
import { TasksView } from "./TasksView";
import { InvoicesView } from "./InvoicesView";
import { AttachmentsView } from "./AttachmentsView";
import type { DashboardTokens } from "../../types";

type ProjectDetailsViewProps = {
  readonly project: ProjectCardData;
  readonly tokens: DashboardTokens;
  readonly onBack?: () => void;
  readonly onManage?: (projectId: string) => void;
};

type TabId = "overview" | "tasks" | "invoices" | "attachments" | "proposals";

const tabs: readonly { id: TabId; label: string; icon: React.ComponentType<React.SVGProps<SVGSVGElement>> }[] = [
  { id: "overview", label: "OverView", icon: OverviewIcon },
  { id: "tasks", label: "Tasks", icon: TasksIcon },
  { id: "invoices", label: "Invoices", icon: ProjectInvoiceIcon },
  { id: "attachments", label: "Attachments", icon: AttachmentsIcon },
  { id: "proposals", label: "Proposals", icon: ProposalsIcon }
];

type ProjectStat = {
  readonly id: string;
  readonly label: string;
  readonly value: string;
  readonly subtitle: string;
  readonly icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
};

type ProgressPhase = {
  readonly name: string;
  readonly percentage: number;
  readonly color: string;
};

type ActivityItem = {
  readonly id: string;
  readonly message: string;
};

const projectStats: readonly ProjectStat[] = [
  {
    id: "progress",
    label: "Project Progress",
    value: "100%",
    subtitle: "Completed",
    icon: AllProjectsIcon
  },
  {
    id: "tasks",
    label: "Open Tasks",
    value: "2 / 3",
    subtitle: "Tasks Done",
    icon: CompletedIcon
  },
  {
    id: "days",
    label: "Days Left",
    value: "12",
    subtitle: "Days Remaining",
    icon: DayLeftIcon
  }
];

const progressPhases: readonly ProgressPhase[] = [
  { name: "Planning", percentage: 100, color: "#071FD7" },
  { name: "Design", percentage: 80, color: "#F8D20D" },
  { name: "Development", percentage: 50, color: "#E00A48" },
  { name: "Testing", percentage: 0, color: "#9CA3AF" }
];

const activities: readonly ActivityItem[] = [
  { id: "1", message: "Task #12 completed by Yousef" },
  { id: "2", message: "Invoice #122 issued" },
  { id: "3", message: "Client approved proposal" }
];

export const ProjectDetailsView = ({
  project,
  tokens,
  onManage
}: ProjectDetailsViewProps) => {
  const [activeTab, setActiveTab] = useState<TabId>("overview");

  return (
    <div className="flex flex-col gap-6">
      {/* Tabs Navigation */}
      <div className="flex gap-16 overflow-x-auto">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
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

      {/* Main Project Card - only show in overview */}
      {activeTab === "overview" && (
        <ProjectCard
          project={project}
          tokens={tokens}
          onViewDetails={undefined}
          onManage={onManage}
        />
      )}

      {activeTab === "overview" && (
        <>
          {/* Statistics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {projectStats.map((stat) => {
              const Icon = stat.icon;
              const iconBaseColor = tokens.isDark ? "#FFFFFF" : "#2B3674";
              return (
                <div
                  key={stat.id}
                  className={`${tokens.cardBase} rounded-2xl p-6`}
                >
                  <div className="flex flex-col gap-4">
                    <div
                      className="flex items-center justify-start"
                      style={{ color: iconBaseColor }}
                    >
                      <Icon className="h-8 w-8 md:h-10 md:w-10" />
                    </div>
                    <div className="flex flex-col gap-2">
                      <span className="text-sm md:text-base text-[#A3AED0]">
                        {stat.label}
                      </span>
                      <span
                        className={`text-2xl font-semibold ${
                          tokens.isDark ? "text-white" : "text-[#2B3674]"
                        }`}
                      >
                        {stat.value}
                      </span>
                      <span className="text-xs md:text-sm text-[#A3AED0]">
                        {stat.subtitle}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Progress Timeline and Activity Cards */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Progress Timeline */}
            <div
              className={`${tokens.cardBase} rounded-2xl p-6 border border-[var(--color-card-border)]`}
            >
              <h3
                className={`text-lg md:text-xl font-semibold mb-4 ${
                  tokens.isDark ? "text-white" : "text-[#2B3674]"
                }`}
              >
                Progress Timeline
              </h3>
              <div className="flex flex-col gap-4">
                {progressPhases.map((phase) => (
                  <div key={phase.name} className="flex flex-col gap-2">
                    <div className="flex items-center justify-between">
                      <span
                        className={`text-sm md:text-base font-medium ${
                          tokens.isDark ? "text-white" : "text-black"
                        }`}
                      >
                        {phase.name}
                      </span>
                      <span className={`text-sm ${tokens.subtleText}`}>
                        {phase.percentage}%
                      </span>
                    </div>
                    <div className="relative h-5 bg-[#EFEFEF] rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-300"
                        style={{
                          width: `${phase.percentage}%`,
                          backgroundColor: phase.color
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Activity & Notes */}
            <div
              className={`${tokens.cardBase} rounded-2xl p-6 border border-[var(--color-card-border)]`}
            >
              <div className="flex items-center justify-between mb-4">
                <h3
                  className={`text-lg md:text-xl font-semibold ${
                    tokens.isDark ? "text-white" : "text-[#2B3674]"
                  }`}
                >
                  Activity & Notes
                </h3>
                <div className="flex items-center gap-2">
                  <span className={`text-xs md:text-sm flex items-center gap-2 ${tokens.subtleText}`}>
                    <CalendarIcon className="h-4 w-4" />
                    Jun 07 → Jun 13
                  </span>
                  <svg
                    className="h-4 w-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </div>
              </div>
              <div className="flex flex-col gap-3">
                {activities.map((activity) => (
                  <div key={activity.id} className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-[#FFF7DC] flex items-center justify-center">
                      <ActivityTasksIcon className="h-5 w-5 text-[#071FD7]" />
                    </div>
                    <span className={`text-sm md:text-base ${tokens.isDark ? "text-white/70" : "text-black"} flex-1`}>
                     {activity.message}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </>
      )}

      {activeTab === "tasks" && <TasksView tokens={tokens} />}

      {activeTab === "invoices" && <InvoicesView tokens={tokens} />}

      {activeTab === "attachments" && <AttachmentsView tokens={tokens} />}

      {activeTab !== "overview" && activeTab !== "tasks" && activeTab !== "invoices" && activeTab !== "attachments" && (
        <div
          className={`${tokens.cardBase} rounded-2xl p-10 border border-[var(--color-card-border)]`}
        >
          <p className={`text-center ${tokens.subtleText}`}>
            {tabs.find((t) => t.id === activeTab)?.label} content coming soon...
          </p>
        </div>
      )}
    </div>
  );
};

