import { useState } from "react";
import toast from "react-hot-toast";
import { CloseModalIcon, PaymentMethodIcon } from "@utilities/icons";
import type { DashboardTokens } from "../../../../types";
import { getModalInputClass } from "../../../../utils/modalStyles";
import { useAddPaymentMethodMutation } from "@features/dashboard/api/dashboard-api";

// Security icons
const ShieldCheckIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 22C12 22 20 18 20 12V5L12 2L4 5V12C4 18 12 22 12 22Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M9 12L11 14L15 10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const LockIcon = () => (
<svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M5 8.33464V6.66797C5 3.90964 5.83333 1.66797 10 1.66797C14.1667 1.66797 15 3.90964 15 6.66797V8.33464" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M7.91602 13.3333C7.91602 14.4833 8.84935 15.4167 9.99935 15.4167C11.1493 15.4167 12.0827 14.4833 12.0827 13.3333C12.0827 12.1833 11.1493 11.25 9.99935 11.25" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M18.3327 14.1654V12.4987C18.3327 9.16536 17.4993 8.33203 14.166 8.33203H5.83268C2.49935 8.33203 1.66602 9.16536 1.66602 12.4987V14.1654C1.66602 17.4987 2.49935 18.332 5.83268 18.332H14.166C15.6327 18.332 16.616 18.1737 17.2577 17.707" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
</svg>

);

const PrivacyIcon = () => (
<svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M1.66602 7.08203H11.2493" stroke="currentColor" stroke-width="1.5" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M5 13.75H6.66667" stroke="currentColor" stroke-width="1.5" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M8.75 13.75H12.0833" stroke="currentColor" stroke-width="1.5" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M1.66602 9.1763V6.5763C1.66602 3.6513 2.40768 2.91797 5.36602 2.91797H11.2493" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M18.3327 9.19141V13.4247C18.3327 16.3497 17.591 17.0831 14.6327 17.0831H5.36602C2.40768 17.0831 1.66602 16.3497 1.66602 13.4247V12.5081" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M13.75 5.0013L15 6.2513L18.3333 2.91797" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
</svg>

);

const SSLIcon = () => (
<svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M17.1585 5.93281C17.1585 4.90781 16.3751 3.77448 15.4168 3.41615L11.2585 1.85781C10.5668 1.59948 9.43346 1.59948 8.7418 1.85781L4.58346 3.42448C3.62513 3.78281 2.8418 4.91615 2.8418 5.93281V12.1245C2.8418 13.1078 3.4918 14.3995 4.28346 14.9911L7.8668 17.6661C9.0418 18.5495 10.9751 18.5495 12.1501 17.6661L15.7335 14.9911C16.5251 14.3995 17.1751 13.1078 17.1751 12.1245V9.19115" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
</svg>

);

type PaymentMethodsModalProps = {
  readonly tokens: DashboardTokens;
  readonly isOpen: boolean;
  readonly onClose: () => void;
  readonly onAdd?: (data: { cardNumber: string; expiryDate: string; securityCode: string; rememberCard: boolean; default: boolean }) => void;
};

