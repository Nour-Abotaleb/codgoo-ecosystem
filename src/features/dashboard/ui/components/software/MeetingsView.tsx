import { useState, useMemo, useEffect, useRef } from "react";
import { PlusCircleIcon, SearchIcon, DotsSwitcher, MeetingsIcon, MeetingSummaryIcon, ArrowRightIcon, MeetingCalendarIcon, MeetingClockIcon, MeetingReasonIcon, CloseIcon, EditIcon } from "@utilities/icons";
import type { DashboardTokens } from "../../types";
import { useGetMeetingsQuery, useGetMeetingSummaryQuery, useDeleteMeetingMutation, useCancelMeetingMutation, useJoinMeetingQuery } from "@features/dashboard/api/dashboard-api";
import { AddMeetingModal } from "../modals/AddMeetingModal";
import { EditMeetingModal } from "../modals/EditMeetingModal";
import { DeleteRecordModal } from "../modals/DeleteRecordModal";
import { ViewSummaryModal } from "../modals/ViewSummaryModal";

type MeetingsViewProps = {
  readonly tokens: DashboardTokens;
};

type MeetingStatus = "Completed" | "Confirmed" | "Canceled" | "Waiting" | "request_sent";

type MeetingItem = {
  readonly id: number | string;
  readonly title: string;
  readonly project: string;
  readonly status: MeetingStatus;
  readonly summary?: string;
  readonly agenda?: string;
  readonly note?: string;
  readonly reason?: string;
  readonly date: string;
  readonly time: string;
  readonly canceledDate?: string;
  readonly canceledBy?: string;
  readonly attendees: number;
  readonly attachment?: string;
  readonly description?: string;
  readonly start_time?: string;
  readonly end_time?: string;
};

const getStatusBadgeStyle = (status: MeetingStatus) => {
  switch (status) {
    case "Completed":
      return "bg-[#E2FFE9] text-[#34C759]";
    case "Confirmed":
      return "bg-[#E6F3FF] text-[#007AFF]";
    case "Canceled":
      return "bg-[#FFF1F0] text-[#EE5D50]";
    case "Waiting":
      return "bg-[#FFEDD9] text-[#DF7C00]";
    case "request_sent":
      return "bg-[#E6F3FF] text-[#007AFF]";
    default:
      return "bg-[#0015B4] text-[#CCD3FF]";
  }
};

const getActionButtonLabel = (status: MeetingStatus) => {
  switch (status) {
    case "Completed":
      return "View Summary";
    case "Confirmed":
      return "Join Meeting";
    case "Canceled":
      return "Reschedule";
    case "Waiting":
      return "Join";
    case "request_sent":
      return "Join";
    default:
      return "View";
  }
};

