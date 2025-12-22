import { useState } from "react";
import type { DashboardTokens } from "../../types";
import { getModalInputClass } from "../../utils/modalStyles";
import { 
  ArrowRight, 
  CheckIcon, 
  CreditCardIcon, 
  DigitalWalletIcon, 
  BankTransferIcon, 
  SecurityIcon,
  MasterIcon,
  CloseModalIcon,
} from "@utilities/icons";

type PaymentMethod = "credit-card" | "digital-wallet" | "bank-transfer";

type CheckoutViewProps = {
  readonly tokens: DashboardTokens;
  readonly bundleTitle: string;
  readonly bundlePrice: string;
  readonly selectedAppIds: Set<string>;
  readonly onBack: () => void;
};

export const CheckoutView = ({ 
  tokens, 
  bundleTitle, 
  bundlePrice, 
  selectedAppIds,
  onBack 
}: CheckoutViewProps) => {
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("credit-card");
  const [agreedToTerms, setAgreedToTerms] = useState(false);

  // Get modal input class
  const inputClass = getModalInputClass(tokens);

  // Calculate pricing
  const priceStr = bundlePrice.replace(" EGP", "").replace(/,/g, "");
  const subtotal = parseInt(priceStr, 10);

  const taxRate = 0.14; // 14%
  const tax = subtotal * taxRate;
  const total = subtotal + tax;

  const handleConfirmPayment = () => {
    if (!agreedToTerms) return;
    // TODO: Implement payment logic
    console.log("Processing payment:", {
      bundleTitle,
      bundlePrice,
      selectedAppIds: Array.from(selectedAppIds),
      paymentMethod,
      total
    });
  };

  return (
    <div className="flex flex-col gap-4">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div 
          className={`flex items-center gap-2 cursor-pointer ${tokens.isDark ? "bg-[#2a2a2a] text-[#34D8D6]" : "bg-[#E7F0F1] text-[#0F6773]"} rounded-full p-2 w-12 h-12 justify-center`}
          onClick={onBack}
        >
          <ArrowRight className="w-4 h-4 md:w-5 md:h-5 rotate-180" />
        </div>
        <h1 className={`text-2xl md:text-3xl font-semibold ${tokens.isDark ? "text-white" : "text-[#142133]"}`}>
          Checkout
        </h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Left Column - Main Content */}
        <div className="lg:col-span-2 flex flex-col gap-4">
          {/* Billing Information */}
          <div className={`${tokens.cardBase} rounded-[24px] p-6`}>
            <div className={`flex items-center gap-3 mb-6 px-6 py-4 -mx-6 -mt-6 ${tokens.isDark ? "bg-[#1F2733]" : "bg-[#E7F0F1]"} rounded-t-[24px]`}>
              <div className={`${tokens.isDark ? "bg-[#1a1a1a] text-[#34D8D6]" : "bg-white text-[#0F6773]"} rounded-full p-2.5`}>
                <MasterIcon className="w-6 h-6" />
              </div>
              <h2 className={`text-xl md:text-2xl font-bold ${tokens.isDark ? "text-white" : "text-[#142133]"}`}>
                Billing Information
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="relative">
                <label 
                  className={`absolute left-4 -top-2.5 px-2 text-sm font-medium z-10 ${
                    tokens.isDark 
                      ? "text-white/70 bg-[#1a1a1a]" 
                      : "text-black bg-white"
                  }`}
                >
                  Full Name
                </label>
                <input
                  type="text"
                  defaultValue="Ahmed Mohamed"
                  className={inputClass}
                />
              </div>
              <div className="relative">
                <label 
                  className={`absolute left-4 -top-2.5 px-2 text-sm font-medium z-10 ${
                    tokens.isDark 
                      ? "text-white/70 bg-[#1a1a1a]" 
                      : "text-black bg-white"
                  }`}
                >
                  Email Address
                </label>
                <input
                  type="email"
                  defaultValue="ahmed@example.com"
                  className={inputClass}
                />
              </div>
              <div className="relative mt-4">
                <label 
                  className={`absolute left-4 -top-2.5 px-2 text-sm font-medium z-10 ${
                    tokens.isDark 
                      ? "text-white/70 bg-[#1a1a1a]" 
                      : "text-black bg-white"
                  }`}
                >
                  Phone Number
                </label>
                <input
                  type="tel"
                  defaultValue="+20 123 456 7890"
                  className={inputClass}
                />
              </div>
              <div className="relative mt-4">
                <label 
                  className={`absolute left-4 -top-2.5 px-2 text-sm font-medium z-10 ${
                    tokens.isDark 
                      ? "text-white/70 bg-[#1a1a1a]" 
                      : "text-black bg-white"
                  }`}
                >
                  Address
                </label>
                <input
                  type="text"
                  defaultValue="Cairo, Egypt"
                  className={inputClass}
                />
              </div>
            </div>
          </div>

          {/* Payment Method */}
          <div className={`${tokens.cardBase} rounded-[24px] p-6`}>
            <div className={`flex items-center gap-3 mb-6 px-6 py-4 -mx-6 -mt-6 ${tokens.isDark ? "bg-[#1F2733]" : "bg-[#E7F0F1]"} rounded-t-[24px]`}>
              <div className={`${tokens.isDark ? "bg-[#1a1a1a] text-[#34D8D6]" : "bg-white text-[#0F6773]"} rounded-full p-2.5`}>
                <CreditCardIcon className="w-6 h-6" />
              </div>
              <h2 className={`text-xl md:text-2xl font-bold ${tokens.isDark ? "text-white" : "text-[#142133]"}`}>
                Payment Method
              </h2>
            </div>
            <div className="flex flex-col gap-4">
              {/* Credit/Debit Card */}
              <label
                className={`flex items-center gap-4 p-4 rounded-xl cursor-pointer transition-colors ${
                  paymentMethod === "credit-card"
                    ? `${tokens.isDark ? "bg-[#1a3a3a]" : "bg-[#E7F0F1]"}`
                    : `${tokens.isDark ? "bg-[#2a2a2a] border border-[#E8E8E866]" : "bg-[#FAFAFA] border border-[#E8E8E8]"}`
                }`}
              >
                <div className="flex items-center justify-between flex-1">
                  <div className="flex items-center gap-3">
                    <div className={`${paymentMethod === "credit-card" 
                      ? `${tokens.isDark ? "bg-[#1F2733] text-[#34D8D6]" : "bg-[#BAD5D9] text-[#0F6773]"}`
                      : `${tokens.isDark ? "bg-[#1F2733] text-gray-400" : "bg-[#E7F0F1] text-[#5F5F5F]"}`
                    } rounded-full p-2.5`}>
                      <CreditCardIcon className={`w-5 h-5 ${paymentMethod === "credit-card" ? "text-[#0F6773]" : tokens.isDark ? "text-gray-400" : "text-[#5F5F5F]"}`} />
                    </div>
                    <div className="flex flex-col">
                      <span className={`font-semibold ${tokens.isDark ? "text-white" : "text-[#142133]"}`}>
                        Credit/Debit Card
                      </span>
                      <span className={`text-sm ${tokens.isDark ? "text-gray-400" : "text-[#5F5F5F]"}`}>
                        Visa, Mastercard, American Express
                      </span>
                    </div>
                  </div>
                  <div className={`${paymentMethod === "credit-card" ? "bg-[#0F6773]" : tokens.isDark ? "bg-[#2a2a2a]" : "bg-white"} rounded-full border-1 ${paymentMethod === "credit-card" ? "border-[#0F6773]" : tokens.divider} flex items-center justify-center w-6 h-6`}>
                    {paymentMethod === "credit-card" && (
                      <CheckIcon className="w-4 h-4 text-white" />
                    )}
                  </div>
                </div>
                <input
                  type="radio"
                  name="payment-method"
                  value="credit-card"
                  checked={paymentMethod === "credit-card"}
                  onChange={() => setPaymentMethod("credit-card")}
                  className="hidden"
                />
              </label>

              {/* Digital Wallet */}
              <label
                className={`flex items-center gap-4 p-4 rounded-xl cursor-pointer transition-colors ${
                  paymentMethod === "digital-wallet"
                    ? `${tokens.isDark ? "bg-[#1a3a3a]" : "bg-[#E7F0F1]"}`
                    : `${tokens.isDark ? "bg-[#2a2a2a] border border-[#E8E8E866]" : "bg-[#FAFAFA] border border-[#E8E8E8]"}`
                }`}
              >
                <div className="flex items-center justify-between flex-1">
                  <div className="flex items-center gap-3">
                    <div className={`${paymentMethod === "digital-wallet" 
                      ? `${tokens.isDark ? "bg-[#1F2733] text-[#34D8D6]" : "bg-[#BAD5D9] text-[#0F6773]"}`
                      : `${tokens.isDark ? "bg-[#1F2733] text-gray-400" : "bg-[#E7F0F1] text-[#5F5F5F]"}`
                    } rounded-full p-2.5`}>
                      <DigitalWalletIcon className={`w-5 h-5 ${paymentMethod === "digital-wallet" ? "text-[#0F6773]" : tokens.isDark ? "text-gray-400" : "text-[#5F5F5F]"}`} />
                    </div>
                    <div className="flex flex-col">
                      <span className={`font-semibold ${tokens.isDark ? "text-white" : "text-[#142133]"}`}>
                        Digital Wallet
                      </span>
                      <span className={`text-sm ${tokens.isDark ? "text-gray-400" : "text-[#5F5F5F]"}`}>
                        Fawry, Vodafone Cash, Orange Money
                      </span>
                    </div>
                  </div>
                  <div className={`${paymentMethod === "digital-wallet" ? "bg-[#0F6773]" : tokens.isDark ? "bg-[#2a2a2a]" : "bg-white"} rounded-full border-1 ${paymentMethod === "digital-wallet" ? "border-[#0F6773]" : tokens.divider} flex items-center justify-center w-6 h-6`}>
                    {paymentMethod === "digital-wallet" && (
                      <CheckIcon className="w-4 h-4 text-white" />
                    )}
                  </div>
                </div>
                <input
                  type="radio"
                  name="payment-method"
                  value="digital-wallet"
                  checked={paymentMethod === "digital-wallet"}
                  onChange={() => setPaymentMethod("digital-wallet")}
                  className="hidden"
                />
              </label>

              {/* Bank Transfer */}
              <label
                className={`flex items-center gap-4 p-4 rounded-xl cursor-pointer transition-colors ${
                  paymentMethod === "bank-transfer"
                    ? `${tokens.isDark ? "bg-[#1a3a3a]" : "bg-[#E7F0F1]"}`
                    : `${tokens.isDark ? "bg-[#2a2a2a] border border-[#E8E8E866]" : "bg-[#FAFAFA] border border-[#E8E8E8]"}`
                }`}
              >
                <div className="flex items-center justify-between flex-1">
                  <div className="flex items-center gap-3">
                    <div className={`${paymentMethod === "bank-transfer" 
                      ? `${tokens.isDark ? "bg-[#1F2733] text-[#34D8D6]" : "bg-[#BAD5D9] text-[#0F6773]"}`
                      : `${tokens.isDark ? "bg-[#1F2733] text-gray-400" : "bg-[#E7F0F1] text-[#5F5F5F]"}`
                    } rounded-full p-2.5`}>
                      <BankTransferIcon className={`w-5 h-5 ${paymentMethod === "bank-transfer" ? "text-[#0F6773]" : tokens.isDark ? "text-gray-400" : "text-[#5F5F5F]"}`} />
                    </div>
                    <div className="flex flex-col">
                      <span className={`font-semibold ${tokens.isDark ? "text-white" : "text-[#142133]"}`}>
                        Bank Transfer
                      </span>
                      <span className={`text-sm ${tokens.isDark ? "text-gray-400" : "text-[#5F5F5F]"}`}>
                        Direct bank transfer
                      </span>
                    </div>
                  </div>
                  <div className={`${paymentMethod === "bank-transfer" ? "bg-[#0F6773]" : tokens.isDark ? "bg-[#2a2a2a]" : "bg-white"} rounded-full border-1 ${paymentMethod === "bank-transfer" ? "border-[#0F6773]" : tokens.divider} flex items-center justify-center w-6 h-6`}>
                    {paymentMethod === "bank-transfer" && (
                      <CheckIcon className="w-4 h-4 text-white" />
                    )}
                  </div>
                </div>
                <input
                  type="radio"
                  name="payment-method"
                  value="bank-transfer"
                  checked={paymentMethod === "bank-transfer"}
                  onChange={() => setPaymentMethod("bank-transfer")}
                  className="hidden"
                />
              </label>
            </div>
          </div>

          {/* Terms and Conditions */}
          <div className={`${tokens.cardBase} rounded-[24px] p-6`}>
            <label className="flex items-start gap-3 cursor-pointer">
              <div className="relative flex-shrink-0 mt-1">
                <input
                  type="checkbox"
                  checked={agreedToTerms}
                  onChange={(e) => setAgreedToTerms(e.target.checked)}
                  className="sr-only"
                />
                <div
                  className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${
                    agreedToTerms
                      ? "bg-[#0F6773] border-[#0F6773]"
                      : `${tokens.divider} ${tokens.isDark ? "bg-[#2a2a2a]" : "bg-white"}`
                  }`}
                >
                  {agreedToTerms && <CheckIcon className="w-4 h-4 text-white" />}
                </div>
              </div>
              <span className={`text-sm md:text-base ${tokens.isDark ? "text-gray-300" : "text-[#142133]"}`}>
                I Agree To The Terms And Conditions And Privacy Policy. I Understand That I Will Be Charged Monthly For The Selected Subscriptions.
              </span>
            </label>
          </div>
        </div>

        {/* Right Column - Order Summary */}
        <div className="lg:col-span-1">
          <div className={`${tokens.cardBase} rounded-[24px] p-6`}>
            <div className={`flex flex-col items-start mb-6 px-6 py-3 -mx-6 -mt-6 ${tokens.isDark ? "bg-[#1F2733]" : "bg-[#E7F0F1]"} rounded-t-[24px]`}>
              <h2 className={`text-xl md:text-2xl font-bold ${tokens.isDark ? "text-white" : "text-[#142133]"}`}>
                Order Summary
              </h2>
              <p className={`text-sm ${tokens.isDark ? "text-gray-400" : "text-black"}`}>
                1 item
              </p>
            </div>

            {/* Bundle Item */}
            <div className="flex flex-col gap-3 mb-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3 flex-1">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center ${tokens.isDark ? "bg-[#2a2a2a] text-[#34D8D6]" : "bg-[#E7F0F1] text-[#0F6773]"}`}>
                    <MasterIcon className="w-6 h-6" />
                  </div>
                  <div className="flex flex-col flex-1">
                    <span className={`text-sm md:text-base font-semibold ${tokens.isDark ? "text-white" : "text-[#0F6773]"}`}>
                      {bundleTitle}
                    </span>
                    <span className={`text-sm md:text-base font-medium ${tokens.isDark ? "text-white" : "text-[#0F6773]"}`}>
                      {bundlePrice}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    className="text-[#F4371A] bg-[#FFDED9] rounded-full w-10 h-10 flex items-center justify-center"
                    onClick={onBack}
                  >
                   <CloseModalIcon />
                  </button>
                </div>
              </div>
            </div>

            {/* Price Breakdown */}
            <div className="py-4 mb-4 space-y-3">
              <div className="flex justify-between">
                <span className={`text-sm ${tokens.isDark ? "text-gray-400" : "text-black"}`}>
                  Subtotal
                </span>
                <span className={`text-sm font-medium ${tokens.isDark ? "text-white" : "text-black"}`}>
                  {subtotal.toLocaleString()} EGP
                </span>
              </div>
              <div className="flex justify-between">
                <span className={`text-sm ${tokens.isDark ? "text-gray-400" : "text-black"}`}>
                  Tax (14%)
                </span>
                <span className={`text-sm font-medium ${tokens.isDark ? "text-white" : "text-black"}`}>
                  {tax.toLocaleString()} EGP
                </span>
              </div>
              <div className="flex justify-between pt-3 border-t border-[#D7D7D7]">
                <span className={`text-lg font-medium ${tokens.isDark ? "text-white" : "text-black"}`}>
                  Total
                </span>
                <span className={`text-lg font-medium ${tokens.isDark ? "text-white" : "text-black"}`}>
                  {total.toLocaleString()} EGP
                </span>
              </div>
            </div>

            {/* Confirm Payment Button */}
            <button
              type="button"
              onClick={handleConfirmPayment}
              disabled={!agreedToTerms}
              className={`w-full py-2.5 rounded-full font-semibold text-base transition-colors ${
                agreedToTerms
                  ? "bg-[#0F6773] text-white hover:bg-[#0d5a65] cursor-pointer"
                  : "bg-gray-300 text-gray-500 cursor-not-allowed"
              }`}
            >
              Confirm Payment
            </button>
            <p className={`text-[13px] text-center mt-6 ${tokens.isDark ? "text-gray-400" : "text-[#808080]"}`}>
              By Confirming, You Will Be Redirected To<br /> A Secure Payment Gateway
            </p>
          </div>

          {/* Security Features */}
          <div className="mt-4 space-y-3">
            <div className={`${tokens.isDark ? "bg-[#2a2a2a]" : "bg-white"} rounded-2xl px-4 py-6 flex flex-col items-start gap-3`}>
              <div className="flex items-center gap-3">
                <div className={`${tokens.isDark ? "bg-[#1F2733] text-[#34D8D6]" : "bg-[#E7F0F1] text-[#0F6773]"} rounded-full p-2.5 flex-shrink-0`}>
                  <SecurityIcon className="w-6 h-6" />
                </div>
                <div className="flex flex-col gap-1">
                  <span className={`text-sm md:text-base font-semibold ${tokens.isDark ? "text-white" : "text-[#142133]"}`}>
                    100% Secure Payment
                  </span>
                </div>
              </div>
                <span className={`text-[15px] ${tokens.isDark ? "text-gray-400" : "text-[#403F3F]"}`}>
                  Your Payment Is Processed Through Encrypted Channels. Your Data Is Safe With Us.
                </span>
            </div>
            <div className={`${tokens.isDark ? "bg-[#2a2a2a]" : "bg-white"} rounded-2xl px-4 py-6 flex flex-col items-start gap-3`}>
              <div className="flex items-center gap-3">
                <div className={`${tokens.isDark ? "bg-[#1F2733] text-[#34D8D6]" : "bg-[#E7F0F1] text-[#0F6773]"} rounded-full p-2.5 flex-shrink-0 flex items-center justify-center`}>
                  <div className="w-5 h-5 bg-[#0F6773] rounded-full flex items-center justify-center">
                    <CheckIcon className="w-4 h-4 text-white" />
                  </div>
                </div>
                <div className="flex flex-col gap-1">
                  <span className={`text-sm md:text-base font-semibold ${tokens.isDark ? "text-white" : "text-[#142133]"}`}>
                    7-Day Money Back Guarantee
                  </span>
                </div>
              </div>
              <span className={`text-[15px] ${tokens.isDark ? "text-gray-400" : "text-[#403F3F]"}`}>
                Not Satisfied? Get A Full Refund Within 7 Days, No Questions Asked.
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

