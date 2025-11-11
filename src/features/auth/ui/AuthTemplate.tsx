import type { ReactNode } from "react";

import signInIllustration from "@assets/images/sign-in.png";

type AuthTemplateProps = {
  readonly title: string;
  readonly subtitle: string;
  readonly children: ReactNode;
  readonly bottomSlot: ReactNode;
  readonly className?: string;
};

export const AuthTemplate = ({
  title,
  subtitle,
  children,
  bottomSlot,
  className,
}: AuthTemplateProps) => (
  <div className="flex w-full flex-1 min-h-screen items-center justify-center bg-white px-4 py-4 sm:px-6 lg:px-8">
    <div className="mx-auto grid w-full max-w-6xl items-center justify-items-center gap-16 md:min-h-[640px] md:grid-cols-[minmax(0,520px)_minmax(0,1fr)]">
      <div className="order-1 flex w-full max-w-xl flex-col gap-10 md:justify-self-start">
        <header className="space-y-3">
          <h1 className="text-2xl md:text-4xl font-semibold tracking-tight text-slate-900">
            {title}
          </h1>
          <p className="font-extralight text-base md:text-lg text-[color:var(--color-auth-placeholder)]">
            {subtitle}
          </p>
        </header>

        <div className={className}>{children}</div>

        <div className="text-sm text-center">
          {bottomSlot}
        </div>
      </div>
      <div className="order-2 hidden w-full items-center justify-center md:flex">
        <div className="flex w-full max-w-xl items-center justify-center">
          <img
            src={signInIllustration}
            alt=""
            className="h-auto w-full object-contain"
            loading="lazy"
          />
        </div>
      </div>
    </div>
  </div>
);


