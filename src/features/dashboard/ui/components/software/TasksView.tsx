import { useState, useMemo, useEffect } from "react";
import {
  SearchIcon,
  AllTasksIcon,
  CompletedTasksIcon,
  InProgressTasksIcon,
  AwaitingFeedbackIcon,
  NotStartedTasksIcon,
  SettingsIcon,
  DeleteIcon,
  OngoingTasksIcon,
  PendingIcon,
  UnpaidIcon,
  ActiveIcon,
} from "@utilities/icons";
import type { DashboardTokens } from "../../types";

type TasksViewProps = {
  readonly tokens: DashboardTokens;
};

type TaskStat = {
  readonly id: string;
  readonly label: string;
  readonly value: string;
  readonly icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
};

type TaskItem = {
  readonly id: string;
  readonly code: number;
  readonly name: string;
  readonly startDate: string;
  readonly deadline: string;
  readonly assignedTo: string;
  readonly status: "In Progress" | "Not Started" | "Canceld" | "Completed" | "Ongoing";
};

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

const tasksData: readonly TaskItem[] = [
  {
    id: "task-1",
    code: 1,
    name: "Fix an open issue in our software",
    startDate: "2024-03-17",
    deadline: "2024-03-17",
    assignedTo: "Asmaa, Aya",
    status: "In Progress"
  },
  {
    id: "task-2",
    code: 2,
    name: "Fix an open issue in our software",
    startDate: "2024-03-17",
    deadline: "2024-03-17",
    assignedTo: "Asmaa, Aya",
    status: "Not Started"
  },
  {
    id: "task-3",
    code: 3,
    name: "Fix an open issue in our software",
    startDate: "2024-03-17",
    deadline: "2024-03-17",
    assignedTo: "Asmaa, Aya",
    status: "Canceld"
  },
  {
    id: "task-4",
    code: 4,
    name: "Fix an open issue in our software",
    startDate: "2024-03-17",
    deadline: "2024-03-17",
    assignedTo: "Asmaa, Aya",
    status: "Completed"
  },
  {
    id: "task-5",
    code: 5,
    name: "Fix an open issue in our software",
    startDate: "2024-03-17",
    deadline: "2024-03-17",
    assignedTo: "Asmaa, Aya",
    status: "Ongoing"
  },
  {
    id: "task-6",
    code: 6,
    name: "Fix an open issue in our software",
    startDate: "2024-03-17",
    deadline: "2024-03-17",
    assignedTo: "Asmaa, Aya",
    status: "Canceld"
  },
  {
    id: "task-7",
    code: 7,
    name: "Fix an open issue in our software",
    startDate: "2024-03-17",
    deadline: "2024-03-17",
    assignedTo: "Asmaa, Aya",
    status: "In Progress"
  }
];

const renderStatusIcon = (status: TaskItem["status"]) => {
  if (status === "Completed") {
    return <ActiveIcon className="h-5 w-5" />;
  }
  if (status === "In Progress" || status === "Ongoing") {
    return <OngoingTasksIcon className="h-5 w-5" />;
  }
  if (status === "Not Started") {
    return <PendingIcon className="h-5 w-5" />;
  }
  if (status === "Canceld") {
    return <UnpaidIcon className="h-5 w-5" />;
  }
  return null;
};

