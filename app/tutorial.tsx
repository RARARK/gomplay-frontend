import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import React from "react";
import { StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import RunIcon from "@/assets/login/boxicons-running-filled.svg";
import GuidanceQuietAreaIcon from "@/assets/login/guidance-quiet-area.svg";
import MuscleIcon from "@/assets/login/icon-park-outline-muscle.svg";
import FireIcon from "@/assets/login/mdi-fire.svg";
import WalkIcon from "@/assets/login/ri-walk-fill.svg";
import ConversationIcon from "@/assets/login/streamline-freehand-conversation-question-warning-3.svg";
import TutorialScheduleScreenContent from "@/components/auth/tutorial/TutorialScheduleScreenContent";
import TutorialScreenContent, {
  type TutorialOption,
} from "@/components/auth/tutorial/TutorialScreenContent";
import TutorialSportsScreenContent from "@/components/auth/tutorial/TutorialSportsScreenContent";
import type {
  UserTimetableRange,
  UserTimetableState,
} from "@/types/domain/user";
import { createEmptyTimetableState } from "@/utils/timetable";

type TutorialQuestionStep = "exerciseStyle" | "intensity" | "motivation";
type TutorialStep = TutorialQuestionStep | "sports" | "schedule";

type TutorialStepConfig = {
  backLabel: string;
  headerTitle: string;
  titleLines: string[];
  description: string;
  progressRatio: number;
  centeredOptions: boolean;
  options: TutorialOption[];
};

const COMMON_BACK_LABEL = "튜토리얼 이전 단계";

const TUTORIAL_STEPS: Record<TutorialQuestionStep, TutorialStepConfig> = {
  exerciseStyle: {
    backLabel: COMMON_BACK_LABEL,
    headerTitle: "운동 스타일",
    titleLines: ["이동할 때 어떤 스타일의", "파트너를 선호하시나요?"],
    description: "선호하시는 스타일에 맞춰 파트너를 추천해드릴게요.",
    progressRatio: 0.25,
    centeredOptions: true,
    options: [
      {
        id: "quiet",
        label: "조용히 각자 운동하고 싶어요",
        icon: <GuidanceQuietAreaIcon width={24} height={24} />,
      },
      {
        id: "talkative",
        label: "대화하면서 같이 운동하고 싶어요",
        icon: <ConversationIcon width={24} height={24} />,
      },
    ],
  },
  intensity: {
    backLabel: COMMON_BACK_LABEL,
    headerTitle: "운동 강도",
    titleLines: ["어느 정도로 움직이는", "파트너를 선호하시나요?"],
    description: "운동 템포에 맞는 상대를 찾는 데 도움이 돼요.",
    progressRatio: 0.5,
    centeredOptions: true,
    options: [
      {
        id: "light",
        label: "가볍게 몸만 풀고 싶어요",
        icon: <WalkIcon width={24} height={24} />,
      },
      {
        id: "moderate",
        label: "적당히 운동하고 싶어요",
        icon: <RunIcon width={24} height={24} />,
      },
      {
        id: "focused",
        label: "제대로 운동하고 싶어요",
        icon: <MuscleIcon width={24} height={24} />,
      },
      {
        id: "intense",
        label: "한계까지 도전하고 싶어요",
        icon: <FireIcon width={24} height={24} />,
      },
    ],
  },
  motivation: {
    backLabel: COMMON_BACK_LABEL,
    headerTitle: "운동 이유",
    titleLines: ["운동하는 주된 이유가,", "무엇인가요?"],
    description: "주된 이유에 맞춰 파트너를 추천해드릴게요.",
    progressRatio: 0.75,
    centeredOptions: true,
    options: [
      {
        id: "refresh",
        label: "스트레스 풀고 기분 전환하려고요",
        icon: <Ionicons name="happy-outline" size={24} color="#7C3AED" />,
      },
      {
        id: "social",
        label: "같이 운동하며 친해지고 싶어요",
        icon: <Ionicons name="people-outline" size={24} color="#2563EB" />,
      },
      {
        id: "skill",
        label: "실력을 키우고 경쟁하고 싶어요",
        icon: (
          <MaterialCommunityIcons
            name="trophy-outline"
            size={24}
            color="#EAB308"
          />
        ),
      },
      {
        id: "fitness",
        label: "체력이나 몸매를 관리하고 싶어요",
        icon: <Ionicons name="barbell-outline" size={24} color="#111827" />,
      },
    ],
  },
};

const SPORTS_STEP = {
  headerTitle: "운동 종목",
  title: "어떤 운동을 좋아하시나요?",
  description: "좋아하는 운동을 최대 3개까지 골라주세요.",
  progressRatio: 1,
  options: [
    {
      id: "billiards",
      label: "당구",
      icon: (
        <MaterialCommunityIcons
          name="billiards-rack"
          size={28}
          color="#EF5A24"
        />
      ),
    },
    {
      id: "baseball",
      label: "야구",
      icon: (
        <MaterialCommunityIcons name="baseball" size={28} color="#EF5A24" />
      ),
    },
    {
      id: "bowling",
      label: "볼링",
      icon: <MaterialCommunityIcons name="bowling" size={28} color="#EF5A24" />,
    },
    {
      id: "bicycle",
      label: "자전거",
      icon: <Ionicons name="bicycle-outline" size={28} color="#EF5A24" />,
    },
    {
      id: "running",
      label: "러닝",
      icon: <MaterialCommunityIcons name="run" size={28} color="#EF5A24" />,
    },
    {
      id: "soccer",
      label: "축구",
      icon: <Ionicons name="football-outline" size={28} color="#111111" />,
    },
    {
      id: "futsal",
      label: "풋살",
      icon: <Ionicons name="footsteps-outline" size={28} color="#5664F5" />,
    },
    {
      id: "tennis",
      label: "테니스",
      icon: (
        <MaterialCommunityIcons name="tennis-ball" size={28} color="#58B95C" />
      ),
    },
    {
      id: "hiking",
      label: "등산",
      icon: <Ionicons name="triangle-outline" size={28} color="#3E8D53" />,
    },
    {
      id: "basketball",
      label: "농구",
      icon: <Ionicons name="basketball-outline" size={28} color="#FF6A00" />,
    },
    {
      id: "badminton",
      label: "배드민턴",
      icon: (
        <MaterialCommunityIcons name="badminton" size={28} color="#3E8D53" />
      ),
    },
    {
      id: "fitness",
      label: "헬스",
      icon: <Ionicons name="barbell-outline" size={28} color="#3E8D53" />,
    },
  ] satisfies TutorialOption[],
} as const;

export default function TutorialScreen() {
  const [currentStep, setCurrentStep] =
    React.useState<TutorialStep>("exerciseStyle");
  const [selectedStyle, setSelectedStyle] = React.useState<string | null>(null);
  const [selectedIntensity, setSelectedIntensity] = React.useState<
    string | null
  >(null);
  const [selectedMotivation, setSelectedMotivation] = React.useState<
    string | null
  >(null);
  const [selectedSports, setSelectedSports] = React.useState<string[]>([]);
  const [timetable, setTimetable] = React.useState<UserTimetableState>(() =>
    createEmptyTimetableState(),
  );

  const handleSelectOption = (optionId: string) => {
    if (currentStep === "exerciseStyle") {
      setSelectedStyle(optionId);
      setCurrentStep("intensity");
      return;
    }

    if (currentStep === "intensity") {
      setSelectedIntensity(optionId);
      setCurrentStep("motivation");
      return;
    }

    if (currentStep === "motivation") {
      setSelectedMotivation(optionId);
      setCurrentStep("sports");
    }
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
    if (currentStep === "schedule") {
      setCurrentStep("sports");
      return;
    }

    if (currentStep === "sports") {
      setCurrentStep("motivation");
      return;
    }

    if (currentStep === "motivation") {
      setCurrentStep("intensity");
      return;
    }

    if (currentStep === "intensity") {
      setCurrentStep("exerciseStyle");
      return;
    }

    router.back();
  };

  const selectedOptionId =
    currentStep === "exerciseStyle"
      ? selectedStyle
      : currentStep === "intensity"
        ? selectedIntensity
        : selectedMotivation;

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
        selectedOptionId={selectedOptionId}
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
