export type ReportStatus = "대기중" | "경고" | "정지" | "기각";

export const REPORT_STATUS_STYLE: Record<ReportStatus, React.CSSProperties> = {
  대기중: { backgroundColor: "#FFF7ED", color: "#C2410C", border: "1px solid #FED7AA" },
  경고:   { backgroundColor: "#FFFBEB", color: "#92400E", border: "1px solid #FDE68A" },
  정지:   { backgroundColor: "#FFF1F2", color: "#BE123C", border: "1px solid #FECDD3" },
  기각:   { backgroundColor: "#F9FAFB", color: "#6B7280", border: "1px solid #E5E7EB" },
};
