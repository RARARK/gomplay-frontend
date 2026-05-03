import type {
  PartnerCardProps,
  RecommendationMatchCardProps,
} from "@/types/ui/homeCards";
import type { Banner } from "@/types/ui/homeBanner";

export const homeBanners: Banner[] = [
  {
    id: "banner-1",
    image: require("../../../assets/home/HeroBanner.png"),
    text: "Just do it!",
  },
  {
    id: "banner-2",
    image: require("../../../assets/home/adaptive-icon.png"),
    text: "Weekly Fitness Champion",
  },
  {
    id: "banner-3",
    image: require("../../../assets/home/icon.png"),
    text: "Sponsored: Protein Supplement",
  },
];

export const recommendationCards: RecommendationMatchCardProps[] = [
  {
    imageSource: require("../../../assets/home/Frame-1193.png"),
    date: "04-03",
    sport: "Tennis",
    info: "Jamsil Court\n14:00~15:30\nBeginner\n#Friendly #Weekend",
    buttonText: "Apply",
  },
  {
    imageSource: require("../../../assets/home/Frame-1193.png"),
    date: "04-04",
    sport: "Basketball",
    info: "Indoor Gym\n18:00~19:30\nIntermediate\n#TeamPlay #Evening",
    buttonText: "Apply",
  },
  {
    imageSource: require("../../../assets/home/Frame-1193.png"),
    date: "04-05",
    sport: "Futsal",
    info: "Riverside Park\n20:00~21:00\nBeginner\n#Active #Night",
    buttonText: "Apply",
  },
  {
    imageSource: require("../../../assets/home/Frame-1193.png"),
    date: "04-06",
    sport: "Badminton",
    info: "Community Hall\n19:00~20:30\nBeginner\n#Rally #AfterWork",
    buttonText: "Apply",
  },
  {
    imageSource: require("../../../assets/home/Frame-1193.png"),
    date: "04-07",
    sport: "Running",
    info: "Han River\n07:00~08:00\nAll Levels\n#Morning #PaceMate",
    buttonText: "Apply",
  },
  {
    imageSource: require("../../../assets/home/Frame-1193.png"),
    date: "04-08",
    sport: "Climbing",
    info: "Climbing Gym\n17:30~19:00\nIntermediate\n#Indoor #Challenge",
    buttonText: "Apply",
  },
];

export const matchedPartners: PartnerCardProps[] = [
  {
    name: "Minjun Kim",
    age: 21,
    description: "Looking for a light weekend morning workout partner",
    tags: ["테니스", "배드민턴", "농구", "가볍게", "같이", "스트레스"],
    matchScore: 87,
  },
  {
    name: "Seoyoon Lee",
    age: 24,
    description: "Best matched for weekday evening rallies and steady play",
    tags: ["배드민턴", "헬스", "수영", "적당히", "각자", "체력"],
    matchScore: 82,
  },
  {
    name: "Jiwon Park",
    age: 23,
    description:
      "Prefers active weekend sessions and consistent cardio routines",
    tags: ["러닝", "사이클", "축구", "제대로", "같이", "경쟁"],
    matchScore: 79,
  },
];
