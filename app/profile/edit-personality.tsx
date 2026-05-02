import { router } from "expo-router";
import React from "react";
import { Alert, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import TutorialScreenContent from "@/components/auth/tutorial/TutorialScreenContent";
import TutorialSportsScreenContent from "@/components/auth/tutorial/TutorialSportsScreenContent";
import {
  SPORTS_STEP,
  TUTORIAL_STEPS,
} from "@/components/auth/tutorial/tutorialSteps";
import type {
  TutorialQuestionStep,
  TutorialStep,
} from "@/components/auth/tutorial/tutorialTypes";
import { updateMyProfile } from "@/services/user/userService";
import { useUserStore } from "@/stores/user/userStore";

const PROGRESS: Record<TutorialQuestionStep | "sports", number> = {
  exerciseStyle: 0.25,
  intensity: 0.5,
  motivation: 0.75,
  sports: 1,
};

const INITIAL_SELECTIONS: Record<TutorialQuestionStep, string | null> = {
  exerciseStyle: null,
  intensity: null,
  motivation: null,
};

const NEXT_STEP_BY_QUESTION: Record<TutorialQuestionStep, TutorialStep> = {
  exerciseStyle: "intensity",
  intensity: "motivation",
  motivation: "sports",
};

const PREVIOUS_STEP_BY_STEP: Partial<Record<TutorialStep, TutorialStep>> = {
  intensity: "exerciseStyle",
  motivation: "intensity",
  sports: "motivation",
};

// Maps intensity option ID → API difficulty value
const INTENSITY_TO_DIFFICULTY: Record<string, string> = {
  light: "BEGINNER",
  moderate: "INTERMEDIATE",
  focused: "ADVANCED",
  intense: "ADVANCED",
};

// Maps sports option ID → Korean label sent to API
const SPORT_ID_TO_LABEL: Record<string, string> = Object.fromEntries(
  SPORTS_STEP.options.map((o) => [o.id, o.label])
);

const isQuestionStep = (step: TutorialStep): step is TutorialQuestionStep =>
  step in TUTORIAL_STEPS;

export default function EditPersonalityRoute() {
  const clearProfile = useUserStore((state) => state.clearProfile);

  const [currentStep, setCurrentStep] =
    React.useState<TutorialStep>("exerciseStyle");
  const [selectedQuestionOptions, setSelectedQuestionOptions] =
    React.useState(INITIAL_SELECTIONS);
  const [selectedSports, setSelectedSports] = React.useState<string[]>([]);
  const [isSaving, setIsSaving] = React.useState(false);

  const handleSelectOption = (optionId: string) => {
    if (!isQuestionStep(currentStep)) return;
    setSelectedQuestionOptions((prev) => ({ ...prev, [currentStep]: optionId }));
    setCurrentStep(NEXT_STEP_BY_QUESTION[currentStep]);
  };

  const handleSportToggle = (optionId: string) => {
    setSelectedSports((current) => {
      if (current.includes(optionId))
        return current.filter((id) => id !== optionId);
      if (current.length >= 3) return current;
      const next = [...current, optionId];
      if (next.length === 3) {
        handleSave(next, selectedQuestionOptions.intensity);
      }
      return next;
    });
  };

  const handleSave = async (
    sportIds: string[],
    intensityId: string | null
  ) => {
    setIsSaving(true);
    try {
      await updateMyProfile({
        exerciseTypes: sportIds.map((id) => SPORT_ID_TO_LABEL[id] ?? id),
        ...(intensityId
          ? { difficulty: INTENSITY_TO_DIFFICULTY[intensityId] ?? intensityId }
          : {}),
      });
      // Invalidate cached profile so MyPageScreen re-fetches updated data
      clearProfile();
      Alert.alert("저장 완료", "성향 정보가 업데이트됐어요.", [
        { text: "확인", onPress: () => router.back() },
      ]);
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "저장 중 오류가 발생했습니다.";
      Alert.alert("저장 실패", message);
    } finally {
      setIsSaving(false);
    }
  };

  const handleBack = () => {
    const previousStep = PREVIOUS_STEP_BY_STEP[currentStep];
    if (previousStep) {
      setCurrentStep(previousStep);
    } else {
      router.back();
    }
  };

  if (currentStep === "sports") {
    return (
      <SafeAreaView style={styles.safe}>
        <TutorialSportsScreenContent
          headerTitle={SPORTS_STEP.headerTitle}
          title={SPORTS_STEP.title}
          description={SPORTS_STEP.description}
          progressRatio={PROGRESS.sports}
          options={SPORTS_STEP.options}
          selectedOptionIds={selectedSports}
          onSelectOption={isSaving ? () => {} : handleSportToggle}
          onBack={handleBack}
        />
      </SafeAreaView>
    );
  }

  const currentConfig = TUTORIAL_STEPS[currentStep];

  return (
    <SafeAreaView style={styles.safe}>
      <TutorialScreenContent
        backLabel={currentConfig.backLabel}
        headerTitle={currentConfig.headerTitle}
        titleLines={currentConfig.titleLines}
        description={currentConfig.description}
        progressRatio={PROGRESS[currentStep]}
        options={currentConfig.options}
        selectedOptionId={selectedQuestionOptions[currentStep]}
        centeredOptions={currentConfig.centeredOptions}
        onSelectOption={handleSelectOption}
        onBack={handleBack}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
});
