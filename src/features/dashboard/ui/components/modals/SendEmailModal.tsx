import { useState } from "react";
import { CloseModalIcon } from "@utilities/icons";
import type { DashboardTokens } from "../../types";
import { getModalInputClass } from "../../utils/modalStyles";

// Ticket Icon
const TicketIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path d="M1.94727 10.508C1.94727 7.65494 3.26184 6.10667 5.88123 5.88271C6.11494 5.8535 6.35837 5.84375 6.61155 5.84375H12.8436C15.9498 5.84375 17.5078 7.40176 17.5078 10.508V14.403C17.5078 14.6562 17.4981 14.8997 17.4689 15.1334C17.2449 17.7625 15.6967 19.0673 12.8436 19.0673H12.4541C12.2106 19.0673 11.9769 19.1842 11.8308 19.3789L10.6624 20.9369C10.1463 21.6283 9.30883 21.6283 8.79275 20.9369L7.62423 19.3789C7.49764 19.2134 7.21527 19.0673 7.00104 19.0673H6.61155C3.50528 19.0673 1.94727 18.2981 1.94727 14.403" stroke="currentColor" strokeWidth="1.46063" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M21.4025 6.6135C21.4025 3.50723 19.8445 1.94922 16.7382 1.94922H10.5062C7.65309 1.94922 6.10482 3.26379 5.88086 5.88319C6.11456 5.85398 6.358 5.84423 6.61117 5.84423H12.8432C15.9495 5.84423 17.5075 7.40224 17.5075 10.5085V14.4035C17.5075 14.6567 17.4977 14.9001 17.4685 15.1338C20.0879 14.9099 21.4025 13.3713 21.4025 10.5085" stroke="currentColor" strokeWidth="1.46063" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M13.1407 12.9009H13.1495" stroke="currentColor" strokeWidth="1.94751" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M9.73249 12.9009H9.74126" stroke="currentColor" strokeWidth="1.94751" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M6.32429 12.9009H6.33306" stroke="currentColor" strokeWidth="1.94751" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

// Upload Icon
const UploadIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg width="22" height="21" viewBox="0 0 22 21" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path d="M10.9914 10.0158V19.0158M10.9914 10.0158L8.49142 12.0158M10.9914 10.0158L13.4914 12.0158M4.02542 7.13281C3.07963 7.3708 2.25329 7.94597 1.70167 8.75025C1.15005 9.55453 0.911099 10.5326 1.02972 11.5006C1.14835 12.4686 1.61638 13.36 2.34588 14.0073C3.07538 14.6546 4.01615 15.0132 4.99142 15.0158H5.99142" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M14.8209 5.15334C14.4791 3.79992 13.6355 2.62708 12.461 1.8726C11.2866 1.11812 9.86916 0.838434 8.49614 1.09025C7.12312 1.34206 5.89722 2.10653 5.06694 3.22868C4.23667 4.35084 3.86414 5.74671 4.02488 7.13334C4.02488 7.13334 4.17788 8.01534 4.49088 8.51534" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M15.9922 15.0156C16.6982 15.0151 17.3962 14.8651 18.04 14.5755C18.6839 14.2858 19.2592 13.8631 19.7279 13.3351C20.1966 12.8071 20.5482 12.1858 20.7596 11.5122C20.9709 10.8385 21.0371 10.1277 20.954 9.42657C20.8708 8.72545 20.6401 8.04989 20.277 7.44436C19.9139 6.83884 19.4267 6.31707 18.8474 5.91341C18.2682 5.50975 17.61 5.23334 16.9162 5.10239C16.2224 4.97143 15.5087 4.98889 14.8222 5.15362L13.4922 5.51562" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

type SendEmailModalProps = {
  readonly tokens: DashboardTokens;
  readonly isOpen: boolean;
  readonly onClose: () => void;
  readonly onSubmit?: (data: {
    subject: string;
    message: string;
    attachments: File[];
  }) => void;
  readonly primaryColor?: string;
  readonly supportEmail?: string;
};

