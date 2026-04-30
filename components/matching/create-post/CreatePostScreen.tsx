import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

import MatchRunIcon from "@/assets/match/fluent-run-16-filled.svg";
import MatchDifficultyIcon from "@/assets/match/heroicons-chart-bar-16-solid.svg";
import CreatePostCalendarModal from "@/components/matching/create-post/CreatePostCalendarModal";
import CreatePostCapacitySelector from "@/components/matching/create-post/CreatePostCapacitySelector";
import CreatePostChoiceModal from "@/components/matching/create-post/CreatePostChoiceModal";
import {
  CREATE_POST_DEFAULT_LOCATION,
  CREATE_POST_DIFFICULTY_CHOICE_OPTIONS,
  CREATE_POST_DIFFICULTY_LABELS,
  CREATE_POST_EXERCISE_OPTIONS,
  CREATE_POST_MAX_TAG_SELECTION,
  CREATE_POST_RECOMMENDED_LOCATION,
  CREATE_POST_TAG_OPTIONS,
  CREATE_POST_TITLE,
  CREATE_POST_USE_CURRENT_LOCATION,
  type CreatePostFormState,
} from "@/components/matching/create-post/createPostConfig";
import CreatePostDetailCard from "@/components/matching/create-post/CreatePostDetailCard";
import CreatePostExerciseGridModal from "@/components/matching/create-post/CreatePostExerciseGridModal";
import { CREATE_POST_EXERCISE_GRID_OPTIONS } from "@/components/matching/create-post/createPostExerciseOptions";
import CreatePostLocationCard from "@/components/matching/create-post/CreatePostLocationCard";
import CreatePostTagSelector from "@/components/matching/create-post/CreatePostTagSelector";
import CreatePostTimeRangeModal from "@/components/matching/create-post/CreatePostTimeRangeModal";
import {
  applyDateStringToRange,
  applyTimePartsToRange,
  formatCreatePostDayLabel,
  formatCreatePostTimeRangeLabel,
  getNextValue,
  getRoundedFutureDate,
} from "@/components/matching/create-post/createPostUtils";
import { createPost } from "@/services/post/postService";
import { POST_DIFFICULTY, type CreatePostInput } from "@/types/domain/post";
import { validateCreatePostInput } from "@/utils/validateCreatePost";

const DIFFICULTY_OPTIONS = Object.values(POST_DIFFICULTY);

const createInitialFormState = (): CreatePostFormState => ({
  title: "",
  exerciseType: CREATE_POST_EXERCISE_OPTIONS[0],
  location: CREATE_POST_DEFAULT_LOCATION,
  scheduledStartAt: getRoundedFutureDate(1),
  scheduledEndAt: getRoundedFutureDate(3),
  capacity: 1,
  message: "",
  difficulty: POST_DIFFICULTY.BEGINNER,
});

