import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { useAuthContext } from "../Context/AuthContext";
import { loginRequest, logoutRequest, registerRequest } from "../api/authApi";
import { getErrorCode, getErrorMessage } from "../utils/errors";
import { getRoleHome } from "../utils/roles";

export const useAuth = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { currentUser, setCurrentUser, refreshUser, authLoading } = useAuthContext();
  const [loading, setLoading] = useState(false);

  const login = async (userData) => {
    try {
      setLoading(true);

      const res = await loginRequest(userData);
      const user = res.data.user;

      localStorage.setItem("accessToken", res.data.accessTokens);
      setCurrentUser(user);

      toast.success(res.data.message || "Login successful!");

      const from = location.state?.from?.pathname;
      navigate(from && from !== "/login" ? from : getRoleHome(user), { replace: true });

      return { ok: true };
    } catch (error) {
      if (getErrorCode(error) === "EMAIL_NOT_VERIFIED") {
        toast.error(getErrorMessage(error));
        navigate(`/verify-email?email=${encodeURIComponent(userData.email)}`);
        return { ok: false };
      }

      toast.error(getErrorMessage(error, "Login failed. Please check your credentials."));
      return { ok: false, error };
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData) => {
    try {
      setLoading(true);

      const res = await registerRequest(userData);

      toast.success(res.data.message || "Registration successful!");
      navigate(`/verify-email?email=${encodeURIComponent(userData.email)}&registered=1`);

      return { ok: true };
    } catch (error) {
      toast.error(getErrorMessage(error, "Registration failed. Please try again."));
      return { ok: false, error };
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      await logoutRequest();
    } catch {
      toast.error("Could not reach the server, you have been logged out locally.");
    } finally {
      setCurrentUser(null);
      toast.success("Logged out successfully.");
      navigate("/");
    }
  };

  return {
    login,
    register,
    logout,
    refreshUser,
    currentUser,
    loading,
    authLoading,
  };
};
