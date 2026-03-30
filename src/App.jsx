// SRP: Pure composition — wires auth state to routing, nothing else.
// DIP: Depends on AuthProvider and page-level abstractions only.

import { useState } from "react";
import { AuthProvider, useAuth } from "./context/AuthContext";
import Spinner from "./components/ui/Spinner";

// Auth pages
import LoginPage    from "./components/auth/LoginPage";
import ForgotPage   from "./components/auth/ForgotPage";
import SignupPage    from "./components/auth/SignupPage";

// App layout
import Sidebar      from "./components/layout/Sidebar";

// Feature pages
import DashboardPage       from "./components/dashboard/DashboardPage";
import UserOverviewPage    from "./components/users/UserOverviewPage";
import GradeReportsPage    from "./components/grades/GradeReportsPage";
import AttendancePage      from "./components/attendance/AttendancePage";
import UserManagementPage  from "./components/users/UserManagementPage";
import ProfilePage         from "./components/profile/ProfilePage";

// ── Page router ───────────────────────────────────────────────
const PAGE_MAP = {
  dashboard:  DashboardPage,
  overview:   UserOverviewPage,
  grades:     GradeReportsPage,
  attendance: AttendancePage,
  users:      UserManagementPage,
  profile:    ProfilePage,
};

function AppInner() {
  const { user, loading } = useAuth();
  const [authView, setAuthView] = useState("login"); // login | forgot | signup
  const [tab,      setTab]      = useState("dashboard");

  if (loading) {
    return (
      <div style={{ display:"flex", alignItems:"center", justifyContent:"center", height:"100vh", background:"#f1f5f9", flexDirection:"column", gap:16, fontFamily:"'DM Sans',sans-serif" }}>
        <Spinner size={40} />
        <div style={{ color:"#64748b", fontSize:15 }}>Loading Vidyaloka…</div>
      </div>
    );
  }

  if (!user) {
    if (authView === "forgot") return <ForgotPage onBack={() => setAuthView("login")} />;
    if (authView === "signup") return <SignupPage onLogin={() => setAuthView("login")} />;
    return <LoginPage onForgot={() => setAuthView("forgot")} onSignup={() => setAuthView("signup")} />;
  }

  const ActivePage = PAGE_MAP[tab] || DashboardPage;

  return (
    <div style={{ display:"flex", height:"100vh", overflow:"hidden" }}>
      <Sidebar tab={tab} setTab={setTab} />
      <main style={{ flex:1, overflowY:"auto", background:"#f1f5f9" }}>
        <ActivePage />
      </main>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppInner />
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&family=Playfair+Display:wght@700&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        body { font-family: 'DM Sans', sans-serif; }
        @keyframes spin { to { transform: rotate(360deg); } }
        ::-webkit-scrollbar { width: 6px; height: 6px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 3px; }
      `}</style>
    </AuthProvider>
  );
}
