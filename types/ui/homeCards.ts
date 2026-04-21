import type { ImageSourcePropType } from "react-native";

export type PartnerCardProps = {
  imageSource?: ImageSourcePropType;
  profileImageSource?: ImageSourcePropType;
  name?: string;
  age?: number;
  description?: string;
  tags?: string[];
  matchScore?: number;
  rejectLabel?: string;
  acceptLabel?: string;
  onReject?: () => void;
  onAccept?: () => void;
};

export type RecommendationMatchCardProps = {
  imageSource?: ImageSourcePropType;
  date?: string;
  sport?: string;
  info?: string;
  buttonText?: string;
  onPress?: () => void;
};

export type GroupMatchCardProps = {
  id?: string;
  imageSource?: ImageSourcePropType;
  remainingText?: string;
  sport?: string;
  date?: string;
  location?: string;
  capacity?: string;
  level?: string;
};
