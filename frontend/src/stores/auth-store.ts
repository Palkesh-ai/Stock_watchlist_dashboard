"use client";

import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { AUTH_STORAGE_KEY } from "@/lib/storage";
import { User } from "@/types/auth";

type AuthState = {
  token: string | null;
  user: User | null;
  isHydrated: boolean;
  setAuth: (token: string, user: User) => void;
  logout: () => void;
  setHydrated: (state: boolean) => void;
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      user: null,
      isHydrated: false,
      setAuth: (token, user) => set({ token, user }),
      logout: () => set({ token: null, user: null }),
      setHydrated: (isHydrated) => set({ isHydrated })
    }),
    {
      name: AUTH_STORAGE_KEY,
      storage: createJSONStorage(() => localStorage),
      onRehydrateStorage: () => (state) => {
        state?.setHydrated(true);
      }
    }
  )
);
