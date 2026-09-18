import { useAuth } from "@/context/AuthContext";
import { type ReactNode } from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import toast from "react-hot-toast";
import { Oval } from "react-loader-spinner";
interface ProtectedRouteProps {
  children?: ReactNode;
  redirectTo?: string;
  allowedRoles?: string[];
  displayRoles?: string[];
}

export default function ProtectedRoutes({
  children,
  redirectTo = "/auth/login",
  allowedRoles = [],
}: ProtectedRouteProps) {
  const { user, authStatus, isLoading } = useAuth();
  const location = useLocation();

  // 1. Memorize the intended URL parameters for post-login redirection
  const intent = encodeURIComponent(
    location.pathname + location.search + location.hash,
  );

  // 2. Loading State: Wait for AuthContextProvider fetchUser execution to complete
  if (isLoading) {
    return (
      <div className="fixed inset-0 flex flex-col items-center justify-center z-50">
        <Oval
          height={80}
          width={80}
          color="#0ea5e9"
          secondaryColor="#bae6fd"
          strokeWidth={2}
          strokeWidthSecondary={2}
          visible={true}
          ariaLabel="oval-loading"
          wrapperStyle={{}}
          wrapperClass=""
        />
        <p className="mt-4 text-slate-600 font-medium">
          Restoring secure session...
        </p>
      </div>
    );
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
    const hasRole = allowedRoles.includes(user.role || "");

    if (!hasRole) {
      toast.error("You do not have permission to view this page");
      return <Navigate to="/auth/unauthorized" replace />;
    }
  }

  // 5. Render: Access granted successfully.
  return children ? <>{children}</> : <Outlet />;
}
