import { useState, useEffect } from "react";
import { CloseModalIcon, EmailIcon } from "@utilities/icons";
import type { DashboardTokens } from "../../../../types";
import { getModalInputClass } from "../../../../utils/modalStyles";
import { APP_COLORS } from "../../../../styles/app/colors";

type AddNewEmailModalProps = {
  readonly tokens: DashboardTokens;
  readonly isOpen: boolean;
  readonly onClose: () => void;
  readonly onAdd?: (data: {
    email: string;
    softwareServices: string[];
    appsServices: string[];
    cloudServices: string[];
  }) => void;
};

type DashboardService = {
  readonly id: string;
  readonly name: string;
};

type Dashboard = {
  readonly id: string;
  readonly name: string;
  readonly services: readonly DashboardService[];
};

const dashboards: readonly Dashboard[] = [
  {
    id: "software",
    name: "Software Dashboard",
    services: [
      { id: "service-a", name: "Service A" },
      { id: "service-b", name: "Service B" }
    ]
  },
  {
    id: "cloud",
    name: "Cloud Dashboard",
    services: [
      { id: "service-a", name: "Service A" },
      { id: "service-b", name: "Service B" }
    ]
  },
  {
    id: "apps",
    name: "Apps Dashboard",
    services: [
      { id: "service-a", name: "Service A" },
      { id: "service-b", name: "Service B" }
    ]
  }
];

