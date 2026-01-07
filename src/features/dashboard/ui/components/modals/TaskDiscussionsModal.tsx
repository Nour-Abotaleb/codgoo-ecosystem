import { useState, useMemo } from "react";
import toast from "react-hot-toast";
import { CalendarIcon, TaskDiscussionIcon, CloseModalIcon } from "@utilities/icons";
import type { DashboardTokens } from "../../types";
import { useGetTaskDiscussionQuery, useGetAllEmployeesQuery, useCreateTaskDiscussionMutation } from "@features/dashboard/api/dashboard-api";

type TaskDiscussionsModalProps = {
  readonly taskId: string;
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
  readonly status: string;
  readonly team: readonly {
    readonly id: string;
    readonly name: string;
    readonly avatar?: string;
  }[];
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

export const TaskDiscussionsModal = ({ taskId, tokens, isOpen, onClose, onJoinDiscussion }: TaskDiscussionsModalProps) => {
  const [discussionTitle, setDiscussionTitle] = useState("Website Review");
  const [selectedMembers, setSelectedMembers] = useState<Set<number>>(new Set());
  const [memberInput, setMemberInput] = useState("");

  // Fetch discussions from API
  const taskIdNum = parseInt(taskId, 10);
  const { data: apiData, refetch } = useGetTaskDiscussionQuery(taskIdNum, {
    skip: !isOpen // Only fetch when modal is open
  });

  // Fetch employees from API
  const { data: employeesData, isLoading: isLoadingEmployees } = useGetAllEmployeesQuery(undefined, {
    skip: !isOpen // Only fetch when modal is open
  });

  // Create discussion mutation
  const [createDiscussion, { isLoading: isCreating }] = useCreateTaskDiscussionMutation();

  // Filter employees based on search input
  const filteredEmployees = useMemo(() => {
    if (!employeesData?.data) return [];
    if (!memberInput.trim()) return employeesData.data;
    
    const searchLower = memberInput.toLowerCase();
    return employeesData.data.filter(emp => 
      emp.name.toLowerCase().includes(searchLower) ||
      emp.email.toLowerCase().includes(searchLower) ||
      emp.role.toLowerCase().includes(searchLower)
    );
  }, [employeesData, memberInput]);

  // Get selected employees details
  const selectedEmployeesDetails = useMemo(() => {
    if (!employeesData?.data) return [];
    return employeesData.data.filter(emp => selectedMembers.has(emp.id));
  }, [employeesData, selectedMembers]);

  // Transform API discussions data
  const discussions = useMemo((): readonly DiscussionItem[] => {
    if (apiData?.discussions) {
      return apiData.discussions.map((disc: any) => {
        // API already provides formatted date like "04 Jan 2026 01:28 PM"
        const createdAt = disc.created_at || "N/A";
        // Split into date and time parts
        const parts = createdAt.split(' ');
        const date = parts.length >= 4 ? `${parts[0]} ${parts[1]} ${parts[2]}` : createdAt;
        const time = parts.length >= 5 ? `${parts[3]} ${parts[4]}` : "";
        
        return {
          id: String(disc.id),
          name: disc.message || "N/A",
          author: disc.created_by?.name || "N/A",
          date: date,
          time: time,
          status: disc.status || "N/A",
          team: disc.team?.map((t: any) => ({
            id: String(t.id),
            name: t.name || "N/A",
            avatar: t.avatar || undefined
          })) || []
        };
      });
    }
    return [];
  }, [apiData]);

  const handleJoinDiscussion = (discussionId: string) => {
    const discussion = discussions.find((d) => d.id === discussionId);
    if (discussion && onJoinDiscussion) {
      onJoinDiscussion(discussion);
      onClose();
    }
  };

  const handleAddMember = (employeeId: number) => {
    setSelectedMembers(prev => {
      const newSet = new Set(prev);
      if (newSet.has(employeeId)) {
        newSet.delete(employeeId);
      } else {
        newSet.add(employeeId);
      }
      return newSet;
    });
  };

  const handleCreateDiscussion = async () => {
    if (!discussionTitle.trim()) {
      toast.error("Please enter a discussion title");
      return;
    }

    if (selectedMembers.size === 0) {
      toast.error("Please select at least one member");
      return;
    }

    try {
      const members = Array.from(selectedMembers).map(id => ({
        id,
        type: "App\\Models\\Employee"
      }));

      await createDiscussion({
        taskId: taskIdNum,
        message: discussionTitle.trim(),
        members
      }).unwrap();

      // Reset form
      setDiscussionTitle("Website Review");
      setSelectedMembers(new Set());
      setMemberInput("");
      
      // Refetch discussions
      refetch();
      
      toast.success("Discussion created successfully!");
    } catch (error: any) {
      console.error("Failed to create discussion:", error);
      toast.error(error?.data?.message || "Failed to create discussion. Please try again.");
    }
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
      <div className={`relative w-full max-w-xl ${tokens.cardBase} ${tokens.isDark ? "bg-[#0F1217]" : "bg-white"} rounded-[20px] max-h-[90vh] overflow-hidden flex flex-col`}>
            {/* Header */}
            <div className={`flex flex-wrap items-center justify-between px-6 pt-6 pb-4 flex-shrink-0 rounded-t-2xl ${
              tokens.isDark ? "bg-[#0F1217]" : "bg-[#FFFEF7]"
            }`}>
          <div className="flex flex-wrap items-center gap-3">
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
          {discussions.length === 0 ? (
            <div className={`${tokens.isDark ? "bg-[#1A1D29]" : "bg-[#F4F5FF]"} rounded-[20px] p-6 text-center`}>
              <p className={`text-sm ${tokens.isDark ? "text-white/70" : "text-[#718EBF]"}`}>
                No discussions found for this task
              </p>
            </div>
          ) : (
            discussions.map((discussion) => (
            <div
              key={discussion.id}
              className={`${tokens.isDark ? "bg-[#1A1D29]" : "bg-[#F4F5FF]"} rounded-[20px] p-4`}
            >
              <div className="flex flex-col gap-2">
                <div className="flex flex-wrap items-center justify-between">
                  {/* Discussion Name and Status */}
                  <div className="flex flex-wrap items-center gap-2 flex-1">
                    <h3 className={`text-base md:text-lg font-bold ${tokens.isDark ? "text-white" : "text-black"}`}>
                      {discussion.name}
                    </h3>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      discussion.status?.toLowerCase() === "open"
                        ? tokens.isDark ? "bg-green-500/10 text-green-400" : "bg-green-100 text-green-700"
                        : tokens.isDark ? "bg-gray-500/10 text-gray-400" : "bg-gray-100 text-gray-700"
                    }`}>
                      {discussion.status}
                    </span>
                  </div>
                  
                  {/* Team */}
                  <div className="flex flex-wrap items-center justify-between">
                    <div className="flex flex-wrap items-center gap-2">
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

                <div className="flex flex-wrap items-center justify-between">
                  {/* Date and Time */}
                  <div className="flex flex-wrap items-center gap-2">
                    <CalendarIcon className={`h-4 w-4 ${tokens.isDark ? "text-blue-400" : "text-[#071FD7]"}`} />
                    <span className={`text-sm ${tokens.isDark ? "text-blue-400" : "text-[#071FD7]"}`}>
                      {discussion.date.split(" ").map((part, index) => {
                        const isMonth = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"].includes(part);
                        return (
                          <span key={index}>
                            {index > 0 && " "}
                            {isMonth ? <span className={`${tokens.isDark ? "text-white" : "text-black"}`}>{part}</span> : part}
                          </span>
                        );
                      })}
                      {" "}
                      {discussion.time.split(" ").map((part, index) => {
                        const isAmPm = part === "AM" || part === "PM";
                        return (
                          <span key={index}>
                            {index > 0 && " "}
                            {isAmPm ? <span className={`${tokens.isDark ? "text-white" : "text-black"}`}>{part}</span> : part}
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
          ))
          )}
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
                  ? "text-white/70 bg-[#0F1217]" 
                  : "text-black bg-white"
              }`}
            >
              Title
            </label>
            <input
              type="text"
              value={discussionTitle}
              onChange={(e) => setDiscussionTitle(e.target.value)}
              className={`w-full px-4 py-2.5 rounded-[20px] border ${
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
                  ? "text-white/70 bg-[#0F1217]" 
                  : "text-black bg-white"
              }`}
            >
              Members
            </label>
            <div className={`flex flex-col gap-2 p-3 min-h-[48px] rounded-[20px] border ${
              tokens.isDark
                ? "bg-[#1A1D29] border-white/20"
                : "border-gray-200 bg-white"
            }`}>
              {/* Selected Members Tags Inside Input */}
              {selectedEmployeesDetails.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {selectedEmployeesDetails.map((employee) => (
                    <span
                      key={employee.id}
                      onClick={() => handleAddMember(employee.id)}
                      className={`px-3 py-1.5 rounded-full text-sm font-medium cursor-pointer transition-colors ${
                        tokens.isDark
                          ? "bg-[#071FD7] text-white border border-[#071FD7] hover:bg-[#071FD7]/90"
                          : "bg-[#071FD7] text-white border border-[#071FD7] hover:bg-[#071FD7]/90"
                      }`}
                    >
                      {employee.name} ×
                    </span>
                  ))}
                </div>
              )}
              
              {/* Search Input */}
              <input
                type="text"
                value={memberInput}
                onChange={(e) => setMemberInput(e.target.value)}
                className={`flex-1 min-w-[120px] bg-transparent border-none outline-none text-sm ${
                  tokens.isDark ? "text-white placeholder:text-white/50" : "text-black placeholder:text-gray-400"
                }`}
                placeholder="Search employees..."
              />
            </div>
            
            {/* All Employees as Selectable Tags Below Input */}
            <div className="flex flex-wrap gap-2 mt-3">
              {isLoadingEmployees ? (
                <span className={`text-sm ${tokens.isDark ? "text-white/70" : "text-black"}`}>
                  Loading employees...
                </span>
              ) : filteredEmployees.length > 0 ? (
                filteredEmployees.map((employee) => (
                  <span
                    key={employee.id}
                    onClick={() => handleAddMember(employee.id)}
                    className={`px-3 py-1.5 rounded-full text-sm font-medium cursor-pointer transition-colors ${
                      selectedMembers.has(employee.id)
                        ? tokens.isDark
                          ? "bg-[#071FD7] text-white border border-[#071FD7]"
                          : "bg-[#071FD7] text-white border border-[#071FD7]"
                        : tokens.isDark
                          ? "bg-[#2A2D39] text-white border border-white/20 hover:bg-[#3A3D49]"
                          : "bg-white text-black border border-gray-300 hover:bg-gray-50"
                    }`}
                  >
                    {employee.name}
                    {selectedMembers.has(employee.id) && " ✓"}
                  </span>
                ))
              ) : (
                <span className={`text-sm ${tokens.isDark ? "text-white/70" : "text-black"}`}>
                  No employees found
                </span>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col gap-3 mt-4">
            <button
              type="button"
              onClick={handleCreateDiscussion}
              disabled={isCreating}
              className={`w-full px-6 py-3 rounded-full text-base font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
                tokens.isDark
                  ? "bg-[#071FD7] text-white hover:bg-[#071FD7]/90"
                  : "bg-[#071FD7] text-white hover:bg-[#071FD7]/90"
              }`}
            >
              {isCreating ? "Creating..." : "Add Discussions"}
            </button>
            <button
              type="button"
              onClick={onClose}
              disabled={isCreating}
              className={`w-full px-6 py-2.5 rounded-full text-base font-medium transition-colors disabled:opacity-50 ${
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
