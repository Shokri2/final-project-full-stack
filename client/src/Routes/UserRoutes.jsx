import { Navigate, Route } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute.jsx";
import UserLayout from "../Components/User/UserLayout.jsx";
import UnderConstruction from "../Pages/UnderConstruction/UnderConstruction.jsx";
import Profile from "../Pages/Profile/Profile.jsx";
import ChangePassword from "../Pages/ChangePassword/ChangePassword.jsx";

export const userRoutes = (
  <Route element={<ProtectedRoute roles={["user"]} />}>
    <Route path="/user" element={<UserLayout />}>
      <Route index element={<Navigate to="dashboard" replace />} />
      <Route path="dashboard" element={<UnderConstruction title="Dashboard" />} />
      <Route path="crops" element={<UnderConstruction title="Crop Guide" />} />
      <Route path="requests" element={<UnderConstruction title="My Requests" />} />
      <Route path="requests/new" element={<UnderConstruction title="New Request" />} />
      <Route path="requests/:id" element={<UnderConstruction title="Request Details" />} />
      <Route path="feedback" element={<UnderConstruction title="My Feedback" />} />
      <Route path="profile" element={<Profile />} />
      <Route path="change-password" element={<ChangePassword />} />
    </Route>
  </Route>
);
