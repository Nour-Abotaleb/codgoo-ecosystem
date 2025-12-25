import { useState } from "react";
import type { DashboardTokens } from "../../../../types";
import { EditIcon } from "@utilities/icons";
import { AddEmailModal } from "./AddEmailModal";
import { APP_COLORS } from "../../../../styles/app/colors";

type TwoFactorAuthModalProps = {
  readonly tokens: DashboardTokens;
  readonly isOpen: boolean;
  readonly onClose: () => void;
  readonly initialStatus?: boolean;
  readonly initialMethod?: string;
  readonly initialEmail?: string;
  readonly initialPhone?: string;
  readonly onSave?: (data: {
    status: boolean;
    method: string;
    email: string;
    phone: string;
  }) => void;
};

const ToggleSwitch = ({
  checked,
  onChange
}: {
  readonly checked: boolean;
  readonly onChange: (checked: boolean) => void;
}) => {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors focus:outline-none ${
        checked ? "" : "bg-gray-300"
      }`}
      style={checked ? { backgroundColor: APP_COLORS.primary } : {}}
    >
      <span
        className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white transition-transform ${
          checked ? "translate-x-4.5" : "translate-x-0.5"
        }`}
      />
    </button>
  );
};

export const TwoFactorAuthModal = ({
  tokens,
  isOpen,
  onClose,
  initialStatus = false,
  initialMethod = "Email",
  // initialEmail = "",
  initialPhone = "",
  onSave
}: TwoFactorAuthModalProps) => {
  const [status, setStatus] = useState(initialStatus);
  const [isAddEmailModalOpen, setIsAddEmailModalOpen] = useState(false);

  const sectionTitleClass = `text-lg font-bold ${tokens.isDark ? "text-white" : "text-[#2B3674]"}`;
  const labelClass = `text-sm md:text-base font-medium ${tokens.isDark ? "text-white/70" : "text-[#2B3674]"}`;

  return (
    <>
      {/* Two-Factor Authentication Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/50"
            onClick={onClose}
          />

          {/* Modal */}
          <div className={`relative w-full max-w-lg ${tokens.cardBase} ${tokens.isDark ? "bg-[#232637]" : "bg-white"} rounded-[20px] p-6 max-h-[90vh] overflow-hidden flex flex-col`}>
            {/* Header */}
            <div className="flex items-center justify-between mb-2 flex-shrink-0">
              <div className="flex items-center gap-3">
                <h2 className={`text-lg md:text-2xl font-bold ${tokens.isDark ? "text-white" : "text-[#2B3674]"}`}>
                    Two-Factor Authentication (2FA)
                </h2>
              </div>
              <button
                  type="button"
                  onClick={() => {
                    onClose();
                    setIsAddEmailModalOpen(true);
                  }}
                  className={`flex h-9 w-9 items-center justify-center rounded-full transition-colors ${tokens.isDark ? tokens.buttonGhost : ""}`}
                  style={tokens.isDark ? {} : { backgroundColor: APP_COLORS.buttonBackground }}
                  aria-label="Add email for 2FA"
                >
                  <EditIcon className={`h-4 w-4`} style={tokens.isDark ? {} : { color: APP_COLORS.primary }} />
                </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto scrollbar-hide">
              <div className="flex flex-col gap-6">
                <p className={`text-sm md:text-base ${tokens.subtleText}`}>
                  Add an extra layer of security to your account
                </p>

                {/* Status Toggle */}
                <div className="flex items-center justify-between">
                  <span className={sectionTitleClass}>Status</span>
                  <ToggleSwitch checked={status} onChange={setStatus} />
                </div>

                {/* Security Level Info */}
                <div className="pb-16">
                  <div className="flex items-center justify-between">
                    <span className={labelClass}>Security Level</span>
                    <span className="px-4 py-1.5 text-sm font-medium rounded-full" style={{ backgroundColor: APP_COLORS.primaryLight, color: APP_COLORS.primary }}>
                      {status ? "High" : "Low"}
                    </span>
                  </div>
                  <p className={`text-sm md:text-base mt-2 ${tokens.subtleText}`}>
                    {status
                      ? "Your account is protected with two-factor authentication."
                      : "Protect your account with an extra layer of security."}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Email Modal */}
      <AddEmailModal
        tokens={tokens}
        isOpen={isAddEmailModalOpen}
        onClose={() => setIsAddEmailModalOpen(false)}
        onReopen={() => setIsAddEmailModalOpen(true)}
        onAddEmail={(newEmail) => {
          if (onSave) {
            onSave({
              status,
              method: initialMethod,
              email: newEmail,
              phone: initialPhone
            });
          }
        }}
      />
    </>
  );
};

