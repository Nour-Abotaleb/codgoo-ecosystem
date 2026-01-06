import { useState, useMemo, useRef, useEffect } from "react";
import { DocstIcon, EmojiIcon } from "@utilities/icons";
import type { DashboardTokens } from "../../types";
import { useGetDiscussionMessagesQuery, useSendDiscussionMessageMutation } from "@features/dashboard/api/dashboard-api";
import toast from "react-hot-toast";

type DiscussionDetailScreenProps = {
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
  readonly onBack?: () => void;
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

export const DiscussionDetailScreen = ({ discussion, tokens, onBack }: DiscussionDetailScreenProps) => {
  const [messageText, setMessageText] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Fetch messages from API
  const discussionIdNum = parseInt(discussion.id, 10);
  const { data: apiData, isLoading, refetch } = useGetDiscussionMessagesQuery(discussionIdNum);

  // Send message mutation
  const [sendMessage, { isLoading: isSending }] = useSendDiscussionMessageMutation();

  // Get current user ID from localStorage (assuming it's stored there)
  const currentUserId = localStorage.getItem("user_id") || "148";

  // Transform API messages data
  const chatMessages = useMemo((): readonly ChatMessage[] => {
    if (apiData?.data?.messages) {
      return apiData.data.messages.map((msg: any) => {
        const createdAt = new Date(msg.created_at);
        const time = createdAt.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
        const isOutgoing = String(msg.sender_id) === currentUserId;
        
        return {
          id: String(msg.id),
          author: msg.sender?.name || "N/A",
          authorAvatar: msg.sender?.image || msg.sender?.photo || undefined,
          content: msg.message || "N/A",
          time: time,
          isOutgoing: isOutgoing,
          hasFile: msg.type === "file" && !!msg.file_path,
          fileName: msg.file_path ? msg.file_path.split('/').pop() : undefined
        };
      });
    }
    return [];
  }, [apiData, currentUserId]);

  // Scroll to bottom when messages change
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chatMessages]);

  const handleSendMessage = async () => {
    if (messageText.trim()) {
      try {
        await sendMessage({
          discussionId: discussionIdNum,
          type: "text",
          message: messageText.trim()
        }).unwrap();
        
        toast.success("Message sent successfully!");
        setMessageText("");
        // Refetch messages to show the new message
        refetch();
      } catch (error: any) {
        toast.error(error?.data?.message || "Failed to send message");
      }
    }
  };

  if (isLoading) {
    return (
      <div className={`flex items-center justify-center h-screen ${tokens.cardBase} rounded-[20px]`}>
        <p className={tokens.isDark ? "text-white/50" : "text-[#A3AED0]"}>Loading messages...</p>
      </div>
    );
  }

  return (
    <div className={`flex flex-col h-screen ${tokens.cardBase} rounded-[20px] overflow-hidden`}>
      {/* Header */}
      <div className={`flex items-center justify-between px-6 py-4 border-b ${tokens.isDark ? "border-white/10" : "border-[#E9E9E9]"} flex-shrink-0`}>
        <div className="flex items-center gap-4">
          {onBack && (
            <button
              type="button"
              onClick={onBack}
              className={`flex items-center justify-center w-8 h-8 rounded-full transition-colors ${
                tokens.isDark
                  ? "text-white hover:bg-white/10"
                  : "text-[#2B3674] hover:bg-gray-100"
              }`}
              aria-label="Go back"
            >
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M15 18L9 12L15 6"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          )}
          <div className="flex flex-col gap-1">
            <h3 className={`text-xl md:text-2xl font-bold ${tokens.isDark ? "text-white" : "text-black"}`}>
              {discussion.name}
            </h3>
            <p className={`text-sm ${tokens.isDark ? "text-white/70" : "text-black"}`}>
              Team Communication
            </p>
          </div>
        </div>
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

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto scrollbar-hide px-6 py-4 space-y-4 min-h-0">
        {chatMessages.map((message) => (
          <div
            key={message.id}
            className={`flex flex-col gap-1 ${message.isOutgoing ? "items-end" : "items-start"}`}
          >
            {!message.isOutgoing && (
              <span className={`text-xs ps-14 ${tokens.isDark ? "text-white/50" : "text-black"}`}>
                {message.author}
              </span>
            )}
            <div className={`flex gap-3 ${message.isOutgoing ? "justify-end" : "justify-start"} w-full`}>
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
                </div>
              )}
              <div className={`flex flex-col gap-1 ${message.isOutgoing ? "items-end" : "items-start"} max-w-[70%]`}>
                <div
                className={`rounded-tl-2xl rounded-tr-2xl rounded-br-2xl px-4 py-4 ${
                  message.isOutgoing
                    ? tokens.isDark
                      ? "bg-[#071FD7] text-white"
                      : "bg-[#071FD7] text-white"
                    : tokens.isDark
                    ? "bg-[#1A1D29] text-white"
                    : "bg-[#F4F5FF] text-black"
                }`}
              >
                {message.hasFile ? (
                  <div className="flex items-center gap-1">
                    <DocstIcon className={`h-5 w-5 ${tokens.isDark ? "text-white" : "text-black"}`} />
                    <span className="text-sm">{message.fileName}</span>
                  </div>
                ) : (
                  <p className="text-sm">{message.content}</p>
                )}
              </div>
              <div className="flex items-start gap-1">
                <span className={`text-xs font-medium ${tokens.isDark ? "text-white/50" : "text-[#718EBF]"}`}>
                  {message.time}
                </span>
                {message.isOutgoing && (
                 <svg width="27" height="14" viewBox="0 0 27 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M2.926 13.616C2.926 13.4947 2.90267 13.434 2.856 13.434L2.534 13.588C2.534 13.5227 2.49667 13.476 2.422 13.448L2.31 13.434C2.23533 13.434 2.142 13.4667 2.03 13.532C2.01133 13.4853 1.988 13.4387 1.96 13.392C1.932 13.3453 1.90867 13.3033 1.89 13.266C1.76867 13.0327 1.64733 12.776 1.526 12.496C1.414 12.2067 1.30667 11.9313 1.204 11.67C1.11067 11.4087 1.036 11.2033 0.98 11.054C0.942667 10.9327 0.900667 10.7507 0.854 10.508C0.807333 10.2653 0.760667 9.95733 0.714 9.584C0.816667 9.64933 0.896 9.682 0.952 9.682C1.01733 9.682 1.078 9.584 1.134 9.388C1.162 9.42533 1.21333 9.444 1.288 9.444C1.344 9.444 1.386 9.42533 1.414 9.388L1.638 9.052L1.89 9.136H1.904C1.92267 9.136 1.94133 9.12667 1.96 9.108C1.97867 9.08933 2.00667 9.07067 2.044 9.052C2.11867 9.00533 2.17467 8.982 2.212 8.982L2.254 8.996C2.48733 9.108 2.63667 9.31333 2.702 9.612C2.87 10.3213 3.038 10.676 3.206 10.676C3.374 10.676 3.57 10.4987 3.794 10.144C3.906 9.96667 4.018 9.76133 4.13 9.528C4.25133 9.29467 4.37267 9.03333 4.494 8.744C4.51267 8.856 4.53133 8.912 4.55 8.912C4.59667 8.912 4.676 8.79533 4.788 8.562C4.90933 8.32867 5.10067 8.00667 5.362 7.596C5.51133 7.344 5.698 7.05933 5.922 6.742C6.15533 6.42467 6.40267 6.098 6.664 5.762C6.92533 5.426 7.17733 5.10867 7.42 4.81C7.672 4.51133 7.896 4.25467 8.092 4.04C8.288 3.82533 8.43267 3.68533 8.526 3.62C8.88067 3.37733 9.16067 3.144 9.366 2.92C9.35667 2.98533 9.34267 3.046 9.324 3.102C9.31467 3.14867 9.31 3.18133 9.31 3.2C9.31 3.23733 9.32867 3.256 9.366 3.256L9.758 3.06V3.116C9.758 3.19067 9.77667 3.228 9.814 3.228C9.842 3.228 9.898 3.186 9.982 3.102C10.066 3.018 10.1127 2.95733 10.122 2.92L10.094 3.116L10.57 2.836L10.458 3.088C10.6073 2.98533 10.7147 2.934 10.78 2.934C10.8173 2.934 10.8453 2.95733 10.864 3.004C10.8827 3.04133 10.892 3.07867 10.892 3.116C10.892 3.172 10.8687 3.23733 10.822 3.312C10.7753 3.38667 10.7147 3.47533 10.64 3.578C10.584 3.65267 10.4907 3.76467 10.36 3.914C10.2387 4.054 10.052 4.264 9.8 4.544C9.548 4.81467 9.212 5.19267 8.792 5.678C8.68 5.79933 8.50733 6.014 8.274 6.322C8.04067 6.62067 7.77467 6.97067 7.476 7.372C7.18667 7.764 6.89733 8.16067 6.608 8.562C6.31867 8.96333 6.062 9.32733 5.838 9.654C5.614 9.97133 5.45533 10.2093 5.362 10.368L4.494 11.838C4.30733 12.1553 4.15333 12.4167 4.032 12.622C3.91067 12.818 3.81733 12.9533 3.752 13.028C3.612 13.196 3.458 13.3453 3.29 13.476L3.164 13.406L3.052 13.476L2.926 13.616ZM14.5334 13.616C14.5334 13.4947 14.5101 13.434 14.4634 13.434L14.1414 13.588C14.1414 13.5227 14.1041 13.476 14.0294 13.448L13.9174 13.434C13.8428 13.434 13.7494 13.4667 13.6374 13.532C13.6188 13.4853 13.5954 13.4387 13.5674 13.392C13.5394 13.3453 13.5161 13.3033 13.4974 13.266C13.3761 13.0327 13.2548 12.776 13.1334 12.496C13.0214 12.2067 12.9141 11.9313 12.8114 11.67C12.7181 11.4087 12.6434 11.2033 12.5874 11.054C12.5501 10.9327 12.5081 10.7507 12.4614 10.508C12.4148 10.2653 12.3681 9.95733 12.3214 9.584C12.4241 9.64933 12.5034 9.682 12.5594 9.682C12.6248 9.682 12.6854 9.584 12.7414 9.388C12.7694 9.42533 12.8208 9.444 12.8954 9.444C12.9514 9.444 12.9934 9.42533 13.0214 9.388L13.2454 9.052L13.4974 9.136H13.5114C13.5301 9.136 13.5488 9.12667 13.5674 9.108C13.5861 9.08933 13.6141 9.07067 13.6514 9.052C13.7261 9.00533 13.7821 8.982 13.8194 8.982L13.8614 8.996C14.0948 9.108 14.2441 9.31333 14.3094 9.612C14.4774 10.3213 14.6454 10.676 14.8134 10.676C14.9814 10.676 15.1774 10.4987 15.4014 10.144C15.5134 9.96667 15.6254 9.76133 15.7374 9.528C15.8588 9.29467 15.9801 9.03333 16.1014 8.744C16.1201 8.856 16.1388 8.912 16.1574 8.912C16.2041 8.912 16.2834 8.79533 16.3954 8.562C16.5168 8.32867 16.7081 8.00667 16.9694 7.596C17.1188 7.344 17.3054 7.05933 17.5294 6.742C17.7628 6.42467 18.0101 6.098 18.2714 5.762C18.5328 5.426 18.7848 5.10867 19.0274 4.81C19.2794 4.51133 19.5034 4.25467 19.6994 4.04C19.8954 3.82533 20.0401 3.68533 20.1334 3.62C20.4881 3.37733 20.7681 3.144 20.9734 2.92C20.9641 2.98533 20.9501 3.046 20.9314 3.102C20.9221 3.14867 20.9174 3.18133 20.9174 3.2C20.9174 3.23733 20.9361 3.256 20.9734 3.256L21.3654 3.06V3.116C21.3654 3.19067 21.3841 3.228 21.4214 3.228C21.4494 3.228 21.5054 3.186 21.5894 3.102C21.6734 3.018 21.7201 2.95733 21.7294 2.92L21.7014 3.116L22.1774 2.836L22.0654 3.088C22.2148 2.98533 22.3221 2.934 22.3874 2.934C22.4248 2.934 22.4528 2.95733 22.4714 3.004C22.4901 3.04133 22.4994 3.07867 22.4994 3.116C22.4994 3.172 22.4761 3.23733 22.4294 3.312C22.3828 3.38667 22.3221 3.47533 22.2474 3.578C22.1914 3.65267 22.0981 3.76467 21.9674 3.914C21.8461 4.054 21.6594 4.264 21.4074 4.544C21.1554 4.81467 20.8194 5.19267 20.3994 5.678C20.2874 5.79933 20.1148 6.014 19.8814 6.322C19.6481 6.62067 19.3821 6.97067 19.0834 7.372C18.7941 7.764 18.5048 8.16067 18.2154 8.562C17.9261 8.96333 17.6694 9.32733 17.4454 9.654C17.2214 9.97133 17.0628 10.2093 16.9694 10.368L16.1014 11.838C15.9148 12.1553 15.7608 12.4167 15.6394 12.622C15.5181 12.818 15.4248 12.9533 15.3594 13.028C15.2194 13.196 15.0654 13.3453 14.8974 13.476L14.7714 13.406L14.6594 13.476L14.5334 13.616Z" fill="#718EBF"/>
                 </svg>                 
                )}
              </div>
              </div>
            </div>
          </div>
        ))}
        {/* Scroll anchor */}
        <div ref={messagesEndRef} />
      </div>

      {/* Message Input */}
      <div className={`flex-shrink-0 px-6 py-4 border-t ${tokens.isDark ? "border-white/10" : "border-[#E9E9E9]"}`}>
        <div
          className={`flex flex-col gap-3 px-4 py-3 rounded-[20px] border ${
            tokens.isDark
              ? "bg-[#1A1D29] border-white/20"
              : "bg-white border-[#E9E9E9]"
          }`}
        >
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
            className={`w-full bg-transparent border-none outline-none text-sm ${
              tokens.isDark ? "text-white placeholder-white/50" : "text-[#2B3674] placeholder-[#68696D]"
            }`}
          />
          <div className="flex items-center gap-1">
            <button
              type="button"
              className={`p-1.5 rounded transition-colors ${
                tokens.isDark
                  ? "text-white/70 hover:text-white hover:bg-white/10"
                  : "text-[#718EBF] bg-[#FFFCE5]"
              }`}
            >
              <DocstIcon className={`h-5 w-5 ${tokens.isDark ? "text-white" : "text-black"}`} />
            </button>
            <button
              type="button"
              className={`p-1.5 rounded transition-colors ${
                tokens.isDark
                  ? "text-white/70 hover:text-white hover:bg-white/10"
                  : "text-black hover:text-[#2B3674] hover:bg-gray-100"
              }`}
            >
              <EmojiIcon className="h-6 w-6" />
            </button>
            <button
              type="button"
              onClick={handleSendMessage}
              disabled={isSending || !messageText.trim()}
              className={`ml-auto px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                tokens.isDark
                  ? "bg-[#071FD7] text-white hover:bg-[#071FD7]/90 disabled:opacity-50 disabled:cursor-not-allowed"
                  : "bg-[#071FD7] text-white hover:bg-[#071FD7]/90 disabled:opacity-50 disabled:cursor-not-allowed"
              }`}
            >
              <div className="flex items-center gap-1.5">
                <span>{isSending ? "Sending..." : "Send"}</span>
                {!isSending && <SendIcon className="h-4 w-4" />}
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

