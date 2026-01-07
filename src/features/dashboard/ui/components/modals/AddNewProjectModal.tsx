import { useState, useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { CloseModalIcon, ProjectIcon, UploadIcon } from "@utilities/icons";
import type { DashboardTokens } from "../../types";
import { getModalInputClass } from "../../utils/modalStyles";
import { useGetProjectCategoriesQuery, useCreateProjectMutation, useGetAvailableSlotsQuery } from "@features/dashboard/api/dashboard-api";
import toast from "react-hot-toast";

type AvailableSlot = {
  readonly slot_id: number;
  readonly date: string;
  readonly start_time: string;
  readonly end_time: string;
  readonly status: boolean;
};

type AddNewProjectModalProps = {
  readonly tokens: DashboardTokens;
  readonly isOpen: boolean;
  readonly onClose: () => void;
};

export const AddNewProjectModal = ({
  tokens,
  isOpen,
  onClose
}: AddNewProjectModalProps) => {
  const { t } = useTranslation("landing");
  const navigate = useNavigate();
  const [projectName, setProjectName] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [note, setNote] = useState("");
  const [description, setDescription] = useState("");
  const [attachment, setAttachment] = useState<File | null>(null);
  const [meetingName, setMeetingName] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<AvailableSlot | null>(null);
  const [filteredSlots, setFilteredSlots] = useState<AvailableSlot[]>([]);
  const [uniqueDates, setUniqueDates] = useState<string[]>([]);
  const categoryRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const datesScrollRef = useRef<HTMLDivElement>(null);
  const slotsScrollRef = useRef<HTMLDivElement>(null);

  // Fetch categories and slots from API
  const { data: categoriesData, isLoading: categoriesLoading } = useGetProjectCategoriesQuery();
  const { data: slotsData } = useGetAvailableSlotsQuery();
  
  // Create project mutation
  const [createProject, { isLoading: isCreating }] = useCreateProjectMutation();

  const categories = categoriesData?.data?.data || [];

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (categoryRef.current && !categoryRef.current.contains(event.target as Node)) {
        setIsCategoryOpen(false);
      }
    };

    if (isCategoryOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isCategoryOpen]);

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

  const handleDateSelect = (date: string) => {
    setSelectedDate(date);
    setSelectedSlot(null);
  };

  const handleSlotSelect = (slot: AvailableSlot) => {
    setSelectedSlot(slot);
  };

  const handleAdd = async () => {
    if (!projectName.trim()) {
      toast.error(t("dashboard.messages.pleaseEnterProjectName"));
      return;
    }
    if (!categoryId) {
      toast.error(t("dashboard.messages.pleaseSelectCategory"));
      return;
    }
    if (!meetingName.trim()) {
      toast.error(t("dashboard.messages.pleaseEnterMeetingName"));
      return;
    }

    try {
      const formData = new FormData();
      formData.append("name", projectName.trim());
      formData.append("category", categoryId);
      formData.append("meeting_name", meetingName.trim());
      
      // Add dates only if provided
      if (startDate.trim()) {
        formData.append("start_time", startDate);
      }
      if (endDate.trim()) {
        formData.append("end_time", endDate);
      }
      
      // Add slot_id if a slot is selected
      if (selectedSlot) {
        formData.append("slot_id", String(selectedSlot.slot_id));
      }
      
      if (description.trim()) {
        formData.append("description", description.trim());
      }
      if (note.trim()) {
        formData.append("note", note.trim());
      }
      if (attachment) {
        formData.append("attachment", attachment);
      }

      await createProject(formData).unwrap();
      
      toast.success(t("dashboard.messages.projectCreatedSuccessfully", { defaultValue: "Project created successfully!" }));
      handleClose();
      
      // Redirect to meetings page
      navigate("/dashboard/meetings");
    } catch (error: any) {
      const errorMessage = error?.data?.message || t("dashboard.messages.failedToCreateProject");
      toast.error(errorMessage);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setAttachment(file);
    }
  };

  const handleRemoveFile = () => {
    setAttachment(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleClose = () => {
    setProjectName("");
    setCategoryId("");
    setNote("");
    setDescription("");
    setAttachment(null);
    setMeetingName("");
    setStartDate("");
    setEndDate("");
    setIsCategoryOpen(false);
    setSelectedDate(null);
    setSelectedSlot(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    onClose();
  };

  const inputClass = getModalInputClass(tokens);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4">
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
            <div className={`flex h-9 w-9 items-center justify-center rounded-full ${tokens.isDark ? tokens.buttonGhost : ""}`} style={tokens.isDark ? {} : { backgroundColor: "#E6E9FB" }}>
              <ProjectIcon className={`h-5 w-5`} style={tokens.isDark ? {} : { color: "#071FD7" }} />
            </div>
            <h2 className={`text-lg md:text-xl font-semibold ${tokens.isDark ? "text-white" : "text-black"}`}>
              {t("dashboard.modal.addNewProject")}
            </h2>
          </div>
          <button
            type="button"
            onClick={handleClose}
            className="flex h-8 w-8 items-center justify-center transition-colors"
            aria-label="Close modal"
          >
            <CloseModalIcon className="h-6 w-6 md:h-7 md:w-7" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto scrollbar-hide pt-6 px-6">
          <div className="flex flex-col gap-6">


            {/* Available Dates - Swiper */}
            {uniqueDates.length > 0 && (
              <div className="relative -mx-6">
                <label className={`text-sm font-medium mb-3 block px-6 ${
                  tokens.isDark ? "text-white/70" : "text-black"
                }`}>
                  {t("dashboard.modal.selectDateOptional")}
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
                  {t("dashboard.modal.availableTimesOptional")}
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

            {/* Project Name Input */}
            <div className="relative">
              <label 
                className={`absolute left-4 -top-2.5 px-2 text-sm font-medium z-10 ${
                  tokens.isDark 
                    ? "text-white/70 bg-[#0F1217]" 
                    : "text-black bg-white"
                }`}
              >
                {t("dashboard.modal.projectName")}
              </label>
              <input
                type="text"
                value={projectName}
                onChange={(e) => setProjectName(e.target.value)}
                className={inputClass}
                placeholder={t("dashboard.modal.websiteReview")}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleAdd();
                  }
                }}
              />
            </div>

            {/* Project Category Dropdown */}
            <div className="relative">
              <label 
                className={`absolute left-4 -top-2.5 px-2 text-sm font-medium z-10 ${
                  tokens.isDark 
                    ? "text-white/70 bg-[#0F1217]" 
                    : "text-black bg-white"
                }`}
              >
                {t("dashboard.modal.projectCategory")}
              </label>
              <div className="relative" ref={categoryRef}>
                <button
                  type="button"
                  onClick={() => setIsCategoryOpen(!isCategoryOpen)}
                  disabled={categoriesLoading}
                  className={`w-full px-4 py-3.5 rounded-[20px] border text-left flex flex-wrap items-center justify-between ${
                    tokens.isDark
                      ? "bg-transparent border-white/20 text-white"
                      : `bg-transparent border-[#E6E6E6] ${categoryId ? "!text-black" : "!text-black"} placeholder:text-black`
                  } focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed`}
                >
                  <span className={categoryId ? "" : "text-black/50"}>
                    {categoriesLoading 
                      ? t("dashboard.modal.loadingCategories") 
                      : categoryId 
                        ? categories.find((c: any) => String(c.id) === categoryId)?.name || t("dashboard.modal.selectCategory")
                        : t("dashboard.modal.selectCategory")
                    }
                  </span>
                  <svg
                    className={`w-5 h-5 transition-transform ${isCategoryOpen ? "rotate-180" : ""}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                {isCategoryOpen && !categoriesLoading && (
                  <div
                    className={`absolute z-20 w-full mt-2 rounded-[20px] border shadow-lg max-h-60 overflow-y-auto ${
                      tokens.isDark
                        ? "bg-[#0F1217] border-white/20"
                        : "bg-white border-[#E6E6E6]"
                    }`}
                  >
                    {categories.length === 0 ? (
                      <div className="px-4 py-3 text-sm text-center text-black">
                        {t("dashboard.modal.noCategoriesAvailable")}
                      </div>
                    ) : (
                      categories.map((category: any) => (
                        <button
                          key={category.id}
                          type="button"
                          onClick={() => {
                            setCategoryId(String(category.id));
                            setIsCategoryOpen(false);
                          }}
                          className={`w-full text-left px-4 py-3 text-sm transition-colors ${
                            tokens.isDark
                              ? "text-white/70 hover:bg-white/10"
                              : "text-black hover:bg-gray-50"
                          } ${categoryId === String(category.id) ? (tokens.isDark ? "bg-white/10" : "bg-gray-50") : ""}`}
                        >
                          {category.name}
                        </button>
                      ))
                    )}
                  </div>
                )}
              </div>
            </div>


            {/* Meeting Name */}
            <div className="relative">
              <label 
                className={`absolute left-4 -top-2.5 px-2 text-sm font-medium z-10 ${
                  tokens.isDark 
                    ? "text-white/70 bg-[#0F1217]" 
                    : "text-black bg-white"
                }`}
              >
                {t("dashboard.modal.meetingName")}
              </label>
              <input
                type="text"
                value={meetingName}
                onChange={(e) => setMeetingName(e.target.value)}
                className={inputClass}
                placeholder={t("dashboard.modal.meetingName")}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleAdd();
                  }
                }}
              />
            </div>

            {/* Start Date and End Date */}
            <div className="grid grid-cols-2 gap-4">
              {/* Start Date */}
              <div className="relative">
                <label 
                  className={`absolute left-4 -top-2.5 px-2 text-sm font-medium z-10 ${
                    tokens.isDark 
                      ? "text-white/70 bg-[#0F1217]" 
                      : "text-black bg-white"
                  }`}
                >
                  {t("dashboard.project.startDate")}
                </label>
                <div className="relative">
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className={inputClass}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        handleAdd();
                      }
                    }}
                  />
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                    <svg className={`h-5 w-5 ${tokens.isDark ? "text-white/50" : "text-black/50"}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                </div>
              </div>

              {/* End Date */}
              <div className="relative">
                <label 
                  className={`absolute left-4 -top-2.5 px-2 text-sm font-medium z-10 ${
                    tokens.isDark 
                      ? "text-white/70 bg-[#0F1217]" 
                      : "text-black bg-white"
                  }`}
                >
                  {t("dashboard.modal.endDate")}
                </label>
                <div className="relative">
                  <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className={inputClass}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        handleAdd();
                      }
                    }}
                  />
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                    <svg className={`h-5 w-5 ${tokens.isDark ? "text-white/50" : "text-black/50"}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>



            {/* Note */}
            <div className="relative">
              <label 
                className={`absolute left-4 -top-2.5 px-2 text-sm font-medium z-10 ${
                  tokens.isDark 
                    ? "text-white/70 bg-[#0F1217]" 
                    : "text-black bg-white"
                }`}
              >
                {t("dashboard.modal.note")}
              </label>
              <textarea
                value={note}
                onChange={(e) => setNote(e.target.value)}
                className={`${inputClass} min-h-[80px] resize-none`}
                placeholder={t("dashboard.settings.addNote")}
              />
            </div>

            {/* Project Description */}
            <div className="relative">
              <label 
                className={`absolute left-4 -top-2.5 px-2 text-sm font-medium z-10 ${
                  tokens.isDark 
                    ? "text-white/70 bg-[#0F1217]" 
                    : "text-black bg-white"
                }`}
              >
                {t("dashboard.modal.projectDescription")}
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className={`${inputClass} min-h-[100px] resize-none`}
                placeholder={t("dashboard.settings.description")}
              />
            </div>

            {/* File Attachment */}
            <div className="relative">
              <label 
                className={`absolute left-4 -top-2.5 px-2 text-sm font-medium z-10 ${
                  tokens.isDark 
                    ? "text-white/70 bg-[#0F1217]" 
                    : "text-black bg-white"
                }`}
              >
                {t("dashboard.modal.attachmentOptional")}
              </label>
              <label
                htmlFor="project-file-upload"
                className={`flex flex-col items-center justify-center gap-3 px-8 py-6 rounded-[20px] border-2 border-dashed cursor-pointer transition-colors ${
                  tokens.isDark
                    ? "border-white/20 bg-transparent hover:border-white/30"
                    : "border-[#D0D5DD] hover:border-[#071FD7]/30"
                }`}
              >
                <UploadIcon className={`h-8 w-8 ${tokens.isDark ? "text-white/70" : ""}`} />
                <span className={`text-xs font-medium ${tokens.isDark ? "text-white/70" : "text-[#191D23]"}`}>
                  {t("dashboard.modal.clickToUploadAttachment")}
                </span>
                <input
                  id="project-file-upload"
                  ref={fileInputRef}
                  type="file"
                  onChange={handleFileChange}
                  className="hidden"
                  accept=".pdf,.doc,.docx,.txt,.jpg,.jpeg,.png"
                />
                {attachment && (
                  <div className="flex flex-wrap items-center gap-2">
                    <span className={`text-xs ${tokens.isDark ? "text-white" : "text-black"}`}>
                      {attachment.name}
                    </span>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.preventDefault();
                        handleRemoveFile();
                      }}
                      className={`text-xs ${tokens.isDark ? "text-red-400 hover:text-red-300" : "text-red-600 hover:text-red-700"}`}
                    >
                      {t("dashboard.modal.remove")}
                    </button>
                  </div>
                )}
              </label>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className={`flex flex-col gap-3 mt-6 flex-shrink-0 border-t mx-6 ${tokens.isDark ? "border-white/20" : "border-[#E6E6E6]"} pt-2 pb-6`}>
          <button
            type="button"
            onClick={handleAdd}
            disabled={isCreating}
            className={`w-full py-3.5 rounded-full font-semibold transition-colors ${
              tokens.isDark
                ? "bg-[#071FD7] text-white hover:bg-[#071FD7]/90 disabled:opacity-50 disabled:cursor-not-allowed"
                : "bg-[#071FD7] text-white hover:bg-[#071FD7]/90 disabled:opacity-50 disabled:cursor-not-allowed"
            }`}
          >
            {isCreating ? t("dashboard.modal.creating") : t("dashboard.modal.addNewProjectRequestMeeting")}
          </button>
          <button
            type="button"
            onClick={handleClose}
            disabled={isCreating}
            className={`w-full py-3.5 rounded-full font-semibold transition-colors border ${
              tokens.isDark
                ? "border-white/20 text-white hover:bg-white/10 disabled:opacity-50 disabled:cursor-not-allowed"
                : "border-[#071FD7] text-[#071FD7] hover:bg-[#071FD7]/5 disabled:opacity-50 disabled:cursor-not-allowed"
            }`}
          >
            {t("dashboard.modal.cancel")}
          </button>
        </div>
      </div>
    </div>
  );
};
