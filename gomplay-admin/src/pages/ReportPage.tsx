import {
  AlertTriangle,
  ChevronLeft,
  ChevronRight,
  RefreshCw,
  Search,
  User,
  X,
} from "lucide-react";
import { useState } from "react";
import { type ReportStatus, REPORT_STATUS_STYLE } from "../types/report";

interface Report {
  id: string;
  reportedAt: string;
  reporter: string;
  reportee: string;
  category: string;
  content: string;
  status: ReportStatus;
}

const CATEGORIES = [
  "허위 학교 인증",
  "욕설·괴롭힘",
  "불쾌한 행동",
  "위험한 행동",
  "금전 요구·사기",
  "기타",
];

const MOCK_REPORTS: Report[] = [
  { id: "RPT-250518-0001", reportedAt: "2025.05.18 14:32", reporter: "김민준", reportee: "이서연", category: "욕설·괴롭힘", content: "매칭 중 지속적으로 욕설을 사용하고 괴롭혔습니다. 여러 차례 경고에도 불구하고 행동을 멈추지 않았습니다.", status: "대기중" },
  { id: "RPT-250518-0002", reportedAt: "2025.05.18 13:15", reporter: "박지수", reportee: "최민호", category: "허위 학교 인증", content: "본인이 다니지 않는 대학교로 학교 인증을 했습니다.", status: "대기중" },
  { id: "RPT-250518-0003", reportedAt: "2025.05.18 11:47", reporter: "이재원", reportee: "김수진", category: "금전 요구·사기", content: "운동 도구를 빌려준다며 선입금을 요구했습니다.", status: "경고" },
  { id: "RPT-250518-0004", reportedAt: "2025.05.17 22:10", reporter: "정하늘", reportee: "오준혁", category: "불쾌한 행동", content: "매칭 후 개인 연락처를 계속 요구했습니다.", status: "대기중" },
  { id: "RPT-250518-0005", reportedAt: "2025.05.17 18:53", reporter: "한소희", reportee: "윤성민", category: "위험한 행동", content: "운동 중 위험한 행동으로 부상 위험을 유발했습니다.", status: "정지" },
  { id: "RPT-250518-0006", reportedAt: "2025.05.17 15:22", reporter: "강도윤", reportee: "임채원", category: "욕설·괴롭힘", content: "채팅에서 심한 욕설을 사용했습니다.", status: "기각" },
  { id: "RPT-250518-0007", reportedAt: "2025.05.17 12:08", reporter: "배수현", reportee: "신예진", category: "허위 학교 인증", content: "타인의 학생증을 도용하여 인증한 것으로 보입니다.", status: "대기중" },
  { id: "RPT-250518-0008", reportedAt: "2025.05.16 21:34", reporter: "류찬영", reportee: "전지민", category: "기타", content: "약속된 운동 시간에 반복적으로 무단 취소했습니다.", status: "경고" },
  { id: "RPT-250518-0009", reportedAt: "2025.05.16 17:55", reporter: "홍지우", reportee: "문서준", category: "불쾌한 행동", content: "프로필 사진이 타인에게 불쾌감을 줄 수 있는 이미지입니다.", status: "기각" },
  { id: "RPT-250518-0010", reportedAt: "2025.05.16 14:20", reporter: "성다은", reportee: "권오현", category: "금전 요구·사기", content: "레슨 명목으로 금전을 요구했습니다.", status: "대기중" },
];

