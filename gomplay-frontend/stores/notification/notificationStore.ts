import { create } from "zustand";

type NotificationState = {
  unreadCount: number;
  setUnreadCount: (count: number) => void;
  clearUnread: () => void;
};

export const useNotificationStore = create<NotificationState>((set) => ({
  unreadCount: 0,
  setUnreadCount: (count) => set({ unreadCount: count }),
  clearUnread: () => set({ unreadCount: 0 }),
}));
