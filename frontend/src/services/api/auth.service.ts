import { apiClient } from "./client";
import { AuthResponse, LoginPayload, SignupPayload, User } from "@/types/auth";

interface ApiEnvelope<T> {
  success: boolean;
  data: T;
}

export const authService = {
  async signup(payload: SignupPayload): Promise<AuthResponse> {
    const { data } = await apiClient.post<ApiEnvelope<AuthResponse>>("/api/auth/signup", payload);
    return data.data;
  },

  async login(payload: LoginPayload): Promise<AuthResponse> {
    const { data } = await apiClient.post<ApiEnvelope<AuthResponse>>("/api/auth/login", payload);
    return data.data;
  },

  async getMe(): Promise<User> {
    const { data } = await apiClient.get<ApiEnvelope<{ user: User }>>("/api/auth/me");
    return data.data.user;
  },
};
