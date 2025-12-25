import { CloseModalIcon } from "@utilities/icons";
import type { DashboardTokens } from "../../types";
import tickCircleIcon from "@assets/images/software/tick-circle.svg";

type DeleteSuccessModalProps = {
  readonly tokens: DashboardTokens;
  readonly isOpen: boolean;
  readonly onClose: () => void;
};

export const DeleteSuccessModal = ({
  tokens,
  isOpen,
  onClose
}: DeleteSuccessModalProps) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[10003] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50"
        onClick={onClose}
      />

      {/* Modal */}
      <div className={`relative w-full max-w-lg ${tokens.cardBase} ${tokens.isDark ? "bg-[#232637]" : "bg-white"} rounded-[20px] p-6 max-h-[90vh] overflow-hidden flex flex-col`}>
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center transition-colors z-10"
          aria-label="Close modal"
        >
          <CloseModalIcon className="h-6 w-6 md:h-7 md:w-7" />
        </button>

        {/* Content */}
        <div className="flex flex-col items-center gap-4 pt-4">
          {/* Success Icon */}
          <div className="flex items-center justify-center">
            <img 
              src={tickCircleIcon} 
              alt="Success" 
              className="h-20 w-20 md:h-24 md:w-24"
            />
          </div>

          {/* Title */}
          <h2 className={`text-2xl md:text-3xl font-bold ${tokens.isDark ? "text-white" : "text-black"}`}>
            Done
          </h2>

          {/* Message */}
          <div className="flex flex-col items-center text-center pb-14">
            <p className={`text-base md:text-lg ${tokens.isDark ? "text-white/70" : "text-[#718EBF]"}`}>
              Record Has Been Deleted Successfully
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

