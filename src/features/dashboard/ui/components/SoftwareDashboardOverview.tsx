// useId removed as LineChart is commented out
import { ArrowRight, ActiveIcon, PendingIcon, UnpaidIcon, EditIcon, DeleteIcon, FileCodeIcon } from "@utilities/icons";
import type { DashboardTokens, SoftwareDashboardData, DashboardHeroContent } from "../types";

type SoftwareDashboardOverviewProps = {
  readonly data: SoftwareDashboardData;
  readonly hero: DashboardHeroContent;
  readonly tokens: DashboardTokens;
};

// Donut Chart Component
// DonutChart component commented out - currently unused
// const DonutChart = ({ 
//   items, 
//   total, 
//   size = 120 
// }: { 
//   items: SoftwareDashboardData["proposals"]["items"]; 
//   total: string;
//   size?: number;
// }) => {
//   const radius = (size - 20) / 2;
//   const circumference = 2 * Math.PI * radius;
//   let currentOffset = 0;

//   const segments = items.map((item) => {
//     const percentage = item.percentage / 100;
//     const segmentLength = percentage * circumference;
//     const offset = circumference - segmentLength - currentOffset;
//     currentOffset += segmentLength;

//     return {
//       ...item,
//       offset,
//       segmentLength,
//       strokeDasharray: `${segmentLength} ${circumference}`
//     };
//   });

//   return (
//     <div className="flex items-center gap-6">
//       <div className="relative inline-flex items-center justify-center">
//         <svg className="transform -rotate-90" width={size} height={size}>
//           {segments.map((segment, index) => (
//             <circle
//               key={index}
//               cx={size / 2}
//               cy={size / 2}
//               r={radius}
//               fill="none"
//               stroke={segment.color}
//               strokeWidth="20"
//               strokeDasharray={segment.strokeDasharray}
//               strokeDashoffset={segment.offset}
//               strokeLinecap="round"
//               className="transition-all duration-300"
//             />
//           ))}
//         </svg>
//       </div>
//       <div>
//         <p className="text-2xl font-bold text-[#2B3674]">Total Proposal: {total}</p>
//       </div>
//     </div>
//   );
// };

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

// Line Chart Component - Enhanced with gradient fill and highlight
// LineChart component commented out - currently unused
// const LineChart = ({ 
//   data 
// }: { 
//   data: SoftwareDashboardData["clients"]; 
// }) => {
//   const gradientId = useId();
//   const maxValue = Math.max(...data.map(d => d.value));
//   const minValue = Math.min(...data.map(d => d.value));
//   const range = maxValue - minValue || 1; // Prevent division by zero
//   const width = 100;
//   const height = 80;
//   const padding = 8;
//   const chartHeight = height - 20; // Reserve space for labels

//   const points = data.map((point, index) => {
//     const x = padding + (index / (data.length - 1 || 1)) * (width - 2 * padding);
//     const y = chartHeight - padding - ((point.value - minValue) / range) * (chartHeight - 2 * padding);
//     return { x, y, ...point };
//   });

//   // Create smooth path with curves
//   const pathData = points
//     .map((point, index) => {
//       if (index === 0) return `M ${point.x} ${point.y}`;
//       const prevPoint = points[index - 1];
//       const cp1x = prevPoint.x + (point.x - prevPoint.x) / 2;
//       const cp1y = prevPoint.y;
//       const cp2x = prevPoint.x + (point.x - prevPoint.x) / 2;
//       const cp2y = point.y;
//       return `C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${point.x} ${point.y}`;
//     })
//     .join(" ");

//   // Create area path for gradient fill
//   const areaPath = `${pathData} L ${points[points.length - 1].x} ${chartHeight - padding} L ${points[0].x} ${chartHeight - padding} Z`;

//   // Find highlighted point
//   const highlightedPoint = points.find(p => p.highlight);

//   return (
//     <div className="relative">
//       <svg width="100%" height={height} viewBox={`0 0 ${width} ${height}`} className="overflow-visible">
//         <defs>
//           <linearGradient id={gradientId} x1="0%" y1="0%" x2="0%" y2="100%">
//             <stop offset="0%" stopColor="#071FD7" stopOpacity="0.3" />
//             <stop offset="100%" stopColor="#071FD7" stopOpacity="0.05" />
//           </linearGradient>
//         </defs>
        
//         {/* Gradient fill area */}
//         <path
//           d={areaPath}
//           fill={`url(#${gradientId})`}
//         />
        
//         {/* Main line */}
//         <path
//           d={pathData}
//           fill="none"
//           stroke="#071FD7"
//           strokeWidth="3"
//           strokeLinecap="round"
//           strokeLinejoin="round"
//         />
        
