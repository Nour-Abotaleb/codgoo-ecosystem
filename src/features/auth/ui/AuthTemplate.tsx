import type { ReactNode } from "react";
import { useAppSelector } from "@store/hooks";
import { selectTheme } from "@store/theme/theme-slice";

import loginDark from "@assets/images/loginDark.png";
import loginwhite from "@assets/images/loginwhite.png";

type AuthTemplateProps = {
  readonly title: string;
  readonly children: ReactNode;
  readonly bottomSlot: ReactNode;
  readonly className?: string;
};

export const AuthTemplate = ({
  title,
  children,
  bottomSlot,
  className,
}: AuthTemplateProps) => {
  const theme = useAppSelector(selectTheme);
  const isDark = theme === "dark";

  return (
    <div className={`flex w-full flex-1 h-screen overflow-hidden items-center justify-center px-4 py-4 sm:px-6 lg:px-8 transition-colors duration-300 ${
      isDark ? "bg-[#0F1217]" : "bg-white"
    }`}>
      <div className="mx-auto grid w-full max-w-6xl items-center justify-items-center gap-16 md:min-h-[640px] lg:grid-cols-[minmax(0,520px)_minmax(0,1fr)]">
        <div className="order-1 flex w-full lg:max-w-xl flex-col gap-2 md:justify-self-start">
          <header className="space-y-3 mb-4">
            <h1 className={`text-2xl md:text-3xl font-semibold tracking-tight transition-colors ${
              isDark ? "text-white" : "text-slate-900"
            }`}>
              {title}
            </h1>
          </header>

          <div className={className}>{children}</div>

          <div className="text-sm text-center">
            {bottomSlot}
          </div>
        </div>
        <div className="order-2 hidden w-full items-center justify-center lg:flex">
          <div className="flex w-full max-w-xl items-center justify-center">
            <img
              src={isDark ? loginDark : loginwhite}
              alt=""
              className="h-auto w-full object-contain"
              loading="lazy"
            />
          </div>
        </div>
      </div>
    </div>
  );
};