export const PaymentMethodsModal = ({
  tokens,
  isOpen,
  onClose,
  onAdd
}: PaymentMethodsModalProps) => {
  const [cardNumber, setCardNumber] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [securityCode, setSecurityCode] = useState("");
  const [rememberCard, setRememberCard] = useState(true);
  const [isDefault, setIsDefault] = useState(true);
  const [addPaymentMethod, { isLoading }] = useAddPaymentMethodMutation();

  const handleAdd = async () => {
    if (!cardNumber.trim() || !expiryDate.trim() || !securityCode.trim()) {
      toast.error("Please fill in all fields");
      return;
    }

    try {
      await addPaymentMethod({
        card_number: cardNumber.trim(),
        expiry_date: expiryDate.trim(),
        security_code: securityCode.trim(),
        remember_card: rememberCard,
        default: isDefault
      }).unwrap();
      
      toast.success("Payment method added successfully");
      
      if (onAdd) {
        onAdd({ 
          cardNumber: cardNumber.trim(), 
          expiryDate: expiryDate.trim(), 
          securityCode: securityCode.trim(), 
          rememberCard,
          default: isDefault
        });
      }
      
      resetForm();
      onClose();
    } catch (error: any) {
      console.error("Failed to add payment method:", error);
      const errorMessage = error?.data?.message || "Failed to add payment method";
      toast.error(errorMessage);
    }
  };

  const resetForm = () => {
    setCardNumber("");
    setExpiryDate("");
    setSecurityCode("");
    setRememberCard(true);
    setIsDefault(true);
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const formatCardNumber = (value: string) => {
    const digits = value.replace(/\D/g, "").slice(0, 16);
    if (digits.length <= 4) return digits;
    const masked = "**** **** **** " + digits.slice(-4);
    return digits.length > 4 ? masked : digits;
  };

  const formatExpiryDate = (value: string) => {
    const digits = value.replace(/\D/g, "").slice(0, 4);
    if (digits.length >= 2) {
      return digits.slice(0, 2) + "/" + digits.slice(2);
    }
    return digits;
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
          <div className={`relative w-full max-w-xl ${tokens.cardBase} ${tokens.isDark ? "bg-[#0F1217]" : "bg-white"} rounded-[20px] max-h-[90vh] overflow-hidden flex flex-col`}>
            {/* Header */}
            <div className={`flex flex-wrap items-center justify-between px-6 pt-6 pb-4 flex-shrink-0 rounded-t-2xl ${
              tokens.isDark ? "bg-[#0F1217]" : "bg-[#E8F5F0]"
            }`}>
              <div className="flex flex-wrap items-center gap-3">
                <div
                  className={`flex h-10 w-10 items-center justify-center rounded-full ${
                    tokens.isDark ? tokens.buttonGhost : ""
                  }`}
                  style={tokens.isDark ? {} : { backgroundColor: "#D0EBE3" }}
                >
                  <PaymentMethodIcon
                    className={`h-5 w-5`}
                    style={tokens.isDark ? {} : { color: "#0D7377" }}
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
            <div className="flex-1 overflow-y-auto scrollbar-hide pt-6 px-6">
              <div className="flex flex-col gap-5">
                {/* Credit Card Number */}
                <div className="relative">
                  <label 
                    className={`absolute left-4 -top-2.5 px-2 text-sm font-medium z-10 ${
                      tokens.isDark 
                        ? "text-white/70 bg-[#0F1217]" 
                        : "text-black  bg-white"
                    }`}
                  >
                    Credit card number
                  </label>
                  <input
                    type="text"
                    value={cardNumber ? formatCardNumber(cardNumber) : ""}
                    onChange={(e) => setCardNumber(e.target.value.replace(/\D/g, "").slice(0, 16))}
                    className={inputClass}
                    placeholder="**** **** **** 2512"
                  />
                </div>

                {/* Expiry Date */}
                <div className="relative">
                  <label 
                    className={`absolute left-4 -top-2.5 px-2 text-sm font-medium z-10 ${
                      tokens.isDark 
                        ? "text-white/70 bg-[#0F1217]" 
                        : "text-black  bg-white"
                    }`}
                  >
                    Expiry date
                  </label>
                  <input
                    type="text"
                    value={expiryDate}
                    onChange={(e) => setExpiryDate(formatExpiryDate(e.target.value))}
                    className={inputClass}
                    placeholder="07/23"
                    maxLength={5}
                  />
                </div>

                {/* Security Code */}
                <div className="relative">
                  <label 
                    className={`absolute left-4 -top-2.5 px-2 text-sm font-medium z-10 ${
                      tokens.isDark 
                        ? "text-white/70 bg-[#0F1217]" 
                        : "text-black  bg-white"
                    }`}
                  >
                    Security code
                  </label>
                  <input
                    type="text"
                    value={securityCode}
                    onChange={(e) => setSecurityCode(e.target.value.replace(/\D/g, "").slice(0, 4))}
                    className={inputClass}
                    placeholder="345"
                    maxLength={4}
                  />
                </div>

                {/* Remember Card Checkbox */}
                <div className="flex flex-wrap items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setRememberCard(!rememberCard)}
                    className={`flex h-6 w-6 items-center justify-center rounded-md border-2 transition-colors ${
                      rememberCard 
                        ? "bg-[#0D7377] border-[#0D7377]" 
                        : tokens.isDark 
                          ? "border-white/30 bg-transparent" 
                          : "border-gray-300 bg-white"
                    }`}
                  >
                    {rememberCard && (
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M5 12L10 17L19 8" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    )}
                  </button>
                  <span className={`text-sm font-medium ${tokens.isDark ? "text-white" : "text-black"}`}>
                    Remember this card
                  </span>
                </div>

                {/* Set as Default Checkbox */}
                <div className="flex flex-wrap items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setIsDefault(!isDefault)}
                    className={`flex h-6 w-6 items-center justify-center rounded-md border-2 transition-colors ${
                      isDefault 
                        ? "bg-[#0D7377] border-[#0D7377]" 
                        : tokens.isDark 
                          ? "border-white/30 bg-transparent" 
                          : "border-gray-300 bg-white"
                    }`}
                  >
                    {isDefault && (
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M5 12L10 17L19 8" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    )}
                  </button>
                  <span className={`text-sm font-medium ${tokens.isDark ? "text-white" : "text-black"}`}>
                    Set as default payment method
                  </span>
                </div>

                {/* Data Safe Message */}
                <div className="flex flex-wrap items-center gap-2 text-[#008321]">
                  <ShieldCheckIcon />
                  <span className="text-sm font-medium">Your data is safe and encrypted</span>
                </div>

                {/* Additional Security Check Section */}
                <div className={`rounded-xl p-4 ${tokens.isDark ? "bg-[#0D7377]/20" : "bg-[#E8F5F0]"}`}>
                  <h3 className="text-[#008321] font-semibold mb-3">Additional Security Check</h3>
                  <div className="flex flex-col gap-3">
                    <div className="flex items-start gap-3 text-[#008321]">
                      <SSLIcon />
                      <span className={`text-sm ${tokens.isDark ? "text-white/70" : "text-black"}`}>
                        Your financial and personal information is encrypted with SSL.
                      </span>
                    </div>
                    <div className="flex items-start gap-3 text-[#008321]">
                      <PrivacyIcon />
                      <span className={`text-sm ${tokens.isDark ? "text-white/70" : "text-black"}`}>
                        We will not disclose or sell your personal information.
                      </span>
                    </div>
                    <div className="flex items-start gap-3 text-[#008321]">
                      <LockIcon />
                      <span className={`text-sm ${tokens.isDark ? "text-white/70" : "text-black"}`}>
                        Every payment is processed securely and protected by the Payment Card Industry Data Security Standard (DSS).
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className={`flex flex-col gap-3 mt-6 flex-shrink-0 border-t mx-6 ${tokens.isDark ? "border-white/20" : "border-[#E6E6E6]"} pt-4 pb-6`}>
              <button
                type="button"
                onClick={handleAdd}
                disabled={isLoading}
                className="w-full px-6 py-3 rounded-full text-base font-medium transition-colors text-white hover:opacity-90 disabled:opacity-50"
                style={{ backgroundColor: "#0D7377" }}
              >
                {isLoading ? "Adding..." : "Add"}
              </button>
              <button
                type="button"
                onClick={handleClose}
                className={`w-full px-6 py-3 rounded-full text-base font-medium transition-colors ${
                  tokens.isDark
                    ? "border border-white/20 text-white hover:bg-white/10 bg-transparent"
                    : "border bg-white hover:bg-gray-50"
                }`}
                style={tokens.isDark ? {} : { borderColor: "#0D7377", color: "#0D7377" }}
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
