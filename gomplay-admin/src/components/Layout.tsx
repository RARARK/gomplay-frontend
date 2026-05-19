import {
  Activity,
  BarChart2,
  Bell,
  ChevronDown,
  ExternalLink,
  FileText,
  HelpCircle,
  LayoutDashboard,
  LogOut,
  Megaphone,
  Settings,
  ShieldAlert,
  Users,
  Zap,
} from "lucide-react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";

const NAV_ITEMS = [
  { to: "/", label: "대시보드", icon: LayoutDashboard, exact: true },
  { to: "/reports", label: "신고 관리", icon: ShieldAlert },
  { to: "/users", label: "사용자 관리", icon: Users },
  { to: "/matches", label: "매칭 관리", icon: Activity },
  { to: "/contents", label: "콘텐츠 관리", icon: FileText },
  { to: "/stats", label: "통계", icon: BarChart2 },
  { to: "/notices", label: "공지 관리", icon: Megaphone },
  { to: "/settings", label: "설정", icon: Settings },
];

export default function Layout() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    navigate("/login");
  };

  return (
    <div style={s.shell}>
      {/* ── Sidebar ── */}
      <aside style={s.sidebar}>
        {/* Logo */}
        <div style={s.logoRow}>
          <div style={s.logoIcon}>
            <Zap size={16} color="#ffffff" />
          </div>
          <span style={s.logoText}>Gomplay Admin</span>
        </div>

        {/* Nav */}
        <nav style={s.nav}>
          {NAV_ITEMS.map(({ to, label, icon: Icon, exact }) => (
            <NavLink
              key={to}
              to={to}
              end={exact}
              style={({ isActive }) => ({
                ...s.navItem,
                ...(isActive ? s.navItemActive : {}),
              })}
            >
              {({ isActive }) => (
                <>
                  <Icon size={16} color={isActive ? "#ffffff" : "#6B7280"} />
                  <span>{label}</span>
                </>
              )}
            </NavLink>
          ))}
        </nav>

        {/* Help box */}
        <div style={s.helpBox}>
          <div style={s.helpIconRow}>
            <HelpCircle size={16} color="#6B7280" />
            <span style={s.helpTitle}>궁금한 점이 있으신가요?</span>
          </div>
          <p style={s.helpDesc}>관리자 가이드를 확인해보세요.</p>
          <button style={s.helpBtn}>
            가이드 보기
            <ExternalLink size={12} color="#9CA3AF" />
          </button>
        </div>

        {/* Logout */}
        <button onClick={handleLogout} style={s.logoutBtn}>
          <LogOut size={15} color="#6B7280" />
          <span>로그아웃</span>
        </button>
      </aside>

      {/* ── Main ── */}
      <div style={s.main}>
        {/* Topbar */}
        <header style={s.topbar}>
          <div style={s.topbarRight}>
            <div style={s.bellWrap}>
              <Bell size={20} color="#374151" />
              <span style={s.bellBadge}>12</span>
            </div>
            <div style={s.profile}>
              <div style={s.avatar}>
                <Users size={14} color="#ffffff" />
              </div>
              <span style={s.profileName}>관리자</span>
              <ChevronDown size={14} color="#6B7280" />
            </div>
          </div>
        </header>

        {/* Content */}
        <div style={s.content}>
          <Outlet />
        </div>

        <footer style={s.footer}>© 2025 Gomplay. All rights reserved.</footer>
      </div>
    </div>
  );
}

const s: Record<string, React.CSSProperties> = {
  shell: {
    display: "flex",
    minHeight: "100vh",
    backgroundColor: "#f8fafc",
    fontFamily: "system-ui, 'Segoe UI', Roboto, sans-serif",
  },

  /* Sidebar */
  sidebar: {
    width: 220,
    backgroundColor: "#0f172a",
    display: "flex",
    flexDirection: "column",
    flexShrink: 0,
    position: "sticky",
    top: 0,
    height: "100vh",
    overflowY: "auto",
  },
  logoRow: {
    display: "flex",
    alignItems: "center",
    gap: 10,
    padding: "20px 20px 20px",
    borderBottom: "1px solid #1e293b",
  },
  logoIcon: {
    width: 30,
    height: 30,
    borderRadius: 8,
    backgroundColor: "#4C5BE2",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  logoText: {
    fontSize: 15,
    fontWeight: 800,
    color: "#ffffff",
  },
  nav: {
    display: "flex",
    flexDirection: "column",
    gap: 2,
    padding: "16px 10px",
    flex: 1,
  },
  navItem: {
    display: "flex",
    alignItems: "center",
    gap: 10,
    padding: "9px 12px",
    borderRadius: 8,
    fontSize: 13,
    fontWeight: 600,
    color: "#6B7280",
    textDecoration: "none",
    cursor: "pointer",
  },
  navItemActive: {
    backgroundColor: "#4C5BE2",
    color: "#ffffff",
  },

  /* Help box */
  helpBox: {
    margin: "0 10px 8px",
    padding: "14px",
    borderRadius: 10,
    backgroundColor: "#1e293b",
    display: "flex",
    flexDirection: "column",
    gap: 6,
  },
  helpIconRow: {
    display: "flex",
    alignItems: "center",
    gap: 6,
  },
  helpTitle: {
    fontSize: 12,
    fontWeight: 700,
    color: "#E5E7EB",
  },
  helpDesc: {
    margin: 0,
    fontSize: 11,
    color: "#6B7280",
    lineHeight: 1.4,
  },
  helpBtn: {
    display: "flex",
    alignItems: "center",
    gap: 5,
    marginTop: 4,
    padding: "6px 10px",
    borderRadius: 6,
    border: "1px solid #374151",
    backgroundColor: "transparent",
    color: "#9CA3AF",
    fontSize: 11,
    fontWeight: 600,
    cursor: "pointer",
    width: "fit-content",
  },

  /* Logout */
  logoutBtn: {
    display: "flex",
    alignItems: "center",
    gap: 8,
    margin: "0 10px 16px",
    padding: "9px 12px",
    borderRadius: 8,
    border: "none",
    backgroundColor: "transparent",
    color: "#6B7280",
    fontSize: 13,
    fontWeight: 600,
    cursor: "pointer",
    textAlign: "left",
  },

  /* Main */
  main: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    minWidth: 0,
  },
  topbar: {
    height: 56,
    backgroundColor: "#ffffff",
    borderBottom: "1px solid #E5E7EB",
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-end",
    padding: "0 28px",
    gap: 16,
    flexShrink: 0,
    position: "sticky",
    top: 0,
    zIndex: 10,
  },
  topbarRight: {
    display: "flex",
    alignItems: "center",
    gap: 20,
  },
  bellWrap: {
    position: "relative",
    cursor: "pointer",
  },
  bellBadge: {
    position: "absolute",
    top: -6,
    right: -6,
    minWidth: 16,
    height: 16,
    borderRadius: 999,
    backgroundColor: "#EF4444",
    color: "#ffffff",
    fontSize: 9,
    fontWeight: 800,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "0 3px",
  },
  profile: {
    display: "flex",
    alignItems: "center",
    gap: 8,
    cursor: "pointer",
  },
  avatar: {
    width: 30,
    height: 30,
    borderRadius: 999,
    backgroundColor: "#4C5BE2",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  profileName: {
    fontSize: 13,
    fontWeight: 700,
    color: "#111827",
  },
  content: {
    flex: 1,
    padding: 28,
  },
  footer: {
    padding: "16px 28px",
    textAlign: "center",
    fontSize: 12,
    color: "#9CA3AF",
    borderTop: "1px solid #E5E7EB",
  },
};
