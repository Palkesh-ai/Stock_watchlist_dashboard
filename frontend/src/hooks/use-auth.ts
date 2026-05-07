"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { authService } from "@/services/api/auth.service";
import { extractErrorMessage } from "@/services/api/client";
import { LoginPayload, SignupPayload } from "@/types/auth";
import { useAuthStore } from "@/stores/auth-store";

export function useAuth() {
  const router = useRouter();
  const user = useAuthStore((s) => s.user);
  const token = useAuthStore((s) => s.token);
  const isHydrated = useAuthStore((s) => s.isHydrated);
  const setAuth = useAuthStore((s) => s.setAuth);
  const clearAuth = useAuthStore((s) => s.logout);
  const [isLoginLoading, setIsLoginLoading] = useState(false);
  const [isSignupLoading, setIsSignupLoading] = useState(false);
  const [isLogoutLoading, setIsLogoutLoading] = useState(false);

  const login = async (payload: LoginPayload) => {
    setIsLoginLoading(true);
    try {
      const response = await authService.login(payload);
      setAuth(response.token, response.user);
      toast.success("Logged in successfully");
      router.push("/dashboard");
    } catch (error) {
      toast.error(extractErrorMessage(error));
      throw error;
    } finally {
      setIsLoginLoading(false);
    }
  };

  const signup = async (payload: SignupPayload) => {
    setIsSignupLoading(true);
    try {
      const response = await authService.signup(payload);
      setAuth(response.token, response.user);
      toast.success("Account created");
      router.push("/dashboard");
    } catch (error) {
      toast.error(extractErrorMessage(error));
      throw error;
    } finally {
      setIsSignupLoading(false);
    }
  };

  const logout = async () => {
    setIsLogoutLoading(true);
    try {
      clearAuth();
      toast.success("Logged out");
      router.push("/login");
    } catch (error) {
      toast.error(extractErrorMessage(error));
      throw error;
    } finally {
      setIsLogoutLoading(false);
    }
  };

  return {
    user,
    token,
    isHydrated,
    login,
    signup,
    logout,
    isLoginLoading,
    isSignupLoading,
    isLogoutLoading,
    isAuthenticated: Boolean(token)
  };
}
