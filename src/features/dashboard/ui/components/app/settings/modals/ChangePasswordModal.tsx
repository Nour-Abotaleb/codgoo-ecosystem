import { useState } from "react";
import { CloseModalIcon, KeyIcon, EyePasswordIcon, EyePasswordHideIcon } from "@utilities/icons";
import type { DashboardTokens } from "../../../../types";
import { getModalInputClass } from "../../../../utils/modalStyles";
import { APP_COLORS } from "../../../../styles/app/colors";

type ChangePasswordModalProps = {
  readonly tokens: DashboardTokens;
  readonly isOpen: boolean;
  readonly onClose: () => void;
  readonly onSave?: (data: {
    currentPassword: string;
    newPassword: string;
    confirmPassword: string;
  }) => void;
};

export const ChangePasswordModal = ({
  tokens,
  isOpen,
  onClose,
  onSave
}: ChangePasswordModalProps) => {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isCurrentPasswordVisible, setIsCurrentPasswordVisible] = useState(true);
  const [isNewPasswordVisible, setIsNewPasswordVisible] = useState(false);
  const [isConfirmPasswordVisible, setIsConfirmPasswordVisible] = useState(false);

  const handleSave = () => {
    if (currentPassword.trim() && newPassword.trim() && confirmPassword.trim()) {
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
          <div className={`relative w-full max-w-xl ${tokens.cardBase} ${tokens.isDark ? "bg-[#232637]" : "bg-white"} rounded-2xl max-h-[90vh] overflow-hidden flex flex-col`}>
            {/* Header */}
            <div className={`flex items-center justify-between px-6 pt-6 pb-4 flex-shrink-0 rounded-t-2xl ${
              tokens.isDark ? "bg-[#232637]" : "bg-[#FFFEF7]"
            }`}>
              <div className="flex items-center gap-3">
                <div className={`flex h-9 w-9 items-center justify-center rounded-full ${tokens.isDark ? tokens.buttonGhost : ""}`} style={tokens.isDark ? {} : { backgroundColor: APP_COLORS.buttonBackground }}>
                  <KeyIcon className={`h-5 w-5`} style={tokens.isDark ? {} : { color: APP_COLORS.primary }} />
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
                        ? "text-white/70 bg-[#232637]" 
                        : "text-black bg-[var(--color-card-bg)]"
                    }`}
                  >
                    Current Password
                  </label>
                  <div className="relative">
                    <input
                      type={isCurrentPasswordVisible ? "text" : "password"}
                      value={currentPassword}
                      readOnly
                      className={`${inputClass} pe-12`}
                      placeholder="123456789"
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
                        <EyePasswordIcon className="h-5 w-5" style={{ color: APP_COLORS.primary }} />
                      ) : (
                        <EyePasswordHideIcon className="h-5 w-5" style={{ color: APP_COLORS.primary }} />
                      )}
                    </button>
                  </div>
                </div>

                {/* New Password */}
                <div className="relative">
                  <label 
                    className={`absolute left-4 -top-2.5 px-2 text-sm font-medium z-10 ${
                      tokens.isDark 
                        ? "text-white/70 bg-[#232637]" 
                        : "text-black bg-[var(--color-card-bg)]"
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
                        <EyePasswordIcon className={`h-5 w-5 ${tokens.isDark ? "text-white/70" : "text-gray-500"}`} />
                      ) : (
                        <EyePasswordHideIcon className={`h-5 w-5 ${tokens.isDark ? "text-white/70" : "text-gray-500"}`} />
                      )}
                    </button>
                  </div>
                </div>

                {/* Confirm Password */}
                <div className="relative">
                  <label 
                    className={`absolute left-4 -top-2.5 px-2 text-sm font-medium z-10 ${
                      tokens.isDark 
                        ? "text-white/70 bg-[#232637]" 
                        : "text-black bg-[var(--color-card-bg)]"
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
                        <EyePasswordIcon className={`h-5 w-5 ${tokens.isDark ? "text-white/70" : "text-gray-500"}`} />
                      ) : (
                        <EyePasswordHideIcon className={`h-5 w-5 ${tokens.isDark ? "text-white/70" : "text-gray-500"}`} />
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
                className="w-full px-6 py-3 rounded-full text-base font-medium transition-colors text-white"
                style={{ backgroundColor: APP_COLORS.primary }}
              >
                Change Password
              </button>
              <button
                type="button"
                onClick={handleClose}
                className={`w-full px-6 py-2.5 rounded-full text-base font-medium transition-colors ${
                  tokens.isDark
                    ? "border border-white/20 text-white hover:bg-white/10 bg-transparent"
                    : "border bg-white"
                }`}
                style={tokens.isDark ? {} : { borderColor: APP_COLORS.primary, color: APP_COLORS.primary }}
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