export const SendEmailModal = ({
  tokens,
  isOpen,
  onClose,
  onSubmit,
  primaryColor = "#0F6773",
  supportEmail = "support@example.com"
}: SendEmailModalProps) => {
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [attachments, setAttachments] = useState<File[]>([]);

  const handleSubmit = () => {
    if (subject.trim() && message.trim()) {
      if (onSubmit) {
        onSubmit({ subject, message, attachments });
      }
      resetForm();
      onClose();
    }
  };

  const resetForm = () => {
    setSubject("");
    setMessage("");
    setAttachments([]);
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setAttachments(Array.from(e.target.files));
    }
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
          tokens.isDark ? "bg-[#0F1217]" : "bg-"
        }`}>
          <div className="flex flex-wrap items-center gap-3">
            <div
              className={`flex h-10 w-10 items-center justify-center rounded-full ${
                tokens.isDark ? tokens.buttonGhost : ""
              }`}
              style={tokens.isDark ? {} : { backgroundColor: "#D0EBE3" }}
            >
              <TicketIcon
                className="h-5 w-5"
                style={tokens.isDark ? {} : { color: primaryColor }}
              />
            </div>
            <h2 className={`text-lg md:text-xl font-semibold ${tokens.isDark ? "text-white" : "text-black"}`}>
              Send Email To Support
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
          <div className="flex flex-col gap-5">
            {/* Subject */}
            <div className="relative">
              <label 
                className={`absolute left-4 -top-2.5 px-2 text-sm font-medium z-10 ${
                  tokens.isDark 
                    ? "text-white/70 bg-[#0F1217]" 
                    : "text-black  bg-white"
                }`}
              >
                Subject
              </label>
              <input
                type="text"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className={inputClass}
                placeholder="Email subject"
              />
            </div>

            {/* Message */}
            <div className="relative">
              <label 
                className={`absolute left-4 -top-2.5 px-2 text-sm font-medium z-10 ${
                  tokens.isDark 
                    ? "text-white/70 bg-[#0F1217]" 
                    : "text-black  bg-white"
                }`}
              >
                Message
              </label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={5}
                className={`${inputClass} resize-none`}
                placeholder="Type Your message here..."
              />
            </div>

            {/* Attachments */}
            <div>
              <h3 className={`text-sm font-medium mb-3 ${tokens.isDark ? "text-white" : "text-black"}`}>
                Attachments
              </h3>
              <label 
                className={`flex flex-col items-center justify-center gap-2 p-6 border-2 border-dashed rounded-xl cursor-pointer transition-colors ${
                  tokens.isDark 
                    ? "border-white/20 hover:border-white/40" 
                    : "border-gray-300 hover:border-gray-400"
                }`}
              >
                <UploadIcon 
                  className="h-8 w-8"
                  style={{ color: tokens.isDark ? "#fff" : "#666" }}
                />
                <span className={`text-sm ${tokens.subtleText}`}>
                  Click to upload Attachments (PDF, DOC, DOCX)
                </span>
                <input
                  type="file"
                  multiple
                  accept=".pdf,.doc,.docx,.png,.jpg,.jpeg"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </label>
              {attachments.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-2">
                  {attachments.map((file, index) => (
                    <span 
                      key={index}
                      className="px-3 py-1 text-xs font-medium rounded-full"
                      style={{ backgroundColor: "#E7F0F1", color: primaryColor }}
                    >
                      {file.name}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Support Email Info */}
            <div 
              className="flex flex-wrap items-center gap-3 p-4 rounded-xl"
              style={{ backgroundColor: "#E7F0F1" }}
            >
              <div
                className="flex h-10 w-10 items-center justify-center rounded-full"
                style={{ backgroundColor: "#D0EBE3" }}
              >
                <TicketIcon
                  className="h-5 w-5"
                  style={{ color: primaryColor }}
                />
              </div>
              <div>
                <p className="text-sm font-medium" style={{ color: primaryColor }}>
                  Support Email
                </p>
                <p className={`text-sm ${tokens.isDark ? "text-white" : "text-black"}`}>
                  {supportEmail}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className={`flex flex-col gap-3 mt-6 flex-shrink-0 border-t mx-6 ${tokens.isDark ? "border-white/20" : "border-[#E6E6E6]"} pt-4 pb-6`}>
          <button
            type="button"
            onClick={handleSubmit}
            className={`w-full px-6 py-3 rounded-full text-base font-medium transition-colors text-white hover:opacity-90 ${
              !subject.trim() || !message.trim() ? "cursor-not-allowed" : ""
            }`}
            style={{ backgroundColor: primaryColor }}
          >
            Send Email
          </button>
          <button
            type="button"
            onClick={handleClose}
            className={`w-full px-6 py-3 rounded-full text-base font-medium transition-colors ${
              tokens.isDark
                ? "border border-white/20 text-white hover:bg-white/10 bg-transparent"
                : "bg-transparent hover:opacity-80"
            }`}
            style={tokens.isDark ? {} : { color: primaryColor, borderWidth: "1px", borderStyle: "solid", borderColor: primaryColor }}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};
