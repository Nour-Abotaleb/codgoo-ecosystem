import type { DashboardTokens } from "../types";

type PlaceholderIconProps = {
  readonly label: string;
  readonly isActive?: boolean;
  readonly tokens: DashboardTokens;
  readonly activeClassName?: string;
  readonly idleClassName?: string;
};

export const PlaceholderIcon = ({
  label,
  isActive,
  tokens,
  activeClassName,
  idleClassName
}: PlaceholderIconProps) => (
  <span
    className={`flex h-11 w-11 items-center justify-center rounded-[20px] text-xs font-semibold uppercase tracking-wide ${
      isActive ? activeClassName ?? tokens.iconActive : idleClassName ?? tokens.iconIdle
    }`}
  >
    {label.slice(0, 2)}
  </span>
);


