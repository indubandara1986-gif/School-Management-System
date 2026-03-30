// SRP: Handles multi-step signup flow only.
// OCP: Steps are data-driven — adding a step doesn't require restructuring.

import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { ROLES, ROLE_META } from "../../constants/roles";
import { inp, btn, card, chip, sel } from "../../utils/styles";
import AuthLeft from "./AuthLeft";
import Flash from "../ui/Flash";
import Spinner from "../ui/Spinner";

function StepIndicator({ step }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 24 }}>
      {[1, 2].map(s => (
        <div key={s} style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <div style={{ width: 28, height: 28, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 700, background: step >= s ? "linear-gradient(135deg,#4338ca,#6366f1)" : "#f1f5f9", color: step >= s ? "white" : "#94a3b8" }}>
            {step > s ? "✓" : s}
          </div>
          <span style={{ fontSize: 12, color: step >= s ? "#4338ca" : "#94a3b8", fontWeight: step >= s ? 600 : 400 }}>
            {s === 1 ? "Choose Role" : "Your Details"}
          </span>
          {s < 2 && <div style={{ width: 28, height: 2, background: step > s ? "#6366f1" : "#e2e8f0", borderRadius: 1, margin: "0 2px" }} />}
        </div>
      ))}
    </div>
  );
}

function RoleSelector({ onSelect }) {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
      {ROLES.map(r => {
        const m = ROLE_META[r];
        const DESC = { Admin: "Full system access", Principal: "Leadership & oversight", Teacher: "Classes & grades", Student: "View grades & schedule", Parent: "Monitor child", Accountant: "Finance management" };
        return (
          <button key={r} onClick={() => onSelect(r)}
            style={{ padding: "16px 12px", border: "2px solid #e2e8f0", borderRadius: 14, background: "white", textAlign: "left", cursor: "pointer", display: "flex", flexDirection: "column", gap: 8 }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = m.color; e.currentTarget.style.background = m.bg; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = "#e2e8f0"; e.currentTarget.style.background = "white"; }}>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span style={{ fontSize: 22 }}>{m.icon}</span>
              <span style={{ ...chip(r, m.color, m.bg, m.border) }}>{r}</span>
            </div>
            <div style={{ fontSize: 12, color: "#64748b" }}>{DESC[r]}</div>
          </button>
        );
      })}
    </div>
  );
}