export const AddNewEmailModal = ({
  tokens,
  isOpen,
  onClose,
  onAdd
}: AddNewEmailModalProps) => {
  const [email, setEmail] = useState("");
  const [selectedDashboards, setSelectedDashboards] = useState<Set<string>>(new Set(["apps"]));
  const [selectedServices, setSelectedServices] = useState<Record<string, Set<string>>>({
    software: new Set(),
    cloud: new Set(),
    apps: new Set()
  });

  // Ensure Apps Dashboard is selected when modal opens
  useEffect(() => {
    if (isOpen) {
      setSelectedDashboards(new Set(["apps"]));
    }
  }, [isOpen]);

  const handleDashboardToggle = (dashboardId: string) => {
    setSelectedDashboards((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(dashboardId)) {
        newSet.delete(dashboardId);
        // Clear services when dashboard is unchecked
        setSelectedServices((prevServices) => {
          const newServices = { ...prevServices };
          newServices[dashboardId] = new Set();
          return newServices;
        });
      } else {
        newSet.add(dashboardId);
      }
      return newSet;
    });
  };

  const handleServiceToggle = (dashboardId: string, serviceId: string) => {
    // Only allow service selection if dashboard is selected
    if (!selectedDashboards.has(dashboardId)) {
      return;
    }
    
    setSelectedServices((prev) => {
      const newState = { ...prev };
      const currentSet = newState[dashboardId] || new Set();
      const newSet = new Set(currentSet);
      
      if (newSet.has(serviceId)) {
        newSet.delete(serviceId);
      } else {
        newSet.add(serviceId);
      }
      
      newState[dashboardId] = newSet;
      return newState;
    });
  };

  const isDashboardSelected = (dashboardId: string) => {
    return selectedDashboards.has(dashboardId);
  };

  const handleAdd = () => {
    if (email.trim()) {
      const softwareServices = Array.from(selectedServices.software || new Set());
      const appsServices = Array.from(selectedServices.apps || new Set());
      const cloudServices = Array.from(selectedServices.cloud || new Set());
      
      if (onAdd) {
        onAdd({
          email: email.trim(),
          softwareServices,
          appsServices,
          cloudServices
        });
      }
      
      // Reset form
      setEmail("");
      setSelectedServices({
        software: new Set(),
        cloud: new Set(),
        apps: new Set()
      });
      onClose();
    }
  };

  const handleClose = () => {
    setEmail("");
    setSelectedDashboards(new Set());
    setSelectedServices({
      software: new Set(),
      cloud: new Set(),
      apps: new Set()
    });
    onClose();
  };

  const inputClass = getModalInputClass(tokens, { paddingY: "py-3", textColor: "text-[#2B3674]" });

  const checkboxClass = `relative h-5 w-5 rounded border-2 transition-colors cursor-pointer appearance-none ${
    tokens.isDark
      ? "border-white/30"
      : "border-[#E6E6E6]"
  }`;

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
          <div className={`relative w-full max-w-xl ${tokens.cardBase} ${tokens.isDark ? "bg-[#232637]" : "bg-white"} rounded-2xl max-h-[90vh] overflow-hidden flex flex-col`}>
            {/* Header */}
            <div className={`flex items-center justify-between px-6 pt-6 pb-4 flex-shrink-0 rounded-t-2xl ${
              tokens.isDark ? "bg-[#232637]" : "bg-[#FFFEF7]"
            }`}>
              <div className="flex items-center gap-3">
                <div className={`flex h-9 w-9 items-center justify-center rounded-full ${tokens.isDark ? tokens.buttonGhost : ""}`} style={tokens.isDark ? {} : { backgroundColor: APP_COLORS.buttonBackground }}>
                  <EmailIcon className={`h-5 w-5`} style={tokens.isDark ? {} : { color: APP_COLORS.primary }} />
                </div>
                <h2 className={`text-lg md:text-xl font-semibold ${tokens.isDark ? "text-white" : "text-black"}`}>
                  Add New Email
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
              <div className="flex flex-col gap-6">
                {/* Email Input */}
                <div className="relative">
                  <label 
                    className={`absolute left-4 -top-2.5 px-2 text-sm font-medium z-10 ${
                      tokens.isDark 
                        ? "text-white/70 bg-[#232637]" 
                        : "text-black bg-[#0F1217]"
                    }`}
                  >
                    Enter Email
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className={inputClass}
                    placeholder="aml@gmail.com"
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        handleAdd();
                      }
                    }}
                  />
                </div>

                {/* Dashboards and Services Selection */}
                <div className="flex flex-col gap-4">
                  <h3 className={`text-base font-semibold ${tokens.isDark ? "text-white" : "text-[#191D23]"}`}>
                    Select Dashboards and Their Services
                  </h3>

                  <div className="flex flex-col gap-4">
                    {dashboards.map((dashboard) => {
                      const isSelected = isDashboardSelected(dashboard.id);
                      const dashboardServices = selectedServices[dashboard.id] || new Set();

                      return (
                        <div key={dashboard.id} className="flex flex-col gap-2">
                          {/* Dashboard Checkbox */}
                          <label className="flex items-center gap-3 cursor-pointer">
                            <span className="relative inline-flex">
                              <input
                                type="checkbox"
                                checked={isSelected}
                                onChange={() => handleDashboardToggle(dashboard.id)}
                                className={checkboxClass}
                                style={{
                                  backgroundColor: isSelected ? "#4318FF" : "transparent",
                                  borderColor: isSelected
                                    ? "#4318FF"
                                    : tokens.isDark
                                      ? "rgba(255, 255, 255, 0.3)"
                                      : "#A3AED066"
                                }}
                              />
                              {isSelected && (
                                <span className="pointer-events-none absolute inset-0 grid place-items-center text-xs font-bold text-white">
                                  ✓
                                </span>
                              )}
                            </span>
                            <span className={`text-sm md:text-base font-bold ${tokens.isDark ? "text-white" : "text-black"}`}>
                              {dashboard.name}
                            </span>
                          </label>

                          {/* Services Checkboxes */}
                          {dashboard.services.length > 0 && isSelected && (
                            <div className="flex flex-col gap-2 ms-8">
                              {dashboard.services.map((service) => {
                                const isServiceSelected = dashboardServices.has(service.id);
                                return (
                                  <label
                                    key={service.id}
                                    className="flex items-center gap-3 cursor-pointer"
                                  >
                                    <span className="relative inline-flex">
                                      <input
                                        type="checkbox"
                                        checked={isServiceSelected}
                                        onChange={() => handleServiceToggle(dashboard.id, service.id)}
                                        className={checkboxClass}
                                        style={{
                                          backgroundColor: isServiceSelected ? "#4318FF" : "transparent",
                                          borderColor: isServiceSelected
                                            ? "#4318FF"
                                            : tokens.isDark
                                              ? "rgba(255, 255, 255, 0.3)"
                                              : "#A3AED066"
                                        }}
                                      />
                                      {isServiceSelected && (
                                        <span className="pointer-events-none absolute inset-0 grid place-items-center text-xs font-bold text-white">
                                          ✓
                                        </span>
                                      )}
                                    </span>
                                    <span className={`text-sm font-medium ${tokens.isDark ? "text-white/70" : "text-black"}`}>
                                      {service.name}
                                    </span>
                                  </label>
                                );
                              })}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className={`flex flex-col gap-3 mt-6 flex-shrink-0 border-t mx-6 ${tokens.isDark ? "border-white/20" : "border-[#E6E6E6]"} pt-2 pb-6`}>
              <button
                type="button"
                onClick={handleAdd}
                className="w-full px-6 py-3 rounded-full text-base font-medium transition-colors text-white"
                style={{ backgroundColor: APP_COLORS.primary }}
              >
                Add
              </button>
              <button
                type="button"
                onClick={handleClose}
                className={`w-full px-6 py-2.5 rounded-full text-base font-medium transition-colors ${
                  tokens.isDark
                    ? "border border-white/20 text-white hover:bg-white/10 bg-transparent"
                    : "border bg-white"
                }`}
                style={tokens.isDark ? {} : { borderColor: APP_COLORS.primary, color: APP_COLORS.primary }}
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

