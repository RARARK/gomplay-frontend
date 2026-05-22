import { create } from "zustand";

const BOOST_DURATION_MS = 24 * 60 * 60 * 1000;

type BoostState = {
  boostedEverById: Record<number, boolean>;
  boostedUntilById: Record<number, string>;
  getBoostExpiresAt: (gatheringId: number) => string | null;
  hasBoosted: (gatheringId: number) => boolean;
  markBoosted: (gatheringId: number, expiresAt?: string) => string;
  clearExpired: () => void;
};

const isFuture = (value: string | null | undefined) => {
  if (!value) return false;
  return new Date(value).getTime() > Date.now();
};

export const useBoostStore = create<BoostState>((set, get) => ({
  boostedEverById: {},
  boostedUntilById: {},
  getBoostExpiresAt: (gatheringId) => {
    const expiresAt = get().boostedUntilById[gatheringId];
    return isFuture(expiresAt) ? expiresAt : null;
  },
  hasBoosted: (gatheringId) => Boolean(get().boostedEverById[gatheringId]),
  markBoosted: (gatheringId, expiresAt) => {
    const nextExpiresAt =
      expiresAt ?? new Date(Date.now() + BOOST_DURATION_MS).toISOString();

    set((state) => ({
      boostedEverById: {
        ...state.boostedEverById,
        [gatheringId]: true,
      },
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
