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

        {/* Team Section */}
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

        {/* Key Details Row */}
        <div className={`rounded-xl p-4 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 flex items-center ${tokens.isDark ? tokens.surfaceMuted : ''}`} style={tokens.isDark ? {} : { backgroundColor: '#FCF6D4' }}>
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
                  ? "bg-[#071FD7] text-white hover:bg-[#071FD7]/90"
                  : "bg-[#071FD7] text-white hover:bg-[#071FD7]/90"
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

