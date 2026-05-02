import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React from "react";
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import CreatePostChoiceModal from "@/components/matching/create-post/CreatePostChoiceModal";
import {
  CREATE_POST_DIFFICULTY_CHOICE_OPTIONS,
  CREATE_POST_DIFFICULTY_LABELS,
} from "@/components/matching/create-post/createPostConfig";
import CreatePostExerciseGridModal from "@/components/matching/create-post/CreatePostExerciseGridModal";
import {
  CREATE_POST_EXERCISE_GRID_OPTIONS,
  type CreatePostExerciseGridOption,
} from "@/components/matching/create-post/createPostExerciseOptions";
import PostCard from "@/components/matching/posts/PostCard";
import { getPosts } from "@/services/post/postService";
import type { Post, PostDifficulty } from "@/types/domain/post";

const ALL_FILTER_VALUE = "";

type DifficultyFilterValue = PostDifficulty | typeof ALL_FILTER_VALUE;
type DateFilterValue =
  | "today"
  | "tomorrow"
  | "thisWeek"
  | typeof ALL_FILTER_VALUE;
type TimeFilterValue =
  | "morning"
  | "afternoon"
  | "evening"
  | typeof ALL_FILTER_VALUE;

const EXERCISE_FILTER_OPTIONS: readonly CreatePostExerciseGridOption[] = [
  {
    value: ALL_FILTER_VALUE,
    label: "전체",
    icon: <Ionicons name="apps-outline" size={28} color="#4C5BE2" />,
  },
  ...CREATE_POST_EXERCISE_GRID_OPTIONS,
];

const DIFFICULTY_FILTER_OPTIONS: readonly {
  label: string;
  value: DifficultyFilterValue;
}[] = [
  { label: "전체", value: ALL_FILTER_VALUE },
  ...CREATE_POST_DIFFICULTY_CHOICE_OPTIONS,
];

const DATE_FILTER_OPTIONS: readonly {
  label: string;
  value: DateFilterValue;
}[] = [
  { label: "전체", value: ALL_FILTER_VALUE },
  { label: "오늘", value: "today" },
  { label: "내일", value: "tomorrow" },
  { label: "이번 주", value: "thisWeek" },
];

const TIME_FILTER_OPTIONS: readonly {
  label: string;
  value: TimeFilterValue;
}[] = [
  { label: "전체", value: ALL_FILTER_VALUE },
  { label: "오전", value: "morning" },
  { label: "오후", value: "afternoon" },
  { label: "저녁", value: "evening" },
];

const TIME_RANGES: Record<Exclude<TimeFilterValue, "">, [number, number]> = {
  morning: [6 * 60, 12 * 60],
  afternoon: [12 * 60, 18 * 60],
  evening: [18 * 60, 24 * 60],
};

const getStartOfDay = (date: Date) => {
  const nextDate = new Date(date);
  nextDate.setHours(0, 0, 0, 0);
  return nextDate;
};

const addDays = (date: Date, days: number) => {
  const nextDate = new Date(date);
  nextDate.setDate(nextDate.getDate() + days);
  return nextDate;
};

const isSameDay = (date: Date, targetDate: Date) =>
  getStartOfDay(date).getTime() === getStartOfDay(targetDate).getTime();

const isThisWeek = (date: Date, today: Date) => {
  const start = getStartOfDay(today);
  const end = addDays(start, 7 - start.getDay());
  end.setHours(23, 59, 59, 999);

  return date >= start && date <= end;
};

const getMinutesFromStartOfDay = (date: Date) =>
  date.getHours() * 60 + date.getMinutes();

const doesTimeRangeOverlap = (
  startAt: Date,
  endAt: Date,
  timeFilter: Exclude<TimeFilterValue, "">,
) => {
  const [filterStart, filterEnd] = TIME_RANGES[timeFilter];
  const postStart = getMinutesFromStartOfDay(startAt);
  let postEnd = getMinutesFromStartOfDay(endAt);

  if (postEnd <= postStart) {
    postEnd += 24 * 60;
  }

  return postStart < filterEnd && postEnd > filterStart;
};

const getLabelByValue = <T extends string>(
  options: readonly { label: string; value: T }[],
  value: T,
) => options.find((option) => option.value === value)?.label;

