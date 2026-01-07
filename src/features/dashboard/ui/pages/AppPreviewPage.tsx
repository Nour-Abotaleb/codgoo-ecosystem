import { useState, useMemo } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useAppSelector } from "@store/hooks";
import { selectTheme } from "@store/theme/theme-slice";
import { useGetApplicationsQuery } from "@/store/api/marketplace-api";
import logoApp from "/logo-app.svg";
import logoAppWhite from "@assets/logos/logo-app-white.svg";

export const AppPreviewPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const url = searchParams.get("url");
  const appName = searchParams.get("name");
  const appId = searchParams.get("id");
  const theme = useAppSelector(selectTheme);
  const isDark = theme === "dark";

  const { data: applicationsData } = useGetApplicationsQuery();

  const apps = useMemo(() => {
    if (!applicationsData?.data) return [];
    return applicationsData.data;
  }, [applicationsData]);

  const [activeTabId] = useState(appId || apps[0]?.id.toString());

  const activeAppData = useMemo(() => {
    return apps.find((app) => app.id.toString() === activeTabId);
  }, [apps, activeTabId]);

  if (!url) {
    return (
      <div className="flex h-screen items-center justify-center">
        <p className="text-lg text-gray-600">No URL provided</p>
      </div>
    );
  }

  return (
    <div className={`flex h-screen flex-col ${isDark ? "bg-[#0A0E13]" : "bg-white"}`}>
      {/* Header with Return to Dashboard and App Name */}
      <div className={`flex flex-wrap items-center justify-between border-b px-6 py-3 ${isDark ? "border-white/10 bg-[#0F1217]" : "border-gray-200 bg-white"}`}>
        {/* Return to Dashboard Logo */}
        <button
          type="button"
          onClick={() => navigate("/dashboard")}
          className="group relative flex gap-4 items-center justify-center rounded-lg p-2 transition-all hover:scale-105"
          aria-label="Return to Dashboard"
        >
          <button type="button" className="group flex items-center  rounded-[20px] p-2.5 text-sm font-medium transition-all hover:scale-105 cursor-pointer bg-[#0F1217] text-white/80 hover:bg-[#1A2028] hover:text-white " aria-label="Back"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 transition-transform group-hover:-translate-x-1"><path d="M15 18L9 12L15 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path></svg></button>
          <img 
            src={logoAppWhite} 
            alt="Dashboard" 
            className="h-8 w-auto transition-opacity duration-300 group-hover:opacity-0" 
          />
          {/* Colored logo - hidden by default, visible on hover */}
          <img 
            src={logoApp} 
            alt="Dashboard" 
            className="absolute h-8 w-auto opacity-0 transition-opacity duration-300 group-hover:opacity-100" 
          />
        </button>

        {/* App Name */}
        <h1 className={`text-lg font-semibold whitespace-nowrap ${isDark ? "text-white" : "text-gray-900"}`}>
          {activeAppData?.name || appName}
        </h1>
      </div>

      {/* Iframe */}
      <div className="flex-1 overflow-hidden">
        <iframe
          key={activeTabId}
          src={activeAppData?.launchUrl || url}
          title={activeAppData?.name || appName || "App Preview"}
          className="h-full w-full border-0"
          sandbox="allow-same-origin allow-scripts allow-forms allow-popups allow-popups-to-escape-sandbox"
        />
      </div>
    </div>
  );
};
