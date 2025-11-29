import { useState, useMemo } from "react";
import { TaskCard, type TaskItem } from "./TaskCard";
import { EyeIcon } from "@utilities/icons";
import { TaskDiscussionsModal } from "../modals/TaskDiscussionsModal";
import { DiscussionDetailScreen } from "./DiscussionDetailScreen";
import screenshotImage from "@assets/images/software/screenshot.svg";
import envelopeImage from "@assets/images/software/envelope.svg";
import type { DashboardTokens } from "../../types";

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
  readonly task: TaskItem;
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

// Mock screens data - in real app this would come from props or API
const mockScreens: readonly ScreenItem[] = [
  { id: "1", name: "Screen Name", image: screenshotImage, status: "completed" },
  { id: "2", name: "Screen Name", image: screenshotImage, status: "completed" },
  { id: "3", name: "Screen Name", image: screenshotImage, status: "completed" },
  { id: "4", name: "Screen Name", image: screenshotImage, status: "completed" },
  { id: "5", name: "Screen Name", image: screenshotImage, status: "in-progress" },
  { id: "6", name: "Screen Name", status: "pending" }, 
  { id: "7", name: "Screen Name", image: screenshotImage, status: "completed" },
  { id: "8", name: "Screen Name", status: "pending" }, 
];

export const TaskDetailView = ({ task, tokens }: TaskDetailViewProps) => {
  const [activeTab, setActiveTab] = useState<ScreenTab>("completed");
  const [isDiscussionsModalOpen, setIsDiscussionsModalOpen] = useState(false);
  const [selectedDiscussion, setSelectedDiscussion] = useState<DiscussionItem | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  const filteredScreens = useMemo(() => {
    if (activeTab === "completed") {
      // Only show screens with status exactly "completed"
      return mockScreens.filter((screen) => screen.status === "completed");
    } else {
      // Remaining tab: show only in-progress and pending screens (explicitly exclude completed)
      return mockScreens.filter((screen) => {
        if (!screen.status) return false; // Exclude screens without status
        if (screen.status === "completed") return false; // Explicitly exclude completed
        return screen.status === "in-progress" || screen.status === "pending";
      });
    }
  }, [activeTab]);

  const customButtons = (
    <div className="flex flex-row gap-3 items-center">
      <button
        type="button"
        onClick={() => setIsDiscussionsModalOpen(true)}
        className={`flex items-center gap-2 px-8 py-2.5 rounded-full text-sm md:text-base font-medium transition-colors cursor-pointer ${
          tokens.isDark
            ? "bg-white/10 text-white/90 hover:bg-white/20"
            : "bg-[#071FD7] text-white hover:bg-[#071FD7]/90 hover:text-white"
        }`}
      >
        <span>Discussions</span>
      </button>
      <button
        type="button"
        className={`flex items-center gap-2 px-6 py-2.5 rounded-full text-sm md:text-base font-medium transition-colors cursor-pointer ${
          tokens.isDark
            ? "border border-white/70 text-white/70 hover:bg-white/10"
            : "border border-[#071FD7] text-[#071FD7] hover:bg-[#071FD7]/90 hover:text-white"
        }`}
      >
        <span>Create Meeting</span>
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
            Screens
          </h2>
          
          {/* Tabs */}
          <div className="flex gap-4 mb-2">
            <button
              type="button"
              onClick={() => setActiveTab("completed")}
              className={`pb-2 px-1 flex items-center gap-2 text-sm md:text-base font-medium transition-colors whitespace-nowrap cursor-pointer ${
                activeTab === "completed"
                  ? tokens.isDark
                    ? "text-white border-b-2 border-white"
                    : "text-[#111111] border-b-2 border-[#071FD7]"
                  : tokens.subtleText
              }`}
            >
              <span>Completed Screens</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("remaining")}
              className={`pb-2 px-1 flex items-center gap-2 text-sm md:text-base font-medium transition-colors whitespace-nowrap cursor-pointer ${
                activeTab === "remaining"
                  ? tokens.isDark
                    ? "text-white border-b-2 border-white"
                    : "text-[#111111] border-b-2 border-[#071FD7]"
                  : tokens.subtleText
              }`}
            >
              <span>Remaining Screens</span>
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
                          In Progress
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
                        Planned
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
        tokens={tokens}
        isOpen={isDiscussionsModalOpen}
        onClose={() => setIsDiscussionsModalOpen(false)}
        onJoinDiscussion={handleJoinDiscussion}
      />

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

