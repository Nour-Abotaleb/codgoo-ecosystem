import type { DashboardTokens, DomainItem, DomainStatus } from "../types";

type DomainsPanelProps = {
  readonly domains: readonly DomainItem[];
  readonly statusColors: Record<DomainStatus, string>;
  readonly tokens: DashboardTokens;
};

export const DomainsPanel = ({
  domains,
  statusColors,
  tokens
}: DomainsPanelProps) => (
  <section className={`${tokens.cardBase} rounded-[32px] px-7 py-6`}>
    <header className="flex items-center justify-between">
      <h2 className="text-xl font-semibold">Domains</h2>
      <button
        type="button"
        className={`${tokens.buttonGhost} rounded-full px-4 py-2 text-xs font-semibold uppercase tracking-wide`}
      >
        See All
      </button>
    </header>

    <div className="mt-6 space-y-4">
      {domains.map((domainItem) => (
        <div
          key={domainItem.id}
          className={`${tokens.surfaceMuted} flex items-center justify-between rounded-2xl px-4 py-4`}
        >
          <div>
            <p className="text-sm font-semibold">{domainItem.name}</p>
            <p className={`text-xs ${tokens.subtleText}`}>
              Search for new domain
            </p>
          </div>
          <div className="flex items-center gap-3">
            <span className={`${tokens.chipClass} ${statusColors[domainItem.status]}`}>
              {domainItem.status}
            </span>
            <div className="flex items-center gap-2">
              {Array.from({ length: 3 }, (_, index) => (
                <button
                  key={index}
                  type="button"
                  className={`${tokens.buttonGhost} h-9 w-9 rounded-2xl`}
                  aria-label="Domain action"
                />
              ))}
            </div>
          </div>
        </div>
      ))}
    </div>
  </section>
);


