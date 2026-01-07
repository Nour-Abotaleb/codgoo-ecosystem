import { useState } from "react";
import { EditIcon, EmailIcon, SettingsIcon, CloseIcon, KeyIcon, PlusCircleIcon, CardIcon } from "@utilities/icons";
import type { DashboardTokens } from "../../../types";
import { TwoFactorAuthModal } from "./modals/TwoFactorAuthModal";
import { AddNewEmailModal } from "./modals/AddNewEmailModal";
import { ChangeEmailModal } from "./modals/ChangeEmailModal";
import { ChangePasswordModal } from "./modals/ChangePasswordModal";
import { PaymentMethodsModal } from "./modals/PaymentMethodsModal";
import { APP_COLORS } from "../../../styles/app/colors";

type SettingsViewProps = {
  readonly tokens: DashboardTokens;
};

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

export const SettingsView = ({ tokens }: SettingsViewProps) => {
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

  const cardClass = `${tokens.cardBase} rounded-[20px] p-6 transition-colors`;
  const sectionTitleClass = `text-xl font-bold ${tokens.isDark ? "text-white" : "text-black"}`;
  const labelClass = `text-sm font-medium ${tokens.isDark ? "text-white/70" : "text-black"}`;
  const valueClass = `text-sm md:text-base ${tokens.isDark ? "text-white" : "text-black"}`;

  return (
    <div className="flex flex-col gap-4">
      {/* Main Grid: First card in left column, Second and Third cards in right column */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 items-stretch">
        {/* Left Column: Two-Factor Authentication Section */}
        <div className={`${cardClass} flex flex-col h-full`}>
          <div className="flex flex-wrap items-center justify-between">
            <h2 className={sectionTitleClass}>Two-Factor Authentication (2FA)</h2>
            <button
              type="button"
              onClick={() => setIsTwoFactorModalOpen(true)}
              className={`flex h-9 w-9 items-center justify-center rounded-full transition-colors ${tokens.isDark ? tokens.buttonGhost : ""}`}
              style={tokens.isDark ? {} : { backgroundColor: APP_COLORS.buttonBackground }}
              aria-label="Edit 2FA settings"
            >
              <EditIcon className={`h-4 w-4`} style={tokens.isDark ? {} : { color: APP_COLORS.primary }} />
            </button>
          </div>
          <p className={`text-sm mb-6 ${tokens.subtleText}`}>
            Add an extra layer of security to your account
          </p>

          <div className="flex flex-col gap-4">
            {/* Status Toggle */}
            <div className="flex flex-wrap items-center justify-between">
              <span className={sectionTitleClass}>Status</span>
              <ToggleSwitch checked={twoFactorEnabled} onChange={setTwoFactorEnabled} />
            </div>

            {/* Method */}
            <div className="flex flex-wrap items-center justify-between">
              <span className={labelClass}>Method</span>
              <button
                type="button"
                className="px-6 py-2 text-sm font-semibold rounded-full"
                style={{ backgroundColor: APP_COLORS.primaryLight, color: APP_COLORS.primary }}
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
            <div className="flex flex-wrap items-center justify-between">
              <div className="flex flex-wrap items-center gap-3">
                <div className={`flex h-9 w-9 items-center justify-center rounded-full ${tokens.isDark ? tokens.buttonGhost : ""}`} style={tokens.isDark ? {} : { backgroundColor: APP_COLORS.buttonBackground }}>
                  <EmailIcon className={`h-4 w-4`} style={tokens.isDark ? {} : { color: APP_COLORS.primary }} />
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
                style={tokens.isDark ? {} : { backgroundColor: APP_COLORS.buttonBackground }}
                aria-label="Edit email"
              >
                <EditIcon className={`h-4 w-4`} style={tokens.isDark ? {} : { color: APP_COLORS.primary }} />
              </button>
            </div>

            {/* Password */}
            <div className="flex flex-wrap items-center justify-between">
              <div className="flex flex-wrap items-center gap-3">
                <div className={`flex h-9 w-9 items-center justify-center rounded-full ${tokens.isDark ? tokens.buttonGhost : ""}`} style={tokens.isDark ? {} : { backgroundColor: APP_COLORS.buttonBackground }}>
                  <KeyIcon className={`h-4 w-4`} style={tokens.isDark ? {} : { color: APP_COLORS.primary }} />
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
                style={tokens.isDark ? {} : { backgroundColor: APP_COLORS.buttonBackground }}
                aria-label="Edit password"
              >
                <EditIcon className={`h-4 w-4`} style={tokens.isDark ? {} : { color: APP_COLORS.primary }} />
              </button>
            </div>
          </div>
        </div>

        {/* Payment Methods Section */}
        <div className={cardClass}>
        <div className="flex flex-wrap items-center justify-between mb-4">
          <h2 className={sectionTitleClass}>Payment Methods</h2>
          <button
            type="button"
            onClick={() => setIsPaymentMethodsModalOpen(true)}
            className={`flex h-9 w-9 items-center justify-center rounded-full transition-colors ${tokens.isDark ? tokens.buttonGhost : ""}`}
            style={tokens.isDark ? {} : { backgroundColor: APP_COLORS.buttonBackground }}
            aria-label="Edit payment methods"
          >
            <EditIcon className={`h-4 w-4`} style={tokens.isDark ? {} : { color: APP_COLORS.primary }} />
          </button>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className={`flex h-9 w-9 items-center justify-center rounded-full ${tokens.isDark ? tokens.buttonGhost : ""}`} style={tokens.isDark ? {} : { backgroundColor: APP_COLORS.buttonBackground }}>
            <CardIcon className={`h-5 w-5`} style={tokens.isDark ? {} : { color: APP_COLORS.primary }} />
          </div>
          <div>
            <span className={valueClass}>Mastercard .... 5555</span>
          </div>
          <span className="px-3 py-1.5 text-sm font-medium rounded-full ms-10" style={{ backgroundColor: APP_COLORS.primaryLight, color: APP_COLORS.primary }}>
            Default
          </span>
        </div>
        </div>
        </div>
      </div>

      {/* Account Sharing Section */}
      <div className={cardClass}>
        <div className="flex flex-wrap items-center justify-between mb-6">
          <h2 className={sectionTitleClass}>Account Sharing</h2>
          <button
            type="button"
            onClick={() => setIsAddNewEmailModalOpen(true)}
            className="px-4 py-2.5 text-white text-sm font-semibold rounded-full flex flex-wrap items-center gap-2"
            style={{ backgroundColor: APP_COLORS.primary }}
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
                <th className=" py-3 px-4 text-sm text-[#B6B6B6] font-medium text-start">EMAIL</th>
                <th className=" py-3 px-4 text-sm text-[#B6B6B6] font-medium text-start">SOFTWARE SERVICES</th>
                <th className=" py-3 px-4 text-sm text-[#B6B6B6] font-medium text-start">APPS SERVICES</th>
                <th className=" py-3 px-4 text-sm text-[#B6B6B6] font-medium text-start">Cloud Services</th>
                <th className=" py-3 px-4 text-sm text-[#B6B6B6] font-medium text-start">ACTIONS</th>
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
                    <div className="flex flex-wrap items-center gap-2">
                      <button
                        type="button"
                        className={`flex h-9 w-9 items-center justify-center rounded-full transition-colors ${tokens.isDark ? tokens.buttonGhost : ""}`}
                        style={tokens.isDark ? {} : { backgroundColor: APP_COLORS.buttonBackground }}
                        aria-label="Settings"
                      >
                        <SettingsIcon className={`h-4 w-4`} style={tokens.isDark ? {} : { color: APP_COLORS.primary }} />
                      </button>
                      <button
                        type="button"
                        className="flex h-9 w-9 items-center justify-center rounded-full transition-colors"
                        style={{ backgroundColor: tokens.isDark ? "rgba(255, 77, 77, 0.1)" : APP_COLORS.errorBackground }}
                        aria-label="Delete"
                      >
                        <CloseIcon className="h-4 w-4" style={{ color: APP_COLORS.error }} />
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
          // Format services for display
          const formatServices = (serviceIds: string[]) => {
            if (serviceIds.length === 0) return "-";
            return serviceIds
              .map((id) => {
                // Map service IDs to display names (service-a -> A, service-b -> B)
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
          // Handle password change
          console.log("Password changed", data);
        }}
      />

      {/* Payment Methods Modal */}
      <PaymentMethodsModal
        tokens={tokens}
        isOpen={isPaymentMethodsModalOpen}
        onClose={() => setIsPaymentMethodsModalOpen(false)}
        onAdd={(email) => {
          // Handle adding payment method
          console.log("Payment method added", email);
        }}
      />
    </div>
  );
};