export const MeetingsView = ({ tokens }: MeetingsViewProps) => {
  const { data: apiData } = useGetMeetingsQuery();
  const [selectedMeetingId, setSelectedMeetingId] = useState<number | null>(null);
  const { data: summaryData } = useGetMeetingSummaryQuery(selectedMeetingId || 0, {
    skip: !selectedMeetingId,
  });
  const { data: joinData } = useJoinMeetingQuery(selectedMeetingId || 0, {
    skip: !selectedMeetingId,
  });
  const [deleteMeeting] = useDeleteMeetingMutation();
  const [cancelMeeting] = useCancelMeetingMutation();
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<MeetingStatus | "All">("All");
  const [openMenuId, setOpenMenuId] = useState<string | number | null>(null);
  const [isAddMeetingModalOpen, setIsAddMeetingModalOpen] = useState(false);
  const [isEditMeetingModalOpen, setIsEditMeetingModalOpen] = useState(false);
  const [isDeleteRecordModalOpen, setIsDeleteRecordModalOpen] = useState(false);
  const [isViewSummaryModalOpen, setIsViewSummaryModalOpen] = useState(false);
  const [selectedMeeting, setSelectedMeeting] = useState<MeetingItem | null>(null);
  const [meetingToDelete, setMeetingToDelete] = useState<MeetingItem | null>(null);
  const [meetingToView, setMeetingToView] = useState<MeetingItem | null>(null);
  const menuRefs = useRef<Map<string | number, HTMLDivElement>>(new Map());

  // Transform API data to component format
  const meetingsData = useMemo(() => {
    if (apiData?.data && apiData.data.length > 0) {
      return apiData.data.map((meeting: any) => ({
        id: meeting.id,
        title: meeting.meeting_name || "N/A",
        project: meeting.project_name || "N/A",
        status: (meeting.status || "request_sent") as MeetingStatus,
        note: meeting.description || meeting.notes || "N/A",
        date: meeting.start_time?.split(" ")[0] || "N/A",
        time: `${meeting.start_time || "N/A"} - ${meeting.end_time || "N/A"}`,
        attendees: 0,
        description: meeting.description,
        start_time: meeting.start_time,
        end_time: meeting.end_time,
      }));
    }
    return [];
  }, [apiData]);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (!openMenuId) return;
      
      const menuElement = menuRefs.current.get(openMenuId);
      if (menuElement && !menuElement.contains(event.target as Node)) {
        setOpenMenuId(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [openMenuId]);

  const filteredMeetings = useMemo(() => {
    return meetingsData.filter((meeting: MeetingItem) => {
      const matchesSearch =
        !searchQuery.trim() ||
        meeting.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        meeting.project.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = statusFilter === "All" || meeting.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [searchQuery, statusFilter, meetingsData]);

  const toggleMenu = (id: string | number) => {
    setOpenMenuId(openMenuId === id ? null : id);
  };

  const handleJoinMeeting = (meetingId: number | string) => {
    setSelectedMeetingId(meetingId as number);
  };

  // Open Jitsi URL when join data is available
  useEffect(() => {
    if (joinData?.data?.jitsi_url) {
      window.open(joinData.data.jitsi_url, "_blank");
      setSelectedMeetingId(null);
    }
  }, [joinData]);

  return (
    <div className="flex flex-col gap-6">
      {/* Header with Search, Filter, and Create Button */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        {/* Search Input */}
        <div className="relative flex-1">
          <SearchIcon
            className={`absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 ${
              tokens.isDark ? "text-white/50" : "text-[#A3AED0]"
            }`}
          />
          <input
            type="text"
            placeholder="Search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={`w-full pl-10 pr-4 py-2.5 rounded-full border transition-colors ${
              tokens.isDark
                ? "bg-[#0F1217] text-white placeholder-white/50"
                : "bg-white border-[#E6E9FB] text-[#2B3674] placeholder-[#A3AED0]"
            } focus:outline-none focus:ring-1 focus:ring-[#071FD7]/20`}
          />
        </div>

        <div className="flex items-center gap-3">
          {/* Create Meeting Button */}
          <button
            type="button"
            onClick={() => setIsAddMeetingModalOpen(true)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-full font-medium transition-colors cursor-pointer ${
              tokens.isDark
                ? "bg-[#071FD7] text-white hover:bg-[#071FD7]/90"
                : "bg-[#071FD7] text-white hover:bg-[#071FD7]/90"
            }`}
          >
            <span>Create a meeting</span>
          </button>
          {/* Status Filter Dropdown */}
          <div className="relative">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as MeetingStatus | "All")}
              className={`appearance-none pl-4 pr-10 py-2.5 rounded-full border transition-colors cursor-pointer ${
                tokens.isDark
                  ? "bg-[#0F1217] text-white"
                  : "bg-white border-[#E6E9FB] text-[#2B3674]"
              } focus:outline-none focus:ring-1 focus:ring-[#071FD7]/20`}
            >
              <option value="All">All Meetings</option>
              <option value="Completed">Completed</option>
              <option value="Confirmed">Confirmed</option>
              <option value="Canceled">Canceled</option>
              <option value="Waiting">Waiting</option>
              <option value="request_sent">Request Sent</option>
            </select>
            <ArrowRightIcon
              className={`absolute right-3 top-1/2 transform -translate-y-1/2 rotate-90 h-4 w-4 pointer-events-none ${
                tokens.isDark ? "text-white/50" : "text-[#A3AED0]"
              }`}
            />
          </div>
        </div>
      </div>

      {/* Meetings List */}
      <div className="flex flex-col">
        {filteredMeetings.map((meeting: MeetingItem, index: number) => (
          <div key={meeting.id}>
            <div
              className={`${tokens.cardBase} rounded-[20px] overflow-hidden transition-colors`}
            >
              {/* Top Section - Gradient Background */}
              <div className={`p-6 ${tokens.isDark ? "bg-gradient-to-br from-[#071FD7]/10 to-[#071FD7]/5" : "bg-[#F4F5FF]"}`}>
                <div className="flex items-start justify-between gap-4">
                  {/* Left Section: Icon, Title, Status */}
                  <div className="flex items-start gap-4 flex-1">
                    {/* Video Icon */}
                    <div className="flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center">
                      <MeetingsIcon
                        className={`h-6 w-6 ${tokens.isDark ? "text-white" : "text-[#071FD7]"}`}
                      />
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-4 mb-2">
                        <div className="min-w-0 flex flex-col gap-2">
                          <h3
                            className={`text-lg font-medium ${tokens.isDark ? "text-white" : "text-[#2B3674]"}`}
                          >
                            {meeting.title} 
                            <span className="text-[#718EBF]"> </span>
                            <span className="text-[#718EBF]">({meeting.project})</span>
                          </h3>
                          <div className="flex items-center gap-2">
                            <MeetingReasonIcon className="h-5 w-5 flex-shrink-0" style={{ color: "#BEBEBE" }} />
                            <span className="text-sm" style={{ color: "#BEBEBE" }}>
                              {meeting.status === "Completed" && meeting.summary
                                ? `Summary`
                                : meeting.status === "Canceled" && meeting.reason
                                ? `Reason`
                                : meeting.status === "Confirmed" && meeting.agenda
                                ? `Agenda`
                                : meeting.status === "Waiting" && meeting.note
                                ? `Note`
                                : ""}
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <span
                            className={`inline-flex items-center justify-center px-3 py-2 rounded-full text-sm font-medium ${getStatusBadgeStyle(
                              meeting.status
                            )}`}
                          >
                            {meeting.status}
                          </span>

                          {/* Action Icons */}
                          <div className="relative flex-shrink-0">
                            {meeting.status === "Completed" || meeting.status === "Canceled" ? (
                              // Close Icon for Completed and Canceled
                              <button
                                type="button"
                                onClick={() => {
                                  setMeetingToDelete(meeting);
                                  setIsDeleteRecordModalOpen(true);
                                }}
                                className="flex h-9 w-9 items-center justify-center rounded-full transition-colors"
                                style={{ backgroundColor: tokens.isDark ? "rgba(255, 77, 77, 0.1)" : "rgb(255, 229, 222)" }}
                                aria-label={`Delete ${meeting.title}`}
                              >
                                <CloseIcon className="h-4 w-4" style={{ color: "#FF0000" }} />
                              </button>
                            ) : meeting.status === "Waiting" ? (
                              // Edit Icon for Waiting
                              <button
                                type="button"
                                onClick={() => {
                                  setSelectedMeeting(meeting);
                                  setIsEditMeetingModalOpen(true);
                                }}
                                className={`flex h-9 w-9 items-center justify-center rounded-full transition-colors ${tokens.isDark ? tokens.buttonGhost : ""}`}
                                style={tokens.isDark ? {} : { backgroundColor: "#E6E9FB" }}
                                aria-label={`Edit ${meeting.title}`}
                              >
                                <EditIcon className={`h-4 w-4`} style={tokens.isDark ? {} : { color: "#071FD7" }} />
                              </button>
                            ) : meeting.status === "Confirmed" || meeting.status === "request_sent" ? (
                              // DotsSwitcher with popup for Confirmed
                              <div
                                className="relative"
                                ref={(el) => {
                                  if (el) {
                                    menuRefs.current.set(meeting.id, el);
                                  } else {
                                    menuRefs.current.delete(meeting.id);
                                  }
                                }}
                              >
                                <button
                                  type="button"
                                  onClick={() => toggleMenu(meeting.id)}
                                  className={`p-2 rounded-full transition-colors ${
                                    tokens.isDark ? "hover:bg-white/10" : "hover:bg-gray-100"
                                  }`}
                                  aria-label="Meeting options"
                                >
                                  <DotsSwitcher
                                    className={`h-5 w-5 ${tokens.isDark ? "text-white/70" : "text-[#071FD7]"}`}
                                  />
                                </button>

                                {/* Dropdown Menu */}
                                {openMenuId === meeting.id && (
                                  <div
                                    className={`absolute right-0 top-full mt-2 w-48 rounded-lg shadow-sm z-10 ${
                                      tokens.isDark
                                        ? "bg-[#0F1217]"
                                        : "bg-white border border-[#E6E9FB]"
                                    }`}
                                  >
                                    <div className="py-1">
                                      <button
                                        type="button"
                                        onClick={() => {
                                          setSelectedMeeting(meeting);
                                          setIsEditMeetingModalOpen(true);
                                          setOpenMenuId(null);
                                        }}
                                        className={`w-full text-left px-4 py-2 text-sm transition-colors ${
                                          tokens.isDark
                                            ? "text-white/70 hover:bg-white/10"
                                            : "text-[#2B3674] hover:bg-gray-100"
                                        }`}
                                      >
                                        Reschedule
                                      </button>
                                      <button
                                        type="button"
                                        onClick={async () => {
                                          try {
                                            await cancelMeeting(meeting.id as number).unwrap();
                                            console.log("Meeting canceled:", meeting.id);
                                            setOpenMenuId(null);
                                          } catch (error) {
                                            console.error("Error canceling meeting:", error);
                                          }
                                        }}
                                        className={`w-full text-left px-4 py-2 text-sm transition-colors ${
                                          tokens.isDark
                                            ? "text-red-400 hover:bg-white/10"
                                            : "text-red-600 hover:bg-gray-100"
                                        }`}
                                      >
                                        Cancel Meeting
                                      </button>
                                    </div>
                                  </div>
                                )}
                              </div>
                            ) : null}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex flex-col gap-2" style={{ marginLeft: "64px" }}>
                    {/* Summary/Agenda/Note/Reason */}
                    {(meeting.summary || meeting.agenda || meeting.note || meeting.reason) && (
                      <p
                        className={`text-sm ${
                          tokens.isDark ? "text-white/70" : "text-[#718EBF]"
                        }`}
                      >
                        {meeting.summary || meeting.agenda || meeting.note || meeting.reason}
                      </p>
                    )}
                  </div>
                  
                  {/* Canceled By (for Canceled meetings) */}
                  {meeting.status === "Canceled" && (
                    <div className="flex items-center gap-2">
                      <span
                        className={`text-sm font-medium ${
                          tokens.isDark ? "text-white/70" : "text-[#718EBF]"
                        }`}
                      >
                        Canceled by:
                      </span>
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 border-2 border-white"></div>
                    </div>
                  )}

                  {/* Attendees */}
                  {meeting.attendees > 0 && (
                    <div className="flex items-center gap-2">
                      <span
                        className={`text-sm font-medium ${
                          tokens.isDark ? "text-white/70" : "text-[#718EBF]"
                        }`}
                      >
                        {meeting.status === "Waiting" ? "Invited" : "Attendees"}:
                      </span>
                      <div className="flex items-center -space-x-2">
                        {Array.from({ length: Math.min(4, meeting.attendees) }).map((_, i) => (
                          <div
                            key={i}
                            className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 border-2 border-white"
                          ></div>
                        ))}
                        {meeting.attendees > 4 && (
                          <div
                            className={`w-8 h-8 rounded-full border-2 border-white flex items-center justify-center ${
                              tokens.isDark ? "bg-gray-600" : "bg-gray-300"
                            }`}
                          >
                            <PlusCircleIcon
                              className={`h-4 w-4 ${tokens.isDark ? "text-white/70" : "text-[#718EBF]"}`}
                            />
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Bottom Section - Dashed Border and Background */}
              <div className={`p-6 flex flex-col gap-3 ${tokens.isDark ? "border-t border-dashed border-[#2E3141]" : "border-t border-dashed border-[#E2E8FF] bg-[#FFFEF7]"}`}>
                <div className="flex items-center justify-between">
                  {/* Attachment, Date and Time Info - Horizontal Layout */}
                  <div className="flex flex-wrap items-center gap-4">
                    {/* Attachment (for Completed meetings) */}
                     {meeting.attachment && (
                       <div className="flex items-center gap-2">
                         <MeetingSummaryIcon
                           className={`h-5 w-5 ${tokens.isDark ? "text-white" : "text-[#071FD7]"}`}
                         />
                         <span
                           className={`text-sm font-medium ${
                             tokens.isDark ? "text-white" : "text-[#071FD7]"
                           }`}
                         >
                           {meeting.attachment}
                         </span>
                       </div>
                     )}

                     {/* Date and Time Info */}
                     {meeting.status === "Canceled" ? (
                       <>
                         <div className="flex items-center gap-2">
                           <MeetingCalendarIcon
                             className={`h-5 w-5 ${tokens.isDark ? "text-white" : "text-[#071FD7]"}`}
                           />
                           <span className={`text-sm ${tokens.isDark ? "text-white" : "text-[#071FD7]"}`}>
                             Canceled On: {meeting.canceledDate}
                           </span>
                         </div>
                         <div className="flex items-center gap-2">
                           <MeetingClockIcon
                             className={`h-5 w-5 ${tokens.isDark ? "text-white" : "text-[#071FD7]"}`}
                           />
                           <span className={`text-sm ${tokens.isDark ? "text-white" : "text-[#071FD7]"}`}>
                             {meeting.time}
                           </span>
                         </div>
                       </>
                     ) : (
                       <>
                         <div className="flex items-center gap-2">
                           <MeetingCalendarIcon
                             className={`h-5 w-5 ${tokens.isDark ? "text-white" : "text-[#071FD7]"}`}
                           />
                           <span className={`text-sm ${tokens.isDark ? "text-white" : "text-[#071FD7]"}`}>
                             {meeting.status === "Completed" ? "Held On" : "Date"}: {meeting.date}
                           </span>
                         </div>
                         <div className="flex items-center gap-2">
                           <MeetingClockIcon
                             className={`h-5 w-5 ${tokens.isDark ? "text-white" : "text-[#071FD7]"}`}
                           />
                           <span className={`text-sm ${tokens.isDark ? "text-white" : "text-[#071FD7]"}`}>
                             Time: {meeting.time}
                           </span>
                         </div>
                       </>
                     )}
                  </div>

                  {/* Action Button */}
                   <button
                     type="button"
                     onClick={() => {
                       if (meeting.status === "Completed" || meeting.status === "request_sent") {
                         setSelectedMeetingId(meeting.id as number);
                         setMeetingToView(meeting);
                         setIsViewSummaryModalOpen(true);
                       } else if (meeting.status === "Canceled" || meeting.status === "Confirmed") {
                         if (meeting.status === "Confirmed") {
                           handleJoinMeeting(meeting.id);
                         } else {
                           setSelectedMeeting(meeting);
                           setIsEditMeetingModalOpen(true);
                         }
                       } else if (meeting.status === "Waiting") {
                         handleJoinMeeting(meeting.id);
                       }
                     }}
                     className={`px-4 py-2 min-w-[120px] rounded-full border font-medium transition-colors cursor-pointer ${
                       tokens.isDark
                         ? "border-white text-white hover:bg-white/10"
                         : "border-[#071FD7] text-[#071FD7] hover:bg-[#071FD7]/5"
                     }`}
                   >
                     {getActionButtonLabel(meeting.status)}
                   </button>
                </div>
              </div>
            </div>
            {index < filteredMeetings.length - 1 && (
              <div
                className={`h-px my-3 ${
                  tokens.isDark ? "border-white/10" : "border-[#E6E9FB]"
                }`}
              />
            )}
          </div>
        ))}

        {filteredMeetings.length === 0 && (
          <div
            className={`${tokens.cardBase} rounded-[20px] p-10 text-center`}
          >
            <p className={`text-lg ${tokens.isDark ? "text-white/70" : "text-[#718EBF]"}`}>
              No meetings found matching your criteria.
            </p>
          </div>
        )}
      </div>

      {/* Add Meeting Modal */}
      <AddMeetingModal
        tokens={tokens}
        isOpen={isAddMeetingModalOpen}
        onClose={() => setIsAddMeetingModalOpen(false)}
        onAddMeeting={(data) => {
          console.log("Meeting data:", data);
        }}
      />

      {/* Edit Meeting Modal */}
      <EditMeetingModal
        tokens={tokens}
        isOpen={isEditMeetingModalOpen}
        onClose={() => {
          setIsEditMeetingModalOpen(false);
          setSelectedMeeting(null);
        }}
        meeting={selectedMeeting ? {
          id: selectedMeeting.id,
          title: selectedMeeting.title,
          date: selectedMeeting.date,
          time: selectedMeeting.time,
          note: selectedMeeting.note
        } : undefined}
        onSave={(data) => {
          console.log("Updated meeting data:", data);
        }}
      />

      {/* Delete Record Modal */}
      <DeleteRecordModal
        tokens={tokens}
        isOpen={isDeleteRecordModalOpen}
        onClose={() => {
          setIsDeleteRecordModalOpen(false);
          setMeetingToDelete(null);
        }}
        recordName={meetingToDelete ? `${meetingToDelete.title} (${meetingToDelete.project})` : undefined}
        onConfirm={async () => {
          if (meetingToDelete?.id) {
            try {
              await deleteMeeting(meetingToDelete.id as number).unwrap();
              console.log("Meeting deleted:", meetingToDelete.id);
              setIsDeleteRecordModalOpen(false);
              setMeetingToDelete(null);
            } catch (error) {
              console.error("Error deleting meeting:", error);
            }
          }
        }}
      />

      {/* View Summary Modal */}
      <ViewSummaryModal
        tokens={tokens}
        isOpen={isViewSummaryModalOpen}
        onClose={() => {
          setIsViewSummaryModalOpen(false);
          setMeetingToView(null);
          setSelectedMeetingId(null);
        }}
        meeting={summaryData?.data ? {
          title: summaryData.data.meeting_name,
          project: summaryData.data.project_name,
          date: summaryData.data.date,
          time: `${summaryData.data.time?.start || "N/A"} - ${summaryData.data.time?.end || "N/A"}`,
          duration: `${summaryData.data.duration_minutes || 0} min`,
          platform: summaryData.data.meeting_platform || "N/A",
          attendees: summaryData.data.employees?.map((emp: any) => ({
            id: `${emp.id}`,
            name: emp.name
          })) || [],
          notes: summaryData.data.notes || [],
          actionLog: summaryData.data.action_log || []
        } : meetingToView ? {
          title: meetingToView.title,
          project: meetingToView.project,
          date: meetingToView.date,
          time: meetingToView.time,
          duration: "45 min",
          platform: "Zoom",
          attendees: Array.from({ length: meetingToView.attendees || 3 }).map((_, i) => ({
            id: `${i + 1}`,
            name: ["Aml Atef", "Ahmed Nasser", "Assmaa Hassan"][i] || `Attendee ${i + 1}`
          })),
          notes: undefined, 
          actionLog: [
            { date: "8 Nov", action: "Meeting created" },
            { date: "10 Nov", action: "Meeting marked as Completed" },
            { date: "10 Nov", action: "Summary added", by: "Aml Atef" }
          ]
        } : undefined}
        onAddMeeting={() => {
          setIsViewSummaryModalOpen(false);
          setMeetingToView(null);
          setSelectedMeetingId(null);
          setIsAddMeetingModalOpen(true);
        }}
      />
    </div>
  );
};
