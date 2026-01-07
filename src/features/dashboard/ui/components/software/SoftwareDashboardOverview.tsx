import { useEffect, useState, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { i18n } from "@shared/config/i18n";
import { ArrowRight, ActiveIcon, PendingIcon, UnpaidIcon, SettingsIcon, CloseIcon, AllProjectsIcon, CompletedIcon, ProjectPendingIcon, DashboardAllProjectsIcon } from "@utilities/icons";
import type { DashboardTokens, SoftwareDashboardData, DashboardHeroContent } from "../../types";
import { useGetClientDashboardQuery } from "@features/dashboard/api/dashboard-api";
import { MeetingsCalendarGrid } from "./MeetingsCalendarGrid";
import "@assets/images/software/Mobile.svg";

type SoftwareDashboardOverviewProps = {
  readonly data: SoftwareDashboardData;
  readonly hero: DashboardHeroContent;
  readonly tokens: DashboardTokens;
};

// Area Chart Component for Projects Overview
const ProjectsAreaChart = ({ 
  isDark = false,
  chartData = {},
  projectCount = 0
}: { 
  isDark?: boolean;
  chartData?: Record<string, number>;
  projectCount?: number;
}) => {
  const { t } = useTranslation("landing");
  const isRTL = i18n.language === "ar";
  // Generate unique IDs for gradients to avoid conflicts when multiple charts are rendered
  const gradientIds = useMemo(() => {
    const uniqueId = `chart-${Math.random().toString(36).substring(2, 11)}`;
    return {
      yellowGradient: `yellowGradient-${uniqueId}`,
      blueGradient: `blueGradient-${uniqueId}`
    };
  }, []);

  const width = 450;
  const height = 100;
  const padding = { top: 20, right: 0, bottom: 30, left: 0 };
  const chartWidth = width - padding.left - padding.right;
  const chartHeight = height - padding.top - padding.bottom;

  // Generate professional weekly data if no chart data provided
  const generateProfessionalWeeklyData = (): Record<string, number> => {
    const today = new Date();
    const weeklyData: Record<string, number> = {};
    
    // Generate realistic project activity pattern (higher mid-week, lower weekends)
    const basePattern = [42, 58, 65, 72, 68, 35, 28]; // Realistic weekly pattern
    const variation = () => Math.random() * 8 - 4; // Small random variation
    
    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dayIndex = date.getDay();
      const adjustedIndex = dayIndex === 0 ? 6 : dayIndex - 1; // Convert Sunday=0 to Sunday=6
      const value = Math.round(Math.max(15, basePattern[adjustedIndex] + variation()));
      const dateKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
      weeklyData[dateKey] = value;
    }
    
    return weeklyData;
  };

  // Use provided chart data or generate professional fallback
  let finalChartData = Object.keys(chartData).length > 0 ? chartData : generateProfessionalWeeklyData();
  
  // Check if data is in monthly format (YYYY-MM) or daily format (YYYY-MM-DD)
  const sampleKey = Object.keys(finalChartData)[0] || "";
  const isMonthlyFormat = sampleKey && sampleKey.split("-").length === 2; // YYYY-MM format
  
  // If monthly data, convert to daily data for the last 7 days
  if (isMonthlyFormat && Object.keys(finalChartData).length > 0) {
    // Distribute monthly data across the last 7 days
    const today = new Date();
    const monthlyEntries = Object.entries(finalChartData);
    const totalMonthlyValue = monthlyEntries.reduce((sum, [, value]) => sum + Number(value), 0);
    const avgDailyValue = Math.round(totalMonthlyValue / 7);
    
    finalChartData = {};
    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dateKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
      // Distribute monthly value evenly across days with some variation
      const variation = Math.random() * 0.3 + 0.85; // 85-115% variation
      finalChartData[dateKey] = Math.round(avgDailyValue * variation);
    }
  }
  
  // Ensure we have exactly 7 days of data
  const chartEntries = Object.entries(finalChartData).sort();
  
  // If we have fewer than 7 entries, fill with generated data
  let processedEntries = chartEntries;
  if (chartEntries.length < 7) {
    const today = new Date();
    const existingDates = new Set(chartEntries.map(([date]) => date));
    const allEntries = [...chartEntries];
    
    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dateKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
      
      if (!existingDates.has(dateKey)) {
        // Use average of existing values or default
        const avgValue = chartEntries.length > 0 
          ? Math.round(chartEntries.reduce((sum, [, val]) => sum + Number(val), 0) / chartEntries.length)
          : 50;
        allEntries.push([dateKey, avgValue]);
      }
    }
    
    processedEntries = allEntries.sort();
  }
  
  // Extract day labels from dates (format: YYYY-MM-DD -> day name)
  const days = processedEntries.length > 0 
    ? processedEntries.map(([date]) => {
        // Handle YYYY-MM-DD format
        const dateStr = date.includes("T") ? date.split("T")[0] : date;
        const dateParts = dateStr.split("-");
        
        if (dateParts.length === 3) {
          // Daily format: YYYY-MM-DD
          const year = parseInt(dateParts[0], 10);
          const month = parseInt(dateParts[1], 10) - 1; // Month is 0-indexed
          const day = parseInt(dateParts[2], 10);
          const dateObj = new Date(year, month, day);
          
          if (!isNaN(dateObj.getTime())) {
            const dayNames = [
            t("dashboard.days.sun"),
            t("dashboard.days.mon"),
            t("dashboard.days.tue"),
            t("dashboard.days.wed"),
            t("dashboard.days.thu"),
            t("dashboard.days.fri"),
            t("dashboard.days.sat")
          ];
            return dayNames[dateObj.getDay()];
          }
        }
        
        // Fallback
        return dateParts[dateParts.length - 1] || "";
      })
    : [
        t("landing.dashboard.days.mon"),
        t("landing.dashboard.days.tue"),
        t("landing.dashboard.days.wed"),
        t("landing.dashboard.days.thu"),
        t("landing.dashboard.days.fri"),
        t("landing.dashboard.days.sat"),
        t("landing.dashboard.days.sun")
      ];
  
  // Use actual data or fallback to professional sample data
  const yellowData = processedEntries.length > 0 
    ? processedEntries.map(([, value]) => {
        const numValue = Number(value);
        return isNaN(numValue) ? 0 : numValue;
      })
    : [42, 58, 65, 72, 68, 35, 28]; // Professional weekly pattern
  
  const blueData = yellowData.map(v => Math.max(Math.round(v * 0.75), 12)); // Derived from yellow data with better ratio

  // Normalize data to fit chart height
  const maxValue = Math.max(...yellowData, ...blueData, 1); // Ensure at least 1 to avoid division by zero
  const normalize = (value: number) => {
    if (maxValue === 0 || isNaN(value) || !isFinite(value)) return 0;
    return (value / maxValue) * chartHeight;
  };

  // Calculate x positions for chart data - handle edge case when days.length <= 1
  const xStep = days.length > 1 ? chartWidth / (days.length - 1) : chartWidth;
  const getX = (index: number) => {
    if (days.length <= 1) return padding.left + chartWidth / 2;
    return padding.left + index * xStep;
  };
  
  // Calculate x positions for labels (closer together)
  const labelSpacing = chartWidth * 0.8; // Use 80% of chart width for labels
  const labelStartX = padding.left + (chartWidth - labelSpacing) / 2; // Center the labels
  const labelStep = days.length > 1 ? labelSpacing / (days.length - 1) : labelSpacing;
  const getLabelX = (index: number) => {
    if (days.length <= 1) return padding.left + chartWidth / 2;
    return labelStartX + index * labelStep;
  };
  
  const cornerRadius = 4; // Radius for rounded corners

  // Helper function to create smooth line path (for stroke)
  const createSmoothLinePath = (data: number[]) => {
    if (data.length === 0) return "";
    
    const points = data.map((value, index) => {
      const x = getX(index);
      const y = padding.top + chartHeight - normalize(value);
      return {
        x: isNaN(x) || !isFinite(x) ? padding.left : x,
        y: isNaN(y) || !isFinite(y) ? padding.top + chartHeight : y
      };
    });

    if (points.length === 0) return "";
    
    let path = `M ${points[0].x} ${points[0].y}`;

    // Handle single point case
    if (points.length === 1) {
      return path;
    }

    // Create smooth curves between points using cubic bezier
    for (let i = 0; i < points.length - 1; i++) {
      const current = points[i];
      const next = points[i + 1];
      const controlPoint1X = current.x + (next.x - current.x) * 0.5;
      const controlPoint1Y = current.y;
      const controlPoint2X = current.x + (next.x - current.x) * 0.5;
      const controlPoint2Y = next.y;
      
      path += ` C ${controlPoint1X} ${controlPoint1Y}, ${controlPoint2X} ${controlPoint2Y}, ${next.x} ${next.y}`;
    }

    return path;
  };

  // Helper function to create smooth curve path with rounded corners (for filled area)
  const createSmoothAreaPath = (data: number[]) => {
    if (data.length === 0) return "";
    
    const linePath = createSmoothLinePath(data);
    if (!linePath) return "";
    
    const lastX = getX(days.length - 1);
    const firstX = getX(0);
    const bottomY = padding.top + chartHeight;
    
    const lastPoint = data.length > 0 ? {
      x: (() => {
        const x = getX(data.length - 1);
        return isNaN(x) || !isFinite(x) ? padding.left : x;
      })(),
      y: (() => {
        const y = padding.top + chartHeight - normalize(data[data.length - 1]);
        return isNaN(y) || !isFinite(y) ? padding.top + chartHeight : y;
      })()
    } : { x: padding.left, y: padding.top + chartHeight };
    
    const firstPoint = data.length > 0 ? {
      x: (() => {
        const x = getX(0);
        return isNaN(x) || !isFinite(x) ? padding.left : x;
      })(),
      y: (() => {
        const y = padding.top + chartHeight - normalize(data[0]);
        return isNaN(y) || !isFinite(y) ? padding.top + chartHeight : y;
      })()
    } : { x: padding.left, y: padding.top + chartHeight };

    // Close path with rounded corners at bottom
    let path = linePath;
    // Go to bottom right (before corner)
    path += ` L ${lastX} ${lastPoint.y}`;
    // Rounded bottom right corner
    path += ` Q ${lastX} ${bottomY}, ${lastX - cornerRadius} ${bottomY}`;
    // Bottom line
    path += ` L ${firstX + cornerRadius} ${bottomY}`;
    // Rounded bottom left corner
    path += ` Q ${firstX} ${bottomY}, ${firstX} ${firstPoint.y}`;
    path += ` Z`;

    return path;
  };

  // Create paths with smooth curves and rounded corners
  const yellowAreaPath = createSmoothAreaPath(yellowData);
  const blueAreaPath = createSmoothAreaPath(blueData);
  const yellowLinePath = createSmoothLinePath(yellowData);
  const blueLinePath = createSmoothLinePath(blueData);

  return (
    <div className={`${isDark ? "bg-black" : "bg-black"} rounded-[20px] pt-2 flex flex-col h-full`}>
      {/* Header */}
      <div className="flex items-center justify-between px-4">
        <div className="flex flex-col gap-1">
          <div>
            <DashboardAllProjectsIcon  />
          </div>
          <div className="flex flex-col">
            <h3 className={`text-lg font-semibold ${isDark ? "text-white" : "text-white"}`}>
              {t("dashboard.overview.allProjects")}
            </h3>
            <p className={`text-sm mb-2 ${isDark ? "text-white/70" : "text-white/70"}`}>
              {projectCount} {projectCount === 1 ? t("dashboard.overview.project") : t("dashboard.overview.projects")}
            </p>
          </div>
        </div>
        <ArrowRight className={`h-5 w-5 ${isDark ? "text-white/60" : "text-white/60"} ${isRTL ? "rotate-180" : ""}`} />
      </div>

      {/* Chart */}
      <div className="flex-1 flex items-end w-full bg-[#262628] rounded-b-3xl">
        <svg width="100%" height={height} viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="none" className="w-full h-full">
          <defs>
            {/* Gradient for yellow area */}
            <linearGradient id={gradientIds.yellowGradient} x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#E6C310" stopOpacity="1" />
              <stop offset="100%" stopColor="#1C2EBF" stopOpacity="1" />
            </linearGradient>
            {/* Gradient for blue area */}
            <linearGradient id={gradientIds.blueGradient} x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#1C2EBF" stopOpacity="0.6" />
              <stop offset="100%" stopColor="#1C2EBF" stopOpacity="0.2" />
            </linearGradient>
          </defs>
          
          {/* Blue area (bottom layer) */}
          <path
            d={blueAreaPath}
            fill={`url(#${gradientIds.blueGradient})`}
            className="transition-all duration-300"
          />
          
          {/* Yellow area (top layer) */}
          <path
            d={yellowAreaPath}
            fill={`url(#${gradientIds.yellowGradient})`}
            className="transition-all duration-300"
          />

          {/* Blue line on top of blue area */}
          <path
            d={blueLinePath}
            fill="none"
            stroke="#1C2EBF"
            strokeWidth="4"
            className="transition-all duration-300"
          />

          {/* Yellow line on top of yellow area */}
          <path
            d={yellowLinePath}
            fill="none"
            stroke="#E6C310"
            strokeWidth="4"
            className="transition-all duration-300"
          />

          {/* Day labels */}
          {days.map((day, index) => (
            <text
              key={index}
              x={getLabelX(index)}
              y={height - padding.bottom + 15}
              textAnchor="middle"
              className={`text-[10px] ${isDark ? "fill-white/90" : "fill-white/90"}`}
              style={{ fontSize: "10px" }}
            >
              {day}
            </text>
          ))}
        </svg>
      </div>
    </div>
  );
};

