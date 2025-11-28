import { useEffect, useState } from "react";
import { i18n } from "@shared/config/i18n";
import { ArrowRight, ActiveIcon, PendingIcon, UnpaidIcon, CalendarIcon, ClockIcon, PlusCircleIcon, SettingsIcon, CloseIcon } from "@utilities/icons";
import type { DashboardTokens, SoftwareDashboardData, DashboardHeroContent } from "../../types";

type SoftwareDashboardOverviewProps = {
  readonly data: SoftwareDashboardData;
  readonly hero: DashboardHeroContent;
  readonly tokens: DashboardTokens;
};

// Donut Chart Component
const DonutChart = ({ 
  items, 
  size = 140 
}: { 
  items: SoftwareDashboardData["proposals"]["items"]; 
  size?: number;
}) => {
  const radius = (size - 30) / 2;
  const circumference = 2 * Math.PI * radius;
  const gapSize = 2; // Gap size in pixels between segments (increased for better visibility)
  const totalGaps = items.length * gapSize;
  const adjustedCircumference = circumference - totalGaps;
  let cumulativeOffset = 0;

  const segments = items.map((item) => {
    const percentage = item.percentage / 100;
    const segmentLength = percentage * adjustedCircumference;
    const offset = -cumulativeOffset; // Negative because we're rotating counter-clockwise
    cumulativeOffset += segmentLength + gapSize; // Add gap after each segment

    // Calculate remaining space after this segment and gap
    const remainingSpace = circumference - segmentLength - gapSize;

    return {
      ...item,
      offset,
      segmentLength,
      // Pattern: draw segment, gap, then remaining space (as gap to prevent repetition)
      // This ensures all segments have consistent gaps between them
      strokeDasharray: `${segmentLength} ${gapSize} ${remainingSpace}`
    };
  });

  return (
    <div className="relative inline-flex items-center justify-center">
      <svg className="transform -rotate-90" width={size} height={size}>
        {segments.map((segment, index) => (
          <circle
            key={index}
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke={segment.color}
            strokeWidth="25"
            strokeDasharray={segment.strokeDasharray}
            strokeDashoffset={segment.offset}
            strokeLinecap="round"
            className="transition-all duration-300"
          />
        ))}
      </svg>
    </div>
  );
};

