import { router, useLocalSearchParams } from "expo-router";
import React from "react";

import TutorialPersonalityReportScreen from "@/components/auth/tutorial/TutorialPersonalityReportScreen";

export default function TutorialResultRoute() {
  const params = useLocalSearchParams<{
    email?: string;
    nickname?: string;
    studentId?: string;
  }>();

  const handleContinue = () => {
    router.replace({
      pathname: "/tutorial-complete",
      params: {
        email: typeof params.email === "string" ? params.email : "",
        nickname: typeof params.nickname === "string" ? params.nickname : "",
        studentId:
          typeof params.studentId === "string" ? params.studentId : "",
      },
    });
  };

  return <TutorialPersonalityReportScreen onContinue={handleContinue} />;
}
