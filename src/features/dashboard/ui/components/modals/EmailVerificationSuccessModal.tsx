import type { DashboardTokens } from "../../types";
import tickCircleIcon from "@assets/images/software/tick-circle.svg";

type EmailVerificationSuccessModalProps = {
  readonly tokens: DashboardTokens;
  readonly isOpen: boolean;
  readonly onClose: () => void;
  readonly email: string;
  readonly onResend?: () => void;
};

export const EmailVerificationSuccessModal = ({
  tokens,
  isOpen,
  onClose,
  email,
  onResend
}: EmailVerificationSuccessModalProps) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[10002] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50"
        onClick={onClose}
      />

      {/* Modal */}
      <div className={`relative w-full max-w-xl ${tokens.cardBase} rounded-2xl p-6 max-h-[90vh] overflow-hidden flex flex-col`}>
        {/* Content */}
        <div className="flex flex-col items-center gap-2">
          {/* Success Icon */}
          <div className="flex items-center justify-center">
            <div className="">
              <img 
                src={tickCircleIcon} 
                alt="Success" 
                className="h-16 w-16 md:h-24 md:w-24"
              />
            </div>
          </div>

          {/* Message */}
          <div className="flex flex-col items-center gap-2 text-center">
            <p className={`text-base md:text-xl ${tokens.isDark ? "text-white" : "text-[#191D23]"}`}>
              We sent a verification link to
            </p>
            <p className={`text-base md:text-xl font-semibold ${tokens.isDark ? "text-white" : "text-[#191D23]"}`}>
              ({email})
            </p>
          </div>

          {/* Action Buttons */}
          <div className={`flex flex-col gap-3 w-full mt-4 border-t ${tokens.isDark ? "border-white/20" : "border-[#E6E6E6]"} pt-2`}>
            <button
              type="button"
              onClick={onClose}
              className={`w-full px-6 py-3 rounded-full text-base font-medium transition-colors ${
                tokens.isDark
                  ? "bg-[#4318FF] text-white hover:bg-[#4318FF]/90"
                  : "bg-[#4318FF] text-white hover:bg-[#4318FF]/90"
              }`}
            >
              Done
            </button>
            <button
              type="button"
              onClick={() => {
                if (onResend) {
                  onResend();
                }
              }}
              className={`w-full px-6 py-3 rounded-full text-base font-semibold transition-colors ${
                tokens.isDark
                  ? "border border-white/20 text-white hover:bg-white/10 bg-transparent"
                  : "border border-[#071FD7] text-[#071FD7] hover:bg-[#071FD7]/10 bg-white"
              }`}
            >
              Resend Email
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

