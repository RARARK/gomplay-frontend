import React from "react";

import TutorialOnboardingCompleteScreen from "./TutorialOnboardingCompleteScreen";

type TutorialCompleteScreenProps = {
  onPressCta: () => void;
};

export default function TutorialCompleteScreen({
  onPressCta,
}: TutorialCompleteScreenProps) {
  return <TutorialOnboardingCompleteScreen onPressCta={onPressCta} />;
}
