import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import type { ReactNode } from "react";
import type { UserRole } from "../types";

interface ProtectedRouteProps {
  allowedRoles: UserRole[];
  redirectTo?: string;
  children: ReactNode;
}

export const ProtectedRoute = ({ allowedRoles, redirectTo = "/login", children }: ProtectedRouteProps) => {
  const { user } = useAuth();
  if (!user) {
    return <Navigate to={redirectTo} replace />;
  }
  if (!allowedRoles.includes(user.role)) {
    return <Navigate to={redirectTo} replace />;
  }
  return <>{children}</>;
};
