"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  ReactNode,
} from "react";
import { useRouter } from "next/navigation";
import { apiClient } from "../api/apiClient";
import {
  getTokens,
  storeTokens,
  storeAccessToken,
  clearTokens,
} from "../api/authService";

interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role?: string;
}

interface AuthContextType {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  loading: boolean;
  error: string | null;
  verifyOtp: (userData: any, otpCode: string) => Promise<void>;
  login: (phone: string, password: string) => Promise<void>;
  refreshAccessToken: () => Promise<boolean>;
  logout: () => void;
  redirectPath: string | null;
  setRedirectPath: (path: string | null) => void;
}
import { signInWithCredential, PhoneAuthProvider } from "firebase/auth";
import { auth } from "@/lib/firebase";
import axios from "axios";
const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const router = useRouter();

  const [user, setUser] = useState<User | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [refreshToken, setRefreshToken] = useState<string | null>(null);
  const [redirectPath, setRedirectPath] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // ✅ Load from storage on mount
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const { accessToken, refreshToken } = getTokens();
    const storedRedirect = localStorage.getItem("redirectPath");

    if (storedUser && accessToken && refreshToken) {
      setUser(JSON.parse(storedUser));
      setAccessToken(accessToken);
      setRefreshToken(refreshToken);
    }

    if (storedRedirect) setRedirectPath(storedRedirect);
    setLoading(false);
  }, []);

  // ✅ Persist auth changes to storage
  useEffect(() => {
    if (user && accessToken && refreshToken) {
      localStorage.setItem("user", JSON.stringify(user));
      storeTokens(accessToken, refreshToken);
    } else {
      clearTokens();
    }
  }, [user, accessToken, refreshToken]);

  // ✅ Persist redirect path
  useEffect(() => {
    if (redirectPath) localStorage.setItem("redirectPath", redirectPath);
    else localStorage.removeItem("redirectPath");
  }, [redirectPath]);

  // ✅ Listen for logout events (from apiClient)
  useEffect(() => {
    const handleLogout = () => logout();
    window.addEventListener("auth:logout", handleLogout);
    return () => window.removeEventListener("auth:logout", handleLogout);
  }, []);

  // ✅ Verify OTP (Signup/Login)
const verifyOtp = async (userData: any, firebaseToken: string) => {
  setError(null);

  try {
    // ✅ Check for referral in localStorage
    const referralId = localStorage.getItem("referral_id");

    // ✅ Build payload
    const payload: any = {
      ...userData,
      firebaseToken,
      name: `${userData?.firstName || ""} ${userData?.lastName || ""}`.trim(),
    };

    if (referralId) {
      payload.parent_affiliate = referralId; // add parent_affiliate only if referral exists
    }

    const res = await axios.post("https://thegroome.com/backend/auth/signup", payload);

    const { user: newUser, accessToken, refreshToken } = res.data;

    if (res.status === 200 || res.status === 201) {
      // ✅ Save user and tokens
      setUser(newUser);
      setAccessToken(accessToken);
      setRefreshToken(refreshToken);
      storeTokens(accessToken, refreshToken);
      localStorage.setItem("user", JSON.stringify(newUser));

      // ✅ Delete referral_id from localStorage after successful signup
      if (referralId) localStorage.removeItem("referral_id");
    }

    return true; // ✅ success
  } catch (err: any) {
    console.error("OTP Verification Error:", err);
    setError(err.response?.data?.message || "Server error.");
    throw err; // propagate error
  }
};


  // ✅ Login with phone + password
  const login = async (phone: string, password: string) => {
    setError(null);
    try {
      const res = await apiClient.post("/auth/login", { phone, password },{useAuth:false});
      const { user: loggedUser, accessToken, refreshToken } = res.data;

      setUser(loggedUser);
      setAccessToken(accessToken);
      setRefreshToken(refreshToken);
      storeTokens(accessToken, refreshToken);
      localStorage.setItem("user", JSON.stringify(loggedUser));

      router.push(redirectPath || "/profile");
      localStorage.removeItem("redirectPath");
    } catch (err: any) {
      console.error("Login Error:", err);
      setError(err.response?.data?.message || "Invalid credentials.");
    }
  };

  // ✅ Refresh access token manually
  const refreshAccessToken = useCallback(async (): Promise<boolean> => {
    const { refreshToken } = getTokens();
    if (!refreshToken) return false;

    try {
      const res = await apiClient.post("/auth/refresh", { refreshToken });
      const { accessToken } = res.data;

      if (accessToken) {
        setAccessToken(accessToken);
        storeAccessToken(accessToken);
        return true;
      }
      logout();
      return false;
    } catch (err) {
      console.error("Refresh Token Error:", err);
      logout();
      return false;
    }
  }, []);
  
const acceptAffiliate = async (): Promise<string | null> => {
  if (!user) throw new Error("User not logged in");

  try {
    const res = await axios.post("https://thegroome.com/backend/users/accept_affiliate", {
      userId: user.id,
    });

    if (res.status !== 200) throw new Error("Failed to accept affiliate");

    const { affiliate_code } = res.data;

    // Update user state & localStorage
    const updatedUser = {
      ...user,
      is_affiliate: true,
      affiliate_code,
    };
    setUser(updatedUser);
    localStorage.setItem("user", JSON.stringify(updatedUser));

    return affiliate_code; // return the code if needed
  } catch (err: any) {
    console.error("Accept Affiliate Error:", err);
    throw err;
  }
};
  // ✅ Logout
  const logout = useCallback(() => {
    setUser(null);
    setAccessToken(null);
    setRefreshToken(null);
    setRedirectPath(null);

    clearTokens();
    router.push("/auth");
  }, [router]);

  return (
    <AuthContext.Provider
      value={{
        user,
        accessToken,
        refreshToken,
        loading,
        error,
        verifyOtp,
        login,
        refreshAccessToken,
        logout,
        redirectPath,
        setRedirectPath,
         acceptAffiliate, // ✅ added here
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// ✅ Hook
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
};
