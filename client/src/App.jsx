import "./App.css";
import { Routes, Route, Navigate } from "react-router-dom";

// Public Pages
import LandingPage from "./Pages/LandingPage/LandingPage.jsx";
import Home from "./Pages/Home/Home.jsx";
import About from "./Pages/About/About.jsx";
import Services from "./Pages/Services/Services.jsx";

// Authentication
import Register from "./Components/Auth/Register.jsx";
import Login from "./Components/Auth/Login.jsx";

// User
import UserLayout from "./Components/User/UserLayout.jsx";
import UserDashboard from "./Components/User/UserDashboard.jsx";

// Admin
import AdminLayout from "./Components/Admin/AdminLayout.jsx";
import AdminDashboard from "./Components/Admin/AdminDashboard.jsx";

function App() {
  return (
    <Routes>
      {/* ================= PUBLIC PAGES ================= */}

      <Route path="/" element={<LandingPage />} />

      <Route path="/home" element={<Home />} />

      <Route path="/about" element={<About />} />

      <Route path="/services" element={<Services />} />

      {/* ================= AUTH ================= */}

      <Route path="/register" element={<Register />} />

      <Route path="/login" element={<Login />} />

      {/* ================= USER ================= */}

      <Route path="/user" element={<UserLayout />}>
        <Route index element={<Navigate to="dashboard" replace />} />

        <Route path="dashboard" element={<UserDashboard />} />
      </Route>

      {/* ================= ADMIN ================= */}

      <Route path="/admin" element={<AdminLayout />}>
        <Route index element={<Navigate to="dashboard" replace />} />

        <Route path="dashboard" element={<AdminDashboard />} />
      </Route>

      {/* ================= NOT FOUND ================= */}

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
