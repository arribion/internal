// src/pages/auth/ProtectedRoute.tsx
import { useAuth } from "@/context/AuthContext";
import { type ReactNode } from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import toast from "react-hot-toast"; // Make sure toast is imported

interface ProtectedRouteProps {
  children?: ReactNode;
  redirectTo?: string; // default: "/auth/login"
  allowedRoles?: string[]; // optional: restrict by role
  displayRoles?: string[];
}

export default function ProtectedRoutes({
  children,
  redirectTo = "/auth/login",
  allowedRoles = [], // Defaulting to empty array avoids .length crashes
  displayRoles = [],
}: ProtectedRouteProps) {
  const { user, authStatus, isLoading } = useAuth();
  const location = useLocation();

  // 1. Memorize the intended URL parameters for post-login redirection
  const intent = encodeURIComponent(
    location.pathname + location.search + location.hash,
  );

  // 2. Loading State: Wait for AuthContextProvider fetchUser execution to complete
  if (isLoading) {
    return <p>Restoring secure session...</p>;
  }

  // 3. Authentication Check: Redirect only after bootstrap has completed
  if (authStatus === "unauthenticated" || !user) {
    return (
      <Navigate
        to={`${redirectTo}?returnTo=${intent}`}
        state={{ from: location }}
        replace
      />
    );
  }

  // 4. Role Authorization Check: Run ONLY after verifying the user exists
  if (allowedRoles.length > 0) {
    // Modify 'user?.role' to match whatever property name your database uses (e.g., user?.role, user?.type)
    const hasRole = allowedRoles.includes((user as any)?.role || "");

    if (!hasRole) {
      toast.error("You do not have permission to view this page");
      return <Navigate to="/auth/unauthorized" replace />;
    }
  }

  // 5. Render: Access granted successfully.
  return children ? <>{children}</> : <Outlet />;
}