export default function ReportPage() {
  const [selected, setSelected] = useState<Report | null>(MOCK_REPORTS[0]);
  const [selectedCategory, setSelectedCategory] = useState<string>("욕설·괴롭힘");
  const [statusFilter, setStatusFilter] = useState("전체");
  const [categoryFilter, setCategoryFilter] = useState("전체");
  const [search, setSearch] = useState("");
  const [sanctionReason, setSanctionReason] = useState("");
  const [page, setPage] = useState(1);
  const pageSize = 10;
  const totalPages = 16;

  const filtered = MOCK_REPORTS.filter((r) => {
    if (statusFilter !== "전체" && r.status !== statusFilter) return false;
    if (categoryFilter !== "전체" && r.category !== categoryFilter) return false;
    if (search && !r.reporter.includes(search) && !r.reportee.includes(search) && !r.id.includes(search)) return false;
    return true;
  });

  return (
    <div style={s.page}>
      {/* Page Header */}
      <div style={s.pageHeader}>
        <div>
          <h1 style={s.pageTitle}>신고 관리</h1>
          <p style={s.pageSubtitle}>사용자 신고 내역을 검토하고 제재를 처리합니다.</p>
        </div>
      </div>

      {/* Main split panel */}
      <div style={s.splitPanel}>
        {/* LEFT: List */}
        <div style={s.listPanel}>
          {/* Filters */}
          <div style={s.filterRow}>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              style={s.select}
            >
              <option>전체</option>
              <option>대기중</option>
              <option>경고</option>
              <option>정지</option>
              <option>기각</option>
            </select>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              style={s.select}
            >
              <option>전체</option>
              {CATEGORIES.map((c) => (
                <option key={c}>{c}</option>
              ))}
            </select>
            <div style={s.searchWrap}>
              <Search size={14} color="#9CA3AF" style={{ flexShrink: 0 }} />
              <input
                style={s.searchInput}
                placeholder="신고자, 피신고자 검색"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <button
              style={s.resetBtn}
              onClick={() => { setStatusFilter("전체"); setCategoryFilter("전체"); setSearch(""); }}
            >
              <RefreshCw size={13} />
              초기화
            </button>
          </div>

          {/* Table */}
          <div style={s.tableWrap}>
            <div style={s.tableHeader}>
              <span style={s.totalCount}>전체 152건</span>
            </div>
            <table style={s.table}>
              <thead>
                <tr style={s.thead}>
                  <th style={{ ...s.th, width: 140 }}>신고 일시</th>
                  <th style={s.th}>신고자</th>
                  <th style={s.th}>피신고자</th>
                  <th style={s.th}>신고 유형</th>
                  <th style={{ ...s.th, flex: 1 }}>신고 내용</th>
                  <th style={s.th}>처리 상태</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((r) => (
                  <tr
                    key={r.id}
                    style={{
                      ...s.tr,
                      backgroundColor: selected?.id === r.id ? "#EFF6FF" : "#ffffff",
                    }}
                    onClick={() => { setSelected(r); setSelectedCategory(r.category); setSanctionReason(""); }}
                  >
                    <td style={{ ...s.td, color: "#6B7280", fontSize: 12 }}>{r.reportedAt}</td>
                    <td style={s.td}>{r.reporter}</td>
                    <td style={s.td}>{r.reportee}</td>
                    <td style={s.td}>
                      <span style={s.categoryChip}>{r.category}</span>
                    </td>
                    <td style={{ ...s.td, maxWidth: 160, overflow: "hidden", whiteSpace: "nowrap", textOverflow: "ellipsis" }}>
                      {r.content}
                    </td>
                    <td style={s.td}>
                      <span style={{ ...s.statusBadge, ...REPORT_STATUS_STYLE[r.status] }}>
                        {r.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Pagination */}
            <div style={s.pagination}>
              <select style={s.pageSizeSelect}>
                <option>10개씩 보기</option>
                <option>20개씩 보기</option>
                <option>50개씩 보기</option>
              </select>
              <div style={s.pageButtons}>
                <button style={s.pageBtn} onClick={() => setPage(Math.max(1, page - 1))} disabled={page === 1}>
                  <ChevronLeft size={14} />
                </button>
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  const p = Math.max(1, Math.min(page - 2, totalPages - 4)) + i;
                  return (
                    <button
                      key={p}
                      style={{ ...s.pageBtn, ...(p === page ? s.pageBtnActive : {}) }}
                      onClick={() => setPage(p)}
                    >
                      {p}
                    </button>
                  );
                })}
                <button style={s.pageBtn} onClick={() => setPage(Math.min(totalPages, page + 1))} disabled={page === totalPages}>
                  <ChevronRight size={14} />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT: Detail Panel */}
        {selected ? (
          <div style={s.detailPanel}>
            {/* Detail Header */}
            <div style={s.detailHeader}>
              <div>
                <div style={s.detailId}>{selected.id}</div>
                <div style={s.detailTime}>{selected.reportedAt}</div>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <span style={{ ...s.statusBadge, ...REPORT_STATUS_STYLE[selected.status], fontSize: 12, padding: "4px 10px" }}>
                  {selected.status}
                </span>
                <button style={s.closeBtn} onClick={() => setSelected(null)}>
                  <X size={16} color="#6B7280" />
                </button>
              </div>
            </div>

            <div style={s.detailScroll}>
              {/* Reporter / Reportee */}
              <div style={s.sectionCard}>
                <div style={s.twoCol}>
                  <PersonInfo label="신고자" name={selected.reporter} dept="스포츠학과 3학년" email="reporter@univ.ac.kr" phone="010-1234-5678" />
                  <PersonInfo label="피신고자" name={selected.reportee} dept="경영학과 2학년" email="reportee@univ.ac.kr" phone="010-8765-4321" highlight />
                </div>
              </div>

              {/* Category */}
              <div style={s.sectionCard}>
                <div style={s.sectionLabel}>신고 유형</div>
                <div style={s.chipRow}>
                  {CATEGORIES.map((c) => (
                    <button
                      key={c}
                      style={{
                        ...s.catChip,
                        ...(selectedCategory === c ? s.catChipActive : {}),
                      }}
                      onClick={() => setSelectedCategory(c)}
                    >
                      {c}
                    </button>
                  ))}
                </div>
              </div>

              {/* Content */}
              <div style={s.sectionCard}>
                <div style={s.sectionLabel}>신고 내용</div>
                <p style={s.contentText}>{selected.content}</p>
              </div>

              {/* Reportee stats */}
              <div style={s.sectionCard}>
                <div style={s.sectionLabel}>피신고자 주요 정보</div>
                <div style={s.statsRow}>
                  <StatItem label="매너 온도" value="72.3°C" color="#F97316" />
                  <StatItem label="노쇼 횟수" value="2회" color="#EF4444" />
                  <StatItem label="총 매칭" value="34건" color="#4C5BE2" />
                  <StatItem label="이전 신고" value="1건" color="#6B7280" />
                </div>
              </div>

              {/* Sanction history */}
              <div style={s.sectionCard}>
                <div style={s.sectionLabel}>이전 신고·제재 이력</div>
                <div style={s.historyList}>
                  <HistoryItem date="2025.03.12" content="욕설·괴롭힘 신고 → 경고 발송" />
                </div>
              </div>

              {/* Sanction actions */}
              <div style={s.sectionCard}>
                <div style={s.sectionLabel}>제재 조치</div>
                <div style={s.sanctionBtns}>
                  {(["기각", "경고 발송", "7일 정지", "30일 정지", "영구 정지"] as const).map((label) => (
                    <button
                      key={label}
                      style={{
                        ...s.sanctionBtn,
                        ...(label === "기각" ? s.sanctionBtnGray : {}),
                        ...(label === "경고 발송" ? s.sanctionBtnYellow : {}),
                        ...(label === "7일 정지" ? s.sanctionBtnOrange : {}),
                        ...(label === "30일 정지" ? s.sanctionBtnRed : {}),
                        ...(label === "영구 정지" ? s.sanctionBtnDarkRed : {}),
                      }}
                    >
                      {label}
                    </button>
                  ))}
                </div>
                <textarea
                  style={s.textarea}
                  placeholder="제재 사유를 입력하세요..."
                  rows={3}
                  value={sanctionReason}
                  onChange={(e) => setSanctionReason(e.target.value)}
                />
                <div style={s.actionRow}>
                  <button style={s.cancelBtn} onClick={() => setSelected(null)}>취소</button>
                  <button style={s.applyBtn}>
                    <AlertTriangle size={14} />
                    제재 적용
                  </button>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div style={s.detailEmpty}>
            <AlertTriangle size={32} color="#D1D5DB" />
            <p style={{ color: "#9CA3AF", fontSize: 14, marginTop: 12 }}>신고를 선택하면 상세 내용이 표시됩니다.</p>
          </div>
        )}
      </div>
    </div>
  );
}

