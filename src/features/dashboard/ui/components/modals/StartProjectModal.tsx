import { useState, useEffect, useRef } from "react";
import { CloseModalIcon, StartProjectIcon, UploadIcon } from "@utilities/icons";
import type { DashboardTokens } from "../../types";
import { getModalInputClass } from "../../utils/modalStyles";
import { AddMeetingModal } from "./AddMeetingModal";

type StartProjectModalProps = {
  readonly tokens: DashboardTokens;
  readonly isOpen: boolean;
  readonly onClose: () => void;
  readonly onSave?: (data: {
    projectName: string;
    category: string;
    features: string;
    attachments: File[];
    description: string;
  }) => void;
};

export const StartProjectModal = ({
  tokens,
  isOpen,
  onClose,
  onSave
}: StartProjectModalProps) => {
  const [projectName, setProjectName] = useState("Website Review");
  const [category, setCategory] = useState("Development");
  const [features, setFeatures] = useState("");
  const [description, setDescription] = useState("");
  const [attachments, setAttachments] = useState<File[]>([]);
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);
  const [isFeaturesOpen, setIsFeaturesOpen] = useState(false);
  const [isAddMeetingModalOpen, setIsAddMeetingModalOpen] = useState(false);
  const categoryRef = useRef<HTMLDivElement>(null);
  const featuresRef = useRef<HTMLDivElement>(null);

  const categories = ["Development", "Design", "Marketing", "Support"];
  const featureOptions = ["Feature 1", "Feature 2", "Feature 3", "Feature 4"];

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (categoryRef.current && !categoryRef.current.contains(event.target as Node)) {
        setIsCategoryOpen(false);
      }
      if (featuresRef.current && !featuresRef.current.contains(event.target as Node)) {
        setIsFeaturesOpen(false);
      }
    };

    if (isCategoryOpen || isFeaturesOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isCategoryOpen, isFeaturesOpen]);

  const handleSave = () => {
    if (projectName.trim()) {
      if (onSave) {
        onSave({
          projectName: projectName.trim(),
          category,
          features,
          attachments,
          description: description.trim()
        });
      }
      handleClose();
      setIsAddMeetingModalOpen(true);
    }
  };

  const handleClose = () => {
    setProjectName("Website Review");
    setCategory("Development");
    setFeatures("");
    setDescription("");
    setAttachments([]);
    setIsCategoryOpen(false);
    setIsFeaturesOpen(false);
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
          <div className={`relative w-full max-w-xl ${tokens.cardBase} ${tokens.isDark ? "bg-[#232637]" : "bg-white"} rounded-[20px] max-h-[90vh] overflow-hidden flex flex-col`}>
            {/* Header */}
            <div className={`flex items-center justify-between px-6 pt-6 pb-4 flex-shrink-0 rounded-t-2xl ${
              tokens.isDark ? "bg-[#232637]" : "bg-[#FFFEF7]"
            }`}>
              <div className="flex items-center gap-3">
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
                        ? "text-white/70 bg-[#232637]" 
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
                        ? "text-white/70 bg-[#232637]" 
                        : "text-black bg-white"
                    }`}
                  >
                    Category
                  </label>
                  <div className="relative" ref={categoryRef}>
                    <button
                      type="button"
                      onClick={() => {
                        setIsCategoryOpen(!isCategoryOpen);
                        setIsFeaturesOpen(false);
                      }}
                      className={`${inputClass} pe-12 text-left flex items-center justify-between`}
                    >
                      <span>{category}</span>
                      <svg
                        className={`h-5 w-5 transition-transform ${isCategoryOpen ? "rotate-180" : ""}`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                    {isCategoryOpen && (
                      <div className={`absolute z-20 w-full mt-1 rounded-[20px] border ${
                        tokens.isDark
                          ? "bg-[#232637] border-white/20"
                          : "bg-white border-[#E6E6E6]"
                      }`}>
                        {categories.map((cat) => (
                          <button
                            key={cat}
                            type="button"
                            onClick={() => {
                              setCategory(cat);
                              setIsCategoryOpen(false);
                            }}
                            className={`w-full px-4 py-3 text-left text-sm hover:bg-opacity-10 ${
                              tokens.isDark
                                ? "text-white hover:bg-white"
                                : "text-[#2B3674] hover:bg-[#071FD7]/10"
                            } ${cat === category ? tokens.isDark ? "bg-white/10" : "bg-[#071FD7]/10" : ""}`}
                          >
                            {cat}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Features */}
                <div className="relative">
                  <label 
                    className={`absolute left-4 -top-2.5 px-2 text-sm font-medium z-10 ${
                      tokens.isDark 
                        ? "text-white/70 bg-[#232637]" 
                        : "text-black bg-white"
                    }`}
                  >
                    Features
                  </label>
                  <div className="relative" ref={featuresRef}>
                    <button
                      type="button"
                      onClick={() => {
                        setIsFeaturesOpen(!isFeaturesOpen);
                        setIsCategoryOpen(false);
                      }}
                      className={`${inputClass} pe-12 text-left flex items-center justify-between ${
                        !features ? "text-black" : ""
                      }`}
                    >
                      <span>{features || "Features"}</span>
                      <svg
                        className={`h-5 w-5 transition-transform ${isFeaturesOpen ? "rotate-180" : ""}`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                    {isFeaturesOpen && (
                      <div className={`absolute z-20 w-full mt-1 rounded-[20px] border ${
                        tokens.isDark
                          ? "bg-[#232637] border-white/20"
                          : "bg-white border-[#E6E6E6]"
                      }`}>
                        {featureOptions.map((feature) => (
                          <button
                            key={feature}
                            type="button"
                            onClick={() => {
                              setFeatures(feature);
                              setIsFeaturesOpen(false);
                            }}
                            className={`w-full px-4 py-3 text-left text-sm hover:bg-opacity-10 ${
                              tokens.isDark
                                ? "text-white hover:bg-white"
                                : "text-black hover:bg-[#071FD7]/10"
                            }`}
                          >
                            {feature}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Attachments */}
                <div className="flex flex-col gap-2">
                  <label 
                    className={`text-sm md:text-base font-semibold ${
                      tokens.isDark 
                        ? "text-white/70" 
                        : "text-black"
                    }`}
                  >
                    Attachments
                  </label>
                  <label
                    htmlFor="file-upload"
                    className={`flex flex-col items-center justify-center gap-3 px-8 py-6 rounded-[20px] border-2 border-dashed cursor-pointer transition-colors ${
                      tokens.isDark
                        ? "border-white/20 bg-transparent hover:border-white/30"
                        : "border-[#D0D5DD] hover:border-[#071FD7]/30"
                    }`}
                  >
                    <UploadIcon className={`${tokens.isDark ? "text-white/70" : ""}`} />
                    <span className={`text-xs font-medium ${tokens.isDark ? "text-white/70" : "text-[#191D23]"}`}>
                      Click to upload Attachments (PDF, DOC, DOCX)
                    </span>
                    <input
                      id="file-upload"
                      type="file"
                      multiple
                      accept=".pdf,.doc,.docx"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                    {attachments.length > 0 && (
                      <span className={`text-xs ${tokens.isDark ? "text-white/50" : "text-gray-400"}`}>
                        {attachments.length} file(s) selected
                      </span>
                    )}
                  </label>
                </div>

                {/* Project Description */}
                <div className="relative">
                  <label 
                    className={`absolute left-4 -top-2.5 px-2 text-sm font-medium z-10 ${
                      tokens.isDark 
                        ? "text-white/70 bg-[#232637]" 
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
                className="w-full px-6 py-3 rounded-full text-base font-medium transition-colors bg-[#4318FF] text-white hover:bg-[#4318FF]/90"
              >
                Request Meeting
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

      {/* Add Meeting Modal */}
      <AddMeetingModal
        tokens={tokens}
        isOpen={isAddMeetingModalOpen}
        onClose={() => setIsAddMeetingModalOpen(false)}
        showProjectAndNote={false}
        onAddMeeting={(data) => {
          console.log("Meeting data:", data);
          // Handle meeting submission here
        }}
      />
    </>
  );
};
