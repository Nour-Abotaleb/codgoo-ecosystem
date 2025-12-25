import type { DashboardTokens } from "../../types";

export type TaskItem = {
  readonly id: string;
  readonly code: number;
  readonly name: string;
  readonly description: string;
  readonly priority: "High" | "Medium" | "Low";
  readonly startDate: string;
  readonly deadline: string;
  readonly createdDate: string;
  readonly dueDate: string;
  readonly assignedTo: string;
  readonly team: readonly {
    readonly id: string;
    readonly name: string;
    readonly avatar?: string;
  }[];
  readonly progress: {
    readonly completed: number;
    readonly total: number;
    readonly percentage: number;
  };
  readonly status: "In Progress" | "Not Started" | "Canceld" | "Completed" | "Ongoing" | "Waiting Feedback";
};

type TaskCardProps = {
  readonly task: TaskItem;
  readonly tokens: DashboardTokens;
  readonly onViewTask?: (taskId: string) => void;
  readonly showViewButton?: boolean;
  readonly customButtons?: React.ReactNode;
};

const CircularProgress = ({ percentage, completed, total, tokens }: { percentage: number; completed: number; total: number; tokens: DashboardTokens }) => {
  const size = 130;
  const radius = (size - 18) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percentage / 100) * circumference;
  const uniqueId = `progress-${Math.random().toString(36).substr(2, 9)}`;

  const gradientStart = tokens.isDark ? "#3B82F6" : "#071FD7";
  const gradientEnd = tokens.isDark ? "#1E40AF" : "#041071";

  return (
    <div className="relative inline-flex items-center justify-center border-8 border-white/20 rounded-full">
      <svg className="transform -rotate-20" width={size} height={size}>
        <defs>
          <linearGradient id={`gradient-${uniqueId}`} x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor={gradientStart} />
            <stop offset="100%" stopColor={gradientEnd} />
          </linearGradient>
        </defs>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={tokens.isDark ? "rgba(249, 250, 250, 0.2)" : "#E4E7E9"}
          strokeWidth="18"
          fill="none"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={`url(#gradient-${uniqueId})`}
          strokeWidth="18"
          fill="none"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          className="transition-all duration-300"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className={`text-base font-semibold ${tokens.isDark ? "text-white" : "text-[#292D30]"}`}>
          {percentage}%
        </span>
        <span className={`text-xs ${tokens.isDark ? "text-white/70" : "text-[#718EBF]"}`}>
          {completed}/{total} Screens
        </span>
      </div>
    </div>
  );
};

const getAvatarColor = (index: number, isDark: boolean) => {
  const colors = [
    isDark ? "#4F46E5" : "#6366F1",
    isDark ? "#DC2626" : "#EF4444",
    isDark ? "#2563EB" : "#3B82F6"
  ];
  return colors[index % colors.length];
};

const getInitials = (name: string) => {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
};

export const TaskCard = ({ task, tokens, onViewTask, showViewButton = true, customButtons }: TaskCardProps) => {
  const statusColors = {
    Completed: tokens.isDark ? "bg-green-500/10 text-green-400" : "bg-green-100 text-green-700",
    "In Progress": tokens.isDark ? "bg-blue-500/10 text-blue-400" : "bg-blue-100 text-blue-700",
    "Waiting Feedback": tokens.isDark ? "bg-yellow-500/10 text-yellow-400" : "bg-yellow-100 text-yellow-700",
    "Not Started": tokens.isDark ? "bg-gray-500/10 text-gray-400" : "bg-gray-100 text-gray-700",
    Ongoing: tokens.isDark ? "bg-purple-500/10 text-purple-400" : "bg-purple-100 text-purple-700",
    Canceld: tokens.isDark ? "bg-red-500/10 text-red-400" : "bg-red-100 text-red-700"
  };

  const priorityColors = {
    High: tokens.isDark ? "text-[#68696D]" : "text-[#68696D]",
    Medium: tokens.isDark ? "text-yellow-400" : "text-yellow-600",
    Low: tokens.isDark ? "text-green-400" : "text-green-600"
  };

  return (
    <div
      className={`${tokens.cardBase} rounded-[20px] overflow-hidden`}
    >
      {/* Top Section with Background Color */}
      <div className={`p-6 ${tokens.isDark ? "bg-gradient-to-br from-[#071FD7]/10 to-[#071FD7]/5" : "bg-gradient-to-br from-[#071FD7]/10 to-[#071FD7]/5"}`}>
        <div className="flex flex-col gap-4">
          {/* Priority, Task Name and Status */}
          <div className="flex items-start justify-between gap-4">
            <div className="flex flex-col gap-2">
              <span className={`text-sm font-medium ${priorityColors[task.priority]}`}>
                #{task.priority}
              </span>
              <h3 className={`text-lg md:text-xl font-semibold ${
                tokens.isDark ? "text-white" : "text-[#2B3674]"
              }`}>
                {task.name}
              </h3>
            </div>
            <span className={`px-3 py-1 rounded-full text-sm font-medium flex-shrink-0 ${statusColors[task.status]}`}>
              {task.status}
            </span>
          </div>

          {/* Description, Team and Progress */}
          <div className="flex items-start justify-between gap-6">
            <div className="flex flex-col gap-4 flex-1">
              {/* Description */}
              <p className={`text-sm md:text-base break-words ${tokens.subtleText} text-[#68696D]`}>
                {task.description}
              </p>
              {/* Team Section */}
              <div className="flex items-center gap-2">
                <span className={`text-sm md:text-base font-medium ${tokens.subtleText} text-[#718EBF]`}>team:</span>
                <div className="flex -space-x-2">
                  {task.team.slice(0, 3).map((member, index) => (
                    <div
                      key={member.id}
                      className="relative h-8 w-8 rounded-full border-2 border-white flex items-center justify-center text-sm font-semibold text-white"
                      style={{ backgroundColor: getAvatarColor(index, tokens.isDark) }}
                      title={member.name}
                    >
                      {member.avatar ? (
                        <img
                          src={member.avatar}
                          alt={member.name}
                          className="h-full w-full rounded-full object-cover"
                        />
                      ) : (
                        <span>{getInitials(member.name)}</span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="flex items-center justify-center flex-shrink-0">
              <CircularProgress
                percentage={task.progress.percentage}
                completed={task.progress.completed}
                total={task.progress.total}
                tokens={tokens}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Section with Different Background */}
      {(showViewButton || customButtons) && (
        <div className={`flex items-center justify-between px-6 py-4 border-t border-dashed ${
          tokens.isDark ? "border-[#2E3141] bg-[#0F1217]" : "border-[#E2E8FF] bg-[#FFFEF7]"
        }`}>
          <div className="flex items-center gap-6">
            <span className={`text-base text-[#718EBF]`}>
              Created at: <span className={tokens.isDark ? "text-white" : "text-black"}>
                {task.createdDate}
              </span>
            </span>
            <span className={`text-base text-[#718EBF]`}>
              Due date: <span className={tokens.isDark ? "text-white" : "text-black"}>{task.dueDate}</span>
            </span>
          </div>
          {customButtons ? (
            customButtons
          ) : showViewButton ? (
            <button
              type="button"
              onClick={() => onViewTask?.(task.id)}
              className={`px-8 py-2.5 rounded-full text-sm md:text-base font-medium transition-colors cursor-pointer ${
                tokens.isDark
                  ? "bg-[#071FD7] text-white hover:bg-[#071FD7]/90"
                  : "bg-[#071FD7] text-white hover:bg-[#071FD7]/90"
              }`}
            >
              View Task
            </button>
          ) : null}
        </div>
      )}
    </div>
  );
};

