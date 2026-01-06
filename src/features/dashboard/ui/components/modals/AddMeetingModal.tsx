import { useState, useEffect, useRef } from "react";
import toast from "react-hot-toast";
import { CloseModalIcon, PlusCircleIcon } from "@utilities/icons";
import type { DashboardTokens } from "../../types";
import { useGetAvailableSlotsQuery, useGetClientProjectsQuery, useCreateMeetingMutation, useGetProjectOverviewQuery } from "@features/dashboard/api/dashboard-api";
import { getModalInputClass } from "../../utils/modalStyles";

type AvailableSlot = {
  readonly slot_id: number;
  readonly date: string;
  readonly start_time: string;
  readonly end_time: string;
  readonly status: boolean;
};

type Project = {
  readonly id: number;
  readonly name: string;
  readonly tasks: {
    readonly completed: number;
    readonly total: number;
    readonly percentage: number;
  };
};

type AddMeetingModalProps = {
  readonly tokens: DashboardTokens;
  readonly isOpen: boolean;
  readonly onClose: () => void;
  readonly showProjectAndNote?: boolean;
  readonly onAddMeeting?: (data: {
    startDate: string;
    time: string;
    meetingTitle: string;
    projectName?: string;
    note?: string;
    slotId?: number;
  }) => void;
};

