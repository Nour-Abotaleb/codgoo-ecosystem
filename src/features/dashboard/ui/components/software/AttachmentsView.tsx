import { useState, useMemo } from "react";
import { useTranslation } from "react-i18next";
import toast from "react-hot-toast";
import { PlusCircleIcon, PDFIcon, FileCodeIcon, CopyIcon, EyeFilledIcon, DocstIcon, FilePDFIcon, ImgIcon, EyeIcon } from "@utilities/icons";
import screenshotImage from "@assets/images/software/screenshot.svg";
import type { DashboardTokens } from "../../types";
import { AddAttachmentsModal } from "../modals/AddAttachmentsModal";
import { useGetProjectAttachmentsQuery, useUploadProjectAttachmentMutation } from "@features/dashboard/api/dashboard-api";

type AttachmentsViewProps = {
  readonly tokens: DashboardTokens;
  readonly projectId: string;
};

type AttachmentItem = {
  readonly id: string;
  readonly fileName: string;
  readonly fileType: "pdf" | "png" | "jpg" | "jpeg" | "docx";
  readonly uploadedBy: string;
  readonly uploadedById: number;
  readonly uploadedByImage: string | null;
  readonly uploadedByType: string;
  readonly date: string;
  readonly lastActivity: string;
  readonly filePath: string;
  readonly isVisible: boolean;
  readonly previewUrl?: string;
};

const getFileIcon = (fileType: AttachmentItem["fileType"]) => {
  if (fileType === "pdf") {
    return FilePDFIcon;
  }
  if (fileType === "png" || fileType === "jpg" || fileType === "jpeg") {
    return ImgIcon;
  }
  if (fileType === "docx") {
    return DocstIcon;
  }
  return FileCodeIcon;
};

