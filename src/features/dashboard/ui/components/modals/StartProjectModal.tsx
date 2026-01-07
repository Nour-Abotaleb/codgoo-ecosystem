import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { CloseModalIcon, StartProjectIcon, UploadIcon } from "@utilities/icons";
import type { DashboardTokens } from "../../types";
import { getModalInputClass } from "../../utils/modalStyles";
import { useGetProjectCategoriesQuery, useCreateProjectMutation } from "@features/dashboard/api/dashboard-api";
import toast from "react-hot-toast";

type StartProjectModalProps = {
  readonly tokens: DashboardTokens;
  readonly isOpen: boolean;
  readonly onClose: () => void;
};

export const StartProjectModal = ({
  tokens,
  isOpen,
  onClose
}: StartProjectModalProps) => {
  const navigate = useNavigate();
  const [projectName, setProjectName] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [description, setDescription] = useState("");
  const [note, setNote] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [attachments, setAttachments] = useState<File[]>([]);
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);
  const categoryRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Fetch categories from API
  const { data: categoriesData, isLoading: categoriesLoading } = useGetProjectCategoriesQuery();
  
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

  const handleSave = async () => {
    if (!projectName.trim()) {
      toast.error("Please enter project name");
      return;
    }
    if (!categoryId) {
      toast.error("Please select a category");
      return;
    }
    
    // Validate dates if both are provided
    if (startTime && endTime) {
      const start = new Date(startTime);
      const end = new Date(endTime);
      if (end <= start) {
        toast.error("End time must be after start time");
        return;
      }
    }

    try {
      const formData = new FormData();
      formData.append("name", projectName.trim());
      formData.append("category", categoryId);
      
      if (description.trim()) {
        formData.append("description", description.trim());
      }
      
      if (note.trim()) {
        formData.append("note", note.trim());
      }
      
      if (startTime.trim()) {
        formData.append("start_time", startTime.trim());
      }
      if (endTime.trim()) {
        formData.append("end_time", endTime.trim());
      }
      
      // Add all attachments
      attachments.forEach((file) => {
        formData.append("attachment", file);
      });

      await createProject(formData).unwrap();
      
      toast.success("Project created successfully!");
      handleClose();
      
      // Redirect to meetings page
      navigate("/dashboard/meetings");
    } catch (error: any) {
      const errorMessage = error?.data?.message || error?.data?.errors?.end_time?.[0] || "Failed to create project";
      toast.error(errorMessage);
    }
  };

  const handleClose = () => {
    setProjectName("");
    setCategoryId("");
    setDescription("");
    setNote("");
    setStartTime("");
    setEndTime("");
    setAttachments([]);
    setIsCategoryOpen(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    onClose();
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      setAttachments(Array.from(files));
    }
  };

  const inputClass = getModalInputClass(tokens);

  return (
    <>
      {isOpen && (
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
                  <StartProjectIcon className={`h-5 w-5`} style={tokens.isDark ? {} : { color: "#071FD7" }} />
                </div>
                <h2 className={`text-lg md:text-xl font-semibold ${tokens.isDark ? "text-white" : "text-black"}`}>
                  Start Project
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
            <div className="flex-1 overflow-y-auto scrollbar-hide pt-4 px-6">
              <div className="flex flex-col gap-6">
                {/* Project Name */}
                <div className="relative">
                  <label 
                    className={`absolute left-4 -top-2.5 px-2 text-sm font-medium z-10 ${
                      tokens.isDark 
                        ? "text-white/70 bg-[#0F1217]" 
                        : "text-black bg-white"
                    }`}
                  >
                    Project Name
                  </label>
                  <input
                    type="text"
                    value={projectName}
                    onChange={(e) => setProjectName(e.target.value)}
                    className={inputClass}
                    placeholder="Website Review"
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        handleSave();
                      }
                    }}
                  />
                </div>

                {/* Category */}
                <div className="relative">
                  <label 
                    className={`absolute left-4 -top-2.5 px-2 text-sm font-medium z-10 ${
                      tokens.isDark 
                        ? "text-white/70 bg-[#0F1217]" 
                        : "text-black bg-white"
                    }`}
                  >
                    Category
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
                          ? "Loading categories..." 
                          : categoryId 
                            ? categories.find((c: any) => String(c.id) === categoryId)?.name || "Select Category"
                            : "Select Category"
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
                            No categories available
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

                {/* Start Time and End Time */}
                <div className="grid grid-cols-2 gap-4">
                  {/* Start Time */}
                  <div className="relative">
                    <label 
                      className={`absolute left-4 -top-2.5 px-2 text-sm font-medium z-10 ${
                        tokens.isDark 
                          ? "text-white/70 bg-[#0F1217]" 
                          : "text-black bg-white"
                      }`}
                    >
                      Start Time
                    </label>
                    <div className="relative">
                      <input
                        type="date"
                        value={startTime}
                        onChange={(e) => setStartTime(e.target.value)}
                        className={inputClass}
                        placeholder="2026-01-06"
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            handleSave();
                          }
                        }}
                      />
                    </div>
                  </div>

                  {/* End Time */}
                  <div className="relative">
                    <label 
                      className={`absolute left-4 -top-2.5 px-2 text-sm font-medium z-10 ${
                        tokens.isDark 
                          ? "text-white/70 bg-[#0F1217]" 
                          : "text-black bg-white"
                      }`}
                    >
                      End Time
                    </label>
                    <div className="relative">
                      <input
                        type="date"
                        value={endTime}
                        onChange={(e) => setEndTime(e.target.value)}
                        className={inputClass}
                        placeholder="2026-01-06"
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            handleSave();
                          }
                        }}
                      />
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
                    Note
                  </label>
                  <textarea
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    className={`${inputClass} min-h-[80px] resize-none`}
                    placeholder="Add a note"
                  />
                </div>

                {/* Attachments */}
                <div className="relative">
                  <label 
                    className={`absolute left-4 -top-2.5 px-2 text-sm font-medium z-10 ${
                      tokens.isDark 
                        ? "text-white/70 bg-[#0F1217]" 
                        : "text-black bg-white"
                    }`}
                  >
                    Attachments (Optional)
                  </label>
                  <label
                    htmlFor="start-project-file-upload"
                    className={`flex flex-col items-center justify-center gap-3 px-8 py-6 rounded-[20px] border-2 border-dashed cursor-pointer transition-colors ${
                      tokens.isDark
                        ? "border-white/20 bg-transparent hover:border-white/30"
                        : "border-[#D0D5DD] hover:border-[#071FD7]/30"
                    }`}
                  >
                    <UploadIcon className={`h-8 w-8 ${tokens.isDark ? "text-white/70" : ""}`} />
                    <span className={`text-xs font-medium ${tokens.isDark ? "text-white/70" : "text-[#191D23]"}`}>
                      Click to upload Attachments (PDF, DOC, DOCX, PNG, JPG)
                    </span>
                    <input
                      id="start-project-file-upload"
                      ref={fileInputRef}
                      type="file"
                      multiple
                      accept=".pdf,.doc,.docx,.txt,.jpg,.jpeg,.png"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                    {attachments.length > 0 && (
                      <div className="flex flex-col gap-1 items-center">
                        <span className={`text-xs ${tokens.isDark ? "text-white" : "text-black"}`}>
                          {attachments.length} file(s) selected
                        </span>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.preventDefault();
                            setAttachments([]);
                            if (fileInputRef.current) {
                              fileInputRef.current.value = "";
                            }
                          }}
                          className={`text-xs ${tokens.isDark ? "text-red-400 hover:text-red-300" : "text-red-600 hover:text-red-700"}`}
                        >
                          Remove all
                        </button>
                      </div>
                    )}
                  </label>
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
                    Project Description
                  </label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className={`${inputClass} min-h-[120px] resize-none`}
                    placeholder="Description"
                  />
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className={`flex flex-col gap-3 mt-6 flex-shrink-0 border-t mx-6 ${tokens.isDark ? "border-white/20" : "border-[#E6E6E6]"} pt-2 pb-6`}>
              <button
                type="button"
                onClick={handleSave}
                disabled={isCreating}
                className={`w-full py-3.5 rounded-full font-semibold transition-colors ${
                  tokens.isDark
                    ? "bg-[#071FD7] text-white hover:bg-[#071FD7]/90 disabled:opacity-50 disabled:cursor-not-allowed"
                    : "bg-[#071FD7] text-white hover:bg-[#071FD7]/90 disabled:opacity-50 disabled:cursor-not-allowed"
                }`}
              >
                {isCreating ? "Creating..." : "Request Meeting"}
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
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
