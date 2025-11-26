import { useState, useMemo, useEffect } from "react";
import { useNavigate } from "react-router-dom";
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

type TasksViewProps = {
  readonly tokens: DashboardTokens;
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

// TaskItem type is now exported from TaskCard.tsx

const taskStats: readonly TaskStat[] = [
  {
    id: "all",
    label: "All taskes",
    value: "6",
    icon: AllTasksIcon
  },
  {
    id: "complete",
    label: "Complete",
    value: "7",
    icon: CompletedTasksIcon
  },
  {
    id: "in-progress",
    label: "In Progress",
    value: "7",
    icon: InProgressTasksIcon
  },
  {
    id: "awaiting-feedback",
    label: "Awaiting Feedback",
    value: "6",
    icon: AwaitingFeedbackIcon
  },
  {
    id: "not-started",
    label: "Not Started",
    value: "6",
    icon: NotStartedTasksIcon
  }
];

export const tasksData: readonly TaskItem[] = [
  {
    id: "task-1",
    code: 1,
    name: "Task Name",
    description: "Lorem Ipsum Is Simply Dummy Text Of The Printing And Typesetting Industry. Lorem Ipsum Has Been The Industry's Standard Dummy.",
    priority: "High",
    startDate: "2024-03-17",
    deadline: "2024-03-17",
    createdDate: "5 Nov 2025",
    dueDate: "30 Nov 2025",
    assignedTo: "Asmaa, Aya",
    team: [
      { id: "1", name: "John Doe" },
      { id: "2", name: "Jane Smith" },
      { id: "3", name: "Bob Wilson" }
    ],
    progress: { completed: 7, total: 10, percentage: 70 },
    status: "Completed"
  },
  {
    id: "task-2",
    code: 2,
    name: "Task Name",
    description: "Lorem Ipsum Is Simply Dummy Text Of The Printing And Typesetting Industry. Lorem Ipsum Has Been The Industry's Standard Dummy.",
    priority: "High",
    startDate: "2024-03-17",
    deadline: "2024-03-17",
    createdDate: "5 Nov 2025",
    dueDate: "30 Nov 2025",
    assignedTo: "Asmaa, Aya",
    team: [
      { id: "1", name: "John Doe" },
      { id: "2", name: "Jane Smith" }
    ],
    progress: { completed: 8, total: 10, percentage: 80 },
    status: "Completed"
  },
  {
    id: "task-3",
    code: 3,
    name: "Task Name",
    description: "Lorem Ipsum Is Simply Dummy Text Of The Printing And Typesetting Industry. Lorem Ipsum Has Been The Industry's Standard Dummy.",
    priority: "High",
    startDate: "2024-03-17",
    deadline: "2024-03-17",
    createdDate: "5 Nov 2025",
    dueDate: "30 Nov 2025",
    assignedTo: "Asmaa, Aya",
    team: [
      { id: "1", name: "John Doe" },
      { id: "2", name: "Jane Smith" },
      { id: "3", name: "Bob Wilson" }
    ],
    progress: { completed: 5, total: 10, percentage: 50 },
    status: "Waiting Feedback"
  }
];


// CircularProgress, getAvatarColor, and getInitials are now in TaskCard.tsx

const TasksCards = ({ tokens, searchQuery, onViewTask }: { readonly tokens: DashboardTokens; readonly searchQuery: string; readonly onViewTask?: (taskId: string) => void }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 9;
  const navigate = useNavigate();

  const filteredTasks = useMemo(() => {
    if (!searchQuery.trim()) {
      return tasksData;
    }
    const query = searchQuery.toLowerCase();
    return tasksData.filter((task) => {
      return (
        task.code.toString().includes(query) ||
        task.name.toLowerCase().includes(query) ||
        task.description.toLowerCase().includes(query) ||
        task.status.toLowerCase().includes(query)
      );
    });
  }, [searchQuery]);

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
  //     <div className="flex items-center gap-2">
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
  project,
  milestoneTabs = ["Milestone", "Milestone", "Milestone", "Milestone", "Milestone"],
  activeMilestoneTab = 0,
  onMilestoneTabChange
}: TasksViewProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const iconBaseColor = tokens.isDark ? "#FFFFFF" : "#2B3674";

  return (
    <div className="flex flex-col gap-6">
      {/* Statistics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {taskStats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.id} className={`${tokens.cardBase} rounded-2xl p-6`}>
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
        <div className={`${tokens.isDark ? tokens.cardBase : "bg-white"} rounded-2xl p-6 flex flex-col gap-6 border border-[var(--color-card-border)]`}>
          {/* Milestone Tabs */}
          <div className="flex gap-4 overflow-x-auto">
            {milestoneTabs.map((tab, index) => (
              <button
                key={index}
                type="button"
                onClick={() => onMilestoneTabChange?.(index)}
                className={`pb-2 px-1 flex items-center gap-2 text-sm md:text-base font-medium transition-colors whitespace-nowrap cursor-pointer ${
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
          <div className={`${tokens.isDark ? tokens.surfaceMuted : "bg-[#FFFEF7]"} rounded-2xl p-6 flex flex-col gap-4`}>
            {/* Milestone Header */}
            <div className="flex items-start justify-between gap-4">
              <div className="flex flex-col gap-2 flex-1">
                <h2 className={`text-2xl md:text-3xl font-bold ${
                  tokens.isDark ? "text-white" : "text-[#2B3674]"
                }`}>
                  Milestone Name
                </h2>
                <p className={`text-sm md:text-base ${tokens.subtleText}`}>
                  Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy.
                </p>
              </div>
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                tokens.isDark ? "bg-green-500/10 text-green-400" : "bg-green-100 text-green-700"
              }`}>
                Completed
              </span>
            </div>

            {/* Milestone Details Card */}
            <div className={`rounded-xl p-4 ${tokens.isDark ? tokens.surfaceMuted : ''}`} style={tokens.isDark ? {} : { backgroundColor: '#FCF6D4' }}>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="flex flex-col gap-2">
                  <span className={`text-base font-semibold ${
                    tokens.isDark ? "text-white" : "text-[#232323]"
                  }`}>
                    {project.startDate}
                  </span>
                  <span className={`text-sm md:text-base font-medium ${
                    tokens.isDark ? tokens.subtleText : "text-[#718EBF]"
                  }`}>Start</span>
                </div>
                <div className="flex flex-col gap-2">
                  <span className={`text-base font-semibold ${
                    tokens.isDark ? "text-white" : "text-[#232323]"
                  }`}>
                    {project.deadline}
                  </span>
                  <span className={`text-sm md:text-base font-medium ${
                    tokens.isDark ? tokens.subtleText : "text-[#718EBF]"
                  }`}>Deadline</span>
                </div>
                <div className="flex flex-col gap-2">
                  <span className={`text-base font-semibold ${
                    tokens.isDark ? "text-white" : "text-[#232323]"
                  }`}>
                    {project.budget}
                  </span>
                  <span className={`text-sm md:text-base font-medium ${
                    tokens.isDark ? tokens.subtleText : "text-[#718EBF]"
                  }`}>Budget</span>
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
              {/* <div
                className={`flex h-11 items-center gap-3 rounded-full border ${tokens.divider} bg-[var(--color-search-bg)] px-4 text-[var(--color-search-text)] transition-colors sm:max-w-xs`}
              >
                <SearchIcon className="h-5 w-5 text-[var(--color-search-placeholder)]" />
                <input
                  type="search"
                  placeholder="Search"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="flex-1 bg-transparent text-sm text-[var(--color-search-text)] placeholder:text-[var(--color-search-placeholder)] focus:outline-none"
                />
              </div> */}
            </div>
            <TasksCards tokens={tokens} searchQuery={searchQuery} />
          </div>
        </div>
      )}

      {/* Tasks Section with Search - When no project (fallback) */}
      {!project && (
        <div className={`${tokens.cardBase} rounded-2xl border border-[var(--color-card-border)] px-6 py-4`}>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-4">
            <h2 className={`text-lg md:text-xl font-semibold ${tokens.isDark ? "text-white" : "text-[#2B3674]"}`}>
              Tasks
            </h2>
            <div
              className={`flex h-11 items-center gap-3 rounded-full border ${tokens.divider} bg-[var(--color-search-bg)] px-4 text-[var(--color-search-text)] transition-colors sm:max-w-xs`}
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
          <TasksCards tokens={tokens} searchQuery={searchQuery} />
        </div>
      )}
    </div>
  );
};