export default function PostListScreen() {
  const insets = useSafeAreaInsets();

  const [posts, setPosts] = React.useState<Post[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [selectedExerciseType, setSelectedExerciseType] =
    React.useState<string>(ALL_FILTER_VALUE);
  const [selectedDate, setSelectedDate] =
    React.useState<DateFilterValue>(ALL_FILTER_VALUE);
  const [selectedTime, setSelectedTime] =
    React.useState<TimeFilterValue>(ALL_FILTER_VALUE);
  const [selectedDifficulty, setSelectedDifficulty] =
    React.useState<DifficultyFilterValue>(ALL_FILTER_VALUE);
  const [isExerciseFilterVisible, setIsExerciseFilterVisible] =
    React.useState(false);
  const [isDateFilterVisible, setIsDateFilterVisible] = React.useState(false);
  const [isTimeFilterVisible, setIsTimeFilterVisible] = React.useState(false);
  const [isDifficultyFilterVisible, setIsDifficultyFilterVisible] =
    React.useState(false);

  const hasExerciseFilter = selectedExerciseType !== ALL_FILTER_VALUE;
  const hasDateFilter = selectedDate !== ALL_FILTER_VALUE;
  const hasTimeFilter = selectedTime !== ALL_FILTER_VALUE;
  const hasDifficultyFilter = selectedDifficulty !== ALL_FILTER_VALUE;

  const exerciseFilterLabel = hasExerciseFilter ? selectedExerciseType : "종목";
  const dateFilterLabel = hasDateFilter
    ? (getLabelByValue(DATE_FILTER_OPTIONS, selectedDate) ?? "날짜")
    : "날짜";
  const timeFilterLabel = hasTimeFilter
    ? (getLabelByValue(TIME_FILTER_OPTIONS, selectedTime) ?? "시간대")
    : "시간대";
  const difficultyFilterLabel = hasDifficultyFilter
    ? CREATE_POST_DIFFICULTY_LABELS[selectedDifficulty as PostDifficulty]
    : "난이도";

  const filteredPosts = React.useMemo(
    () =>
      posts.filter((post) => {
        const startAt = new Date(post.scheduledStartAt);
        const endAt = new Date(post.scheduledEndAt);

        if (Number.isNaN(startAt.getTime()) || Number.isNaN(endAt.getTime())) {
          return false;
        }

        if (hasExerciseFilter && post.exerciseType !== selectedExerciseType) {
          return false;
        }

        if (hasDateFilter) {
          const today = new Date();

          if (selectedDate === "today" && !isSameDay(startAt, today)) {
            return false;
          }

          if (
            selectedDate === "tomorrow" &&
            !isSameDay(startAt, addDays(today, 1))
          ) {
            return false;
          }

          if (selectedDate === "thisWeek" && !isThisWeek(startAt, today)) {
            return false;
          }
        }

        if (
          hasTimeFilter &&
          !doesTimeRangeOverlap(
            startAt,
            endAt,
            selectedTime as Exclude<TimeFilterValue, "">,
          )
        ) {
          return false;
        }

        if (hasDifficultyFilter && post.difficulty !== selectedDifficulty) {
          return false;
        }

        return true;
      }),
    [
      hasDateFilter,
      hasDifficultyFilter,
      hasExerciseFilter,
      hasTimeFilter,
      posts,
      selectedDate,
      selectedDifficulty,
      selectedExerciseType,
      selectedTime,
    ],
  );

  React.useEffect(() => {
    let isMounted = true;

    getPosts()
      .then((nextPosts) => {
        if (isMounted) {
          setPosts(nextPosts);
        }
      })
      .finally(() => {
        if (isMounted) {
          setIsLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <>
      <View style={styles.screen}>
        <View style={styles.header}>
          <Pressable
            accessibilityRole="button"
            onPress={() => router.back()}
            style={styles.backButton}
            hitSlop={10}
          >
            <Ionicons name="chevron-back" size={24} color="#070322" />
          </Pressable>

          <Text style={styles.title} numberOfLines={1}>추천 매칭 리스트</Text>

          <View style={styles.headerSpacer} />
        </View>

        <ScrollView
          horizontal
          bounces={false}
          overScrollMode="never"
          showsHorizontalScrollIndicator={false}
          style={styles.filterScrollView}
          contentContainerStyle={styles.filterBar}
        >
          <Pressable
            accessibilityRole="button"
            onPress={() => setIsExerciseFilterVisible(true)}
            style={[styles.filter, hasExerciseFilter && styles.filterActive]}
          >
            <Text
              numberOfLines={1}
              style={[
                styles.filterText,
                hasExerciseFilter && styles.filterTextActive,
              ]}
            >
              {exerciseFilterLabel}
            </Text>
            <Ionicons
              name={hasExerciseFilter ? "close" : "chevron-down"}
              size={14}
              color={hasExerciseFilter ? "#FFFFFF" : "#4C5BE2"}
            />
          </Pressable>

          <Pressable
            accessibilityRole="button"
            onPress={() => setIsDateFilterVisible(true)}
            style={[styles.filter, hasDateFilter && styles.filterActive]}
          >
            <Text
              numberOfLines={1}
              style={[
                styles.filterText,
                hasDateFilter && styles.filterTextActive,
              ]}
            >
              {dateFilterLabel}
            </Text>
            <Ionicons
              name={hasDateFilter ? "close" : "chevron-down"}
              size={14}
              color={hasDateFilter ? "#FFFFFF" : "#4C5BE2"}
            />
          </Pressable>

          <Pressable
            accessibilityRole="button"
            onPress={() => setIsTimeFilterVisible(true)}
            style={[styles.filter, hasTimeFilter && styles.filterActive]}
          >
            <Text
              numberOfLines={1}
              style={[
                styles.filterText,
                hasTimeFilter && styles.filterTextActive,
              ]}
            >
              {timeFilterLabel}
            </Text>
            <Ionicons
              name={hasTimeFilter ? "close" : "chevron-down"}
              size={14}
              color={hasTimeFilter ? "#FFFFFF" : "#4C5BE2"}
            />
          </Pressable>

          <Pressable
            accessibilityRole="button"
            onPress={() => setIsDifficultyFilterVisible(true)}
            style={[styles.filter, hasDifficultyFilter && styles.filterActive]}
          >
            <Text
              numberOfLines={1}
              style={[
                styles.filterText,
                hasDifficultyFilter && styles.filterTextActive,
              ]}
            >
              {difficultyFilterLabel}
            </Text>
            <Ionicons
              name={hasDifficultyFilter ? "close" : "chevron-down"}
              size={14}
              color={hasDifficultyFilter ? "#FFFFFF" : "#4C5BE2"}
            />
          </Pressable>
        </ScrollView>

        {isLoading ? (
          <View style={styles.stateBox}>
            <ActivityIndicator color="#4C5BE2" />
          </View>
        ) : filteredPosts.length > 0 ? (
          <ScrollView
            style={styles.listScrollView}
            contentContainerStyle={[styles.listContent, { paddingBottom: 88 + insets.bottom }]}
            showsVerticalScrollIndicator={false}
          >
            {filteredPosts.map((post) => (
              <PostCard
                key={post.id}
                post={post}
                onPress={() => router.push(`/posts/${post.id}`)}
              />
            ))}
          </ScrollView>
        ) : (
          <View style={styles.stateBox}>
            <Text style={styles.emptyTitle}>조건에 맞는 모집글이 없어요</Text>
            <Text style={styles.emptyText}>필터를 바꿔 다시 확인해보세요.</Text>
          </View>
        )}

        <Pressable
          accessibilityRole="button"
          onPress={() => router.push("/posts/create")}
          style={[styles.fab, { bottom: 20 + insets.bottom }]}
        >
          <Ionicons name="pencil" size={18} color="#FFFFFF" />
          <Text style={styles.fabText}>모집하기</Text>
        </Pressable>
      </View>

      <CreatePostExerciseGridModal
        visible={isExerciseFilterVisible}
        title="운동 종목 필터"
        options={EXERCISE_FILTER_OPTIONS}
        selectedValue={selectedExerciseType}
        onClose={() => setIsExerciseFilterVisible(false)}
        onSelect={setSelectedExerciseType}
      />

      <CreatePostChoiceModal<DateFilterValue>
        visible={isDateFilterVisible}
        title="날짜 필터"
        options={DATE_FILTER_OPTIONS}
        selectedValue={selectedDate}
        onClose={() => setIsDateFilterVisible(false)}
        onSelect={setSelectedDate}
      />

      <CreatePostChoiceModal<TimeFilterValue>
        visible={isTimeFilterVisible}
        title="시간대 필터"
        options={TIME_FILTER_OPTIONS}
        selectedValue={selectedTime}
        onClose={() => setIsTimeFilterVisible(false)}
        onSelect={setSelectedTime}
      />

      <CreatePostChoiceModal<DifficultyFilterValue>
        visible={isDifficultyFilterVisible}
        title="난이도 필터"
        options={DIFFICULTY_FILTER_OPTIONS}
        selectedValue={selectedDifficulty}
        onClose={() => setIsDifficultyFilterVisible(false)}
        onSelect={setSelectedDifficulty}
      />
    </>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 16,
    paddingTop: 18,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 16,
    position: "relative",
  },
  backButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
  },
  headerSpacer: {
    width: 36,
    height: 36,
  },
  title: {
    flex: 1,
    fontSize: 20,
    lineHeight: 28,
    color: "#070322",
    fontWeight: "900",
    textAlign: "center",
  },
  filterScrollView: {
    flexGrow: 0,
    marginHorizontal: -16,
    marginBottom: 14,
  },
  filterBar: {
    flexDirection: "row",
    gap: 8,
    paddingHorizontal: 16,
  },
  filter: {
    minHeight: 30,
    maxWidth: 116,
    minWidth: 80,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 4,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: "#4C5BE2",
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 11,
  },
  filterActive: {
    backgroundColor: "#4C5BE2",
  },
  filterText: {
    flexShrink: 1,
    fontSize: 12,
    lineHeight: 16,
    color: "#070322",
    fontWeight: "700",
  },
  filterTextActive: {
    color: "#FFFFFF",
  },
  listScrollView: {
    flex: 1,
  },
  listContent: {
    gap: 12,
  },
  stateBox: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  emptyTitle: {
    fontSize: 17,
    lineHeight: 22,
    color: "#070322",
    fontWeight: "800",
  },
  emptyText: {
    fontSize: 14,
    lineHeight: 20,
    color: "#5C5A63",
    fontWeight: "600",
  },
  fab: {
    position: "absolute",
    right: 18,
    minHeight: 48,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    borderRadius: 999,
    backgroundColor: "#4C5BE2",
    paddingHorizontal: 18,
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.18,
    shadowRadius: 8,
    elevation: 6,
  },
  fabText: {
    fontSize: 14,
    lineHeight: 18,
    color: "#FFFFFF",
    fontWeight: "800",
  },
});
