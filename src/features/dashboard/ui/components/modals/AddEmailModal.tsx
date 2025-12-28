import { useState } from "react";
import { CloseModalIcon, TwoFactorAuthIcon } from "@utilities/icons";
import type { DashboardTokens } from "../../types";
import { getModalInputClass } from "../../utils/modalStyles";
import { EmailVerificationSuccessModal } from "./EmailVerificationSuccessModal";

type AddEmailModalProps = {
  readonly tokens: DashboardTokens;
  readonly isOpen: boolean;
  readonly onClose: () => void;
  readonly onAddEmail?: (email: string) => void;
  readonly onReopen?: () => void;
};

export const AddEmailModal = ({
  tokens,
  isOpen,
  onClose,
  onAddEmail,
  onReopen
}: AddEmailModalProps) => {
  const [email, setEmail] = useState("");
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [submittedEmail, setSubmittedEmail] = useState("");

  const handleAddEmail = () => {
    if (email.trim()) {
      const trimmedEmail = email.trim();
      setSubmittedEmail(trimmedEmail);
      if (onAddEmail) {
        onAddEmail(trimmedEmail);
      }
      setEmail("");
      onClose();
      setIsSuccessModalOpen(true);
    }
  };

  const handleClose = () => {
    setEmail("");
    onClose();
  };

  const inputClass = getModalInputClass(tokens, { paddingY: "py-3", textColor: "text-[#2B3674]" });

  return (
    <>
      {/* Add Email Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-[10001] flex items-center justify-center p-4">
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
                <div
                  className={`flex h-10 w-10 items-center justify-center rounded-full ${
                    tokens.isDark ? tokens.buttonGhost : ""
                  }`}
                  style={tokens.isDark ? {} : { backgroundColor: "#E6E9FB" }}
                >
                  <TwoFactorAuthIcon
                    className={`h-5 w-5`}
                    style={tokens.isDark ? {} : { color: "#071FD7" }}
                  />
                </div>
                <h2 className={`text-lg md:text-xl font-semibold ${tokens.isDark ? "text-white" : "text-black"}`}>
                  Enable Two-Factor Authentication
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
                {/* Add Email Section */}
                <div className="flex flex-col gap-4">
                  <h3 className={`text-lg font-semibold ${tokens.isDark ? "text-white" : "text-[#191D23]"}`}>
                    Add Email
                  </h3>

                  {/* Email Input */}
                  <div className="relative">
                    <label 
                      className={`absolute left-4 -top-2.5 px-2 text-sm font-medium z-10 ${
                        tokens.isDark 
                          ? "text-white/70 bg-[#232637]" 
                          : "text-black bg-white"
                      }`}
                    >
                      your Email
                    </label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className={inputClass}
                      placeholder="yourname@example.com"
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          handleAddEmail();
                        }
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className={`flex flex-col gap-3 mt-6 flex-shrink-0 border-t mx-6 ${tokens.isDark ? "border-white/20" : "border-[#E6E6E6]"} pt-2 pb-6`}>
              <button
                type="button"
                onClick={handleAddEmail}
                className={`w-full px-6 py-3 rounded-full text-base font-medium transition-colors ${
                  tokens.isDark
                    ? "bg-[#4318FF] text-white hover:bg-[#4318FF]/90"
                    : "bg-[#4318FF] text-white hover:bg-[#4318FF]/90"
                }`}
              >
                Add Email
              </button>
              <button
                type="button"
                onClick={handleClose}
                className={`w-full px-6 py-3 rounded-full text-base font-medium transition-colors ${
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

      {/* Email Verification Success Modal */}
      <EmailVerificationSuccessModal
        tokens={tokens}
        isOpen={isSuccessModalOpen}
        onClose={() => setIsSuccessModalOpen(false)}
        email={submittedEmail}
        onResend={() => {
          setIsSuccessModalOpen(false);
          if (onReopen) {
            onReopen();
          }
        }}
      />
    </>
  );
};