function PersonInfo({ label, name, dept, email, phone, highlight }: {
  label: string; name: string; dept: string; email: string; phone: string; highlight?: boolean;
}) {
  return (
    <div style={{ flex: 1 }}>
      <div style={{ fontSize: 11, fontWeight: 700, color: "#9CA3AF", marginBottom: 8, textTransform: "uppercase", letterSpacing: "0.05em" }}>{label}</div>
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <div style={{
          width: 36, height: 36, borderRadius: "50%",
          backgroundColor: highlight ? "#FEF3C7" : "#EEF2FF",
          display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
        }}>
          <User size={16} color={highlight ? "#D97706" : "#4C5BE2"} />
        </div>
        <div>
          <div style={{ fontSize: 14, fontWeight: 700, color: "#111827" }}>{name}</div>
          <div style={{ fontSize: 11, color: "#6B7280" }}>{dept}</div>
        </div>
      </div>
      <div style={{ marginTop: 8, display: "flex", flexDirection: "column", gap: 3 }}>
        <div style={{ fontSize: 11, color: "#6B7280" }}>{email}</div>
        <div style={{ fontSize: 11, color: "#6B7280" }}>{phone}</div>
      </div>
    </div>
  );
}

function StatItem({ label, value, color }: { label: string; value: string; color: string }) {
  return (
    <div style={{ textAlign: "center", flex: 1 }}>
      <div style={{ fontSize: 16, fontWeight: 800, color }}>{value}</div>
      <div style={{ fontSize: 11, color: "#9CA3AF", marginTop: 2 }}>{label}</div>
    </div>
  );
}

