import type { ReactNode } from "react";

import { AppFooter } from "@shared/components/AppFooter";
import { AppHeader } from "@shared/components/AppHeader";

type AppLayoutProps = {
  readonly children: ReactNode;
};

export const AppLayout = ({ children }: AppLayoutProps) => (
  <div className="flex min-h-screen flex-col bg-slate-950 text-slate-100">
    <AppHeader />
    <main className="flex flex-1 items-center justify-center px-4 py-10 sm:px-6 lg:px-8">
      {children}
    </main>
    <AppFooter />
  </div>
);

