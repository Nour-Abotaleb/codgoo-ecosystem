import { useState } from "react";
import { CalendarIcon, TaskDiscussionIcon, CloseModalIcon } from "@utilities/icons";
import type { DashboardTokens } from "../../types";

type TaskDiscussionsModalProps = {
  readonly tokens: DashboardTokens;
  readonly isOpen: boolean;
  readonly onClose: () => void;
  readonly onJoinDiscussion?: (discussion: DiscussionItem) => void;
};

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

type MemberTag = {
  readonly id: string;
  readonly name: string;
};

// Mock data
const discussions: readonly DiscussionItem[] = [
  {
    id: "1",
    name: "Discussion Name",
    author: "Ahmed Saeed",
    date: "12 Nov 2025",
    time: "10:32 AM",
    team: [
      { id: "1", name: "John Doe" },
      { id: "2", name: "Jane Smith" },
      { id: "3", name: "Bob Wilson" }
    ]
  },
  {
    id: "2",
    name: "Discussion Name",
    author: "Ahmed Saeed",
    date: "12 Nov 2025",
    time: "10:32 AM",
    team: [
      { id: "1", name: "John Doe" },
      { id: "2", name: "Jane Smith" },
      { id: "3", name: "Bob Wilson" }
    ]
  },
  {
    id: "3",
    name: "Discussion Name",
    author: "Ahmed Saeed",
    date: "12 Nov 2025",
    time: "10:32 AM",
    team: [
      { id: "1", name: "John Doe" },
      { id: "2", name: "Jane Smith" },
      { id: "3", name: "Bob Wilson" }
    ]
  }
];


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

