import type {
  ModernMatchCardProps,
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

export const modernRecommendationCards: ModernMatchCardProps[] = [
  {
    imageSource: require("../../../assets/home/Frame-1193.png"),
    date: "04.03",
    dayOfWeek: "THU",
    sport: "Tennis",
    time: "14:00 ~ 15:30",
    location: "Jamsil Court",
    tags: ["#Friendly", "#Weekend"],
    difficulty: "Beginner",
    currentParticipants: 3,
    maxParticipants: 6,
  },
  {
    imageSource: require("../../../assets/home/Frame-1193.png"),
    date: "04.04",
    dayOfWeek: "FRI",
    sport: "Basketball",
    time: "18:00 ~ 19:30",
    location: "Indoor Gym",
    tags: ["#TeamPlay", "#Evening"],
    difficulty: "Intermediate",
    currentParticipants: 4,
    maxParticipants: 8,
  },
  {
    imageSource: require("../../../assets/home/Frame-1193.png"),
    date: "04.05",
    dayOfWeek: "SAT",
    sport: "Football",
    time: "20:00 ~ 21:00",
    location: "Riverside Park",
    tags: ["#Active", "#Night"],
    difficulty: "Beginner",
    currentParticipants: 6,
    maxParticipants: 10,
  },
  {
    imageSource: require("../../../assets/home/Frame-1193.png"),
    date: "04.06",
    dayOfWeek: "SUN",
    sport: "Badminton",
    time: "19:00 ~ 20:30",
    location: "Community Hall",
    tags: ["#Rally", "#AfterWork"],
    difficulty: "Beginner",
    currentParticipants: 2,
    maxParticipants: 4,
  },
  {
    imageSource: require("../../../assets/home/Frame-1193.png"),
    date: "04.07",
    dayOfWeek: "MON",
    sport: "Running",
    time: "07:00 ~ 08:00",
    location: "Han River",
    tags: ["#Morning", "#PaceMate"],
    difficulty: "All Levels",
    currentParticipants: 5,
    maxParticipants: 12,
  },
];

export const matchedPartners: PartnerCardProps[] = [
  {
    name: "Minjun Kim",
    age: 21,
    department: "컴퓨터공학과",
    studentId: "22학번",
    description: "Looking for a light weekend morning workout partner",
    tags: ["테니스", "배드민턴", "농구", "가볍게", "같이", "스트레스"],
    matchScore: 87,
  },
  {
    name: "Seoyoon Lee",
    age: 24,
    department: "경영학과",
    studentId: "21학번",
    description: "Best matched for weekday evening rallies and steady play",
    tags: ["배드민턴", "헬스", "수영", "적당히", "각자", "체력"],
    matchScore: 82,
  },
  {
    name: "Jiwon Park",
    age: 23,
    department: "체육교육과",
    studentId: "23학번",
    description:
      "Prefers active weekend sessions and consistent cardio routines",
    tags: ["러닝", "사이클", "축구", "제대로", "같이", "경쟁"],
    matchScore: 79,
  },
];
