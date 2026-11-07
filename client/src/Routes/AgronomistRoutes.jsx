import { Navigate, Route } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute.jsx";
import AgronomistLayout from "../Components/Agronomist/AgronomistLayout.jsx";
import UnderConstruction from "../Pages/UnderConstruction/UnderConstruction.jsx";
import Profile from "../Pages/Profile/Profile.jsx";
import ChangePassword from "../Pages/ChangePassword/ChangePassword.jsx";

export const agronomistRoutes = (
  <Route element={<ProtectedRoute roles={["agronomist"]} />}>
    <Route path="/agronomist" element={<AgronomistLayout />}>
      <Route index element={<Navigate to="dashboard" replace />} />
      <Route path="dashboard" element={<UnderConstruction title="Dashboard" />} />
      <Route path="requests" element={<UnderConstruction title="Assigned Requests" />} />
      <Route path="requests/:id" element={<UnderConstruction title="Request Details" />} />
      <Route path="feedback" element={<UnderConstruction title="Feedback Review" />} />
      <Route path="profile" element={<Profile />} />
      <Route path="change-password" element={<ChangePassword />} />
    </Route>
  </Route>
);
