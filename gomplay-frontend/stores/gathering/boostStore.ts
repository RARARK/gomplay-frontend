import { create } from "zustand";

const BOOST_DURATION_MS = 24 * 60 * 60 * 1000;

type BoostState = {
  boostedUntilById: Record<number, string>;
  getBoostExpiresAt: (gatheringId: number) => string | null;
  markBoosted: (gatheringId: number, expiresAt?: string) => string;
  clearExpired: () => void;
};

const isFuture = (value: string | null | undefined) => {
  if (!value) return false;
  return new Date(value).getTime() > Date.now();
};

export const useBoostStore = create<BoostState>((set, get) => ({
  boostedUntilById: {},
  getBoostExpiresAt: (gatheringId) => {
    const expiresAt = get().boostedUntilById[gatheringId];
    return isFuture(expiresAt) ? expiresAt : null;
  },
  markBoosted: (gatheringId, expiresAt) => {
    const nextExpiresAt =
      expiresAt ?? new Date(Date.now() + BOOST_DURATION_MS).toISOString();

    set((state) => ({
      boostedUntilById: {
        ...state.boostedUntilById,
        [gatheringId]: nextExpiresAt,
      },
    }));

    return nextExpiresAt;
  },
  clearExpired: () => {
    const boostedUntilById = get().boostedUntilById;
    const nextBoostedUntilById = Object.fromEntries(
      Object.entries(boostedUntilById).filter(([, expiresAt]) =>
        isFuture(expiresAt),
      ),
    ) as Record<number, string>;

    set({ boostedUntilById: nextBoostedUntilById });
  },
}));
