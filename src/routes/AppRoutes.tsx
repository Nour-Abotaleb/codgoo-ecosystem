import { Navigate, Route, Routes } from "react-router-dom";

import { useAuth } from "@features/auth";
import { LoginRoute } from "./auth/LoginRoute";
import { RegisterRoute } from "./auth/RegisterRoute";
import { DashboardRoute } from "./dashboard/DashboardRoute";

const RootRedirect = () => {
  const { isAuthenticated } = useAuth();
  return <Navigate to={isAuthenticated ? "/dashboard" : "/login"} replace />;
};

export const AppRoutes = () => (
  <Routes>
    <Route path="/" element={<RootRedirect />} />
    <Route path="/login" element={<LoginRoute />} />
    <Route path="/register" element={<RegisterRoute />} />
    <Route path="/dashboard/*" element={<DashboardRoute />} />
    <Route path="*" element={<Navigate to="/" replace />} />
  </Routes>
);

