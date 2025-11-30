import { useState } from "react";
import { EditIcon, EmailIcon, PhoneIcon, SettingsIcon, CloseIcon, RefreshIcon, KeyIcon, PlusCircleIcon } from "@utilities/icons";
import type { DashboardTokens } from "../../types";
import { TwoFactorAuthModal } from "../modals/TwoFactorAuthModal";

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

const accountSharingData: readonly AccountSharingItem[] = [
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
        checked ? "bg-[#4318FF]" : "bg-gray-300"
      }`}
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
  const [currentLanguage] = useState({ code: "en", name: "English", flag: "US" });
  const [isTwoFactorModalOpen, setIsTwoFactorModalOpen] = useState(false);

  const cardClass = `${tokens.cardBase} rounded-[28px] p-6 transition-colors`;
  const sectionTitleClass = `text-xl font-bold ${tokens.isDark ? "text-white" : "text-[#2B3674]"}`;
  const labelClass = `text-sm font-medium ${tokens.isDark ? "text-white/70" : "text-[#2B3674]"}`;
  const valueClass = `text-sm md:text-base ${tokens.isDark ? "text-white" : "text-[#2B3674]"}`;

  return (
    <div className="flex flex-col gap-6">
      {/* Main Grid: First card in left column, Second and Third cards in right column */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column: Two-Factor Authentication Section */}
        <div className={cardClass}>
          <div className="flex items-center justify-between mb-4">
            <h2 className={sectionTitleClass}>Two-Factor Authentication (2FA)</h2>
            <button
              type="button"
              onClick={() => setIsTwoFactorModalOpen(true)}
              className={`flex h-9 w-9 items-center justify-center rounded-full transition-colors ${tokens.isDark ? tokens.buttonGhost : ""}`}
              style={tokens.isDark ? {} : { backgroundColor: "#E6E9FB" }}
              aria-label="Edit 2FA settings"
            >
              <EditIcon className={`h-4 w-4`} style={tokens.isDark ? {} : { color: "#071FD7" }} />
            </button>
          </div>
          <p className={`text-sm mb-6 ${tokens.subtleText}`}>
            Add an extra layer of security to your account
          </p>

          <div className="flex flex-col gap-4">
            {/* Status Toggle */}
            <div className="flex items-center justify-between">
              <span className={sectionTitleClass}>Status</span>
              <ToggleSwitch checked={twoFactorEnabled} onChange={setTwoFactorEnabled} />
            </div>

            {/* Method */}
            <div className="flex items-center justify-between">
              <span className={labelClass}>Method</span>
              <button
                type="button"
                className="px-6 py-2 bg-[#EFEFFE] text-[#071FD7] text-sm font-semibold rounded-full"
              >
                {twoFactorMethod}
              </button>
            </div>

            {/* Contact Information */}
            <div className="flex flex-col gap-3 pt-4">
              <div className="flex items-center justify-between mb-4">
                <h2 className={sectionTitleClass}>Contact Information</h2>
              </div>
              <div className="flex items-center gap-3">
                <div className={`flex h-9 w-9 items-center justify-center rounded-full ${tokens.isDark ? tokens.buttonGhost : ""}`} style={tokens.isDark ? {} : { backgroundColor: "#E6E9FB" }}>
                  <EmailIcon className={`h-4 w-4`} style={tokens.isDark ? {} : { color: "#071FD7" }} />
                </div>
                <span className={valueClass}>{currentEmail}</span>
              </div>
              <div className="flex items-center gap-3">
                <div className={`flex h-9 w-9 items-center justify-center rounded-full ${tokens.isDark ? tokens.buttonGhost : ""}`} style={tokens.isDark ? {} : { backgroundColor: "#E6E9FB" }}>
                  <PhoneIcon className={`h-4 w-4`} style={tokens.isDark ? {} : { color: "#071FD7" }} />
                </div>
                <span className={valueClass}>{currentPhone}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Account Security and Current Language Sections */}
        <div className="flex flex-col gap-6">
        {/* Account Security Section */}
        <div className={cardClass}>
          <h2 className={`${sectionTitleClass} mb-6`}>Account Security</h2>

          <div className="flex flex-col gap-6">
            {/* Current Email */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={`flex h-9 w-9 items-center justify-center rounded-full ${tokens.isDark ? tokens.buttonGhost : ""}`} style={tokens.isDark ? {} : { backgroundColor: "#E6E9FB" }}>
                  <EmailIcon className={`h-4 w-4`} style={tokens.isDark ? {} : { color: "#071FD7" }} />
                </div>
                <div className="flex flex-col gap-1">
                  <span className={labelClass}>Current Email</span>
                  <span className={valueClass}>{currentEmail}</span>
                </div>
              </div>
              <button
                type="button"
                className={`flex h-9 w-9 items-center justify-center rounded-full transition-colors ${tokens.isDark ? tokens.buttonGhost : ""}`}
                style={tokens.isDark ? {} : { backgroundColor: "#E6E9FB" }}
                aria-label="Edit email"
              >
                <EditIcon className={`h-4 w-4`} style={tokens.isDark ? {} : { color: "#071FD7" }} />
              </button>
            </div>

            {/* Password */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={`flex h-9 w-9 items-center justify-center rounded-full ${tokens.isDark ? tokens.buttonGhost : ""}`} style={tokens.isDark ? {} : { backgroundColor: "#E6E9FB" }}>
                  <KeyIcon className={`h-4 w-4`} style={tokens.isDark ? {} : { color: "#071FD7" }} />
                </div>
                <div className="flex flex-col gap-1">
                  <span className={labelClass}>Password</span>
                  <span className={valueClass}>{currentPassword}</span>
                </div>
              </div>
              <button
                type="button"
                className={`flex h-9 w-9 items-center justify-center rounded-full transition-colors ${tokens.isDark ? tokens.buttonGhost : ""}`}
                style={tokens.isDark ? {} : { backgroundColor: "#E6E9FB" }}
                aria-label="Edit password"
              >
                <EditIcon className={`h-4 w-4`} style={tokens.isDark ? {} : { color: "#071FD7" }} />
              </button>
            </div>
          </div>
        </div>

        {/* Current Language Section */}
        <div className={cardClass}>
        <div className="flex items-center justify-between mb-4">
          <h2 className={sectionTitleClass}>Current Language</h2>
          <button
            type="button"
            className={`flex h-9 w-9 items-center justify-center rounded-full transition-colors ${tokens.isDark ? tokens.buttonGhost : ""}`}
            style={tokens.isDark ? {} : { backgroundColor: "#E6E9FB" }}
            aria-label="Refresh language"
          >
            <RefreshIcon className={`h-4 w-4`} style={tokens.isDark ? {} : { color: "#071FD7" }} />
          </button>
        </div>
        <p className={`text-sm mb-6 ${tokens.subtleText}`}>
          Your interface is displayed in this language
        </p>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 w-8 h-8 flex items-center justify-center bg-[#EFEFFE] text-[#071FD7] text-sm font-semibold rounded-full">
              {currentLanguage.flag}
            </div>
            <div className="flex flex-col">
              <span className={`font-semibold ${valueClass}`}>{currentLanguage.name}</span>
              <span className={`text-sm ${tokens.isDark ? "text-white/70" : "text-black"}`}>{currentLanguage.name}</span>
            </div>
          </div>
          <button
            type="button"
            className="px-4 py-1.5 bg-[#E2FFE9] text-[#34C759] text-sm font-semibold rounded-full"
          >
            Active
          </button>
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
            className="px-4 py-2.5 bg-[#4318FF] text-white text-sm font-semibold rounded-full flex items-center gap-2"
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
                        style={tokens.isDark ? {} : { backgroundColor: "#E6E9FB" }}
                        aria-label="Settings"
                      >
                        <SettingsIcon className={`h-4 w-4`} style={tokens.isDark ? {} : { color: "#071FD7" }} />
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
    </div>
  );
};

