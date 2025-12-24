import { Suspense } from "react";
import { Toaster } from "react-hot-toast";

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
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: "#363636",
            color: "#fff",
          },
          success: {
            duration: 3000,
            iconTheme: {
              primary: "#4ade80",
              secondary: "#fff",
            },
          },
          error: {
            duration: 4000,
            iconTheme: {
              primary: "#ef4444",
              secondary: "#fff",
            },
          },
        }}
      />
    </AppLayout>
  </AppProviders>
);