export const AddMeetingModal = ({
  tokens,
  isOpen,
  onClose,
  showProjectAndNote = true,
  onAddMeeting
}: AddMeetingModalProps) => {
  const [selectedProjectId, setSelectedProjectId] = useState<number | null>(null);
  const { data: slotsData } = useGetAvailableSlotsQuery();
  const { data: projectsData } = useGetClientProjectsQuery();
  const { data: projectOverviewData } = useGetProjectOverviewQuery(selectedProjectId || 0, { skip: !selectedProjectId });
  const [createMeeting] = useCreateMeetingMutation();
  const [startDate, setStartDate] = useState("17 Sep 2024");
  const [time, setTime] = useState("10.00 AM - 10.30 AM");
  const [meetingTitle, setMeetingTitle] = useState("Website Review");
  const [projectName, setProjectName] = useState("Website Review");
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);
  const [selectedTaskName, setSelectedTaskName] = useState<string>("");
  const [note, setNote] = useState("Note");
  const [description, setDescription] = useState("");
  const [isProjectOpen, setIsProjectOpen] = useState(false);
  const [isTaskOpen, setIsTaskOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<AvailableSlot | null>(null);
  const [filteredSlots, setFilteredSlots] = useState<AvailableSlot[]>([]);
  const [uniqueDates, setUniqueDates] = useState<string[]>([]);
  const projectRef = useRef<HTMLDivElement>(null);
  const taskRef = useRef<HTMLDivElement>(null);

  const projects: Project[] = projectsData?.data?.projects || [];

  // Extract unique dates and update filtered slots when date changes
  useEffect(() => {
    if (slotsData?.data) {
      const slots = slotsData.data as AvailableSlot[];
      
      // Get unique dates sorted
      const dates = Array.from(new Set(slots.map(slot => slot.date))).sort();
      setUniqueDates(dates);
      
      // If a date is selected, filter slots for that date
      if (selectedDate) {
        const filtered = slots.filter(slot => slot.date === selectedDate);
        setFilteredSlots(filtered);
      }
    }
  }, [slotsData, selectedDate]);

  // Update form when slot is selected
  useEffect(() => {
    if (selectedSlot) {
      const dateObj = new Date(selectedSlot.date);
      const formattedDate = dateObj.toLocaleDateString("en-US", { 
        day: "2-digit", 
        month: "short", 
        year: "numeric" 
      });
      setStartDate(formattedDate);
      setTime(`${selectedSlot.start_time} - ${selectedSlot.end_time}`);
    }
  }, [selectedSlot]);

  // Show all slots and dates (swiper displays 3 at a time)

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (projectRef.current && !projectRef.current.contains(event.target as Node)) {
        setIsProjectOpen(false);
      }
      if (taskRef.current && !taskRef.current.contains(event.target as Node)) {
        setIsTaskOpen(false);
      }
    };

    if (isProjectOpen || isTaskOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isProjectOpen, isTaskOpen]);

  const handleDateSelect = (date: string) => {
    setSelectedDate(date);
    setSelectedSlot(null); // Reset slot selection when date changes
  };

  const handleSlotSelect = (slot: AvailableSlot) => {
    setSelectedSlot(slot);
  };

  const handleProjectSelect = (project: Project) => {
    setSelectedProjectId(project.id);
    setProjectName(project.name);
    setIsProjectOpen(false);
    setSelectedTaskId(null);
    setSelectedTaskName("");
  };

  const handleTaskSelect = (taskId: string, taskName: string) => {
    setSelectedTaskId(taskId);
    setSelectedTaskName(taskName);
    setIsTaskOpen(false);
  };

  const handleAddMeeting = () => {
    if (!selectedSlot) {
      toast.error("Please select a date and time slot");
      return;
    }
    
    if (!meetingTitle.trim()) {
      toast.error("Please enter a meeting title");
      return;
    }
    
    if (!selectedProjectId) {
      toast.error("Please select a project");
      return;
    }
    
    if (!selectedTaskId) {
      toast.error("Please select a task");
      return;
    }

    try {
      // Ensure time format is H:i (e.g., "14:30")
      const formatTime = (timeStr: string): string => {
        // If already in H:i format, return as is
        if (/^\d{1,2}:\d{2}$/.test(timeStr)) {
          return timeStr;
        }
        // If in HH:MM:SS format, extract HH:MM
        if (/^\d{2}:\d{2}:\d{2}$/.test(timeStr)) {
          return timeStr.substring(0, 5);
        }
        return timeStr;
      };
      
      createMeeting({
        slot_id: selectedSlot.slot_id,
        task_id: selectedTaskId,
        meeting_name: meetingTitle.trim(),
        description: description.trim(),
        start_time: formatTime(selectedSlot.start_time),
        end_time: formatTime(selectedSlot.end_time),
        project_id: selectedProjectId
      }).unwrap().then(() => {
        toast.success("Meeting created successfully!");
        if (onAddMeeting) {
          onAddMeeting({
            startDate: startDate.trim(),
            time: time.trim(),
            meetingTitle: meetingTitle.trim(),
            projectName: projectName.trim(),
            note: description.trim(),
            slotId: selectedSlot.slot_id
          });
        }
        handleClose();
      }).catch((error: any) => {
        console.error("Error creating meeting:", error);
        toast.error(error?.data?.message || "Failed to create meeting. Please try again.");
      });
    } catch (error: any) {
      console.error("Error creating meeting:", error);
      toast.error(error?.data?.message || "Failed to create meeting. Please try again.");
    }
  };

  const handleClose = () => {
    setStartDate("17 Sep 2024");
    setTime("10.00 AM - 10.30 AM");
    setMeetingTitle("Website Review");
    setProjectName("Website Review");
    setSelectedProjectId(null);
    setSelectedTaskId(null);
    setSelectedTaskName("");
    setNote("Note");
    setDescription("");
    setIsProjectOpen(false);
    setIsTaskOpen(false);
    setSelectedSlot(null);
    onClose();
  };

  const inputClass = getModalInputClass(tokens, { paddingY: "py-3", textColor: "text-[#2B3674]" });

  return (
    <>
      {isOpen && (
        <div className="fixed inset-0 z-[10001] flex items-center justify-center p-4">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/50"
            onClick={handleClose}
          />

          {/* Modal */}
          <div className={`relative w-full max-w-xl ${tokens.cardBase} ${tokens.isDark ? "bg-[#0F1217]" : "bg-white"} rounded-[20px] max-h-[90vh] overflow-hidden flex flex-col`}>
            {/* Header */}
            <div className={`flex items-center justify-between px-6 pt-6 pb-4 flex-shrink-0 rounded-t-2xl ${
              tokens.isDark ? "bg-[#0F1217]" : "bg-[#FFFEF7]"
            }`}>
              <div className="flex items-center gap-3">
                <div
                  className={`flex h-9 w-9 items-center justify-center rounded-full ${
                    tokens.isDark ? tokens.buttonGhost : ""
                  }`}
                  style={tokens.isDark ? {} : { backgroundColor: "#E6E9FB" }}
                >
                  <div
                    className={tokens.isDark ? "" : "[&_path]:fill-[#071FD7]"}
                  >
                    <PlusCircleIcon
                      className={`h-5 w-5`}
                      style={tokens.isDark ? {} : { color: "#071FD7" }}
                    />
                  </div>
                </div>
                <h2 className={`text-lg md:text-xl font-semibold ${tokens.isDark ? "text-white" : "text-black"}`}>
                  Add New Meeting
                </h2>
              </div>
              <button
                type="button"
                onClick={handleClose}
                className="flex h-8 w-8 items-center justify-center transition-colors"
              >
                <CloseModalIcon className="h-6 w-6 md:h-7 md:w-7" />
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto scrollbar-hide pt-4 px-6">
              <div className="flex flex-col gap-6">
                {/* Available Dates - Swiper */}
                {uniqueDates.length > 0 && (
                  <div className="relative -mx-6">
                    <label className={`text-sm font-medium mb-3 block px-6 ${
                      tokens.isDark ? "text-white/70" : "text-black"
                    }`}>
                      Select Date
                    </label>
                    <div className="overflow-x-auto scrollbar-hide px-6">
                      <div className="flex gap-3 pb-2">
                        {uniqueDates.map((date) => {
                          const dateObj = new Date(date);
                          const dayName = dateObj.toLocaleDateString("en-US", { weekday: "short" });
                          const dayNum = dateObj.getDate();
                          return (
                            <button
                              key={date}
                              type="button"
                              onClick={() => handleDateSelect(date)}
                              className={`flex-shrink-0 px-4 py-3 rounded-[15px] text-center min-w-[calc(33.333%-8px)] transition-all ${
                                selectedDate === date
                                  ? tokens.isDark
                                    ? "bg-[#4318FF] text-white"
                                    : "bg-[#4318FF] text-white"
                                  : tokens.isDark
                                  ? "bg-[#2E3141] text-white/70 hover:bg-[#2E3141]/80"
                                  : "bg-[#F0F0F0] text-[#2B3674] hover:bg-[#E0E0E0]"
                              }`}
                            >
                              <div className="text-xs font-medium">{dayName}</div>
                              <div className="text-sm font-bold">{dayNum}</div>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                )}

                {/* Available Slots for Selected Date - Swiper */}
                {selectedDate && filteredSlots.length > 0 && (
                  <div className="relative -mx-6">
                    <label className={`text-sm font-medium mb-3 block px-6 ${
                      tokens.isDark ? "text-white/70" : "text-black"
                    }`}>
                      Available Times
                    </label>
                    <div className="overflow-x-auto scrollbar-hide px-6">
                      <div className="flex gap-3 pb-2">
                        {filteredSlots.map((slot, idx) => (
                          <button
                            key={`${slot.slot_id}-${idx}`}
                            type="button"
                            onClick={() => handleSlotSelect(slot)}
                            className={`flex-shrink-0 px-4 py-3 rounded-[15px] text-center min-w-[calc(33.333%-8px)] transition-all ${
                              selectedSlot?.slot_id === slot.slot_id && selectedSlot?.date === slot.date && selectedSlot?.start_time === slot.start_time
                                ? tokens.isDark
                                  ? "bg-[#4318FF] text-white"
                                  : "bg-[#4318FF] text-white"
                                : tokens.isDark
                                ? "bg-[#2E3141] text-white/70 hover:bg-[#2E3141]/80"
                                : "bg-[#F0F0F0] text-[#2B3674] hover:bg-[#E0E0E0]"
                            }`}
                          >
                            <div className="text-xs font-medium">
                              {slot.start_time.substring(0, 5)}
                            </div>
                            <div className="text-xs">
                              {slot.end_time.substring(0, 5)}
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {selectedDate && filteredSlots.length === 0 && (
                  <div className={`text-center py-4 text-sm ${
                    tokens.isDark ? "text-white/50" : "text-[#2B3674]/50"
                  }`}>
                    No slots available for this date
                  </div>
                )}

                {/* Meeting Title */}
                <div className="relative">
                  <label 
                    className={`absolute left-4 -top-2.5 px-2 text-sm font-medium z-10 ${
                      tokens.isDark 
                        ? "text-white/70 bg-[#0F1217]" 
                        : "text-black bg-white"
                    }`}
                  >
                    Meeting Title
                  </label>
                  <input
                    type="text"
                    value={meetingTitle}
                    onChange={(e) => setMeetingTitle(e.target.value)}
                    className={inputClass}
                    placeholder="Website Review"
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        handleAddMeeting();
                      }
                    }}
                  />
                </div>

                {/* Description */}
                <div className="relative">
                  <label 
                    className={`absolute left-4 -top-2.5 px-2 text-sm font-medium z-10 ${
                      tokens.isDark 
                        ? "text-white/70 bg-[#0F1217]" 
                        : "text-black bg-white"
                    }`}
                  >
                    Description
                  </label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className={`${inputClass} min-h-[100px] resize-none`}
                    placeholder="Enter meeting description"
                  />
                </div>

                {/* Project name - Only show if showProjectAndNote is true */}
                {showProjectAndNote && (
                  <div className="relative">
                    <label 
                      className={`absolute left-4 -top-2.5 px-2 text-sm font-medium z-10 ${
                        tokens.isDark 
                          ? "text-white/70 bg-[#0F1217]" 
                          : "text-black bg-white"
                      }`}
                    >
                      Project
                    </label>
                    <div className="relative" ref={projectRef}>
                      <button
                        type="button"
                        onClick={() => setIsProjectOpen(!isProjectOpen)}
                        className={`${inputClass} pe-12 text-left flex items-center justify-between ${
                          !projectName ? "text-black" : ""
                        }`}
                      >
                        <span>{projectName || "Select Project"}</span>
                        <svg
                          className={`h-5 w-5 transition-transform ${isProjectOpen ? "rotate-180" : ""}`}
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </button>
                      {isProjectOpen && (
                        <div className={`absolute z-20 w-full mt-1 rounded-[20px] border max-h-[200px] overflow-y-auto ${
                          tokens.isDark
                            ? "border-white/20"
                            : "bg-white border-[#E6E6E6]"
                        }`}>
                          {projects.map((project) => (
                            <button
                              key={project.id}
                              type="button"
                              onClick={() => handleProjectSelect(project)}
                              className={`w-full px-4 py-3 text-left text-sm hover:bg-opacity-10 ${
                                tokens.isDark
                                  ? "text-white hover:bg-white"
                                  : "text-[#2B3674] hover:bg-[#071FD7]/10"
                              } ${project.id === selectedProjectId ? tokens.isDark ? "bg-white/10" : "bg-[#071FD7]/10" : ""}`}
                            >
                              {project.name}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Task name - Only show if project is selected */}
                {showProjectAndNote && selectedProjectId && (
                  <div className="relative">
                    <label 
                      className={`absolute left-4 -top-2.5 px-2 text-sm font-medium z-10 ${
                        tokens.isDark 
                          ? "text-white/70 bg-[#0F1217]" 
                          : "text-black bg-white"
                      }`}
                    >
                      Task
                    </label>
                    <div className="relative" ref={taskRef}>
                      <button
                        type="button"
                        onClick={() => setIsTaskOpen(!isTaskOpen)}
                        className={`${inputClass} pe-12 text-left flex items-center justify-between ${
                          !selectedTaskName ? "text-black" : ""
                        }`}
                      >
                        <span>{selectedTaskName || "Select Task"}</span>
                        <svg
                          className={`h-5 w-5 transition-transform ${isTaskOpen ? "rotate-180" : ""}`}
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </button>
                      {isTaskOpen && (
                        <div className={`absolute z-20 w-full mt-1 rounded-[20px] border max-h-[200px] overflow-y-auto ${
                          tokens.isDark
                            ? "border-white/20"
                            : "bg-white border-[#E6E6E6]"
                        }`}>
                          {(() => {
                            const allTasks: Array<{ id: number; title: string }> = [];
                            projectOverviewData?.data?.project?.milestones?.forEach(milestone => {
                              milestone.tasks?.forEach(task => {
                                allTasks.push({ id: task.id, title: task.title });
                              });
                            });
                            return allTasks.map((task) => (
                              <button
                                key={task.id}
                                type="button"
                                onClick={() => handleTaskSelect(String(task.id), task.title)}
                                className={`w-full px-4 py-3 text-left text-sm hover:bg-opacity-10 ${
                                  tokens.isDark
                                    ? "text-white hover:bg-white"
                                    : "text-[#2B3674] hover:bg-[#071FD7]/10"
                                } ${selectedTaskId === String(task.id) ? tokens.isDark ? "bg-white/10" : "bg-[#071FD7]/10" : ""}`}
                              >
                                {task.title}
                              </button>
                            ));
                          })()}
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Note - Only show if showProjectAndNote is true */}
                {showProjectAndNote && (
                  <div className="relative">
                    <label 
                      className={`absolute left-4 -top-2.5 px-2 text-sm font-medium z-10 ${
                        tokens.isDark 
                          ? "text-white/70 bg-[#0F1217]" 
                          : "text-black bg-white"
                      }`}
                    >
                      Note
                    </label>
                    <textarea
                      value={note}
                      onChange={(e) => setNote(e.target.value)}
                      className={`${inputClass} min-h-[120px] resize-none`}
                      placeholder="Note"
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Action Buttons */}
            <div className={`flex flex-col gap-3 mt-6 flex-shrink-0 border-t mx-6 ${tokens.isDark ? "border-white/20" : "border-[#E6E6E6]"} pt-2 pb-6`}>
              <button
                type="button"
                onClick={handleAddMeeting}
                className={`w-full px-6 py-3 rounded-full text-base font-medium transition-colors ${
                  tokens.isDark
                    ? "bg-[#4318FF] text-white hover:bg-[#4318FF]/90"
                    : "bg-[#4318FF] text-white hover:bg-[#4318FF]/90"
                }`}
              >
                Add Meeting
              </button>
              <button
                type="button"
                onClick={handleClose}
                className={`w-full px-6 py-2.5 rounded-full text-base font-medium transition-colors ${
                  tokens.isDark
                    ? "border border-white/20 text-white hover:bg-white/10 bg-transparent"
                    : "border border-[#071FD7] text-[#071FD7] hover:bg-[#071FD7]/10 bg-white"
                }`}
              >
                Back
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

