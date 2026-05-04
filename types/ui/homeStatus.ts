export type HomeStatusVariant =
  | "Default"
  | "NoSchedule"
  | "Matching"
  | "Matched"
  | "MatchedNew";
// 시간표 등록 여부, 퀵매칭 토글 여부, 퀵매칭 완료를 기준으로 홈 화면 타입을 나눔
