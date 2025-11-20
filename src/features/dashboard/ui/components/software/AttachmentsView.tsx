import { useState } from "react";
import { PlusCircleIcon, PDFIcon, DeleteIcon, FileCodeIcon, MessageIcon } from "@utilities/icons";
import type { DashboardTokens } from "../../types";

type AttachmentsViewProps = {
  readonly tokens: DashboardTokens;
};

type AttachmentItem = {
  readonly id: string;
  readonly fileName: string;
  readonly fileType: "pdf" | "png" | "jpg" | "docx";
  readonly uploadedBy: string;
  readonly date: string;
  readonly isVisible: boolean;
  readonly previewUrl?: string;
};

const attachmentsData: readonly AttachmentItem[] = [
  {
    id: "att-1",
    fileName: "Figma_Design_v3.png",
    fileType: "png",
    uploadedBy: "Kareem Ahmed",
    date: "5 Nov 2025",
    isVisible: true,
  },
  {
    id: "att-2",
    fileName: "Figma_Design_v3.pdf",
    fileType: "pdf",
    uploadedBy: "Kareem Ahmed",
    date: "5 Nov 2025",
    isVisible: true,
  },
  {
    id: "att-3",
    fileName: "Project_Requirements.docx",
    fileType: "docx",
    uploadedBy: "Kareem Ahmed",
    date: "4 Nov 2025",
    isVisible: false,
  },
  {
    id: "att-4",
    fileName: "Wireframe_Sketch.png",
    fileType: "png",
    uploadedBy: "Kareem Ahmed",
    date: "3 Nov 2025",
    isVisible: true,
  },
  {
    id: "att-5",
    fileName: "Final_Design.pdf",
    fileType: "pdf",
    uploadedBy: "Kareem Ahmed",
    date: "2 Nov 2025",
    isVisible: true,
  },
  {
    id: "att-6",
    fileName: "Meeting_Notes.pdf",
    fileType: "pdf",
    uploadedBy: "Kareem Ahmed",
    date: "1 Nov 2025",
    isVisible: false,
  },
];

const getFileIcon = (fileType: AttachmentItem["fileType"]) => {
  if (fileType === "pdf") {
    return PDFIcon;
  }
  return FileCodeIcon;
};

export const AttachmentsView = ({ tokens }: AttachmentsViewProps) => {
  const [attachments, setAttachments] = useState<AttachmentItem[]>([...attachmentsData]);

  const toggleVisibility = (id: string) => {
    setAttachments((prev) =>
      prev.map((attachment) =>
        attachment.id === id ? { ...attachment, isVisible: !attachment.isVisible } : attachment
      )
    );
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Header with Add Button */}
      <div className="flex items-center justify-end">
        <button
          type="button"
          className={`flex items-center gap-2 px-4 py-2.5 rounded-full font-medium transition-colors cursor-pointer ${
            tokens.isDark
              ? "bg-[#071FD7] text-white hover:bg-[#071FD7]/90"
              : "bg-[#071FD7] text-white hover:bg-[#071FD7]/90"
          }`}
        >
          <PlusCircleIcon className="h-5 w-5 text-white" />
          <span>Add Attachment</span>
        </button>
      </div>

      {/* Attachments Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {attachments.map((attachment) => {
          const FileIcon = getFileIcon(attachment.fileType);
          const isImage = attachment.fileType === "png" || attachment.fileType === "jpg";

          return (
            <div
              key={attachment.id}
              className={`${tokens.cardBase} rounded-2xl border border-[var(--color-card-border)] overflow-hidden transition-colors`}
            >
              {/* Preview Area */}
              <div className="h-48 bg-gradient-to-br from-[#071FD7]/10 to-[#071FD7]/5 flex items-center justify-center relative">
                {isImage ? (
                  <div className="w-full h-full bg-white flex items-center justify-center">
                    {/* Placeholder for image - in real app this would be an img tag */}
                    {/* <div className="text-center p-4">
                      <div className="text-4xl font-bold text-[#071FD7]/30 mb-2">254</div>
                      <div className="text-2xl font-semibold text-[#071FD7]/30 mb-1">2545</div>
                      <div className="text-xl text-[#071FD7]/30 mb-2">330</div>
                      <div className="text-lg text-[#071FD7]/30">60%</div>
                    </div> */}
                  </div>
                ) : (
                  <PDFIcon
                    className={`h-16 w-16 ${tokens.isDark ? "text-white/20" : "text-[#071FD7]/30"}`}
                  />
                )}
              </div>

              {/* Content Area */}
              <div className={`p-4 flex flex-col gap-3 ${tokens.isDark ? "border-t border-dashed border-[#2E3141]" : "border-t border-dashed border-[#E2E8FF] bg-[#FFFEF7]"}`}>
                {/* File Name with Toggle */}
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2 flex-1 min-w-0">
                    <FileIcon
                      className={`h-4 w-4 flex-shrink-0 ${tokens.isDark ? "text-white" : "text-[#071FD7]"}`}
                    />
                    <span
                      className={`text-sm font-semibold truncate ${tokens.isDark ? "text-white" : "text-[#2B3674]"}`}
                    >
                      {attachment.fileName}
                    </span>
                  </div>
                  {/* Toggle Switch */}
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={attachment.isVisible}
                      onChange={() => toggleVisibility(attachment.id)}
                      className="sr-only peer"
                    />
                    <div
                      className={`relative w-9 h-5 rounded-full transition-colors ${
                        attachment.isVisible
                          ? "bg-[#071FD7]"
                          : tokens.isDark
                            ? "bg-gray-600"
                            : "bg-gray-300"
                      }`}
                    >
                      <div
                        className={`absolute top-[2px] left-[2px] bg-white rounded-full h-4 w-4 transition-transform ${
                          attachment.isVisible ? "translate-x-4" : "translate-x-0"
                        }`}
                      />
                    </div>
                  </label>
                </div>
              </div>

            {/* Metadata */}
            <div className="flex items-center justify-between px-4 py-2">
              <div className="flex items-start flex-col gap-2">
                <span className={`text-sm font-medium ${tokens.isDark ? "text-white" : "text-[#071FD7]"}`}>
                  {attachment.uploadedBy}
                </span>
                <span className={`text-sm ${tokens.isDark ? "text-white" : "text-black"}`}>Uploaded by</span>
              </div>
              <div className="flex items-start flex-col gap-2">
                <span className={`text-sm font-medium ${tokens.isDark ? "text-white" : "text-[#071FD7]"}`}>
                  {attachment.date}
                </span>
                <span className={`text-sm text-[#718EBF]`}>Date</span>
              </div>
              {/* Manage Section */}
              <div className="flex flex-col gap-2 items-start">
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    className={`p-1.5 rounded-full transition-colors ${
                      tokens.isDark ? "bg-[#071FD7]" : "bg-[#F4F5FF]"
                    } hover:opacity-80`}
                    aria-label={`Email attachment ${attachment.fileName}`}
                  >
                    <MessageIcon className={`h-4 w-4 ${tokens.isDark ? "text-white" : "text-[#071FD7]"}`} />
                  </button>
                  <button
                    type="button"
                    className="p-1.5 rounded-full transition-colors"
                    style={{ backgroundColor: "rgb(255,229,222)" }}
                    aria-label={`Delete attachment ${attachment.fileName}`}
                  >
                    <DeleteIcon className="h-4 w-4" style={{ color: "#FF0000" }} />
                  </button>
                </div>
                <span className={`text-sm text-[#718EBF]`}>Manage</span>
              </div>
            </div>
          </div>
          );
        })}
      </div>
    </div>
  );
};

