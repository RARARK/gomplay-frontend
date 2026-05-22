import { MaterialCommunityIcons } from "@expo/vector-icons";

type MCIconName = keyof typeof MaterialCommunityIcons.glyphMap;

const SPORT_ICON_MAP: Record<string, MCIconName> = {
  당구: "billiards-rack",
  야구: "baseball",
  볼링: "bowling",
  자전거: "bike",
  러닝: "run",
  런닝: "run",
  축구: "soccer",
  풋살: "soccer",
  테니스: "tennis-ball",
  등산: "hiking",
  농구: "basketball",
  배드민턴: "badminton",
  헬스: "dumbbell",
  수영: "swim",
  클라이밍: "terrain",
};

export function getSportIcon(sportType: string): MCIconName {
  return SPORT_ICON_MAP[sportType] ?? "dumbbell";
}
