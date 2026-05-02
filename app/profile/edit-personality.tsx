import { router } from "expo-router";
import React from "react";
import { ActivityIndicator, Alert, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import TutorialScreenContent from "@/components/auth/tutorial/TutorialScreenContent";
import TutorialSportsScreenContent from "@/components/auth/tutorial/TutorialSportsScreenContent";
import {
  INITIAL_TUTORIAL_SELECTIONS,
  NEXT_STEP_BY_QUESTION,
  PREVIOUS_STEP_BY_STEP,
  SPORTS_STEP,
  TUTORIAL_MAX_SPORT_SELECTIONS,
  TUTORIAL_STEPS,
} from "@/components/auth/tutorial/tutorialSteps";
import type {
  TutorialQuestionStep,
  TutorialStep,
} from "@/components/auth/tutorial/tutorialTypes";
import { getSurvey, submitSurvey, updateSurvey } from "@/services/survey/surveyService";
import { useUserStore } from "@/stores/user/userStore";
import { mapSurveyToTutorial, mapTutorialToSurvey } from "@/utils/mapTutorialToSurvey";

const isQuestionStep = (step: TutorialStep): step is TutorialQuestionStep =>
  step in TUTORIAL_STEPS;

const isSurveyNotFoundError = (error: unknown) =>
  error instanceof Error &&
  error.message.includes("설문") &&
  error.message.includes("찾을 수 없습니다");

export default function EditPersonalityRoute() {
  const clearProfile = useUserStore((state) => state.clearProfile);

  const [isLoading, setIsLoading] = React.useState(true);
  const [isSaving, setIsSaving] = React.useState(false);
  const [currentStep, setCurrentStep] = React.useState<TutorialStep>("exerciseStyle");
  const [selectedQuestionOptions, setSelectedQuestionOptions] = React.useState<
    Record<TutorialQuestionStep, string | null>
  >(INITIAL_TUTORIAL_SELECTIONS);
  const [selectedSports, setSelectedSports] = React.useState<string[]>([]);

  React.useEffect(() => {
    getSurvey()
      .then((survey) => {
        const mapped = mapSurveyToTutorial(survey);
        setSelectedQuestionOptions({
          exerciseStyle: mapped.exerciseStyle,
          intensity: mapped.intensity,
          motivation: mapped.motivation,
        });
        setSelectedSports(mapped.sports);
      })
      .catch(() => {})
      .finally(() => setIsLoading(false));
  }, []);

  const handleSelectOption = (optionId: string) => {
    if (!isQuestionStep(currentStep)) return;
    setSelectedQuestionOptions((prev) => ({ ...prev, [currentStep]: optionId }));
    setCurrentStep(NEXT_STEP_BY_QUESTION[currentStep]);
  };

  const handleSportToggle = (optionId: string) => {
    setSelectedSports((current) => {
      if (current.includes(optionId)) return current.filter((id) => id !== optionId);
      if (current.length >= TUTORIAL_MAX_SPORT_SELECTIONS) return current;
      const next = [...current, optionId];
      if (next.length === TUTORIAL_MAX_SPORT_SELECTIONS) handleSave(next);
      return next;
    });
  };

  const handleSave = async (sportIds: string[]) => {
    const input = mapTutorialToSurvey({
      exerciseStyle: selectedQuestionOptions.exerciseStyle,
      intensity: selectedQuestionOptions.intensity,
      motivation: selectedQuestionOptions.motivation,
      sports: sportIds,
    });
    if (!input) return;

    setIsSaving(true);
    try {
      try {
        await updateSurvey(input);
      } catch (err) {
        if (!isSurveyNotFoundError(err)) throw err;
        await submitSurvey(input);
      }
      clearProfile();
      Alert.alert("저장 완료", "성향 정보가 업데이트됐어요.", [
        { text: "확인", onPress: () => router.back() },
      ]);
    } catch (err) {
      Alert.alert(
        "저장 실패",
        err instanceof Error ? err.message : "저장 중 오류가 발생했습니다.",
      );
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

  if (isLoading) {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={styles.centered}>
          <ActivityIndicator size="large" color="#4C5BE2" />
        </View>
      </SafeAreaView>
    );
  }

  if (currentStep === "sports") {
    return (
      <SafeAreaView style={styles.safe}>
        <TutorialSportsScreenContent
          headerTitle={SPORTS_STEP.headerTitle}
          title={SPORTS_STEP.title}
          description={SPORTS_STEP.description}
          progressRatio={SPORTS_STEP.progressRatio}
          options={SPORTS_STEP.options}
          selectedOptionIds={selectedSports}
          onSelectOption={isSaving ? () => {} : handleSportToggle}
          onBack={handleBack}
        />
      </SafeAreaView>
    );
  }

  if (!isQuestionStep(currentStep)) {
    return null;
  }

  const currentConfig = TUTORIAL_STEPS[currentStep];

  return (
    <SafeAreaView style={styles.safe}>
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
  safe: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  centered: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});
