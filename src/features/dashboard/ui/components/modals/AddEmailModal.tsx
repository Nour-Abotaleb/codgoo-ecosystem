import { useState } from "react";
import toast from "react-hot-toast";
import { CloseModalIcon, TwoFactorAuthIcon, EmailIcon } from "@utilities/icons";
import type { DashboardTokens } from "../../types";
import { getModalInputClass } from "../../utils/modalStyles";
import { useAddClientEmailMutation, useGetClientEmailsQuery, useVerifyClientEmailMutation, useDeleteClientEmailMutation } from "../../../api/dashboard-api";

type AddEmailModalProps = {
  readonly tokens: DashboardTokens;
  readonly isOpen: boolean;
  readonly onClose: () => void;
  readonly onAddEmail?: (email: string) => void;
  readonly onReopen?: () => void;
  readonly primaryColor?: string;
};

export const AddEmailModal = ({
  tokens,
  isOpen,
  onClose,
  onAddEmail,
  primaryColor = "#4318FF"
}: AddEmailModalProps) => {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [emailId, setEmailId] = useState<number | null>(null);
  const [showOtpInput, setShowOtpInput] = useState(false);
  const [submittedEmail, setSubmittedEmail] = useState("");
  const [showAddForm, setShowAddForm] = useState(false);

  const { data: emailsData, isLoading: isLoadingEmails, refetch: refetchEmails } = useGetClientEmailsQuery(undefined, {
    skip: !isOpen
  });
  const [addClientEmail, { isLoading: isAddingEmail }] = useAddClientEmailMutation();
  const [verifyClientEmail, { isLoading: isVerifying }] = useVerifyClientEmailMutation();
  const [deleteClientEmail] = useDeleteClientEmailMutation();

  const emails = emailsData?.data || [];

  const handleAddEmail = async () => {
    if (!email.trim()) {
      toast.error("Please enter an email address");
      return;
    }
    try {
      const result = await addClientEmail({ email: email.trim() }).unwrap();
      if (result.data?.id) {
        setEmailId(result.data.id);
        setSubmittedEmail(email.trim());
        setShowOtpInput(true);
        setShowAddForm(false);
        toast.success("Verification code sent to your email");
      }
    } catch (error: any) {
      console.error("Failed to add email:", error);
      const errorMessage = error?.data?.message || "Failed to add email";
      toast.error(errorMessage);
    }
  };

  const handleVerifyOtp = async () => {
    if (!otp.trim()) {
      toast.error("Please enter the verification code");
      return;
    }
    if (!emailId) {
      toast.error("Email ID not found");
      return;
    }
    try {
      await verifyClientEmail({ emailId, otp: otp.trim() }).unwrap();
      toast.success("Email verified successfully");
      if (onAddEmail) {
        onAddEmail(submittedEmail);
      }
      refetchEmails();
      resetForm();
    } catch (error: any) {
      console.error("Failed to verify email:", error);
      const errorMessage = error?.data?.message || "Invalid verification code";
      toast.error(errorMessage);
    }
  };

  const resetForm = () => {
    setEmail("");
    setOtp("");
    setEmailId(null);
    setShowOtpInput(false);
    setSubmittedEmail("");
    setShowAddForm(false);
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const handleResend = async () => {
    if (!submittedEmail) return;
    try {
      const result = await addClientEmail({ email: submittedEmail }).unwrap();
      if (result.data?.id) {
        setEmailId(result.data.id);
        toast.success("Verification code resent");
      }
    } catch (error: any) {
      console.error("Failed to resend code:", error);
      const errorMessage = error?.data?.message || "Failed to resend code";
      toast.error(errorMessage);
    }
  };

  const handleDeleteEmail = async (emailIdToDelete: number) => {
    try {
      await deleteClientEmail(emailIdToDelete).unwrap();
      toast.success("Email deleted successfully");
      refetchEmails();
    } catch (error: any) {
      console.error("Failed to delete email:", error);
      const errorMessage = error?.data?.message || "Failed to delete email";
      toast.error(errorMessage);
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
          tokens.isDark ? "bg-[#0F1217]" : "bg-[#FFFEF7]"
        }`}>
          <div className="flex flex-wrap items-center gap-3">
            <div
              className={`flex h-10 w-10 items-center justify-center rounded-full ${
                tokens.isDark ? tokens.buttonGhost : ""
              }`}
              style={tokens.isDark ? {} : { backgroundColor: "#E6E9FB" }}
            >
              <TwoFactorAuthIcon
                className={`h-5 w-5`}
                style={tokens.isDark ? {} : { color: primaryColor }}
              />
            </div>
            <h2 className={`text-lg md:text-xl font-semibold ${tokens.isDark ? "text-white" : "text-black"}`}>
              {showOtpInput ? "Verify Email" : "Two-Factor Authentication Emails"}
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
            {showOtpInput ? (
              /* OTP Verification Section */
              <div className="flex flex-col gap-4">
                <h3 className={`text-lg font-semibold ${tokens.isDark ? "text-white" : "text-[#191D23]"}`}>
                  Enter Verification Code
                </h3>
                <p className={`text-sm ${tokens.subtleText}`}>
                  A verification code has been sent to {submittedEmail}
                </p>

                {/* OTP Input */}
                <div className="relative">
                  <label 
                    className={`absolute left-4 -top-2.5 px-2 text-sm font-medium z-10 ${
                      tokens.isDark 
                        ? "text-white/70 bg-[#0F1217]" 
                        : "text-black bg-white"
                    }`}
                  >
                    Verification Code
                  </label>
                  <input
                    type="text"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    className={inputClass}
                    placeholder="Enter code"
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        handleVerifyOtp();
                      }
                    }}
                  />
                </div>

                <button
                  type="button"
                  onClick={handleResend}
                  className="text-sm font-medium"
                  style={{ color: primaryColor }}
                >
                  Resend Code
                </button>
              </div>
            ) : showAddForm ? (
              /* Add Email Form */
              <div className="flex flex-col gap-4">
                <h3 className={`text-lg font-semibold ${tokens.isDark ? "text-white" : "text-[#191D23]"}`}>
                  Add New Email
                </h3>

                {/* Email Input */}
                <div className="relative">
                  <label 
                    className={`absolute left-4 -top-2.5 px-2 text-sm font-medium z-10 ${
                      tokens.isDark 
                        ? "text-white/70 bg-[#0F1217]" 
                        : "text-black bg-white"
                    }`}
                  >
                    Your Email
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
            ) : (
              /* Email List Section */
              <div className="flex flex-col gap-4">
                <div className="flex flex-wrap items-center justify-between">
                  <h3 className={`text-lg font-semibold ${tokens.isDark ? "text-white" : "text-[#191D23]"}`}>
                    Your Emails
                  </h3>
                  <button
                    type="button"
                    onClick={() => setShowAddForm(true)}
                    className="text-sm font-medium px-4 py-2 rounded-full text-white"
                    style={{ backgroundColor: primaryColor }}
                  >
                    + Add Email
                  </button>
                </div>

                {isLoadingEmails ? (
                  <div className={`text-center py-4 ${tokens.subtleText}`}>Loading emails...</div>
                ) : emails.length === 0 ? (
                  <div className={`text-center py-8 ${tokens.subtleText}`}>
                    <p>No emails added yet.</p>
                    <p className="text-sm mt-2">Add an email to enable two-factor authentication.</p>
                  </div>
                ) : (
                  <div className="flex flex-col gap-3">
                    {emails.map((emailItem) => (
                      <div
                        key={emailItem.id}
                        className={`flex flex-wrap items-center justify-between p-4 rounded-xl ${
                          tokens.isDark ? "bg-white/5" : "bg-gray-50"
                        }`}
                      >
                        <div className="flex flex-wrap items-center gap-3">
                          <div
                            className={`flex h-10 w-10 items-center justify-center rounded-full ${
                              tokens.isDark ? tokens.buttonGhost : ""
                            }`}
                            style={tokens.isDark ? {} : { backgroundColor: "#E6E9FB" }}
                          >
                            <EmailIcon className="h-5 w-5" style={tokens.isDark ? {} : { color: primaryColor }} />
                          </div>
                          <div>
                            <p className={`font-medium ${tokens.isDark ? "text-white" : "text-black"}`}>
                              {emailItem.email}
                            </p>
                            <p className={`text-xs ${tokens.subtleText}`}>
                              Added {new Date(emailItem.created_at).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                        <div className="flex flex-wrap items-center gap-2">
                          <span
                            className={`px-3 py-1 text-xs font-medium rounded-full ${
                              emailItem.verified
                                ? "bg-green-100 text-green-700"
                                : "bg-yellow-100 text-yellow-700"
                            }`}
                          >
                            {emailItem.verified ? "Verified" : "Pending"}
                          </span>
                          <button
                            type="button"
                            onClick={() => handleDeleteEmail(emailItem.id)}
                            className="flex h-8 w-8 items-center justify-center rounded-full transition-colors hover:bg-red-100"
                            style={{ backgroundColor: tokens.isDark ? "rgba(255, 77, 77, 0.1)" : "rgb(255, 229, 222)" }}
                            aria-label="Delete email"
                          >
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <path d="M3 6H5H21" stroke="#FF0000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                              <path d="M8 6V4C8 3.46957 8.21071 2.96086 8.58579 2.58579C8.96086 2.21071 9.46957 2 10 2H14C14.5304 2 15.0391 2.21071 15.4142 2.58579C15.7893 2.96086 16 3.46957 16 4V6M19 6V20C19 20.5304 18.7893 21.0391 18.4142 21.4142C18.0391 21.7893 17.5304 22 17 22H7C6.46957 22 5.96086 21.7893 5.58579 21.4142C5.21071 21.0391 5 20.5304 5 20V6H19Z" stroke="#FF0000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className={`flex flex-col gap-3 mt-6 flex-shrink-0 border-t mx-6 ${tokens.isDark ? "border-white/20" : "border-[#E6E6E6]"} pt-2 pb-6`}>
          {showOtpInput ? (
            <>
              <button
                type="button"
                onClick={handleVerifyOtp}
                disabled={isVerifying}
                className={`w-full px-6 py-3 rounded-full text-base font-medium transition-colors text-white hover:opacity-90 ${isVerifying ? "cursor-not-allowed opacity-50" : ""}`}
                style={{ backgroundColor: primaryColor }}
              >
                {isVerifying ? "Verifying..." : "Verify"}
              </button>
              <button
                type="button"
                onClick={resetForm}
                className={`w-full px-6 py-3 rounded-full text-base font-medium transition-colors ${
                  tokens.isDark
                    ? "border border-white/20 text-white hover:bg-white/10 bg-transparent"
                    : "bg-transparent hover:opacity-80"
                }`}
                style={tokens.isDark ? {} : { color: primaryColor, borderWidth: "1px", borderStyle: "solid", borderColor: primaryColor }}
              >
                Cancel
              </button>
            </>
          ) : showAddForm ? (
            <>
              <button
                type="button"
                onClick={handleAddEmail}
                disabled={isAddingEmail}
                className={`w-full px-6 py-3 rounded-full text-base font-medium transition-colors text-white hover:opacity-90 ${isAddingEmail ? "cursor-not-allowed opacity-50" : ""}`}
                style={{ backgroundColor: primaryColor }}
              >
                {isAddingEmail ? "Adding..." : "Add Email"}
              </button>
              <button
                type="button"
                onClick={() => setShowAddForm(false)}
                className={`w-full px-6 py-3 rounded-full text-base font-medium transition-colors ${
                  tokens.isDark
                    ? "border border-white/20 text-white hover:bg-white/10 bg-transparent"
                    : "bg-transparent hover:opacity-80"
                }`}
                style={tokens.isDark ? {} : { color: primaryColor, borderWidth: "1px", borderStyle: "solid", borderColor: primaryColor }}
              >
                Cancel
              </button>
            </>
          ) : (
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
              Close
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
