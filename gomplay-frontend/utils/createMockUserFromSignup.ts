import type { User } from "@/types/domain/user";

export type SignupUserSeed = {
  email: string;
  nickname: string;
  studentId: string;
};

const PROFILE_IMAGES = [
  "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=400&q=80",
  "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=400&q=80",
  "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80",
];

const TAG_POOL = [
  "풋살",
  "헬스",
  "러닝",
  "저녁 운동",
  "주 2회",
  "꾸준함",
  "초보 환영",
];

const DEPARTMENT_BY_EMAIL_DOMAIN: Record<string, string> = {
  "dankook.com": "소프트웨어학과",
  "gmail.com": "운동메이트 탐색중",
  "naver.com": "라이프스타일학과",
};

const getDeterministicIndex = (value: string, max: number) => {
  const seed = [...value].reduce((sum, char) => sum + char.charCodeAt(0), 0);
  return seed % max;
};

export const createMockUserFromSignup = ({
  email,
  nickname,
  studentId,
}: SignupUserSeed): User => {
  const trimmedEmail = email.trim();
  const trimmedNickname = nickname.trim() || trimmedEmail.split("@")[0] || "Gomplay User";
  const trimmedStudentId = studentId.trim();
  const emailDomain = trimmedEmail.split("@")[1] ?? "";
  const baseSeed = `${trimmedEmail}-${trimmedStudentId}-${trimmedNickname}`;
  const imageIndex = getDeterministicIndex(baseSeed, PROFILE_IMAGES.length);
  const tagStartIndex = getDeterministicIndex(baseSeed, TAG_POOL.length);
  const tags = [
    TAG_POOL[tagStartIndex],
    TAG_POOL[(tagStartIndex + 2) % TAG_POOL.length],
    TAG_POOL[(tagStartIndex + 4) % TAG_POOL.length],
  ];

  return {
    id: getDeterministicIndex(baseSeed, 100000) + 1,
    nickname: trimmedNickname,
    email: trimmedEmail,
    studentId: trimmedStudentId,
    profileImageUrl: PROFILE_IMAGES[imageIndex],
    mannerTemperature: 36.5 + (getDeterministicIndex(baseSeed, 15) / 10),
    department: DEPARTMENT_BY_EMAIL_DOMAIN[emailDomain] ?? "운동메이트 탐색중",
    bio: `${trimmedNickname}님을 위한 가상 프로필입니다. 함께 꾸준히 운동할 파트너를 찾고 있어요.`,
    tags,
    isVerified: true,
  };
};
