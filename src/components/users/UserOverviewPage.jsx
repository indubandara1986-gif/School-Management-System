// SRP: Displays aggregate user stats — fetches its own data via get().
// DIP: Depends on get() abstraction, not fetch() directly.

import { useState, useEffect } from "react";
import { get } from "../../utils/api";
import { ROLES, ROLE_META } from "../../constants/roles";
import { card, chip } from "../../utils/styles";
import PageShell from "../ui/PageShell";
import Flash from "../ui/Flash";
import Spinner from "../ui/Spinner";

export default function UserOverviewPage() {
  const [stats,   setStats]  = useState(null);
  const [loading, setLoad]   = useState(true);
  const [error,   setError]  = useState(null);

  useEffect(() => {
    (async () => {
      try {
        const d = await get("user_stats");
        if (d.success) setStats(d); else setError(d.message);
      } catch { setError("Cannot reach server."); }
      setLoad(false);
    })();
  }, []);

  if (loading) return <PageShell title="User Overview"><div style={{ textAlign: "center", padding: 60 }}><Spinner size={36} /></div></PageShell>;

  const byRole = stats?.by_role || {};
  const total  = stats?.total   || 0;

  return (
    <PageShell title="User Overview" subtitle={`${total} total users across ${Object.keys(byRole).length} roles`}>
      {error && <Flash msg={error} ok={false} />}

      {/* Role cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 14 }}>
        {ROLES.map(role => {
          const m = ROLE_META[role];
          const count = byRole[role] || 0;
          const pct = total > 0 ? ((count / total) * 100).toFixed(0) : 0;
          return (
            <div key={role} style={{ ...card, display: "flex", gap: 16, alignItems: "center" }}>
              <div style={{ width: 56, height: 56, borderRadius: 14, background: m.bg, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 26, flexShrink: 0 }}>{m.icon}</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 28, fontWeight: 800, color: m.color }}>{count}</div>
                <div style={{ fontSize: 14, fontWeight: 600, color: "#374151" }}>{role}s</div>
                <div style={{ marginTop: 6, height: 5, background: "#f1f5f9", borderRadius: 3, overflow: "hidden" }}>
                  <div style={{ width: `${pct}%`, height: "100%", background: m.color, borderRadius: 3, transition: "width 0.6s ease" }} />
                </div>
                <div style={{ fontSize: 11, color: "#94a3b8", marginTop: 3 }}>{pct}% of all users</div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Summary stats */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 14 }}>
        {[
          { label:"Total Users",    value: total,                   icon:"👥", color:"#6366f1" },
          { label:"New This Month", value: stats?.new_this_month||0, icon:"✨", color:"#10b981" },
          { label:"Students",       value: byRole.Student||0,        icon:"🎓", color:"#7c3aed" },
          { label:"Staff",          value: (byRole.Teacher||0)+(byRole.Admin||0)+(byRole.Principal||0)+(byRole.Accountant||0), icon:"🏫", color:"#2563eb" },
        ].map(s => (
          <div key={s.label} style={{ ...card, textAlign: "center" }}>
            <div style={{ fontSize: 28, marginBottom: 6 }}>{s.icon}</div>
            <div style={{ fontSize: 28, fontWeight: 800, color: s.color }}>{s.value}</div>
            <div style={{ fontSize: 13, color: "#64748b", marginTop: 2 }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Recent registrations */}
      {stats?.recent?.length > 0 && (
        <div style={card}>
          <div style={{ fontSize: 17, fontWeight: 700, color: "#0f172a", marginBottom: 16 }}>Recently Joined Users</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {stats.recent.map(u => {
              const m = ROLE_META[u.role] || ROLE_META.Student;
              return (
                <div key={u.id} style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 14px", borderRadius: 10, background: "#f8fafc", border: "1px solid #f1f5f9" }}>
                  <div style={{ width: 40, height: 40, borderRadius: "50%", background: m.bg, color: m.color, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: 14, flexShrink: 0 }}>{u.avatar}</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 600, color: "#0f172a", fontSize: 14 }}>{u.name}</div>
                    <div style={{ fontSize: 12, color: "#94a3b8" }}>{u.department}</div>
                  </div>
                  <span style={{ ...chip(u.role, m.color, m.bg, m.border) }}>{m.icon} {u.role}</span>
                  <div style={{ fontSize: 12, color: "#94a3b8", minWidth: 80, textAlign: "right" }}>Joined {u.joined}</div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Monthly bar chart */}
      {stats?.monthly?.length > 0 && (
        <div style={card}>
          <div style={{ fontSize: 17, fontWeight: 700, color: "#0f172a", marginBottom: 20 }}>Registrations (Last 6 Months)</div>
          <div style={{ display: "flex", gap: 12, alignItems: "flex-end", height: 120 }}>
            {(() => {
              const maxC = Math.max(...stats.monthly.map(m => +m.c), 1);
              return stats.monthly.map(m => (
                <div key={m.m} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
                  <div style={{ fontSize: 12, fontWeight: 700, color: "#6366f1" }}>{m.c}</div>
                  <div style={{ width: "100%", background: "linear-gradient(180deg,#6366f1,#4338ca)", borderRadius: "6px 6px 0 0", height: `${(m.c / maxC) * 90}px`, minHeight: 4 }} />
                  <div style={{ fontSize: 11, color: "#94a3b8", whiteSpace: "nowrap" }}>{m.m.slice(5)}</div>
                </div>
              ));
            })()}
          </div>
        </div>
      )}
    </PageShell>
  );
}
