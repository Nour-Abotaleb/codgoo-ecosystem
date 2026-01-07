import { useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import type { DashboardTokens } from "../../types";
import { CloseModalIcon } from "@utilities/icons";

type Meeting = {
  meeting_name: string;
  date: string;
  start: string;
  end: string;
  project: string;
};

type MeetingsCalendarGridProps = {
  readonly meetings: Array<Meeting>;
  readonly tokens: DashboardTokens;
};

const isValidDate = (dateStr: string): boolean => {
  if (!dateStr || dateStr === "0000-00-00" || dateStr === "") return false;
  const date = new Date(dateStr);
  return !isNaN(date.getTime()) && date.getFullYear() > 1900;
};

const normalizeDate = (dateStr: string): string => {
  if (!isValidDate(dateStr)) {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  }
  const date = new Date(dateStr);
  if (!isNaN(date.getTime())) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  }
  return dateStr;
};

export const MeetingsCalendarGrid = ({
  meetings,
  tokens,
}: MeetingsCalendarGridProps) => {
  const [value, setValue] = useState<Date>(new Date());
  const [selectedDateMeetings, setSelectedDateMeetings] = useState<Meeting[] | null>(null);
  const [selectedDateLabel, setSelectedDateLabel] = useState<string>("");

  const meetingsByDate = meetings.reduce(
    (acc: Record<string, Meeting[]>, meeting: Meeting) => {
      const dateKey = normalizeDate(meeting.date);
      if (!acc[dateKey]) {
        acc[dateKey] = [];
      }
      acc[dateKey].push(meeting);
      return acc;
    },
    {} as Record<string, Meeting[]>
  );

  const textColor = tokens.isDark ? "#FFFFFF" : "#2B3674";
  const weekdayColor = tokens.isDark ? "#A3AED0" : "#A3AED0";
  const borderColor = tokens.isDark ? "rgba(230, 233, 251, 0.2)" : "#E6E9FB";

  const handleMeetingClick = (dateKey: string, dayMeetings: Meeting[]) => {
    if (dayMeetings.length > 1) {
      const date = new Date(dateKey);
      const formattedDate = date.toLocaleDateString("en-US", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      });
      setSelectedDateLabel(formattedDate);
      setSelectedDateMeetings(dayMeetings);
    }
  };

  const tileContent = ({ date, view }: { date: Date; view: string }) => {
    if (view === "month") {
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const day = String(date.getDate()).padStart(2, "0");
      const dateKey = `${year}-${month}-${day}`;
      const dayMeetings = meetingsByDate[dateKey];

      if (dayMeetings && dayMeetings.length > 0) {
        const firstMeeting = dayMeetings[0];
        const startTime = firstMeeting.start?.substring(0, 5) || "00:00";
        const endTime = firstMeeting.end?.substring(0, 5) || "00:00";
        const hasMore = dayMeetings.length > 1;

        return (
          <div
            onClick={(e) => {
              if (hasMore) {
                e.stopPropagation();
                handleMeetingClick(dateKey, dayMeetings);
              }
            }}
            style={{
              marginTop: "4px",
              display: "flex",
              flexDirection: "column",
              gap: "4px",
              width: "100%",
              cursor: hasMore ? "pointer" : "default",
            }}
          >
            <div
              style={{
                backgroundColor: "black",
                color: "white",
                padding: "10px 8px",
                borderRadius: "8px",
                fontSize: "11px",
                fontWeight: 600,
                textAlign: "left",
                border: "none",
                width: "100%",
                minHeight: "55px",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
              }}
            >
              <div
                style={{
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  marginBottom: "4px",
                }}
              >
                {firstMeeting.meeting_name}
              </div>
              <div style={{ fontSize: "10px" }}>
                {startTime}-{endTime}
                                     {hasMore && (
              <div
                style={{
                  backgroundColor: tokens.isDark ? "#374151" : "#E6E9FB",
                  color: tokens.isDark ? "#FFFFFF" : "#071FD7",
                  borderRadius: "6px",
                  width:'fit-content',
                  padding:'2px 6px',
                  fontSize: "10px",
                  fontWeight: 600,
                  textAlign: "start",
                }}
              >
                +{dayMeetings.length - 1} more
              </div>
            )}
              </div>
     
            </div>

          </div>
        );
      }
    }
    return null;
  };

  const customStyles = `
    .react-calendar {
      width: 100%;
      border: none;
      font-family: inherit;
      background: transparent;
    }
    .react-calendar__navigation {
      display: flex;
      height: 36px;
      margin-bottom: 0.5em;
    }
    .react-calendar__navigation button {
      min-width: 36px;
      background: none;
      font-size: 14px;
      font-weight: 600;
      color: ${textColor};
      border: none;
      cursor: pointer;
    }
    .react-calendar__navigation button:enabled:hover,
    .react-calendar__navigation button:enabled:focus {
      background-color: ${tokens.isDark ? "rgba(244, 244, 244, 0.1)" : "#F4F4F4"};
      border-radius: 6px;
    }
    .react-calendar__month-view__weekdays {
      text-align: center;
      font-weight: 600;
      font-size: 10px;
      color: ${weekdayColor};
      padding-bottom: 4px;
    }
    .react-calendar__month-view__weekdays__weekday {
      padding: 4px;
    }
    .react-calendar__month-view__weekdays__weekday abbr {
      text-decoration: none;
    }
    .react-calendar__tile {
      max-width: 100%;
      padding: 6px 4px;
      background: transparent;
      text-align: center;
      line-height: 14px;
      font-size: 10px;
      font-weight: 600;
      color: ${textColor};
      border: 1px solid ${borderColor};
      height: auto;
      min-height: 30px;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
    }
    .react-calendar__tile:enabled:hover,
    .react-calendar__tile:enabled:focus {
      background-color: ${tokens.isDark ? "rgba(249, 251, 253, 0.05)" : "#F9FBFD"};
    }
    .react-calendar__tile--now {
      background: rgba(15,103,115,0.05);
    }
    .react-calendar__tile--now:enabled:hover,
    .react-calendar__tile--now:enabled:focus {
      background: rgba(15,103,115,0.1);
    }
    .react-calendar__tile--active {

    }
    .react-calendar__tile--active:enabled:hover,
    .react-calendar__tile--active:enabled:focus {
]    }
    .react-calendar__month-view__days__day--neighboringMonth {
      color: ${tokens.isDark ? "rgba(163, 174, 208, 0.5)" : "#A3AED0"};
      background-color: transparent;
    }
    .react-calendar__month-view__days {
      display: grid !important;
      grid-template-columns: repeat(7, 1fr);
    }
    
    /* Mobile styling - fit on small screens without scroll */
    @media (max-width: 768px) {
      .react-calendar {
        max-height: 100%;
        overflow: visible;
        padding-right: 0;
        padding-bottom: 0;
      }
      
      .react-calendar__tile {
        padding: 4px 2px;
        min-height: 28px;
        font-size: 9px;
      }
      
      .react-calendar__month-view__weekdays__weekday {
        padding: 2px;
      }
      
      .react-calendar__month-view__weekdays__weekday abbr {
        font-size: 9px;
      }
    }
  `;

  return (
    <>
      <style>{customStyles}</style>
      <Calendar
        onChange={(val) => setValue(val as Date)}
        value={value}
        tileContent={tileContent}
        locale="en-US"
        formatShortWeekday={(_locale, date) => {
          const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
          return days[date.getDay()];
        }}
      />

      {selectedDateMeetings && (
        <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setSelectedDateMeetings(null)}
          />
          <div
            className={`relative w-full max-w-xl ${tokens.cardBase} ${
              tokens.isDark ? "bg-[#0F1217]" : "bg-white"
            } rounded-[20px] max-h-[80vh] overflow-hidden flex flex-col`}
          >
            <div
              className={`flex flex-wrap items-center justify-between px-6 pt-6 pb-4 flex-shrink-0 ${
                tokens.isDark ? "bg-[#0F1217]" : "bg-white"
              }`}
            >
              <div className="flex flex-col">
                <h2
                  className={`text-lg font-semibold ${
                    tokens.isDark ? "text-white" : "text-black"
                  }`}
                >
                  Meetings
                </h2>
                <span
                  className={`text-sm ${
                    tokens.isDark ? "text-white/60" : "text-black"
                  }`}
                >
                  {selectedDateLabel}
                </span>
              </div>
              <button
                type="button"
                onClick={() => setSelectedDateMeetings(null)}
                className="flex h-8 w-8 items-center justify-center transition-colors"
                aria-label="Close modal"
              >
                <CloseModalIcon className="h-6 w-6" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto px-6 pb-6 scrollbar-hide">
              <div className="grid grid-cols-2 gap-3">
                {selectedDateMeetings.map((meeting, index) => {
                  const startTime = meeting.start?.substring(0, 5) || "00:00";
                  const endTime = meeting.end?.substring(0, 5) || "00:00";
                  return (
                    <div
                      key={index}
                      className={`p-4 rounded-xl ${
                        tokens.isDark ? "bg-white/10" : "bg-[#F8F8F8]"
                      }`}
                    >
                      <div
                        className={`font-semibold text-base mb-1 ${
                          tokens.isDark ? "text-white" : "text-black"
                        }`}
                      >
                        {meeting.meeting_name}
                      </div>
                      <div
                        className={`text-sm mb-2 ${
                          tokens.isDark ? "text-white/70" : "text-gray-600"
                        }`}
                      >
                        {meeting.project}
                      </div>
                      <div
                        className={`text-sm font-medium ${
                          tokens.isDark ? "text-white/60" : "text-[#071FD7]"
                        }`}
                      >
                        {startTime} - {endTime}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