function HistoryItem({ date, content }: { date: string; content: string }) {
  return (
    <div style={{ display: "flex", alignItems: "flex-start", gap: 10, padding: "8px 0", borderBottom: "1px solid #F3F4F6" }}>
      <div style={{ width: 6, height: 6, borderRadius: "50%", backgroundColor: "#D1D5DB", marginTop: 5, flexShrink: 0 }} />
      <div>
        <div style={{ fontSize: 11, color: "#9CA3AF", marginBottom: 2 }}>{date}</div>
        <div style={{ fontSize: 13, color: "#374151" }}>{content}</div>
      </div>
    </div>
  );
}

const s: Record<string, React.CSSProperties> = {
  page: { display: "flex", flexDirection: "column", gap: 20, height: "100%" },
  pageHeader: { display: "flex", alignItems: "flex-start", justifyContent: "space-between" },
  pageTitle: { margin: 0, fontSize: 22, fontWeight: 800, color: "#111827" },
  pageSubtitle: { margin: "4px 0 0", fontSize: 13, color: "#6B7280" },

  splitPanel: {
    display: "flex",
    gap: 16,
    flex: 1,
    minHeight: 0,
    alignItems: "flex-start",
  },

  /* LEFT */
  listPanel: {
    flex: "0 0 58%",
    display: "flex",
    flexDirection: "column",
    gap: 12,
    minWidth: 0,
  },
  filterRow: {
    display: "flex",
    gap: 8,
    alignItems: "center",
    flexWrap: "wrap",
  },
  select: {
    padding: "7px 28px 7px 10px",
    borderRadius: 8,
    border: "1px solid #E5E7EB",
    backgroundColor: "#ffffff",
    fontSize: 13,
    color: "#374151",
    cursor: "pointer",
    appearance: "auto",
  },
  searchWrap: {
    display: "flex",
    alignItems: "center",
    gap: 8,
    flex: 1,
    minWidth: 160,
    border: "1px solid #E5E7EB",
    borderRadius: 8,
    backgroundColor: "#ffffff",
    padding: "7px 12px",
  },
  searchInput: {
    border: "none",
    outline: "none",
    fontSize: 13,
    color: "#374151",
    flex: 1,
    backgroundColor: "transparent",
  },
  resetBtn: {
    display: "flex",
    alignItems: "center",
    gap: 5,
    padding: "7px 12px",
    borderRadius: 8,
    border: "1px solid #E5E7EB",
    backgroundColor: "#ffffff",
    fontSize: 13,
    color: "#6B7280",
    cursor: "pointer",
    fontWeight: 600,
    whiteSpace: "nowrap",
  },
  tableWrap: {
    backgroundColor: "#ffffff",
    borderRadius: 12,
    border: "1px solid #E5E7EB",
    overflow: "hidden",
  },
  tableHeader: {
    padding: "12px 16px",
    borderBottom: "1px solid #F3F4F6",
  },
  totalCount: { fontSize: 13, fontWeight: 700, color: "#111827" },
  table: { width: "100%", borderCollapse: "collapse" },
  thead: {
    backgroundColor: "#F9FAFB",
  },
  th: {
    padding: "10px 12px",
    textAlign: "left" as const,
    fontSize: 12,
    fontWeight: 700,
    color: "#6B7280",
    whiteSpace: "nowrap",
  },
  tr: {
    borderTop: "1px solid #F3F4F6",
    cursor: "pointer",
    transition: "background-color 0.1s",
  },
  td: {
    padding: "11px 12px",
    fontSize: 13,
    color: "#111827",
    fontWeight: 500,
  },
  categoryChip: {
    display: "inline-block",
    padding: "2px 8px",
    borderRadius: 4,
    backgroundColor: "#EEF2FF",
    color: "#4C5BE2",
    fontSize: 11,
    fontWeight: 600,
  },
  statusBadge: {
    display: "inline-block",
    padding: "3px 8px",
    borderRadius: 6,
    fontSize: 11,
    fontWeight: 700,
  },
  pagination: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "12px 16px",
    borderTop: "1px solid #F3F4F6",
  },
  pageSizeSelect: {
    padding: "5px 8px",
    borderRadius: 6,
    border: "1px solid #E5E7EB",
    fontSize: 12,
    color: "#374151",
    cursor: "pointer",
  },
  pageButtons: { display: "flex", gap: 4 },
  pageBtn: {
    width: 30,
    height: 30,
    borderRadius: 6,
    border: "1px solid #E5E7EB",
    backgroundColor: "#ffffff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
    fontSize: 12,
    color: "#374151",
    fontWeight: 600,
  },
  pageBtnActive: {
    backgroundColor: "#4C5BE2",
    color: "#ffffff",
    border: "1px solid #4C5BE2",
  },

  /* RIGHT */
  detailPanel: {
    flex: 1,
    backgroundColor: "#ffffff",
    borderRadius: 12,
    border: "1px solid #E5E7EB",
    display: "flex",
    flexDirection: "column",
    minWidth: 0,
    maxHeight: "calc(100vh - 160px)",
    overflow: "hidden",
  },
  detailHeader: {
    display: "flex",
    alignItems: "flex-start",
    justifyContent: "space-between",
    padding: "16px 20px",
    borderBottom: "1px solid #F3F4F6",
    flexShrink: 0,
  },
  detailId: { fontSize: 14, fontWeight: 800, color: "#111827" },
  detailTime: { fontSize: 11, color: "#9CA3AF", marginTop: 2 },
  closeBtn: {
    width: 28, height: 28, borderRadius: 6,
    border: "1px solid #E5E7EB", backgroundColor: "#ffffff",
    display: "flex", alignItems: "center", justifyContent: "center",
    cursor: "pointer",
  },
  detailScroll: {
    flex: 1,
    overflowY: "auto",
    display: "flex",
    flexDirection: "column",
    gap: 0,
  },
  detailEmpty: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#ffffff",
    borderRadius: 12,
    border: "1px solid #E5E7EB",
    minHeight: 300,
  },

  sectionCard: {
    padding: "16px 20px",
    borderBottom: "1px solid #F3F4F6",
  },
  sectionLabel: {
    fontSize: 11,
    fontWeight: 700,
    color: "#9CA3AF",
    textTransform: "uppercase" as const,
    letterSpacing: "0.05em",
    marginBottom: 10,
  },
  twoCol: { display: "flex", gap: 16 },
  chipRow: { display: "flex", flexWrap: "wrap" as const, gap: 6 },
  catChip: {
    padding: "5px 10px",
    borderRadius: 6,
    border: "1px solid #E5E7EB",
    backgroundColor: "#F9FAFB",
    fontSize: 12,
    fontWeight: 600,
    color: "#6B7280",
    cursor: "pointer",
  },
  catChipActive: {
    backgroundColor: "#4C5BE2",
    color: "#ffffff",
    border: "1px solid #4C5BE2",
  },
  contentText: {
    margin: 0,
    fontSize: 13,
    color: "#374151",
    lineHeight: 1.6,
  },
  statsRow: {
    display: "flex",
    gap: 8,
    padding: "12px 0",
  },

  historyList: { display: "flex", flexDirection: "column" },

  sanctionBtns: {
    display: "flex",
    gap: 6,
    flexWrap: "wrap" as const,
    marginBottom: 12,
  },
  sanctionBtn: {
    padding: "6px 12px",
    borderRadius: 7,
    border: "1px solid transparent",
    fontSize: 12,
    fontWeight: 700,
    cursor: "pointer",
  },
  sanctionBtnGray: { backgroundColor: "#F9FAFB", color: "#6B7280", border: "1px solid #E5E7EB" },
  sanctionBtnYellow: { backgroundColor: "#FFFBEB", color: "#92400E", border: "1px solid #FDE68A" },
  sanctionBtnOrange: { backgroundColor: "#FFF7ED", color: "#C2410C", border: "1px solid #FED7AA" },
  sanctionBtnRed: { backgroundColor: "#FFF1F2", color: "#BE123C", border: "1px solid #FECDD3" },
  sanctionBtnDarkRed: { backgroundColor: "#7F1D1D", color: "#ffffff", border: "1px solid #7F1D1D" },
  textarea: {
    width: "100%",
    padding: "10px 12px",
    borderRadius: 8,
    border: "1px solid #E5E7EB",
    fontSize: 13,
    color: "#374151",
    resize: "vertical" as const,
    fontFamily: "inherit",
    outline: "none",
    boxSizing: "border-box" as const,
    marginBottom: 12,
  },
  actionRow: {
    display: "flex",
    gap: 8,
    justifyContent: "flex-end",
  },
  cancelBtn: {
    padding: "8px 16px",
    borderRadius: 8,
    border: "1px solid #E5E7EB",
    backgroundColor: "#ffffff",
    color: "#374151",
    fontSize: 13,
    fontWeight: 600,
    cursor: "pointer",
  },
  applyBtn: {
    display: "flex",
    alignItems: "center",
    gap: 6,
    padding: "8px 16px",
    borderRadius: 8,
    border: "none",
    backgroundColor: "#EF4444",
    color: "#ffffff",
    fontSize: 13,
    fontWeight: 700,
    cursor: "pointer",
  },
};
