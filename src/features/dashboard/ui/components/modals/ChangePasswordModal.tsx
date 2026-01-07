import { useState } from "react";
import toast from "react-hot-toast";
import { CloseModalIcon, KeyIcon, EyePasswordIcon, EyePasswordHideIcon } from "@utilities/icons";
import type { DashboardTokens } from "../../types";
import { getModalInputClass } from "../../utils/modalStyles";
import { useChangePasswordMutation } from "../../../api/dashboard-api";

type ChangePasswordModalProps = {
  readonly tokens: DashboardTokens;
  readonly isOpen: boolean;
  readonly onClose: () => void;
  readonly onSave?: (data: {
    currentPassword: string;
    newPassword: string;
    confirmPassword: string;
  }) => void;
  readonly primaryColor?: string;
};

export const ChangePasswordModal = ({
  tokens,
  isOpen,
  onClose,
  onSave,
  primaryColor = "#071FD7"
}: ChangePasswordModalProps) => {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isCurrentPasswordVisible, setIsCurrentPasswordVisible] = useState(false);
  const [isNewPasswordVisible, setIsNewPasswordVisible] = useState(false);
  const [isConfirmPasswordVisible, setIsConfirmPasswordVisible] = useState(false);
  const [changePassword, { isLoading }] = useChangePasswordMutation();

  const handleSave = async () => {
    if (!currentPassword.trim()) {
      toast.error("Please enter your current password");
      return;
    }
    if (!newPassword.trim()) {
      toast.error("Please enter a new password");
      return;
    }
    if (!confirmPassword.trim()) {
      toast.error("Please confirm your new password");
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error("New passwords do not match");
      return;
    }

    try {
      await changePassword({
        current_password: currentPassword.trim(),
        new_password: newPassword.trim(),
        new_password_confirmation: confirmPassword.trim()
      }).unwrap();

      toast.success("Password changed successfully");
      
      if (onSave) {
        onSave({
          currentPassword: currentPassword.trim(),
          newPassword: newPassword.trim(),
          confirmPassword: confirmPassword.trim()
        });
      }
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      onClose();
    } catch (error: any) {
      console.error("Failed to change password:", error);
      const errorMessage = error?.data?.message || "Failed to change password";
      toast.error(errorMessage);
    }
  };

  const handleClose = () => {
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
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
                  <KeyIcon className={`h-5 w-5`} style={tokens.isDark ? {} : { color: primaryColor }} />
                </div>
                <h2 className={`text-lg md:text-xl font-semibold ${tokens.isDark ? "text-white" : "text-black"}`}>
                  Change Password
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
                {/* Current Password */}
                <div className="relative">
                  <label 
                    className={`absolute left-4 -top-2.5 px-2 text-sm font-medium z-10 ${
                      tokens.isDark 
                        ? "text-white/70 bg-[#0F1217]" 
                        : "text-black bg-white"
                    }`}
                  >
                    Current Password
                  </label>
                  <div className="relative">
                    <input
                      type={isCurrentPasswordVisible ? "text" : "password"}
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      className={`${inputClass} pe-12`}
                      placeholder="Enter current password"
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          handleSave();
                        }
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => setIsCurrentPasswordVisible(!isCurrentPasswordVisible)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center justify-center"
                      aria-label={isCurrentPasswordVisible ? "Hide password" : "Show password"}
                    >
                      {isCurrentPasswordVisible ? (
                        <EyePasswordIcon className="h-5 w-5" style={{ color: primaryColor }} />
                      ) : (
                        <EyePasswordHideIcon className="h-5 w-5" style={{ color: primaryColor }} />
                      )}
                    </button>
                  </div>
                </div>

                {/* New Password */}
                <div className="relative">
                  <label 
                    className={`absolute left-4 -top-2.5 px-2 text-sm font-medium z-10 ${
                      tokens.isDark 
                        ? "text-white/70 bg-[#0F1217]" 
                        : "text-black bg-white"
                    }`}
                  >
                    New Password
                  </label>
                  <div className="relative">
                    <input
                      type={isNewPasswordVisible ? "text" : "password"}
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
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
                      onClick={() => setIsNewPasswordVisible(!isNewPasswordVisible)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center justify-center"
                      aria-label={isNewPasswordVisible ? "Hide password" : "Show password"}
                    >
                      {isNewPasswordVisible ? (
                        <EyePasswordIcon className={`h-5 w-5 ${tokens.isDark ? "text-white/70" : "text-black"}`} />
                      ) : (
                        <EyePasswordHideIcon className={`h-5 w-5 ${tokens.isDark ? "text-white/70" : "text-black"}`} />
                      )}
                    </button>
                  </div>
                </div>

                {/* Confirm Password */}
                <div className="relative">
                  <label 
                    className={`absolute left-4 -top-2.5 px-2 text-sm font-medium z-10 ${
                      tokens.isDark 
                        ? "text-white/70 bg-[#0F1217]" 
                        : "text-black bg-white"
                    }`}
                  >
                    Confirm Password
                  </label>
                  <div className="relative">
                    <input
                      type={isConfirmPasswordVisible ? "text" : "password"}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
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
                      onClick={() => setIsConfirmPasswordVisible(!isConfirmPasswordVisible)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center justify-center"
                      aria-label={isConfirmPasswordVisible ? "Hide password" : "Show password"}
                    >
                      {isConfirmPasswordVisible ? (
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
                {isLoading ? "Changing..." : "Change Password"}
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

