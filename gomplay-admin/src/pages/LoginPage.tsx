import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem("accessToken", "mock-admin-token");
    navigate("/");
  };

  return (
    <div style={styles.wrapper}>
      <div style={styles.card}>
        <h1 style={styles.title}>Gomplay Admin</h1>
        <form onSubmit={handleSubmit} style={styles.form}>
          <label style={styles.label}>이메일</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={styles.input}
            placeholder="admin@example.com"
            required
          />
          <label style={styles.label}>비밀번호</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={styles.input}
            placeholder="••••••••"
            required
          />
          <button type="submit" style={styles.button}>
            로그인
          </button>
        </form>
      </div>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  wrapper: {
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#f1f5f9",
  },
  card: {
    width: 360,
    backgroundColor: "#ffffff",
    borderRadius: 16,
    padding: "40px 32px",
    boxShadow: "0 4px 24px rgba(0,0,0,0.08)",
  },
  title: {
    margin: "0 0 28px",
    fontSize: 24,
    fontWeight: 800,
    color: "#4C5BE2",
    textAlign: "center",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: 8,
  },
  label: {
    fontSize: 13,
    fontWeight: 600,
    color: "#374151",
    marginTop: 8,
  },
  input: {
    height: 44,
    borderRadius: 8,
    border: "1px solid #D1D5DB",
    padding: "0 12px",
    fontSize: 14,
    outline: "none",
  },
  button: {
    marginTop: 16,
    height: 48,
    borderRadius: 10,
    border: "none",
    backgroundColor: "#4C5BE2",
    color: "#ffffff",
    fontSize: 15,
    fontWeight: 700,
    cursor: "pointer",
  },
};