const TasksTable = ({ tokens, searchQuery }: { readonly tokens: DashboardTokens; readonly searchQuery: string }) => {
  const [selectedTasks, setSelectedTasks] = useState<Set<string>>(new Set(["task-1"]));
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 20;
  const totalRecords = 100;
  const totalPages = Math.ceil(totalRecords / pageSize);

  const filteredTasks = useMemo(() => {
    if (!searchQuery.trim()) {
      return tasksData;
    }
    const query = searchQuery.toLowerCase();
    return tasksData.filter((task) => {
      return (
        task.code.toString().includes(query) ||
        task.name.toLowerCase().includes(query) ||
        task.startDate.toLowerCase().includes(query) ||
        task.deadline.toLowerCase().includes(query) ||
        task.assignedTo.toLowerCase().includes(query) ||
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

  const toggleTask = (id: string) => {
    setSelectedTasks((prev) => {
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
      <div className="overflow-x-auto">
        <table className="min-w-full table-auto border-separate border-spacing-y-2">
          <thead className={tokens.isDark ? "" : "bg-[#F7F6FF]"}>
            <tr className="[&>th]:border-y [&>th]:border-[var(--color-border-divider)]">
              <th className="whitespace-nowrap py-3 pe-6 text-left">
                <span className={tableHeaderClass}>Code</span>
              </th>
              <th className="whitespace-nowrap py-3 pe-6 text-left">
                <span className={tableHeaderClass}>Name</span>
              </th>
              <th className="whitespace-nowrap py-3 pe-6 text-left">
                <span className={tableHeaderClass}>Start Date</span>
              </th>
              <th className="whitespace-nowrap py-3 pe-6 text-left">
                <span className={tableHeaderClass}>Deadline</span>
              </th>
              <th className="whitespace-nowrap py-3 pe-6 text-left">
                <span className={tableHeaderClass}>Assigned to</span>
              </th>
              <th className="whitespace-nowrap py-3 pe-6 text-left">
                <span className={tableHeaderClass}>Status</span>
              </th>
              <th className="whitespace-nowrap py-3 text-left">
                <span className={tableHeaderClass}>Manage</span>
              </th>
            </tr>
          </thead>
          <tbody>
            {paginatedTasks.map((task) => {
              const isSelected = selectedTasks.has(task.id);
              return (
                <tr key={task.id} className="text-sm">
                  <td className="rounded-l-xl bg-[var(--color-table-row-bg)] px-6 py-4 transition-colors">
                    <div className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => toggleTask(task.id)}
                        className="h-4 w-4 rounded border-[var(--color-border-divider)] bg-transparent accent-[#071FD7] transition-colors"
                        aria-label={`Select task ${task.code}`}
                      />
                      <span className={`text-base font-semibold ${tokens.isDark ? "text-white" : "text-[#2B3674]"}`}>
                        {task.code}
                      </span>
                    </div>
                  </td>
                  <td className="bg-[var(--color-table-row-bg)] px-6 py-4 transition-colors">
                    <p className={`font-medium ${tokens.isDark ? "text-white" : "text-[#2B3674]"}`}>{task.name}</p>
                  </td>
                  <td className="bg-[var(--color-table-row-bg)] px-6 py-4 transition-colors">
                    <p className={`font-medium ${tokens.isDark ? "text-white" : "text-[#2B3674]"}`}>{task.startDate}</p>
                  </td>
                  <td className="bg-[var(--color-table-row-bg)] px-6 py-4 transition-colors">
                    <p className={`font-medium ${tokens.isDark ? "text-white" : "text-[#2B3674]"}`}>{task.deadline}</p>
                  </td>
                  <td className="bg-[var(--color-table-row-bg)] px-6 py-4 transition-colors">
                    <p className={`font-medium ${tokens.isDark ? "text-white" : "text-[#2B3674]"}`}>{task.assignedTo}</p>
                  </td>
                  <td className="bg-[var(--color-table-row-bg)] px-6 py-4 transition-colors">
                    <span
                      className={`inline-flex items-center gap-1 text-sm font-medium ${
                        tokens.isDark ? "text-white" : "text-[#2B3674]"
                      }`}
                    >
                      {renderStatusIcon(task.status)}
                      {task.status}
                    </span>
                  </td>
                  <td className="rounded-r-xl bg-[var(--color-table-row-bg)] px-6 py-4 transition-colors">
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        className={`${tokens.buttonGhost} flex h-9 w-9 items-center justify-center rounded-full`}
                        aria-label={`Settings for task ${task.code}`}
                      >
                        <SettingsIcon className={`h-4 w-4 ${tokens.isDark ? "" : "[&_path]:fill-[#071FD7]"}`} />
                      </button>
                      <button
                        type="button"
                        className={`${tokens.buttonGhost} flex h-9 w-9 items-center justify-center rounded-full`}
                        aria-label={`Delete task ${task.code}`}
                      >
                        <DeleteIcon className={`h-4 w-4 ${tokens.isDark ? "" : "[&_path]:fill-[#071FD7]"}`} />
                      </button>
                    </div>
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

export const TasksView = ({ tokens }: TasksViewProps) => {
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

      {/* Tasks Section with Search */}
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
        <TasksTable tokens={tokens} searchQuery={searchQuery} />
      </div>
    </div>
  );
};

