import { useEffect, useMemo, useState } from "react";

import { useAppDispatch, useAppSelector } from "@store/hooks";
import { selectTheme, setTheme, toggleTheme } from "@store/theme/theme-slice";

import {
  dashboardApps,
  dashboardContent,
  statusColors
} from "./constants";
import { DashboardHeader } from "./components/DashboardHeader";
import { DashboardHero } from "./components/DashboardHero";
import { ManagedSitesGrid } from "./components/ManagedSitesGrid";
import { DashboardSidebar } from "./components/DashboardSidebar";
import { DashboardStatsGrid } from "./components/DashboardStatsGrid";
import { DomainsPanel } from "./components/DomainsPanel";
import { ProductsTable } from "./components/ProductsTable";
import { RecentNewsPanel } from "./components/RecentNewsPanel";
import { SupportTicketsPanel } from "./components/SupportTicketsPanel";
import { UtilityPanels } from "./components/UtilityPanels";
import type { DashboardAppId, DashboardTokens } from "./types";

export const DashboardPage = () => {
  const dispatch = useAppDispatch();
  const theme = useAppSelector(selectTheme);
  const isDark = theme === "dark";
  const [activeAppId, setActiveAppId] = useState<DashboardAppId>(dashboardApps[0].id);

  const activeApp = useMemo(
    () => dashboardApps.find((app) => app.id === activeAppId) ?? dashboardApps[0],
    [activeAppId]
  );
  const dataset = dashboardContent[activeApp.id];
  const hasPlaceholder = Boolean(dataset.placeholder);
  const headerSubtitle = hasPlaceholder
    ? "Preview mode — dashboard content loading soon."
    : dataset.hero.eyebrow;
  useEffect(() => {
    dispatch(setTheme(activeApp.theme));
  }, [dispatch, activeApp.theme]);

  const handleToggleTheme = () => {
    dispatch(toggleTheme());
  };

  const tokens: DashboardTokens = {
    isDark,
    rootClass: isDark ? "bg-[#080817] text-white" : "bg-[#f6f2ff] text-[#0f1035]",
    sidebarClass: isDark
      ? "bg-[#0D0D15] border-white/10 text-white"
      : "bg-white/90 border-[#e3e2ff] text-[#0f1035]",
    cardBase: isDark
      ? "bg-white/5 border border-white/10 text-white"
      : "bg-white border border-[#e4ddff] text-[#0f1035]",
    subtleText: isDark ? "text-white/60" : "text-[#6a6f92]",
    divider: isDark ? "border-white/10" : "border-[#e9e2ff]",
    buttonFilled: isDark
      ? "text-white shadow-[0_12px_30px_-10px_rgba(122,76,255,0.6)]"
      : "text-white shadow-[0_12px_30px_-10px_rgba(110,75,255,0.35)]",
    buttonGhost: isDark ? "text-white" : "bg-[#f2efff] text-[#6e4bff]",
    surfaceMuted: isDark ? "bg-white/10" : "bg-[#f7f5ff]",
    iconActive: "text-white",
    iconIdle: isDark ? "text-white/80" : "text-[#595f80]",
    chipClass:
      "inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-medium"
  };

  return (
    <div className={`dashboard flex w-full ${tokens.rootClass}`}>
      <DashboardSidebar
        apps={dashboardApps}
        activeAppId={activeApp.id}
        onSelectApp={setActiveAppId}
        navigationItems={dataset.navigation}
        tokens={tokens}
      />

      <section className="flex min-h-screen flex-1 flex-col lg:ms-72">
        <div className="flex flex-col gap-8 px-5 pb-12 pt-8 md:px-10 lg:px-14 xl:px-16">
          <DashboardHeader
            tokens={tokens}
            activeApp={activeApp}
            subtitle={headerSubtitle}
            onToggleTheme={handleToggleTheme}
          />

          {/* {hasPlaceholder ? (
            <div
              className={`${tokens.cardBase} flex flex-col items-start gap-4 rounded-[32px] px-8 py-10 text-left`}
            >
              <h2 className="text-2xl font-semibold">
                {activeApp.name} preview
              </h2>
              <p className={`text-sm ${tokens.subtleText}`}>
                {dataset.placeholder}
              </p>
              <p className={`text-xs uppercase tracking-[0.35em] ${tokens.subtleText}`}>
                Sidebar navigation updated for this workspace
              </p>
            </div>
          ) : (
            <>
              <DashboardHero tokens={tokens} hero={dataset.hero} />
              <DashboardStatsGrid stats={dataset.stats} tokens={tokens} />

              <div className="grid gap-8 xl:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
                <div className="flex flex-col gap-8">
                  <ProductsTable products={dataset.products} tokens={tokens} />
                  <UtilityPanels tokens={tokens} />
                </div>

                <div className="flex flex-col gap-8">
                  <DomainsPanel
                    domains={dataset.domains}
                    statusColors={statusColors}
                    tokens={tokens}
                  />
                  <SupportTicketsPanel tickets={dataset.tickets} tokens={tokens} />
                  <RecentNewsPanel news={dataset.news} tokens={tokens} />
                </div>
              </div>

              <ManagedSitesGrid sites={dataset.sites} tokens={tokens} />
            </>
          )} */}
        </div>
      </section>
    </div>
  );
};


