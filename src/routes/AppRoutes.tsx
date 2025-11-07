import { Navigate, Route, Routes } from "react-router-dom";

import { HomeRoute } from "./home";

export const AppRoutes = () => (
  <Routes>
    <Route path="/" element={<HomeRoute />} />
    <Route path="*" element={<Navigate to="/" replace />} />
  </Routes>
);

