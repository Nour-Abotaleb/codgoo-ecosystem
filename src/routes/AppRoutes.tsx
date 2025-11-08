import { Navigate, Route, Routes } from "react-router-dom";

import { LoginRoute } from "./auth/LoginRoute";
import { RegisterRoute } from "./auth/RegisterRoute";
import { DashboardRoute } from "./dashboard/DashboardRoute";

export const AppRoutes = () => (
  <Routes>
    <Route path="/" element={<Navigate to="/login" replace />} />
    <Route path="/login" element={<LoginRoute />} />
    <Route path="/register" element={<RegisterRoute />} />
    <Route path="/dashboard" element={<DashboardRoute />} />
    <Route path="*" element={<Navigate to="/" replace />} />
  </Routes>
);

