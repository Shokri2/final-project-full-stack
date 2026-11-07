import { Navigate, Route } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute.jsx";
import AdminLayout from "../Components/Admin/AdminLayout.jsx";
import AdminDashboard from "../Pages/Admin/AdminDashboard.jsx";
import AdminRequests from "../Pages/Admin/AdminRequests.jsx";
import AdminRequestDetails from "../Pages/Admin/AdminRequestDetails.jsx";
import UsersList from "../Pages/Admin/UsersList.jsx";
import UserDetails from "../Pages/Admin/UserDetails.jsx";
import CategoriesPage from "../Pages/Admin/CategoriesPage.jsx";
import CropsAdmin from "../Pages/Admin/CropsAdmin.jsx";
import CropEditor from "../Pages/Admin/CropEditor.jsx";
import ContactMessages from "../Pages/Admin/ContactMessages.jsx";
import ActivityLog from "../Pages/Admin/ActivityLog.jsx";
import FeedbackModeration from "../Pages/Moderation/FeedbackModeration.jsx";
import Profile from "../Pages/Profile/Profile.jsx";
import ChangePassword from "../Pages/ChangePassword/ChangePassword.jsx";

export const adminRoutes = (
  <Route element={<ProtectedRoute roles={["admin"]} />}>
    <Route path="/admin" element={<AdminLayout />}>
      <Route index element={<Navigate to="dashboard" replace />} />
      <Route path="dashboard" element={<AdminDashboard />} />
      <Route path="requests" element={<AdminRequests />} />
      <Route path="requests/:id" element={<AdminRequestDetails />} />
      <Route path="feedback" element={<FeedbackModeration subtitle="Approve reviews before they appear publicly." />} />
      <Route path="users" element={<UsersList />} />
      <Route path="users/:id" element={<UserDetails />} />
      <Route path="categories" element={<CategoriesPage />} />
      <Route path="crops" element={<CropsAdmin />} />
      <Route path="crops/new" element={<CropEditor />} />
      <Route path="crops/:id" element={<CropEditor />} />
      <Route path="messages" element={<ContactMessages />} />
      <Route path="activities" element={<ActivityLog />} />
      <Route path="profile" element={<Profile />} />
      <Route path="change-password" element={<ChangePassword />} />
    </Route>
  </Route>
);
