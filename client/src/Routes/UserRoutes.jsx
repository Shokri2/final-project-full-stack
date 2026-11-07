import { Navigate, Route } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute.jsx";
import UserLayout from "../Components/User/UserLayout.jsx";
import UserDashboard from "../Pages/User/UserDashboard.jsx";
import UserCrops from "../Pages/User/UserCrops.jsx";
import UserCropDetails from "../Pages/User/UserCropDetails.jsx";
import MyRequests from "../Pages/User/MyRequests.jsx";
import NewRequest from "../Pages/User/NewRequest.jsx";
import UserRequestDetails from "../Pages/User/UserRequestDetails.jsx";
import MyFeedback from "../Pages/User/MyFeedback.jsx";
import Profile from "../Pages/Profile/Profile.jsx";
import ChangePassword from "../Pages/ChangePassword/ChangePassword.jsx";

export const userRoutes = (
  <Route element={<ProtectedRoute roles={["user"]} />}>
    <Route path="/user" element={<UserLayout />}>
      <Route index element={<Navigate to="dashboard" replace />} />
      <Route path="dashboard" element={<UserDashboard />} />
      <Route path="crops" element={<UserCrops />} />
      <Route path="crops/:id" element={<UserCropDetails />} />
      <Route path="requests" element={<MyRequests />} />
      <Route path="requests/new" element={<NewRequest />} />
      <Route path="requests/:id" element={<UserRequestDetails />} />
      <Route path="feedback" element={<MyFeedback />} />
      <Route path="profile" element={<Profile />} />
      <Route path="change-password" element={<ChangePassword />} />
    </Route>
  </Route>
);
