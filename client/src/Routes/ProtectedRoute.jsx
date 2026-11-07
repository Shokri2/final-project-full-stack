import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuthContext } from "../Context/AuthContext";
import LoadingState from "../Components/Common/LoadingState";

function ProtectedRoute({ roles }) {
  const location = useLocation();
  const { currentUser, authLoading } = useAuthContext();

  if (authLoading) {
    return <LoadingState fullPage message="Checking your session..." />;
  }

  if (!currentUser) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  if (roles && !roles.includes(currentUser.role)) {
    return <Navigate to="/unauthorized" replace state={{ from: location }} />;
  }

  return <Outlet />;
}

export default ProtectedRoute;
