import { create } from "zustand";

type AuthState = {
  userId: number | null;
  isLoggedIn: boolean;
  accessToken: string | null;
  refreshToken: string | null;
  matching: boolean;
  pendingCredentials: { schoolEmail: string; password: string } | null;

  setAuth: (params: {
    userId: number;
    accessToken: string;
    refreshToken: string;
    matching: boolean;
  }) => void;
  clearAuth: () => void;
  getAuthorizationHeader: () => string | null;
  setPendingCredentials: (creds: { schoolEmail: string; password: string } | null) => void;
};

export const useAuthStore = create<AuthState>((set, get) => ({
  userId: null,
  isLoggedIn: false,
  accessToken: null,
  refreshToken: null,
  matching: false,
  pendingCredentials: null,

  setAuth: ({ userId, accessToken, refreshToken, matching }) =>
    set({
      userId,
      isLoggedIn: true,
      accessToken,
      refreshToken,
      matching,
    }),

  clearAuth: () =>
    set({
      userId: null,
      isLoggedIn: false,
      accessToken: null,
      refreshToken: null,
      matching: false,
    }),

  getAuthorizationHeader: () => {
    const token = get().accessToken;
    return token ? `Bearer ${token}` : null;
  },

  setPendingCredentials: (creds) => set({ pendingCredentials: creds }),
}));
