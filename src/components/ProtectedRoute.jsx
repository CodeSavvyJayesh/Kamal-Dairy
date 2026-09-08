import { Navigate, useLocation } from "react-router-dom";
import { clearSession, getRole, isLoggedIn } from "../api/client";

/**
 * Route guard.
 *
 * This is a USER EXPERIENCE guard, not a security boundary: it stops the app
 * rendering pages that will only fail, and keeps the admin screen out of sight.
 * The real enforcement is in Spring Security, which now rejects these calls
 * regardless of what the browser decides to render.
 */
function ProtectedRoute({ children, requireAdmin = false }) {
  const location = useLocation();

  if (!isLoggedIn()) {
    clearSession();
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }

  if (requireAdmin && getRole() !== "ROLE_ADMIN") {
    return <Navigate to="/" replace />;
  }

  return children;
}

export default ProtectedRoute;
