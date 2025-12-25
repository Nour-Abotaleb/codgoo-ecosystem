import type { DashboardTokens } from "../types";

/**
 * Returns the standard input class for modal inputs
 * @param tokens - Dashboard tokens for theme support
 * @param options - Optional configuration for the input class
 * @returns Tailwind CSS class string
 */
export const getModalInputClass = (
  tokens: DashboardTokens,
  options?: {
    paddingY?: "py-3" | "py-3.5";
    textColor?: string;
  }
): string => {
  const paddingY = options?.paddingY ?? "py-3.5";
  const lightTextColor = options?.textColor ?? "!text-black";

  return `w-full px-4 ${paddingY} rounded-[20px] border placeholder:text-sm ${
    tokens.isDark
      ? "bg-transparent border-white/20 text-white placeholder:text-white/50"
      : `bg-transparent border-[#E6E6E6] ${lightTextColor} !placeholder:text-black`
  } focus:outline-none`;
};

