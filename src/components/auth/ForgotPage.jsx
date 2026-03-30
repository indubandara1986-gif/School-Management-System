// SRP: Handles only the forgot-password flow.

import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { inp, btn, card } from "../../utils/styles";
import Spinner from "../ui/Spinner";

export default function ForgotPage({ onBack }) {
  const { resetPw } = useAuth();
  const [email,   setEmail]  = useState("");
  const [status,  setStatus] = useState(null);
  const [loading, setLoad]   = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setLoad(true);
    setStatus(await resetPw(email));
    setLoad(false);
  };

  return (
    <div style={{ minHeight: "100vh", background: "#f1f5f9", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'DM Sans',sans-serif", padding: 20 }}>
      <div style={{ ...card, maxWidth: 420, width: "100%", textAlign: "center" }}>
        <div style={{ width: 64, height: 64, background: "#eef2ff", borderRadius: 16, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px", fontSize: 28 }}>🔐</div>
        <div style={{ fontSize: 24, fontWeight: 700, color: "#0f172a", marginBottom: 10 }}>Reset Password</div>
        <div style={{ fontSize: 15, color: "#64748b", marginBottom: 28, lineHeight: 1.6 }}>
          Enter your registered email and we'll send you a reset link.
        </div>

        {status ? (
          <div style={{ border: `1.5px solid ${status.success ? "#86efac" : "#fecaca"}`, background: status.success ? "#f0fdf4" : "#fef2f2", borderRadius: 10, padding: 16, color: status.success ? "#16a34a" : "#dc2626", fontSize: 14, marginBottom: 16 }}>
            {status.success ? "✓" : "✗"} {status.message}
            {status.success && <div style={{ marginTop: 12 }}><button onClick={onBack} style={btn()}>Return to Login →</button></div>}
          </div>
        ) : (
          <form onSubmit={submit} style={{ display: "flex", flexDirection: "column", gap: 14, textAlign: "left" }}>
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              <label style={{ fontSize: 12, fontWeight: 600, color: "#374151", textTransform: "uppercase", letterSpacing: "0.5px" }}>Email Address</label>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)} required style={inp} />
            </div>
            <button type="submit" disabled={loading} style={{ ...btn(), padding: 12, display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
              {loading && <Spinner size={15} />}
              {loading ? "Sending…" : "Send Reset Link"}
            </button>
          </form>
        )}

        <button onClick={onBack} style={{ marginTop: 20, background: "none", border: "none", color: "#6366f1", fontSize: 14, fontWeight: 500, cursor: "pointer" }}>
          ← Back to Login
        </button>
      </div>
    </div>
  );
}
