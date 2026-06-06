import { normalizeImageUrl } from "@/lib/utils/imageUrl";
import {
  SURVEY_EXERCISE_INTENSITY,
  SURVEY_PARTNER_STYLE,
  type Survey,
} from "@/types/domain/survey";
import type { DayOfWeek, UserProfile, UserTimetableRange } from "@/types/domain/user";
import type { PartnerCardProps } from "@/types/ui/homeCards";

const JS_DAY_TO_WEEKDAY: Record<number, DayOfWeek | null> = {
  0: null,
  1: "MON",
  2: "TUE",
  3: "WED",
  4: "THU",
  5: "FRI",
  6: null,
};

const TIMETABLE_START_MINUTES = 9 * 60;
const TIMETABLE_END_MINUTES = 18 * 60;

const normalizeClockTime = (value: string) => value.slice(0, 5);

const toMinutes = (value: string) => {
  const [hours = "0", minutes = "0"] = normalizeClockTime(value).split(":");
  return Number(hours) * 60 + Number(minutes);
};

const formatMinutes = (value: number) => {
  const hours = Math.floor(value / 60).toString().padStart(2, "0");
  const minutes = (value % 60).toString().padStart(2, "0");
  return `${hours}:${minutes}`;
};

const formatMinuteRange = (start: number, end: number) =>
  `${formatMinutes(start)} - ${formatMinutes(end)}`;

export const getCurrentFreeTimeLabel = (
  ranges: UserTimetableRange[],
  now = new Date(),
) => {
  const today = JS_DAY_TO_WEEKDAY[now.getDay()];
  if (!today) return "자유 시간";

  const rawNowMinutes = now.getHours() * 60 + now.getMinutes();
  if (rawNowMinutes >= TIMETABLE_END_MINUTES) return "자유 시간";

  const nowMinutes = Math.max(TIMETABLE_START_MINUTES, rawNowMinutes);
  const lectureRanges = ranges
    .filter((range) => range.dayOfWeek === today)
    .map((range) => ({
      start: Math.max(TIMETABLE_START_MINUTES, toMinutes(range.startTime)),
      end: Math.min(TIMETABLE_END_MINUTES, toMinutes(range.endTime)),
    }))
    .filter((range) => range.start < range.end)
    .sort((a, b) => a.start - b.start);

  const mergedLectures = lectureRanges.reduce<{ start: number; end: number }[]>(
    (merged, range) => {
      const previous = merged[merged.length - 1];
      if (!previous || previous.end < range.start) {
        merged.push({ ...range });
        return merged;
      }

      previous.end = Math.max(previous.end, range.end);
      return merged;
    },
    [],
  );

  const freeRanges: { start: number; end: number }[] = [];
  let cursor = TIMETABLE_START_MINUTES;

  mergedLectures.forEach((lecture) => {
    if (cursor < lecture.start) {
      freeRanges.push({ start: cursor, end: lecture.start });
    }
    cursor = Math.max(cursor, lecture.end);
  });

  if (cursor < TIMETABLE_END_MINUTES) {
    freeRanges.push({ start: cursor, end: TIMETABLE_END_MINUTES });
  }

  const current = freeRanges.find(
    (range) => range.start <= nowMinutes && nowMinutes < range.end,
  );
  if (current) return formatMinuteRange(nowMinutes, current.end);

  const upcoming = freeRanges.find((range) => nowMinutes < range.start);
  if (upcoming) return formatMinuteRange(upcoming.start, upcoming.end);

  return "오늘 공강 없음";
};

export const getPreferredPartnerLabel = (survey: Survey | null) => {
  if (!survey) return "함께 즐기는 파트너";
  if (survey.partnerStyle === SURVEY_PARTNER_STYLE.SOLO) {
    return "각자 집중하는 편";
  }
  return "함께 운동하는 편";
};

export const getExerciseStyleLabel = (survey: Survey | null) => {
  if (!survey) return "가볍게 즐겨요";

  switch (survey.exerciseIntensity) {
    case SURVEY_EXERCISE_INTENSITY.LIGHT:
      return "가볍게 즐겨요";
    case SURVEY_EXERCISE_INTENSITY.MODERATE:
      return "적당히 꾸준히";
    case SURVEY_EXERCISE_INTENSITY.INTENSE:
      return "제대로 몰입";
    case SURVEY_EXERCISE_INTENSITY.TO_THE_LIMIT:
      return "한계까지 도전";
    default:
      return survey.exerciseIntensity;
  }
};

const splitExerciseTypes = (value?: string) =>
  value
    ? value
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean)
    : undefined;

export const createNewCardPreviewPartners = ({
  basePartners,
  profile,
  survey,
  scheduleRanges,
}: {
  basePartners: PartnerCardProps[];
  profile: UserProfile | null;
  survey: Survey | null;
  scheduleRanges: UserTimetableRange[];
}) => {
  const imageUrl = normalizeImageUrl(profile?.profileImageUrl);
  const profileImageSource = imageUrl ? { uri: imageUrl } : undefined;
  const profileExerciseTypes = splitExerciseTypes(profile?.exerciseTypes);
  const freeTimeLabel = getCurrentFreeTimeLabel(scheduleRanges);
  const preferredPartnerLabel = getPreferredPartnerLabel(survey);
  const exerciseStyleLabel = getExerciseStyleLabel(survey);

  return basePartners.map((partner, index) =>
    index === 0
      ? {
          ...partner,
          profileImageSource: profileImageSource ?? partner.profileImageSource,
          name: profile?.name ?? partner.name,
          department: profile?.department ?? partner.department,
          studentId: profile?.studentId ?? partner.studentId,
          exerciseTypes: survey?.exerciseTypes ?? profileExerciseTypes ?? partner.exerciseTypes,
          description: profile?.bio ?? undefined,
          preferredPartnerLabel,
          exerciseStyleLabel,
          freeTimeLabel,
          matchScore: partner.matchScore ?? 87,
          matchInsight:
            partner.matchInsight ??
            "운동 스타일과 강도가 잘 맞고, 선호하는 종목도 겹쳐요. 함께라면 꾸준히 운동할 수 있을 거예요!",
        }
      : partner,
  );
};
