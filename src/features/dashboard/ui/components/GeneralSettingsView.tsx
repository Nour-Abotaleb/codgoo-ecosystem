import { useState } from "react";
import { EditIcon, EmailIcon, SettingsIcon, CloseIcon, KeyIcon, PlusCircleIcon, CardIcon } from "@utilities/icons";
import type { DashboardTokens } from "../types";
import { TwoFactorAuthModal } from "./modals/TwoFactorAuthModal";
import { AddNewEmailModal } from "./modals/AddNewEmailModal";
import { ChangeEmailModal } from "./modals/ChangeEmailModal";
import { ChangePasswordModal } from "./modals/ChangePasswordModal";
import { PaymentMethodsModal } from "./app/settings/modals/PaymentMethodsModal";

// Camera Icon for image upload
const CameraIcon = () => (
  <svg width="17" height="17" viewBox="0 0 17 17" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M6.37565 7.08333C7.15805 7.08333 7.79232 6.44907 7.79232 5.66667C7.79232 4.88426 7.15805 4.25 6.37565 4.25C5.59325 4.25 4.95898 4.88426 4.95898 5.66667C4.95898 6.44907 5.59325 7.08333 6.37565 7.08333Z" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M9.20768 1.41797H6.37435C2.83268 1.41797 1.41602 2.83464 1.41602 6.3763V10.6263C1.41602 14.168 2.83268 15.5846 6.37435 15.5846H10.6243C14.166 15.5846 15.5827 14.168 15.5827 10.6263V7.08464" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M13.5567 1.83495L10.9855 4.4062C10.8863 4.50537 10.7871 4.69662 10.773 4.83829L10.6313 5.82287C10.5817 6.17704 10.8296 6.42495 11.1838 6.37537L12.1684 6.2337C12.303 6.21245 12.5013 6.12037 12.6005 6.0212L15.1717 3.44995C15.618 3.0037 15.8234 2.4937 15.1717 1.84204C14.513 1.1762 14.003 1.3887 13.5567 1.83495Z" stroke="currentColor" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M13.1895 2.20312C13.409 2.98229 14.0182 3.59146 14.7974 3.81104" stroke="currentColor" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M1.89062 13.4247L5.38271 11.0801C5.94229 10.7047 6.74979 10.7472 7.25271 11.1793L7.48646 11.3847C8.03896 11.8593 8.93146 11.8593 9.48396 11.3847L12.4306 8.85594C12.9831 8.38135 13.8756 8.38135 14.4281 8.85594L15.5827 9.8476" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

type AccountSharingItem = {
  readonly id: string;
  readonly email: string;
  readonly softwareServices: string;
  readonly appsServices: string;
  readonly cloudServices: string;
};

const initialAccountSharingData: readonly AccountSharingItem[] = [
  { id: "1", email: "Test@gmail.com", softwareServices: "A, C", appsServices: "A, C", cloudServices: "A, C" },
  { id: "2", email: "Test@gmail.com", softwareServices: "B", appsServices: "B", cloudServices: "B" },
  { id: "3", email: "Test@gmail.com", softwareServices: "A, B", appsServices: "A, B", cloudServices: "A, B" },
  { id: "4", email: "Test@gmail.com", softwareServices: "-", appsServices: "-", cloudServices: "-" },
  { id: "5", email: "Test@gmail.com", softwareServices: "A, C", appsServices: "A, C", cloudServices: "A, C" }
];

const ToggleSwitch = ({ 
  checked, 
  onChange,
  primaryColor = "#4318FF"
}: { 
  readonly checked: boolean; 
  readonly onChange: (checked: boolean) => void;
  readonly primaryColor?: string;
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
      style={checked ? { backgroundColor: primaryColor } : {}}
    >
      <span
        className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white transition-transform ${
          checked ? "translate-x-4.5" : "translate-x-0.5"
        }`}
      />
    </button>
  );
};

type GeneralSettingsViewProps = {
  readonly tokens: DashboardTokens;
  readonly primaryColor?: string;
  readonly buttonBackgroundColor?: string;
};

export const GeneralSettingsView = ({ 
  tokens, 
  primaryColor = "#4318FF",
  buttonBackgroundColor = "#E6E9FB"
}: GeneralSettingsViewProps) => {
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(true);
  const [twoFactorMethod, setTwoFactorMethod] = useState("Email");
  const [currentEmail, setCurrentEmail] = useState("a----@g----.com");
  const [currentPhone, setCurrentPhone] = useState("+20 10*******");
  const [currentPassword] = useState("************");
  const [isTwoFactorModalOpen, setIsTwoFactorModalOpen] = useState(false);
  const [isAddNewEmailModalOpen, setIsAddNewEmailModalOpen] = useState(false);
  const [isChangeEmailModalOpen, setIsChangeEmailModalOpen] = useState(false);
  const [isChangePasswordModalOpen, setIsChangePasswordModalOpen] = useState(false);
  const [isPaymentMethodsModalOpen, setIsPaymentMethodsModalOpen] = useState(false);
  const [accountSharingData, setAccountSharingData] = useState<readonly AccountSharingItem[]>(initialAccountSharingData);
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const fileInputRef = useState<HTMLInputElement | null>(null)[1];

  const cardClass = `${tokens.cardBase} rounded-[20px] p-6 transition-colors`;
  const sectionTitleClass = `text-xl font-bold ${tokens.isDark ? "text-white" : "text-black"}`;
  const labelClass = `text-sm font-medium ${tokens.isDark ? "text-white/70" : "text-black"}`;
  const valueClass = `text-sm md:text-base ${tokens.isDark ? "text-white" : "text-black"}`;

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setProfileImage(result);
      };
      reader.readAsDataURL(file);
    }
  };

  const triggerFileInput = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.onchange = (e) => {
      const event = e as Event;
      const target = event.target as HTMLInputElement;
      handleImageUpload({ target } as React.ChangeEvent<HTMLInputElement>);
    };
    input.click();
  };

  return (
    <div className="flex flex-col gap-4">
      {/* Profile Card */}
      <div className={`${cardClass} flex items-center justify-between`}>
        <div className="flex items-center gap-4">
          <div className="relative w-20 h-20 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center hover:shadow-lg transition-shadow group">
            {profileImage ? (
              <img src={profileImage} alt="Profile" className="w-full h-full object-cover rounded-full" />
            ) : (
              <span className="text-2xl font-bold text-white">RM</span>
            )}
            {/* Camera Icon Overlay */}
            <button
              type="button"
              className="absolute -bottom-1 -right-1 flex h-7 w-7 items-center justify-center rounded-full transition-all  focus:opacity-100"
              style={{ backgroundColor: buttonBackgroundColor, color: primaryColor }}
              aria-label="Change profile image"
              title="Change profile image"
              onClick={triggerFileInput}
            >
              <CameraIcon />
            </button>
          </div>
          <div className="flex flex-col gap-1">
            <h2 className={sectionTitleClass}>Reham Mostafa</h2>
            <span className={`text-sm ${tokens.subtleText}`}>Admin</span>
          </div>
        </div>
      </div>

      {/* Main Grid: First card in left column, Second and Third cards in right column */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 items-stretch">
        {/* Left Column: Two-Factor Authentication Section */}
        <div className={`${cardClass} flex flex-col h-full`}>
          <div className="flex items-center justify-between">
            <h2 className={sectionTitleClass}>Two-Factor Authentication (2FA)</h2>
            <button
              type="button"
              onClick={() => setIsTwoFactorModalOpen(true)}
              className={`flex h-9 w-9 items-center justify-center rounded-full transition-colors ${tokens.isDark ? tokens.buttonGhost : ""}`}
              style={tokens.isDark ? {} : { backgroundColor: buttonBackgroundColor }}
              aria-label="Edit 2FA settings"
            >
              <EditIcon className={`h-4 w-4`} style={tokens.isDark ? {} : { color: primaryColor }} />
            </button>
          </div>
          <p className={`text-sm mb-6 ${tokens.subtleText}`}>
            Add an extra layer of security to your account
          </p>

          <div className="flex flex-col gap-4">
            {/* Status Toggle */}
            <div className="flex items-center justify-between">
              <span className={sectionTitleClass}>Status</span>
              <ToggleSwitch checked={twoFactorEnabled} onChange={setTwoFactorEnabled} primaryColor={primaryColor} />
            </div>

            {/* Method */}
            <div className="flex items-center justify-between">
              <span className={labelClass}>Method</span>
              <button
                type="button"
                className="px-6 py-2 text-sm font-semibold rounded-full"
                style={{ backgroundColor: buttonBackgroundColor, color: primaryColor }}
              >
                {twoFactorMethod}
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Account Security and Payment Methods Sections */}
        <div className="flex flex-col gap-4 h-full">
          {/* Account Security Section */}
          <div className={`${cardClass} flex-1`}>
            <h2 className={`${sectionTitleClass} mb-6`}>Account Security</h2>

            <div className="flex flex-col gap-6">
              {/* Current Email */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`flex h-9 w-9 items-center justify-center rounded-full ${tokens.isDark ? tokens.buttonGhost : ""}`} style={tokens.isDark ? {} : { backgroundColor: buttonBackgroundColor }}>
                    <EmailIcon className={`h-4 w-4`} style={tokens.isDark ? {} : { color: primaryColor }} />
                  </div>
                  <div className="flex flex-col gap-1">
                    <span className={labelClass}>Current Email</span>
                    <span className={valueClass}>{currentEmail}</span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setIsChangeEmailModalOpen(true)}
                  className={`flex h-9 w-9 items-center justify-center rounded-full transition-colors ${tokens.isDark ? tokens.buttonGhost : ""}`}
                  style={tokens.isDark ? {} : { backgroundColor: buttonBackgroundColor }}
                  aria-label="Edit email"
                >
                  <EditIcon className={`h-4 w-4`} style={tokens.isDark ? {} : { color: primaryColor }} />
                </button>
              </div>

              {/* Password */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`flex h-9 w-9 items-center justify-center rounded-full ${tokens.isDark ? tokens.buttonGhost : ""}`} style={tokens.isDark ? {} : { backgroundColor: buttonBackgroundColor }}>
                    <KeyIcon className={`h-4 w-4`} style={tokens.isDark ? {} : { color: primaryColor }} />
                  </div>
                  <div className="flex flex-col gap-1">
                    <span className={labelClass}>Password</span>
                    <span className={valueClass}>{currentPassword}</span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setIsChangePasswordModalOpen(true)}
                  className={`flex h-9 w-9 items-center justify-center rounded-full transition-colors ${tokens.isDark ? tokens.buttonGhost : ""}`}
                  style={tokens.isDark ? {} : { backgroundColor: buttonBackgroundColor }}
                  aria-label="Edit password"
                >
                  <EditIcon className={`h-4 w-4`} style={tokens.isDark ? {} : { color: primaryColor }} />
                </button>
              </div>
            </div>
          </div>

          {/* Payment Methods Section */}
          <div className={cardClass}>
            <div className="flex items-center justify-between mb-4">
              <h2 className={sectionTitleClass}>Payment Methods</h2>
              <button
                type="button"
                onClick={() => setIsPaymentMethodsModalOpen(true)}
                className={`flex h-9 w-9 items-center justify-center rounded-full transition-colors ${tokens.isDark ? tokens.buttonGhost : ""}`}
                style={tokens.isDark ? {} : { backgroundColor: buttonBackgroundColor }}
                aria-label="Edit payment methods"
              >
                <EditIcon className={`h-4 w-4`} style={tokens.isDark ? {} : { color: primaryColor }} />
              </button>
            </div>

            <div className="flex items-center gap-3">
              <div className={`flex h-9 w-9 items-center justify-center rounded-full ${tokens.isDark ? tokens.buttonGhost : ""}`} style={tokens.isDark ? {} : { backgroundColor: buttonBackgroundColor }}>
                <CardIcon className={`h-5 w-5`} style={tokens.isDark ? {} : { color: primaryColor }} />
              </div>
              <div>
                <span className={valueClass}>Mastercard .... 5555</span>
              </div>
              <span className="px-3 py-1.5 text-sm font-medium rounded-full ms-10" style={{ backgroundColor: buttonBackgroundColor, color: primaryColor }}>
                Default
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Account Sharing Section */}
      <div className={cardClass}>
        <div className="flex items-center justify-between mb-6">
          <h2 className={sectionTitleClass}>Account Sharing</h2>
          <button
            type="button"
            onClick={() => setIsAddNewEmailModalOpen(true)}
            className="px-4 py-2.5 text-white text-sm font-semibold rounded-full flex items-center gap-2"
            style={{ backgroundColor: primaryColor }}
          >
            <PlusCircleIcon className="h-5 w-5 text-white" />
            <span>Add New Email</span>
          </button>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className={`border-b ${tokens.divider}`}>
                <th className="text-left py-3 px-4 text-sm text-[#B6B6B6] font-medium">EMAIL</th>
                <th className="text-left py-3 px-4 text-sm text-[#B6B6B6] font-medium">SOFTWARE SERVICES</th>
                <th className="text-left py-3 px-4 text-sm text-[#B6B6B6] font-medium">APPS SERVICES</th>
                <th className="text-left py-3 px-4 text-sm text-[#B6B6B6] font-medium">Cloud Services</th>
                <th className="text-left py-3 px-4 text-sm text-[#B6B6B6] font-medium">ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {accountSharingData.map((item) => (
                <tr key={item.id} className={`${tokens.isDark ? "hover:bg-white/5" : "hover:bg-gray-50"}`}>
                  <td className={`py-3 px-4 ${valueClass}`}>{item.email}</td>
                  <td className={`py-3 px-4 ${valueClass}`}>{item.softwareServices}</td>
                  <td className={`py-3 px-4 ${valueClass}`}>{item.appsServices}</td>
                  <td className={`py-3 px-4 ${valueClass}`}>{item.cloudServices}</td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        className={`flex h-9 w-9 items-center justify-center rounded-full transition-colors ${tokens.isDark ? tokens.buttonGhost : ""}`}
                        style={tokens.isDark ? {} : { backgroundColor: buttonBackgroundColor }}
                        aria-label="Settings"
                      >
                        <SettingsIcon className={`h-4 w-4`} style={tokens.isDark ? {} : { color: primaryColor }} />
                      </button>
                      <button
                        type="button"
                        className="flex h-9 w-9 items-center justify-center rounded-full transition-colors"
                        style={{ backgroundColor: tokens.isDark ? "rgba(255, 77, 77, 0.1)" : "rgb(255, 229, 222)" }}
                        aria-label="Delete"
                      >
                        <CloseIcon className="h-4 w-4" style={{ color: "#FF0000" }} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Two-Factor Authentication Modal */}
      <TwoFactorAuthModal
        tokens={tokens}
        isOpen={isTwoFactorModalOpen}
        onClose={() => setIsTwoFactorModalOpen(false)}
        initialStatus={twoFactorEnabled}
        initialMethod={twoFactorMethod}
        initialEmail={currentEmail}
        initialPhone={currentPhone}
        onSave={(data) => {
          setTwoFactorEnabled(data.status);
          setTwoFactorMethod(data.method);
          setCurrentEmail(data.email);
          setCurrentPhone(data.phone);
        }}
      />

      {/* Add New Email Modal */}
      <AddNewEmailModal
        tokens={tokens}
        isOpen={isAddNewEmailModalOpen}
        onClose={() => setIsAddNewEmailModalOpen(false)}
        onAdd={(data) => {
          const formatServices = (serviceIds: string[]) => {
            if (serviceIds.length === 0) return "-";
            return serviceIds
              .map((id) => {
                const match = id.match(/service-([a-z])/i);
                return match ? match[1].toUpperCase() : id;
              })
              .join(", ");
          };

          const newItem: AccountSharingItem = {
            id: Date.now().toString(),
            email: data.email,
            softwareServices: formatServices(data.softwareServices),
            appsServices: formatServices(data.appsServices),
            cloudServices: formatServices(data.cloudServices)
          };

          setAccountSharingData([...accountSharingData, newItem]);
        }}
      />

      {/* Change Email Modal */}
      <ChangeEmailModal
        tokens={tokens}
        isOpen={isChangeEmailModalOpen}
        onClose={() => setIsChangeEmailModalOpen(false)}
        currentEmail={currentEmail}
        onSave={(data) => {
          setCurrentEmail(data.newEmail);
        }}
      />

      {/* Change Password Modal */}
      <ChangePasswordModal
        tokens={tokens}
        isOpen={isChangePasswordModalOpen}
        onClose={() => setIsChangePasswordModalOpen(false)}
        onSave={(data) => {
          console.log("Password changed", data);
        }}
      />

      {/* Payment Methods Modal */}
      <PaymentMethodsModal
        tokens={tokens}
        isOpen={isPaymentMethodsModalOpen}
        onClose={() => setIsPaymentMethodsModalOpen(false)}
        onAdd={(data) => {
          console.log("Payment method added", data);
        }}
      />
    </div>
  );
};
