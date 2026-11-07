import { Navigate, Route } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute.jsx";
import AgronomistLayout from "../Components/Agronomist/AgronomistLayout.jsx";
import AgronomistDashboard from "../Pages/Agronomist/AgronomistDashboard.jsx";
import AssignedRequests from "../Pages/Agronomist/AssignedRequests.jsx";
import AgronomistRequestDetails from "../Pages/Agronomist/AgronomistRequestDetails.jsx";
import FeedbackModeration from "../Pages/Moderation/FeedbackModeration.jsx";
import Profile from "../Pages/Profile/Profile.jsx";
import ChangePassword from "../Pages/ChangePassword/ChangePassword.jsx";

export const agronomistRoutes = (
  <Route element={<ProtectedRoute roles={["agronomist"]} />}>
    <Route path="/agronomist" element={<AgronomistLayout />}>
      <Route index element={<Navigate to="dashboard" replace />} />
      <Route path="dashboard" element={<AgronomistDashboard />} />
      <Route path="requests" element={<AssignedRequests />} />
      <Route path="requests/:id" element={<AgronomistRequestDetails />} />
      <Route
        path="feedback"
        element={<FeedbackModeration subtitle="Reviews about crops in your specialties and your own consultations." />}
      />
      <Route path="profile" element={<Profile />} />
      <Route path="change-password" element={<ChangePassword />} />
    </Route>
  </Route>
);
