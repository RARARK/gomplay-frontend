import { create } from "zustand";
import type { User } from "@/types/domain/user";

type AuthState = {
  user: User | null;
  isLoggedIn: boolean;

  setUser: (user: User | null) => void;
  clearUser: () => void;
};

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isLoggedIn: false,

  setUser: (user) =>
    set({
      user,
      isLoggedIn: !!user,
    }),

  clearUser: () =>
    set({
      user: null,
      isLoggedIn: false,
    }),
}));
