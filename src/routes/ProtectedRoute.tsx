import { Navigate } from "react-router-dom";

import { useAuth } from "@features/auth";

type ProtectedRouteProps = {
  readonly children: React.ReactElement;
};

export const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { isAuthenticated, loading } = useAuth();

  // Show loading state while checking authentication
  if (loading) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm">
        <div className="flex flex-col items-center gap-4">
          {/* Three dots animation */}
          <div className="flex flex-wrap items-center gap-2">
            <div className="size-3 rounded-full bg-[#4318FF] animate-bounce [animation-delay:-0.3s]" />
            <div className="size-3 rounded-full bg-[#4318FF] animate-bounce [animation-delay:-0.15s]" />
            <div className="size-3 rounded-full bg-[#4318FF] animate-bounce" />
          </div>
          {/* Loading text */}
          <p className="text-sm font-medium text-slate-600 dark:text-slate-300">
            Loading...
          </p>
        </div>
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

