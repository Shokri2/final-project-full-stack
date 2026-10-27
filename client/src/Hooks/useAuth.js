
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import api from "../api";
import { useAuthContext } from "../Context/AuthContext";

export const useAuth = () => {
  const navigate = useNavigate();
  const { currentUser, setCurrentUser } = useAuthContext();
  const [loading, setLoading] = useState(false);

  const login = async (userData) => {
    try {
      if (!userData.email || !userData.password) {
        toast.error("Please fill in email and password.");
        return;
      }

      setLoading(true);

      const res = await api.post("/auth/login", userData);
      const user = res.data.user;
      const accessToken = res.data.accessTokens;

      if (!user) {
        toast.error("User data was not returned from the server.");
        return;
      }

      if (!accessToken) {
        toast.error("Access token was not returned from the server.");
        return;
      }

      localStorage.setItem("accessToken", accessToken);
      setCurrentUser(user);

      toast.success(
        res.data.message || res.data.meesage || "Login successful!",
      );

      if (user.role === "admin") {
        navigate("/admin/dashboard");
      } else {
        navigate("/user/dashboard");
      }
    } catch (error) {
      const serverError =
        error.response?.data?.error?.[0]?.message ||
        error.response?.data?.message ||
        error.response?.data?.error ||
        "Login failed. Please check your credentials.";

      toast.error(
        typeof serverError === "string"
          ? serverError
          : "Login failed. Please check your credentials.",
      );
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData) => {
    try {
      if (!userData.email || !userData.password || !userData.name) {
        toast.error("Please fill in all required fields.");
        return;
      }

      setLoading(true);

      const res = await api.post("/auth/register", userData);

      toast.success(
        res.data.message || res.data.meesage || "Registration successful!",
      );

      navigate("/login");
      return res.data;
    } catch (error) {
      const serverError =
        error.response?.data?.error?.[0]?.message ||
        error.response?.data?.message ||
        error.response?.data?.error ||
        "Registration failed. Please try again.";

      toast.error(
        typeof serverError === "string"
          ? serverError
          : "Registration failed. Please check your information.",
      );

      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem("accessToken");
    setCurrentUser(null);
    toast.success("Logged out successfully.");
    navigate("/");
  };

  return {
    login,
    register,
    logout,
    currentUser,
    loading,
  };
};

