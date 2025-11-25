import { DeleteIcon } from "@utilities/icons";
import type { DashboardTokens } from "../../types";

export type ProjectCardData = {
  readonly id: string;
  readonly name: string;
  readonly description: string;
  readonly status: "Active" | "Pending" | "Completed" | "Ongoing";
  readonly team: readonly {
    readonly id: string;
    readonly name: string;
    readonly avatar?: string;
  }[];
  readonly startDate: string;
  readonly deadline: string;
  readonly budget: string;
  readonly tasks: {
    readonly completed: number;
    readonly total: number;
  };
  readonly type: string;
  readonly lastUpdate: string;
};

type ProjectCardProps = {
  readonly project: ProjectCardData;
  readonly tokens: DashboardTokens;
  readonly onViewDetails?: (projectId: string) => void;
  readonly onManage?: (projectId: string) => void;
};

export const ProjectCard = ({
  project,
  tokens,
  onViewDetails,
  onManage
}: ProjectCardProps) => {
  const statusColors = {
    Active: tokens.isDark ? "bg-green-500/10 text-green-400" : "bg-green-100 text-green-700",
    Pending: tokens.isDark ? "bg-yellow-500/10 text-yellow-400" : "bg-yellow-100 text-yellow-700",
    Completed: tokens.isDark ? "bg-blue-500/10 text-blue-400" : "bg-blue-100 text-blue-700",
    Ongoing: tokens.isDark ? "bg-purple-500/10 text-purple-400" : "bg-purple-100 text-purple-700"
  };

  const getAvatarColor = (index: number) => {
    const colors = [
      tokens.isDark ? "#4F46E5" : "#6366F1",
      tokens.isDark ? "#DC2626" : "#EF4444",
      tokens.isDark ? "#2563EB" : "#3B82F6"
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

  const CircularProgress = ({ percentage, size = 110 }: { percentage: number; size?: number }) => {
    const radius = (size - 18) / 2;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (percentage / 100) * circumference;
    const uniqueId = `progress-${Math.random().toString(36).substr(2, 9)}`;

    const gradientStart = tokens.isDark ? "#3B82F6" : "#071FD7";
    const gradientEnd = tokens.isDark ? "#1E40AF" : "#041071";

    return (
      <div className="relative inline-flex items-center justify-center">
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
        <div className="absolute inset-0 flex items-center justify-center">
          <span className={`text-base font-semibold ${tokens.isDark ? "text-white" : "text-[#292D30]"}`}>
            {percentage}%
          </span>
        </div>
      </div>
    );
  };

  const progressPercentage = project.tasks.total > 0 
    ? Math.round((project.tasks.completed / project.tasks.total) * 100)
    : 0;

  return (
    <div className={`${tokens.cardBase} rounded-2xl p-6 border border-[var(--color-card-border)]`}>
      <div className="flex flex-col gap-4">
        {/* Title and Description */}
        <div className="flex flex-col gap-2">
          <div className="flex items-start justify-between gap-4">
            <h3 className={`text-lg md:text-xl font-semibold ${
                  tokens.isDark ? "text-white" : "text-[#2B3674]"
                }`}>
              {project.name}
            </h3>
            <span
              className={`px-3 py-1 rounded-full text-sm font-medium ${statusColors[project.status]}`}
            >
              {project.status}
            </span>
          </div>
          <p className={`text-sm md:text-base ${tokens.subtleText} line-clamp-2 text-[#718EBF]`}>
            {project.description}
          </p>
        </div>

        {/* Team Section with Chart */}
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className={`text-sm md:text-base font-medium ${tokens.subtleText} text-[#718EBF]`}>team:</span>
            <div className="flex -space-x-2">
              {project.team.slice(0, 3).map((member, index) => (
                <div
                  key={member.id}
                  className="relative h-8 w-8 rounded-full border-2 border-[var(--color-card-bg)] flex items-center justify-center text-sm font-semibold text-white"
                  style={{ backgroundColor: getAvatarColor(index) }}
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
          <CircularProgress percentage={progressPercentage} size={110} />
        </div>

        {/* Key Details Row */}
        <div className={`flex flex-col ${!onViewDetails ? 'lg:flex-row' : ''} gap-4`}>
          <div className={`rounded-xl p-4 flex-1 ${tokens.isDark ? tokens.surfaceMuted : ''}`} style={tokens.isDark ? {} : { backgroundColor: '#FCF6D4' }}>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 items-center">
              <div className="flex flex-col gap-2">
                <span className="text-sm md:text-base ${tokens.isDark ? 'text-[#718EBF]' : 'text-[#232323]'} font-medium">Start</span>
                <span className="text-sm font-medium text-[#718EBF]">{project.startDate}</span>
              </div>
              <div className="flex flex-col gap-2">
                <span className="text-sm md:text-base ${tokens.isDark ? 'text-[#718EBF]' : 'text-[#232323]'} font-medium">Deadline</span>
                <span className="text-sm font-medium text-[#718EBF]">{project.deadline}</span>
              </div>
              <div className="flex flex-col gap-2">
                <span className="text-sm md:text-base ${tokens.isDark ? 'text-[#718EBF]' : 'text-[#232323]'} font-medium">Budget</span>
                <span className="text-sm font-medium text-[#718EBF]">{project.budget}</span>
              </div>
              <div className="flex flex-col gap-2">
                <span className="text-sm md:text-base ${tokens.isDark ? 'text-[#718EBF]' : 'text-[#232323]'} font-medium">Tasks</span>
                <span className="text-sm font-medium text-[#718EBF]">
                  {project.tasks.completed} / {project.tasks.total}
                </span>
              </div>
              <div className="flex flex-col gap-2">
                <span className="text-sm md:text-base ${tokens.isDark ? 'text-[#718EBF]' : 'text-[#232323]'} font-medium">Type</span>
                <span className="text-sm font-medium text-[#718EBF]">{project.type}</span>
              </div>
              <div className="flex items-center flex-col gap-2 cursor-pointer">
                <button
                  type="button"
                  onClick={() => onManage?.(project.id)}
                  className="p-1.5 rounded-full transition-colors"
                  style={{ backgroundColor: 'rgb(255,229,222)' }}
                  aria-label="Manage project"
                >
                  <DeleteIcon className="h-4 w-4" style={{ color: '#FF0000' }} />
                </button>
                <span className="text-sm text-[#718EBF] font-medium">Manage</span>
              </div>
            </div>
          </div>
          {/* Contract and Proposals Buttons - Only in overview screen, outside the background */}
          {!onViewDetails && (
            <div className="flex flex-row gap-3 items-center">
              <button
                type="button"
                className={`flex items-center gap-2 px-6 py-2.5 rounded-full text-sm md:text-base font-medium transition-colors cursor-pointer ${
                  tokens.isDark
                    ? "bg-white/10 text-white/90 hover:bg-white/20"
                    : "bg-[#071FD7] text-white hover:bg-[#071FD7]/90 hover:text-white"
                }`}
              >
                <span>Contract</span>
              </button>
              <button
                type="button"
                className={`flex items-center gap-2 px-6 py-2.5 rounded-full text-sm md:text-base font-medium transition-colors cursor-pointer ${
                  tokens.isDark
                    ? "border border-white/70 text-white/70 hover:bg-white/10"
                    : "border border-[#071FD7] text-[#071FD7] hover:bg-[#071FD7]/90 hover:text-white"
                }`}
              >
                <span>Proposals</span>
              </button>
            </div>
          )}
        </div>

        {/* Footer */}
        {onViewDetails && (
          <div className="flex items-center justify-between pt-2">
            <span className={`text-sm md:text-base ${tokens.subtleText} text-[#636786]`}>
              Last update: {project.lastUpdate}
            </span>
            <button
              type="button"
              onClick={() => onViewDetails(project.id)}
              className={`px-4 py-2.5 rounded-full text-sm md:text-base font-medium transition-colors cursor-pointer ${
                tokens.isDark
                  ? "border border-white/70 text-white/70 hover:bg-white/10"
                  : "border border-[#071FD7] text-[#071FD7] hover:bg-[#071FD7]/90 hover:text-white"
              }`}
            >
              View Details
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