//         {/* Highlighted point with purple line and label */}
//         {highlightedPoint && (
//           <g>
//             {/* Purple vertical line */}
//             <line
//               x1={highlightedPoint.x}
//               y1={highlightedPoint.y}
//               x2={highlightedPoint.x}
//               y2={highlightedPoint.y - 25}
//               stroke="#9333EA"
//               strokeWidth="2"
//             />
//             {/* White circle with blue outline on line */}
//             <circle
//               cx={highlightedPoint.x}
//               cy={highlightedPoint.y}
//               r="5"
//               fill="white"
//               stroke="#071FD7"
//               strokeWidth="2"
//             />
//             {/* White circular label */}
//             <circle
//               cx={highlightedPoint.x}
//               cy={highlightedPoint.y - 25}
//               r="12"
//               fill="white"
//               stroke="#9333EA"
//               strokeWidth="1"
//             />
//             <text
//               x={highlightedPoint.x}
//               y={highlightedPoint.y - 25}
//               textAnchor="middle"
//               dominantBaseline="middle"
//               className="text-xs font-semibold"
//               style={{ fill: "#9333EA" }}
//             >
//               {highlightedPoint.highlightLabel || `Client +${highlightedPoint.value}`}
//             </text>
//           </g>
//         )}
//       </svg>
//       <div className="flex justify-between mt-2 text-xs text-[#A3AED0] px-1">
//         {data.map((point, index) => (
//           <span key={index}>{point.month}</span>
//         ))}
//       </div>
//     </div>
//   );
// };

