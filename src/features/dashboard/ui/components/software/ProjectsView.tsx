import { useState, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { PlusCircleIcon, AllProjecs, projectsCompleted, ProjectsOngoing,  ProjectsPending } from "@utilities/icons";
import type { DashboardTokens } from "../../types";
import { ProjectCard, type ProjectCardData } from "./ProjectCard";
import { AddNewProjectModal } from "../modals/AddNewProjectModal";
import { useGetClientProjectsQuery } from "@features/dashboard/api/dashboard-api";

type ProjectsViewProps = {
  readonly tokens: DashboardTokens;
  readonly onAddProject?: () => void;
  readonly onViewDetails?: (projectId: string, projectData: ProjectCardData) => void;
  readonly onManage?: (projectId: string) => void;
};

export const ProjectsView = ({
  tokens,
  onViewDetails,
  onManage
}: ProjectsViewProps) => {
  const { t } = useTranslation("landing");
  const iconBaseColor = tokens.isDark ? "#FFFFFF" : "#2B3674";
  const [isAddNewProjectModalOpen, setIsAddNewProjectModalOpen] = useState(false);
  
  // Fetch projects from API
  const { data: apiData, isLoading } = useGetClientProjectsQuery();

  // Transform API data to component format with N/A fallbacks
  const projects = useMemo(() => {
    if (apiData?.data?.projects) {
      return apiData.data.projects.map((project: any): ProjectCardData => {
        return {
          id: String(project.id),
          name: project.name || "N/A",
          description: project.description || "N/A",
          status: project.status || "pending",
          team: project.team?.map((member: any) => ({
            id: String(member.id),
            name: member.name || "N/A",
            avatar: member.avatar || undefined
          })) || [],
          startDate: project.start_date || "N/A",
          deadline: project.deadline || "N/A",
          budget: project.budget ? `${project.budget} EGP` : "N/A",
          tasks: {
            completed: project.tasks?.completed || 0,
            total: project.tasks?.total || 0
          },
          type: project.type || "N/A",
          lastUpdate: project.last_update || "N/A"
        };
      });
    }
    return [];
  }, [apiData]);

  // Get status cards from API
  const statusCards = useMemo(() => {
    if (apiData?.data?.status_cards) {
      return [
        {
          id: "all",
          label: t("dashboard.overview.allProjects"),
          value: String(apiData.data.status_cards.all || 0),
          icon: AllProjecs
        },
        {
          id: "completed",
          label: t("dashboard.overview.completed"),
          value: String(apiData.data.status_cards.completed || 0),
          icon: projectsCompleted
        },
        {
          id: "ongoing",
          label: t("dashboard.overview.ongoing"),
          value: String(apiData.data.status_cards.ongoing || 0),
          icon: ProjectsOngoing
        },
        {
          id: "pending",
          label: t("dashboard.overview.pending"),
          value: String(apiData.data.status_cards.pending || 0),
          icon: ProjectsPending
        }
      ];
    }
    return [
      { id: "all", label: t("dashboard.overview.allProjects"), value: "0", icon: AllProjecs },
      { id: "completed", label: t("dashboard.overview.completed"), value: "0", icon: projectsCompleted },
      { id: "ongoing", label: t("dashboard.overview.ongoing"), value: "0", icon: ProjectsOngoing },
      { id: "pending", label: t("dashboard.overview.pending"), value: "0", icon: ProjectsPending }
    ];
  }, [apiData, t]);

  return (
    <>
      <div className="flex flex-col gap-6">
      {/* Statistics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statusCards.map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.id}
              className={`${tokens.cardBase} rounded-[20px] p-6`}
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
          onClick={() => setIsAddNewProjectModalOpen(true)}
          className={`flex flex-wrap items-center gap-2 px-4 py-2.5 rounded-full font-medium transition-colors cursor-pointer ${
            tokens.isDark
              ? "bg-[#071FD7] text-white hover:bg-[#071FD7]/90"
              : "bg-[#071FD7] text-white hover:bg-[#071FD7]/90"
          }`}
        >
          <PlusCircleIcon className="h-5 w-5 text-white" />
          <span>{t("dashboard.overview.addProject", { defaultValue: "Add New Project" })}</span>
        </button>
      </div>

      {/* Projects List */}
      {isLoading ? (
        <div className="text-center py-12">
          <p className={tokens.isDark ? "text-white/50" : "text-[#A3AED0]"}>Loading projects...</p>
        </div>
      ) : projects.length > 0 ? (
        <div className="flex flex-col gap-4">
          {projects.map((project) => (
            <ProjectCard
              key={project.id}
              project={project}
              tokens={tokens}
              onViewDetails={(projectId) => {
                // Pass project data via navigation state
                if (onViewDetails) {
                  onViewDetails(projectId, project);
                }
              }}
              onManage={onManage}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className={tokens.isDark ? "text-white/50" : "text-[#A3AED0]"}>No projects found</p>
        </div>
      )}
    </div>

    {/* Add New Project Modal */}
    <AddNewProjectModal
      tokens={tokens}
      isOpen={isAddNewProjectModalOpen}
      onClose={() => setIsAddNewProjectModalOpen(false)}
    />
    </>
  );
};

