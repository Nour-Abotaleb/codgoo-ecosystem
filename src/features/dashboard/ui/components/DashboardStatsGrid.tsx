import type { DashboardTokens, StatItem } from "../types";
import { PlaceholderIcon } from "./PlaceholderIcon";

type DashboardStatsGridProps = {
  readonly stats: readonly StatItem[];
  readonly tokens: DashboardTokens;
};

export const DashboardStatsGrid = ({
  stats,
  tokens
}: DashboardStatsGridProps) => (
  <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
    {stats.map((item) => (
      <div
        key={item.id}
        className={`${tokens.cardBase} flex flex-col gap-3 rounded-3xl px-6 py-6`}
      >
        <div className="flex items-center justify-between">
          <h3 className="text-base font-semibold">{item.label}</h3>
          <PlaceholderIcon label={item.label} tokens={tokens} />
        </div>
        <p className="text-3xl font-semibold">{item.value}</p>
      </div>
    ))}
  </div>
);


