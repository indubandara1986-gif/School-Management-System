// SRP: Handles only login form state and submission.
// DIP: Depends on useAuth abstraction — never calls API directly.

import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { DEMO_CREDS } from "../../constants/roles";
import { inp, btn } from "../../utils/styles";
import AuthLeft from "./AuthLeft";
import Flash from "../ui/Flash";
import Spinner from "../ui/Spinner";

export default function LoginPage({ onForgot, onSignup }) {
  const { login } = useAuth();
  const [email,   setEmail]   = useState("");
  const [password, setPass]   = useState("");
  const [error,   setError]   = useState("");
  const [loading, setLoading] = useState(false);
  const [showPw,  setShowPw]  = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    const r = await login(email, password);
    if (!r.success) setError(r.message);
    setLoading(false);
  };

  return (
    <div style={{ display: "flex", minHeight: "100vh", fontFamily: "'DM Sans',sans-serif" }}>
      <AuthLeft />
      <div style={{ flex: 1, background: "#f8fafc", display: "flex", alignItems: "center", justifyContent: "center", padding: 40 }}>
        <div style={{ background: "white", borderRadius: 24, padding: 48, width: "100%", maxWidth: 440, boxShadow: "0 20px 60px rgba(0,0,0,0.08)" }}>
          <div style={{ marginBottom: 32 }}>
            <div style={{ fontFamily: "'Playfair Display',serif", fontSize: 28, color: "#0f172a", fontWeight: 700, marginBottom: 6 }}>Welcome back</div>
            <div style={{ fontSize: 15, color: "#64748b" }}>Sign in to your account</div>
          </div>

          <form onSubmit={submit} style={{ display: "flex", flexDirection: "column", gap: 18 }}>
            <div style={{ display: "flex", flexDirection: "column", gap: 7 }}>
              <label style={{ fontSize: 12, fontWeight: 600, color: "#374151", textTransform: "uppercase", letterSpacing: "0.5px" }}>Email</label>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)}
                placeholder="you@school.lk" required style={inp}
                onFocus={e => e.target.style.borderColor = "#6366f1"}
                onBlur={e => e.target.style.borderColor = "#e2e8f0"} />
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 7 }}>
              <label style={{ fontSize: 12, fontWeight: 600, color: "#374151", textTransform: "uppercase", letterSpacing: "0.5px" }}>Password</label>
              <div style={{ position: "relative" }}>
                <input type={showPw ? "text" : "password"} value={password} onChange={e => setPass(e.target.value)}
                  placeholder="••••••••" required style={{ ...inp, paddingRight: 60 }}
                  onFocus={e => e.target.style.borderColor = "#6366f1"}
                  onBlur={e => e.target.style.borderColor = "#e2e8f0"} />
                <button type="button" onClick={() => setShowPw(p => !p)}
                  style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", color: "#6366f1", fontSize: 11, fontWeight: 700, cursor: "pointer" }}>
                  {showPw ? "HIDE" : "SHOW"}
                </button>
              </div>
            </div>

            {error && <Flash msg={error} ok={false} />}

            <button type="submit" disabled={loading}
              style={{ ...btn(), padding: 13, fontSize: 15, display: "flex", alignItems: "center", justifyContent: "center", gap: 8, opacity: loading ? 0.8 : 1 }}>
              {loading && <Spinner size={16} />}
              {loading ? "Signing in…" : "Sign In"}
            </button>

            <button type="button" onClick={onForgot}
              style={{ background: "none", border: "none", color: "#6366f1", fontSize: 14, fontWeight: 500, cursor: "pointer" }}>
              Forgot your password?
            </button>
          </form>

          {/* Quick demo login */}
          <div style={{ marginTop: 24 }}>
            <div style={{ textAlign: "center", fontSize: 12, color: "#94a3b8", textTransform: "uppercase", letterSpacing: 1, marginBottom: 12 }}>
              Quick Login Demo
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8 }}>
              {DEMO_CREDS.map(c => (
                <button key={c.role}
                  onClick={() => { setEmail(c.email); setPass(c.password); setError(""); }}
                  style={{ padding: "8px 10px", border: `1.5px solid ${c.color}`, borderRadius: 8, background: "none", color: c.color, fontSize: 12, fontWeight: 600, display: "flex", alignItems: "center", gap: 6, cursor: "pointer" }}>
                  <span style={{ width: 6, height: 6, borderRadius: "50%", background: c.color, flexShrink: 0 }} />
                  {c.role}
                </button>
              ))}
            </div>
          </div>

          <div style={{ marginTop: 20, textAlign: "center", paddingTop: 18, borderTop: "1px solid #f1f5f9" }}>
            <span style={{ fontSize: 14, color: "#64748b" }}>Don't have an account? </span>
            <button onClick={onSignup} style={{ background: "none", border: "none", color: "#6366f1", fontSize: 14, fontWeight: 600, cursor: "pointer" }}>
              Create account →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
