import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { SESSION_EXPIRED_EVENT } from "../api";
import { getCurrentUser } from "../api/authApi";

const AuthContext = createContext(null);

const readSavedUser = () => {
  try {
    const savedUser = localStorage.getItem("currentUser");
    return savedUser ? JSON.parse(savedUser) : null;
  } catch {
    return null;
  }
};

export function AuthProvider({ children }) {
  const navigate = useNavigate();
  const [currentUser, setCurrentUserState] = useState(readSavedUser);
  const [authLoading, setAuthLoading] = useState(() => Boolean(localStorage.getItem("accessToken")));

  const setCurrentUser = useCallback((user) => {
    setCurrentUserState(user);

    if (user) {
      localStorage.setItem("currentUser", JSON.stringify(user));
    } else {
      localStorage.removeItem("currentUser");
      localStorage.removeItem("accessToken");
    }
  }, []);

  const refreshUser = useCallback(async () => {
    const response = await getCurrentUser();
    setCurrentUser(response.data.user);
    return response.data.user;
  }, [setCurrentUser]);

  useEffect(() => {
    if (!localStorage.getItem("accessToken")) {
      setAuthLoading(false);
      return;
    }

    refreshUser()
      .catch(() => setCurrentUser(null))
      .finally(() => setAuthLoading(false));
  }, [refreshUser, setCurrentUser]);

  useEffect(() => {
    const handleExpired = () => {
      setCurrentUser(null);
      toast.error("Your session has expired. Please log in again.");
      navigate("/login", { replace: true });
    };

    window.addEventListener(SESSION_EXPIRED_EVENT, handleExpired);

    return () => window.removeEventListener(SESSION_EXPIRED_EVENT, handleExpired);
  }, [navigate, setCurrentUser]);

  const value = useMemo(
    () => ({ currentUser, setCurrentUser, refreshUser, authLoading }),
    [currentUser, setCurrentUser, refreshUser, authLoading],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuthContext() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuthContext must be used inside AuthProvider");
  }

  return context;
}
