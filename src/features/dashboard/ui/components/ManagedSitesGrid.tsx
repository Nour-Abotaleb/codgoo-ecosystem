import type { DashboardTokens, SiteItem } from "../types";

type ManagedSitesGridProps = {
  readonly sites: readonly SiteItem[];
  readonly tokens: DashboardTokens;
};

export const ManagedSitesGrid = ({
  sites,
  tokens
}: ManagedSitesGridProps) => (
  <section className={`${tokens.cardBase} rounded-[32px] px-7 py-6`}>
    <header className="flex items-center justify-between">
      <h2 className="text-xl font-semibold">Managed Sites</h2>
      <button
        type="button"
        className={`${tokens.buttonGhost} rounded-full px-4 py-2 text-xs font-semibold uppercase tracking-wide`}
      >
        See All
      </button>
    </header>

    <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      {sites.map((site) => (
        <div
          key={site.id}
          className={`${tokens.surfaceMuted} flex flex-col gap-4 rounded-3xl px-5 py-6`}
        >
          <div>
            <p className="text-base font-semibold">{site.name}</p>
            <p className={`text-xs ${tokens.subtleText}`}>{site.type}</p>
          </div>
          <button
            type="button"
            className={`${tokens.buttonFilled} rounded-full px-4 py-2 text-xs font-semibold uppercase tracking-wide`}
          >
            Manage Site
          </button>
        </div>
      ))}
    </div>
  </section>
);


