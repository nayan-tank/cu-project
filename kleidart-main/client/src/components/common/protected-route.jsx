import { Navigate } from "react-router-dom";

function ProtectedRoute({ isAuthenticated, user, requiredRole, children }) {
  if (!isAuthenticated) {
    return <Navigate to="/auth/login" />;
  }

  if (requiredRole && user?.role !== requiredRole) {
    return <Navigate to="/unauth-page" />;
  }

  return children;
}

export default ProtectedRoute;
