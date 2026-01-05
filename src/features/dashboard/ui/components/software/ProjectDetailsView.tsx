import { useState, useEffect, useMemo } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  OverviewIcon,
  TasksIcon,
  ProjectInvoiceIcon,
  AttachmentsIcon,
  AllProjecs,
  projectsCompleted,
  DayRemaining,
  CalendarIcon,
  ActivityTasksIcon
} from "@utilities/icons";
import { ProjectCard, type ProjectCardData } from "./ProjectCard";
import { TasksView } from "./TasksView";
import { InvoicesView } from "./InvoicesView";
import { AttachmentsView } from "./AttachmentsView";
import type { DashboardTokens } from "../../types";
import { useTabState } from "@shared/hooks/useTabState";
import { useGetProjectOverviewQuery } from "@features/dashboard/api/dashboard-api";

type ProjectDetailsViewProps = {
  readonly projectId: string;
  readonly tokens: DashboardTokens;
  readonly onBack?: () => void;
  readonly onManage?: (projectId: string) => void;
};

type TabId = "overview" | "tasks" | "invoices" | "attachments";

const tabs: readonly { id: TabId; label: string; icon: React.ComponentType<React.SVGProps<SVGSVGElement>> }[] = [
  { id: "overview", label: "OverView", icon: OverviewIcon },
  { id: "tasks", label: "Tasks", icon: TasksIcon },
  { id: "invoices", label: "Invoices", icon: ProjectInvoiceIcon },
  { id: "attachments", label: "Attachments", icon: AttachmentsIcon }
];

