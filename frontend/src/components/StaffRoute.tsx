import { Navigate, useLocation } from "react-router-dom";
import type { ReactNode } from "react";
import { useAuth } from "../context/auth-context";

export function StaffRoute({ children }: { children: ReactNode }) {
  const { isAuthenticated, user } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }

  if (user?.role !== "ADMIN" && user?.role !== "TEACHER") {
    return <Navigate to="/courses" replace />;
  }

  return <>{children}</>;
}
