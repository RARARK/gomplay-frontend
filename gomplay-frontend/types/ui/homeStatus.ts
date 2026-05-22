export type HomeStatusVariant =
  | "Loading"
  | "Default"
  | "NoSchedule"
  | "Matching"
  | "Matched"
  | "MatchedNew";
// 시간표 등록 여부, 퀵 매치 토글 여부, 퀵 매치 완료를 기준으로 홈 화면 타입을 나눔
