import { PlusCircleIcon, AllProjectsIcon, CompletedIcon, OngoingIcon, ProjectPendingIcon } from "@utilities/icons";
import type { DashboardTokens } from "../../types";
import { ProjectCard, type ProjectCardData } from "./ProjectCard";

type ProjectsViewProps = {
  readonly tokens: DashboardTokens;
  readonly projects?: readonly ProjectCardData[];
  readonly onAddProject?: () => void;
  readonly onViewDetails?: (projectId: string) => void;
  readonly onManage?: (projectId: string) => void;
};

const defaultProjects: readonly ProjectCardData[] = [
  {
    id: "proj-1",
    name: "FixMate App",
    description:
      "Updated app interface, changed order and appointment tracking system, improved customer satisfaction",
    status: "Active",
    team: [
      { id: "1", name: "John Doe" },
      { id: "2", name: "Jane Smith" },
      { id: "3", name: "Bob Wilson" }
    ],
    startDate: "15 Oct 2023",
    deadline: "20 Nov 2023",
    budget: "$5,000",
    tasks: { completed: 8, total: 10 },
    type: "Mobile",
    lastUpdate: "2 days ago"
  },
  {
    id: "proj-2",
    name: "FixMate App",
    description:
      "Updated app interface, changed order and appointment tracking system, improved customer satisfaction",
    status: "Active",
    team: [
      { id: "1", name: "John Doe" },
      { id: "2", name: "Jane Smith" },
      { id: "3", name: "Bob Wilson" }
    ],
    startDate: "15 Oct 2023",
    deadline: "20 Nov 2023",
    budget: "$5,000",
    tasks: { completed: 8, total: 10 },
    type: "Mobile",
    lastUpdate: "2 days ago"
  },
  {
    id: "proj-3",
    name: "FixMate App",
    description:
      "Updated app interface, changed order and appointment tracking system, improved customer satisfaction",
    status: "Active",
    team: [
      { id: "1", name: "John Doe" },
      { id: "2", name: "Jane Smith" },
      { id: "3", name: "Bob Wilson" }
    ],
    startDate: "15 Oct 2023",
    deadline: "20 Nov 2023",
    budget: "$5,000",
    tasks: { completed: 8, total: 10 },
    type: "Mobile",
    lastUpdate: "2 days ago"
  }
];

const projectStats = [
  {
    id: "all",
    label: "All Projects",
    value: "6",
    icon: AllProjectsIcon
  },
  {
    id: "completed",
    label: "Completed",
    value: "22",
    icon: CompletedIcon
  },
  {
    id: "ongoing",
    label: "Ongoing",
    value: "22",
    icon: OngoingIcon
  },
  {
    id: "pending",
    label: "Pending",
    value: "22",
    icon: ProjectPendingIcon
  }
];

export const ProjectsView = ({
  tokens,
  projects = defaultProjects,
  onAddProject,
  onViewDetails,
  onManage
}: ProjectsViewProps) => {
  const iconBaseColor = tokens.isDark ? "#FFFFFF" : "#2B3674";

  return (
    <div className="flex flex-col gap-6">
      {/* Statistics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {projectStats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.id}
              className={`${tokens.cardBase} rounded-2xl p-6`}
            >
              <div className="flex items-start flex-col gap-4">
                <div
                  className="flex items-center justify-center"
                  style={{ color: iconBaseColor }}
                >
                  <Icon className="h-7 w-7 md:h-10 md:w-10" />
                </div>
                <div className="flex flex-col">
                  <span className={`text-2xl font-semibold ${tokens.isDark ? 'text-white' : 'text-black'}`}>{stat.value}</span>
                  <span className="text-sm md:text-base mt-2 text-[#A3AED0]">{stat.label}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add New Project Button */}
      <div className="flex justify-end">
        <button
          type="button"
          onClick={onAddProject}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-full font-medium transition-colors cursor-pointer ${
            tokens.isDark
              ? "bg-[#071FD7] text-white hover:bg-[#071FD7]/90"
              : "bg-[#071FD7] text-white hover:bg-[#071FD7]/90"
          }`}
        >
          <PlusCircleIcon className="h-5 w-5 text-white" />
          <span>Add New Project</span>
        </button>
      </div>

      {/* Projects List */}
      <div className="flex flex-col gap-4">
        {projects.map((project) => (
          <ProjectCard
            key={project.id}
            project={project}
            tokens={tokens}
            onViewDetails={onViewDetails}
            onManage={onManage}
          />
        ))}
      </div>
    </div>
  );
};

