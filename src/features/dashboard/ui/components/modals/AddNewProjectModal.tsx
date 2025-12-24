import { useState, useEffect, useRef } from "react";
import { CloseModalIcon, ProjectIcon, ProductsCalendarIcon } from "@utilities/icons";
import type { DashboardTokens } from "../../types";
import { getModalInputClass } from "../../utils/modalStyles";

type AddNewProjectModalProps = {
  readonly tokens: DashboardTokens;
  readonly isOpen: boolean;
  readonly onClose: () => void;
  readonly onAdd?: (data: {
    projectName: string;
    projectType: string;
    startDate: string;
    deadline: string;
    description: string;
  }) => void;
};

export const AddNewProjectModal = ({
  tokens,
  isOpen,
  onClose,
  onAdd
}: AddNewProjectModalProps) => {
  const [projectName, setProjectName] = useState("");
  const [projectType, setProjectType] = useState("");
  const [startDate, setStartDate] = useState("");
  const [deadline, setDeadline] = useState("");
  const [description, setDescription] = useState("");
  const [isProjectTypeOpen, setIsProjectTypeOpen] = useState(false);
  const projectTypeRef = useRef<HTMLDivElement>(null);

  const projectTypes = ["Development", "Design", "Marketing", "Support", "Mobile", "Web"];

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (projectTypeRef.current && !projectTypeRef.current.contains(event.target as Node)) {
        setIsProjectTypeOpen(false);
      }
    };

    if (isProjectTypeOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isProjectTypeOpen]);

  const handleAdd = () => {
    if (projectName.trim() && projectType.trim()) {
      if (onAdd) {
        onAdd({
          projectName: projectName.trim(),
          projectType: projectType.trim(),
          startDate: startDate.trim(),
          deadline: deadline.trim(),
          description: description.trim()
        });
      }
      handleClose();
    }
  };

  const handleClose = () => {
    setProjectName("");
    setProjectType("");
    setStartDate("");
    setDeadline("");
    setDescription("");
    setIsProjectTypeOpen(false);
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
      <div className={`relative w-full max-w-xl ${tokens.cardBase} ${tokens.isDark ? "bg-[#232637]" : "bg-white"} rounded-2xl max-h-[90vh] overflow-hidden flex flex-col`}>
        {/* Header */}
        <div className={`flex items-center justify-between px-6 pt-6 pb-4 flex-shrink-0 rounded-t-2xl ${
          tokens.isDark ? "bg-[#232637]" : "bg-[#FFFEF7]"
        }`}>
          <div className="flex items-center gap-3">
            <div className={`flex h-9 w-9 items-center justify-center rounded-full ${tokens.isDark ? tokens.buttonGhost : ""}`} style={tokens.isDark ? {} : { backgroundColor: "#E6E9FB" }}>
              <ProjectIcon className={`h-5 w-5`} style={tokens.isDark ? {} : { color: "#071FD7" }} />
            </div>
            <h2 className={`text-lg md:text-xl font-semibold ${tokens.isDark ? "text-white" : "text-black"}`}>
              Add New Project
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
            {/* Project Name Input */}
            <div className="relative">
              <label 
                className={`absolute left-4 -top-2.5 px-2 text-sm font-medium z-10 ${
                  tokens.isDark 
                    ? "text-white/70 bg-[#232637]" 
                    : "text-black bg-[#0F1217]"
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
                    handleAdd();
                  }
                }}
              />
            </div>

            {/* Project Type Dropdown */}
            <div className="relative">
              <label 
                className={`absolute left-4 -top-2.5 px-2 text-sm font-medium z-10 ${
                  tokens.isDark 
                    ? "text-white/70 bg-[#232637]" 
                    : "text-black bg-[#0F1217]"
                }`}
              >
                Project Type
              </label>
              <div className="relative" ref={projectTypeRef}>
                <button
                  type="button"
                  onClick={() => setIsProjectTypeOpen(!isProjectTypeOpen)}
                  className={`w-full px-4 py-3.5 rounded-[16px] border text-left flex items-center justify-between ${
                    tokens.isDark
                      ? "bg-transparent border-white/20 text-white"
                      : `bg-transparent border-[#E6E6E6] ${projectType ? "!text-black" : "!text-black"} placeholder:text-black`
                  } focus:outline-none`}
                >
                  <span className={projectType ? "" : "text-black/50"}>{projectType || "Select Type"}</span>
                  <svg
                    className={`w-5 h-5 transition-transform ${isProjectTypeOpen ? "rotate-180" : ""}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                {isProjectTypeOpen && (
                  <div
                    className={`absolute z-20 w-full mt-2 rounded-[16px] border shadow-lg max-h-60 overflow-y-auto ${
                      tokens.isDark
                        ? "bg-[#232637] border-white/20"
                        : "bg-white border-[#E6E6E6]"
                    }`}
                  >
                    {projectTypes.map((type) => (
                      <button
                        key={type}
                        type="button"
                        onClick={() => {
                          setProjectType(type);
                          setIsProjectTypeOpen(false);
                        }}
                        className={`w-full text-left px-4 py-3 text-sm transition-colors ${
                          tokens.isDark
                            ? "text-white/70 hover:bg-white/10"
                            : "text-black hover:bg-gray-50"
                        } ${projectType === type ? (tokens.isDark ? "bg-white/10" : "bg-gray-50") : ""}`}
                      >
                        {type}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Start Date and Deadline */}
            <div className="grid grid-cols-2 gap-4">
              {/* Start Date */}
              <div className="relative">
                <label 
                  className={`absolute left-4 -top-2.5 px-2 text-sm font-medium z-10 ${
                    tokens.isDark 
                      ? "text-white/70 bg-[#232637]" 
                      : "text-black bg-[#0F1217]"
                  }`}
                >
                  Start
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className={inputClass}
                    placeholder="-"
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        handleAdd();
                      }
                    }}
                  />
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                    <ProductsCalendarIcon className={`h-5 w-5 ${tokens.isDark ? "text-white/50" : "text-black/50"}`} />
                  </div>
                </div>
              </div>

              {/* Deadline */}
              <div className="relative">
                <label 
                  className={`absolute left-4 -top-2.5 px-2 text-sm font-medium z-10 ${
                    tokens.isDark 
                      ? "text-white/70 bg-[#232637]" 
                      : "text-black bg-[#0F1217]"
                  }`}
                >
                  Deadline
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={deadline}
                    onChange={(e) => setDeadline(e.target.value)}
                    className={inputClass}
                    placeholder="-"
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        handleAdd();
                      }
                    }}
                  />
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                    <ProductsCalendarIcon className={`h-5 w-5 ${tokens.isDark ? "text-white/50" : "text-black/50"}`} />
                  </div>
                </div>
              </div>
            </div>

            {/* Project Description */}
            <div className="relative">
              <label 
                className={`absolute left-4 -top-2.5 px-2 text-sm font-medium z-10 ${
                  tokens.isDark 
                    ? "text-white/70 bg-[#232637]" 
                    : "text-black bg-[#0F1217]"
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

        {/* Footer */}
        <div className={`flex flex-col gap-3 mt-6 flex-shrink-0 border-t mx-6 ${tokens.isDark ? "border-white/20" : "border-[#E6E6E6]"} pt-2 pb-6`}>
          <button
            type="button"
            onClick={handleAdd}
            className={`w-full py-3.5 rounded-full font-semibold transition-colors ${
              tokens.isDark
                ? "bg-[#071FD7] text-white hover:bg-[#071FD7]/90"
                : "bg-[#071FD7] text-white hover:bg-[#071FD7]/90"
            }`}
          >
            Add New Project
          </button>
          <button
            type="button"
            onClick={handleClose}
            className={`w-full py-3.5 rounded-full font-semibold transition-colors border ${
              tokens.isDark
                ? "border-white/20 text-white hover:bg-white/10"
                : "border-[#071FD7] text-[#071FD7] hover:bg-[#071FD7]/5"
            }`}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