// Pie Chart Component - 3D style with labels outside each segment
const PieChart = ({ 
  items, 
  size = 180,
  isDark = false
}: { 
  items: SoftwareDashboardData["invoices"]; 
  size?: number;
  isDark?: boolean;
}) => {
  const padding = 50; // Extra space for labels outside
  const chartSize = size + padding * 2;
  const radius = size / 2;
  const centerX = chartSize / 2;
  const centerY = chartSize / 2;
  let currentAngle = -90; // Start from top

  const segments = items.map((item) => {
    const percentage = item.percentage / 100;
    const angle = percentage * 360;
    const startAngle = currentAngle;
    const endAngle = currentAngle + angle;
    currentAngle = endAngle;

    // Convert angles to radians
    const startAngleRad = (startAngle * Math.PI) / 180;
    const endAngleRad = (endAngle * Math.PI) / 180;

    // Calculate arc path
    const x1 = centerX + radius * Math.cos(startAngleRad);
    const y1 = centerY + radius * Math.sin(startAngleRad);
    const x2 = centerX + radius * Math.cos(endAngleRad);
    const y2 = centerY + radius * Math.sin(endAngleRad);

    const largeArcFlag = angle > 180 ? 1 : 0;

    const pathData = [
      `M ${centerX} ${centerY}`,
      `L ${x1} ${y1}`,
      `A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2}`,
      `Z`
    ].join(" ");

    // Calculate label position outside the pie chart
    const labelAngle = (startAngle + endAngle) / 2;
    const labelAngleRad = (labelAngle * Math.PI) / 180;
    // Position label outside the chart (beyond the radius)
    const labelRadius = radius + 37; // Position label 50px outside the radius
    const labelX = centerX + labelRadius * Math.cos(labelAngleRad);
    const labelY = centerY + labelRadius * Math.sin(labelAngleRad);

    // Calculate percentage position inside the segment
    const percentageRadius = radius * 0.6; // Position percentage at 60% of radius (inside the segment)
    const percentageX = centerX + percentageRadius * Math.cos(labelAngleRad);
    const percentageY = centerY + percentageRadius * Math.sin(labelAngleRad);

    // Determine text anchor based on angle (left side = end, right side = start, top/bottom = middle)
    let textAnchor: "start" | "middle" | "end" = "middle";
    if (labelAngle > 45 && labelAngle < 135) {
      textAnchor = "start"; // Right side
    } else if (labelAngle > 225 && labelAngle < 315) {
      textAnchor = "end"; // Left side
    } else {
      textAnchor = "middle"; // Top and bottom
    }

    // Get status label text (without percentage)
    const statusLabel = item.status === "Paid" ? "Paid bills" : 
                       item.status === "Unpaid" ? "unpaid bills" : 
                       "Overdue bills";

    return {
      ...item,
      pathData,
      labelX,
      labelY,
      percentageX,
      percentageY,
      textAnchor,
      statusLabel,
      percentage: item.percentage
    };
  });

  return (
    <div className="relative inline-flex items-center justify-center w-full">
      <svg width={chartSize} height={chartSize} viewBox={`0 0 ${chartSize} ${chartSize}`} className="mx-auto" style={{ overflow: "visible" }}>
        <defs>
          {/* Add subtle shadow/3D effect */}
          <filter id="pieShadow" x="-50%" y="-50%" width="200%" height="200%">
            <feDropShadow dx="2" dy="2" stdDeviation="3" floodOpacity="0.2"/>
          </filter>
        </defs>
        {segments.map((segment, index) => (
          <g key={index}>
            <path
              d={segment.pathData}
              fill={segment.color}
              filter="url(#pieShadow)"
              className="transition-all duration-300"
            />
            {/* Percentage label inside the segment */}
            <text
              x={segment.percentageX}
              y={segment.percentageY}
              textAnchor="middle"
              dominantBaseline="middle"
              className="font-light fill-white"
              style={{ 
                fontSize: "14px",
                fontWeight: "extralight"
              }}
            >
              {segment.percentage}%
            </text>
            {/* Status label outside the pie chart */}
            <text
              x={segment.labelX}
              y={segment.labelY}
              textAnchor={segment.textAnchor}
              dominantBaseline="middle"
              className="text-sm font-medium"
              style={{ 
                fontSize: "14px", 
                fill: isDark ? "var(--color-page-text)" : "#2B3674" 
              }}
            >
              {segment.statusLabel}
            </text>
          </g>
        ))}
      </svg>
    </div>
  );
};

