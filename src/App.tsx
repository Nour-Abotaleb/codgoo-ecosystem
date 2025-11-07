import { Suspense } from "react";

import { AppLayout } from "./app/layouts/AppLayout";
import { AppProviders } from "./app/providers";
import { AppRoutes } from "./routes";
import { SplashScreen } from "./shared/components";

export const App = () => (
  <AppProviders>
    <AppLayout>
      <Suspense fallback={<SplashScreen />}>
        <AppRoutes />
      </Suspense>
    </AppLayout>
  </AppProviders>
);

