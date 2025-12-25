import { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
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
import { useUploadBundleAttachmentMutation } from "@/store/api/marketplace-api";

type PaymentMethod = "credit-card" | "digital-wallet" | "bank-transfer" | "offline-payment";

type CheckoutViewProps = {
  readonly tokens: DashboardTokens;
  readonly bundleTitle: string;
  readonly bundlePrice: string;
  readonly selectedAppIds: Set<string>;
  readonly bundleId?: string;
  readonly onBack: () => void;
};

export const CheckoutView = ({ 
  tokens, 
  bundleTitle, 
  bundlePrice, 
  selectedAppIds,
  bundleId,
  onBack 
}: CheckoutViewProps) => {
  const navigate = useNavigate();
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("credit-card");
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [uploadedImage, setUploadedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadBundleAttachment] = useUploadBundleAttachmentMutation();

  // Get modal input class
  const inputClass = getModalInputClass(tokens);

  // Calculate pricing
  const priceStr = bundlePrice.replace(" EGP", "").replace(/,/g, "");
  const subtotal = parseInt(priceStr, 10);

  const taxRate = 0.14; // 14%
  const tax = subtotal * taxRate;
  const total = subtotal + tax;

  const handleConfirmPayment = async () => {
    if (!agreedToTerms) return;
    
    // If offline payment, check if image is uploaded
    if (paymentMethod === "offline-payment" && !uploadedImage) {
      toast.error("Please upload payment proof");
      setShowUploadModal(true);
      return;
    }
    
    // If offline payment with image, upload to server first
    if (paymentMethod === "offline-payment" && uploadedImage && bundleId) {
      try {
        setIsUploading(true);
        
        const response = await uploadBundleAttachment({
          bundleId: parseInt(bundleId, 10),
          attachment: uploadedImage
        }).unwrap();

        if (!response.status) {
          toast.error(response.message || "Failed to upload payment proof");
          setIsUploading(false);
          return;
        }
        
        toast.success("Payment proof uploaded successfully!");
      } catch (error: any) {
        console.error("Upload error:", error);
        toast.error(error?.data?.message || "An error occurred while uploading");
        setIsUploading(false);
        return;
      } finally {
        setIsUploading(false);
      }
    }
    
    // Show success toast
    toast.success("Redirecting to payment gateway...");
    
    // Redirect to billing page for payment
    navigate("/dashboard/billing", {
      state: {
        bundleTitle,
        bundlePrice,
        selectedAppIds: Array.from(selectedAppIds),
        paymentMethod,
        total,
        paymentProof: uploadedImage ? uploadedImage.name : null
      }
    });
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploadedImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
      toast.success("Payment proof uploaded successfully");
      setShowUploadModal(false);
    }
  };

  const handleRemoveImage = () => {
    setUploadedImage(null);
    setImagePreview(null);
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
          <div className={`${tokens.cardBase} rounded-[20px] p-6`}>
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
          <div className={`${tokens.cardBase} rounded-[20px] p-6`}>
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
                className={`flex items-center gap-4 p-4 rounded-[20px] cursor-pointer transition-colors ${
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
                className={`flex items-center gap-4 p-4 rounded-[20px] cursor-pointer transition-colors ${
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
                className={`flex items-center gap-4 p-4 rounded-[20px] cursor-pointer transition-colors ${
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

              {/* Offline Payment */}
              <div
                className={`flex items-center gap-4 p-4 rounded-[20px] cursor-pointer transition-colors ${
                  paymentMethod === "offline-payment"
                    ? `${tokens.isDark ? "bg-[#1a3a3a]" : "bg-[#E7F0F1]"}`
                    : `${tokens.isDark ? "bg-[#2a2a2a] border border-[#E8E8E866]" : "bg-[#FAFAFA] border border-[#E8E8E8]"}`
                }`}
                onClick={(e) => {
                  e.preventDefault();
                  setPaymentMethod("offline-payment");
                  setShowUploadModal(true);
                }}
              >
                <div className="flex items-center justify-between flex-1">
                  <div className="flex items-center gap-3">
                    <div className={`${paymentMethod === "offline-payment" 
                      ? `${tokens.isDark ? "bg-[#1F2733] text-[#34D8D6]" : "bg-[#BAD5D9] text-[#0F6773]"}`
                      : `${tokens.isDark ? "bg-[#1F2733] text-gray-400" : "bg-[#E7F0F1] text-[#5F5F5F]"}`
                    } rounded-full p-2.5`}>
                      <svg className={`w-5 h-5 ${paymentMethod === "offline-payment" ? "text-[#0F6773]" : tokens.isDark ? "text-gray-400" : "text-[#5F5F5F]"}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    </div>
                    <div className="flex flex-col">
                      <span className={`font-semibold ${tokens.isDark ? "text-white" : "text-[#142133]"}`}>
                        Offline Payment
                      </span>
                      <span className={`text-sm ${tokens.isDark ? "text-gray-400" : "text-[#5F5F5F]"}`}>
                        Upload payment proof
                        {uploadedImage && <span className="text-[#0F6773] ml-1">✓ Uploaded</span>}
                      </span>
                    </div>
                  </div>
                  <div className={`${paymentMethod === "offline-payment" ? "bg-[#0F6773]" : tokens.isDark ? "bg-[#2a2a2a]" : "bg-white"} rounded-full border-1 ${paymentMethod === "offline-payment" ? "border-[#0F6773]" : tokens.divider} flex items-center justify-center w-6 h-6`}>
                    {paymentMethod === "offline-payment" && (
                      <CheckIcon className="w-4 h-4 text-white" />
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>


        </div>

        {/* Right Column - Order Summary */}
        <div className="lg:col-span-1">
          <div className={`${tokens.cardBase} rounded-[20px] p-6`}>
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
          {/* Terms and Conditions */}
          <div className={`${tokens.cardBase} rounded-[20px]  mb-2 space-y-1`}>
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
            {/* Confirm Payment Button */}
            <button
              type="button"
              onClick={handleConfirmPayment}
              disabled={!agreedToTerms || isUploading}
              className={`w-full py-2.5 rounded-full font-semibold text-base transition-colors ${
                agreedToTerms && !isUploading
                  ? "bg-[#0F6773] text-white hover:bg-[#0d5a65] cursor-pointer"
                  : "bg-gray-300 text-gray-500 cursor-not-allowed"
              }`}
            >
              {isUploading ? "Uploading..." : "Confirm Payment"}
            </button>
            <p className={`text-[13px] text-center mt-6 ${tokens.isDark ? "text-gray-400" : "text-[#808080]"}`}>
              By Confirming, You Will Be Redirected To<br /> A Secure Payment Gateway
            </p>
          </div>

          {/* Security Features */}
          <div className="mt-4 space-y-3">
            <div className={`${tokens.isDark ? "bg-[#2a2a2a]" : "bg-white"} rounded-[20px] px-4 py-6 flex flex-col items-start gap-3`}>
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
            <div className={`${tokens.isDark ? "bg-[#2a2a2a]" : "bg-white"} rounded-[20px] px-4 py-6 flex flex-col items-start gap-3`}>
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

      {/* Upload Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className={`${tokens.isDark ? "bg-[#1F2733]" : "bg-white"} rounded-[20px] p-6 max-w-md w-full`}>
            <div className="flex items-center justify-between mb-6">
              <h3 className={`text-xl font-bold ${tokens.isDark ? "text-white" : "text-[#142133]"}`}>
                Upload Payment Proof
              </h3>
              <button
                type="button"
                onClick={() => setShowUploadModal(false)}
                className={`${tokens.isDark ? "text-gray-400 hover:text-white" : "text-gray-600 hover:text-black"}`}
              >
                <CloseModalIcon className="w-6 h-6" />
              </button>
            </div>

            {imagePreview ? (
              <div className="space-y-4">
                <div className="relative">
                  <img 
                    src={imagePreview} 
                    alt="Payment proof" 
                    className="w-full h-64 object-cover rounded-[20px]"
                  />
                  <button
                    type="button"
                    onClick={handleRemoveImage}
                    className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-2 hover:bg-red-600"
                  >
                    <CloseModalIcon className="w-4 h-4" />
                  </button>
                </div>
                <p className={`text-sm ${tokens.isDark ? "text-gray-400" : "text-[#5F5F5F]"}`}>
                  {uploadedImage?.name}
                </p>
                <button
                  type="button"
                  onClick={() => setShowUploadModal(false)}
                  className="w-full py-2.5 bg-[#0F6773] text-white rounded-full font-semibold hover:bg-[#0d5a65]"
                >
                  Done
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                <label className={`flex flex-col items-center justify-center w-full h-64 border-2 border-dashed rounded-[20px] cursor-pointer ${
                  tokens.isDark 
                    ? "border-gray-600 bg-[#2a2a2a] hover:bg-[#333]" 
                    : "border-gray-300 bg-gray-50 hover:bg-gray-100"
                }`}>
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <svg className={`w-12 h-12 mb-4 ${tokens.isDark ? "text-gray-400" : "text-gray-500"}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                    </svg>
                    <p className={`mb-2 text-sm ${tokens.isDark ? "text-gray-300" : "text-gray-700"}`}>
                      <span className="font-semibold">Click to upload</span> or drag and drop
                    </p>
                    <p className={`text-xs ${tokens.isDark ? "text-gray-400" : "text-gray-500"}`}>
                      PNG, JPG or JPEG (MAX. 5MB)
                    </p>
                  </div>
                  <input 
                    type="file" 
                    className="hidden" 
                    accept="image/*"
                    onChange={handleImageUpload}
                  />
                </label>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