// Pie Chart Component - 3D style with labels outside each segment
const PieChart = ({ 
  invoiceStatus,
  isDark = false
}: { 
  invoiceStatus?: { paid: number; unpaid: number; overdue: number };
  isDark?: boolean;
}) => {
  const { t } = useTranslation("landing");
  // Generate unique ID for filter to avoid conflicts when multiple charts are rendered
  const filterId = useMemo(() => `pieShadow-${Math.random().toString(36).substring(2, 11)}`, []);

  const size = 180;
  const padding = 50;
  const chartSize = size + padding * 2;
  const radius = size / 2;
  const centerX = chartSize / 2;
  const centerY = chartSize / 2;

  // Use professional fallback data if all values are zero
  const hasData = invoiceStatus && (invoiceStatus.paid > 0 || invoiceStatus.unpaid > 0 || invoiceStatus.overdue > 0);
  const professionalFallback = {
    paid: 65,    // 65% paid - healthy business
    unpaid: 25,  // 25% unpaid - normal pending
    overdue: 10  // 10% overdue - manageable
  };
  
  const finalInvoiceStatus = hasData ? invoiceStatus : professionalFallback;

  // Convert invoice status to items
  const items = [
    { status: "Paid", value: finalInvoiceStatus?.paid || 0, color: "#A4AEB35E", percentage: 0 },
    { status: "Unpaid", value: finalInvoiceStatus?.unpaid || 0, color: "#091DE2", percentage: 0 },
    { status: "Overdue", value: finalInvoiceStatus?.overdue || 0, color: "#000000", percentage: 0 }
  ];

  // Calculate percentages
  const total = items.reduce((sum, item) => sum + item.value, 0) || 1;
  items.forEach(item => {
    item.percentage = Math.round((item.value / total) * 100);
  });

  let currentAngle = -90;

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
    const statusLabel = item.status === "Paid" ? t("dashboard.overview.paidBills") : 
                       item.status === "Unpaid" ? t("dashboard.overview.unpaidBills") : 
                       t("dashboard.overview.overdueBills");

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
          <filter id={filterId} x="-50%" y="-50%" width="200%" height="200%">
            <feDropShadow dx="2" dy="2" stdDeviation="3" floodOpacity="0.2"/>
          </filter>
        </defs>
        {segments.map((segment, index) => (
          <g key={index}>
            <path
              d={segment.pathData}
              fill={segment.color}
              filter={`url(#${filterId})`}
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
  const { t } = useTranslation("landing");
  const [imageLoaded, setImageLoaded] = useState(false);
  const { data: apiData } = useGetClientDashboardQuery();
  const isRTL = i18n.language === "ar";
  const cardClass = `rounded-[20px] px-6 py-4 transition-colors ${tokens.isDark ? tokens.cardBase : "bg-white"}`;

  // Use API data if available, otherwise fall back to props
  const dashboardData = apiData?.data;
  const projectsData = dashboardData?.projects || (data as any)?.projects || [];
  const tasksData = dashboardData?.tasks || { completed: 0, in_progress: 0, waiting_feedback: 0, canceled: 0 };
  const invoiceData = dashboardData?.invoice_status || { paid: 0, unpaid: 0, overdue: 0 };
  const chartData = dashboardData?.projects_summary?.chart || {};
  const meetingsData = dashboardData?.meetings || [];
  const projectCount = dashboardData?.projects_summary?.count ?? projectsData.length;

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
    <div className="flex flex-col gap-6 px-1 sm:px-0">
      {/* Hero Section */}
      <section>
        <div
          className="relative max-w-full overflow-hidden rounded-[20px] px-6 py-6 md:px-8 md:py-8 text-white transition-all duration-500 min-h-[180px] md:min-h-[220px] flex items-center"
        >
          {/* Hero Image */}
          {hero.backgroundImage && (
            <img
              src={hero.backgroundImage}
              alt="Hero background"
              className={`absolute inset-0 rounded-[20px] w-full h-full object-cover transition-opacity duration-500 ${
                imageLoaded ? "opacity-100" : "opacity-0"
              }`}
              loading="eager"
              onLoad={() => setImageLoaded(true)}
            />
          )}

          <div className="relative z-10 flex flex-col w-full">
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold leading-tight transition-opacity duration-500 max-w-2xl">
              {t("dashboard.overview.letsGetStarted")}
            </h1>
            <button
              type="button"
              className="inline-flex items-center gap-1 w-fit rounded-full border border-white bg-transparent px-4 md:px-6 py-2 md:py-2.5 text-xs sm:text-sm text-white transition hover:opacity-90 whitespace-nowrap mt-4 sm:mt-6"
            >
              <span>{hero.ctaLabel}</span>
              <ArrowRight className={`h-4 w-4 flex-shrink-0 [&_path]:stroke-white ${isRTL ? "rotate-180" : ""}`} />
            </button>
          </div>
        </div>
      </section>

      {/* Statistics Cards and Tasks Status Section */}
      <section className="grid gap-6 lg:grid-cols-[1.5fr_1fr]">
        {/* Statistics Cards - 2x2 Grid Layout with Charts */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* First Card - Dynamic Area Chart (Top Left) */}
          <div className={`${tokens.cardBase} rounded-[20px] px-4 pt-4 pb-12  md:p-4 md:pt-6 md:pb-12  h-full min-h-[160px]`}>
            <div className="mb-3">
              <h3 className={`text-sm sm:text-base font-semibold ${tokens.isDark ? 'text-white' : 'text-[#2B3674]'}`}>{t("dashboard.overview.projects")}</h3>
            </div>
            <ProjectsAreaChart isDark={tokens.isDark} chartData={chartData} projectCount={projectCount} />
          </div>
          
          {/* Completed Card (Top Right) */}
          <div className={`${tokens.cardBase} rounded-[20px] p-4 sm:p-6`}>
            <div className="flex items-start flex-col gap-3 sm:gap-4">
              <div
                className="flex items-center justify-center"
                style={{ color: tokens.isDark ? "#FFFFFF" : "#2B3674" }}
              >
                <CompletedIcon className="h-6 w-6 sm:h-8 sm:w-8 md:h-10 md:w-10" />
              </div>
              <div className="flex flex-col">
                <span className={`text-sm sm:text-base md:text-lg font-semibold ${tokens.isDark ? 'text-white' : 'text-[#2B3674]'}`}>{t("dashboard.overview.completed")}</span>
                <span className={`text-xs sm:text-sm md:text-base font-medium mt-1 ${tokens.isDark ? 'text-white' : 'text-[#A3AED0]'}`}>{tasksData.completed} {t("dashboard.overview.tasks")}</span>
              </div>
            </div>
          </div>

          {/* Ongoing Card (Bottom Left) */}
          <div className={`${tokens.cardBase} rounded-[20px] p-4 sm:p-6`}>
            <div className="flex items-start flex-col gap-3 sm:gap-4">
              <div
                className="flex items-center justify-center"
                style={{ color: tokens.isDark ? "#FFFFFF" : "#2B3674" }}
              >
                <AllProjectsIcon className="h-6 w-6 sm:h-8 sm:w-8 md:h-10 md:w-10" />
              </div>
              <div className="flex flex-col">
                <span className={`text-sm sm:text-base md:text-lg font-semibold ${tokens.isDark ? 'text-white' : 'text-[#2B3674]'}`}>{t("dashboard.overview.ongoing")}</span>
                <span className={`text-xs sm:text-sm md:text-base font-medium mt-1 ${tokens.isDark ? 'text-white' : 'text-[#A3AED0]'}`}>{tasksData.in_progress} {t("dashboard.overview.tasks")}</span>
              </div>
            </div>
          </div>

          {/* Pending Card (Bottom Right) */}
          <div className={`${tokens.cardBase} rounded-[20px] p-4 sm:p-6`}>
            <div className="flex items-start flex-col gap-3 sm:gap-4">
              <div
                className="flex items-center justify-center"
                style={{ color: tokens.isDark ? "#FFFFFF" : "#2B3674" }}
              >
                <ProjectPendingIcon className="h-6 w-6 sm:h-8 sm:w-8 md:h-10 md:w-10" />
              </div>
              <div className="flex flex-col">
                <span className={`text-sm sm:text-base md:text-lg font-semibold ${tokens.isDark ? 'text-white' : 'text-[#2B3674]'}`}>{t("dashboard.overview.pending")}</span>
                <span className={`text-xs sm:text-sm md:text-base font-medium mt-1 ${tokens.isDark ? 'text-white' : 'text-[#A3AED0]'}`}>{tasksData.waiting_feedback} {t("dashboard.overview.tasks")}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Tasks Status */}
        <div className={cardClass}>
          <div className="mb-4">
            <h3 className={`text-lg lg:text-xl font-bold ${tokens.isDark ? "text-[var(--color-page-text)]" : "text-[#2B3674]"}`}>
              {t("dashboard.overview.tasksStatus")}
            </h3>
          </div>
          <div className="flex flex-col gap-4">
            {/* Completed */}
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <span className={`text-sm md:text-base font-medium ${tokens.isDark ? "text-white" : "text-black"}`}>
                  {t("dashboard.overview.completed")}
                </span>
                <span className={`text-sm ${tokens.isDark ? "text-white/70" : "text-[#AAAAAA]"}`}>
                  {tasksData.completed} {t("dashboard.overview.tasks")}
                </span>
              </div>
              <div className="relative h-5 bg-[#EFEFEF] rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-300"
                  style={{
                    width: `${Math.min(tasksData.completed * 5, 100)}%`,
                    backgroundColor: "#34C759"
                  }}
                />
              </div>
            </div>

            {/* In Progress */}
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <span className={`text-sm md:text-base font-medium ${tokens.isDark ? "text-white" : "text-black"}`}>
                  {t("dashboard.overview.inProgress")}
                </span>
                <span className={`text-sm ${tokens.isDark ? "text-white/70" : "text-[#AAAAAA]"}`}>
                  {tasksData.in_progress} {t("dashboard.overview.tasks")}
                </span>
              </div>
              <div className="relative h-5 bg-[#EFEFEF] rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-300"
                  style={{
                    width: `${Math.min(tasksData.in_progress * 5, 100)}%`,
                    backgroundColor: "#0015B4"
                  }}
                />
              </div>
            </div>

            {/* Waiting Feedback */}
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <span className={`text-sm md:text-base font-medium ${tokens.isDark ? "text-white" : "text-black"}`}>
                  {t("dashboard.overview.waitingFeedback")}
                </span>
                <span className={`text-sm ${tokens.isDark ? "text-white/70" : "text-[#AAAAAA]"}`}>
                  {tasksData.waiting_feedback} {t("dashboard.overview.tasks")}
                </span>
              </div>
              <div className="relative h-5 bg-[#EFEFEF] rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-300"
                  style={{
                    width: `${Math.min(tasksData.waiting_feedback * 5, 100)}%`,
                    backgroundColor: "#B48D00"
                  }}
                />
              </div>
            </div>

            {/* Canceled */}
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <span className={`text-sm md:text-base font-medium ${tokens.isDark ? "text-white" : "text-black"}`}>
                  {t("dashboard.overview.canceled")}
                </span>
                <span className={`text-sm ${tokens.isDark ? "text-white/70" : "text-[#AAAAAA]"}`}>
                  {tasksData.canceled}
                </span>
              </div>
              <div className="relative h-5 bg-[#EFEFEF] rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-300"
                  style={{
                    width: `${Math.min(tasksData.canceled * 5, 100)}%`,
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
        <div className={`${cardClass} flex flex-col `}>
          <div className="mb-4">
            <h3 className={`text-lg lg:text-xl font-bold ${tokens.isDark ? "text-[var(--color-page-text)]" : "text-[#2B3674]"}`}>
              {t("dashboard.overview.meetings")}
            </h3>
          </div>
          
          {meetingsData.length > 0 ? (
            <div className="flex-1 overflow-hidden">
              <MeetingsCalendarGrid meetings={meetingsData} tokens={tokens} />
            </div>
          ) : (
            <div className="flex items-center justify-center py-8 flex-1">
              <p className={`text-sm ${tokens.isDark ? "text-white/50" : "text-[#A3AED0]"}`}>
                {t("dashboard.overview.noMeetingsScheduled")}
              </p>
            </div>
          )}
        </div>
        {/* Invoice Status */}
        <div className={cardClass}>
          <div className="flex items-center justify-between gap-2 mb-3">
            <h3 className={`text-lg lg:text-xl font-bold ${tokens.isDark ? "text-[var(--color-page-text)]" : "text-[#2B3674]"}`}>
              {t("dashboard.overview.invoiceStatus")}
            </h3>
          </div>
          <div className="flex items-center justify-center py-2">
            <PieChart invoiceStatus={invoiceData} isDark={tokens.isDark} />
          </div>
        </div>
      </section>

      {/* Projects Table */}
      <section>
        <div className={cardClass}>
          <div className="flex items-center justify-between gap-2 mb-4">
            <h3 className={`text-lg lg:text-xl font-bold ${tokens.isDark ? "text-[var(--color-page-text)]" : "text-[#2B3674]"}`}>
              {t("dashboard.overview.projects")}
            </h3>
            <button 
              type="button" 
              className="px-1 text-sm font-bold flex items-center gap-1 cursor-pointer"
              style={{ color: "#A3AED0" }}
            >
              {t("dashboard.overview.seeAll")} <ArrowRight className={`h-4 w-4 ${isRTL ? "rotate-180" : ""}`} style={{ stroke: "#A3AED0" }} />
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className={`border-b ${tokens.divider}`}>
                  <th className=" py-3 px-4 text-sm text-[#B6B6B6] font-medium text-start">{t("dashboard.table.name")}</th>
                  <th className=" py-3 px-4 text-sm text-[#B6B6B6] font-medium text-start">{t("dashboard.table.date")}</th>
                  <th className=" py-3 px-4 text-sm text-[#B6B6B6] font-medium text-start">{t("dashboard.table.status")}</th>
                  <th className=" py-3 px-4 text-sm text-[#B6B6B6] font-medium text-start">{t("dashboard.table.actions")}</th>
                </tr>
              </thead>
              <tbody>
                {projectsData.map((project: any) => {
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

