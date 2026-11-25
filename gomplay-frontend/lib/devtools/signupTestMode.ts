/**
 * 회원가입 테스트 모드 (개발용)
 *
 * 실제 서버는 @dankook.ac.kr 이메일만 받고, 메일로 받은 인증 코드가 있어야 로그인할 수 있어서
 * 아무 이메일로 회원가입 흐름 전체를 점검할 수 없다.
 * 이 모드에서는 회원가입 흐름에 필요한 API만 가짜 응답으로 대신하고, 그 외 요청은 모두 막아서
 * 서버에 계정이나 데이터가 전혀 만들어지지 않는다.
 *
 * 켜는 법: .env.local 에 EXPO_PUBLIC_ENABLE_SIGNUP_TEST=true 를 넣고 Metro를 다시 시작한다.
 * 그러면 로그인 화면에 "회원가입 테스트" 버튼이 보인다. 값이 없으면 버튼과 기능 모두 비활성이다.
 */
import {
  AxiosError,
  type AxiosAdapter,
  type AxiosResponse,
  type InternalAxiosRequestConfig,
} from "axios";
import { router } from "expo-router";
import { Alert } from "react-native";
import { create } from "zustand";

import { useAuthStore } from "@/stores/auth/authStore";
import type { SubmitSurveyInput, SurveyReport } from "@/types/domain/survey";

export const IS_SIGNUP_TEST_AVAILABLE =
  process.env.EXPO_PUBLIC_ENABLE_SIGNUP_TEST === "true";

type SignupTestState = {
  enabled: boolean;
  /** 튜토리얼에서 제출한 설문. 가짜 분석 리포트를 만들 때 쓴다. */
  lastSurvey: SubmitSurveyInput | null;
};

export const useSignupTestStore = create<SignupTestState>(() => ({
  enabled: false,
  lastSurvey: null,
}));

export function isSignupTestMode(): boolean {
  return IS_SIGNUP_TEST_AVAILABLE && useSignupTestStore.getState().enabled;
}

export function startSignupTest(): void {
  if (!IS_SIGNUP_TEST_AVAILABLE) return;
  useSignupTestStore.setState({ enabled: true, lastSurvey: null });
}

export function endSignupTest(): void {
  useSignupTestStore.setState({ enabled: false, lastSurvey: null });
}

/** 튜토리얼 마지막 단계에서 호출: 가짜 로그인 상태를 지우고 로그인 화면으로 돌아간다. */
export function finishSignupTest(): void {
  const auth = useAuthStore.getState();
  auth.setPendingCredentials(null);
  auth.setPendingProfileImageUri(null);
  auth.clearAuth();
  endSignupTest();

  Alert.alert(
    "회원가입 테스트 완료",
    "회원가입 흐름을 끝까지 진행했어요.\n테스트 모드라 서버에는 아무것도 저장되지 않았어요.",
    [{ text: "확인", onPress: () => router.replace("/login") }],
  );
}

// ── 가짜 API 응답 ────────────────────────────────────────────────────────────

const FAKE_DELAY_MS = 400;
const TEST_USER_ID = 0;

const PERSONALITY_LABEL: Record<string, string> = {
  같이: "외향형",
  각자: "내향형",
};
const INTENSITY_LABEL: Record<string, string> = {
  가볍게: "가벼운형",
  적당히: "균형형",
  제대로: "도전형",
  한계까지: "열정형",
};
const PURPOSE_LABEL: Record<string, string> = {
  스트레스: "스트레스 해소",
  친해지려고: "친목 형성",
  경쟁: "경쟁·성취",
  체력: "체력 관리",
};

