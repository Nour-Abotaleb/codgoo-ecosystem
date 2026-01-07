import { useState } from "react";
import toast from "react-hot-toast";
import { CloseModalIcon, EmailIcon, EyePasswordIcon, EyePasswordHideIcon, VerifiedIcon } from "@utilities/icons";
import type { DashboardTokens } from "../../types";
import { getModalInputClass } from "../../utils/modalStyles";
import { useChangeEmailMutation } from "../../../api/dashboard-api";

type ChangeEmailModalProps = {
  readonly tokens: DashboardTokens;
  readonly isOpen: boolean;
  readonly onClose: () => void;
  readonly currentEmail?: string;
  readonly onSave?: (data: {
    newEmail: string;
    password: string;
  }) => void;
  readonly primaryColor?: string;
};

export const ChangeEmailModal = ({
  tokens,
  isOpen,
  onClose,
  currentEmail = "yourname@example.com",
  onSave,
  primaryColor = "#071FD7"
}: ChangeEmailModalProps) => {
  const [newEmail, setNewEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [changeEmail, { isLoading }] = useChangeEmailMutation();

  const handleSave = async () => {
    if (!newEmail.trim()) {
      toast.error("Please enter a new email address");
      return;
    }
    if (!password.trim()) {
      toast.error("Please enter your password");
      return;
    }

    try {
      await changeEmail({
        new_email: newEmail.trim(),
        password: password.trim()
      }).unwrap();

      toast.success("Verification code sent to your new email");
      
      if (onSave) {
        onSave({
          newEmail: newEmail.trim(),
          password: password.trim()
        });
      }
      setNewEmail("");
      setPassword("");
      onClose();
    } catch (error: any) {
      console.error("Failed to change email:", error);
      const errorMessage = error?.data?.message || "Failed to change email";
      toast.error(errorMessage);
    }
  };

  const handleClose = () => {
    setNewEmail("");
    setPassword("");
    onClose();
  };

  const inputClass = getModalInputClass(tokens, { textColor: "text-[#2B3674]" });

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
                  <EmailIcon className={`h-5 w-5`} style={tokens.isDark ? {} : { color: primaryColor }} />
                </div>
                <h2 className={`text-lg md:text-xl font-semibold ${tokens.isDark ? "text-white" : "text-black"}`}>
                  Change Email
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
                 {/* Current Email */}
                 <div className="relative">
                   <label 
                     className={`absolute left-4 -top-2.5 px-2 text-sm font-medium z-10 ${
                       tokens.isDark 
                         ? "text-white/70 bg-[#0F1217]" 
                         : "text-black bg-white"
                     }`}
                   >
                     Current Email
                   </label>
                   <div className="relative">
                     <input
                       type="email"
                       value={currentEmail}
                       readOnly
                       className={`w-full bg-transparent px-4 py-3.5 rounded-[20px] placeholder:text-sm pe-24 ${
                         tokens.isDark 
                           ? "bg-[#1A1D29] border border-white/20 text-white" 
                           : "!bg-[#F7F7F7] border-0 text-black"
                       } focus:outline-none`}
                     />
                     <span className="absolute right-4 top-1/2 -translate-y-1/2 px-3 py-2 rounded-full text-sm font-medium bg-[#E2FFE9] text-[#34C759] flex items-center gap-1.5">
                       <VerifiedIcon className="h-5 w-3" />
                       Verified
                     </span>
                   </div>
                 </div>

                {/* New Email */}
                <div className="relative">
                  <label 
                    className={`absolute left-4 -top-2.5 px-2 text-sm font-medium z-10 ${
                      tokens.isDark 
                        ? "text-white/70 bg-[#0F1217]" 
                        : "text-black bg-white"
                    }`}
                  >
                    New Email
                  </label>
                  <div className="relative">
                    <input
                      type="email"
                      value={newEmail}
                      onChange={(e) => setNewEmail(e.target.value)}
                      className={inputClass}
                      placeholder="yourname@example.com"
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          handleSave();
                        }
                      }}
                    />
                  </div>
                </div>

                {/* Password */}
                <div className="relative">
                  <label 
                    className={`absolute left-4 -top-2.5 px-2 text-sm font-medium z-10 ${
                      tokens.isDark 
                        ? "text-white/70 bg-[#0F1217]" 
                        : "text-black bg-white"
                    }`}
                  >
                    Enter Password
                  </label>
                  <div className="relative">
                    <input
                      type={isPasswordVisible ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className={`${inputClass} pe-12`}
                      placeholder="************"
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          handleSave();
                        }
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => setIsPasswordVisible(!isPasswordVisible)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center justify-center"
                      aria-label={isPasswordVisible ? "Hide password" : "Show password"}
                    >
                      {isPasswordVisible ? (
                        <EyePasswordIcon className={`h-5 w-5 ${tokens.isDark ? "text-white/70" : "text-black"}`} />
                      ) : (
                        <EyePasswordHideIcon className={`h-5 w-5 ${tokens.isDark ? "text-white/70" : "text-black"}`} />
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className={`flex flex-col gap-3 mt-6 flex-shrink-0 border-t mx-6 ${tokens.isDark ? "border-white/20" : "border-[#E6E6E6]"} pt-2 pb-6`}>
              <button
                type="button"
                onClick={handleSave}
                disabled={isLoading}
                className="w-full py-3.5 rounded-full font-semibold transition-colors text-white hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
                style={{ backgroundColor: primaryColor }}
              >
                {isLoading ? "Sending..." : "Send Verification Code"}
              </button>
              <button
                type="button"
                onClick={handleClose}
                disabled={isLoading}
                className={`w-full px-6 py-2.5 rounded-full text-base font-medium transition-colors ${
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
      )}
    </>
  );
};

