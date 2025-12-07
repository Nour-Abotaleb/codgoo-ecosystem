import { useState } from "react";
import { PlusCircleIcon, PDFIcon, FileCodeIcon, CopyIcon, EyeFilledIcon, DocstIcon, FilePDFIcon, ImgIcon, EyeIcon } from "@utilities/icons";
import screenshotImage from "@assets/images/software/screenshot.svg";
import type { DashboardTokens } from "../../types";
import { AddAttachmentsModal } from "../modals/AddAttachmentsModal";

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
    return FilePDFIcon;
  }
  if (fileType === "png" || fileType === "jpg") {
    return ImgIcon;
  }
  if (fileType === "docx") {
    return DocstIcon;
  }
  return FileCodeIcon;
};

export const AttachmentsView = ({ tokens }: AttachmentsViewProps) => {
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [isAddAttachmentsModalOpen, setIsAddAttachmentsModalOpen] = useState(false);

  return (
    <div className="flex flex-col gap-6">
      {/* Header with Add Button */}
      <div className="flex items-center justify-end">
        <button
          type="button"
          onClick={() => setIsAddAttachmentsModalOpen(true)}
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
        {attachmentsData.map((attachment) => {
          const FileIcon = getFileIcon(attachment.fileType);
          const isImage = attachment.fileType === "png" || attachment.fileType === "jpg";
          const isDocx = attachment.fileType === "docx";
          const isPdf = attachment.fileType === "pdf";

          return (
            <div
              key={attachment.id}
              className={`${tokens.cardBase} rounded-2xl overflow-hidden transition-colors`}
            >
              {/* Preview Area */}
              <div className="h-48 bg-gradient-to-br from-[#071FD7]/10 to-[#071FD7]/5 flex flex-col relative group/image">
                <div className="flex-1 flex items-center justify-center relative overflow-hidden">
                  {isImage ? (
                    <div className="w-full h-full flex items-center justify-center relative">
                      <img 
                        src={screenshotImage} 
                        alt="Screenshot" 
                        className="w-full object-contain"
                      />
                      {/* Hover Overlay with Eye Icon */}
                      <div 
                        className="absolute inset-0 bg-black/25 opacity-0 group-hover/image:opacity-100 rounded-2xl transition-opacity duration-300 flex items-center justify-center cursor-pointer"
                        onClick={() => setPreviewImage(screenshotImage)}
                      >
                        <EyeIcon className="h-8 w-8 text-white" />
                      </div>
                    </div>
                  ) : isDocx ? (
                    <DocstIcon
                      className={`h-14 w-14 ${tokens.isDark ? "text-white/40" : "text-[#071FD7]"}`}
                    />
                  ) : isPdf ? (
                    <PDFIcon
                      className={`h-14 w-14 ${tokens.isDark ? "text-white/40" : "text-[#071FD7]"}`}
                    />
                  ) : null}
                </div>
                
                {/* Content Area */}
                <div className={`p-4 flex flex-col gap-3 ${tokens.isDark ? "border-b border-dashed border-[#2E3141]" : "border-b border-dashed border-[#E2E8FF]"}`}>
                  {/* File Name with Toggle */}
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2 flex-1 min-w-0">
                      <FileIcon
                        className={`h-4 w-4 flex-shrink-0 ${tokens.isDark ? "text-white" : "text-[#071FD7]"}`}
                      />
                      <span
                        className={`text-sm md:text-lg font-semibold truncate ${tokens.isDark ? "text-white" : "text-[#2B3674]"}`}
                      >
                        {attachment.fileName}
                      </span>
                    </div>
                    {/* Toggle Switch */}
                    {/* <label className="relative inline-flex items-center cursor-pointer">
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
                    </label> */}
                  </div>
                </div>
              </div>

            {/* Metadata */}
            <div className={`flex items-center justify-between px-4 py-2 ${tokens.isDark ? "" : "bg-[#FFFEF7]"}`}>
              <div className="flex items-start flex-col gap-2">
                <span className={`text-sm font-medium ${tokens.isDark ? "text-white" : "text-[#071FD7]"}`}>
                  {attachment.uploadedBy}
                </span>
                <span className="text-sm text-[#718EBF]">Uploaded by</span>
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
                    className="p-1.5 rounded-full transition-colors"
                    style={{ backgroundColor: "rgb(236,238,248)" }}
                    aria-label={`Delete attachment ${attachment.fileName}`}
                  >
                    <EyeFilledIcon className={`h-5 w-5 ${tokens.isDark ? "text-white" : "text-[#455BFF]"}`} />
                  </button>
                  <button
                    type="button"
                    className={`p-2 rounded-full transition-colors hover:opacity-80`}
                    style={{ backgroundColor: "rgb(236,238,248)" }}
                    aria-label={`Email attachment ${attachment.fileName}`}
                  >
                    <CopyIcon className="h-4 w-4 text-[#718EBF]" />
                  </button>
                </div>
                <span className={`text-sm text-[#718EBF]`}>Manage</span>
              </div>
            </div>
          </div>
          );
        })}
      </div>

      {/* Image Preview Modal */}
      {previewImage && (
        <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/75"
            onClick={() => setPreviewImage(null)}
          />

          {/* Modal */}
          <div className="relative max-w-5xl max-h-[90vh] flex items-center justify-center">
            <button
              type="button"
              onClick={() => setPreviewImage(null)}
              className={`absolute -top-10 -right-10 z-10 flex items-center justify-center w-8 h-8 rounded-full transition-colors ${
                tokens.isDark
                  ? "bg-white/90 text-black"
                  : "bg-white/90 text-gray-800"
              }`}
            >
              <span className="text-2xl leading-none">×</span>
            </button>
            <img
              src={previewImage}
              alt="Preview"
              className="max-w-full max-h-[90vh] object-contain rounded-lg"
            />
          </div>
        </div>
      )}

      {/* Add Attachments Modal */}
      <AddAttachmentsModal
        tokens={tokens}
        isOpen={isAddAttachmentsModalOpen}
        onClose={() => setIsAddAttachmentsModalOpen(false)}
        onUpload={(files) => {
          console.log("Uploaded files:", files);
          // Handle file upload here
        }}
      />
    </div>
  );
};

