import { useState, useMemo } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useAppSelector } from "@store/hooks";
import { selectTheme } from "@store/theme/theme-slice";
import { useGetApplicationsQuery } from "@/store/api/marketplace-api";

export const AppPreviewPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
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

  const [activeTabId, setActiveTabId] = useState(appId || apps[0]?.id.toString());

  const activeAppData = useMemo(() => {
    return apps.find((app) => app.id.toString() === activeTabId);
  }, [apps, activeTabId]);

  const handleTabChange = (app: typeof apps[0]) => {
    setActiveTabId(app.id.toString());
    setSearchParams({
      url: app.launchUrl,
      name: app.name,
      id: app.id.toString()
    });
  };

  if (!url) {
    return (
      <div className="flex h-screen items-center justify-center">
        <p className="text-lg text-gray-600">No URL provided</p>
      </div>
    );
  }

  return (
    <div className={`flex h-screen flex-col ${isDark ? "bg-[#0A0E13]" : "bg-white"}`}>
      {/* Header with Back Button, App Name, and Tabs */}
      <div className={`flex items-center gap-8 border-b px-6 py-3 ${isDark ? "border-white/10 bg-[#0F1217]" : "border-gray-200 bg-white"}`}>
        {/* Back Button and App Name */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className={`flex items-center justify-center rounded-lg p-2 transition-colors ${
              isDark ? "hover:bg-white/10" : "hover:bg-gray-100"
            }`}
            aria-label="Back"
          >
            <svg className={`h-5 w-5 ${isDark ? "text-white" : "text-gray-700"}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          <h1 className={`text-lg font-semibold whitespace-nowrap ${isDark ? "text-white" : "text-gray-900"}`}>
            {activeAppData?.name || appName}
          </h1>
        </div>

        {/* Tabs */}
        {apps.length > 0 && (
          <div className="flex flex-1 justify-end gap-2 overflow-x-auto">
            {apps.map((app) => {
              const isActive = app.id.toString() === activeTabId;
              return (
                <button
                  key={app.id}
                  type="button"
                  onClick={() => handleTabChange(app)}
                  className={`flex items-center gap-2 whitespace-nowrap rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                    isActive
                      ? isDark
                        ? "bg-[#0F6773] text-white"
                        : "bg-[#0F6773] text-white"
                      : isDark
                        ? "bg-white/5 text-white/60 hover:bg-white/10 hover:text-white/80"
                        : "bg-gray-100 text-gray-600 hover:bg-gray-200 hover:text-gray-900"
                  }`}
                >
                  {app.icon?.url && (
                    <img src={app.icon.url} alt={app.icon.alt || app.name} className="h-4 w-4" />
                  )}
                  <span>{app.name}</span>
                  {isActive && (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(-1);
                      }}
                      className={`ml-1 rounded-full p-0.5 transition-colors ${
                        isDark ? "hover:bg-white/20" : "hover:bg-black/10"
                      }`}
                      aria-label="Close"
                    >
                      <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  )}
                </button>
              );
            })}
          </div>
        )}
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
