import { useState, useEffect } from "react";
import { i18n } from "@shared/config/i18n";
import { ArrowRight, SettingsIcon, NumofApplicationsIcon, ActiveSubscriptionsIcon, TypeofApplicationsIcon, RevenueIcon, NewUpdatesIcon, ClockIcon, ArrowUpIcon, MasterIcon, GeneralIcon, RecentActivityReloadIcon } from "@utilities/icons";
import appWidget from "@assets/images/app/widget.png";
import mobileImage from "@assets/images/app/mobile.png";
import type { DashboardTokens, AppDashboardData, DashboardHeroContent } from "../../types";

type AppDashboardOverviewProps = {
  readonly data: AppDashboardData;
  readonly hero: DashboardHeroContent;
  readonly tokens: DashboardTokens;
  readonly onNavigateToMarketplace?: () => void;
  readonly onGoToSupport?: () => void;
};

// Donut Chart Component for App Categories
const CategoryDonutChart = ({ 
  items, 
  total, 
  size = 200,
  isDark = false
}: { 
  items: AppDashboardData["categories"]["items"]; 
  total: string;
  size?: number;
  isDark?: boolean;
}) => {
  const radius = (size - 50) / 2;
  const baseStrokeWidth = 45; // Base stroke width
  const centerX = size / 2;
  const centerY = size / 2;
  const gapAngle = 2; // Gap between segments in degrees
  const totalGapAngle = gapAngle * items.length; // Total gap needed
  const availableAngle = 360 - totalGapAngle; // Available angle for segments
  let startAngle = -90; // Start from top (12 o'clock) in degrees

  const segments = items.map((item, index) => {
    const percentage = item.percentage / 100;
    // Calculate angle proportional to percentage, accounting for gaps
    const angle = percentage * availableAngle;
    const endAngle = startAngle + angle;

    // Calculate stroke width based on percentage (larger = wider)
    // Range: baseStrokeWidth to baseStrokeWidth + 15
    const strokeWidth = baseStrokeWidth + (percentage * 15);

    // Convert to radians for arc calculation
    const startAngleRad = (startAngle * Math.PI) / 180;
    const endAngleRad = (endAngle * Math.PI) / 180;

    // Calculate arc path
    const largeArcFlag = angle > 180 ? 1 : 0;
    const x1 = centerX + radius * Math.cos(startAngleRad);
    const y1 = centerY + radius * Math.sin(startAngleRad);
    const x2 = centerX + radius * Math.cos(endAngleRad);
    const y2 = centerY + radius * Math.sin(endAngleRad);

    // Create arc path command
    const pathData = `M ${x1} ${y1} A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2}`;

    // Calculate midpoint angle for percentage label (center of segment)
    const midpointAngle = startAngle + (angle / 2);
    const midpointAngleRad = (midpointAngle * Math.PI) / 180;
    // Position label at the center of the segment (middle of the arc)
    const labelRadius = radius; // Center of the arc path
    const labelX = centerX + labelRadius * Math.cos(midpointAngleRad);
    const labelY = centerY + labelRadius * Math.sin(midpointAngleRad);

    // Move startAngle for next segment (add gap)
    startAngle = endAngle + gapAngle;

    const uniqueId = `gradient-${item.name.toLowerCase().replace(/\s+/g, '-')}-${index}`;
    const color = item.gradient ? `url(#${uniqueId})` : item.color;

    return {
      name: item.name,
      percentage: item.percentage,
      color,
      gradient: item.gradient,
      pathData,
      labelX,
      labelY,
      strokeWidth,
      uniqueId
    };
  });

  // Extract number from total (e.g., "12 Total Apps" -> "12")
  const totalNumber = total.split(" ")[0];
  const totalLabel = total.split(" ").slice(1).join(" ");

  const centerRadius = radius * 0.6; // Inner circle radius for the center area

  return (
    <div className="flex flex-col items-center gap-8 w-full">
      <div className="relative inline-flex items-center justify-center">
        <svg width={size} height={size}>
          <defs>
            {segments.map((segment) => {
              if (segment.gradient) {
                return (
                  <linearGradient key={segment.uniqueId} id={segment.uniqueId} x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor={segment.gradient.from} />
                    <stop offset="100%" stopColor={segment.gradient.to} />
                  </linearGradient>
                );
              }
              return null;
            })}
          </defs>
          {segments.map((segment, index) => (
            <g key={index}>
              <path
                d={segment.pathData}
                fill="none"
                stroke={segment.color}
                strokeWidth={segment.strokeWidth}
                strokeLinecap="butt"
                className="transition-all duration-300"
              />
              {/* Percentage label - white color, centered in segment */}
              <text
                x={segment.labelX}
                y={segment.labelY}
                textAnchor="middle"
                dominantBaseline="middle"
                className="text-xs font-semibold fill-white pointer-events-none"
                style={{ fontSize: '12px', fontWeight: '600' }}
              >
                {segment.percentage}%
              </text>
            </g>
          ))}
        </svg>
        {/* Center circle with dotted border - separate from rotated SVG */}
        <div 
          className="absolute inset-0 flex items-center justify-center pointer-events-none"
          style={{
            width: `${centerRadius * 2}px`,
            height: `${centerRadius * 2}px`,
            left: '50%',
            top: '50%',
            transform: 'translate(-50%, -50%)',
            borderRadius: '50%',
            border: '1px dashed #E0E0E0',
            backgroundColor: 'white'
          }}
        />
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <div className="flex flex-col items-center justify-center">
            <p className="text-5xl font-bold text-[#2B3674] leading-none">{totalNumber}</p>
            <p className="text-sm text-[#2B3674] mt-2">{totalLabel}</p>
          </div>
        </div>
      </div>
      <div className="flex flex-row flex-wrap justify-center items-center gap-x-6 gap-y-2 w-full">
        {items.map((item, index) => {
          const segment = segments[index];
          return (
            <div key={index} className="flex flex-wrap items-center gap-2">
              {segment.gradient ? (
                <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ background: `linear-gradient(135deg, ${segment.gradient.from} 0%, ${segment.gradient.to} 100%)` }}></div>
              ) : (
                <div
                  className="w-3 h-3 rounded-full flex-shrink-0"
                  style={{ backgroundColor: item.color }}
                ></div>
              )}
              <span className={`text-sm whitespace-nowrap ${isDark ? "text-white" : "text-black"}`}>
                {item.name}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

const getStatusBadge = (status: string) => {
  switch (status) {
    case "Active":
      return { 
        text: "Active", 
        bgColor: "#E2FFE9", 
        textColor: "#34C759" 
      };
    case "Expiring Soon":
      return { 
        text: "Expiring Soon", 
        bgColor: "#FFE5C3", 
        textColor: "#D57000" 
      };
    case "Expired":
      return { 
        text: "Expired", 
        bgColor: "#FFF4F3", 
        textColor: "#FF383C" 
      };
    default:
      return { 
        text: status, 
        bgColor: "rgba(156, 163, 175, 0.16)", 
        textColor: "#6B7280" 
      };
  }
};

export const AppDashboardOverview = ({
  data,
  hero,
  tokens,
  onNavigateToMarketplace,
  onGoToSupport
}: AppDashboardOverviewProps) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const isRTL = i18n.language === "ar";
  const cardClass = `${tokens.cardBase} rounded-[20px] px-6 py-4 transition-colors`;
  const primaryColor = "#0F6773";
  const bgColor = "#E7F0F1";

  // Preload hero image
  useEffect(() => {
    if (hero.backgroundImage) {
      // Add preload link to document head
      const link = document.createElement("link");
      link.rel = "preload";
      link.as = "image";
      link.href = hero.backgroundImage;
      link.setAttribute("fetchpriority", "high");
      document.head.appendChild(link);

      // Preload image
      const img = new Image();
      img.src = hero.backgroundImage;
      img.onload = () => setImageLoaded(true);
      img.onerror = () => setImageLoaded(true); // Still show content even if image fails

      return () => {
        // Cleanup: remove preload link when component unmounts
        document.head.removeChild(link);
      };
    } else {
      setImageLoaded(true);
    }
  }, [hero.backgroundImage]);

  const getStatIcon = (statId: string) => {
    switch (statId) {
      case "apps":
        return <NumofApplicationsIcon className="w-8 h-8" />;
      case "subscriptions":
        return <ActiveSubscriptionsIcon className="w-8 h-8" />;
      case "types":
        return <TypeofApplicationsIcon className="w-8 h-8" />;
      case "revenue":
        return <RevenueIcon className="w-8 h-8" />;
      default:
        return null;
    }
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Hero Section */}
      <section>
        <div
          className="relative overflow-hidden rounded-[20px] px-8 py-8 text-white transition-all duration-500"
          style={hero.gradient ? { background: hero.gradient } : undefined}
        >
          {/* Hero Image */}
          {hero.backgroundImage && (
            <img
              src={hero.backgroundImage}
              alt="Hero background"
              className={`absolute inset-0 w-full h-full rounded-[20px]  object-cover transition-opacity duration-500 ${
                imageLoaded ? "opacity-100" : "opacity-0"
              }`}
              loading="eager"
              fetchPriority="high"
              onLoad={() => setImageLoaded(true)}
            />
          )}
          <div className="relative z-10 flex flex-col">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold leading-tight transition-opacity duration-500 max-w-2xl">
              Let's<br />Get Started
            </h1>
            <button
              type="button"
              className="inline-flex items-center gap-1 w-fit rounded-full border border-white bg-transparent px-5 md:px-6 py-2.5 text-sm text-white transition hover:opacity-90 whitespace-nowrap mt-6"
            >
              <span>{hero.ctaLabel}</span>
              <ArrowRight className={`h-4 w-4 flex-shrink-0 [&_path]:stroke-white ${isRTL ? "rotate-180" : ""}`} />
            </button>
          </div>
        </div>
      </section>

      {/* Statistics Cards */}
      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {data.stats.map((stat) => {
          const Icon = getStatIcon(stat.id);
          return (
            <div
              key={stat.id}
              className={`${cardClass} flex flex-col gap-2 px-4 py-7`}
            >
              <div className="flex flex-wrap items-center gap-3">
                <div 
                  className={`flex items-center justify-center rounded-full p-2 ${tokens.isDark ? "bg-[var(--color-icon-surface)]" : ""}`}
                  style={tokens.isDark ? {} : { backgroundColor: bgColor }}
                >
                  {Icon && (
                    <div style={{ color: tokens.isDark ? "white" : primaryColor }}>
                      {Icon}
                    </div>
                  )}
                </div>
                <div>
                  <p className="text-sm md:text-base font-medium text-[#A3AED0]">{stat.label}</p>
                  <p className={`text-2xl mt-2 font-bold ${tokens.isDark ? "text-white" : "text-[#2B3674]"}`}>{stat.value}</p>
                </div>
              </div>
            </div>
          );
        })}
      </section>

      {/* Subscriptions Overview */}
      <section>
        <div className={cardClass}>
          <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
            <h3 className={`text-lg lg:text-xl font-bold ${tokens.isDark ? "text-[var(--color-page-text)]" : "text-[#2B3674]"}`}>
              Subscriptions Overview
            </h3>
            <button 
              type="button" 
              onClick={onNavigateToMarketplace}
              className="px-1 text-sm font-bold flex items-center gap-1 cursor-pointer"
              style={{ color: "#A3AED0" }}
            >
              See All <ArrowRight className={`h-4 w-4 ${isRTL ? "rotate-180" : ""}`} style={{ stroke: "#A3AED0" }} />
            </button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {data.subscriptions.map((subscription) => {
                // const badge = getStatusBadge(subscription.status);
                return (
                  <div
                    key={subscription.id}
                    className={`rounded-[20px] ${tokens.isDark ? "bg-[#0F1217]" : "bg-[#FAFAFA]"}`}
                  >
                    <div className="relative p-4">
                      {/* Mobile Image */}
                      <div className="relative h-40 mb-4 rounded-[20px] overflow-hidden">
                        <img 
                          src={mobileImage} 
                          alt="" 
                          className="w-full h-full object-cover"
                        />
                        {/* Status Badge */}
                        {/* <span 
                          className="absolute top-2 right-2 rounded-full px-2 py-1.5 text-xs font-semibold z-20 flex items-center gap-1.5"
                          style={{ 
                            backgroundColor: badge.bgColor, 
                            color: badge.textColor 
                          }}
                        >
                          <span 
                            className="w-1.5 h-1.5 rounded-full"
                            style={{ backgroundColor: badge.textColor }}
                          ></span>
                          {badge.text}
                        </span> */}
                      </div>
                      {/* Subscription Info */}
                      <div className="relative z-10">
                        <h4 className="text-base font-semibold text-[var(--color-page-text)] mb-2">
                          {subscription.name}
                        </h4>
                        <div className="flex flex-wrap items-center justify-between">
                          <div className="flex items-center gap-4">
                            <div className="flex items-center gap-1">
                              {(() => {
                                const planLower = subscription.plan?.toLowerCase();
                                if (planLower === "master") {
                                  return (
                                    <>
                                      <MasterIcon className="h-3 w-3 text-[#A3AED0]" />
                                      <p className="text-sm text-[#A3AED0]">Master</p>
                                    </>
                                  );
                                } else if (planLower === "general") {
                                  return (
                                    <>
                                      <GeneralIcon className="h-3 w-3 text-[#A3AED0]" />
                                      <p className="text-sm text-[#A3AED0]">General</p>
                                    </>
                                  );
                                } else {
                                  // For other plans, show General icon and the original plan text
                                  return (
                                    <>
                                      <GeneralIcon className="h-3 w-3 text-[#A3AED0]" />
                                      <p className="text-sm text-[#A3AED0]">{subscription.plan}</p>
                                    </>
                                  );
                                }
                              })()}
                            </div>
                            <div className="flex items-center gap-1">
                              <ClockIcon className="h-3 w-3 text-[#A3AED0]" />
                              <p className="text-sm text-[#A3AED0]">{subscription.expiryDate}</p>
                            </div>
                          </div>
                          {/* Arrow Icon */}
                          <div className="flex justify-end flex items-center justify-center text-center cursor-pointer flex-shrink-0">
                            <ArrowUpIcon className="w-7 h-7 p-1 bg-gradient-to-b from-[#0F677344] to-[#0F6773] rounded-full" />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
      </section>

      {/* Quick Access and Need Help Section */}
      <section className="grid gap-6 lg:grid-cols-[2fr_1fr]">
        {/* Quick Access */}
        <div className={cardClass}>
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h3 className={`text-lg lg:text-xl font-bold ${tokens.isDark ? "text-[var(--color-page-text)]" : "text-[#2B3674]"}`}>
              Quick Access
            </h3>
            <button 
              type="button" 
              className="px-1 text-sm font-bold flex items-center gap-1 cursor-pointer"
              style={{ color: "#A3AED0" }}
            >
              See All <ArrowRight className={`h-4 w-4 ${isRTL ? "rotate-180" : ""}`} style={{ stroke: "#A3AED0" }} />
            </button>
          </div>
          <div className="mt-4 flex flex-col gap-4">
            {data.quickAccess.map((item) => {
              return (
                <div
                  key={item.id}
                  className={`grid gap-3 rounded-[20px] ${tokens.isDark ? "bg-[#0F1217]" : "bg-[#E9F5F4]"} px-4 py-1  stroke text-sm md:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)_minmax(0,1fr)_minmax(0,1fr)_auto] md:items-center`}
                >
                  <div>
                    <p className="font-medium text-base text-[var(--color-page-text)]">{item.name}</p>
                    <span className={`text-sm ${tokens.isDark ? "text-white/50" : "text-[#38818B]"}`}>App Name</span>
                  </div>
                  <p className="font-medium text-base text-[var(--color-page-text)] flex items-start flex-col gap-1">
                    {item.plan}
                    <span className={`text-sm ${tokens.isDark ? "text-white/50" : "text-[#38818B]"}`}>Plan</span>
                  </p>
                  <p className="font-medium text-base text-[var(--color-page-text)] flex items-start flex-col gap-1">
                    {getStatusBadge(item.status).text}
                    <span className={`text-sm ${tokens.isDark ? "text-white/50" : "text-[#38818B]"}`}>Status</span>
                  </p>
                  <p className="font-medium text-base text-[var(--color-page-text)] flex items-start flex-col gap-1">{item.expiryDate}<span className={`text-sm ${tokens.isDark ? "text-white/50" : "text-[#38818B]"}`}>Expiry Date</span></p>
                  <button
                    type="button"
                    className="flex items-start flex-col gap-2 rounded-full px-4 py-2 text-xs font-semibold"
                  >
                    <div className={`flex items-center justify-center rounded-full p-1.5 ${tokens.isDark ? "bg-[var(--color-icon-surface)]" : "bg-[#D3E7E7]"}`}>
                      <SettingsIcon className={`h-4 w-4 ${tokens.isDark ? "[&_path]:fill-white" : "[&_path]:fill-[#0F6773]"}`} />
                    </div>
                    <span className={`text-sm font-medium ${tokens.isDark ? "text-white/50" : "text-[#38818B]"}`}>Manage</span>
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        {/* Need Help Card */}
        <div className="relative">
          <img src={appWidget} alt="" className="w-full object-cover" />
          <div className="absolute inset-0 p-6 flex flex-col gap-1 justify-between">
            <div>
              <div className="flex items-start justify-between">
                <h3 className="text-lg md:text-3xl lg:text-[44px] font-bold text-[#F2F2F2]">
                  Need help?
                </h3>
              </div>
            </div>
            <div className="flex items-start flex-col gap-2 w-full">
              <p className="text-lg md:text-3xl lg:text-[44px] text-white">
                Contact our support team anytime
              </p>
            </div>
            <div className="flex items-center w-full mt-auto">
              <button
                type="button"
                onClick={onGoToSupport}
                className="flex h-11 flex-1 items-center justify-center gap-2 rounded-full bg-white px-4 text-sm font-semibold text-[#0F6773] transition hover:opacity-90"
              >
                <span>Go to Support</span>
              </button>
                <div className="w-11 h-11 bg-white rounded-full flex items-center justify-center text-center cursor-pointer flex-shrink-0 -ml-2">
                  <ArrowUpIcon className="w-6 h-6 p-1 bg-gradient-to-b from-[#0F677344] to-[#0F6773] rounded-full" />
                </div>
            </div>
          </div>
        </div>
      </section>

      {/* App Categories and Recent Activity */}
      <section className="grid gap-6 lg:grid-cols-2">
        {/* App Categories */}
        <div className={`${cardClass} overflow-hidden`}>
          <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
            <h3 className={`text-lg lg:text-xl font-bold ${tokens.isDark ? "text-[var(--color-page-text)]" : "text-[#2B3674]"}`}>
              App Categories
            </h3>
          </div>
          <div className="flex flex-col items-center justify-center py-4">
            <CategoryDonutChart items={data.categories.items} total={data.categories.total} size={220} isDark={tokens.isDark} />
          </div>
        </div>

        {/* Recent Activity */}
        <div className={cardClass}>
          <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
            <h3 className={`text-lg lg:text-xl font-bold ${tokens.isDark ? "text-[var(--color-page-text)]" : "text-[#2B3674]"}`}>
              Recent Activity
            </h3>
            <button 
              type="button" 
              className="px-1 text-sm font-bold flex items-center gap-1 cursor-pointer"
              style={{ color: "#A3AED0" }}
            >
              See All <ArrowRight className={`h-4 w-4 ${isRTL ? "rotate-180" : ""}`} style={{ stroke: "#A3AED0" }} />
            </button>
          </div>
          <div className="space-y-4">
            {data.activities.map((activity, index) => (
              <div
                key={activity.id}
                className="flex items-start gap-3"
              >
                <div 
                  className={`flex items-center justify-center rounded-full p-2 flex-shrink-0 ${tokens.isDark ? "bg-[var(--color-icon-surface)]" : ""}`}
                  style={tokens.isDark ? {} : { backgroundColor: bgColor }}
                >
                  <div style={{ color: tokens.isDark ? "white" : primaryColor }}>
                    {index === 1 ? (
                      <NewUpdatesIcon className="w-5 h-5" />
                    ) : (
                      <RecentActivityReloadIcon className="w-5 h-5" />
                    )}
                  </div>
                </div>
                <div className="flex-1 flex items-center gap-1">
                  <p className="text-sm md:text-base text-[var(--color-page-text)]">{activity.message}</p>
                  <p className={`text-xs md:text-sm ${tokens.isDark ? "text-white/50" : "text-[#0F6773]"}`}>{activity.timeAgo}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

