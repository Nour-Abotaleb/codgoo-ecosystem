import { DashboardPage } from "@features/dashboard";
import { ProtectedRoute } from "../ProtectedRoute";

export const DashboardRoute = () => (
  <ProtectedRoute>
    <DashboardPage />
  </ProtectedRoute>
);