export default function SignupPage({ onLogin }) {
  const { signup } = useAuth();
  const [step,    setStep]   = useState(1);
  const [role,    setRole]   = useState(null);
  const [form,    setForm]   = useState({ name: "", email: "", password: "", confirmPassword: "", department: "", phone: "" });
  const [error,   setError]  = useState("");
  const [loading, setLoad]   = useState(false);
  const [showPw,  setShowPw] = useState(false);

  const set = (k, v) => { setForm(p => ({ ...p, [k]: v })); setError(""); };

  const submit = async (e) => {
    e.preventDefault();
    if (!form.name.trim()) { setError("Full name is required."); return; }
    if (form.password.length < 6) { setError("Password must be at least 6 characters."); return; }
    if (form.password !== form.confirmPassword) { setError("Passwords do not match."); return; }
    setLoad(true);
    const r = await signup({ name: form.name.trim(), email: form.email.trim(), password: form.password, role, department: form.department.trim(), phone: form.phone.trim() });
    setLoad(false);
    if (!r.success) setError(r.message);
  };

  return (
    <div style={{ display: "flex", minHeight: "100vh", fontFamily: "'DM Sans',sans-serif" }}>
      <AuthLeft />
      <div style={{ flex: 1, background: "#f8fafc", display: "flex", alignItems: "center", justifyContent: "center", padding: "32px 40px", overflowY: "auto" }}>
        <div style={{ ...card, width: "100%", maxWidth: 500, padding: "40px 44px" }}>
          <StepIndicator step={step} />

          {step === 1 && (
            <>
              <div style={{ marginBottom: 20 }}>
                <div style={{ fontFamily: "'Playfair Display',serif", fontSize: 26, fontWeight: 700, color: "#0f172a", marginBottom: 6 }}>Create your account</div>
                <div style={{ fontSize: 14, color: "#64748b" }}>Select your role to get started</div>
              </div>
              <RoleSelector onSelect={r => { setRole(r); setStep(2); }} />
              <div style={{ marginTop: 20, textAlign: "center", paddingTop: 16, borderTop: "1px solid #f1f5f9" }}>
                <span style={{ fontSize: 14, color: "#64748b" }}>Already have an account? </span>
                <button onClick={onLogin} style={{ background: "none", border: "none", color: "#6366f1", fontSize: 14, fontWeight: 600, cursor: "pointer" }}>Sign in →</button>
              </div>
            </>
          )}

          {step === 2 && (
            <>
              <div style={{ marginBottom: 20 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
                  <button onClick={() => { setStep(1); setError(""); }} style={{ ...btn("#f1f5f9", "#64748b"), padding: "6px 12px", fontSize: 12 }}>← Back</button>
                  {role && (() => { const m = ROLE_META[role]; return <span style={{ ...chip(`Signing up as ${role}`, m.color, m.bg, m.border), fontSize: 12 }}>{m.icon} Signing up as {role}</span>; })()}
                </div>
                <div style={{ fontFamily: "'Playfair Display',serif", fontSize: 26, fontWeight: 700, color: "#0f172a", marginBottom: 4 }}>Your details</div>
                <div style={{ fontSize: 14, color: "#64748b" }}>Fill in your information to create your account</div>
              </div>

              {error && <Flash msg={error} ok={false} />}

              <form onSubmit={submit} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                {[["Full Name","name","text"],["Email Address","email","email"]].map(([l,k,t]) => (
                  <div key={k} style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                    <label style={{ fontSize: 12, fontWeight: 600, color: "#374151", textTransform: "uppercase", letterSpacing: "0.5px" }}>{l} <span style={{ color: "#ef4444" }}>*</span></label>
                    <input type={t} value={form[k]} onChange={e => set(k, e.target.value)} required style={inp}
                      onFocus={e => e.target.style.borderColor = "#6366f1"} onBlur={e => e.target.style.borderColor = "#e2e8f0"} />
                  </div>
                ))}

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                  <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                    <label style={{ fontSize: 12, fontWeight: 600, color: "#374151", textTransform: "uppercase", letterSpacing: "0.5px" }}>Password <span style={{ color: "#ef4444" }}>*</span></label>
                    <div style={{ position: "relative" }}>
                      <input type={showPw ? "text" : "password"} value={form.password} onChange={e => set("password", e.target.value)} required style={{ ...inp, paddingRight: 46 }} />
                      <button type="button" onClick={() => setShowPw(p => !p)} style={{ position: "absolute", right: 10, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", color: "#6366f1", fontSize: 10, fontWeight: 700, cursor: "pointer" }}>
                        {showPw ? "HIDE" : "SHOW"}
                      </button>
                    </div>
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                    <label style={{ fontSize: 12, fontWeight: 600, color: "#374151", textTransform: "uppercase", letterSpacing: "0.5px" }}>Confirm <span style={{ color: "#ef4444" }}>*</span></label>
                    <input type="password" value={form.confirmPassword} onChange={e => set("confirmPassword", e.target.value)} required style={inp} />
                  </div>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                  {[["Department / Class","department","text"],["Phone","phone","tel"]].map(([l,k,t]) => (
                    <div key={k} style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                      <label style={{ fontSize: 12, fontWeight: 600, color: "#374151", textTransform: "uppercase", letterSpacing: "0.5px" }}>{l}</label>
                      <input type={t} value={form[k]} onChange={e => set(k, e.target.value)} style={inp} />
                    </div>
                  ))}
                </div>

                <button type="submit" disabled={loading} style={{ ...btn(), padding: 13, fontSize: 15, display: "flex", alignItems: "center", justifyContent: "center", gap: 8, marginTop: 4 }}>
                  {loading && <Spinner size={16} />}
                  {loading ? "Creating…" : "Create Account →"}
                </button>
              </form>

              <div style={{ marginTop: 18, textAlign: "center" }}>
                <span style={{ fontSize: 14, color: "#64748b" }}>Already have an account? </span>
                <button onClick={onLogin} style={{ background: "none", border: "none", color: "#6366f1", fontSize: 14, fontWeight: 600, cursor: "pointer" }}>Sign in</button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
