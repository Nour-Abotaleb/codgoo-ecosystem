import { useState } from "react";
import { AttachmentsIcon } from "@utilities/icons";
import type { DashboardTokens } from "../../types";

type DiscussionDetailViewProps = {
  readonly discussion: {
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
  readonly tokens: DashboardTokens;
  readonly onBack: () => void;
};

type ChatMessage = {
  readonly id: string;
  readonly author: string;
  readonly authorAvatar?: string;
  readonly content: string;
  readonly time: string;
  readonly isOutgoing: boolean;
  readonly hasFile?: boolean;
  readonly fileName?: string;
};

// Mock chat messages
const chatMessages: readonly ChatMessage[] = [
  {
    id: "1",
    author: "Ahmed Nasser",
    content: "Hey team, I just pushed the latest updates to the staging environment.",
    time: "9:24 AM",
    isOutgoing: false
  },
  {
    id: "2",
    author: "Aml Atef",
    content: "API_Documentation_v2.pdf",
    time: "9:28 AM",
    isOutgoing: false,
    hasFile: true,
    fileName: "API_Documentation_v2.pdf"
  },
  {
    id: "3",
    author: "Aml Atef",
    content: "Don't forget about the sprint planning meeting at 2 PM today.",
    time: "9:28 AM",
    isOutgoing: false
  },
  {
    id: "4",
    author: "You",
    content: "Great! I'll start testing the new features right away",
    time: "9:24 AM",
    isOutgoing: true
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

// Emoji icon component
const EmojiIcon = (props: { className?: string }) => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 20 20"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={props.className}
  >
    <path
      d="M10 18.3333C14.6024 18.3333 18.3333 14.6024 18.3333 9.99999C18.3333 5.39762 14.6024 1.66666 10 1.66666C5.39763 1.66666 1.66667 5.39762 1.66667 9.99999C1.66667 14.6024 5.39763 18.3333 10 18.3333Z"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M6.66667 7.5C6.66667 7.5 7.29167 8.33333 10 8.33333C12.7083 8.33333 13.3333 7.5 13.3333 7.5"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M7.5 12.5C7.5 12.5 8.33333 13.3333 10 13.3333C11.6667 13.3333 12.5 12.5 12.5 12.5"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

// Send icon component (paper plane)
const SendIcon = (props: { className?: string }) => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 20 20"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={props.className}
  >
    <path
      d="M18.3333 1.66666L9.16667 10.8333"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M18.3333 1.66666L12.5 18.3333L9.16667 10.8333L1.66667 7.49999L18.3333 1.66666Z"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export const DiscussionDetailView = ({ discussion, tokens }: DiscussionDetailViewProps) => {
  const [messageText, setMessageText] = useState("");

  const handleSendMessage = () => {
    if (messageText.trim()) {
      // Handle send message logic here
      setMessageText("");
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Discussion Header */}
      <div className="flex items-center justify-between mb-6 flex-shrink-0">
        <div className="flex flex-col gap-1">
          <h3 className={`text-2xl md:text-3xl font-bold ${tokens.isDark ? "text-white" : "text-black"}`}>
            {discussion.name}
          </h3>
          <p className={`text-sm ${tokens.isDark ? "text-white/70" : "text-[#718EBF]"}`}>
            Team Communication
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className={`text-sm ${tokens.isDark ? "text-white/70" : "text-[#718EBF]"}`}>team:</span>
          <div className="flex -space-x-2">
            {discussion.team.slice(0, 3).map((member, index) => (
              <div
                key={member.id}
                className="relative h-10 w-10 rounded-full border-2 border-white flex items-center justify-center text-xs font-semibold text-white"
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

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto scrollbar-hide mb-4 space-y-4">
        {chatMessages.map((message) => (
          <div
            key={message.id}
            className={`flex gap-3 ${message.isOutgoing ? "justify-end" : "justify-start"}`}
          >
            {!message.isOutgoing && (
              <div className="flex flex-col items-start gap-1 flex-shrink-0">
                <div
                  className="h-10 w-10 rounded-full flex items-center justify-center text-xs font-semibold text-white"
                  style={{ backgroundColor: getAvatarColor(0, tokens.isDark) }}
                >
                  {message.authorAvatar ? (
                    <img
                      src={message.authorAvatar}
                      alt={message.author}
                      className="h-full w-full rounded-full object-cover"
                    />
                  ) : (
                    <span>{getInitials(message.author)}</span>
                  )}
                </div>
                <span className={`text-xs ${tokens.isDark ? "text-white/50" : "text-[#718EBF]"}`}>
                  {message.author}
                </span>
              </div>
            )}
            <div className={`flex flex-col gap-1 ${message.isOutgoing ? "items-end" : "items-start"} max-w-[70%]`}>
              <div
                className={`rounded-[20px] px-4 py-2.5 ${
                  message.isOutgoing
                    ? tokens.isDark
                      ? "bg-[#071FD7] text-white"
                      : "bg-[#071FD7] text-white"
                    : tokens.isDark
                    ? "bg-[#1A1D29] text-white"
                    : "bg-gray-100 text-[#2B3674]"
                }`}
              >
                {message.hasFile ? (
                  <div className="flex items-center gap-2">
                    <AttachmentsIcon className="h-4 w-4" />
                    <span className="text-sm">{message.fileName}</span>
                  </div>
                ) : (
                  <p className="text-sm">{message.content}</p>
                )}
              </div>
              <div className="flex items-center gap-1">
                <span className={`text-xs ${tokens.isDark ? "text-white/50" : "text-[#718EBF]"}`}>
                  {message.time}
                </span>
                {message.isOutgoing && (
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 16 16"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M2 8L6 12L14 4"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M2 8L6 12L14 4"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      opacity="0.5"
                      transform="translate(0, 1)"
                    />
                  </svg>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Message Input */}
      <div className="flex-shrink-0">
        <div
          className={`flex items-center gap-2 px-4 py-3 rounded-[20px] border ${
            tokens.isDark
              ? "bg-[#1A1D29] border-white/20"
              : "bg-white border-gray-200"
          }`}
        >
          <button
            type="button"
            className={`p-1.5 rounded-full transition-colors ${
              tokens.isDark
                ? "text-white/70 hover:text-white hover:bg-white/10"
                : "text-[#718EBF] hover:text-[#2B3674] hover:bg-gray-100"
            }`}
          >
            <AttachmentsIcon className="h-5 w-5" />
          </button>
          <button
            type="button"
            className={`p-1.5 rounded-full transition-colors ${
              tokens.isDark
                ? "text-white/70 hover:text-white hover:bg-white/10"
                : "text-[#718EBF] hover:text-[#2B3674] hover:bg-gray-100"
            }`}
          >
            <EmojiIcon className="h-5 w-5" />
          </button>
          <input
            type="text"
            value={messageText}
            onChange={(e) => setMessageText(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === "Enter") {
                handleSendMessage();
              }
            }}
            placeholder="Type a message"
            className={`flex-1 bg-transparent border-none outline-none text-sm ${
              tokens.isDark ? "text-white placeholder-white/50" : "text-[#2B3674] placeholder-[#718EBF]"
            }`}
          />
          <button
            type="button"
            onClick={handleSendMessage}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              tokens.isDark
                ? "bg-[#071FD7] text-white hover:bg-[#071FD7]/90"
                : "bg-[#071FD7] text-white hover:bg-[#071FD7]/90"
            }`}
          >
            <div className="flex items-center gap-1.5">
              <span>Send</span>
              <SendIcon className="h-4 w-4" />
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};

