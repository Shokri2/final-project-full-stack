import { Navigate, Route } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute.jsx";
import AdminLayout from "../Components/Admin/AdminLayout.jsx";
import UnderConstruction from "../Pages/UnderConstruction/UnderConstruction.jsx";

export const adminRoutes = (
  <Route element={<ProtectedRoute roles={["admin"]} />}>
    <Route path="/admin" element={<AdminLayout />}>
      <Route index element={<Navigate to="dashboard" replace />} />
      <Route path="dashboard" element={<UnderConstruction title="Dashboard" />} />
      <Route path="requests" element={<UnderConstruction title="Requests" />} />
      <Route path="requests/:id" element={<UnderConstruction title="Request Details" />} />
      <Route path="feedback" element={<UnderConstruction title="Feedback" />} />
      <Route path="users" element={<UnderConstruction title="Users" />} />
      <Route path="users/:id" element={<UnderConstruction title="User Details" />} />
      <Route path="categories" element={<UnderConstruction title="Categories" />} />
      <Route path="crops" element={<UnderConstruction title="Crops" />} />
      <Route path="messages" element={<UnderConstruction title="Messages" />} />
      <Route path="activities" element={<UnderConstruction title="Activity Log" />} />
      <Route path="profile" element={<UnderConstruction title="Profile" />} />
      <Route path="change-password" element={<UnderConstruction title="Change Password" />} />
    </Route>
  </Route>
);
