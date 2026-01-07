import { useState, useEffect, useRef } from "react";
import toast from "react-hot-toast";
import { CloseModalIcon, PlusCircleIcon } from "@utilities/icons";
import type { DashboardTokens } from "../../types";
import { useGetAvailableSlotsQuery, useCreateMeetingMutation } from "@features/dashboard/api/dashboard-api";
import { getModalInputClass } from "../../utils/modalStyles";

type AvailableSlot = {
  readonly slot_id: number;
  readonly date: string;
  readonly start_time: string;
  readonly end_time: string;
  readonly status: boolean;
};

type CreateMeetingModalProps = {
  readonly tokens: DashboardTokens;
  readonly isOpen: boolean;
  readonly onClose: () => void;
  readonly projectId: number;
  readonly taskId: number;
  readonly onMeetingCreated?: () => void;
};

export const CreateMeetingModal = ({
  tokens,
  isOpen,
  onClose,
  projectId,
  taskId,
  onMeetingCreated
}: CreateMeetingModalProps) => {
  const { data: slotsData } = useGetAvailableSlotsQuery();
  const [createMeeting, { isLoading: isCreating }] = useCreateMeetingMutation();
  
  const [meetingTitle, setMeetingTitle] = useState("Website Review");
  const [description, setDescription] = useState("");
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<AvailableSlot | null>(null);
  const [filteredSlots, setFilteredSlots] = useState<AvailableSlot[]>([]);
  const [uniqueDates, setUniqueDates] = useState<string[]>([]);
  const datesScrollRef = useRef<HTMLDivElement>(null);
  const slotsScrollRef = useRef<HTMLDivElement>(null);

  const scrollDates = (direction: 'left' | 'right') => {
    if (datesScrollRef.current) {
      const scrollAmount = 300;
      datesScrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  const scrollSlots = (direction: 'left' | 'right') => {
    if (slotsScrollRef.current) {
      const scrollAmount = 300;
      slotsScrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

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

  const handleDateSelect = (date: string) => {
    setSelectedDate(date);
    setSelectedSlot(null); // Reset slot selection when date changes
  };

  const handleSlotSelect = (slot: AvailableSlot) => {
    setSelectedSlot(slot);
  };

  const handleCreateMeeting = async () => {
    if (!selectedSlot) {
      toast.error("Please select a date and time slot");
      return;
    }
    
    if (!meetingTitle.trim()) {
      toast.error("Please enter a meeting title");
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
      
      await createMeeting({
        slot_id: selectedSlot.slot_id,
        task_id: String(taskId),
        meeting_name: meetingTitle.trim(),
        description: description.trim(),
        start_time: formatTime(selectedSlot.start_time),
        end_time: formatTime(selectedSlot.end_time),
        project_id: projectId
      }).unwrap();

      toast.success("Meeting created successfully!");
      
      if (onMeetingCreated) {
        onMeetingCreated();
      }
      
      handleClose();
    } catch (error: any) {
      console.error("Error creating meeting:", error);
      toast.error(error?.data?.message || "Failed to create meeting. Please try again.");
    }
  };

  const handleClose = () => {
    setMeetingTitle("Website Review");
    setDescription("");
    setSelectedSlot(null);
    setSelectedDate(null);
    onClose();
  };

  const inputClass = getModalInputClass(tokens, { paddingY: "py-3", textColor: "text-[#2B3674]" });

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[10001] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50"
        onClick={handleClose}
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
              Create Meeting
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
                {/* Left Arrow */}
                <button
                  type="button"
                  onClick={() => scrollDates('left')}
                  className={`absolute left-2 top-1/2 -translate-y-1/2 z-10 w-8 h-8 rounded-full flex items-center justify-center transition-colors ${
                    tokens.isDark
                      ? "bg-[#2E3141] text-white hover:bg-[#3E4151]"
                      : "bg-white text-[#2B3674] hover:bg-gray-100 shadow-md"
                  }`}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                {/* Right Arrow */}
                <button
                  type="button"
                  onClick={() => scrollDates('right')}
                  className={`absolute right-2 top-1/2 -translate-y-1/2 z-10 w-8 h-8 rounded-full flex items-center justify-center transition-colors ${
                    tokens.isDark
                      ? "bg-[#2E3141] text-white hover:bg-[#3E4151]"
                      : "bg-white text-[#2B3674] hover:bg-gray-100 shadow-md"
                  }`}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
                <div ref={datesScrollRef} className="overflow-x-auto scrollbar-hide px-12">
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
                {/* Left Arrow */}
                <button
                  type="button"
                  onClick={() => scrollSlots('left')}
                  className={`absolute left-2 top-1/2 -translate-y-1/2 z-10 w-8 h-8 rounded-full flex items-center justify-center transition-colors ${
                    tokens.isDark
                      ? "bg-[#2E3141] text-white hover:bg-[#3E4151]"
                      : "bg-white text-[#2B3674] hover:bg-gray-100 shadow-md"
                  }`}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                {/* Right Arrow */}
                <button
                  type="button"
                  onClick={() => scrollSlots('right')}
                  className={`absolute right-2 top-1/2 -translate-y-1/2 z-10 w-8 h-8 rounded-full flex items-center justify-center transition-colors ${
                    tokens.isDark
                      ? "bg-[#2E3141] text-white hover:bg-[#3E4151]"
                      : "bg-white text-[#2B3674] hover:bg-gray-100 shadow-md"
                  }`}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
                <div ref={slotsScrollRef} className="overflow-x-auto scrollbar-hide px-12">
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
          </div>
        </div>

        {/* Action Buttons */}
        <div className={`flex flex-col gap-3 mt-6 flex-shrink-0 border-t mx-6 ${tokens.isDark ? "border-white/20" : "border-[#E6E6E6]"} pt-2 pb-6`}>
          <button
            type="button"
            onClick={handleCreateMeeting}
            disabled={isCreating}
            className={`w-full px-6 py-3 rounded-full text-base font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
              tokens.isDark
                ? "bg-[#4318FF] text-white hover:bg-[#4318FF]/90"
                : "bg-[#4318FF] text-white hover:bg-[#4318FF]/90"
            }`}
          >
            {isCreating ? "Creating..." : "Create Meeting"}
          </button>
          <button
            type="button"
            onClick={handleClose}
            disabled={isCreating}
            className={`w-full px-6 py-2.5 rounded-full text-base font-medium transition-colors disabled:opacity-50 ${
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
