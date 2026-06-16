import { router } from "expo-router";

import type { Banner } from "@/types/ui/homeBanner";

export const homeBanners: Banner[] = [
  {
    id: "banner-hero",
    image: require("../../../assets/home/herobannermain.png"),
    onPress: () => router.push("/posts" as any),
  },
  {
    id: "banner-daily-check",
    image: require("../../../assets/home/herobanner_dailycheck.jpg"),
    onPress: () => router.push("/attendance" as any),
  },
];
