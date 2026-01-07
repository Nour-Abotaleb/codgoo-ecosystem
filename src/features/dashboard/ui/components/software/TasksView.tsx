import { useState, useMemo, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  SearchIcon,
  AllTasksIcon,
  CompletedTasksIcon,
  InProgressTasksIcon,
  AwaitingFeedbackIcon,
  NotStartedTasksIcon,
} from "@utilities/icons";
import { TaskCard, type TaskItem } from "./TaskCard";
import type { DashboardTokens } from "../../types";
import { useGetProjectOverviewQuery } from "@features/dashboard/api/dashboard-api";

type TasksViewProps = {
  readonly tokens: DashboardTokens;
  readonly projectId: string;
  readonly project?: {
    readonly startDate: string;
    readonly deadline: string;
    readonly budget: string;
  };
  readonly milestoneTabs?: readonly string[];
  readonly activeMilestoneTab?: number;
  readonly onMilestoneTabChange?: (index: number) => void;
};

type TaskStat = {
  readonly id: string;
  readonly label: string;
  readonly value: string;
  readonly icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
};


// CircularProgress, getAvatarColor, and getInitials are now in TaskCard.tsx

const TasksCards = ({ tokens, searchQuery, onViewTask, tasks }: { readonly tokens: DashboardTokens; readonly searchQuery: string; readonly onViewTask?: (taskId: string) => void; readonly tasks: readonly TaskItem[] }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 9;
  const navigate = useNavigate();

  const filteredTasks = useMemo(() => {
    if (!searchQuery.trim()) {
      return tasks;
    }
    const query = searchQuery.toLowerCase();
    return tasks.filter((task) => {
      return (
        task.code.toString().includes(query) ||
        task.name.toLowerCase().includes(query) ||
        task.description.toLowerCase().includes(query) ||
        task.status.toLowerCase().includes(query)
      );
    });
  }, [searchQuery, tasks]);

  const paginatedTasks = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    const end = start + pageSize;
    return filteredTasks.slice(start, end);
  }, [filteredTasks, currentPage, pageSize]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);

  const handleViewTask = (taskId: string) => {
    if (onViewTask) {
      onViewTask(taskId);
    } else {
      navigate(`/dashboard/software/tasks/${taskId}`);
    }
  };

  // const renderPagination = () => {
  //   const pages: (number | string)[] = [];

  //   if (totalPages <= 7) {
  //     for (let i = 1; i <= totalPages; i++) {
  //       pages.push(i);
  //     }
  //   } else {
  //     pages.push(1);

  //     if (currentPage > 3) {
  //       pages.push("...");
  //     }

  //     const start = Math.max(2, currentPage - 1);
  //     const end = Math.min(totalPages - 1, currentPage + 1);

  //     for (let i = start; i <= end; i++) {
  //       if (i !== 1 && i !== totalPages) {
  //         pages.push(i);
  //       }
  //     }

  //     if (currentPage < totalPages - 2) {
  //       pages.push("...");
  //     }

  //     pages.push(totalPages);
  //   }

  //   return (
  //     <div className="flex flex-wrap items-center gap-2">
  //       <button
  //         type="button"
  //         onClick={() => handlePageChange(1)}
  //         disabled={currentPage === 1}
  //         className={`${tokens.buttonGhost} rounded-full px-3 py-1 text-xs font-semibold disabled:opacity-50`}
  //       >
  //         ««
  //       </button>
  //       <button
  //         type="button"
  //         onClick={() => handlePageChange(currentPage - 1)}
  //         disabled={currentPage === 1}
  //         className={`${tokens.buttonGhost} rounded-full px-3 py-1 text-xs font-semibold disabled:opacity-50`}
  //       >
  //         «
  //       </button>
  //       {pages.map((page, index) => {
  //         if (page === "...") {
  //           return (
  //             <span
  //               key={`ellipsis-${index}`}
  //               className="px-2 py-1 font-semibold text-[var(--color-page-text)]"
  //             >
  //               …
  //             </span>
  //           );
  //         }
  //         const pageNum = page as number;
  //         const isCurrent = pageNum === currentPage;
  //         return (
  //           <button
  //             key={pageNum}
  //             type="button"
  //             onClick={() => handlePageChange(pageNum)}
  //             className={`${
  //               isCurrent ? tokens.buttonFilled : tokens.buttonGhost
  //             } rounded-full px-3 py-1 text-xs font-semibold`}
  //           >
  //             {pageNum}
  //           </button>
  //         );
  //       })}
  //       <button
  //         type="button"
  //         onClick={() => handlePageChange(currentPage + 1)}
  //         disabled={currentPage === totalPages}
  //         className={`${tokens.buttonGhost} rounded-full px-3 py-1 text-xs font-semibold disabled:opacity-50`}
  //       >
  //         »
  //       </button>
  //       <button
  //         type="button"
  //         onClick={() => handlePageChange(totalPages)}
  //         disabled={currentPage === totalPages}
  //         className={`${tokens.buttonGhost} rounded-full px-3 py-1 text-xs font-semibold disabled:opacity-50`}
  //       >
  //         »»
  //       </button>
  //     </div>
  //   );
  // };

  return (
    <div className="flex flex-col gap-6">
      <div className="grid grid-cols-1 gap-4">
        {paginatedTasks.map((task) => (
          <TaskCard
            key={task.id}
            task={task}
            tokens={tokens}
            onViewTask={handleViewTask}
            showViewButton={true}
          />
        ))}
      </div>
    </div>
  );
};