export default function CreatePostScreen() {
  const [form, setForm] = React.useState<CreatePostFormState>(
    createInitialFormState,
  );
  const [selectedTags, setSelectedTags] = React.useState<string[]>([]);
  const [isTagSelectorExpanded, setIsTagSelectorExpanded] =
    React.useState(false);
  const [isDatePickerVisible, setIsDatePickerVisible] = React.useState(false);
  const [isTimePickerVisible, setIsTimePickerVisible] = React.useState(false);
  const [isDifficultyPickerVisible, setIsDifficultyPickerVisible] =
    React.useState(false);
  const [isExercisePickerVisible, setIsExercisePickerVisible] =
    React.useState(false);
  const [hasSubmitted, setHasSubmitted] = React.useState(false);
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const payload = React.useMemo<CreatePostInput>(
    () => ({
      title: form.title.trim() || undefined,
      exerciseType: form.exerciseType,
      location: form.location.trim(),
      scheduledStartAt: form.scheduledStartAt.toISOString(),
      scheduledEndAt: form.scheduledEndAt.toISOString(),
      capacity: form.capacity,
      message: form.message.trim() || undefined,
      difficulty: form.difficulty,
      tags: selectedTags.length > 0 ? selectedTags : undefined,
    }),
    [form, selectedTags],
  );

  const validationErrors = React.useMemo(
    () => validateCreatePostInput(payload),
    [payload],
  );
  const visibleErrors = hasSubmitted ? validationErrors : {};
  const isSubmitDisabled =
    isSubmitting || Object.keys(validationErrors).length > 0;

  const selectedDateString = React.useMemo(() => {
    const year = form.scheduledStartAt.getFullYear();
    const month = `${form.scheduledStartAt.getMonth() + 1}`.padStart(2, "0");
    const day = `${form.scheduledStartAt.getDate()}`.padStart(2, "0");

    return `${year}-${month}-${day}`;
  }, [form.scheduledStartAt]);

  const minDateString = React.useMemo(() => {
    const currentDate = new Date();
    const year = currentDate.getFullYear();
    const month = `${currentDate.getMonth() + 1}`.padStart(2, "0");
    const day = `${currentDate.getDate()}`.padStart(2, "0");

    return `${year}-${month}-${day}`;
  }, []);

  const updateForm = React.useCallback(
    <K extends keyof CreatePostFormState>(
      key: K,
      value: CreatePostFormState[K],
    ) => {
      setForm((current) => ({
        ...current,
        [key]: value,
      }));
    },
    [],
  );

  const handleToggleTag = (tag: string) => {
    setSelectedTags((current) => {
      if (current.includes(tag)) {
        return current.filter((item) => item !== tag);
      }

      if (current.length >= CREATE_POST_MAX_TAG_SELECTION) {
        return current;
      }

      return [...current, tag];
    });
  };

  const handleSelectDate = (dateString: string) => {
    const { nextStartAt, nextEndAt } = applyDateStringToRange(
      form.scheduledStartAt,
      form.scheduledEndAt,
      dateString,
    );

    setForm((current) => ({
      ...current,
      scheduledStartAt: nextStartAt,
      scheduledEndAt: nextEndAt,
    }));
  };

  const handleConfirmTimeRange = (
    startHour: number,
    startMinute: number,
    endHour: number,
    endMinute: number,
  ) => {
    const { nextStartAt, nextEndAt } = applyTimePartsToRange(
      form.scheduledStartAt,
      form.scheduledEndAt,
      startHour,
      startMinute,
      endHour,
      endMinute,
    );

    setForm((current) => ({
      ...current,
      scheduledStartAt: nextStartAt,
      scheduledEndAt: nextEndAt,
    }));
  };

  const handleSubmit = async () => {
    setHasSubmitted(true);

    if (Object.keys(validationErrors).length > 0) {
      return;
    }

    setIsSubmitting(true);

    try {
      const result = await createPost(payload);

      Alert.alert(
        "모집글이 등록되었어요",
        `모집글 #${result.postId}가 생성되었습니다.`,
        [
          {
            text: "확인",
            onPress: () => router.replace("/(tabs)/match"),
          },
        ],
      );
    } catch (error) {
      Alert.alert(
        "등록에 실패했어요",
        error instanceof Error ? error.message : "잠시 후 다시 시도해주세요.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={styles.keyboardAvoidingView}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.headerRow}>
            <Pressable
              accessibilityRole="button"
              onPress={() => router.back()}
              style={styles.backButton}
            >
              <Ionicons name="chevron-back" size={28} color="#111111" />
            </Pressable>

            <Text style={styles.headerTitle}>{CREATE_POST_TITLE}</Text>
            <View style={styles.headerSpacer} />
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionLabel}>제목</Text>
            <TextInput
              onChangeText={(value) => updateForm("title", value)}
              placeholder="제목: 같이 운동하실 분 구해요"
              placeholderTextColor="#8F95A1"
              style={styles.singleLineInput}
              value={form.title}
            />
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionLabel}>태그</Text>
            <CreatePostTagSelector
              options={CREATE_POST_TAG_OPTIONS}
              selectedTags={selectedTags}
              maxSelectable={CREATE_POST_MAX_TAG_SELECTION}
              isExpanded={isTagSelectorExpanded}
              onToggleExpanded={() =>
                setIsTagSelectorExpanded((current) => !current)
              }
              onToggleTag={handleToggleTag}
            />
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionLabel}>매칭 정보</Text>
            <View style={styles.detailGrid}>
              <CreatePostDetailCard
                icon={
                  <Ionicons name="calendar-outline" size={28} color="#111827" />
                }
                label="날짜"
                value={formatCreatePostDayLabel(form.scheduledStartAt)}
                onPress={() => setIsDatePickerVisible(true)}
              />
              <CreatePostDetailCard
                icon={<Ionicons name="time-outline" size={28} color="#111827" />}
                label="시간"
                value={formatCreatePostTimeRangeLabel(
                  form.scheduledStartAt,
                  form.scheduledEndAt,
                )}
                onPress={() => setIsTimePickerVisible(true)}
              />
              <CreatePostDetailCard
                icon={<MatchDifficultyIcon width={28} height={28} />}
                label="난이도"
                value={CREATE_POST_DIFFICULTY_LABELS[form.difficulty]}
                onPress={() => setIsDifficultyPickerVisible(true)}
              />
              <CreatePostDetailCard
                icon={<MatchRunIcon width={28} height={28} />}
                label="운동 종목"
                value={form.exerciseType}
                onPress={() => setIsExercisePickerVisible(true)}
              />
            </View>

            {visibleErrors.scheduledStartAt ? (
              <Text style={styles.errorText}>
                {visibleErrors.scheduledStartAt}
              </Text>
            ) : null}
            {!visibleErrors.scheduledStartAt && visibleErrors.scheduledEndAt ? (
              <Text style={styles.errorText}>{visibleErrors.scheduledEndAt}</Text>
            ) : null}
            {visibleErrors.difficulty ? (
              <Text style={styles.errorText}>{visibleErrors.difficulty}</Text>
            ) : null}
            {visibleErrors.exerciseType ? (
              <Text style={styles.errorText}>{visibleErrors.exerciseType}</Text>
            ) : null}
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionLabel}>장소</Text>
            <CreatePostLocationCard
              location={form.location}
              onRecommendNearby={() =>
                updateForm("location", CREATE_POST_RECOMMENDED_LOCATION)
              }
              onUseCurrentLocation={() =>
                updateForm("location", CREATE_POST_USE_CURRENT_LOCATION)
              }
            />
            <TextInput
              onChangeText={(value) => updateForm("location", value)}
              placeholder="운동 장소를 입력해주세요"
              placeholderTextColor="#8F95A1"
              style={styles.singleLineInput}
              value={form.location}
            />
            {visibleErrors.location ? (
              <Text style={styles.errorText}>{visibleErrors.location}</Text>
            ) : null}
          </View>

          <View style={styles.section}>
            <CreatePostCapacitySelector
              value={form.capacity}
              onChange={(value) => updateForm("capacity", value)}
            />
            {visibleErrors.capacity ? (
              <Text style={styles.errorText}>{visibleErrors.capacity}</Text>
            ) : null}
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionLabel}>추가 설명</Text>
            <TextInput
              multiline
              numberOfLines={5}
              onChangeText={(value) => updateForm("message", value)}
              placeholder="예: 초보도 환영하고, 1시간 정도 가볍게 같이 뛰실 분 찾아요."
              placeholderTextColor="#8F95A1"
              style={styles.messageInput}
              textAlignVertical="top"
              value={form.message}
            />
          </View>

          <Pressable
            accessibilityRole="button"
            disabled={isSubmitDisabled}
            onPress={handleSubmit}
            style={[
              styles.submitButton,
              isSubmitDisabled && styles.submitButtonDisabled,
            ]}
          >
            <Text style={styles.submitButtonText}>
              {isSubmitting ? "등록 중..." : "매칭 등록"}
            </Text>
          </Pressable>
        </ScrollView>
      </KeyboardAvoidingView>

      <CreatePostCalendarModal
        visible={isDatePickerVisible}
        selectedDate={selectedDateString}
        minDate={minDateString}
        onClose={() => setIsDatePickerVisible(false)}
        onSelectDate={handleSelectDate}
      />

      <CreatePostTimeRangeModal
        visible={isTimePickerVisible}
        startAt={form.scheduledStartAt}
        endAt={form.scheduledEndAt}
        onClose={() => setIsTimePickerVisible(false)}
        onConfirm={handleConfirmTimeRange}
      />

      <CreatePostChoiceModal
        visible={isDifficultyPickerVisible}
        title="운동 난이도 선택"
        options={CREATE_POST_DIFFICULTY_CHOICE_OPTIONS}
        selectedValue={form.difficulty}
        onClose={() => setIsDifficultyPickerVisible(false)}
        onSelect={(value) => updateForm("difficulty", value)}
      />

      <CreatePostExerciseGridModal
        visible={isExercisePickerVisible}
        title="운동 종목 선택"
        options={CREATE_POST_EXERCISE_GRID_OPTIONS}
        selectedValue={form.exerciseType}
        onClose={() => setIsExercisePickerVisible(false)}
        onSelect={(value) => updateForm("exerciseType", value)}
      />
    </>
  );
}

