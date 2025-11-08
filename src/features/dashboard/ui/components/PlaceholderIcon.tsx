import type { DashboardTokens } from "../types";

type PlaceholderIconProps = {
  readonly label: string;
  readonly isActive?: boolean;
  readonly tokens: DashboardTokens;
};

export const PlaceholderIcon = ({
  label,
  isActive,
  tokens
}: PlaceholderIconProps) => (
  <span
    className={`flex h-11 w-11 items-center justify-center rounded-2xl text-xs font-semibold uppercase tracking-wide ${
      isActive ? tokens.iconActive : tokens.iconIdle
    }`}
  >
    {label.slice(0, 2)}
  </span>
);


