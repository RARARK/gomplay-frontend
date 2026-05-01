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

// 4단계 플로우: exerciseStyle → intensity → motivation → sports
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

const isQuestionStep = (step: TutorialStep): step is TutorialQuestionStep =>
  step in TUTORIAL_STEPS;

export default function EditPersonalityRoute() {
  const [currentStep, setCurrentStep] =
    React.useState<TutorialStep>("exerciseStyle");
  const [selectedQuestionOptions, setSelectedQuestionOptions] =
    React.useState(INITIAL_SELECTIONS);
  const [selectedSports, setSelectedSports] = React.useState<string[]>([]);

  const handleSelectOption = (optionId: string) => {
    if (!isQuestionStep(currentStep)) return;
    setSelectedQuestionOptions((prev) => ({ ...prev, [currentStep]: optionId }));
    setCurrentStep(NEXT_STEP_BY_QUESTION[currentStep]);
  };

  const handleSportToggle = (optionId: string) => {
    setSelectedSports((current) => {
      if (current.includes(optionId)) return current.filter((id) => id !== optionId);
      if (current.length >= 3) return current;
      const next = [...current, optionId];
      if (next.length === 3) {
        // 3개 선택 완료 → 저장
        Alert.alert("저장 완료", "성향 정보가 업데이트됐어요.", [
          { text: "확인", onPress: () => router.back() },
        ]);
      }
      return next;
    });
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
          onSelectOption={handleSportToggle}
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
