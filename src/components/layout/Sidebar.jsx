// SRP: Renders the app sidebar — navigation, user badge, logout.
// OCP: Nav items are data-driven; new entries are added to the NAV array only.

import { useAuth } from "../../context/AuthContext";
import { ROLE_META } from "../../constants/roles";

const NAV_ITEMS = [
  { id: "dashboard",  label: "Dashboard",       icon: "⊞", perm: null },
  { id: "overview",   label: "User Overview",   icon: "👥", perm: "VIEW_USER_OVERVIEW" },
  { id: "grades",     label: "Grade Reports",   icon: "📊", perm: "VIEW_GRADES" },
  { id: "attendance", label: "Attendance",      icon: "📋", perm: "VIEW_ATTENDANCE" },
  { id: "users",      label: "User Management", icon: "⚙",  perm: "MANAGE_USERS" },
  { id: "profile",    label: "My Profile",      icon: "👤", perm: null },
];

export default function Sidebar({ tab, setTab }) {
  const { user, logout, hasPerm } = useAuth();
  const meta = ROLE_META[user.role] || { color: "#6366f1", bg: "#eef2ff" };

  const visibleNav = NAV_ITEMS.filter(n => !n.perm || hasPerm(n.perm));

  return (
    <aside style={{
      width: 260, flexShrink: 0, background: "#0f172a",
      height: "100vh", display: "flex", flexDirection: "column",
      padding: "24px 16px", fontFamily: "'DM Sans',sans-serif",
      position: "sticky", top: 0, overflowY: "auto",
    }}>
      {/* Logo */}
      <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "8px 8px 24px" }}>
        <div style={{ width: 44, height: 44, background: "linear-gradient(135deg,#4338ca,#6366f1)", borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
          <svg width="24" height="24" viewBox="0 0 48 48" fill="none">
            <path d="M24 8L38 16V32L24 40L10 32V16L24 8Z" stroke="white" strokeWidth="2.5" fill="none" />
            <circle cx="24" cy="24" r="3" fill="white" />
          </svg>
        </div>
        <div>
          <div style={{ fontSize: 16, fontWeight: 700, color: "white" }}>Vidyaloka</div>
          <div style={{ fontSize: 11, color: "#475569", textTransform: "uppercase", letterSpacing: 1 }}>School System</div>
        </div>
      </div>

      {/* User badge */}
      <div style={{ display: "flex", alignItems: "center", gap: 10, padding: 12, borderRadius: 12, border: `1.5px solid ${meta.color}44`, background: `${meta.color}0f`, marginBottom: 24 }}>
        <div style={{ width: 36, height: 36, borderRadius: "50%", background: meta.color, color: "white", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 700, flexShrink: 0 }}>
          {user.avatar}
        </div>
        <div style={{ overflow: "hidden" }}>
          <div style={{ fontSize: 13, fontWeight: 600, color: "white", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{user.name}</div>
          <div style={{ fontSize: 11, fontWeight: 600, color: meta.color, textTransform: "uppercase", letterSpacing: "0.5px" }}>{user.role}</div>
        </div>
      </div>

      {/* Nav */}
      <nav style={{ flex: 1, display: "flex", flexDirection: "column", gap: 3 }}>
        <div style={{ fontSize: 10, color: "#334155", fontWeight: 700, letterSpacing: "1.5px", textTransform: "uppercase", padding: "4px 8px 8px" }}>NAVIGATION</div>
        {visibleNav.map(n => (
          <button key={n.id} onClick={() => setTab(n.id)}
            style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 12px", borderRadius: 10, background: tab === n.id ? "rgba(99,102,241,0.2)" : "none", border: "none", color: tab === n.id ? "white" : "#94a3b8", fontSize: 14, fontWeight: tab === n.id ? 600 : 400, textAlign: "left", width: "100%", cursor: "pointer", transition: "all 0.15s" }}
            onMouseEnter={e => { if (tab !== n.id) { e.currentTarget.style.background = "rgba(99,102,241,0.08)"; e.currentTarget.style.color = "#cbd5e1"; } }}
            onMouseLeave={e => { if (tab !== n.id) { e.currentTarget.style.background = "none"; e.currentTarget.style.color = "#94a3b8"; } }}>
            <span style={{ fontSize: 16, width: 20, textAlign: "center", flexShrink: 0 }}>{n.icon}</span>
            <span style={{ flex: 1 }}>{n.label}</span>
            {tab === n.id && <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#6366f1", flexShrink: 0 }} />}
          </button>
        ))}
      </nav>

      {/* Logout */}
      <button onClick={logout}
        style={{ display: "flex", alignItems: "center", gap: 8, padding: "12px 14px", border: "1px solid #1e293b", background: "none", color: "#64748b", borderRadius: 10, fontSize: 14, fontWeight: 500, cursor: "pointer", marginTop: 16, transition: "all 0.15s" }}
        onMouseEnter={e => { e.currentTarget.style.color = "#ef4444"; e.currentTarget.style.borderColor = "#ef4444"; }}
        onMouseLeave={e => { e.currentTarget.style.color = "#64748b"; e.currentTarget.style.borderColor = "#1e293b"; }}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /><polyline points="16 17 21 12 16 7" /><line x1="21" y1="12" x2="9" y2="12" />
        </svg>
        Sign Out
      </button>
    </aside>
  );
}