export const TasksView = ({ 
  tokens, 
  projectId,
  project,
  milestoneTabs = ["Milestone", "Milestone", "Milestone", "Milestone", "Milestone"],
  activeMilestoneTab = 0,
  onMilestoneTabChange
}: TasksViewProps) => {
  const { t } = useTranslation("landing");
  const [searchQuery, setSearchQuery] = useState("");
  const iconBaseColor = tokens.isDark ? "#FFFFFF" : "#2B3674";
  
  // Fetch project overview from API
  const projectIdNum = parseInt(projectId, 10);
  const { data: apiData, isLoading } = useGetProjectOverviewQuery(projectIdNum);

  // Map API task status to component status
  const mapTaskStatus = (status: string): "Completed" | "In Progress" | "Not Started" | "Waiting Feedback" => {
    const statusLower = status.toLowerCase();
    if (statusLower === "completed") return "Completed";
    if (statusLower === "in_progress" || statusLower === "in progress") return "In Progress";
    if (statusLower === "not_started" || statusLower === "not started") return "Not Started";
    return "Waiting Feedback";
  };

  // Transform API tasks data
  const tasksData = useMemo((): readonly TaskItem[] => {
    if (apiData?.data?.project?.milestones && activeMilestoneTab < apiData.data.project.milestones.length) {
      const milestone = apiData.data.project.milestones[activeMilestoneTab];
      if (milestone?.tasks) {
        return milestone.tasks.map((task: any) => {
          // Calculate screens progress
          const screens = task.screens || [];
          const totalScreens = screens.length;
          const implementedScreens = screens.filter((s: any) => s.implemented === 1).length;
          const screensPercentage = totalScreens > 0 ? Math.round((implementedScreens / totalScreens) * 100) : 0;

          return {
            id: String(task.id),
            code: task.id,
            name: task.title || "N/A",
            description: task.description || "N/A",
            priority: task.priority || "Medium",
            startDate: "N/A", // Not in API
            deadline: "N/A", // Not in API
            createdDate: "N/A", // Not in API
            dueDate: task.updated_at || "N/A",
            assignedTo: task.assignees?.map((a: any) => a.name).join(", ") || "N/A",
            team: task.assignees?.map((a: any) => ({
              id: String(a.id),
              name: a.name || "N/A"
            })) || [],
            progress: { 
              completed: implementedScreens, 
              total: totalScreens, 
              percentage: screensPercentage 
            },
            status: mapTaskStatus(task.status || "not_started")
          };
        });
      }
    }
    return [];
  }, [apiData, activeMilestoneTab]);
  
  // Calculate task statistics from API data
  const taskStats = useMemo((): readonly TaskStat[] => {
    const allTasks = apiData?.data?.project?.milestones?.flatMap((m: any) => m.tasks || []) || [];
    const completed = allTasks.filter((t: any) => t.status?.toLowerCase() === "completed").length;
    const inProgress = allTasks.filter((t: any) => t.status?.toLowerCase() === "in_progress" || t.status?.toLowerCase() === "in progress").length;
    const notStarted = allTasks.filter((t: any) => t.status?.toLowerCase() === "not_started" || t.status?.toLowerCase() === "not started").length;
    const waitingFeedback = allTasks.filter((t: any) => 
      t.status?.toLowerCase() !== "completed" && 
      t.status?.toLowerCase() !== "in_progress" && 
      t.status?.toLowerCase() !== "in progress" &&
      t.status?.toLowerCase() !== "not_started" &&
      t.status?.toLowerCase() !== "not started"
    ).length;

    return [
      {
        id: "all",
        label: t("dashboard.overview.allTasks"),
        value: String(allTasks.length),
        icon: AllTasksIcon
      },
      {
        id: "complete",
        label: t("dashboard.overview.completed"),
        value: String(completed),
        icon: CompletedTasksIcon
      },
      {
        id: "in-progress",
        label: t("dashboard.overview.inProgress"),
        value: String(inProgress),
        icon: InProgressTasksIcon
      },
      {
        id: "awaiting-feedback",
        label: t("dashboard.overview.waitingFeedback"),
        value: String(waitingFeedback),
        icon: AwaitingFeedbackIcon
      },
      {
        id: "not-started",
        label: t("dashboard.overview.notStarted"),
        value: String(notStarted),
        icon: NotStartedTasksIcon
      }
    ];
  }, [apiData, t]);

  // Get current milestone data
  const currentMilestone = useMemo(() => {
    if (apiData?.data?.project?.milestones && activeMilestoneTab < apiData.data.project.milestones.length) {
      const milestone = apiData.data.project.milestones[activeMilestoneTab];
      return {
        id: milestone.id,
        name: milestone.name || "N/A",
        phase: milestone.phase || "N/A",
        status: milestone.status || "N/A",
        startDate: milestone.start_date || "N/A",
        endDate: milestone.end_date || "N/A"
      };
    }
    return {
      id: 0,
      name: "N/A",
      phase: "N/A",
      status: "N/A",
      startDate: "N/A",
      endDate: "N/A"
    };
  }, [apiData, activeMilestoneTab]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <p className={tokens.isDark ? "text-white/50" : "text-[#A3AED0]"}>Loading tasks...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Statistics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {taskStats.map((stat) => {
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

      {/* Milestone Section with Tasks - White Background */}
      {project && (
        <div className={`${tokens.isDark ? tokens.cardBase : "bg-white"} rounded-[20px] p-6 flex flex-col gap-6`}>
          {/* Milestone Tabs */}
          <div className="flex gap-4 overflow-x-auto">
            {milestoneTabs.map((tab, index) => (
              <button
                key={index}
                type="button"
                onClick={() => onMilestoneTabChange?.(index)}
                className={`pb-2 px-1 flex flex-wrap items-center gap-2 text-sm md:text-base font-medium transition-colors whitespace-nowrap cursor-pointer ${
                  activeMilestoneTab === index
                    ? tokens.isDark
                      ? "text-white border-b-2 border-white"
                      : "text-[#111111] border-b-2 border-[#071FD7]"
                    : tokens.subtleText
                }`}
              >
                <span>{tab}</span>
              </button>
            ))}
          </div>

          {/* Milestone Content with Background */}
          <div className={`${tokens.isDark ? tokens.surfaceMuted : "bg-[#FFFEF7]"} rounded-[20px] p-6 flex flex-col gap-4`}>
            {/* Milestone Header */}
            <div className="flex items-start justify-between gap-4">
              <div className="flex flex-col gap-2 flex-1">
                <h2 className={`text-2xl md:text-3xl font-bold ${
                  tokens.isDark ? "text-white" : "text-[#2B3674]"
                }`}>
                  {currentMilestone.name}
                </h2>
                <p className={`text-sm md:text-base ${tokens.subtleText}`}>
                  Phase: {currentMilestone.phase}
                </p>
              </div>
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                currentMilestone.status.toLowerCase() === "completed"
                  ? tokens.isDark ? "bg-green-500/10 text-green-400" : "bg-green-100 text-green-700"
                  : tokens.isDark ? "bg-blue-500/10 text-blue-400" : "bg-blue-100 text-blue-700"
              }`}>
                {currentMilestone.status}
              </span>
            </div>

            {/* Milestone Details Card */}
            <div className={`rounded-[20px] p-4 ${tokens.isDark ? tokens.surfaceMuted : ''}`} style={tokens.isDark ? {} : { backgroundColor: '#FCF6D4' }}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex flex-col gap-2">
                  <span className={`text-base font-semibold ${
                    tokens.isDark ? "text-white" : "text-[#232323]"
                  }`}>
                    {currentMilestone.startDate}
                  </span>
                  <span className={`text-sm md:text-base font-medium ${
                    tokens.isDark ? tokens.subtleText : "text-[#718EBF]"
                  }`}>{t("dashboard.project.startDate")}</span>
                </div>
                <div className="flex flex-col gap-2">
                  <span className={`text-base font-semibold ${
                    tokens.isDark ? "text-white" : "text-[#232323]"
                  }`}>
                    {currentMilestone.endDate}
                  </span>
                  <span className={`text-sm md:text-base font-medium ${
                    tokens.isDark ? tokens.subtleText : "text-[#718EBF]"
                  }`}>End Date</span>
                </div>
              </div>
            </div>
          </div>

          {/* Tasks Section with Search */}
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <h2 className={`text-lg md:text-xl font-semibold ${
                tokens.isDark ? "text-white" : "text-[#2B3674]"
              }`}>
                Tasks
              </h2>
              <div
                className={`flex h-11 items-center gap-3 rounded-full border ${tokens.divider} bg-transparent stroke px-4 text-[var(--color-search-text)] transition-colors sm:max-w-xs`}
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
            </div>
            <TasksCards tokens={tokens} searchQuery={searchQuery} tasks={tasksData} />
          </div>
        </div>
      )}

      {/* Tasks Section with Search - When no project (fallback) */}
      {!project && (
        <div className={`${tokens.cardBase} rounded-[20px] px-6 py-4`}>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-4">
            <h2 className={`text-lg md:text-xl font-semibold ${tokens.isDark ? "text-white" : "text-[#2B3674]"}`}>
              Tasks
            </h2>
            <div
              className={`flex h-11 items-center gap-3 rounded-full border ${tokens.divider} bg-transparent stroke px-4 text-[var(--color-search-text)] transition-colors sm:max-w-xs`}
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
          </div>
          <TasksCards tokens={tokens} searchQuery={searchQuery} tasks={tasksData} />
        </div>
      )}
    </div>
  );
};


