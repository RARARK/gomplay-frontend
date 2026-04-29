import { router } from "expo-router";
import React from "react";
import { StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import TutorialScheduleScreenContent from "@/components/auth/tutorial/TutorialScheduleScreenContent";
import TutorialScreenContent from "@/components/auth/tutorial/TutorialScreenContent";
import TutorialSportsScreenContent from "@/components/auth/tutorial/TutorialSportsScreenContent";
import {
  SCHEDULE_STEP,
  SPORTS_STEP,
  TUTORIAL_STEPS,
} from "@/components/auth/tutorial/tutorialSteps";
import type {
  TutorialQuestionStep,
  TutorialStep,
} from "@/components/auth/tutorial/tutorialTypes";
import type {
  UserTimetableRange,
  UserTimetableState,
} from "@/types/domain/user";
import { createEmptyTimetableState } from "@/utils/timetable";

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
  schedule: "sports",
};

const isQuestionStep = (step: TutorialStep): step is TutorialQuestionStep =>
  step in TUTORIAL_STEPS;

export default function TutorialScreen() {
  const [currentStep, setCurrentStep] =
    React.useState<TutorialStep>("exerciseStyle");
  const [selectedQuestionOptions, setSelectedQuestionOptions] =
    React.useState(INITIAL_SELECTIONS);
  const [selectedSports, setSelectedSports] = React.useState<string[]>([]);
  const [timetable, setTimetable] = React.useState<UserTimetableState>(() =>
    createEmptyTimetableState(),
  );

  const handleSelectOption = (optionId: string) => {
    if (!isQuestionStep(currentStep)) {
      return;
    }

    setSelectedQuestionOptions((previous) => ({
      ...previous,
      [currentStep]: optionId,
    }));
    setCurrentStep(NEXT_STEP_BY_QUESTION[currentStep]);
  };

  const handleSportToggle = (optionId: string) => {
    setSelectedSports((current) => {
      if (current.includes(optionId)) {
        return current.filter((id) => id !== optionId);
      }

      if (current.length >= 3) {
        return current;
      }

      const next = [...current, optionId];
      if (next.length === 3) {
        setCurrentStep("schedule");
      }
      return next;
    });
  };

  const handleScheduleSave = (_ranges: UserTimetableRange[]) => {
    router.push("/tutorial-analyzing");
  };

  const handleScheduleSkip = () => {
    router.push("/tutorial-analyzing");
  };

  const handleBack = () => {
    const previousStep = PREVIOUS_STEP_BY_STEP[currentStep];

    if (previousStep) {
      setCurrentStep(previousStep);
      return;
    }

    router.back();
  };

  if (currentStep === "sports") {
    return (
      <SafeAreaView style={styles.safeArea}>
        <TutorialSportsScreenContent
          headerTitle={SPORTS_STEP.headerTitle}
          title={SPORTS_STEP.title}
          description={SPORTS_STEP.description}
          progressRatio={SPORTS_STEP.progressRatio}
          options={SPORTS_STEP.options}
          selectedOptionIds={selectedSports}
          onSelectOption={handleSportToggle}
          onBack={handleBack}
        />
      </SafeAreaView>
    );
  }

  if (currentStep === "schedule") {
    return (
      <SafeAreaView style={styles.safeArea}>
        <TutorialScheduleScreenContent
          value={timetable}
          onChange={setTimetable}
          onSave={handleScheduleSave}
          onSkip={handleScheduleSkip}
          onBack={handleBack}
          headerTitle={SCHEDULE_STEP.headerTitle}
          title={SCHEDULE_STEP.title}
          description={SCHEDULE_STEP.description}
          saveLabel={SCHEDULE_STEP.saveLabel}
          skipLabel={SCHEDULE_STEP.skipLabel}
          progressRatio={SCHEDULE_STEP.progressRatio}
        />
      </SafeAreaView>
    );
  }

  const currentConfig = TUTORIAL_STEPS[currentStep];

  return (
    <SafeAreaView style={styles.safeArea}>
      <TutorialScreenContent
        backLabel={currentConfig.backLabel}
        headerTitle={currentConfig.headerTitle}
        titleLines={currentConfig.titleLines}
        description={currentConfig.description}
        progressRatio={currentConfig.progressRatio}
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
  safeArea: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
});
