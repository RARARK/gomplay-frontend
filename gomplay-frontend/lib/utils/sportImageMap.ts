import type { AppImageSource } from "@/types/ui/image";

const SPORT_IMAGE_MAP: Record<string, AppImageSource> = {
  당구: require("@/assets/sports/당구.jpg"),
  야구: require("@/assets/sports/야구.jpg"),
  볼링: require("@/assets/sports/볼링.jpg"),
  자전거: require("@/assets/sports/자전거.jpg"),
  // 글 작성 종목은 "런닝"(설문·백엔드와 통일), 예전 글은 "러닝"이라 둘 다 같은 사진을 쓴다
  런닝: require("@/assets/sports/러닝.jpg"),
  러닝: require("@/assets/sports/러닝.jpg"),
  축구: require("@/assets/sports/축구.jpg"),
  풋살: require("@/assets/sports/풋살.jpg"),
  테니스: require("@/assets/sports/테니스.jpg"),
  등산: require("@/assets/sports/등산.jpg"),
  농구: require("@/assets/sports/농구.jpg"),
  배드민턴: require("@/assets/sports/베드민턴.jpg"),
  헬스: require("@/assets/sports/헬스.jpg"),
};

export function getSportImage(sportType: string): AppImageSource | undefined {
  return SPORT_IMAGE_MAP[sportType];
}
