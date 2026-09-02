// src/pages/auth/ProtectedRoute.tsx
import { useAuth } from "@/context/AuthContext";
import { type ReactNode, lazy, Suspense } from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";

interface ProtectedRouteProps {
  children?: ReactNode;
  redirectTo?: string; // default: "/auth/login"
  allowedRoles?: ((string & {}))[]; // optional: restrict by role
  displayRoles?: ((string & {}))[];
}

export default function ProtectedRoute({
  children,
  redirectTo = "/auth/login",
  allowedRoles,
  displayRoles = [],
}: ProtectedRouteProps) {
  const { user, authStatus, isLoading } = useAuth();
  const location = useLocation();

  // 1. Memorize the intended URL string parameters for post-login redirection
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

  // 5. Render: Access granted successfully. Render nested routes or explicit child trees
  return children ? <>{children}</> : <Outlet />;
}
