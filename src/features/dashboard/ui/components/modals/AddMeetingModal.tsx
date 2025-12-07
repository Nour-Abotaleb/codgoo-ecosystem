import { useState, useEffect, useRef } from "react";
import { CloseModalIcon, PlusCircleIcon, ProductsCalendarIcon, MeetingClockIcon } from "@utilities/icons";
import type { DashboardTokens } from "../../types";
import { getModalInputClass } from "../../utils/modalStyles";

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
  }) => void;
};

export const AddMeetingModal = ({
  tokens,
  isOpen,
  onClose,
  showProjectAndNote = true,
  onAddMeeting
}: AddMeetingModalProps) => {
  const [startDate, setStartDate] = useState("17 Sep 2024");
  const [time, setTime] = useState("10.00 AM - 10.30 AM");
  const [meetingTitle, setMeetingTitle] = useState("Website Review");
  const [projectName, setProjectName] = useState("Website Review");
  const [note, setNote] = useState("Note");
  const [isProjectOpen, setIsProjectOpen] = useState(false);
  const projectRef = useRef<HTMLDivElement>(null);

  const projectOptions = ["Website Review", "Marketly E-Commerce App", "CodeFlow Admin Portal", "FixMate Mobile App", "GreenScape Landing Page"];

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (projectRef.current && !projectRef.current.contains(event.target as Node)) {
        setIsProjectOpen(false);
      }
    };

    if (isProjectOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isProjectOpen]);

  const handleAddMeeting = () => {
    if (startDate.trim() && time.trim() && meetingTitle.trim()) {
      if (onAddMeeting) {
        const meetingData: {
          startDate: string;
          time: string;
          meetingTitle: string;
          projectName?: string;
          note?: string;
        } = {
          startDate: startDate.trim(),
          time: time.trim(),
          meetingTitle: meetingTitle.trim()
        };
        
        if (showProjectAndNote) {
          meetingData.projectName = projectName.trim();
          meetingData.note = note.trim();
        }
        
        onAddMeeting(meetingData);
      }
      handleClose();
    }
  };

  const handleClose = () => {
    setStartDate("17 Sep 2024");
    setTime("10.00 AM - 10.30 AM");
    setMeetingTitle("Website Review");
    setProjectName("Website Review");
    setNote("Note");
    setIsProjectOpen(false);
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
          <div className={`relative w-full max-w-xl ${tokens.cardBase} ${tokens.isDark ? "bg-[#232637]" : "bg-white"} rounded-2xl max-h-[90vh] overflow-hidden flex flex-col`}>
            {/* Header */}
            <div className={`flex items-center justify-between px-6 pt-6 pb-4 flex-shrink-0 rounded-t-2xl ${
              tokens.isDark ? "bg-[#232637]" : "bg-[#FFFEF7]"
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
                {/* Start Date and Time - Side by Side */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Start Date */}
                  <div className="relative">
                    <label 
                      className={`absolute left-4 -top-2.5 px-2 text-sm font-medium z-10 ${
                        tokens.isDark 
                          ? "text-white/70 bg-[#232637]" 
                          : "text-black bg-[var(--color-card-bg)]"
                      }`}
                    >
                      Start Date
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                        className={inputClass}
                        placeholder="17 Sep 2024"
                      />
                      <div className="absolute right-4 top-1/2 -translate-y-1/2">
                        <ProductsCalendarIcon
                          className={`h-5 w-5 ${tokens.isDark ? "text-white/70" : "text-[#6B6B6B]"}`}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Time */}
                  <div className="relative">
                    <label 
                      className={`absolute left-4 -top-2.5 px-2 text-sm font-medium z-10 ${
                        tokens.isDark 
                          ? "text-white/70 bg-[#232637]" 
                          : "text-black bg-[var(--color-card-bg)]"
                      }`}
                    >
                      time
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        value={time}
                        onChange={(e) => setTime(e.target.value)}
                        className={inputClass}
                        placeholder="10.00 AM - 10.30 AM"
                      />
                      <div className="absolute right-4 top-1/2 -translate-y-1/2">
                        <MeetingClockIcon
                          className={`h-5 w-5 ${tokens.isDark ? "text-white/70" : "text-[#6B6B6B]"}`}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Meeting Title */}
                <div className="relative">
                  <label 
                    className={`absolute left-4 -top-2.5 px-2 text-sm font-medium z-10 ${
                      tokens.isDark 
                        ? "text-white/70 bg-[#232637]" 
                        : "text-black bg-[var(--color-card-bg)]"
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

                {/* Project name - Only show if showProjectAndNote is true */}
                {showProjectAndNote && (
                  <div className="relative">
                    <label 
                      className={`absolute left-4 -top-2.5 px-2 text-sm font-medium z-10 ${
                        tokens.isDark 
                          ? "text-white/70 bg-[#232637]" 
                          : "text-black bg-[var(--color-card-bg)]"
                      }`}
                    >
                      Project name
                    </label>
                    <div className="relative" ref={projectRef}>
                      <button
                        type="button"
                        onClick={() => setIsProjectOpen(!isProjectOpen)}
                        className={`${inputClass} pe-12 text-left flex items-center justify-between ${
                          !projectName ? "text-black" : ""
                        }`}
                      >
                        <span>{projectName || "Project name"}</span>
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
                        <div className={`absolute z-20 w-full mt-1 rounded-[16px] border ${
                          tokens.isDark
                            ? "bg-[#232637] border-white/20"
                            : "bg-white border-[#E6E6E6]"
                        }`}>
                          {projectOptions.map((project) => (
                            <button
                              key={project}
                              type="button"
                              onClick={() => {
                                setProjectName(project);
                                setIsProjectOpen(false);
                              }}
                              className={`w-full px-4 py-3 text-left text-sm hover:bg-opacity-10 ${
                                tokens.isDark
                                  ? "text-white hover:bg-white"
                                  : "text-[#2B3674] hover:bg-[#071FD7]/10"
                              } ${project === projectName ? tokens.isDark ? "bg-white/10" : "bg-[#071FD7]/10" : ""}`}
                            >
                              {project}
                            </button>
                          ))}
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
                          ? "text-white/70 bg-[#232637]" 
                          : "text-black bg-[var(--color-card-bg)]"
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

