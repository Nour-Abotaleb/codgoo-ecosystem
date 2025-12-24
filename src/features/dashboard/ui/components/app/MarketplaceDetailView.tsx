import { useState } from "react";
import toast from "react-hot-toast";
import { i18n } from "@shared/config/i18n";
import { ArrowRight, EmailIcon, PhoneIcon, FileCodeIcon, MarketPlaceCartIcon, WoocommerceIcon, SnapchatColoredIcon } from "@utilities/icons";
import allCustomersImage from "@assets/images/app/all-customers.svg";
import screenshot1 from "@assets/images/app/screenshot1.svg";
import screenshot2 from "@assets/images/app/screenshot2.svg";
import { useAttachAppToBundleMutation } from "@/store/api/marketplace-api";
import type { DashboardTokens } from "../../types";
import type { MarketplaceItem } from "./MarketplaceCard";

type MarketplaceDetailViewProps = {
  readonly item: MarketplaceItem;
  readonly tokens: DashboardTokens;
  readonly onBack?: () => void;
};

type Tab = "Overview" | "Features" | "Pricing" | "Screenshots";

export const MarketplaceDetailView = ({ item, tokens }: MarketplaceDetailViewProps) => {
  const [activeTab, setActiveTab] = useState<Tab>("Overview");
  const isRTL = i18n.language === "ar";
  
  const [attachAppToBundle, { isLoading: isAttaching }] = useAttachAppToBundleMutation();

  const tabs: readonly Tab[] = ["Overview", "Features", "Pricing", "Screenshots"];

  // Get bundle_package_id from localStorage subscriptions
  const getBundlePackageId = (): number | null => {
    try {
      const subscriptionsStr = localStorage.getItem("auth_subscriptions");
      if (!subscriptionsStr) return null;
      
      const subscriptions = JSON.parse(subscriptionsStr);
      if (Array.isArray(subscriptions) && subscriptions.length > 0) {
        // Get the first active subscription's bundle_package_id
        const activeSubscription = subscriptions.find((sub: any) => sub.status === "active");
        return activeSubscription?.bundle_package_id || subscriptions[0]?.bundle_package_id || null;
      }
      return null;
    } catch (error) {
      console.error("Error reading subscriptions from localStorage:", error);
      return null;
    }
  };

  // Handle subscription button click
  const handleSubscribe = async () => {
    const bundleId = getBundlePackageId();
    
    if (!bundleId) {
      toast.error("No active subscription found. Please subscribe to a bundle first.");
      return;
    }

    if (!item.id) {
      toast.error("Application ID is missing.");
      return;
    }

    try {
      // Convert string id to number
      const appId = parseInt(item.id, 10);
      if (isNaN(appId)) {
        toast.error("Invalid application ID.");
        return;
      }

      const result = await attachAppToBundle({
        bundleId,
        applications: [appId],
      }).unwrap();

      if (result.status) {
        toast.success(result.message || "Application subscribed successfully!");
      } else {
        toast.error(result.message || "Failed to subscribe to application.");
      }
    } catch (error: any) {
      console.error("Error subscribing to application:", error);
      toast.error(error?.data?.message || "An error occurred while subscribing.");
    }
  };

  return (
    <div className="flex flex-col gap-4">
      {/* Top Section: Application Header, Rating Card, and Sidebar */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_350px] gap-4 items-start">
        {/* Left Column: Application Header, Rating Card, Tabs, and Content */}
        <div className="flex flex-col gap-4">
          {/* Application Header */}
          <div className={`${tokens.cardBase} rounded-2xl p-4`}>
            <div className="flex items-start gap-4">
              {/* Icon */}
              <div className="flex-shrink-0">
                <div
                  className="w-18 h-18 rounded-full flex items-center justify-center"
                  style={
                    item.iconGradient
                      ? { background: item.iconGradient }
                      : { backgroundColor: item.iconColor || "#E7F0F1" }
                  }
                >
                  {item.icon}
                </div>
              </div>

              {/* Title and Info */}
              <div className="flex-1">
                <h2 className={`text-2xl font-bold mb-2 ${tokens.isDark ? "text-white" : "text-[#000000]"}`}>
                  {item.title}
                </h2>
                <p className={`text-base mb-4 ${tokens.isDark ? "text-white/70" : "text-[#5F5F5F]"}`}>
                  Connect your store with Snapchat advertising platform for better reach and engagement with younger demographics.
                </p>

                {/* Action Buttons */}
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={handleSubscribe}
                    disabled={isAttaching}
                    className="px-6 py-2.5 rounded-full font-medium text-white transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                    style={{ backgroundColor: "#0F6773" }}
                  >
                    {isAttaching ? "Subscribing..." : "Subscription"}
                  </button>
                  <button
                    type="button"
                    className="px-6 py-2.5 rounded-full font-medium transition-colors cursor-pointer"
                    style={{
                      borderColor: tokens.isDark ? "rgba(255,255,255,0.2)" : "#E6E9FB",
                      color: tokens.isDark ? "#2B3674" : "#2B3674",
                      backgroundColor: tokens.isDark ? "#F0F0F0" : "#F0F0F0"
                    }}
                  >
                    Free Trial
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Rating Card */}
          <div className={`${tokens.cardBase} rounded-2xl p-4`}>
            <div className="flex items-center gap-3">
              <div className="flex items-center">
                {Array.from({ length: 5 }).map((_, i) => (
                  <span
                    key={i}
                    className="text-xl"
                    style={{
                      color:
                        i < Math.floor(item.rating)
                          ? "#F8C56B"
                          : i === Math.floor(item.rating) && item.rating % 1 >= 0.5
                          ? "#F8C56B"
                          : "#E0E0E0"
                    }}
                  >
                    ★
                  </span>
                ))}
              </div>
              <span className={`text-base ${tokens.isDark ? "text-white/70" : "text-bla"}`}>
                ({item.rating}) {item.reviewCount.toLocaleString()} reviews
              </span>
              <button
                type="button"
                className="flex items-center gap-1 text-sm font-medium ml-auto"
                style={{ color: tokens.isDark ? "#A3AED0" : "#0F6773" }}
              >
                <span>View All Reviews</span>
                <ArrowRight className={`h-4 w-4 ${isRTL ? "rotate-180" : ""}`} />
              </button>
            </div>
          </div>

          {/* Tabs and Content Card */}
          <div className={`${tokens.cardBase} rounded-2xl p-4`}>
            {/* Tabs */}
            <div className="flex items-center gap-2 border-b mb-6" style={{ borderColor: tokens.isDark ? "rgba(255,255,255,0.1)" : "#E6E9FB" }}>
              {tabs.map((tab) => (
                <button
                  key={tab}
                  type="button"
                  onClick={() => setActiveTab(tab)}
                  className={`px-4 py-3 text-sm font-medium transition-colors relative ${
                    activeTab === tab
                      ? tokens.isDark
                        ? "text-white"
                        : "text-[#0F6773]"
                      : tokens.isDark
                      ? "text-white/70 hover:text-white"
                      : "text-black hover:text-[#2B3674]"
                  }`}
                >
                  {tab}
                  {activeTab === tab && (
                    <div
                      className="absolute bottom-0 left-0 right-0 h-0.5"
                      style={{ backgroundColor: "#0F6773" }}
                    />
                  )}
                </button>
              ))}
            </div>

            {/* Tab Content */}
            {activeTab === "Overview" && (
              <div className="flex flex-col gap-4">
              {/* Description */}
              <div className={`${tokens.cardBase} rounded-2xl p-4`}>
                <h3 className={`text-lg font-bold mb-3 ${tokens.isDark ? "text-white" : "text-black"}`}>
                  Overview
                </h3>
                <p className={`text-sm leading-relaxed ${tokens.isDark ? "text-white/70" : "text-black"}`}>
                  Snapchat Ads Manager is a powerful tool that allows you to create and manage Snapchat advertising campaigns with advanced targeting options. Connect your store with Snapchat advertising platform for better reach and engagement with younger demographics. Manage your campaigns in real-time and track performance metrics.
                </p>
              </div>

              {/* All Customers Image */}
              <div className="w-full">
                <img
                  src={allCustomersImage}
                  alt="All Customers"
                  className="w-full h-auto rounded-2xl"
                />
              </div>

              {/* All Customers Table */}
              {/* <div className={`${tokens.cardBase} rounded-2xl overflow-hidden`}>
                <div className="p-6 border-b" style={{ borderColor: tokens.isDark ? "rgba(255,255,255,0.1)" : "#E6E9FB" }}>
                  <h3 className={`text-lg font-bold ${tokens.isDark ? "text-white" : "text-[#2B3674]"}`}>
                    All Customers
                  </h3>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className={tokens.isDark ? "" : "bg-[#F7F6FF]"}>
                      <tr>
                        {["Customer Name", "Company", "Phone Number", "Email", "Country", "Status"].map(
                          (header) => (
                            <th
                              key={header}
                              className={`px-4 py-3 text-left text-xs font-semibold uppercase ${
                                tokens.isDark ? "text-white/70" : "text-[#718EBF]"
                              }`}
                            >
                              {header}
                            </th>
                          )
                        )}
                      </tr>
                    </thead>
                    <tbody>
                      <tr className={tokens.isDark ? "bg-[#0F1217]" : "bg-white"}>
                        <td className="px-4 py-3 font-medium text-[var(--color-card-text)]">Jane Cooper</td>
                        <td className="px-4 py-3 text-[var(--color-card-text)]">Microsoft</td>
                        <td className="px-4 py-3 text-[var(--color-card-text)]">+1 234 567 890</td>
                        <td className="px-4 py-3 text-[var(--color-card-text)]">jane@microsoft.com</td>
                        <td className="px-4 py-3 text-[var(--color-card-text)]">USA</td>
                        <td className="px-4 py-3">
                          <span
                            className="inline-flex items-center justify-center px-3 py-1 rounded-full text-xs font-medium"
                            style={{ backgroundColor: "#E2FFE9", color: "#34C759" }}
                          >
                            Active
                          </span>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div> */}
              </div>
            )}

            {/* Features Tab */}
            {activeTab === "Features" && (
              <div className="flex flex-col gap-4">
                <div className={`${tokens.cardBase} rounded-2xl p-4`}>
                  <h3 className={`text-lg font-bold mb-4 ${tokens.isDark ? "text-white" : "text-black"}`}>
                    Features
                  </h3>
                  <ul className="flex flex-col gap-3">
                    {[
                      "Direct integration with Snapchat Ads platform",
                      "Easy creation of targeted advertising campaigns",
                      "Performance tracking and detailed analytics",
                      "Support for Arabic and English languages",
                      "Integration with Shopify and WooCommerce stores"
                    ].map((feature, index) => (
                      <li key={index} className="flex items-start gap-3">
                        <svg
                          className="w-5 h-5 flex-shrink-0 mt-0.5"
                          viewBox="0 0 20 20"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M16.7071 5.29289C17.0976 5.68342 17.0976 6.31658 16.7071 6.70711L8.70711 14.7071C8.31658 15.0976 7.68342 15.0976 7.29289 14.7071L3.29289 10.7071C2.90237 10.3166 2.90237 9.68342 3.29289 9.29289C3.68342 8.90237 4.31658 8.90237 4.70711 9.29289L8 12.5858L15.2929 5.29289C15.6834 4.90237 16.3166 4.90237 16.7071 5.29289Z"
                            fill="#12B02B"
                          />
                        </svg>
                        <span className={`text-sm ${tokens.isDark ? "text-white/70" : "text-black"}`}>
                          {feature}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}

            {/* Pricing Tab */}
            {activeTab === "Pricing" && (
              <div className="flex flex-col gap-4">
                <div className={`${tokens.cardBase} rounded-2xl p-4`}>
                  <h3 className={`text-lg font-semibold mb-2 ${tokens.isDark ? "text-white" : "text-black"}`}>
                    Pricing Plans
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* Free Plan */}
                    <div className={`${tokens.cardBase} rounded-2xl p-4 border ${
                      tokens.isDark ? "border-white/10" : "border-[#DBDBDB]"
                    }`}>
                      <div className="mb-2">
                        <h4 className={`text-xl font-bold mb-2 ${tokens.isDark ? "text-white" : "text-black"}`}>
                          Free
                        </h4>
                        <p className={`text-2xl font-bold ${tokens.isDark ? "text-white" : "text-black"}`}>
                          $0<span className="text-base font-normal">/month</span>
                        </p>
                      </div>
                      <ul className="flex flex-col gap-2">
                        {[
                          "Up to 100 products",
                          "1 advertising campaign",
                          "Basic reports"
                        ].map((feature, index) => (
                          <li key={index} className="flex items-center gap-1">
                           <span>.</span>
                            <span className={`text-sm text-nowrap ${tokens.isDark ? "text-white/70" : "text-black"}`}>
                              {feature}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Professional Plan */}
                    <div className={`${tokens.cardBase} rounded-2xl p-4 border-2 relative ${
                      tokens.isDark ? "border-[#0F6773]" : "border-[#0F6773]"
                    }`}>
                      <div className="absolute top-4 right-2">
                        <span
                          className="inline-flex items-center justify-center px-3 py-2 rounded-full text-xs font-light text-white"
                          style={{ backgroundColor: "#0F6773" }}
                        >
                          Most Popular
                        </span>
                      </div>
                      <div className="mb-2">
                        <h4 className={`text-xl font-bold mb-2 ${tokens.isDark ? "text-white" : "text-black"}`}>
                          Professional
                        </h4>
                        <p className={`text-2xl font-bold ${tokens.isDark ? "text-white" : "text-black"}`}>
                          $29<span className="text-base font-normal">/month</span>
                        </p>
                      </div>
                      <ul className="flex flex-col gap-2">
                        {[
                          "Unlimited products",
                          "Unlimited advertising campaigns",
                          "Advanced reports",
                          "24/7 technical support"
                        ].map((feature, index) => (
                          <li key={index} className="flex items-center gap-1">
                            <span>.</span>
                            <span className={`text-sm text-nowrap ${tokens.isDark ? "text-white/70" : "text-black"}`}>
                              {feature}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Enterprise Plan */}
                    <div className={`${tokens.cardBase} rounded-2xl p-4 border ${
                      tokens.isDark ? "border-white/10" : "border-[#DBDBDB]"
                    }`}>
                      <div className="mb-2">
                        <h4 className={`text-xl font-bold mb-2 ${tokens.isDark ? "text-white" : "text-black"}`}>
                          Enterprise
                        </h4>
                        <p className={`text-2xl font-bold ${tokens.isDark ? "text-white" : "text-black"}`}>
                          $99<span className="text-base font-normal">/month</span>
                        </p>
                      </div>
                      <ul className="flex flex-col gap-2">
                        {[
                          "All Professional features",
                          "Dedicated account manager",
                          "Custom API integration",
                          "Team training"
                        ].map((feature, index) => (
                          <li key={index} className="flex items-center gap-1">
                            <span>.</span>
                            <span className={`text-sm text-nowrap ${tokens.isDark ? "text-white/70" : "text-black"}`}>
                              {feature}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Screenshots Tab */}
            {activeTab === "Screenshots" && (
              <div className="flex flex-col gap-4">
                <div className={`${tokens.cardBase} rounded-2xl p-4`}>
                  <h3 className={`text-lg font-bold mb-4 ${tokens.isDark ? "text-white" : "text-black"}`}>
                    Screenshots
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="w-full">
                      <img
                        src={screenshot1}
                        alt="Screenshot 1 - Community"
                        className="w-full h-auto opacity-90 rounded-2xl"
                      />
                    </div>
                    <div className="w-full">
                      <img
                        src={screenshot2}
                        alt="Screenshot 2 - Explore"
                        className="w-full h-auto opacity-90 rounded-2xl"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Other tabs placeholder */}
            {activeTab !== "Overview" && activeTab !== "Features" && activeTab !== "Pricing" && activeTab !== "Screenshots" && (
              <div className="p-10 text-center">
                <p className={`text-lg ${tokens.isDark ? "text-white/70" : "text-[#718EBF]"}`}>
                  {activeTab} content coming soon...
                </p>
              </div>
            )}
          </div>

          {/* Supported Integrations */}
          <div className={`${tokens.cardBase} rounded-2xl p-4`}>
            <h3 className={`text-lg font-bold mb-4 ${tokens.isDark ? "text-white" : "text-black"}`}>
              Supported Integrations
            </h3>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-3">
                <SnapchatColoredIcon className="w-6 h-6" />
                <span className={`font-medium ${tokens.isDark ? "text-white" : "text-[#111111]"}`}>
                  Snapchat
                </span>
              </div>
              <div className="flex items-center gap-3">
                <MarketPlaceCartIcon className="w-6 h-6" />
                <span className={`font-medium ${tokens.isDark ? "text-white" : "text-[#111111]"}`}>
                  Shopify
                </span>
              </div>
              <div className="flex items-center gap-3">
                <WoocommerceIcon className="w-6 h-6" />
                <span className={`font-medium ${tokens.isDark ? "text-white" : "text-[#111111]"}`}>
                  WooCommerce
                </span>
              </div>
            </div>
          </div>

          {/* Customer Reviews */}
          <div className={`${tokens.cardBase} rounded-2xl p-4`}>
            <h3 className={`text-lg font-bold mb-4 ${tokens.isDark ? "text-white" : "text-black"}`}>
              Customer Reviews
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {Array.from({ length: 3 }).map((_, i) => (
                <div
                  key={i}
                  className={`rounded-xl p-4 ${
                    tokens.isDark ? "bg-[#0F1217]" : "border border-[#DBDBDB]"
                  }`}
                >
                  <div className="flex items-center gap-1 mb-3">
                    <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-400 to-purple-500" />
                    <div className="flex items-center justify-between gap-5">
                      <p className={`font-medium flex items-center text-sm gap-1 ${tokens.isDark ? "text-white" : "text-black"}`}>
                        Michael Brown
                      </p>
                      <div className="flex items-center gap-1">
                        <span className="text-sm font-normal">(4.5)</span>
                        <span className="text-base" style={{ color: "#F8C56B" }}>★</span>
                      </div>
                    </div>
                  </div>
                  <p className={`text-sm ${tokens.isDark ? "text-white/70" : "text-black"}`}>
                    Seamless integration and real-time campaign management make this a must-have tool for any business looking to expand their reach.
                  </p>
                </div>
              ))}
            </div>
            <div className="flex items-center justify-center gap-2 mt-4">
              <button
                type="button"
                className={`w-8 h-8 rounded-md flex items-center bg-[#0F6773] justify-center ${
                  tokens.isDark ? "hover:bg-white/10" : "hover:bg-gray-100"
                }`}
              >
                <ArrowRight className={`h-4 w-4 ${isRTL ? "" : "rotate-180"} text-white`} />
              </button>
              <button
                type="button"
                className={`w-8 h-8 rounded-md flex bg-[#0F6773] items-center justify-center ${
                  tokens.isDark ? "hover:bg-white/10" : "hover:bg-gray-100"
                }`}
              >
                <ArrowRight className={`h-4 w-4 ${isRTL ? "rotate-180" : ""} text-white`} />
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Subscription & Technical Support Sidebar */}
        <div className={`${tokens.cardBase} rounded-2xl p-4`}>
          {/* Subscription Header */}
          <div className="flex justify-center mb-6 w-full">
            <span
              className="inline-flex items-center justify-center w-full px-6 py-2.5 rounded-full text-sm font-semibold text-white"
              style={{ backgroundColor: "#0F6773" }}
            >
              Subscription
            </span>
          </div>

          {/* Details */}
          <div className="flex flex-col gap-4 mb-6">
            <div className="flex items-center justify-between">
              <span className={`text-sm font-semibold ${tokens.isDark ? "text-white/70" : "text-[#5F5F5F]"}`}>
                Category
              </span>
              <span className={`text-sm font-semibold ${tokens.isDark ? "text-white" : "text-black"}`}>
                Marketing & Advertising
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className={`text-sm font-semibold ${tokens.isDark ? "text-white/70" : "text-[#5F5F5F]"}`}>
                Last Update
              </span>
              <span className={`text-sm font-semibold ${tokens.isDark ? "text-white" : "text-black"}`}>
                Sep 15, 2024
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className={`text-sm font-semibold ${tokens.isDark ? "text-white/70" : "text-[#5F5F5F]"}`}>
                Installs
              </span>
              <span className={`text-sm font-semibold ${tokens.isDark ? "text-white" : "text-black"}`}>
                5,000+
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className={`text-sm font-semibold ${tokens.isDark ? "text-white/70" : "text-[#5F5F5F]"}`}>
                Version
              </span>
              <span className={`text-sm font-semibold ${tokens.isDark ? "text-white" : "text-black"}`}>
                2.1.0
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className={`text-sm font-semibold ${tokens.isDark ? "text-white/70" : "text-[#5F5F5F]"}`}>
                Size
              </span>
              <span className={`text-sm font-semibold ${tokens.isDark ? "text-white" : "text-black"}`}>
                12.5 MB
              </span>
            </div>
          </div>

          {/* Separator */}
          <div
            className="h-px mb-6"
            style={{ backgroundColor: tokens.isDark ? "rgba(255,255,255,0.1)" : "#E6E9FB" }}
          />

          {/* Technical Support */}
          <div>
            <h3 className={`text-base font-bold mb-4 ${tokens.isDark ? "text-white" : "text-black"}`}>
              Technical Support
            </h3>
            <div className="flex flex-col gap-3">
              <button
                type="button"
                className="flex items-center gap-3 text-sm font-medium transition-colors"
                style={{ color: "#0F6773" }}
              >
                <EmailIcon className="h-5 w-5" />
                <span>Help Center</span>
              </button>
              <button
                type="button"
                className="flex items-center gap-3 text-sm font-medium transition-colors"
                style={{ color: "#0F6773" }}
              >
                <FileCodeIcon className="h-5 w-5" />
                <span>Documentation</span>
              </button>
              <button
                type="button"
                className="flex items-center gap-3 text-sm font-medium transition-colors"
                style={{ color: "#0F6773" }}
              >
                <PhoneIcon className="h-5 w-5" />
                <span>Contact Us</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