export const AttachmentsView = ({ tokens, projectId }: AttachmentsViewProps) => {
  const { t } = useTranslation("landing");
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [isAddAttachmentsModalOpen, setIsAddAttachmentsModalOpen] = useState(false);

  // Fetch attachments from API
  const projectIdNum = parseInt(projectId, 10);
  const { data: apiData, isLoading, refetch } = useGetProjectAttachmentsQuery(projectIdNum);
  
  // Upload mutation
  const [uploadAttachment] = useUploadProjectAttachmentMutation();

  // Handle file upload
  const handleUpload = async (files: File[]) => {
    if (files.length === 0) return;

    try {
      // Upload each file (API expects single file with key "attachments")
      for (const file of files) {
        await uploadAttachment({
          projectId: projectIdNum,
          file: file
        }).unwrap();
      }
      
      // Refetch attachments after upload
      refetch();
      toast.success('Attachments uploaded successfully!');
    } catch (error: any) {
      console.error('Error uploading attachments:', error);
      toast.error(error?.data?.message || 'Failed to upload attachments. Please try again.');
    }
  };

  // Transform API data with N/A fallbacks
  const attachmentsData = useMemo(() => {
    if (apiData?.data) {
      return apiData.data.map((attachment: any): AttachmentItem => {
        // Extract file extension from file_type or file_path
        const getFileType = (): AttachmentItem["fileType"] => {
          const fileType = attachment.file_type?.toLowerCase() || "";
          if (fileType.includes("pdf")) return "pdf";
          if (fileType.includes("png")) return "png";
          if (fileType.includes("jpg") || fileType.includes("jpeg")) return "jpeg";
          if (fileType.includes("docx") || fileType.includes("document")) return "docx";
          
          // Fallback to file extension from path
          const path = attachment.file_path || "";
          if (path.endsWith(".pdf")) return "pdf";
          if (path.endsWith(".png")) return "png";
          if (path.endsWith(".jpg") || path.endsWith(".jpeg")) return "jpeg";
          if (path.endsWith(".docx")) return "docx";
          
          return "png"; // default
        };

        // Extract filename from path
        const getFileName = () => {
          const path = attachment.file_path || "";
          const parts = path.split("/");
          return parts[parts.length - 1] || "N/A";
        };

        return {
          id: String(attachment.id),
          fileName: getFileName(),
          fileType: getFileType(),
          uploadedBy: attachment.uploaded_by?.name || "N/A",
          uploadedById: attachment.uploaded_by_id || 0,
          uploadedByImage: attachment.uploaded_by?.image || null,
          uploadedByType: attachment.uploaded_by?.type || "N/A",
          date: attachment.date_uploaded || "N/A",
          lastActivity: attachment.last_activity || "N/A",
          filePath: attachment.file_path || "",
          isVisible: true,
          previewUrl: attachment.file_path
        };
      });
    }
    return [];
  }, [apiData]);

  return (
    <div className="flex flex-col gap-6">
      {/* Header with Add Button */}
      <div className="flex items-center justify-end">
        <button
          type="button"
          onClick={() => setIsAddAttachmentsModalOpen(true)}
          className={`flex flex-wrap items-center gap-2 px-4 py-2.5 rounded-full font-medium transition-colors cursor-pointer ${
            tokens.isDark
              ? "bg-[#071FD7] text-white hover:bg-[#071FD7]/90"
              : "bg-[#071FD7] text-white hover:bg-[#071FD7]/90"
          }`}
        >
          <PlusCircleIcon className="h-5 w-5 text-white" />
          <span>{t("dashboard.attachment.addAttachment")}</span>
        </button>
      </div>

      {/* Attachments Grid */}
      {isLoading ? (
        <div className="text-center py-12">
          <p className={tokens.isDark ? "text-white/50" : "text-[#A3AED0]"}>{t("dashboard.attachment.loadingAttachments")}</p>
        </div>
      ) : attachmentsData.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {attachmentsData.map((attachment) => {
            const FileIcon = getFileIcon(attachment.fileType);
            const isImage = attachment.fileType === "png" || attachment.fileType === "jpg" || attachment.fileType === "jpeg";
            const isDocx = attachment.fileType === "docx";
            const isPdf = attachment.fileType === "pdf";
            const docIconColor = tokens.isDark ? "#FFFFFF" : "#071FD7";

            return (
            <div
              key={attachment.id}
              className={`${tokens.cardBase} rounded-[20px] overflow-hidden transition-colors`}
            >
              {/* Preview Area */}
              <div className={`h-60 ${tokens.isDark ? "bg-transparent " : "bg-[#F4F5FF]"} flex flex-col relative group/image`}>
                <div className="flex-1 flex items-center justify-center relative overflow-hidden p-3">
                  {isImage ? (
                    <div
                      className={`w-full h-full flex items-center justify-center relative rounded-[20px] overflow-hidden p-3 ${
                        tokens.isDark ? "bg-[#1D1D2D]" : "bg-[#E9ECFF]"
                      }`}
                    >
                      <img 
                        src={attachment.filePath || screenshotImage} 
                        alt={attachment.fileName} 
                        className="object-contain max-w-full max-h-full"
                      />
                      {/* Hover Overlay with Eye Icon */}
                      <div 
                        className="absolute inset-0 bg-black/25 opacity-0 group-hover/image:opacity-100 rounded-[20px] transition-opacity duration-300 flex items-center justify-center cursor-pointer"
                        onClick={() => setPreviewImage(attachment.filePath || screenshotImage)}
                      >
                        <EyeIcon className="h-8 w-8 text-white" />
                      </div>
                    </div>
                  ) : isDocx ? (
                    <div className={`rounded-[20px] w-full h-full flex items-center justify-center ${
                      tokens.isDark ? "bg-[#1D1D2D]" : "bg-[#E9ECFF]"
                    }`}>
                      <DocstIcon
                        className={`h-14 w-14 ${tokens.isDark ? "text-white/40" : "text-[#071FD7]"}`}
                      />
                    </div>
                  ) : isPdf ? (
                    <div className={`rounded-[20px] w-full h-full flex items-center justify-center ${
                      tokens.isDark ? "bg-[#1D1D2D]" : "bg-[#E9ECFF]"
                    }`}>
                      <PDFIcon
                        className={`h-14 w-14 ${tokens.isDark ? "text-white/40" : "text-[#071FD7]"}`}
                      />
                    </div>
                  ) : null}
                </div>
                
                {/* Content Area */}
                <div className={`px-4 pb-4 flex flex-col gap-3 ${tokens.isDark ? "border-b border-dashed border-[#2E3141]" : "border-b border-dashed border-[#E2E8FF]"}`}>
                  {/* File Name with Toggle */}
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex flex-wrap items-center gap-2 flex-1 min-w-0">
                      {isDocx ? (
                        <svg
                          className="h-5 w-5 flex-shrink-0"
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M19.0712 14.2396C18.7812 14.5296 18.3212 14.5296 18.0413 14.2396C17.7513 13.9496 17.7513 13.4896 18.0413 13.2096C20.0413 11.2096 20.0413 7.95961 18.0413 5.96961C16.0413 3.97961 12.7912 3.96961 10.8012 5.96961C8.81125 7.96961 8.80125 11.2196 10.8012 13.2096C11.0912 13.4996 11.0912 13.9596 10.8012 14.2396C10.5112 14.5296 10.0512 14.5296 9.77125 14.2396C7.20125 11.6696 7.20125 7.48961 9.77125 4.92961C12.3412 2.36961 16.5212 2.35961 19.0812 4.92961C21.6412 7.49961 21.6412 11.6696 19.0712 14.2396Z"
                            fill={docIconColor}
                          />
                          <path
                            opacity="0.4"
                            d="M19.0695 4.92945C21.6395 7.49945 21.6395 11.6695 19.0695 14.2395C18.1895 15.1195 17.1095 15.6995 15.9795 15.9795C16.5095 13.8195 15.9295 11.4495 14.2395 9.75945C12.5495 8.06945 10.1795 7.48945 8.01953 8.01945C8.29953 6.88945 8.86953 5.80945 9.75953 4.92945C12.3295 2.35945 16.4995 2.35945 19.0695 4.92945Z"
                            fill={docIconColor}
                          />
                          <path
                            d="M4.92875 9.76047C5.21875 9.47047 5.67875 9.47047 5.95875 9.76047C6.24875 10.0505 6.24875 10.5105 5.95875 10.7905C3.95875 12.7905 3.95875 16.0405 5.95875 18.0305C7.95875 20.0205 11.2088 20.0305 13.1988 18.0305C15.1888 16.0305 15.1988 12.7805 13.1988 10.7905C12.9088 10.5005 12.9088 10.0405 13.1988 9.76047C13.4888 9.47047 13.9488 9.47047 14.2288 9.76047C16.7988 12.3305 16.7988 16.5105 14.2288 19.0705C11.6588 21.6305 7.47875 21.6405 4.91875 19.0705C2.35875 16.5005 2.35875 12.3305 4.92875 9.76047Z"
                            fill={docIconColor}
                          />
                          <path
                            opacity="0.5"
                            d="M14.2414 9.75988C15.9314 11.4499 16.5114 13.8199 15.9814 15.9799C15.7014 17.1099 15.1214 18.1899 14.2414 19.0699C11.6714 21.6399 7.50141 21.6399 4.93141 19.0699C2.36141 16.4999 2.36141 12.3299 4.93141 9.75988C5.81141 8.86988 6.89141 8.29988 8.02141 8.01988C10.1814 7.48988 12.5514 8.06988 14.2414 9.75988Z"
                            fill={docIconColor}
                          />
                        </svg>
                      ) : (
                        <FileIcon
                          className={`h-4 w-4 flex-shrink-0 ${tokens.isDark ? "text-white" : "text-[#071FD7]"}`}
                        />
                      )}
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
            <div className={`flex flex-wrap items-center justify-between px-4 py-2 ${tokens.isDark ? "bg-transparent " : "bg-[#FFFEF7]"}`}>
              <div className="flex items-start flex-col gap-2">
                <span className={`text-sm font-medium ${tokens.isDark ? "text-white" : "text-[#071FD7]"}`}>
                  {attachment.uploadedBy}
                </span>
                <span className={`text-sm ${tokens.isDark ? "text-white/60" : "text-[#718EBF]"}`}>{t("dashboard.attachment.uploadedBy")}</span>
              </div>
              <div className="flex items-start flex-col gap-2">
                <span className={`text-sm font-medium ${tokens.isDark ? "text-white" : "text-[#071FD7]"}`}>
                  {attachment.date}
                </span>
                <span className={`text-sm ${tokens.isDark ? "text-white/60" : "text-[#718EBF]"}`}>{t("dashboard.attachment.date")}</span>
              </div>
              {/* Manage Section */}
              <div className="flex flex-col gap-2 items-start">
                <div className="flex flex-wrap items-center gap-2">
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
                <span className={`text-sm text-[#718EBF]`}>{t("dashboard.project.manage")}</span>
              </div>
            </div>
          </div>
          );
        })}
      </div>
      ) : (
        <div className="text-center py-12">
          <p className={tokens.isDark ? "text-white/50" : "text-[#A3AED0]"}>{t("dashboard.attachment.noAttachmentsFound")}</p>
        </div>
      )}

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
        onUpload={handleUpload}
      />
    </div>
  );
};