const styles = StyleSheet.create({
  keyboardAvoidingView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 28,
    gap: 18,
    backgroundColor: "#FFFFFF",
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 999,
    alignItems: "center",
    justifyContent: "center",
  },
  headerTitle: {
    fontSize: 20,
    lineHeight: 28,
    color: "#111827",
    fontWeight: "800",
  },
  headerSpacer: {
    width: 40,
  },
  section: {
    gap: 10,
  },
  sectionLabel: {
    fontSize: 16,
    lineHeight: 22,
    color: "#111827",
    fontWeight: "800",
  },
  singleLineInput: {
    minHeight: 50,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#D9D9D9",
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 14,
    fontSize: 15,
    lineHeight: 20,
    color: "#111827",
  },
  detailGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    rowGap: 12,
  },
  messageInput: {
    minHeight: 132,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#D9D9D9",
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 14,
    paddingVertical: 14,
    fontSize: 15,
    lineHeight: 22,
    color: "#111827",
  },
  errorText: {
    fontSize: 13,
    lineHeight: 18,
    color: "#E53935",
    fontWeight: "600",
  },
  submitButton: {
    minHeight: 60,
    borderRadius: 16,
    backgroundColor: "#4C5BE2",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 6,
  },
  submitButtonDisabled: {
    backgroundColor: "#B5BDEB",
  },
  submitButtonText: {
    fontSize: 18,
    lineHeight: 24,
    color: "#FFFFFF",
    fontWeight: "800",
  },
});
