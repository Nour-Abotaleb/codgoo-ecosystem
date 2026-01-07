import { useState, useEffect, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate, useSearchParams, useLocation } from "react-router-dom";
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
  readonly initialProjectData?: ProjectCardData; // Add optional initial data
};

type TabId = "overview" | "tasks" | "invoices" | "attachments";

// Tabs will be created inside component to use translation

export const ProjectDetailsView = ({
  projectId,
  tokens,
  onManage,
  initialProjectData
}: ProjectDetailsViewProps) => {
  const { t } = useTranslation("landing");
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const location = useLocation();
  const [activeTab, setActiveTab] = useTabState<TabId>("overview");
  const [activeMilestoneTab, setActiveMilestoneTab] = useState(0);
  const [isContractModalOpen, setIsContractModalOpen] = useState(false);
  
  // Tabs with translations
  const tabs: readonly { id: TabId; label: string; icon: React.ComponentType<React.SVGProps<SVGSVGElement>> }[] = [
    { id: "overview", label: t("dashboard.tabs.overview"), icon: OverviewIcon },
    { id: "tasks", label: t("dashboard.tabs.tasks"), icon: TasksIcon },
    { id: "invoices", label: t("dashboard.tabs.invoices"), icon: ProjectInvoiceIcon },
    { id: "attachments", label: t("dashboard.tabs.attachments"), icon: AttachmentsIcon }
  ];
  
  // Try to get project data from navigation state first
  const projectDataFromState = location.state?.project as ProjectCardData | undefined;
  
  // Fetch project overview from API
  const projectIdNum = parseInt(projectId, 10);
  const { data: apiData, isLoading } = useGetProjectOverviewQuery(projectIdNum);

  // Get contract data from API
  const contract = useMemo(() => {
    if (apiData?.data?.project?.contract) {
      return apiData.data.project.contract;
    }
    return null;
  }, [apiData]);

  // Transform API data with N/A fallbacks, or use passed data
  const project = useMemo((): ProjectCardData | null => {
    const baseData = projectDataFromState || initialProjectData;
    
    // If we have API data, merge it with base data
    if (apiData?.data?.project) {
      const proj = apiData.data.project;
      console.log('Project data from API:', proj); // Debug log
      
      // Merge base data with API data, preferring base data for fields not in API
      return {
        id: String(proj.id),
        name: proj.name || baseData?.name || "N/A",
        description: proj.notes || baseData?.description || "N/A",
        status: proj.status || baseData?.status || "pending",
        team: baseData?.team || [], // Keep team from base data
        startDate: baseData?.startDate || "N/A", // Keep from base data
        deadline: baseData?.deadline || "N/A", // Keep from base data
        budget: baseData?.budget || "N/A", // Keep from base data
        tasks: {
          completed: baseData?.tasks?.completed || 0,
          total: proj.open_tasks || baseData?.tasks?.total || 0
        },
        type: proj.type || baseData?.type || "N/A",
        lastUpdate: proj.last_update || baseData?.lastUpdate || "N/A"
      };
    }
    
    // If no API data yet, use base data if available
    if (baseData) {
      return baseData;
    }
    
    console.log('No project data found in API response:', apiData); // Debug log
    return null;
  }, [apiData, projectDataFromState, initialProjectData]);

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
          label: t("dashboard.project.projectProgress"),
          value: totalTasks > 0 ? `${Math.round((completedTasks / totalTasks) * 100)}%` : "0%",
          subtitle: t("dashboard.overview.completed"),
          icon: AllProjecs
        },
        {
          id: "tasks",
          label: t("dashboard.project.openTasks"),
          value: `${completedTasks} / ${totalTasks}`,
          subtitle: t("dashboard.project.tasksDone"),
          icon: projectsCompleted
        },
        {
          id: "days",
          label: t("dashboard.project.daysLeft"),
          value: proj.days_left ? Math.abs(Math.round(proj.days_left)).toString() : "N/A",
          subtitle: proj.days_left && proj.days_left < 0 ? t("dashboard.project.daysOverdue") : t("dashboard.project.daysRemaining"),
          icon: DayRemaining
        }
      ];
    }
    return [
      { id: "progress", label: t("dashboard.project.projectProgress"), value: "N/A", subtitle: t("dashboard.overview.completed"), icon: AllProjecs },
      { id: "tasks", label: t("dashboard.project.openTasks"), value: "N/A", subtitle: t("dashboard.project.tasksDone"), icon: projectsCompleted },
      { id: "days", label: t("dashboard.project.daysLeft"), value: "N/A", subtitle: t("dashboard.project.daysRemaining"), icon: DayRemaining }
    ];
  }, [apiData, t]);

  // Get progress phases from API
  const progressPhases = useMemo(() => {
    if (apiData?.data?.project?.progress_timeline) {
      const timeline = apiData.data.project.progress_timeline;
      return [
        { name: t("dashboard.project.planning"), percentage: timeline.planning || 0, color: "#071FD7" },
        { name: t("dashboard.project.design"), percentage: timeline.design || 0, color: "#F8D20D" },
        { name: t("dashboard.project.development"), percentage: timeline.development || 0, color: "#E00A48" },
        { name: t("dashboard.project.testing"), percentage: timeline.testing || 0, color: "#9CA3AF" }
      ];
    }
    return [
      { name: t("dashboard.project.planning"), percentage: 0, color: "#071FD7" },
      { name: t("dashboard.project.design"), percentage: 0, color: "#F8D20D" },
      { name: t("dashboard.project.development"), percentage: 0, color: "#E00A48" },
      { name: t("dashboard.project.testing"), percentage: 0, color: "#9CA3AF" }
    ];
  }, [apiData, t]);

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

  const handleContractClick = () => {
    if (contract) {
      setIsContractModalOpen(true);
    }
  };

  if (isLoading && !projectDataFromState && !initialProjectData) {
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
              className={`pb-2 px-1 flex flex-wrap items-center gap-2 text-sm md:text-base font-medium transition-colors whitespace-nowrap cursor-pointer ${
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
          onContract={handleContractClick}
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
                {t("dashboard.project.progressTimeline")}
              </h3>
              <div className="flex flex-col gap-4">
                {progressPhases.map((phase) => (
                  <div key={phase.name} className="flex flex-col gap-2">
                    <div className="flex flex-wrap items-center justify-between">
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
              <div className="flex flex-wrap items-center justify-between mb-4">
                <h3
                  className={`text-lg md:text-xl font-semibold ${
                    tokens.isDark ? "text-white" : "text-[#2B3674]"
                  }`}
                >
                  {t("dashboard.project.activityNotes")}
                </h3>
                <div className="flex flex-wrap items-center gap-2">
                  <span className={`text-xs md:text-sm flex flex-wrap items-center gap-2 ${tokens.subtleText}`}>
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
                  <div key={activity.id} className="flex flex-wrap items-center gap-3">
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

      {/* Contract Modal */}
      {isContractModalOpen && contract && (
        <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setIsContractModalOpen(false)}
          />

          {/* Modal */}
          <div className={`relative w-full max-w-lg ${tokens.cardBase} ${tokens.isDark ? "bg-[#0F1217]" : "bg-white"} rounded-[20px] max-h-[90vh] overflow-hidden flex flex-col`}>
            {/* Header */}
            <div className={`flex flex-wrap items-center justify-between px-6 pt-6 pb-4 flex-shrink-0 rounded-t-2xl ${
              tokens.isDark ? "bg-[#0F1217]" : "bg-[#FFFEF7]"
            }`}>
              <div className="flex flex-wrap items-center gap-3">
                <div className={`flex h-9 w-9 items-center justify-center rounded-full ${tokens.isDark ? tokens.buttonGhost : ""}`} style={tokens.isDark ? {} : { backgroundColor: "#E6E9FB" }}>
                  <svg className="h-5 w-5" fill="none" stroke={tokens.isDark ? "#FFFFFF" : "#071FD7"} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <h2 className={`text-xl md:text-2xl font-semibold ${tokens.isDark ? "text-white" : "text-black"}`}>
                  Contract Details
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setIsContractModalOpen(false)}
                className="flex h-8 w-8 items-center justify-center transition-colors"
                aria-label="Close modal"
              >
                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto scrollbar-hide px-6 py-4">
              <div className="flex flex-col gap-4">
                {/* Contract Status */}
                <div className={`flex flex-wrap items-center justify-between p-4 rounded-[15px] ${tokens.isDark ? "bg-[#1A1D29]" : "bg-[#F4F5FF]"}`}>
                  <span className={`text-sm font-medium ${tokens.isDark ? "text-white/70" : "text-[#718EBF]"}`}>Status</span>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                    contract.status === "signed"
                      ? tokens.isDark ? "bg-green-500/10 text-green-400" : "bg-green-100 text-green-700"
                      : tokens.isDark ? "bg-yellow-500/10 text-yellow-400" : "bg-yellow-100 text-yellow-700"
                  }`}>
                    {contract.status ? contract.status.charAt(0).toUpperCase() + contract.status.slice(1) : "Unknown"}
                  </span>
                </div>

                {/* Contract Details */}
                <div className={`p-4 rounded-[15px] ${tokens.isDark ? "bg-[#1A1D29]" : "bg-[#F4F5FF]"}`}>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1">
                      <span className={`text-xs ${tokens.isDark ? "text-white/50" : "text-[#718EBF]"}`}>Contract ID</span>
                      <span className={`text-sm font-medium ${tokens.isDark ? "text-white" : "text-black"}`}>#{contract.id}</span>
                    </div>
                    <div className="flex flex-col gap-1">
                      <span className={`text-xs ${tokens.isDark ? "text-white/50" : "text-[#718EBF]"}`}>Project ID</span>
                      <span className={`text-sm font-medium ${tokens.isDark ? "text-white" : "text-black"}`}>#{contract.project_id}</span>
                    </div>
                    <div className="flex flex-col gap-1">
                      <span className={`text-xs ${tokens.isDark ? "text-white/50" : "text-[#718EBF]"}`}>{t("dashboard.task.createdAt")}</span>
                      <span className={`text-sm font-medium ${tokens.isDark ? "text-white" : "text-black"}`}>
                        {new Date(contract.created_at).toLocaleDateString('en-US', { day: '2-digit', month: 'short', year: 'numeric' })}
                      </span>
                    </div>
                    {contract.signed_at && (
                      <div className="flex flex-col gap-1">
                        <span className={`text-xs ${tokens.isDark ? "text-white/50" : "text-[#718EBF]"}`}>Signed At</span>
                        <span className={`text-sm font-medium ${tokens.isDark ? "text-white" : "text-black"}`}>
                          {new Date(contract.signed_at).toLocaleDateString('en-US', { day: '2-digit', month: 'short', year: 'numeric' })}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Contract File Preview */}
                {contract.file_path && (
                  <div className={`p-4 rounded-[15px] ${tokens.isDark ? "bg-[#1A1D29]" : "bg-[#F4F5FF]"}`}>
                    <span className={`text-xs ${tokens.isDark ? "text-white/50" : "text-[#718EBF]"} block mb-2`}>Contract File</span>
                    <div className="flex flex-wrap items-center gap-3">
                      <div className={`flex h-12 w-12 items-center justify-center rounded-lg ${tokens.isDark ? "bg-[#2A2D39]" : "bg-white"}`}>
                        <svg className="h-6 w-6" fill="none" stroke={tokens.isDark ? "#FFFFFF" : "#071FD7"} viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                        </svg>
                      </div>
                      <div className="flex-1">
                        <span className={`text-sm font-medium ${tokens.isDark ? "text-white" : "text-black"} block`}>
                          {contract.file_path}
                        </span>
                        <span className={`text-xs ${tokens.isDark ? "text-white/50" : "text-[#718EBF]"}`}>
                          Contract Document
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Action Buttons */}
            <div className={`flex flex-col gap-3 px-6 pb-6 pt-2 border-t ${tokens.isDark ? "border-white/10" : "border-[#E6E6E6]"}`}>
              {contract.file_path && (
                <a
                  href={contract.file_path.startsWith('http') ? contract.file_path : `/${contract.file_path}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`w-full px-6 py-3 rounded-full text-base font-medium text-center transition-colors ${
                    tokens.isDark
                      ? "bg-[#071FD7] text-white hover:bg-[#071FD7]/90"
                      : "bg-[#071FD7] text-white hover:bg-[#071FD7]/90"
                  }`}
                >
                  View Contract File
                </a>
              )}
              <button
                type="button"
                onClick={() => setIsContractModalOpen(false)}
                className={`w-full px-6 py-2.5 rounded-full text-base font-medium transition-colors ${
                  tokens.isDark
                    ? "border border-white/20 text-white hover:bg-white/10"
                    : "border border-[#071FD7] text-[#071FD7] hover:bg-[#071FD7]/10"
                }`}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

