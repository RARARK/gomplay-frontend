import type {
  GroupMatchCardProps,
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

export const groupCards: GroupMatchCardProps[] = [
  {
    id: "group-1",
    imageSource: require("../../../assets/home/Frame-1200.png"),
    remainingText: "3 spots left",
    sport: "Tennis",
    date: "04-11",
    location: "Jamsil",
    capacity: "4 people",
    level: "Beginner",
  },
  {
    id: "group-2",
    imageSource: require("../../../assets/home/Frame-1200.png"),
    remainingText: "2 spots left",
    sport: "Basketball",
    date: "04-12",
    location: "Indoor Gym",
    capacity: "6 people",
    level: "Intermediate",
  },
  {
    id: "group-3",
    imageSource: require("../../../assets/home/Frame-1200.png"),
    remainingText: "1 spot left",
    sport: "Badminton",
    date: "04-13",
    location: "Sports Center",
    capacity: "4 people",
    level: "Beginner",
  },
];

export const matchedPartners: PartnerCardProps[] = [
  {
    name: "Minjun Kim",
    age: 21,
    description: "Looking for a light weekend morning workout partner",
    tags: ["Tennis", "Beginner", "Jamsil", "Fair Play"],
    matchScore: 87,
  },
  {
    name: "Seoyoon Lee",
    age: 24,
    description: "Best matched for weekday evening rallies and steady play",
    tags: ["Badminton", "Intermediate", "Gangnam", "After Work"],
    matchScore: 82,
  },
  {
    name: "Jiwon Park",
    age: 23,
    description:
      "Prefers active weekend sessions and consistent cardio routines",
    tags: ["Running", "All Levels", "Han River", "Morning"],
    matchScore: 79,
  },
];
