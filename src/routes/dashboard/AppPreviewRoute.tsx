import { AppPreviewPage } from "@features/dashboard";
import { ProtectedRoute } from "../ProtectedRoute";

export const AppPreviewRoute = () => (
  <ProtectedRoute>
    <AppPreviewPage />
  </ProtectedRoute>
);
