import { useState } from "react";
import { CloseModalIcon, PaymentMethodIcon, VerifiedIcon } from "@utilities/icons";
import type { DashboardTokens } from "../../../../types";
import { getModalInputClass } from "../../../../utils/modalStyles";
import { APP_COLORS } from "../../../../styles/app/colors";

type PaymentMethodsModalProps = {
  readonly tokens: DashboardTokens;
  readonly isOpen: boolean;
  readonly onClose: () => void;
  readonly onAdd?: (email: string) => void;
};

export const PaymentMethodsModal = ({
  tokens,
  isOpen,
  onClose,
  onAdd
}: PaymentMethodsModalProps) => {
  const [email, setEmail] = useState("");

  const handleAdd = () => {
    if (email.trim()) {
      if (onAdd) {
        onAdd(email.trim());
      }
      setEmail("");
      onClose();
    }
  };

  const handleClose = () => {
    setEmail("");
    onClose();
  };

  const inputClass = getModalInputClass(tokens, { paddingY: "py-3", textColor: "text-[#2B3674]" });

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
                  style={tokens.isDark ? {} : { backgroundColor: APP_COLORS.buttonBackground }}
                >
                  <PaymentMethodIcon
                    className={`h-5 w-5`}
                    style={tokens.isDark ? {} : { color: APP_COLORS.primary }}
                  />
                </div>
                <h2 className={`text-lg md:text-xl font-semibold ${tokens.isDark ? "text-white" : "text-black"}`}>
                  Payment Methods
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
                {/* Email Input */}
                <div className="relative">
                  <label 
                    className={`absolute left-4 -top-2.5 px-2 text-sm font-medium z-10 ${
                      tokens.isDark 
                        ? "text-white/70 bg-[#232637]" 
                        : "text-black bg-[#0F1217]"
                    }`}
                  >
                    your Email
                  </label>
                  <div className="relative">
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className={`${inputClass} pe-24`}
                      placeholder="yourname@example.com"
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          handleAdd();
                        }
                      }}
                    />
                    {email.trim() && (
                      <span className="absolute right-4 top-1/2 -translate-y-1/2 px-3 py-2 rounded-full text-sm font-medium bg-[#E2FFE9] text-[#34C759] flex items-center gap-1.5">
                        <VerifiedIcon className="h-5 w-3" />
                        Verified
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className={`flex flex-col gap-3 mt-6 flex-shrink-0 border-t mx-6 ${tokens.isDark ? "border-white/20" : "border-[#E6E6E6]"} pt-2 pb-6`}>
              <button
                type="button"
                onClick={handleAdd}
                className="w-full px-6 py-3 rounded-full text-base font-medium transition-colors text-white hover:opacity-90"
                style={{ backgroundColor: APP_COLORS.primary }}
              >
                Add
              </button>
              <button
                type="button"
                onClick={handleClose}
                className={`w-full px-6 py-3 rounded-full text-base font-medium transition-colors ${
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

