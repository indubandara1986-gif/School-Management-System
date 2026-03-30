// SRP: Renders the role-aware dashboard — no data fetching, purely presentational.
// OCP: STATS and MODULES are data-driven per role — add new roles without changing layout.

import { useAuth } from "../../context/AuthContext";
import { ROLE_META, PERMISSIONS } from "../../constants";
import PageShell from "../ui/PageShell";
import { card, chip } from "../../utils/styles";

const ROLE_STATS = {
  Admin:      [{ label:"Total Students",value:"1,240",icon:"🎓",color:"#6366f1"},{ label:"Teachers",value:"86",icon:"📚",color:"#3b82f6"},{ label:"Classes",value:"42",icon:"🏫",color:"#10b981"},{ label:"Fees Collected",value:"94%",icon:"💰",color:"#f59e0b"},{ label:"Avg Attendance",value:"91%",icon:"📋",color:"#8b5cf6"}],
  Principal:  [{ label:"Total Students",value:"1,240",icon:"🎓",color:"#6366f1"},{ label:"Teachers",value:"86",icon:"📚",color:"#3b82f6"},{ label:"Classes",value:"42",icon:"🏫",color:"#10b981"},{ label:"Avg Attendance",value:"91%",icon:"📋",color:"#8b5cf6"}],
  Teacher:    [{ label:"Total Students",value:"1,240",icon:"🎓",color:"#6366f1"},{ label:"Classes",value:"42",icon:"🏫",color:"#10b981"},{ label:"Avg Attendance",value:"91%",icon:"📋",color:"#8b5cf6"}],
  Student:    [{ label:"My Attendance",value:"88%",icon:"✅",color:"#10b981"},{ label:"My Grade Avg",value:"76%",icon:"📊",color:"#6366f1"},{ label:"Pending Fees",value:"Rs. 0",icon:"💳",color:"#f59e0b"}],
  Parent:     [{ label:"My Attendance",value:"88%",icon:"✅",color:"#10b981"},{ label:"My Grade Avg",value:"76%",icon:"📊",color:"#6366f1"},{ label:"Pending Fees",value:"Rs. 0",icon:"💳",color:"#f59e0b"}],
  Accountant: [{ label:"Fees Collected",value:"94%",icon:"💰",color:"#f59e0b"},{ label:"Total Students",value:"1,240",icon:"🎓",color:"#6366f1"}],
};

const ROLE_MODULES = {
  Admin:      ["User Management","User Overview","Grade Reports","Attendance","Fee Management","Settings"],
  Principal:  ["User Overview","Grade Reports","Attendance","Teacher Management"],
  Teacher:    ["Grade Entry","Attendance","My Classes","Schedule"],
  Student:    ["My Grades","My Attendance","Schedule","Notices"],
  Parent:     ["Child's Grades","Attendance","Fee Status","Notices"],
  Accountant: ["Fee Collection","Reports","Pending Dues","Receipts"],
};

export default function DashboardPage() {
  const { user, hasPerm } = useAuth();
  const stats   = ROLE_STATS[user.role]   || [];
  const modules = ROLE_MODULES[user.role] || [];

  return (
    <PageShell
      title={`Hello, ${user.name.split(" ")[0]}! 👋`}
      subtitle={new Date().toLocaleDateString("en-US", { weekday:"long", year:"numeric", month:"long", day:"numeric" })}
    >
      {/* Welcome banner */}
      <div style={{ background: "linear-gradient(135deg,#1e1b4b,#4338ca)", borderRadius: 20, padding: "28px 36px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <div style={{ fontSize: 20, fontWeight: 700, color: "white", marginBottom: 6 }}>Welcome to your {user.role} Dashboard</div>
          <div style={{ fontSize: 14, color: "rgba(255,255,255,0.7)" }}>Manage your tasks and view your data below.</div>
        </div>
        <div style={{ background: "rgba(255,255,255,0.15)", borderRadius: 12, padding: "10px 20px", color: "white", fontWeight: 700, fontSize: 15 }}>
          {ROLE_META[user.role]?.icon} {user.role}
        </div>
      </div>

      {/* Stats */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(200px,1fr))", gap: 14 }}>
        {stats.map(s => (
          <div key={s.label} style={{ ...card, display: "flex", gap: 14, alignItems: "center" }}>
            <div style={{ width: 48, height: 48, borderRadius: 12, background: s.color + "18", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, flexShrink: 0 }}>{s.icon}</div>
            <div>
              <div style={{ fontSize: 22, fontWeight: 800, color: s.color }}>{s.value}</div>
              <div style={{ fontSize: 13, color: "#64748b", marginTop: 2 }}>{s.label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Modules */}
      <div style={card}>
        <div style={{ fontSize: 16, fontWeight: 700, color: "#0f172a", marginBottom: 16 }}>Your Modules</div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(180px,1fr))", gap: 10 }}>
          {modules.map((m, i) => (
            <div key={i} style={{ border: "1.5px solid #e2e8f0", borderRadius: 12, padding: "14px 16px", display: "flex", alignItems: "center", gap: 12, cursor: "pointer" }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = "#6366f1"; e.currentTarget.style.background = "#f5f3ff"; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = "#e2e8f0"; e.currentTarget.style.background = "white"; }}>
              <div style={{ width: 3, height: 22, background: "linear-gradient(#4338ca,#6366f1)", borderRadius: 2, flexShrink: 0 }} />
              <span style={{ flex: 1, fontSize: 13, fontWeight: 600, color: "#374151" }}>{m}</span>
              <span style={{ color: "#94a3b8" }}>→</span>
            </div>
          ))}
        </div>
      </div>

      {/* Permissions */}
      <div style={card}>
        <div style={{ fontSize: 16, fontWeight: 700, color: "#0f172a", marginBottom: 16 }}>Your Permissions</div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(220px,1fr))", gap: 8 }}>
          {Object.keys(PERMISSIONS).map(p => {
            const granted = hasPerm(p);
            const label = p.replace(/_/g, " ").toLowerCase().replace(/\b\w/g, l => l.toUpperCase());
            return (
              <div key={p} style={{ display: "flex", alignItems: "center", gap: 10, padding: "9px 14px", borderRadius: 8, border: `1.5px solid ${granted ? "#86efac" : "#e2e8f0"}`, background: granted ? "#f0fdf4" : "#f8fafc" }}>
                <span>{granted ? "✅" : "🔒"}</span>
                <span style={{ fontSize: 13, fontWeight: 500, color: granted ? "#15803d" : "#94a3b8" }}>{label}</span>
              </div>
            );
          })}
        </div>
      </div>
    </PageShell>
  );
}
