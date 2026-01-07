import { useState, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { TaskCard, type TaskItem } from "./TaskCard";
import { EyeIcon } from "@utilities/icons";
import { TaskDiscussionsModal } from "../modals/TaskDiscussionsModal";
import { CreateMeetingModal } from "../modals/CreateMeetingModal";
import { DiscussionDetailScreen } from "./DiscussionDetailScreen";
import envelopeImage from "@assets/images/software/envelope.svg";
import type { DashboardTokens } from "../../types";
import { useGetTaskDetailsQuery } from "@features/dashboard/api/dashboard-api";

type DiscussionItem = {
  readonly id: string;
  readonly name: string;
  readonly author: string;
  readonly date: string;
  readonly time: string;
  readonly team: readonly {
    readonly id: string;
    readonly name: string;
    readonly avatar?: string;
  }[];
};

type TaskDetailViewProps = {
  readonly taskId: string;
  readonly tokens: DashboardTokens;
  readonly onBack?: () => void;
};

type ScreenItem = {
  readonly id: string;
  readonly name: string;
  readonly image?: string;
  readonly status?: "completed" | "in-progress" | "pending";
};

type ScreenTab = "completed" | "remaining";

export const TaskDetailView = ({ taskId, tokens }: TaskDetailViewProps) => {
  const { t } = useTranslation("landing");
  const [activeTab, setActiveTab] = useState<ScreenTab>("completed");
  const [isDiscussionsModalOpen, setIsDiscussionsModalOpen] = useState(false);
  const [isCreateMeetingModalOpen, setIsCreateMeetingModalOpen] = useState(false);
  const [selectedDiscussion, setSelectedDiscussion] = useState<DiscussionItem | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  // Fetch task details from API
  const taskIdNum = parseInt(taskId, 10);
  const { data: apiData, isLoading, refetch } = useGetTaskDetailsQuery(taskIdNum);

  // Map API status to component status
  const mapTaskStatus = (status: string): "Completed" | "In Progress" | "Not Started" | "Waiting Feedback" => {
    const statusLower = status.toLowerCase();
    if (statusLower === "completed") return "Completed";
    if (statusLower === "in_progress" || statusLower === "in progress") return "In Progress";
    if (statusLower === "not_started" || statusLower === "not started") return "Not Started";
    return "Waiting Feedback";
  };

  // Transform API data to TaskItem
  const task = useMemo((): TaskItem | null => {
    if (apiData?.data?.task) {
      const taskData = apiData.data.task;
      return {
        id: String(taskData.id),
        code: taskData.id,
        name: taskData.label || "N/A",
        description: taskData.description || "N/A",
        priority: (taskData.priority === "High" || taskData.priority === "Medium" || taskData.priority === "Low") 
          ? taskData.priority 
          : "Medium",
        startDate: taskData.start_date || "N/A",
        deadline: taskData.due_date || "N/A",
        createdDate: "N/A", // Not in API
        dueDate: taskData.due_date || "N/A",
        assignedTo: apiData.data.team?.map((t: any) => t.name).join(", ") || "N/A",
        team: apiData.data.team?.map((t: any) => ({
          id: String(t.id),
          name: t.name || "N/A",
          avatar: t.image || undefined
        })) || [],
        progress: {
          completed: taskData.progress || 0,
          total: 100,
          percentage: taskData.progress || 0
        },
        status: mapTaskStatus(taskData.status || "not_started")
      };
    }
    return null;
  }, [apiData]);

  // Transform API screens data
  const screens = useMemo((): readonly ScreenItem[] => {
    if (apiData?.data?.screens) {
      const completed = apiData.data.screens.completed?.map((screen: any) => ({
        id: String(screen.id),
        name: screen.name || screen.screen_code || "N/A",
        image: screen.image || undefined,
        status: "completed" as const
      })) || [];

      const remaining = apiData.data.screens.remaining?.map((screen: any) => ({
        id: String(screen.id),
        name: screen.name || screen.screen_code || "N/A",
        image: screen.image || undefined,
        status: screen.implemented ? "in-progress" as const : "pending" as const
      })) || [];

      return [...completed, ...remaining];
    }
    return [];
  }, [apiData]);

  const filteredScreens = useMemo(() => {
    if (activeTab === "completed") {
      return screens.filter((screen) => screen.status === "completed");
    } else {
      return screens.filter((screen) => 
        screen.status === "in-progress" || screen.status === "pending"
      );
    }
  }, [activeTab, screens]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <p className={tokens.isDark ? "text-white/50" : "text-[#A3AED0]"}>{t("dashboard.task.loadingTaskDetails")}</p>
      </div>
    );
  }

  if (!task) {
    return (
      <div className="flex items-center justify-center py-12">
        <p className={tokens.isDark ? "text-white/50" : "text-[#A3AED0]"}>{t("dashboard.task.taskNotFound")}</p>
      </div>
    );
  }

  const customButtons = (
    <div className="flex flex-row gap-3 items-center">
      <button
        type="button"
        onClick={() => setIsDiscussionsModalOpen(true)}
        className={`flex flex-wrap items-center gap-2 px-8 py-2.5 rounded-full text-sm md:text-base font-medium transition-colors cursor-pointer ${
          tokens.isDark
            ? "bg-white/10 text-white/90 hover:bg-white/20"
            : "bg-[#071FD7] text-white hover:bg-[#071FD7]/90 hover:text-white"
        }`}
      >
        <span>{t("dashboard.task.discussions")}</span>
      </button>
      <button
        type="button"
        onClick={() => setIsCreateMeetingModalOpen(true)}
        className={`flex flex-wrap items-center gap-2 px-6 py-2.5 rounded-full text-sm md:text-base font-medium transition-colors cursor-pointer ${
          tokens.isDark
            ? "border border-white/70 text-white/70 hover:bg-white/10"
            : "border border-[#071FD7] text-[#071FD7] hover:bg-[#071FD7]/90 hover:text-white"
        }`}
      >
        <span>{t("dashboard.task.createMeeting")}</span>
      </button>
    </div>
  );

  const handleJoinDiscussion = (discussion: DiscussionItem) => {
    setSelectedDiscussion(discussion);
  };

  // Show full-screen discussion view if a discussion is selected
  if (selectedDiscussion) {
    return (
      <DiscussionDetailScreen
        discussion={selectedDiscussion}
        tokens={tokens}
        onBack={() => setSelectedDiscussion(null)}
      />
    );
  }

  return (
    <>
      <div className="flex flex-col gap-6">
        {/* Task Card with dates and buttons */}
        <TaskCard task={task} tokens={tokens} showViewButton={false} customButtons={customButtons} />

      {/* Screens Section */}
      <div className="flex flex-col gap-4 mt-4">
        <div className="flex flex-col items-start justify-between gap-4">
            <h2 className={`text-lg md:text-xl font-semibold ${tokens.isDark ? "text-white" : "text-[#2B3674]"}`}>
            {t("dashboard.task.screens")}
          </h2>
          
          {/* Tabs */}
          <div className="flex gap-4 mb-2">
            <button
              type="button"
              onClick={() => setActiveTab("completed")}
              className={`pb-2 px-1 flex flex-wrap items-center gap-2 text-sm md:text-base font-medium transition-colors whitespace-nowrap cursor-pointer ${
                activeTab === "completed"
                  ? tokens.isDark
                    ? "text-white border-b-2 border-white"
                    : "text-[#111111] border-b-2 border-[#071FD7]"
                  : tokens.subtleText
              }`}
            >
              <span>{t("dashboard.task.completedScreens")}</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("remaining")}
              className={`pb-2 px-1 flex flex-wrap items-center gap-2 text-sm md:text-base font-medium transition-colors whitespace-nowrap cursor-pointer ${
                activeTab === "remaining"
                  ? tokens.isDark
                    ? "text-white border-b-2 border-white"
                    : "text-[#111111] border-b-2 border-[#071FD7]"
                  : tokens.subtleText
              }`}
            >
              <span>{t("dashboard.task.remainingScreens")}</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredScreens.map((screen) => (
            <div
              key={screen.id}
              className={`${tokens.cardBase} rounded-lg overflow-hidden group cursor-pointer transition-transform ${tokens.isDark ? "" : "!bg-[#F4F5FF]"} p-4`}
            >
              {/* Screen Image */}
              <div 
                className={`relative ${tokens.isDark ? "bg-[#1A1D29]" : "bg-[#E9ECFF]"} overflow-hidden rounded-lg group/image ${
                  screen.status === "completed" && screen.image ? "cursor-pointer" : ""
                }`}
                onClick={() => {
                  if (screen.status === "completed" && screen.image) {
                    setPreviewImage(screen.image);
                  }
                }}
              >
                {screen.image ? (
                  <>
                    <img
                      src={screen.image}
                      alt={screen.name}
                      className="w-full object-cover"
                    />
                    {/* In Progress Badge */}
                    {screen.status === "in-progress" && (
                      <div className="absolute top-2 right-2 z-20">
                        <span className={`px-4 py-2 rounded-full text-sm font-regular ${
                          tokens.isDark
                            ? "bg-blue-500/20 text-blue-400"
                            : "bg-[#CCD3FF] text-[#071FD7]"
                        }`}>
                          {t("dashboard.status.inProgress")}
                        </span>
                      </div>
                    )}
                  </>
                ) : (
                  <>
                    {/* Envelope Image for Pending Screens */}
                    <div className="w-full min-h-[260px] flex flex-col gap-4 items-center justify-center p-4">
                      <img
                        src={envelopeImage}
                        alt="Envelope placeholder"
                        className="object-contain opacity-50"
                      />
                      <img
                        src={envelopeImage}
                        alt="Envelope placeholder"
                        className="object-contain opacity-50"
                      />
                    </div>
                    {/* Planned Badge for Pending Screens */}
                    <div className="absolute top-2 right-2">
                      <span className={`px-4 py-2 rounded-full text-sm font-regular ${
                        tokens.isDark
                          ? "bg-yellow-500/20 text-yellow-400"
                          : "bg-[#FFF6D5] text-[#B48D00]"
                      }`}>
                        {t("dashboard.task.planned")}
                      </span>
                    </div>
                  </>
                )}
                {/* Overlay - Only for completed screens with hover, static for in-progress */}
                {screen.status === "completed" && screen.image ? (
                  <div 
                    className="absolute inset-0 bg-black/25 opacity-0 group-hover/image:opacity-100 transition-opacity duration-300 flex items-center justify-center pointer-events-none"
                  >
                    <EyeIcon className="h-8 w-8 text-white" />
                  </div>
                ) : screen.status === "in-progress" && screen.image ? (
                  <div className="absolute inset-0 bg-black/25 flex items-center justify-center z-0">
                  </div>
                ) : null}
              </div>
              {/* Screen Name */}
              <div className="pt-4 pb-2">
                <h3 className={`text-sm md:text-base lg:text-lg font-semibold ${tokens.isDark ? "text-white" : "text-black"}`}>
                  {screen.name}
                </h3>
              </div>
            </div>
          ))}
        </div>
      </div>
      </div>

      {/* Task Discussions Modal */}
      <TaskDiscussionsModal
        taskId={taskId}
        tokens={tokens}
        isOpen={isDiscussionsModalOpen}
        onClose={() => setIsDiscussionsModalOpen(false)}
        onJoinDiscussion={handleJoinDiscussion}
      />

      {/* Create Meeting Modal */}
      {apiData?.data?.task && apiData?.data?.project && (
        <CreateMeetingModal
          tokens={tokens}
          isOpen={isCreateMeetingModalOpen}
          onClose={() => setIsCreateMeetingModalOpen(false)}
          projectId={apiData.data.project.id}
          taskId={taskIdNum}
          onMeetingCreated={() => {
            refetch();
          }}
        />
      )}

      {/* Image Preview Modal */}
      {previewImage && (
        <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/75"
            onClick={() => setPreviewImage(null)}
          />

          {/* Modal */}
          <div className="relative max-w-5xl max-h-[90vh] flex items-center justify-center">
            <button
              type="button"
              onClick={() => setPreviewImage(null)}
              className={`absolute -top-10 -right-10 z-10 flex items-center justify-center w-8 h-8 rounded-full transition-colors ${
                tokens.isDark
                  ? "bg-white/90 text-black"
                  : "bg-white/90 text-gray-800"
              }`}
            >
              <span className="text-2xl leading-none">×</span>
            </button>
            <img
              src={previewImage}
              alt="Preview"
              className="max-w-full max-h-[90vh] object-contain rounded-lg"
            />
          </div>
        </div>
      )}
    </>
  );
};
