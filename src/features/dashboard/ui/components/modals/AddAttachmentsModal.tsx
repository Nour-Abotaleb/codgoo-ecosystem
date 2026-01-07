import { useState } from "react";
import { CloseModalIcon, PlusCircleIcon, UploadIcon } from "@utilities/icons";
import type { DashboardTokens } from "../../types";

type AddAttachmentsModalProps = {
  readonly tokens: DashboardTokens;
  readonly isOpen: boolean;
  readonly onClose: () => void;
  readonly onUpload?: (files: File[]) => void;
};

export const AddAttachmentsModal = ({
  tokens,
  isOpen,
  onClose,
  onUpload
}: AddAttachmentsModalProps) => {
  const [attachments, setAttachments] = useState<File[]>([]);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setAttachments(files);
  };

  const handleUpload = () => {
    if (attachments.length > 0 && onUpload) {
      onUpload(attachments);
    }
    handleClose();
  };

  const handleClose = () => {
    setAttachments([]);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[10005] flex items-center justify-center p-4">
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
              Add New Attachments
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
          <div className="flex flex-col gap-6 pb-4">
            {/* Attachments Label */}
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
              
              {/* Upload Area */}
              <label
                htmlFor="file-upload"
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
                  id="file-upload"
                  type="file"
                  multiple
                  accept=".pdf,.doc,.docx,.png,.jpg,.jpeg"
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
          </div>
        </div>

        {/* Footer */}
        <div className={`flex flex-col gap-3 mt-6 flex-shrink-0 border-t mx-6 ${tokens.isDark ? "border-white/20" : "border-[#E6E6E6]"} pt-2 pb-6`}>
          <button
            type="button"
            onClick={handleUpload}
            className={`w-full px-6 py-3 rounded-full text-base font-medium transition-colors ${
              tokens.isDark
                ? "bg-[#4318FF] text-white hover:bg-[#4318FF]/90"
                : "bg-[#4318FF] text-white hover:bg-[#4318FF]/90"
            }`}
          >
            Upload Attachment
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
  );
};

