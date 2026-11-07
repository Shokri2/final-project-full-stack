import { Navigate, Outlet } from "react-router-dom";
import { useAuthContext } from "../Context/AuthContext";
import LoadingState from "../Components/Common/LoadingState";
import { getRoleHome } from "../utils/roles";

function GuestRoute() {
  const { currentUser, authLoading } = useAuthContext();

  if (authLoading) {
    return <LoadingState fullPage />;
  }

  if (currentUser) {
    return <Navigate to={getRoleHome(currentUser)} replace />;
  }

  return <Outlet />;
}

export default GuestRoute;