export const ProjectDetailsView = ({
  projectId,
  tokens,
  onManage
}: ProjectDetailsViewProps) => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [activeTab, setActiveTab] = useTabState<TabId>("overview");
  const [activeMilestoneTab, setActiveMilestoneTab] = useState(0);
  
  // Fetch project overview from API
  const projectIdNum = parseInt(projectId, 10);
  const { data: apiData, isLoading } = useGetProjectOverviewQuery(projectIdNum);

  // Transform API data with N/A fallbacks
  const project = useMemo((): ProjectCardData | null => {
    if (apiData?.data?.project) {
      const proj = apiData.data.project;
      // Map API status to valid ProjectCardData status
      const mapStatus = (status: string): "Active" | "Pending" | "Completed" | "Ongoing" => {
        const statusLower = status.toLowerCase();
        if (statusLower === "completed") return "Completed";
        if (statusLower === "pending" || statusLower === "requested") return "Pending";
        if (statusLower === "ongoing") return "Ongoing";
        return "Active";
      };
      
      return {
        id: String(proj.id),
        name: proj.name || "N/A",
        description: proj.notes || "N/A",
        status: mapStatus(proj.status || "pending"),
        team: [], // Team data not in overview endpoint
        startDate: "N/A", // Not in overview endpoint
        deadline: "N/A", // Not in overview endpoint
        budget: "N/A", // Not in overview endpoint
        tasks: {
          completed: 0,
          total: proj.open_tasks || 0
        },
        type: proj.type || "N/A",
        lastUpdate: proj.last_update || "N/A"
      };
    }
    return null;
  }, [apiData]);

  // Get milestones from API
  const milestoneTabs = useMemo(() => {
    if (apiData?.data?.project?.milestones) {
      return apiData.data.project.milestones.map((m: any) => m.name || "Milestone");
    }
    return ["Milestone"];
  }, [apiData]);

  // Get project stats from API
  const projectStats = useMemo(() => {
    if (apiData?.data?.project) {
      const proj = apiData.data.project;
      const totalTasks = proj.milestones?.reduce((sum: number, m: any) => sum + (m.tasks?.length || 0), 0) || 0;
      const completedTasks = proj.milestones?.reduce((sum: number, m: any) => 
        sum + (m.tasks?.filter((t: any) => t.status === "completed").length || 0), 0) || 0;
      
      return [
        {
          id: "progress",
          label: "Project Progress",
          value: totalTasks > 0 ? `${Math.round((completedTasks / totalTasks) * 100)}%` : "0%",
          subtitle: "Completed",
          icon: AllProjecs
        },
        {
          id: "tasks",
          label: "Open Tasks",
          value: `${completedTasks} / ${totalTasks}`,
          subtitle: "Tasks Done",
          icon: projectsCompleted
        },
        {
          id: "days",
          label: "Days Left",
          value: proj.days_left ? Math.abs(Math.round(proj.days_left)).toString() : "N/A",
          subtitle: proj.days_left && proj.days_left < 0 ? "Days Overdue" : "Days Remaining",
          icon: DayRemaining
        }
      ];
    }
    return [
      { id: "progress", label: "Project Progress", value: "N/A", subtitle: "Completed", icon: AllProjecs },
      { id: "tasks", label: "Open Tasks", value: "N/A", subtitle: "Tasks Done", icon: projectsCompleted },
      { id: "days", label: "Days Left", value: "N/A", subtitle: "Days Remaining", icon: DayRemaining }
    ];
  }, [apiData]);

  // Get progress phases from API
  const progressPhases = useMemo(() => {
    if (apiData?.data?.project?.progress_timeline) {
      const timeline = apiData.data.project.progress_timeline;
      return [
        { name: "Planning", percentage: timeline.planning || 0, color: "#071FD7" },
        { name: "Design", percentage: timeline.design || 0, color: "#F8D20D" },
        { name: "Development", percentage: timeline.development || 0, color: "#E00A48" },
        { name: "Testing", percentage: timeline.testing || 0, color: "#9CA3AF" }
      ];
    }
    return [
      { name: "Planning", percentage: 0, color: "#071FD7" },
      { name: "Design", percentage: 0, color: "#F8D20D" },
      { name: "Development", percentage: 0, color: "#E00A48" },
      { name: "Testing", percentage: 0, color: "#9CA3AF" }
    ];
  }, [apiData]);

  // Get activities from API
  const activities = useMemo(() => {
    if (apiData?.data?.project?.activity_notes) {
      return apiData.data.project.activity_notes.map((activity: any, index: number) => ({
        id: String(index),
        message: activity.message || "N/A",
        date: activity.date || "N/A",
        type: activity.type || "activity"
      }));
    }
    return [];
  }, [apiData]);

  useEffect(() => {
    const tabParam = searchParams.get("tab");
    if (tabParam && ["overview", "tasks", "invoices", "attachments"].includes(tabParam)) {
      setActiveTab(tabParam as TabId);
    }
  }, [searchParams]);

  const handleProposalsClick = () => {
    if (project) {
      navigate(`/dashboard/projects/${project.id}/proposals`);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <p className={tokens.isDark ? "text-white/50" : "text-[#A3AED0]"}>Loading project details...</p>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="flex items-center justify-center py-12">
        <p className={tokens.isDark ? "text-white/50" : "text-[#A3AED0]"}>Project not found</p>
      </div>
    );
  }

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
          onProposals={handleProposalsClick}
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
                  className={`${tokens.cardBase} rounded-[20px] p-6`}
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
              className={`${tokens.cardBase} rounded-[20px] p-6`}
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
              className={`${tokens.cardBase} rounded-[20px] p-6`}
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

      {activeTab === "tasks" && (
        <TasksView 
          tokens={tokens}
          projectId={projectId}
          project={project}
          milestoneTabs={milestoneTabs}
          activeMilestoneTab={activeMilestoneTab}
          onMilestoneTabChange={setActiveMilestoneTab}
        />
      )}

      {activeTab === "invoices" && <InvoicesView tokens={tokens} projectId={projectId} />}

      {activeTab === "attachments" && <AttachmentsView tokens={tokens} projectId={projectId} />}

      {activeTab !== "overview" && activeTab !== "tasks" && activeTab !== "invoices" && activeTab !== "attachments" && (
        <div
          className={`${tokens.cardBase} rounded-[20px] p-10`}
        >
          <p className={`text-center ${tokens.subtleText}`}>
            {tabs.find((t) => t.id === activeTab)?.label} content coming soon...
          </p>
        </div>
      )}
    </div>
  );
};

