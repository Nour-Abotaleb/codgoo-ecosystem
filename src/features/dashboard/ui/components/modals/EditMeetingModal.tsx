import { useState, useEffect } from "react";
import { CloseModalIcon, MeetingsIcon, ProductsCalendarIcon, EditIcon } from "@utilities/icons";
import type { DashboardTokens } from "../../types";
import { getModalInputClass } from "../../utils/modalStyles";

type EditMeetingModalProps = {
  readonly tokens: DashboardTokens;
  readonly isOpen: boolean;
  readonly onClose: () => void;
  readonly meeting?: {
    readonly title: string;
    readonly date: string;
    readonly time: string;
    readonly note?: string;
  };
  readonly onSave?: (data: {
    meetingTitle: string;
    newDate: string;
    note: string;
  }) => void;
};

export const EditMeetingModal = ({
  tokens,
  isOpen,
  onClose,
  meeting,
  onSave
}: EditMeetingModalProps) => {
  const [meetingTitle, setMeetingTitle] = useState(meeting?.title || "");
  const [newDate, setNewDate] = useState("");
  const [note, setNote] = useState(meeting?.note || "");

  const handleSave = () => {
    if (meetingTitle.trim() && newDate.trim()) {
      if (onSave) {
        onSave({
          meetingTitle: meetingTitle.trim(),
          newDate: newDate.trim(),
          note: note.trim()
        });
      }
      handleClose();
    }
  };

  const handleClose = () => {
    setMeetingTitle(meeting?.title || "");
    setNewDate("");
    setNote(meeting?.note || "");
    onClose();
  };

  // Update state when meeting prop changes
  useEffect(() => {
    if (meeting) {
      setMeetingTitle(meeting.title);
      setNote(meeting.note || "");
      setNewDate("");
    }
  }, [meeting]);

  const inputClass = getModalInputClass(tokens, { paddingY: "py-3", textColor: "text-[#2B3674]" });
  const previousDateDisplay = meeting ? `${meeting.date} | ${meeting.time}` : "";

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
                  style={tokens.isDark ? {} : { backgroundColor: "#071FD7" }}
                >
                  <MeetingsIcon
                    className={`h-5 w-5`}
                    style={tokens.isDark ? {} : { color: "#FFFFFF" }}
                  />
                </div>
                <h2 className={`text-lg md:text-xl font-semibold ${tokens.isDark ? "text-white" : "text-black"}`}>
                  Edit Meeting
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
                        handleSave();
                      }
                    }}
                  />
                </div>

                {/* Previous Date - Read Only */}
                <div className="relative">
                  <label 
                    className={`absolute left-4 -top-2.5 px-2 text-sm font-medium z-10 ${
                      tokens.isDark 
                        ? "text-white/70 bg-[#232637]" 
                        : "text-black bg-[var(--color-card-bg)]"
                    }`}
                  >
                    Previous Date
                  </label>
                  <div className={`${inputClass} ${tokens.isDark ? "text-white/50" : "text-[#718EBF]"} cursor-not-allowed`}>
                    {previousDateDisplay || "-"}
                  </div>
                </div>

                {/* New Date */}
                <div className="relative">
                  <label 
                    className={`absolute left-4 -top-2.5 px-2 text-sm font-medium z-10 ${
                      tokens.isDark 
                        ? "text-white/70 bg-[#232637]" 
                        : "text-black bg-[var(--color-card-bg)]"
                    }`}
                  >
                    New Date
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={newDate}
                      onChange={(e) => setNewDate(e.target.value)}
                      className={inputClass}
                      placeholder="-"
                    />
                    <div className="absolute right-4 top-1/2 -translate-y-1/2">
                      <ProductsCalendarIcon
                        className={`h-5 w-5 ${tokens.isDark ? "text-white/70" : "text-[#2B3674]"}`}
                      />
                    </div>
                  </div>
                </div>

                {/* Note */}
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
                  <div className="relative">
                    <textarea
                      value={note}
                      onChange={(e) => setNote(e.target.value)}
                      className={`${inputClass} min-h-[120px] resize-none pr-12`}
                      placeholder="The appointment was delayed by half an hour due to a schedule change."
                    />
                    <div className="absolute right-4 top-4">
                      <EditIcon
                        className={`h-5 w-5 ${tokens.isDark ? "text-white/70" : "text-[#2B3674]"}`}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className={`flex flex-col gap-3 mt-6 flex-shrink-0 border-t mx-6 ${tokens.isDark ? "border-white/20" : "border-[#E6E6E6]"} pt-2 pb-6`}>
              <button
                type="button"
                onClick={handleSave}
                className={`w-full px-6 py-3 rounded-full text-base font-medium transition-colors ${
                  tokens.isDark
                    ? "bg-[#4318FF] text-white hover:bg-[#4318FF]/90"
                    : "bg-[#4318FF] text-white hover:bg-[#4318FF]/90"
                }`}
              >
                Send New Request
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
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

