import { router, useLocalSearchParams } from "expo-router";
import React from "react";
import { StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import TutorialScheduleScreenContent from "@/components/auth/tutorial/TutorialScheduleScreenContent";
import TutorialScreenContent from "@/components/auth/tutorial/TutorialScreenContent";
import TutorialSportsScreenContent from "@/components/auth/tutorial/TutorialSportsScreenContent";
import {
  INITIAL_TUTORIAL_SELECTIONS,
  NEXT_STEP_BY_QUESTION,
  PREVIOUS_STEP_BY_STEP,
  SCHEDULE_STEP,
  SPORTS_STEP,
  TUTORIAL_MAX_SPORT_SELECTIONS,
  TUTORIAL_STEPS,
} from "@/components/auth/tutorial/tutorialSteps";
import type {
  TutorialQuestionStep,
  TutorialStep,
} from "@/components/auth/tutorial/tutorialTypes";
import { useSurveyStore } from "@/stores/survey/surveyStore";
import type {
  UserTimetableRange,
  UserTimetableState,
} from "@/types/domain/user";
import { compressTimetableState, createEmptyTimetableState } from "@/utils/timetable";
import { mapTutorialToSurvey } from "@/utils/mapTutorialToSurvey";

const isQuestionStep = (step: TutorialStep): step is TutorialQuestionStep =>
  step in TUTORIAL_STEPS;

export default function TutorialScreen() {
  const params = useLocalSearchParams<{
    email?: string;
    nickname?: string;
    studentId?: string;
  }>();
  const setPendingSurvey = useSurveyStore((s) => s.setPendingSurvey);
  const setPendingSchedule = useSurveyStore((s) => s.setPendingSchedule);
  const [currentStep, setCurrentStep] =
    React.useState<TutorialStep>("exerciseStyle");
  const [selectedQuestionOptions, setSelectedQuestionOptions] =
    React.useState(INITIAL_TUTORIAL_SELECTIONS);
  const [selectedSports, setSelectedSports] = React.useState<string[]>([]);
  const [timetable, setTimetable] = React.useState<UserTimetableState>(() =>
    createEmptyTimetableState(),
  );
  const signupParams = React.useMemo(
    () => ({
      email: typeof params.email === "string" ? params.email : "",
      nickname: typeof params.nickname === "string" ? params.nickname : "",
      studentId: typeof params.studentId === "string" ? params.studentId : "",
    }),
    [params.email, params.nickname, params.studentId],
  );

  const saveSurveyAndNavigate = (scheduleRanges?: UserTimetableRange[]) => {
    const mapped = mapTutorialToSurvey({
      exerciseStyle: selectedQuestionOptions.exerciseStyle,
      intensity: selectedQuestionOptions.intensity,
      motivation: selectedQuestionOptions.motivation,
      sports: selectedSports,
    });
    if (mapped) setPendingSurvey(mapped);
    if (scheduleRanges && scheduleRanges.length > 0) {
      setPendingSchedule(scheduleRanges);
    }
    router.push({ pathname: "/tutorial-analyzing", params: signupParams });
  };

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

      if (current.length >= TUTORIAL_MAX_SPORT_SELECTIONS) {
        return current;
      }

      const next = [...current, optionId];
      if (next.length === TUTORIAL_MAX_SPORT_SELECTIONS) {
        setCurrentStep("schedule");
      }
      return next;
    });
  };

  const handleScheduleSave = (ranges: UserTimetableRange[]) => {
    saveSurveyAndNavigate(ranges.length > 0 ? ranges : compressTimetableState(timetable));
  };

  const handleScheduleSkip = () => {
    saveSurveyAndNavigate();
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
