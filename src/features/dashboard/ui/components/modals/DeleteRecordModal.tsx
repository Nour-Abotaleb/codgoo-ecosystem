import { useState } from "react";
import type { DashboardTokens } from "../../types";
import closeCircleIcon from "@assets/images/software/close-circle.svg";
import { DeleteSuccessModal } from "./DeleteSuccessModal";

type DeleteRecordModalProps = {
  readonly tokens: DashboardTokens;
  readonly isOpen: boolean;
  readonly onClose: () => void;
  readonly onConfirm?: () => void;
  readonly recordName?: string;
};

export const DeleteRecordModal = ({
  tokens,
  isOpen,
  onClose,
  onConfirm,
  recordName: _recordName
}: DeleteRecordModalProps) => {
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleConfirm = () => {
    if (onConfirm) {
      onConfirm();
    }
    // Show loader
    setIsLoading(true);
    // Close delete modal
    onClose();
    // Simulate deletion process, then show success modal
    setTimeout(() => {
      setIsLoading(false);
      setIsSuccessModalOpen(true);
    }, 1500); // 1.5 second loading time
  };

  const handleDeleteModalClose = () => {
    // Only reset success modal if it's not open (i.e., user cancelled, didn't confirm)
    if (!isSuccessModalOpen) {
      setIsSuccessModalOpen(false);
    }
    setIsLoading(false);
    onClose();
  };

  const handleSuccessClose = () => {
    setIsSuccessModalOpen(false);
  };

  return (
    <>
      {isOpen && (
        <div className="fixed inset-0 z-[10002] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50"
        onClick={handleDeleteModalClose}
      />

      {/* Modal */}
      <div className={`relative w-full max-w-lg ${tokens.cardBase} ${tokens.isDark ? "bg-[#232637]" : "bg-white"} rounded-2xl p-6 max-h-[90vh] overflow-hidden flex flex-col`}>
        {/* Content */}
        <div className="flex flex-col items-center gap-4">
          {/* Delete Icon */}
          <div className="flex items-center justify-center">
            <div className="flex items-center justify-center">
              <img 
                src={closeCircleIcon} 
                alt="Delete" 
                className="w-20 h-20"
              />
            </div>
          </div>

          {/* Title */}
          <h2 className={`text-2xl md:text-3xl font-bold ${tokens.isDark ? "text-white" : "text-black"}`}>
            Delete Record
          </h2>

          {/* Message */}
          <div className="flex flex-col items-center text-center">
            <p className={`text-base md:text-lg ${tokens.isDark ? "text-white/70" : "text-[#718EBF]"}`}>
              Are You Sure You Want To Delete This Record?
            </p>
          </div>

          {/* Action Buttons */}
          <div className={`flex flex-col gap-3 w-full mt-4 flex-shrink-0 border-t mx-6 ${tokens.isDark ? "border-white/20" : "border-[#E6E6E6]"} pt-2 pb-6`}>
            <button
              type="button"
              onClick={handleConfirm}
              className="w-full px-6 py-3 rounded-full text-base font-medium transition-colors bg-[#EE5D50] text-white hover:bg-[#EE5D50]/90"
            >
              Confirm
            </button>
            <button
              type="button"
              onClick={handleDeleteModalClose}
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
    </div>
      )}

      {/* Loading Overlay */}
      {isLoading && (
        <div className="fixed inset-0 z-[10003] flex items-center justify-center p-4">
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/50" />
          
          {/* Loader Modal */}
          <div className={`relative w-full max-w-lg ${tokens.cardBase} ${tokens.isDark ? "bg-[#232637]" : "bg-white"} rounded-2xl p-6 max-h-[90vh] overflow-hidden flex flex-col`}>
            <div className="flex flex-col items-center gap-4">
              {/* Spinner */}
              <div className="flex items-center justify-center">
                <div className={`size-12 md:size-16 animate-spin rounded-full border-4 ${
                  tokens.isDark 
                    ? "border-[#4318FF] border-t-transparent" 
                    : "border-[#4318FF] border-t-transparent"
                }`} />
              </div>
              
              {/* Loading Message */}
              <div className="flex flex-col items-center text-center">
                <p className={`text-base md:text-lg font-medium ${tokens.isDark ? "text-white" : "text-black"}`}>
                  Deleting Record...
                </p>
                <p className={`text-sm mt-2 ${tokens.isDark ? "text-white/70" : "text-[#718EBF]"}`}>
                  Please wait
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Success Modal */}
      <DeleteSuccessModal
        tokens={tokens}
        isOpen={isSuccessModalOpen}
        onClose={handleSuccessClose}
      />
    </>
  );
};

