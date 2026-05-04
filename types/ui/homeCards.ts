import type { ImageSourcePropType } from "react-native";

export type PartnerCardProps = {
  imageSource?: ImageSourcePropType;
  profileImageSource?: ImageSourcePropType;
  name?: string;
  age?: number;
  department?: string;
  studentId?: string;
  description?: string;
  tags?: string[];
  matchScore?: number;
  rejectLabel?: string;
  acceptLabel?: string;
  width?: number;
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

export type ModernMatchCardProps = {
  imageSource?: ImageSourcePropType;
  date: string;
  dayOfWeek: string;
  sport: string;
  time: string;
  location: string;
  tags?: string[];
  difficulty?: string;
  currentParticipants?: number;
  maxParticipants?: number;
  onPress?: () => void;
};
