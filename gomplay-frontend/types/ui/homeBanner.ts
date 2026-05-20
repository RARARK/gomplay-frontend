import type { ImageSourcePropType } from "react-native";

export type Banner = {
  id: string;
  image: ImageSourcePropType;
  tag?: string;
  text?: string;
  buttonLabel?: string;
  onPress?: () => void;
  isAd?: boolean;
};
