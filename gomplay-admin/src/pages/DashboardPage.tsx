import {
  Activity,
  Calendar,
  Heart,
  PenLine,
  ShieldAlert,
  TrendingDown,
  TrendingUp,
  UserPlus,
  Users,
  Zap,
} from "lucide-react";
import { REPORT_STATUS_STYLE } from "../types/report";
import {
  Area,
  AreaChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { useNavigate } from "react-router-dom";

/* ── Mock data ── */
const CHART_DATA = [
  { date: "05/12(월)", count: 120 },
  { date: "05/13(화)", count: 152 },
  { date: "05/14(수)", count: 98 },
  { date: "05/15(목)", count: 182 },
  { date: "05/16(금)", count: 210 },
  { date: "05/17(토)", count: 198 },
  { date: "05/18(일)", count: 236 },
];

const REPORT_PIE = [
  { name: "대기중", value: 32, color: "#F97316" },
  { name: "경고", value: 6, color: "#FBBF24" },
  { name: "정지", value: 5, color: "#EC4899" },
  { name: "기각", value: 3, color: "#D1D5DB" },
];

const RECENT_REPORTS = [
  {
    id: 1,
    createdAt: "2025-05-18 14:32",
    reporter: "김운동 (체육학과)",
    reportee: "이웰스 (스포츠과학과)",
    category: "욕설·괴롭힘",
    content: "운동 중 지속적으로 욕설을 사용...",
    status: "대기중",
  },
  {
    id: 2,
    createdAt: "2025-05-18 11:05",
    reporter: "박웰스 (체육학과)",
    reportee: "최러닝 (스포츠과학과)",
    category: "불쾌한 행동",
    content: "운동 후 불쾌한 언행과 연락을...",
    status: "대기중",
  },
  {
    id: 3,
    createdAt: "2025-05-18 09:41",
    reporter: "이지혜 (스포츠의학과)",
    reportee: "정피티 (체육학과)",
    category: "금전 요구·사기",
    content: "개인 레슨을 강요하며 금전을...",
    status: "대기중",
  },
];

const KPI_CARDS = [
  {
    label: "전체 가입자 수",
    value: "12,854명",
    trend: "+2.4%",
    trendLabel: "지난주 대비",
    up: true,
    icon: Users,
    iconBg: "#EEF2FF",
    iconColor: "#4C5BE2",
  },
  {
    label: "오늘 신규 가입",
    value: "128명",
    trend: "+18.7%",
    trendLabel: "어제 대비",
    up: true,
    icon: UserPlus,
    iconBg: "#DCFCE7",
    iconColor: "#16A34A",
  },
  {
    label: "오늘 성사된 매칭 수",
    value: "236건",
    trend: "+12.3%",
    trendLabel: "어제 대비",
    up: true,
    icon: Zap,
    iconBg: "#F3E8FF",
    iconColor: "#7C3AED",
  },
  {
    label: "미처리 신고 수",
    value: "32건",
    trend: "▲ 8건",
    trendLabel: "어제 대비",
    up: false,
    icon: ShieldAlert,
    iconBg: "#FFF7ED",
    iconColor: "#F97316",
  },
  {
    label: "평균 매너온도",
    value: "72.3°C",
    trend: "▼ 1.2°C",
    trendLabel: "지난주 대비",
    up: false,
    icon: Heart,
    iconBg: "#FFF1F2",
    iconColor: "#F43F5E",
  },
];

const SERVICE_STATUS = [
  { icon: <span style={{ width: 10, height: 10, borderRadius: 999, backgroundColor: "#22C55E", display: "inline-block" }} />, label: "현재 접속 중 사용자", value: "523명" },
  { icon: <Activity size={16} color="#4C5BE2" />, label: "진행 중인 매칭", value: "156건" },
  { icon: <PenLine size={16} color="#6B7280" />, label: "오늘 완료된 운동 후기", value: "89건" },
  { icon: <Calendar size={16} color="#4C5BE2" />, label: "등록된 운동 모임", value: "412개" },
];

const REPORT_PIE_TOTAL = REPORT_PIE.reduce((sum, item) => sum + item.value, 0);

/* ── Custom donut label ── */
const renderDonutCenter = ({ cx, cy }: { cx: number; cy: number }) => (
  <>
    <text x={cx} y={cy - 8} textAnchor="middle" fill="#111827" fontSize={13} fontWeight={600}>총</text>
    <text x={cx} y={cy + 12} textAnchor="middle" fill="#111827" fontSize={20} fontWeight={800}>{REPORT_PIE_TOTAL}건</text>
  </>
);

export default function DashboardPage() {
  const navigate = useNavigate();

  return (
    <div>
      {/* Page header */}
      <div style={s.pageHeader}>
        <div>
          <h1 style={s.pageTitle}>대시보드</h1>
          <p style={s.pageDesc}>서비스 운영 현황을 한눈에 확인하세요.</p>
        </div>
        <div style={s.datePicker}>
          <Calendar size={14} color="#6B7280" />
          <span style={{ fontSize: 13, fontWeight: 600, color: "#374151" }}>2025-05-18 (일)</span>
          <span style={{ fontSize: 12, color: "#9CA3AF" }}>▼</span>
        </div>
      </div>

      {/* KPI cards */}
      <div style={s.kpiRow}>
        {KPI_CARDS.map((card) => {
          const Icon = card.icon;
          return (
            <div key={card.label} style={s.kpiCard}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                <div>
                  <p style={s.kpiLabel}>{card.label}</p>
                  <p style={s.kpiValue}>{card.value}</p>
                </div>
                <div style={{ ...s.kpiIconWrap, backgroundColor: card.iconBg }}>
                  <Icon size={22} color={card.iconColor} />
                </div>
              </div>
              <div style={s.kpiTrendRow}>
                {card.up
                  ? <TrendingUp size={13} color="#22C55E" />
                  : <TrendingDown size={13} color="#EF4444" />
                }
                <span style={{ ...s.kpiTrend, color: card.up ? "#22C55E" : "#EF4444" }}>
                  {card.trend}
                </span>
                <span style={s.kpiTrendLabel}>{card.trendLabel}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Charts row */}
      <div style={s.twoCol}>
        {/* Line chart */}
        <div style={{ ...s.card, flex: 3 }}>
          <div style={s.cardHeader}>
            <span style={s.cardTitle}>일별 매칭 수</span>
            <div style={s.selectBox}>
              <span>최근 7일</span>
              <span style={{ fontSize: 11, color: "#9CA3AF" }}>▼</span>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={CHART_DATA} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#4C5BE2" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="#4C5BE2" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" vertical={false} />
              <XAxis dataKey="date" tick={{ fontSize: 11, fill: "#9CA3AF" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: "#9CA3AF" }} axisLine={false} tickLine={false} />
              <Tooltip
                contentStyle={{ fontSize: 12, borderRadius: 8, border: "1px solid #E5E7EB" }}
                formatter={(v: number) => [`${v}건`, "매칭 수"]}
              />
              <Area
                type="monotone"
                dataKey="count"
                stroke="#4C5BE2"
                strokeWidth={2.5}
                fill="url(#areaGrad)"
                dot={{ fill: "#4C5BE2", r: 4, strokeWidth: 0 }}
                activeDot={{ r: 6 }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Donut chart */}
        <div style={{ ...s.card, flex: 2 }}>
          <div style={s.cardHeader}>
            <span style={s.cardTitle}>신고 현황</span>
            <button
              onClick={() => navigate("/reports")}
              style={s.linkBtn}
            >
              전체 보기 &rsaquo;
            </button>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <PieChart width={160} height={160}>
              <Pie
                data={REPORT_PIE}
                cx={75}
                cy={75}
                innerRadius={52}
                outerRadius={72}
                dataKey="value"
                strokeWidth={0}
                labelLine={false}
              >
                {REPORT_PIE.map((entry) => (
                  <Cell key={entry.name} fill={entry.color} />
                ))}
              </Pie>
              {renderDonutCenter({ cx: 76, cy: 76 })}
            </PieChart>
            <div style={{ display: "flex", flexDirection: "column", gap: 10, flex: 1 }}>
              {REPORT_PIE.map((item) => (
                <div key={item.name} style={s.legendRow}>
                  <span style={{ ...s.legendDot, backgroundColor: item.color }} />
                  <span style={s.legendLabel}>{item.name}</span>
                  <span style={s.legendValue}>
                    {item.value}건 ({((item.value / REPORT_PIE_TOTAL) * 100).toFixed(1)}%)
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom row */}
      <div style={s.twoCol}>
        {/* Recent reports */}
        <div style={{ ...s.card, flex: 3 }}>
          <div style={s.cardHeader}>
            <span style={s.cardTitle}>최근 미처리 신고</span>
            <button onClick={() => navigate("/reports")} style={s.linkBtn}>
              전체 보기 &rsaquo;
            </button>
          </div>
          <table style={s.table}>
            <thead>
              <tr>
                {["신고 일시", "신고자", "피신고자", "신고 유형", "신고 내용", "처리 상태"].map((h) => (
                  <th key={h} style={s.th}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {RECENT_REPORTS.map((r) => (
                <tr key={r.id} style={s.tr}>
                  <td style={s.td}>{r.createdAt}</td>
                  <td style={s.td}>{r.reporter}</td>
                  <td style={s.td}>{r.reportee}</td>
                  <td style={s.td}>{r.category}</td>
                  <td style={{ ...s.td, color: "#6B7280", maxWidth: 160 }}>{r.content}</td>
                  <td style={s.td}>
                    <span style={{ ...s.statusBadge, ...REPORT_STATUS_STYLE[r.status as keyof typeof REPORT_STATUS_STYLE] }}>{r.status}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Service status */}
        <div style={{ ...s.card, flex: 2 }}>
          <div style={s.cardHeader}>
            <span style={s.cardTitle}>서비스 현황</span>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
            {SERVICE_STATUS.map((item) => (
              <div key={item.label} style={s.statusRow}>
                <div style={s.statusLeft}>
                  {item.icon}
                  <span style={s.statusLabel}>{item.label}</span>
                </div>
                <span style={s.statusValue}>{item.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

const s: Record<string, React.CSSProperties> = {
  pageHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 24,
  },
  pageTitle: {
    margin: "0 0 4px",
    fontSize: 24,
    fontWeight: 800,
    color: "#111827",
  },
  pageDesc: {
    margin: 0,
    fontSize: 13,
    color: "#6B7280",
  },
  datePicker: {
    display: "flex",
    alignItems: "center",
    gap: 7,
    padding: "7px 14px",
    border: "1px solid #E5E7EB",
    borderRadius: 8,
    backgroundColor: "#ffffff",
    cursor: "pointer",
  },

  /* KPI */
  kpiRow: {
    display: "flex",
    gap: 14,
    marginBottom: 20,
  },
  kpiCard: {
    flex: 1,
    backgroundColor: "#ffffff",
    borderRadius: 12,
    padding: "18px 18px 14px",
    boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
    display: "flex",
    flexDirection: "column",
    gap: 12,
  },
  kpiLabel: {
    margin: "0 0 6px",
    fontSize: 12,
    fontWeight: 600,
    color: "#6B7280",
  },
  kpiValue: {
    margin: 0,
    fontSize: 22,
    fontWeight: 800,
    color: "#111827",
  },
  kpiIconWrap: {
    width: 44,
    height: 44,
    borderRadius: 12,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  kpiTrendRow: {
    display: "flex",
    alignItems: "center",
    gap: 4,
  },
  kpiTrend: {
    fontSize: 12,
    fontWeight: 700,
  },
  kpiTrendLabel: {
    fontSize: 11,
    color: "#9CA3AF",
  },

  /* Charts / cards */
  twoCol: {
    display: "flex",
    gap: 16,
    marginBottom: 20,
  },
  card: {
    backgroundColor: "#ffffff",
    borderRadius: 12,
    padding: "18px 20px",
    boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
  },
  cardHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: 800,
    color: "#111827",
  },
  selectBox: {
    display: "flex",
    alignItems: "center",
    gap: 6,
    padding: "5px 10px",
    border: "1px solid #E5E7EB",
    borderRadius: 6,
    fontSize: 12,
    fontWeight: 600,
    color: "#374151",
    cursor: "pointer",
  },
  linkBtn: {
    border: "none",
    background: "none",
    fontSize: 13,
    fontWeight: 600,
    color: "#4C5BE2",
    cursor: "pointer",
    padding: 0,
  },

  /* Donut legend */
  legendRow: {
    display: "flex",
    alignItems: "center",
    gap: 8,
  },
  legendDot: {
    width: 10,
    height: 10,
    borderRadius: 999,
    flexShrink: 0,
  },
  legendLabel: {
    fontSize: 12,
    fontWeight: 600,
    color: "#374151",
    flex: 1,
  },
  legendValue: {
    fontSize: 12,
    fontWeight: 700,
    color: "#111827",
    whiteSpace: "nowrap",
  },

  /* Table */
  table: {
    width: "100%",
    borderCollapse: "collapse",
  },
  th: {
    textAlign: "left",
    padding: "8px 10px",
    fontSize: 11,
    fontWeight: 700,
    color: "#6B7280",
    borderBottom: "1px solid #F3F4F6",
    whiteSpace: "nowrap",
  },
  tr: {
    borderBottom: "1px solid #F9FAFB",
  },
  td: {
    padding: "10px 10px",
    fontSize: 12,
    color: "#111827",
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
  },
  statusBadge: {
    display: "inline-block",
    padding: "3px 9px",
    borderRadius: 6,
    fontSize: 11,
    fontWeight: 700,
  },

  /* Service status */
  statusRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "12px 0",
    borderBottom: "1px solid #F9FAFB",
  },
  statusLeft: {
    display: "flex",
    alignItems: "center",
    gap: 10,
  },
  statusLabel: {
    fontSize: 13,
    color: "#374151",
    fontWeight: 600,
  },
  statusValue: {
    fontSize: 15,
    fontWeight: 800,
    color: "#111827",
  },
};
