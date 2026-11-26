import { create } from "zustand";

import { useScreenCacheStore } from "@/stores/cache/screenCacheStore";
import { useMatchingStore } from "@/stores/matching/matchingStore";
import { useUserStore } from "@/stores/user/userStore";

type AuthState = {
  userId: number | null;
  isLoggedIn: boolean;
  accessToken: string | null;
  refreshToken: string | null;
  matching: boolean;
  pendingCredentials: { schoolEmail: string; password: string } | null;
  pendingProfileImageUri: string | null;

  setAuth: (params: {
    userId: number;
    accessToken: string;
    refreshToken: string;
    matching: boolean;
  }) => void;
  setMatching: (value: boolean) => void;
  clearAuth: () => void;
  getAuthorizationHeader: () => string | null;
  setPendingCredentials: (creds: { schoolEmail: string; password: string } | null) => void;
  setPendingProfileImageUri: (uri: string | null) => void;
};

export const useAuthStore = create<AuthState>((set, get) => ({
  userId: null,
  isLoggedIn: false,
  accessToken: null,
  refreshToken: null,
  matching: false,
  pendingCredentials: null,
  pendingProfileImageUri: null,

  setAuth: ({ userId, accessToken, refreshToken, matching }) =>
    set({ userId, isLoggedIn: true, accessToken, refreshToken, matching }),

  setMatching: (value) => set({ matching: value }),

  clearAuth: () => {
    useUserStore.getState().clearProfile();
    useScreenCacheStore.getState().clearAll();
    // 후보 카드/버퍼/본 사람 목록 등을 비운다. 안 비우면 같은 앱에서 다른 계정으로
    // 로그인했을 때 이전 계정의 후보 카드가 남고, 스킵 시 후보가 일찍 바닥난다.
    useMatchingStore.getState().clearMatchingState();
    set({
      userId: null,
      isLoggedIn: false,
      accessToken: null,
      refreshToken: null,
      matching: false,
    });
  },

  getAuthorizationHeader: () => {
    const token = get().accessToken;
    return token ? `Bearer ${token}` : null;
  },

  setPendingCredentials: (creds) => set({ pendingCredentials: creds }),
  setPendingProfileImageUri: (uri) => set({ pendingProfileImageUri: uri }),
}));