export const SoftwareDashboardOverview = ({
  data,
  hero,
  tokens
}: SoftwareDashboardOverviewProps) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const isRTL = i18n.language === "ar";
  const cardClass = `rounded-[20px] px-6 py-4 transition-colors ${tokens.isDark ? tokens.cardBase : "bg-[#FCFDFF]"}`;

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

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Ongoing":
        return ActiveIcon;
      case "Pending":
        return PendingIcon;
      case "Not Started":
        return UnpaidIcon;
      default:
        return PendingIcon;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Ongoing":
        return "text-[#05CD99]";
      case "Pending":
        return "text-[#FFCE20]";
      case "Not Started":
        return "text-[#EE5D50]";
      default:
        return "text-[#A3AED0]";
    }
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Hero Section */}
      <section>
        <div
          className="relative overflow-hidden rounded-[54px] px-8 py-8 text-white transition-all duration-500"
        >
          {/* Hero Image */}
          {hero.backgroundImage && (
            <img
              src={hero.backgroundImage}
              alt="Hero background"
              className={`absolute inset-0 w-full object-cover transition-opacity duration-500 ${
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

      {/* Proposal Summary and Clients Section */}
      <section className="grid gap-6 lg:grid-cols-[1fr_1fr]">
        {/* Proposal Summary */}
        <div className={cardClass}>
          <div className="flex items-center justify-between gap-2 mb-4">
            <h3 className={`text-lg lg:text-xl font-bold ${tokens.isDark ? "text-[var(--color-page-text)]" : "text-[#2B3674]"}`}>
              Proposal Summary
            </h3>
            <div className="flex items-center gap-2 text-sm text-[var(--color-page-text)]/60">
              <CalendarIcon className="h-4 w-4" />
              <span>Jun 07 → Jun 13</span>
              <button type="button" className="ml-1">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
            </div>
          </div>
          <div className="flex items-center gap-6">
            <DonutChart items={data.proposals.items} />
            <div className="flex flex-col gap-4">
              <div className="">
                <p className={`text-lg font-medium ${tokens.isDark ? "text-white/70" : "text-[#2B3674]"}`}>Total Proposal : <span className={`text-2xl font-semibold ${tokens.isDark ? "text-white/70" : "text-[#2B3674]"}`}>{data.proposals.total}</span></p>
              </div>
              <div className="flex flex-col gap-3">
                {data.proposals.items.map((item, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <div
                      className="w-4 h-4 rounded-sm"
                      style={{ backgroundColor: item.color }}
                    ></div>
                    <span className={`text-sm font-medium ${tokens.isDark ? "text-white/70" : "text-[#2B3674]"}`}>
                      {item.status} Proposals ({item.percentage}%)
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Tasks Status */}
        <div className={cardClass}>
          <div className="mb-4">
            <h3 className={`text-lg lg:text-xl font-bold ${tokens.isDark ? "text-[var(--color-page-text)]" : "text-[#2B3674]"}`}>
              Tasks Status
            </h3>
          </div>
          <div className="flex flex-col gap-4">
            {/* Completed */}
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <span className={`text-sm md:text-base font-medium ${tokens.isDark ? "text-white" : "text-black"}`}>
                  Completed
                </span>
                <span className={`text-sm ${tokens.isDark ? "text-white/70" : "text-[#AAAAAA]"}`}>
                  32 Tasks
                </span>
              </div>
              <div className="relative h-5 bg-[#EFEFEF] rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-300"
                  style={{
                    width: "95%",
                    backgroundColor: "#34C759"
                  }}
                />
              </div>
            </div>

            {/* In Progress */}
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <span className={`text-sm md:text-base font-medium ${tokens.isDark ? "text-white" : "text-black"}`}>
                  In Progress
                </span>
                <span className={`text-sm ${tokens.isDark ? "text-white/70" : "text-[#AAAAAA]"}`}>
                  54 Tasks
                </span>
              </div>
              <div className="relative h-5 bg-[#EFEFEF] rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-300"
                  style={{
                    width: "67%",
                    backgroundColor: "#0015B4"
                  }}
                />
              </div>
            </div>

            {/* Waiting Feedback */}
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <span className={`text-sm md:text-base font-medium ${tokens.isDark ? "text-white" : "text-black"}`}>
                  Waiting Feedback
                </span>
                <span className={`text-sm ${tokens.isDark ? "text-white/70" : "text-[#AAAAAA]"}`}>
                  12 Tasks
                </span>
              </div>
              <div className="relative h-5 bg-[#EFEFEF] rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-300"
                  style={{
                    width: "33%",
                    backgroundColor: "#B48D00"
                  }}
                />
              </div>
            </div>

            {/* Canceled */}
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <span className={`text-sm md:text-base font-medium ${tokens.isDark ? "text-white" : "text-black"}`}>
                  Canceled
                </span>
                <span className={`text-sm ${tokens.isDark ? "text-white/70" : "text-[#AAAAAA]"}`}>
                  0
                </span>
              </div>
              <div className="relative h-5 bg-[#EFEFEF] rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-300"
                  style={{
                    width: "0%",
                    backgroundColor: "#9CA3AF"
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Invoice Status and Meetings Section */}
      <section className="grid gap-6 lg:grid-cols-[2fr_1fr]">
        {/* Meetings Just For You */}
        <div className={cardClass}>
          <div className="mb-2">
            <h3 className={`text-lg lg:text-xl font-bold ${tokens.isDark ? "text-[var(--color-page-text)]" : "text-[#2B3674]"}`}>
              Meetings Just For You
            </h3>
          </div>
          
          {/* Calendar Grid */}
          <div className="relative">
            {/* Days Header */}
            <div className="grid grid-cols-8 mb-2">
              <div></div> {/* Empty cell for time column */}
              {["Mon", "Tues", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day, idx) => (
                <div key={day} className="text-center">
                  <p className={`text-xs font-medium ${tokens.isDark ? "text-white/70" : "text-[#2B3674]"}`}>{day}</p>
                  <p className="text-xs text-[#A3AED0]">{String(idx + 1).padStart(2, "0")}</p>
                </div>
              ))}
            </div>

            {/* Calendar Grid with Time Slots */}
            <div className={`relative border-b overflow-hidden ${tokens.isDark ? "border-white/10" : "border-[#E6E9FB]"}`}>
              {/* Time Column and Grid */}
              <div className="grid grid-cols-8">
                {/* Time Labels */}
                <div className={`flex flex-col border-r ${tokens.isDark ? "border-white/5" : "border-[#E6E9FB]"}`}>
                  {["09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00"].map((time) => (
                    <div key={time} className="h-6 flex items-start justify-end pr-1.5 pt-0">
                      <span className="text-[10px] text-[#A3AED0]">{time}</span>
                    </div>
                  ))}
                </div>

                {/* Day Columns */}
                {[0, 1, 2, 3, 4, 5, 6].map((dayIndex) => (
                  <div key={dayIndex} className="flex flex-col">
                    {[0, 1, 2, 3, 4, 5, 6].map((timeIndex) => (
                      <div
                        key={timeIndex}
                        className={`h-6 border-b border-r last:border-b-0 border-dashed p-3 ${tokens.isDark ? "border-white/5" : "border-[#ECECEC]"}`}
                      ></div>
                    ))}
                  </div>
                ))}
              </div>

              {/* Event Cards positioned absolutely */}
              <div className="absolute inset-0 pointer-events-none">
                {data.events.map((event, eventIndex) => {
                  // Parse day and hour from event data
                  const dayMatch = event.day?.match(/(\w+)\s+(\d+)/);
                  const dayName = dayMatch?.[1] || "";
                  const hourMatch = event.hour?.match(/(\d+):/);
                  const hour = hourMatch ? parseInt(hourMatch[1]) : 10;
                  
                  // Map day names to column indices (Mon=0, Tues=1, etc.)
                  const dayMap: Record<string, number> = {
                    "Mon": 0, "Tues": 1, "Wed": 2, "Thu": 3, "Fri": 4, "Sat": 5, "Sun": 6
                  };
                  const colIndex = dayMap[dayName] ?? 1;
                  
                  // Calculate position (hour 9 = index 0, hour 10 = index 1, etc.)
                  const rowIndex = hour - 9;
                  
                  // Card background colors (yellow, gray, black)
                  const cardColors = [
                    tokens.isDark ? "bg-[#FFF9E6] text-black" : "bg-[#FFF9E6] text-[#2B3674]", // Light yellow
                    tokens.isDark ? "bg-[#F5F5F5] text-black" : "bg-[#F5F5F5] text-[#2B3674]", // Light gray
                    "bg-[#000000] text-white" // Black
                  ];
                  const cardColor = cardColors[eventIndex % cardColors.length];
                  // Icon color: black card always has yellow icons, light cards have black icons in dark mode
                  const iconColor = eventIndex === 2 ? "#FFCE20" : (tokens.isDark ? "#000000" : "#2B3674");
                  
                  // Calculate position
                  const left = `calc(${(colIndex + 1) * (100 / 8)}% + 4px)`;
                  // Vertical offsets: first card up, second down a bit, third down a bit more
                  const verticalOffsets = [-12, 8, 16]; // pixels
                  const offset = verticalOffsets[eventIndex] || 0;
                  const top = `${rowIndex * 24 + offset}px`; // 24px = h-6
                  
                  return (
                    <div
                      key={event.id}
                      className={`absolute rounded-md p-1.5 shadow-sm pointer-events-auto ${cardColor}`}
                      style={{
                        left,
                        top,
                        width: `calc(${(100 / 8) * 1.5}% - 8px)`,
                        maxWidth: "280px"
                      }}
                    >
                      <h4 className="font-semibold text-[10px] mb-1 leading-tight">{event.title}</h4>
                      <div className="space-y-0.5 text-[10px]">
                        <div className="flex items-center gap-1">
                          <CalendarIcon className="h-2.5 w-2.5" style={{ color: iconColor }} />
                          <span className="leading-tight">{event.date}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <svg className="h-2.5 w-2.5" viewBox="0 0 16 16" fill="none" style={{ color: iconColor }}>
                            <rect x="2" y="2" width="4" height="4" rx="1" fill="currentColor"/>
                            <rect x="10" y="2" width="4" height="4" rx="1" fill="currentColor"/>
                            <rect x="2" y="10" width="4" height="4" rx="1" fill="currentColor"/>
                            <rect x="10" y="10" width="4" height="4" rx="1" fill="currentColor"/>
                          </svg>
                          <span className="leading-tight">{event.location}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <ClockIcon className="h-2.5 w-2.5" style={{ color: iconColor }} />
                          <span className="leading-tight">{event.time}</span>
                        </div>
                      </div>
                      <div className="flex items-center mt-1">
                        {Array.from({ length: Math.min(4, event.attendees) }).map((_, i) => (
                          <div
                            key={i}
                            className="w-4 h-4 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 border border-white -ml-1.5 first:ml-0"
                          ></div>
                        ))}
                        {event.attendees > 4 && (
                          <div className="w-4 h-4 rounded-full bg-gray-300 border border-white -ml-1.5 flex items-center justify-center">
                            <PlusCircleIcon className="h-3 w-3" style={{ color: "#F4F4F4" }} />
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
        {/* Invoice Status */}
        <div className={cardClass}>
          <div className="flex items-center justify-between gap-2 mb-3">
            <h3 className={`text-lg lg:text-xl font-bold ${tokens.isDark ? "text-[var(--color-page-text)]" : "text-[#2B3674]"}`}>
              Invoice Status
            </h3>
          </div>
          <div className="flex items-center justify-center py-2">
            <PieChart items={data.invoices} isDark={tokens.isDark} />
          </div>
        </div>
      </section>

      {/* Projects Table */}
      <section>
        <div className={cardClass}>
          <div className="flex items-center justify-between gap-2 mb-4">
            <h3 className={`text-lg lg:text-xl font-bold ${tokens.isDark ? "text-[var(--color-page-text)]" : "text-[#2B3674]"}`}>
              Projects
            </h3>
            <button 
              type="button" 
              className="px-1 text-sm font-bold flex items-center gap-1 cursor-pointer"
              style={{ color: "#A3AED0" }}
            >
              See All <ArrowRight className={`h-4 w-4 ${isRTL ? "rotate-180" : ""}`} style={{ stroke: "#A3AED0" }} />
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className={`border-b ${tokens.divider}`}>
                  <th className="text-left py-3 px-4 text-sm text-[#B6B6B6] font-medium">NAME</th>
                  <th className="text-left py-3 px-4 text-sm text-[#B6B6B6] font-medium">DATE</th>
                  <th className="text-left py-3 px-4 text-sm text-[#B6B6B6] font-medium">STATUS</th>
                  <th className="text-left py-3 px-4 text-sm text-[#B6B6B6] font-medium">ACTIONS</th>
                </tr>
              </thead>
              <tbody>
                {data.projects.map((project) => {
                  const StatusIcon = getStatusIcon(project.status);
                  return (
                    <tr key={project.id} className={`${tokens.isDark ? "hover:bg-white/5" : "hover:bg-gray-50"}`}>
                      <td className={`py-3 px-4 text-sm md:text-base ${tokens.isDark ? "text-white" : "text-[#2B3674]"}`}>
                        {project.name}
                      </td>
                      <td className={`py-3 px-4 text-sm md:text-base ${tokens.isDark ? "text-white" : "text-[#2B3674]"}`}>
                        {project.date}
                      </td>
                      <td className="py-3 px-4">
                        <span className={`inline-flex items-center gap-1 text-sm font-medium ${getStatusColor(project.status)}`}>
                          <StatusIcon className="h-5 w-5" />
                          {project.status}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            className={`flex h-9 w-9 items-center justify-center rounded-full transition-colors ${tokens.isDark ? tokens.buttonGhost : ""}`}
                            style={tokens.isDark ? {} : { backgroundColor: "#E6E9FB" }}
                            aria-label={`Settings for ${project.name}`}
                          >
                            <SettingsIcon className={`h-4 w-4`} style={tokens.isDark ? {} : { color: "#071FD7" }} />
                          </button>
                          <button
                            type="button"
                            className="flex h-9 w-9 items-center justify-center rounded-full transition-colors"
                            style={{ backgroundColor: tokens.isDark ? "rgba(255, 77, 77, 0.1)" : "rgb(255, 229, 222)" }}
                            aria-label={`Delete ${project.name}`}
                          >
                            <CloseIcon className="h-4 w-4" style={{ color: "#FF0000" }} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </div>
  );
};

