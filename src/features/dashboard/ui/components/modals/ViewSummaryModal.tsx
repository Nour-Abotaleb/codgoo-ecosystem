import { CloseModalIcon, DocumentIcon } from "@utilities/icons";
import type { DashboardTokens } from "../../types";

type ViewSummaryModalProps = {
  readonly tokens: DashboardTokens;
  readonly isOpen: boolean;
  readonly onClose: () => void;
  readonly meeting?: {
    readonly title: string;
    readonly project: string;
    readonly date: string;
    readonly time: string;
    readonly duration?: string;
    readonly platform?: string;
    readonly attendees?: readonly {
      readonly id: string;
      readonly name: string;
      readonly avatar?: string;
    }[];
    readonly notes?: readonly string[];
    readonly actionLog?: readonly {
      readonly date: string;
      readonly action: string;
      readonly by?: string;
    }[];
  };
  readonly onAddMeeting?: () => void;
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

export const ViewSummaryModal = ({
  tokens,
  isOpen,
  onClose,
  meeting,
  onAddMeeting
}: ViewSummaryModalProps) => {
  if (!isOpen) return null;

  const defaultAttendees = meeting?.attendees || [
    { id: "1", name: "Aml Atef" },
    { id: "2", name: "Ahmed Nasser" },
    { id: "3", name: "Assmaa Hassan" },
  ];

  const defaultNotes = meeting?.notes || [
    "The project was discussed at 65% completion.",
    "The client requested a UI modification for the dashboard screen.",
    "It was agreed that a new version would be sent within 5 days."
  ];

  const defaultActionLog = meeting?.actionLog || [
    { date: "8 Nov", action: "Meeting created" },
    { date: "10 Nov", action: "Meeting marked as Completed" },
    { date: "10 Nov", action: "Summary added", by: "Aml Atef" }
  ];

  return (
    <div className="fixed inset-0 z-[10004] flex items-center justify-center p-4">
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
            <div
              className={`flex h-9 w-9 items-center justify-center rounded-full ${
                tokens.isDark ? tokens.buttonGhost : ""
              }`}
              style={tokens.isDark ? {} : { backgroundColor: "#F4F7FE" }}
            >
              <DocumentIcon
                className={`h-5 w-5`}
                style={tokens.isDark ? {} : { color: "#071FD7" }}
              />
            </div>
            <h2 className={`text-lg md:text-xl font-semibold ${tokens.isDark ? "text-white" : "text-black"}`}>
              View Summary
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

        {/* Content */}
        <div className="flex-1 overflow-y-auto scrollbar-hide pt-3 px-6">
          <div className="flex flex-col gap-6 pb-4">
            {/* Meeting Summary Section */}
            <div className={`flex flex-col gap-4 py-4 px-2 rounded-[20px] ${tokens.isDark ? "" : "bg-[#F4F5FF]"}`}>
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <h3 className={`text-lg font-bold ${tokens.isDark ? "text-white" : "text-black"}`}>
                    {meeting?.title || "Final prototype review"}
                    <span className={`font-normal text-base ${tokens.isDark ? "text-white/70" : "text-[#718EBF]"}`}>
                      {" "}({meeting?.project || "Marketly E-Commerce App"})
                    </span>
                  </h3>
                </div>
                <span className="inline-flex items-center justify-center px-3 py-1.5 rounded-full text-sm font-medium bg-[#E2FFE9] text-[#34C759]">
                  Completed
                </span>
              </div>

              {/* Meeting Details */}
              <div className="flex flex-col gap-2">
                <div className="flex flex-wrap items-center gap-2">
                  <span className={`text-sm ${tokens.isDark ? "text-white/70" : "text-[#718EBF]"}`}>
                    Date:{" "}
                  </span>
                  <span className={`text-sm font-medium ${tokens.isDark ? "text-white" : "text-black"}`}>
                    {meeting?.date || "5 Nov 2025"}
                  </span>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <span className={`text-sm ${tokens.isDark ? "text-white/70" : "text-[#718EBF]"}`}>
                    Time:{" "}
                  </span>
                  <span className={`text-sm font-medium ${tokens.isDark ? "text-white" : "text-black"}`}>
                    {meeting?.time || "02:00 PM – 03:00 PM"}
                  </span>
                </div>
                {meeting?.duration && (
                  <div className="flex flex-wrap items-center gap-2">
                    <span className={`text-sm ${tokens.isDark ? "text-white/70" : "text-[#718EBF]"}`}>
                      Duration:{" "}
                    </span>
                    <span className={`text-sm font-medium ${tokens.isDark ? "text-white" : "text-black"}`}>
                      {meeting.duration}
                    </span>
                  </div>
                )}
                {meeting?.platform && (
                  <div className="flex flex-wrap items-center gap-2">
                    <span className={`text-sm ${tokens.isDark ? "text-white/70" : "text-[#718EBF]"}`}>
                      Meeting Platform:{" "}
                    </span>
                    <span className={`text-sm font-medium ${tokens.isDark ? "text-white" : "text-black"}`}>
                      {meeting.platform}
                    </span>
                  </div>
                )}

                {/* Attendees */}
                <div className="flex items-start flex-col gap-2">
                  <span className={`text-sm ${tokens.isDark ? "text-white/70" : "text-[#718EBF]"}`}>
                    Attendees:
                  </span>
                  <div className="flex flex-wrap items-center gap-3">
                    {defaultAttendees.map((attendee, index) => (
                      <div key={attendee.id} className="flex items-center gap-1 bg-[#FFF8D1] rounded-full p-1 pe-4">
                        <div
                          className="h-8 w-8 rounded-full border-2 border-white flex items-center justify-center text-xs font-semibold text-white"
                          style={{ backgroundColor: getAvatarColor(index, tokens.isDark) }}
                        >
                          {attendee.avatar ? (
                            <img
                              src={attendee.avatar}
                              alt={attendee.name}
                              className="h-full w-full rounded-full object-cover"
                            />
                          ) : (
                            <span>{getInitials(attendee.name)}</span>
                          )}
                        </div>
                        <span className={`text-xs ${tokens.isDark ? "text-white/70" : "text-black"}`}>
                          {attendee.name}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Meeting Notes Section */}
            <div className="flex flex-col gap-3">
              <h4 className={`text-base font-bold ${tokens.isDark ? "text-white" : "text-black"}`}>
                Meeting Notes
              </h4>
              <ul className="flex flex-col gap-2">
                {defaultNotes.map((note, index) => (
                  <li key={index} className="flex flex-wrap items-center gap-2">
                    <div className="flex-shrink-0 w-4 h-4 rounded-full bg-[#FFF7D1]" />
                    <span className={`text-sm ${tokens.isDark ? "text-white/70" : "text-black"}`}>
                      {note}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Action Log Section */}
            <div className="flex flex-col gap-3">
              <h4 className={`text-base font-bold ${tokens.isDark ? "text-white" : "text-black"}`}>
                Action Log
              </h4>
              <div className="relative pl-6">
                {/* Vertical dashed line */}
                <div className={`absolute left-2 top-0 bottom-0 w-0.5 border-l-2 ${
                  tokens.isDark ? "border-white/20" : "border-[#E6E6E6]"
                }`} style={{ borderStyle: "dashed" }} />
                
                {/* Timeline entries */}
                <div className="flex flex-col gap-6">
                  {defaultActionLog.map((log, index) => (
                    <div key={index} className="relative flex flex-col md:flex-row flex-wrap items-start gap-4">
                      {/* Circle marker */}
                      <div className="absolute -left-6 flex items-center justify-center">
                        <div className={`h-5 w-5 rounded-full border-3 ${
                          tokens.isDark ? "border-white/20 bg-[#4318FF]" : "border-[#F8D20D] bg-[#071FD7]"
                        }`} />
                      </div>
                      {/* Content */}
                      <div className="flex flex-col">
                        <span className={`text-sm font-medium ${tokens.isDark ? "text-white" : "text-black"}`}>
                          {log.date} – {log.action}
                          {log.by && (
                            <span className={`font-normal ${tokens.isDark ? "text-white/70" : "text-black"}`}>
                              {" "}by "{log.by}"
                            </span>
                          )}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className={`flex flex-col gap-3 mt-6 flex-shrink-0 border-t mx-6 ${tokens.isDark ? "border-white/20" : "border-[#E6E6E6]"} pt-2 pb-6`}>
          <button
            type="button"
            onClick={() => {
              if (onAddMeeting) {
                onAddMeeting();
              }
              onClose();
            }}
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
            onClick={onClose}
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
  );
};