export const SoftwareDashboardOverview = ({
  data,
  hero,
  tokens
}: SoftwareDashboardOverviewProps) => {
  const cardClass = `rounded-[20px] border border-[var(--color-card-border)] px-6 py-4 transition-colors ${tokens.isDark ? tokens.cardBase : "bg-[#FCFDFF]"}`;

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
              className="absolute inset-0 w-full h-full object-cover"
            />
          )}
          {/* Gradient Overlay */}
          <div
            className="absolute inset-0 z-[1]"
            style={{ background: hero.gradient }}
          />
          <div className="relative z-10 flex flex-col">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold leading-tight transition-opacity duration-500 max-w-2xl">
              Let's<br />Get Started
            </h1>
            <button
              type="button"
              className="inline-flex items-center gap-1 w-fit rounded-full border border-white bg-transparent px-5 md:px-6 py-2.5 text-sm text-white transition hover:opacity-90 whitespace-nowrap mt-6"
            >
              <span>{hero.ctaLabel}</span>
              <ArrowRight className="h-4 w-4 flex-shrink-0 [&_path]:stroke-white" />
            </button>
          </div>
        </div>
      </section>

      {/* Proposal Summary and Events Section */}
      <section className="grid gap-6 lg:grid-cols-2 min-h-[350px]">
        {/* Proposal Summary */}
        <div className={cardClass}>
          {/* <div className="flex items-center justify-between gap-2 mb-4">
            <h3 className={`text-lg lg:text-xl font-bold ${tokens.isDark ? "text-[var(--color-page-text)]" : "text-[#2B3674]"}`}>
              Proposal Summary
            </h3>
            <div className="flex items-center gap-2 text-sm text-[var(--color-page-text)]/60">
              <CalendarIcon className="h-4 w-4" />
              <span>{dateRange}</span>
              <button type="button" className="ml-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
            </div>
          </div>
          <div className="flex flex-col md:flex-row items-center gap-6">
            <DonutChart items={data.proposals.items} total={data.proposals.total} />
            <div className="flex flex-col gap-3">
              {data.proposals.items.map((item, index) => (
                <div key={index} className="flex items-center gap-3">
                  <div
                    className="w-4 h-4 rounded-full"
                    style={{ backgroundColor: item.color }}
                  ></div>
                  <span className={`text-sm font-medium ${tokens.isDark ? "text-white" : "text-[#2B3674]"}`}>
                    {item.status} Proposals ({item.percentage}%)
                  </span>
                </div>
              ))}
            </div>
          </div> */}
        </div>

        {/* Events Just For You */}
        <div className={cardClass}>
          {/* <div className="flex items-center justify-between gap-2 mb-4">
            <h3 className={`text-lg lg:text-xl font-bold ${tokens.isDark ? "text-[var(--color-page-text)]" : "text-[#2B3674]"}`}>
              Events Just For You
            </h3>
          </div>
          <div className="grid grid-cols-7 gap-2 mb-4">
            {calendarDays.map((day) => (
              <div key={day} className="text-center">
                <p className="text-xs text-[#A3AED0]">{day}</p>
              </div>
            ))}
          </div>
          <div className="space-y-3">
            {data.events.map((event) => (
              <div
                key={event.id}
                className={`rounded-[12px] p-4 ${tokens.isDark ? "bg-[var(--color-table-row-bg)]" : "bg-[#FCFDFF]"}`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-[var(--color-page-text)] mb-1">
                      {event.title}
                    </p>
                    <p className="text-xs text-[#A3AED0]">{event.date}</p>
                    <div className="flex items-center gap-4 mt-2 text-xs text-[#A3AED0]">
                      <span>{event.location}</span>
                      <span>{event.time}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    {Array.from({ length: event.attendees }).map((_, i) => (
                      <div
                        key={i}
                        className="w-6 h-6 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 border-2 border-white -ml-2 first:ml-0"
                      ></div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div> */}
        </div>
      </section>

      {/* Invoice Status and Clients Section */}
      <section className="grid gap-6 lg:grid-cols-[1fr_2.5fr]">
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

        {/* Clients */}
        <div className={cardClass}>
          {/* <div className="flex items-center justify-between gap-2 mb-4">
            <h3 className={`text-lg lg:text-xl font-bold ${tokens.isDark ? "text-[var(--color-page-text)]" : "text-[#2B3674]"}`}>
              Clients
            </h3>
            <button 
              type="button" 
              className="px-1 text-sm font-bold flex items-center gap-1 cursor-pointer"
              style={{ color: "#A3AED0" }}
            >
              See All <ArrowRight className="h-4 w-4" style={{ stroke: "#A3AED0" }} />
            </button>
          </div>
          <LineChart data={data.clients} /> */}
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
              See All <ArrowRight className="h-4 w-4" style={{ stroke: "#A3AED0" }} />
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full table-auto border-separate border-spacing-y-3 text-sm">
              <thead className={tokens.isDark ? "" : "bg-[#E6E9FB]"}>
                <tr className="text-left uppercase text-sm [&>th]:border-b [&>th]:border-[var(--color-border-divider)]">
                  <th className={`px-4 py-4 ${tokens.isDark ? "text-white/70" : "text-[var(--color-page-text)]/65"}`}>NAME</th>
                  <th className={`px-4 py-4 ${tokens.isDark ? "text-white/70" : "text-[var(--color-page-text)]/65"}`}>DATE</th>
                  <th className={`px-4 py-4 ${tokens.isDark ? "text-white/70" : "text-[var(--color-page-text)]/65"}`}>STATUS</th>
                  <th className={`px-4 py-4 text-right ${tokens.isDark ? "text-white/70" : "text-[var(--color-page-text)]/65"}`}>ACTIONS</th>
                </tr>
              </thead>
              <tbody>
                {data.projects.map((project) => {
                  const StatusIcon = getStatusIcon(project.status);
                  return (
                    <tr key={project.id} className={tokens.isDark ? "bg-[var(--color-table-row-bg)]" : "bg-[#FCFDFF]"}>
                      <td className="rounded-l-2xl px-4 py-3 font-medium text-[var(--color-card-text)]">
                        {project.name}
                      </td>
                      <td className="px-4 py-3 text-[var(--color-card-text)]">
                        {project.date}
                      </td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex items-center gap-1 text-sm font-medium ${getStatusColor(project.status)}`}>
                          <StatusIcon className="h-5 w-5" />
                          {project.status}
                        </span>
                      </td>
                      <td className="rounded-r-2xl px-4 py-3">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            type="button"
                            className={`flex h-9 w-9 items-center justify-center rounded-full ${tokens.isDark ? tokens.buttonGhost : ""}`}
                            style={tokens.isDark ? {} : { backgroundColor: "#E6E9FB" }}
                            aria-label={`Edit ${project.name}`}
                          >
                            <EditIcon className={`h-4 w-4 ${tokens.isDark ? "" : ""}`} style={tokens.isDark ? {} : { color: "#071FD7" }} />
                          </button>
                          <button
                            type="button"
                            className={`flex h-9 w-9 items-center justify-center rounded-full ${tokens.isDark ? tokens.buttonGhost : ""}`}
                            style={tokens.isDark ? {} : { backgroundColor: "#E6E9FB" }}
                            aria-label={`View ${project.name}`}
                          >
                            <div 
                              className="h-4 w-4"
                              style={tokens.isDark ? {} : { color: "#071FD7" }}
                            >
                              <FileCodeIcon className="h-4 w-4" />
                            </div>
                          </button>
                          <button
                            type="button"
                            className={`flex h-9 w-9 items-center justify-center rounded-full ${tokens.isDark ? tokens.buttonGhost : ""}`}
                            style={tokens.isDark ? {} : { backgroundColor: "#E6E9FB" }}
                            aria-label={`Delete ${project.name}`}
                          >
                            <div 
                              className="h-4 w-4"
                              style={tokens.isDark ? {} : { color: "#071FD7" }}
                            >
                              <DeleteIcon 
                                className="h-4 w-4 [&_path]:fill-current"
                              />
                            </div>
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