export const TaskDiscussionsModal = ({ tokens, isOpen, onClose, onJoinDiscussion }: TaskDiscussionsModalProps) => {
  const [discussionTitle, setDiscussionTitle] = useState("Website Review");
  const [members, setMembers] = useState<MemberTag[]>([
    { id: "1", name: "Ahmed Nasser" },
    { id: "2", name: "Aml Atef" },
    { id: "3", name: "Asmaa Hassan" }
  ]);
  const [memberInput, setMemberInput] = useState("");

  const handleJoinDiscussion = (discussionId: string) => {
    const discussion = discussions.find((d) => d.id === discussionId);
    if (discussion && onJoinDiscussion) {
      onJoinDiscussion(discussion);
      onClose();
    }
  };

  const handleAddMember = () => {
    if (memberInput.trim()) {
      const newMember: MemberTag = {
        id: Date.now().toString(),
        name: memberInput.trim()
      };
      setMembers([...members, newMember]);
      setMemberInput("");
    }
  };

  const handleRemoveMember = (id: string) => {
    setMembers(members.filter((member) => member.id !== id));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50"
        onClick={onClose}
      />

      {/* Modal */}
      <div className={`relative w-full max-w-xl ${tokens.cardBase} ${tokens.isDark ? "bg-[#232637]" : "bg-white"} rounded-2xl max-h-[90vh] overflow-hidden flex flex-col`}>
            {/* Header */}
            <div className={`flex items-center justify-between px-6 pt-6 pb-4 flex-shrink-0 rounded-t-2xl ${
              tokens.isDark ? "bg-[#232637]" : "bg-[#FFFEF7]"
            }`}>
          <div className="flex items-center gap-3">
            <div className={`flex h-9 w-9 items-center justify-center rounded-full ${tokens.isDark ? tokens.buttonGhost : ""}`} style={tokens.isDark ? {} : { backgroundColor: "#E6E9FB" }}>
              <TaskDiscussionIcon className={`h-5 w-5`} style={tokens.isDark ? {} : { color: "#071FD7" }} />
            </div>
            <h2 className={`text-xl md:text-2xl font-semibold ${tokens.isDark ? "text-white" : "text-black"}`}>
              Task Discussions
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center transition-colors"
            aria-label="Close modal"
          >
            <CloseModalIcon className="h-6 w-6 md:h-7 md:w-7" />
          </button>
        </div>

        {/* Discussions List View */}
        <div className="flex-1 overflow-y-auto scrollbar-hide pt-4 px-6 pb-6">
            {/* Discussions List */}
        <div className="flex flex-col gap-4 mb-6">
          {discussions.map((discussion) => (
            <div
              key={discussion.id}
              className={`${tokens.isDark ? "bg-[#1A1D29]" : "bg-[#F4F5FF]"} rounded-xl p-4`}
            >
              <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  {/* Discussion Name */}
                  <h3 className={`text-base md:text-lg font-bold ${tokens.isDark ? "text-white" : "text-black"}`}>
                    {discussion.name}
                  </h3>
                  
                  {/* Team and Join Button */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className={`text-sm ${tokens.isDark ? "text-white/70" : "text-[#718EBF]"}`}>team:</span>
                      <div className="flex -space-x-2">
                        {discussion.team.slice(0, 3).map((member, index) => (
                          <div
                            key={member.id}
                            className="relative h-8 w-8 rounded-full border-2 border-white flex items-center justify-center text-xs font-semibold text-white"
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
                </div>
                {/* Author */}
                <p className={`text-sm ${tokens.isDark ? "text-white/70" : "text-[#68696D]"}`}>
                  By: {discussion.author}
                </p>

                <div className="flex items-center justify-between">
                  {/* Date and Time */}
                  <div className="flex items-center gap-2">
                    <CalendarIcon className={`h-4 w-4 ${tokens.isDark ? "text-blue-400" : "text-[#071FD7]"}`} />
                    <span className={`text-sm ${tokens.isDark ? "text-blue-400" : "text-[#071FD7]"}`}>
                      {discussion.date.split(" ").map((part, index) => {
                        const isMonth = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"].includes(part);
                        return (
                          <span key={index}>
                            {index > 0 && " "}
                            {isMonth ? <span className="text-black">{part}</span> : part}
                          </span>
                        );
                      })}
                      {" "}
                      {discussion.time.split(" ").map((part, index) => {
                        const isAmPm = part === "AM" || part === "PM";
                        return (
                          <span key={index}>
                            {index > 0 && " "}
                            {isAmPm ? <span className="text-black">{part}</span> : part}
                          </span>
                        );
                      })}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleJoinDiscussion(discussion.id)}
                    className={`px-10 py-2 rounded-full text-sm md:text-base font-semibold transition-colors ${
                      tokens.isDark
                        ? "bg-[#071FD7] text-white hover:bg-[#071FD7]/90"
                        : "border border-[#071FD7] text-[#071FD7] hover:bg-[#071FD7] hover:text-white"
                    }`}
                  >
                    Join
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Add Discussion Section */}
        <div className="flex flex-col gap-4">
          <h3 className={`text-lg md:text-xl font-bold ${tokens.isDark ? "text-white" : "text-black"}`}>
            Add Discussion
          </h3>

          {/* Title Input */}
          <div className="relative">
            <label 
              className={`absolute left-4 -top-2.5 px-2 text-sm font-medium z-10 ${
                tokens.isDark 
                  ? "text-white/70 bg-[#232637]" 
                  : "text-black bg-[var(--color-card-bg)]"
              }`}
            >
              Title
            </label>
            <input
              type="text"
              value={discussionTitle}
              onChange={(e) => setDiscussionTitle(e.target.value)}
              className={`w-full px-4 py-2.5 rounded-[16px] border ${
                tokens.isDark
                  ? "bg-[#1A1D29] border-white/20 text-white"
                  : "border-gray-200 text-black"
              } focus:outline-none focus:ring-1 focus:ring-[#071FD7]`}
              placeholder="Enter discussion title"
            />
          </div>

          {/* Members Section */}
          <div className="relative">
            <label 
              className={`absolute left-4 -top-2.5 px-2 text-sm font-medium z-10 ${
                tokens.isDark 
                  ? "text-white/70 bg-[#232637]" 
                  : "text-black bg-[var(--color-card-bg)]"
              }`}
            >
              Members
            </label>
            <div className={`flex flex-wrap gap-2 p-3 min-h-[48px] rounded-[16px] border ${
              tokens.isDark
                ? "bg-[#1A1D29] border-white/20"
                : "border-gray-200 bg-white"
            }`}>
              {members.map((member) => (
                <span
                  key={member.id}
                  onClick={() => handleRemoveMember(member.id)}
                  className={`px-3 py-1.5 rounded-full text-sm font-medium cursor-pointer transition-colors ${
                    tokens.isDark
                      ? "bg-[#2A2D39] text-white border border-white/20 hover:bg-[#3A3D49]"
                      : "bg-black text-white hover:bg-gray-800"
                  }`}
                >
                  {member.name}
                </span>
              ))}
              <input
                type="text"
                value={memberInput}
                onChange={(e) => setMemberInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleAddMember();
                  }
                }}
                className={`flex-1 min-w-[120px] bg-transparent border-none outline-none text-sm ${
                  tokens.isDark ? "text-white placeholder:text-white/50" : "text-[#2B3674] placeholder:text-gray-400"
                }`}
                placeholder="Add member name..."
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col gap-3 mt-4">
            <button
              type="button"
              className={`w-full px-6 py-3 rounded-full text-base font-medium transition-colors ${
                tokens.isDark
                  ? "bg-[#071FD7] text-white hover:bg-[#071FD7]/90"
                  : "bg-[#071FD7] text-white hover:bg-[#071FD7]/90"
              }`}
            >
              Add Discussions
            </button>
            <button
              type="button"
              onClick={onClose}
              className={`w-full px-6 py-2.5 rounded-full text-base font-medium transition-colors ${
                tokens.isDark
                  ? "border border-white/20 text-white hover:bg-white/10"
                  : "border border-[#071FD7] text-[#071FD7] hover:bg-[#071FD7]/10"
              }`}
            >
              Cancel
            </button>
          </div>
        </div>
        </div>
      </div>
    </div>
  );
};