function buildFakeReport(survey: SubmitSurveyInput | null): SurveyReport {
  const exerciseTypes = survey?.exerciseTypes?.length ? survey.exerciseTypes : ["러닝"];
  return {
    userId: TEST_USER_ID,
    personalityType: PERSONALITY_LABEL[survey?.partnerStyle ?? ""] ?? "외향형",
    intensityType: INTENSITY_LABEL[survey?.exerciseIntensity ?? ""] ?? "균형형",
    purposeType: PURPOSE_LABEL[survey?.exerciseReason ?? ""] ?? "체력 관리",
    exerciseTypes,
    summary: "[테스트 모드] 실제 분석 대신 보여주는 예시 리포트예요. 입력한 설문 값을 바탕으로 채웠어요.",
    recommendedExercises: exerciseTypes.slice(0, 2),
    partnerStyleDescription: "[테스트 모드] 파트너 스타일 설명 예시예요.",
    exerciseMoodDescription: "[테스트 모드] 운동 분위기 설명 예시예요.",
  };
}

function parseJsonBody(data: unknown): Record<string, unknown> {
  if (typeof data !== "string") return {};
  try {
    return JSON.parse(data) as Record<string, unknown>;
  } catch {
    return {};
  }
}

function ok<T>(config: InternalAxiosRequestConfig, data: T): AxiosResponse<T> {
  return { data, status: 200, statusText: "OK", headers: {}, config, request: {} };
}

function apiOk<T>(config: InternalAxiosRequestConfig, message: string, data: T) {
  return ok(config, { success: true, message, data });
}

/** 테스트 모드에서 axios가 실제 네트워크 대신 사용하는 adapter. */
export const signupTestAdapter: AxiosAdapter = async (config) => {
  await new Promise((resolve) => setTimeout(resolve, FAKE_DELAY_MS));

  const method = (config.method ?? "get").toLowerCase();
  const path = (config.url ?? "").split("?")[0];
  const body = parseJsonBody(config.data);

  switch (`${method} ${path}`) {
    case "post /api/auth/signup":
      return apiOk(config, "[테스트 모드] 인증 메일 발송을 건너뛰었어요.", {
        email: String(body.schoolEmail ?? ""),
      });

    case "post /api/auth/verify-email":
      return apiOk(config, "[테스트 모드] 인증을 통과했어요.", null);

    case "post /api/auth/resend-verification":
      return apiOk(
        config,
        "[테스트 모드] 실제 메일은 보내지 않아요. 아무 코드나 입력하면 통과해요.",
        null,
      );

    case "post /api/auth/login":
      return apiOk(config, "[테스트 모드] 로그인", {
        accessToken: "signup-test-access-token",
        refreshToken: "signup-test-refresh-token",
        userId: TEST_USER_ID,
        matching: false,
        tokenType: "Bearer",
      });

    case "post /api/survey": {
      const survey = body as unknown as SubmitSurveyInput;
      useSignupTestStore.setState({ lastSurvey: survey });
      return apiOk(config, "[테스트 모드] 설문 저장", { userId: TEST_USER_ID, ...survey });
    }

    case "get /api/survey/report":
      return apiOk(
        config,
        "[테스트 모드] 리포트",
        buildFakeReport(useSignupTestStore.getState().lastSurvey),
      );

    case "post /api/schedule":
      return apiOk(config, "[테스트 모드] 시간표 저장", {
        userId: TEST_USER_ID,
        schedules: [],
      });

    case "post /api/user/me/profile-image":
      // 응답이 ApiResponse로 감싸지지 않은 평평한 형태다.
      return ok(config, { profileImageUrl: "signup-test://profile.jpg" });

    case "patch /api/user/me/profile":
      return ok(config, { userId: TEST_USER_ID, updateAt: new Date().toISOString() });

    default: {
      // 회원가입과 무관한 요청은 서버로 보내지 않고 실패시킨다.
      const response = ok(config, {
        success: false,
        message: `[테스트 모드] ${method.toUpperCase()} ${path} 요청은 서버로 보내지 않았어요.`,
        data: null,
      });
      response.status = 400;
      response.statusText = "Blocked by signup test mode";
      throw new AxiosError(
        response.data.message,
        "ERR_SIGNUP_TEST_MODE",
        config,
        null,
        response,
      );
    }
  }
};
