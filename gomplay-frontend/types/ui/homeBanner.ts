import type { AppImageSource } from "@/types/ui/image";

export type Banner = {
  id: string;
  image: AppImageSource;
  tag?: string;
  text?: string;
  buttonLabel?: string;
  onPress?: () => void;
  isAd?: boolean;
};
